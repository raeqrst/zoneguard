const express = require('express');
const cors = require('cors');

require('dotenv').config();

const authRoutes = require('./routes/authroutes');
const dashboardRoutes = require("./routes/dashboardRoutes");
const complaintRoutes = require("./routes/complaintroutes");
const financialRoutes = require("./routes/financialroutes");
const propertyRoutes = require("./routes/propertyroutes");
const residentRoutes = require("./routes/residentRoutes");

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