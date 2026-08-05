const prisma = require('../config/prisma');

// GET /api/tenant/settings/:tenantId
const getProfile = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId;

  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { user_id: targetId },
          { id: targetId },
          { userId: targetId }
        ]
      },
      include: {
        tenants: {
          include: { lot: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/tenant/settings/:tenantId
const updateProfile = async (req, res) => {
  const { tenantId, userId } = req.params;
  const targetId = tenantId || userId;
  const { firstName, lastName, email } = req.body;

  try {
    const updatedUser = await prisma.user.updateMany({
      where: {
        OR: [
          { user_id: targetId },
          { id: targetId },
          { userId: targetId }
        ]
      },
      data: {
        firstName,
        lastName,
        email
      }
    });

    res.status(200).json({ success: true, message: 'Profile updated successfully', data: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };