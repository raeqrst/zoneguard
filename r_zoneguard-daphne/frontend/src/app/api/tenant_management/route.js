import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const avatarColors = [
  '#92400e', '#f59e0b', '#dc2626', '#10b981', 
  '#475569', '#6366f1', '#ea580c', '#3b82f6'
];

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'All Tenants';
    const search = searchParams.get('search') || '';

    // Build filter query for Tenant Model
    const whereClause = {};

    if (filter === 'Approved') {
      whereClause.approvalStatus = 'APPROVED';
    } else if (filter === 'Pending') {
      whereClause.approvalStatus = 'PENDING';
    } else if (filter === 'Rejected') {
      whereClause.approvalStatus = 'REJECTED';
    }

    if (search) {
      whereClause.OR = [
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    // Query Tenants and include Lot, Zone, Homeowner (Resident), and Tenant User
    const tenantsData = await prisma.tenant.findMany({
      where: whereClause,
      include: {
        user: true,
        lot: {
          include: {
            zone: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch the primary Homeowner associated with each lot
    const homeownerIds = tenantsData
      .map((t) => t.lot?.homeownerId)
      .filter((id) => id != null);

    const homeowners = await prisma.homeowner.findMany({
      where: { id: { in: homeownerIds } },
      include: { user: true }
    });

    const homeownerMap = new Map();
    homeowners.forEach((ho) => {
      homeownerMap.set(ho.id, ho);
    });

    // Format data to match Figma UI structure
    const formattedTenants = tenantsData.map((tenant, index) => {
      // 1. Primary Resident (Homeowner of the Lot)
      const hoRecord = tenant.lot?.homeownerId ? homeownerMap.get(tenant.lot.homeownerId) : null;
      const hoUser = hoRecord?.user;
      const residentName = hoUser 
        ? `${hoUser.firstName} ${hoUser.middleName ? hoUser.middleName.charAt(0) + '.' : ''} ${hoUser.lastName}`.trim()
        : 'Unassigned Homeowner';
      const residentInit = hoUser 
        ? `${hoUser.firstName.charAt(0)}${hoUser.lastName.charAt(0)}`.toUpperCase()
        : 'N/A';

      const zoneName = tenant.lot?.zone?.name || 'Zone N/A';
      const residentAddress = tenant.lot?.street 
        ? `${zoneName}, ${tenant.lot.houseNumber || ''} ${tenant.lot.street} St.` 
        : `${zoneName}, Residential Lot`;

      // 2. Tenant Profile
      const tenantUser = tenant.user;
      const tenantName = tenantUser
        ? `${tenantUser.firstName} ${tenantUser.lastName}`.trim()
        : 'Pending Tenant Registration';
      const tenantEmail = tenantUser?.email || 'No email registered';
      const tenantInit = tenantUser
        ? `${tenantUser.firstName.charAt(0)}${tenantUser.lastName.charAt(0)}`.toUpperCase()
        : 'TN';

      // 3. Status Mapping (Figma displays "Active", "Approved", "Pending", or "Rejected")
      let uiStatus = 'Pending';
      let statusTone = 'yellow'; // yellow, green, red

      if (tenant.approvalStatus === 'APPROVED') {
        if (tenant.delegationStatus === 'ACTIVE') {
          uiStatus = 'Active';
          statusTone = 'green';
        } else {
          uiStatus = 'Approved';
          statusTone = 'green';
        }
      } else if (tenant.approvalStatus === 'REJECTED') {
        uiStatus = 'Rejected';
        statusTone = 'red';
      }

      // Executive Action button is interactive (Green) for Pending or actionable items
      const canUpdate = uiStatus === 'Pending' || uiStatus === 'Rejected';

      return {
        id: tenant.id,
        lotId: tenant.lotId,
        resident: {
          name: residentName,
          address: residentAddress,
          init: residentInit,
          bgColor: avatarColors[index % avatarColors.length]
        },
        tenant: {
          name: tenantName,
          email: tenantEmail,
          init: tenantInit,
          bgColor: avatarColors[(index + 4) % avatarColors.length]
        },
        status: uiStatus,
        statusTone: statusTone,
        canUpdate: canUpdate
      };
    });

    return NextResponse.json({
      success: true,
      tenants: formattedTenants
    });
  } catch (error) {
    console.error('Error fetching tenant management data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tenant records' }, { status: 500 });
  }
}

// Optional PATCH endpoint to handle "Update" button approvals
export async function PATCH(request) {
  try {
    const { tenantId, lotId, status } = await request.json();
    
    const updatedTenant = await prisma.tenant.update({
      where: {
        id_lotId: {
          id: tenantId,
          lotId: lotId
        }
      },
      data: {
        approvalStatus: status, // 'APPROVED' or 'REJECTED'
        approvedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, tenant: updatedTenant });
  } catch (error) {
    console.error('Error updating tenant status:', error);
    return NextResponse.json({ success: false, error: 'Failed to update tenant' }, { status: 500 });
  }
}