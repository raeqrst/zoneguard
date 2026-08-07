const prisma = require('../config/db');

// Get all tenants with filters and search
const getTenants = async (req, res) => {
    try {
        const { filter, search } = req.query;

        let whereClause = {};

        if (filter && filter !== 'All Tenants') {
            const statusMap = {
                'Approved': 'APPROVED',
                'Pending': 'PENDING',
                'Rejected': 'REJECTED',
                'Active': 'APPROVED'
            };
            if (statusMap[filter]) {
                whereClause.approvalStatus = statusMap[filter];
            }
        }

        if (search) {
            // Find homeowner IDs whose user details match the search query
            let homeownerIds = [];
            try {
                const matchingHomeowners = await prisma.homeowner.findMany({
                    where: {
                        user: {
                            OR: [
                                { firstName: { contains: search, mode: 'insensitive' } },
                                { lastName: { contains: search, mode: 'insensitive' } },
                                { email: { contains: search, mode: 'insensitive' } }
                            ]
                        }
                    },
                    select: { id: true }
                });
                homeownerIds = matchingHomeowners.map(h => h.id);
            } catch (e) {
                // Fallback if homeowner search fails
            }

            whereClause.OR = [
                // 1. Search Tenant's User info
                {
                    user: {
                        OR: [
                            { firstName: { contains: search, mode: 'insensitive' } },
                            { lastName: { contains: search, mode: 'insensitive' } },
                            { email: { contains: search, mode: 'insensitive' } }
                        ]
                    }
                },
                // 2. Search Lot details & Resident/Homeowner ID match
                {
                    lot: {
                        OR: [
                            { houseNumber: { contains: search, mode: 'insensitive' } },
                            { street: { contains: search, mode: 'insensitive' } },
                            ...(homeownerIds.length > 0 ? [{ homeownerId: { in: homeownerIds } }] : [])
                        ]
                    }
                }
            ];
        }

        const tenants = await prisma.tenant.findMany({
            where: whereClause,
            include: {
                user: true,
                lot: {
                    include: {
                        zone: true
                    }
                },
                approvedBy: true
            },
            orderBy: { createdAt: 'desc' }
        });

        const formattedTenants = await Promise.all(tenants.map(async (t) => {
            const tenantUser = t.user;
            const lot = t.lot;

            let homeownerUser = null;
            if (lot && lot.homeownerId) {
                const homeowner = await prisma.homeowner.findUnique({
                    where: { id: lot.homeownerId },
                    include: { user: true }
                }).catch(() => null);
                homeownerUser = homeowner?.user;
            }

            const homeownerFirstName = homeownerUser?.firstName || 'Homeowner';
            const homeownerLastName = homeownerUser?.lastName || 'Resident';
            const homeownerInitials = `${homeownerFirstName[0] || ''}${homeownerLastName[0] || ''}`.toUpperCase();

            const tenantFirstName = tenantUser?.firstName || 'Unknown';
            const tenantLastName = tenantUser?.lastName || 'Tenant';
            const tenantInitials = `${tenantFirstName[0] || ''}${tenantLastName[0] || ''}`.toUpperCase();

            let statusTone = 'yellow';
            let statusLabel = 'Pending';
            if (t.approvalStatus === 'APPROVED') {
                statusTone = 'green';
                statusLabel = 'Approved';
            } else if (t.approvalStatus === 'REJECTED') {
                statusTone = 'red';
                statusLabel = 'Rejected';
            }

            return {
                id: t.id,
                lotId: t.lotId,
                status: statusLabel,
                statusTone: statusTone,
                canUpdate: t.approvalStatus === 'PENDING',
                homeowner: {
                    fullName: `${homeownerFirstName} ${homeownerLastName}`,
                    email: homeownerUser?.email || '',
                    contactNumber: homeownerUser?.contactNumber || homeownerUser?.phone || ''
                },
                tenantInfo: {
                    fullName: `${tenantFirstName} ${tenantLastName}`,
                    email: tenantUser?.email || '',
                    contactNumber: tenantUser?.contactNumber || tenantUser?.phone || ''
                },
                propertyAddress: {
                    houseNo: lot?.houseNumber || 'n/a',
                    block: lot?.blockNumber || 'n/a',
                    lot: lot?.lotNumber || 'n/a',
                    zone: lot?.zone?.name || lot?.zoneId || 'n/a',
                    street: lot?.street || 'n/a'
                },
                resident: {
                    name: `${homeownerFirstName} ${homeownerLastName}`,
                    address: lot?.houseNumber ? `${lot.houseNumber} ${lot?.street || ''}` : `Lot ${lot?.lotNumber || ''} ${lot?.street || ''}`.trim(),
                    email: homeownerUser?.email || '',
                    init: homeownerInitials,
                    bgColor: '#065F46'
                },
                tenant: {
                    name: `${tenantFirstName} ${tenantLastName}`,
                    email: tenantUser?.email || '',
                    bgColor: '#3b82f6',
                    init: tenantInitials
                }
            };
        }));

        res.json({ success: true, tenants: formattedTenants });
    } catch (err) {
        console.error('Error fetching tenants with Prisma:', err);
        res.status(500).json({ success: false, message: 'Server error while fetching tenants' });
    }
};

// Update tenant status
const updateTenantStatus = async (req, res) => {
    try {
        const { tenantId, lotId, status, description } = req.body;
        const prismaStatus = status ? status.toUpperCase() : 'PENDING';

        const updatedTenant = await prisma.tenant.update({
            where: {
                id_lotId: {
                    id: tenantId,
                    lotId: lotId
                }
            },
            data: {
                approvalStatus: prismaStatus,
                canProcessPayment: true
            }
        });

        res.json({ success: true, message: 'Tenant status updated successfully', tenant: updatedTenant });
    } catch (err) {
        console.error('Error updating tenant status with Prisma:', err);
        res.status(500).json({ success: false, message: 'Server error while updating tenant status' });
    }
};

module.exports = {
    getTenants,
    updateTenantStatus
};