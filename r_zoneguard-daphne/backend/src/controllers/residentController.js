const prisma = require('../config/db');

exports.getResidents = async (req, res) => {
  try {
    const type = req.query.type || "All Residents";
    const zone = req.query.zone || "";
    const search = req.query.search || "";
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = {
      systemRole: {
        in: ["HOMEOWNER", "TENANT"],
      },
    };

    if (type === "Tenants") {
      where.systemRole = "TENANT";
    } else if (type === "Homeowners") {
      where.systemRole = "HOMEOWNER";
    }

    if (zone) {
      const cleanZone = zone.replace(/zone/gi, "").trim();
      where.zone = {
        name: {
          contains: cleanZone,
          mode: "insensitive",
        },
      };
    }

    // Global Search (Handles top search bar and table search inputs)
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      include: {
        zone: true,
        tenants: {
          include: { lot: { include: { zone: true } } },
        },
        homeowners: true,
      },
      orderBy: { lastName: "asc" },
      skip: skip,
      take: limit,
    });

    const usersWithLots = await Promise.all(
      users.map(async (user) => {
        let lot = user.tenants?.[0]?.lot || null;

        if (!lot && user.homeowners && user.homeowners.length > 0) {
          for (const hw of user.homeowners) {
            const foundLot = await prisma.lot.findFirst({
              where: { homeownerId: hw.id },
              include: { zone: true }
            });
            if (foundLot) {
              lot = foundLot;
              break;
            }
          }
        }
        return { ...user, resolvedLot: lot };
      })
    );

    const totalCount = await prisma.user.count({ where });
    const totalPages = Math.ceil(totalCount / limit);

    const totalTenants = await prisma.user.count({
      where: { systemRole: "TENANT" },
    });

    const totalHomeowners = await prisma.user.count({
      where: { systemRole: "HOMEOWNER" },
    });

    const colors = [
      "#92400e", "#d97706", "#475569", "#dc2626", 
      "#78350f", "#ea580c", "#b91c1c", "#059669"
    ];

    const residents = usersWithLots.map((user, index) => {
      const lot = user.resolvedLot;

      const firstName = user.firstName || '';
      const middleName = user.middleName || '';
      const lastName = user.lastName || '';
      const middleInitial = middleName ? middleName[0] + "." : "";

      const fullName = `${lastName}, ${firstName} ${middleInitial}`.trim();
      const fullNamedb = `${lastName}, ${firstName} ${middleName}`.trim();
      const init = `${firstName[0] || 'R'}${lastName[0] || 'S'}`.toUpperCase();
      const roleUpper = (user.systemRole || '').toUpperCase();

      const rawZoneName = user.zone?.name || lot?.zone?.name || 'Zone 3';
      const cleanZoneNum = rawZoneName.replace(/zone/gi, "").replace(/nia village.*/gi, "").replace(/nia subdivision.*/gi, "").trim();
      const zoneDisplay = cleanZoneNum ? `Zone ${cleanZoneNum}` : 'Zone 3';

      const houseNo = lot?.houseNo || lot?.house_no || lot?.houseNumber || '';
      const blockNum = lot?.blockNumber || lot?.block_number || lot?.block || '';
      const lotNum = lot?.lotNumber || lot?.lot_number || lot?.lot || '';
      let streetName = lot?.street || '';

      if (streetName && !streetName.toLowerCase().match(/(street|st\.?|lane|ln\.?|drive|dr\.?|avenue|ave\.?|road|rd\.?|tria)$/)) {
        streetName = `${streetName} Street`;
      }

      let locationDetail = '';
      if (houseNo) {
        locationDetail = houseNo;
      } else if (blockNum || lotNum) {
        const b = blockNum ? `Blk ${blockNum}` : '';
        const l = lotNum ? `Lot ${lotNum}` : '';
        locationDetail = `${b} ${l}`.trim();
      }

      const combinedStreet = `${locationDetail} ${streetName}`.trim();
      const tableAddress = combinedStreet ? `${zoneDisplay}, NIA Subdivision, ${combinedStreet}` : `${zoneDisplay}, NIA Subdivision`;

      const rawPhone = user.phoneNumber || user.phone || user.mobileNumber || user.contactNumber || 'No phone';
      const cleanPhone = rawPhone === 'No phone' ? 'No phone' : rawPhone.replace(/^\+?63/, '').replace(/^0/, '').trim();

      const standing = (lot?.standing || '').toUpperCase();
      const isDelinquentFlag = lot?.isDelinquent || false;
      const hasArrearsOrDispute = ["WITH_ARREARS", "IN_DISPUTE", "DELINQUENT", "UNPAID"].includes(standing) || isDelinquentFlag;

      // Strict Election Eligibility Rules
      let electionStatus = "Eligible";
      let electionTone = "green";

      if (roleUpper === "HOMEOWNER") {
        const strictIneligibleStandings = ["WITH_ARREARS", "IN_DISPUTE", "DELINQUENT"];
        if (strictIneligibleStandings.includes(standing) || isDelinquentFlag) {
          electionStatus = "Not Eligible";
          electionTone = "red";
        }
      } else {
        electionStatus = "Not Eligible";
        electionTone = "red";
      }

      return {
        id: user.id,
        name: fullName,
        fullNamedb: fullNamedb,
        init: init,
        bgColor: colors[index % colors.length],
        address: tableAddress,
        election: electionStatus,
        electionTone: electionTone,
        isAtRisk: hasArrearsOrDispute,
        risk_status: hasArrearsOrDispute ? "High Risk" : "Low Risk",
        email: user.email || "No email",
        phone: cleanPhone,
        type: roleUpper === "TENANT" ? "Tenant" : "Homeowner",
        typeTone: roleUpper === "TENANT" ? "light-green" : "dark-green",
        houseNo: houseNo,
        block: blockNum,
        lot: lotNum,
        zone: zoneDisplay,
        street: streetName
      };
    });

    return res.json({
      success: true,
      stats: { totalTenants, totalHomeowners },
      totalPages,
      currentPage: page,
      residents,
    });

  } catch (err) {
    console.error('--> Resident Fetch Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

// ==========================================
// ADD NEW RESIDENT (CONNECTED TO DB)
// ==========================================
exports.addResident = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      phoneNumber,
      email,
      houseNo,
      block,
      lotNumber,
      zone,
      street,
      systemRole = "HOMEOWNER"
    } = req.body;

    if (!firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        error: "First name, last name, and email are required.",
      });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "A user with this email address already exists in the database.",
      });
    }

    let zoneRecord = null;
    if (zone) {
      const cleanZoneName = zone.toLowerCase().includes('zone') ? zone : `Zone ${zone}`;
      zoneRecord = await prisma.zone.findFirst({
        where: { name: { contains: cleanZoneName.replace(/zone/gi, '').trim(), mode: 'insensitive' } }
      });
      if (!zoneRecord) {
        zoneRecord = await prisma.zone.create({
          data: { name: cleanZoneName }
        });
      }
    }

    const newUser = await prisma.user.create({
      data: {
        firstName,
        middleName: middleName || null,
        lastName,
        email,
        phoneNumber: phoneNumber ? phoneNumber.replace(/^\+?63/, '') : null,
        systemRole: systemRole.toUpperCase(),
        status: "ACTIVE",
        password: "defaultPassword123",
        zoneId: zoneRecord ? zoneRecord.id : null,
      },
    });

    let homeownerRecord = null;
    if (systemRole.toUpperCase() === "HOMEOWNER") {
      homeownerRecord = await prisma.homeowner.create({
        data: {
          userId: newUser.id,
        },
      });
    }

    if (houseNo || block || lotNumber || street) {
      await prisma.lot.create({
        data: {
          houseNo: houseNo || null,
          blockNumber: block || null,
          lotNumber: lotNumber || null,
          street: street || null,
          zoneId: zoneRecord ? zoneRecord.id : null,
          homeownerId: homeownerRecord ? homeownerRecord.id : null,
          standing: "PAID",
          isDelinquent: false,
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: "Resident added successfully and saved to the database!",
      user: newUser,
    });

  } catch (err) {
    console.error('--> Add Resident Error:', err);
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};