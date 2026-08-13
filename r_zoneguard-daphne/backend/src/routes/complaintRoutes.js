const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categoryConfig = {
  'SPORTS': { label: 'Sport', color: '#FFBAE0' },
  'SPORT': { label: 'Sport', color: '#FFBAE0' },
  'PUBLIC RELATIONS': { label: 'Public Relations', color: '#BAE3F5' },
  'PUBLIC_RELATIONS': { label: 'Public Relations', color: '#BAE3F5' },
  'BEAUTIFICATION': { label: 'Beautification', color: '#B6A7C8' },
  'FINANCIAL': { label: 'Financial', color: '#FBBF24' },
  'GRIEVANCES': { label: 'Grievance', color: '#FFDAD6' },
  'GRIEVANCE': { label: 'Grievance', color: '#FFDAD6' },
  'INFRASTRUCTURE': { label: 'Infrastructure', color: '#BAF5CA' }
};

const formatResidentAddress = (rawZoneName, lot) => {
  const cleanZoneNum = (rawZoneName || 'Zone 3').replace(/zone/gi, "").replace(/nia village.*/gi, "").replace(/nia subdivision.*/gi, "").trim();
  const zoneDisplay = cleanZoneNum ? `Zone ${cleanZoneNum}` : 'Zone 3';

  const houseNo = lot?.houseNo || lot?.house_no || lot?.houseNumber || '';
  const blockNum = lot?.blockNumber || lot?.block_number || lot?.block || '';
  const lotNum = lot?.lotNumber || lot?.lot_number || lot?.lot || '';
  let streetName = lot?.street || '';

  if (streetName && streetName.toLowerCase() !== 'nan') {
    streetName = streetName.replace(/^["']|["']$/g, '').trim();
    if (streetName && !streetName.toLowerCase().match(/(street|st\.?|lane|ln\.?|drive|dr\.?|avenue|ave\.?|road|rd\.?|tria)$/)) {
      streetName = `${streetName} Street`;
    }
  } else {
    streetName = '';
  }

  let locationDetail = '';
  const cleanHouse = houseNo && houseNo.toLowerCase() !== 'nan' ? houseNo.replace(/^["']|["']$/g, '').trim() : '';
  const cleanBlock = blockNum && blockNum.toLowerCase() !== 'nan' ? blockNum.replace('.0', '').trim() : '';
  const cleanLot = lotNum && lotNum.toLowerCase() !== 'nan' ? lotNum.replace('.0', '').trim() : '';

  if (cleanHouse) {
    locationDetail = cleanHouse;
  } else if (cleanBlock || cleanLot) {
    const b = cleanBlock ? `Blk ${cleanBlock}` : '';
    const l = cleanLot ? `Lot ${cleanLot}` : '';
    locationDetail = [b, l].filter(Boolean).join(' ');
  }

  const addressParts = [locationDetail, streetName].filter(item => item && item.toLowerCase() !== 'nan');
  const combinedStreet = addressParts.join(', ');

  return combinedStreet 
    ? `${zoneDisplay}, NIA Subdivision, ${combinedStreet}` 
    : `${zoneDisplay}, NIA Subdivision`;
};

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const { category, zone, search } = req.query;
    let whereClause = {};

    if (category && category !== 'All Complaints') {
      if (category.toLowerCase() === 'resolved') {
        whereClause.status = 'RESOLVED';
      } else {
        const formattedCat = category.toUpperCase().replace(/\s+/g, '_');
        whereClause.complaintCategory = {
          contains: formattedCat,
          mode: 'insensitive',
        };
      }
    }

    if (zone) {
      whereClause.user = {
        is: { zone: { name: { contains: zone, mode: 'insensitive' } } }
      };
    }

    if (search) {
      whereClause.OR = [
        { complaintSubject: { contains: search, mode: 'insensitive' } },
        { complaintDesc: { contains: search, mode: 'insensitive' } },
        { id: { contains: search, mode: 'insensitive' } },
        { user: { firstName: { contains: search, mode: 'insensitive' } } },
        { user: { lastName: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const complaints = await prisma.complaint.findMany({
      where: whereClause,
      include: {
        user: { 
          include: { 
            zone: true,
            tenants: { include: { lot: { include: { zone: true } } } },
            homeowners: true
          } 
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    const complaintsWithLots = await Promise.all(
      complaints.map(async (c) => {
        const user = c.user;
        let lot = user?.tenants?.[0]?.lot || null;

        if (!lot && user?.homeowners && user.homeowners.length > 0) {
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
        return { ...c, resolvedLot: lot };
      })
    );

    const formatted = complaintsWithLots.map((c, index) => {
      const user = c.user;
      const lot = c.resolvedLot;

      const firstName = user?.firstName || '';
      const lastName = user?.lastName || 'Resident';
      const fullName = `${firstName} ${lastName}`.trim();
      const initials = `${firstName[0] || 'R'}${lastName[0] || 'S'}`.toUpperCase();
      
      const colors = ['#1e1b4b', '#064e3b', '#7c2d12', '#1e3a8a', '#581c87', '#d97706'];
      const bgColor = colors[index % colors.length];

      const rawZoneName = user?.zone?.name || lot?.zone?.name || 'Zone 3';
      const finalAddress = formatResidentAddress(rawZoneName, lot);

      let urgencyScore = 5;
      if (c.status === 'ESCALATED') urgencyScore += 6;
      if (c.status === 'ACTIVE') urgencyScore += 4;
      const upperCat = (c.complaintCategory || '').toUpperCase();
      if (upperCat.includes('FINANCIAL') || upperCat.includes('GRIEVANCE')) urgencyScore += 3;
      if (upperCat.includes('INFRASTRUCTURE')) urgencyScore += 2;
      const priorityScore = Math.min(15, Math.max(1, urgencyScore));

      const catKey = (c.complaintCategory || '').toUpperCase();
      const catMeta = categoryConfig[catKey] || { label: c.complaintCategory || 'General', color: '#E2E8F0' };

      return {
        ticket_id: c.id,
        name: fullName,
        address: finalAddress,
        complaint_category: catMeta.label,
        category_color: catMeta.color,
        complaint_status: c.status,
        priority_score: priorityScore,
        complaint_subject: c.complaintSubject,
        complaint_desc: c.complaintDesc,
        date_filled: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '4/5/2026',
        bgColor: bgColor,
        init: initials,
        evidence: c.evidence || []
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error('API Complaints Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// GET single complaint
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const c = await prisma.complaint.findUnique({
      where: { id },
      include: { 
        user: { 
          include: { 
            zone: true,
            tenants: { include: { lot: { include: { zone: true } } } },
            homeowners: true
          } 
        } 
      },
    });

    if (!c) return res.status(404).json({ error: 'Complaint not found' });

    const user = c.user;
    let lot = user?.tenants?.[0]?.lot || null;

    if (!lot && user?.homeowners && user.homeowners.length > 0) {
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

    const firstName = user?.firstName || '';
    const lastName = user?.lastName || 'Resident';
    const fullName = `${firstName} ${lastName}`.trim();
    
    const rawZoneName = user?.zone?.name || lot?.zone?.name || 'Zone 3';
    const finalAddress = formatResidentAddress(rawZoneName, lot);

    const catKey = (c.complaintCategory || '').toUpperCase();
    const catMeta = categoryConfig[catKey] || { label: c.complaintCategory || 'General', color: '#E2E8F0' };

    return res.status(200).json({
      ticket_id: c.id,
      subject: c.complaintSubject,
      description: c.complaintDesc,
      uploaded_by: fullName,
      address: finalAddress,
      date_filled: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '4/5/2026',
      status: c.status,
      category: catMeta.label,
      category_color: catMeta.color,
      evidence: c.evidence || []
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.complaint.update({
      where: { id },
      data: { status: status ? status.toUpperCase() : 'RESOLVED' }
    });
    return res.status(200).json({ success: true, updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/escalate', async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, director } = req.body;
    const updated = await prisma.complaint.update({
      where: { id },
      data: { status: 'ESCALATED', escalationReason: reason, assignedDirector: director }
    });
    return res.status(200).json({ success: true, updated });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});
=======
const complaintController = require('../controllers/complaintController');

const router = express.Router();

// GET /api/complaints
router.get('/', complaintController.getAllComplaints);

// POST /api/complaints
router.post('/', complaintController.createComplaint);

// PATCH /api/complaints/:id/status
router.patch('/:id/status', complaintController.updateComplaintStatus);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

module.exports = router;