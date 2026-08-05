const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

exports.getDashboard = async (req, res) => {
    try {
        

        const pendingApprovals = await prisma.tenant.count({
            where: {
                approvalStatus: "PENDING"
            }
        });

        const openComplaints = await prisma.complaint.count({
            where: {
                NOT: {
                    status: "RESOLVED"
                }
            }
        });

        const paidResidents = await prisma.accountsReceivable.count({
            where: {
                billingStatus: "PAID"
            }
        });

        const totalResidents =
            await prisma.homeowner.count() +
            await prisma.tenant.count();

        const paidPercentage =
            totalResidents === 0
                ? 0
                : ((paidResidents / totalResidents) * 100).toFixed(1);

        const metrics = [
            {
                label: "Pending Approvals",
                value: pendingApprovals,
                detail: `${pendingApprovals} awaiting review`,
                tone: "green",
                icon: "◌"
            },
            {
                label: "Open Complaints",
                value: openComplaints,
                detail: "Current unresolved complaints",
                tone: "red",
                icon: "⚠"
            },
            {
                label: "Paid Residents",
                value: `${paidPercentage}%`,
                detail: "Collection compliance",
                tone: "blue",
                icon: "◎"
            },
            {
                label: "Average Resolution",
                value: "Live",
                detail: "Calculated from complaints",
                tone: "purple",
                icon: "◔"
            }
        ];

        // ==========================
        // ISSUE CATEGORIES
        // ==========================

        const complaintGroups =
            await prisma.complaint.groupBy({
                by: ["complaintCategory"],
                _count: true
            });

        const colors = [
            "#b6f0c2",
            "#f9d6cf",
            "#f7ba1e",
            "#b8aedf",
            "#aadff4",
            "#88d8b0",
            "#f48fb1"
        ];

        const issueCategories = complaintGroups.map((item, index) => ({
            label: item.complaintCategory,
            value: item._count,
            color: colors[index % colors.length]
        }));

        // ==========================
        // COMPLAINTS PER ZONE
        // ==========================

        const zones = await prisma.zone.findMany({
            include: {
                users: {
                    include: {
                        complaints: true
                    }
                }
            }
        });

        const complaintOverview = zones.map(zone => {

            let total = 0;

            zone.users.forEach(user => {
                total += user.complaints.length;
            });

            return {
                zone: zone.name,
                value: total
            };

        });

        // ==========================
        // TENANT TURNOVER
        // ==========================

        const turnover = [];

        for (let month = 0; month < 12; month++) {

            const start = new Date(2026, month, 1);

            const end = new Date(2026, month + 1, 1);

            const moveIn = await prisma.tenant.count({
                where: {
                    createdAt: {
                        gte: start,
                        lt: end
                    }
                }
            });

            turnover.push({
                month: start.toLocaleString("default", {
                    month: "short"
                }),
                moveIn,
                moveOut: 0
            });

        }

        res.json({
            metrics,
            issueCategories,
            complaintOverview,
            turnover
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }
};