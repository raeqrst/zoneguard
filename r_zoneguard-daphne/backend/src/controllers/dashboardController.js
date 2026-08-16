// backend/src/controllers/dashboardController.js
const prisma = require('../config/db');

// Map Category Config
const CATEGORY_MAP = {
    'INFRASTRUCTURE': { label: 'INFRASTRUCTURE', color: '#b6f0c2' },
    'FINANCIAL': { label: 'FINANCIAL', color: '#f7ba1e' },
    'PUBLIC_RELATIONS': { label: 'PUBLIC_RELATIONS', color: '#f3c64e' },
    'PUBLIC RELATIONS': { label: 'PUBLIC_RELATIONS', color: '#f3c64e' },
    'SPORTS': { label: 'SPORTS', color: '#f48fb1' },
    'SPORT': { label: 'SPORTS', color: '#f48fb1' },
    'BEAUTIFICATION': { label: 'BEAUTIFICATION', color: '#b8aedf' },
    'GRIEVANCES': { label: 'GRIEVANCES', color: '#f9d6cf' },
    'GRIEVANCE': { label: 'GRIEVANCES', color: '#f9d6cf' }
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

// ==========================================
// 1. ADMIN DASHBOARD
// ==========================================
exports.getAdminDashboard = async (req, res) => {
    try {
        const currentYear = 2026;

        // Fetch Transactions from PostgreSQL
        const verifiedTransactions = await prisma.transaction.findMany({
            where: {
                paymentCategory: 'MONTHLY_DUES',
                paymentStatus: { in: ['VERIFIED', 'COMPLETED'] },
                transactionDate: {
                    gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                    lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                }
            },
            select: { id: true, transactionDate: true, userId: true, billingId: true }
        }).catch(() => []);

        const monthlyPaidMap = {};
        verifiedTransactions.forEach((trx) => {
            const trxDate = new Date(trx.transactionDate);
            const m = trxDate.getUTCMonth() + 1;
            if (m >= 1 && m <= 12) {
                if (!monthlyPaidMap[m]) monthlyPaidMap[m] = new Set();
                const itemIdentifier = trx.billingId || trx.id || trx.userId;
                if (itemIdentifier) monthlyPaidMap[m].add(itemIdentifier);
            }
        });

        const paidOverview = MONTHS.map((monthLabel, index) => ({
            month: monthLabel,
            value: monthlyPaidMap[index + 1] ? monthlyPaidMap[index + 1].size : 0
        }));

        // Tenant Turnover
        const tenantRecords = await prisma.tenant.findMany({
            where: { approvalStatus: 'APPROVED', userId: { not: null } },
            select: { userId: true, createdAt: true, approvedAt: true, updatedAt: true, delegationStatus: true }
        }).catch(() => []);

        const moveInCounts = Array(12).fill(0);
        const moveOutCounts = Array(12).fill(0);
        const userFirstMoveInMonth = new Map();
        const userFirstMoveOutMonth = new Map();

        tenantRecords.forEach((tenant) => {
            const uid = tenant.userId;
            if (!uid) return;

            const moveInDate = tenant.approvedAt || tenant.createdAt;
            if (moveInDate) {
                const date = new Date(moveInDate);
                if (date.getUTCFullYear() === currentYear) {
                    const monthIdx = date.getUTCMonth();
                    if (!userFirstMoveInMonth.has(uid) || monthIdx < userFirstMoveInMonth.get(uid)) {
                        userFirstMoveInMonth.set(uid, monthIdx);
                    }
                }
            }

            if (['REVOKED', 'INACTIVE'].includes(tenant.delegationStatus)) {
                const moveOutDate = tenant.updatedAt || tenant.createdAt;
                if (moveOutDate) {
                    const date = new Date(moveOutDate);
                    if (date.getUTCFullYear() === currentYear) {
                        const monthIdx = date.getUTCMonth();
                        if (!userFirstMoveOutMonth.has(uid) || monthIdx < userFirstMoveOutMonth.get(uid)) {
                            userFirstMoveOutMonth.set(uid, monthIdx);
                        }
                    }
                }
            }
        });

        userFirstMoveInMonth.forEach((monthIdx) => { if (monthIdx >= 0 && monthIdx < 12) moveInCounts[monthIdx]++; });
        userFirstMoveOutMonth.forEach((monthIdx) => { if (monthIdx >= 0 && monthIdx < 12) moveOutCounts[monthIdx]++; });

        const tenantTurnover = MONTHS.map((monthLabel, idx) => ({
            month: monthLabel,
            moveIn: moveInCounts[idx],
            moveOut: moveOutCounts[idx]
        }));

        // Metrics
        const [pendingTenants, openComplaints, totalOccupiedLots, complaintsGrouped] = await Promise.all([
            prisma.tenant.count({ where: { approvalStatus: 'PENDING' } }).catch(() => 0),
            prisma.complaint.count({ where: { status: { in: ['ACTIVE', 'INVESTIGATING', 'ESCALATED', 'PENDING', 'IN_PROGRESS'] } } }).catch(() => 0),
            prisma.lot.count({ where: { occupied: true } }).catch(() => 0),
            prisma.complaint.groupBy({ by: ['complaintCategory'], _count: { id: true } }).catch(() => [])
        ]);

        const activeMonths = Object.keys(monthlyPaidMap).map(Number).filter(m => monthlyPaidMap[m] && monthlyPaidMap[m].size > 0);
        const latestActiveMonth = activeMonths.length > 0 ? Math.max(...activeMonths) : 1;
        const currentMonthPaidCount = monthlyPaidMap[latestActiveMonth] ? monthlyPaidMap[latestActiveMonth].size : 0;
        const collectionRate = totalOccupiedLots > 0 ? Number(((currentMonthPaidCount / totalOccupiedLots) * 100).toFixed(1)) : 0.0;

        // Resolution Time
        const resolvedComplaints = await prisma.complaint.findMany({
            where: { status: 'RESOLVED' },
            select: { createdAt: true, updatedAt: true }
        }).catch(() => []);

        let avgResolution = "0.0 days";
        if (resolvedComplaints.length > 0) {
            const totalMs = resolvedComplaints.reduce((acc, item) => acc + Math.max(0, new Date(item.updatedAt) - new Date(item.createdAt)), 0);
            avgResolution = `${(totalMs / resolvedComplaints.length / (1000 * 60 * 60 * 24)).toFixed(1)} days`;
        }

        // Issue Categories
        const issueCategories = complaintsGrouped.map((item) => {
            const rawCategory = (item.complaintCategory || 'UNCATEGORIZED').toUpperCase().trim();
            const mappedConfig = CATEGORY_MAP[rawCategory] || { label: rawCategory, color: '#cccccc' };
            return { label: mappedConfig.label, value: item._count.id, color: mappedConfig.color };
        });

        const payload = {
            pendingTenants, openComplaints, collectionRate, avgResolution,
            issueCategories, paidOverview, turnover: tenantTurnover,
            tenantTurnover, turnoverRate: tenantTurnover, tenant_turnover: tenantTurnover
        };

        return res.status(200).json({ success: true, data: payload, ...payload });
    } catch (error) {
        console.error("Admin Dashboard Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// Alias for backwards compatibility
exports.getDashboardData = exports.getAdminDashboard;

// ==========================================
// 2. DIRECTOR DASHBOARD
// ==========================================
exports.getDirectorDashboard = async (req, res) => {
    try {
        const pendingApprovals = await prisma.tenant.count({ where: { approvalStatus: "PENDING" } });
        const openComplaints = await prisma.complaint.count({ where: { NOT: { status: "RESOLVED" } } });
        const paidResidents = await prisma.accountsReceivable.count({ where: { billingStatus: "PAID" } });
        
        const totalResidents = (await prisma.homeowner.count()) + (await prisma.tenant.count());
        const paidPercentage = totalResidents === 0 ? 0 : ((paidResidents / totalResidents) * 100).toFixed(1);

        const metrics = [
            { label: "Pending Approvals", value: pendingApprovals, detail: `${pendingApprovals} awaiting review`, tone: "green", icon: "◌" },
            { label: "Open Complaints", value: openComplaints, detail: "Current unresolved complaints", tone: "red", icon: "⚠" },
            { label: "Paid Residents", value: `${paidPercentage}%`, detail: "Collection compliance", tone: "blue", icon: "◎" },
            { label: "Average Resolution", value: "Live", detail: "Calculated from complaints", tone: "purple", icon: "◔" }
        ];

        // Issue Categories
        const complaintGroups = await prisma.complaint.groupBy({
            by: ["complaintCategory"],
            _count: true
        });

        const colors = ["#b6f0c2", "#f9d6cf", "#f7ba1e", "#b8aedf", "#aadff4", "#88d8b0", "#f48fb1"];
        const issueCategories = complaintGroups.map((item, index) => ({
            label: item.complaintCategory,
            value: item._count,
            color: colors[index % colors.length]
        }));

        // Complaints Per Zone
        const zones = await prisma.zone.findMany({
            include: {
                users: {
                    include: { complaints: true }
                }
            }
        });

        const complaintOverview = zones.map(zone => {
            let total = 0;
            zone.users.forEach(user => { total += user.complaints.length; });
            return { zone: zone.name, value: total };
        });

        // Tenant Turnover (2026)
        const turnover = [];
        for (let month = 0; month < 12; month++) {
            const start = new Date(2026, month, 1);
            const end = new Date(2026, month + 1, 1);
            const moveIn = await prisma.tenant.count({
                where: { createdAt: { gte: start, lt: end } }
            });
            turnover.push({
                month: start.toLocaleString("default", { month: "short" }),
                moveIn,
                moveOut: 0
            });
        }

        return res.status(200).json({
            success: true,
            metrics,
            issueCategories,
            complaintOverview,
            turnover
        });
    } catch (err) {
        console.error("Director Dashboard Error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

// Stubs for extra endpoints
exports.getTenantTurnover = async (req, res) => exports.getAdminDashboard(req, res);
exports.getComplaintForecast = async (req, res) => res.status(200).json({ success: true, data: [] });
exports.getFinancialForecast = async (req, res) => res.status(200).json({ success: true, data: [] });