// src/controllers/adminSettingsController.js
const prisma = require('../config/db');

const getAdminSettings = async (req, res) => {
  try {
    // We use findFirst but add an orderBy to get the most relevant admin, 
    // or you can change findFirst to findUnique if you want to hardcode the ID for testing.
    const admin = await prisma.user.findFirst({
      where: { 
        systemRole: 'ADMIN',
        // Optional: Uncomment the line below to FORCE it to fetch Manuel's exact row from your screenshot
        // id: 'ADM-2026-0001' 
      },
      orderBy: {
        createdAt: 'asc' // Grabs the original admin account
      }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'No administrator account found in the database.'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        // Prisma maps the DB column "user_id" to the property "id" based on your schema
        userId: admin.id || '', 
        firstName: admin.firstName || '',
        middleName: admin.middleName || '',
        lastName: admin.lastName || '',
        email: admin.email || '',
        phoneNumber: admin.phoneNumber || '',
        dateOfBirth: admin.dateOfBirth ? new Date(admin.dateOfBirth).toISOString().split('T')[0] : '',
        systemRole: admin.systemRole || 'ADMIN',
        accountStatus: admin.accountStatus || 'ACTIVE'
      }
    });
  } catch (error) {
    console.error('Error fetching admin settings from database:', error);
    res.status(500).json({ success: false, message: 'Server error while retrieving database records.' });
  }
};

const updateAdminSettings = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth
    } = req.body;

    const existingAdmin = await prisma.user.findFirst({
      where: { systemRole: 'ADMIN' }
    });

    if (!existingAdmin) {
      return res.status(404).json({ success: false, message: 'Admin user not found in database' });
    }

    // Updating using the exact camelCase properties defined in your schema.prisma
    const updatedAdmin = await prisma.user.update({
      where: { id: existingAdmin.id }, // Use id here, not user_id
      data: {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        email: email,
        phoneNumber: phoneNumber,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null
      }
    });

    res.status(200).json({
      success: true,
      message: 'Database profile updated successfully',
      data: {
        userId: updatedAdmin.id, // Mapped from user_id
        firstName: updatedAdmin.firstName,
        middleName: updatedAdmin.middleName,
        lastName: updatedAdmin.lastName,
        email: updatedAdmin.email,
        phoneNumber: updatedAdmin.phoneNumber,
        dateOfBirth: updatedAdmin.dateOfBirth ? new Date(updatedAdmin.dateOfBirth).toISOString().split('T')[0] : '',
        systemRole: updatedAdmin.systemRole,
        accountStatus: updatedAdmin.accountStatus
      }
    });
  } catch (error) {
    console.error('Error updating admin settings in database:', error);
    res.status(500).json({ message: 'Server error while saving to database', success: false });
  }
};

module.exports = {
  getAdminSettings,
  updateAdminSettings
};