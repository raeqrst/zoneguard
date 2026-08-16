const prisma = require('../config/db');

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
};

const getColorForUser = (userId) => {
    if (!userId) return '#9ca3af';
    const colors = ['#b45309', '#d97706', '#dc2626', '#9ca3af', '#4b5563', '#059669', '#2563eb', '#7c3aed'];
    
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};

const formatAddress = (lot) => {
    if (!lot) return 'Address Unknown';
    
    const numberStr = lot.houseNumber || (lot.lotNumber ? `${lot.lotNumber}` : null);
    
    if (numberStr && lot.street) {
        const streetName = lot.street.toLowerCase().includes('street') || lot.street.toLowerCase().includes('lane') 
            ? lot.street 
            : `${lot.street} Street`;
        return `${numberStr} ${streetName}`;
    }
    
    if (lot.street) return lot.street;
    if (lot.blockNumber && lot.lotNumber) return `Blk ${lot.blockNumber} Lot ${lot.lotNumber}`;
    
    return 'Address Unknown';
};

exports.getVehiclesOverview = async (req, res) => {
    try {
        const { zone: queryZone, search: querySearch } = req.query;

        // 1. Fetch vehicles sorted by vehicle ID ascending (earliest first)
        const vehicles = await prisma.vehicle.findMany({
            orderBy: {
                id: 'asc'
            },
            include: {
                user: {
                    include: {
                        zone: true,
                        homeowners: true,
                        tenants: {
                            include: { lot: true }
                        }
                    }
                }
            }
        });

        const homeownerIds = vehicles
            .filter(v => v.user && v.user.homeowners && v.user.homeowners.length > 0)
            .map(v => v.user.homeowners[0].id);

        const lots = await prisma.lot.findMany({
            where: { homeownerId: { in: homeownerIds } }
        });

        const homeownerLotMap = {};
        lots.forEach(lot => {
            if (lot.homeownerId) homeownerLotMap[lot.homeownerId] = lot;
        });

        const totalVehicles = vehicles.length;
        
        const zoneCounts = {
            "ALL ZONES": totalVehicles,
            "ZONE 1": 0,
            "ZONE 2": 0,
            "ZONE 3": 0,
            "ZONE 4": 0,
            "ZONE 5": 0,
            "ZONE 6": 0
        };
        
        const userMap = {};

        vehicles.forEach(v => {
            const user = v.user || {};
            const fullName = user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : `User ${v.userId}`;
            
            let shortZone = 'ZONE 3'; 
            if (user.zone && user.zone.name) {
                const match = user.zone.name.match(/ZONE\s*\d/i);
                if (match) shortZone = match[0].toUpperCase();
            }
            
            let lot = null;
            if (user.tenants && user.tenants.length > 0) {
                lot = user.tenants[0].lot;
            } else if (user.homeowners && user.homeowners.length > 0) {
                lot = homeownerLotMap[user.homeowners[0].id];
            }

            const addressStr = `Zone 3, NIA Subdivision, ${formatAddress(lot)}`;

            if (zoneCounts[shortZone] !== undefined) {
                zoneCounts[shortZone] += 1;
            } else {
                zoneCounts[shortZone] = 1;
            }

            if (!userMap[v.userId]) {
                userMap[v.userId] = {
                    id: v.userId,
                    name: fullName,
                    initials: getInitials(fullName),
                    color: getColorForUser(v.userId),
                    address: addressStr,
                    count: 0,
                    zone: shortZone,
                    firstVehicleId: v.id // Track earliest registered vehicle ID
                };
            }
            userMap[v.userId].count += 1;
        });

        // Ensure "ALL ZONES" always matches total vehicle count
        zoneCounts["ALL ZONES"] = totalVehicles;

        // 2. Sort resident entries by earliest registered Vehicle ID
        let residentsData = Object.values(userMap).sort((a, b) => 
            a.firstVehicleId.localeCompare(b.firstVehicleId, undefined, { numeric: true, sensitivity: 'base' })
        );

        // 3. Optional Server-Side Zone Filtering
        if (queryZone) {
            const formattedZone = queryZone.trim().toUpperCase();
            if (formattedZone !== 'ALL ZONES' && formattedZone !== 'ALL') {
                residentsData = residentsData.filter(r => r.zone.toUpperCase() === formattedZone);
            }
        }

        // 4. Optional Server-Side Search Filtering
        if (querySearch) {
            const term = querySearch.trim().toLowerCase();
            residentsData = residentsData.filter(r => 
                r.name.toLowerCase().includes(term) || 
                r.address.toLowerCase().includes(term)
            );
        }

        return res.status(200).json({
            totalVehicles,
            zoneCounts,
            residents: residentsData
        });

    } catch (error) {
        console.error("Error fetching vehicle data:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};