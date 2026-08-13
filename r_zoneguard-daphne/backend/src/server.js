<<<<<<< HEAD
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const analyticsRoutes = require('./routes/analyticsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const authRoutes = require('./routes/authRoutes');
const residentRoutes = require('./routes/residentRoutes'); 
const complaintRoutes = require('./routes/complaintRoutes');
const tenantManagementRoutes = require('./routes/tenantmanagementRoutes');
const adminSettingsRoutes = require('./routes/adminSettingsRoutes');


const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

app.use('/api/analytics', analyticsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/residents', residentRoutes); 
app.use('/api/complaints', complaintRoutes); 
app.use('/api/tenant_management', tenantManagementRoutes);
app.use('/api/admin/settings', adminSettingsRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

=======
const express = require('express');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const complaintRoutes = require("./routes/complaintroutes");
const financialRoutes = require("./routes/financialroutes");
const propertyRoutes = require("./routes/propertyroutes");
const residentRoutes = require("./routes/residentRoutes");
const homeownerDashboardRoutes = require('./routes/homeowner');
const collectorRoutes = require("./routes/collectorRoutes"); // <-- Imported here
const directorRoutes = require('./routes/directorRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Mount all API routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/financials", financialRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/residents", residentRoutes);
app.use('/api/homeowner', homeownerDashboardRoutes);
app.use("/api/collector", collectorRoutes); // <-- Mounted here
app.use('/api/director', directorRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'zoneguard-backend',
        uptime: process.uptime(),
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'ZoneGuard backend is running' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`ZoneGuard backend listening on http://localhost:${PORT}`);
});
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
