const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

exports.getResidents = async (req, res) => {
  try {

    const type = req.query.type || "All Residents";
    const zone = req.query.zone || "";
    const search = req.query.search || "";

    const where = {
      accountStatus: "ACTIVE",
      systemRole: {
        in: ["HOMEOWNER", "TENANT"],
      },
    };

    if (type === "Tenants")
      where.systemRole = "TENANT";

    if (type === "Homeowners")
      where.systemRole = "HOMEOWNER";

    if (zone) {
      where.zone = {
        name: {
          equals: zone,
          mode: "insensitive",
        },
      };
    }

    if (search) {
      where.OR = [
        {
          firstName: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          lastName: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    const users = await prisma.user.findMany({
      where,

      include: {
        zone: true,
        tenants: {
          include: {
            lot: true,
          },
        },
      },

      orderBy: {
        lastName: "asc",
      },
    });

    const totalTenants = await prisma.user.count({
      where: {
        systemRole: "TENANT",
      },
    });

    const totalHomeowners = await prisma.user.count({
      where: {
        systemRole: "HOMEOWNER",
      },
    });

    const colors = [
      "#92400e",
      "#d97706",
      "#475569",
      "#dc2626",
      "#78350f",
      "#ea580c",
      "#b91c1c",
      "#059669",
    ];

    const residents = users.map((user, index) => {

      const lot = user.tenants?.[0]?.lot;

      const fullName =
        `${user.firstName} ${user.middleName ? user.middleName[0] + "." : ""} ${user.lastName}`;

      return {

        id: user.id,

        name: fullName,

        init:
          `${user.firstName[0]}${user.lastName[0]}`.toUpperCase(),

        bgColor:
          colors[index % colors.length],

        address:
          `${user.zone?.name || "Zone"} ${lot?.houseNumber || ""} ${lot?.street || ""}`,

        sticker:
          lot?.isDelinquent ? "Not Eligible" : "Eligible",

        stickerTone:
          lot?.isDelinquent ? "red" : "green",

        election:
          user.systemRole === "HOMEOWNER"
            ? "Eligible"
            : "Not Eligible",

        electionTone:
          user.systemRole === "HOMEOWNER"
            ? "green"
            : "red",

        isAtRisk:
          lot?.isDelinquent || false,

        type:
          user.systemRole === "TENANT"
            ? "Tenant"
            : "Homeowner",

        typeTone:
          user.systemRole === "TENANT"
            ? "light-green"
            : "dark-green",
      };

    });

    res.json({

      success: true,

      stats: {

        totalTenants,

        totalHomeowners,

      },

      residents,

    });

  }

  catch (err) {

    console.error(err);

    res.status(500).json({

      success: false,

      error: err.message,

    });

  }

};