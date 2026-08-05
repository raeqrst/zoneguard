require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const analyticsRouter = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const residentRoutes = require('./routes/residentRoutes'); 
const complaintRoutes = require('./routes/complaintRoutes');
const tenantManagementRoutes = require('./routes/tenantmanagementRoutes');
const adminSettingsRoutes = require('./routes/adminSettingsRoutes');


const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

app.use('/api/analytics', analyticsRouter);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes); 
app.use('/api/complaints', complaintRoutes); 
app.use('/api/tenant_management', tenantManagementRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

