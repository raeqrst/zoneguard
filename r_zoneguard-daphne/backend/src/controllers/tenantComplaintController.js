const prisma = require('../config/prisma');

// GET /api/tenant/complaints/:tenantId
const getTenantComplaints = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId;

  console.log('>>> [BACKEND] Fetching complaints for targetId:', targetId);

  try {
    let user = null;
    const userClient = prisma.user || prisma.User;
    if (userClient) {
      const allUsers = await userClient.findMany().catch(() => []);
      user = allUsers.find(u => {
        const uId = u.id || u.userId || u.user_id;
        return uId && targetId && uId.toString().toLowerCase() === targetId.toString().toLowerCase();
      });
    }

    const firstName = user?.firstName || user?.first_name || 'Resident';
    const lastName = user?.lastName || user?.last_name || '';
    const lastNameInitial = lastName ? `${lastName.charAt(0)}.` : '';
    const displayName = `${firstName} ${lastNameInitial}`.trim();
    const initials = `${firstName[0] || 'R'}${lastName[0] || ''}`.toUpperCase();

    let complaints = [];
    const complaintClient = prisma.complaint || prisma.Complaint;
    if (complaintClient && targetId) {
      complaints = await complaintClient.findMany({
        where: {
          userId: targetId
        },
        orderBy: {
          createdAt: 'desc'
        }
      }).catch(err => {
        console.log('>>> [BACKEND] Prisma query error:', err.message);
        return [];
      });
    }

    const formattedComplaints = complaints.map(c => ({
      id: c.id,
      date: c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today',
      subject: c.complaintSubject || c.subject || 'Untitled Complaint',
      category: c.complaintCategory || c.category || 'General',
      status: (c.status || 'Active').toUpperCase(),
      details: c.complaintDesc || c.details || ''
    }));

    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: displayName,
          role: user?.systemRole || user?.system_role || 'TENANT',
          initials: initials
        },
        complaints: formattedComplaints
      }
    });
  } catch (error) {
    console.error('>>> [BACKEND] Error in getTenantComplaints:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/tenant/complaints/:tenantId
const createComplaint = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId || req.body.tenantId || req.body.userId;
  const { subject, category, details, proofUrl } = req.body;

  console.log('>>> [BACKEND] Creating complaint for:', targetId, { subject, category });

  if (!subject || !category || !details) {
    return res.status(400).json({ success: false, message: 'Please provide subject, category, and details.' });
  }

  try {
    let newComplaint = null;
    const complaintClient = prisma.complaint || prisma.Complaint;
    
    if (complaintClient) {
      // Build data payload safely, omitting status enum conflicts so Prisma uses schema default
      const createData = {
        userId: targetId,
        complaintSubject: subject,
        complaintCategory: category,
        complaintDesc: details
      };

      // Attempt to include evidenceImg if supported, otherwise skip it cleanly
      try {
        newComplaint = await complaintClient.create({
          data: {
            ...createData,
            evidenceImg: proofUrl || null
          }
        });
      } catch (innerErr) {
        console.log('>>> [BACKEND] evidenceImg column might not exist, saving without image.');
        newComplaint = await complaintClient.create({
          data: createData
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Complaint filed successfully!',
      data: newComplaint
    });
  } catch (error) {
    console.error('>>> [BACKEND] Error in createComplaint:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getTenantComplaints, createComplaint };