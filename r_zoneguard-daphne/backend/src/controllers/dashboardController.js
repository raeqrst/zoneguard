console.log("🔥 BRAND NEW DASHBOARD CONTROLLER IS RUNNING!");
// backend/src/controllers/dashboardController.js
const prisma = require('../config/db');

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

exports.getDashboardData = async (req, res) => {
    try {
        const currentYear = 2026;

        // 1. Fetch Transactions from PostgreSQL
        const verifiedTransactions = await prisma.transaction.findMany({
            where: {
                paymentCategory: 'MONTHLY_DUES',
                paymentStatus: { in: ['VERIFIED', 'COMPLETED'] },
                transactionDate: {
                    gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                    lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                }
            },
            select: {
                id: true,
                transactionDate: true,
                userId: true,
                billingId: true
            }
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

        // 2. Multi-Lot Tenant Turnover: Group by unique userId to prevent multi-lot inflation
        const tenantRecords = await prisma.tenant.findMany({
            where: {
                approvalStatus: 'APPROVED',
                userId: { not: null }
            },
            select: {
                userId: true,
                createdAt: true,
                approvedAt: true,
                updatedAt: true,
                delegationStatus: true
            }
        }).catch(() => []);

        const moveInCounts = Array(12).fill(0);
        const moveOutCounts = Array(12).fill(0);

        // Track the earliest move-in month for each unique human tenant (userId)
        const userFirstMoveInMonth = new Map();
        const userFirstMoveOutMonth = new Map();

        tenantRecords.forEach((tenant) => {
            const uid = tenant.userId;
            if (!uid) return;

            // Move In: Find earliest approval/creation date across all their lots
            const moveInDate = tenant.approvedAt || tenant.createdAt;
            if (moveInDate) {
                const date = new Date(moveInDate);
                if (date.getUTCFullYear() === currentYear) {
                    const monthIdx = date.getUTCMonth(); // 0 to 11
                    if (!userFirstMoveInMonth.has(uid) || monthIdx < userFirstMoveInMonth.get(uid)) {
                        userFirstMoveInMonth.set(uid, monthIdx);
                    }
                }
            }

            // Move Out: Track unique tenant departures if delegation is revoked/inactive
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

        // Tally unique move-ins per month
        userFirstMoveInMonth.forEach((monthIdx) => {
            if (monthIdx >= 0 && monthIdx < 12) {
                moveInCounts[monthIdx]++;
            }
        });

        // Tally unique move-outs per month
        userFirstMoveOutMonth.forEach((monthIdx) => {
            if (monthIdx >= 0 && monthIdx < 12) {
                moveOutCounts[monthIdx]++;
            }
        });

        const tenantTurnover = MONTHS.map((monthLabel, idx) => ({
            month: monthLabel,
            moveIn: moveInCounts[idx],
            moveOut: moveOutCounts[idx]
        }));

        // 3. Fetch Concurrent Metrics from DB
        const [
            pendingTenants,
            openComplaints,
            totalOccupiedLots,
            complaintsGrouped
        ] = await Promise.all([
            prisma.tenant.count({ where: { approvalStatus: 'PENDING' } }).catch(() => 0),
            prisma.complaint.count({
                where: { status: { in: ['ACTIVE', 'INVESTIGATING', 'ESCALATED', 'PENDING', 'IN_PROGRESS'] } }
            }).catch(() => 0),
            prisma.lot.count({ where: { occupied: true } }).catch(() => 0),
            prisma.complaint.groupBy({
                by: ['complaintCategory'],
                _count: { id: true }
            }).catch(() => [])
        ]);

        const activeMonths = Object.keys(monthlyPaidMap).map(Number).filter(m => monthlyPaidMap[m] && monthlyPaidMap[m].size > 0);
        const latestActiveMonth = activeMonths.length > 0 ? Math.max(...activeMonths) : 1;
        const currentMonthPaidCount = monthlyPaidMap[latestActiveMonth] ? monthlyPaidMap[latestActiveMonth].size : 0;

        const collectionRate = totalOccupiedLots > 0
            ? Number(((currentMonthPaidCount / totalOccupiedLots) * 100).toFixed(1))
            : 0.0;

        // 4. Resolution Time Calculation
        const resolvedComplaints = await prisma.complaint.findMany({
            where: { status: 'RESOLVED' },
            select: { createdAt: true, updatedAt: true }
        }).catch(() => []);

        let avgResolution = "0.0 days";
        if (resolvedComplaints.length > 0) {
            const totalMs = resolvedComplaints.reduce((acc, item) => {
                const diff = new Date(item.updatedAt) - new Date(item.createdAt);
                return acc + Math.max(0, diff);
            }, 0);
            const days = (totalMs / resolvedComplaints.length / (1000 * 60 * 60 * 24)).toFixed(1);
            avgResolution = `${days} days`;
        }

        // 5. Issue Categorization Data
        const issueCategories = complaintsGrouped.map((item) => {
            const rawCategory = (item.complaintCategory || 'UNCATEGORIZED').toUpperCase().trim();
            const mappedConfig = CATEGORY_MAP[rawCategory] || { label: rawCategory, color: '#cccccc' };
            return {
                label: mappedConfig.label,
                value: item._count.id,
                color: mappedConfig.color
            };
        });

       const payload = {
            pendingTenants,
            openComplaints,
            collectionRate,
            avgResolution,
            issueCategories,
            paidOverview,
            turnover: tenantTurnover, 
            tenantTurnover: tenantTurnover,
            turnoverRate: tenantTurnover,
            tenant_turnover: tenantTurnover
        };

        return res.status(200).json({
            success: true,
            data: payload,
            ...payload
        });

    } catch (error) {
        console.error("Dashboard Controller Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.getTenantTurnover = async (req, res) => {
    return exports.getDashboardData(req, res);
};

exports.getComplaintForecast = async (req, res) => {
    return res.status(200).json({ success: true, data: [] });
};

exports.getFinancialForecast = async (req, res) => {
    return res.status(200).json({ success: true, data: [] });
};