const express = require('express');
const cors = require('cors');

const app = express();

// 1. Core Middleware
app.use(cors());
app.use(express.json());

// 2. Import Route Files
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const tenantRoutes = require("./routes/tenantRoutes");

// 3. Mount Route Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/property", propertyRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/tenant", tenantRoutes);

// 4. Global 404 Fallback Handler (Must be placed AFTER all routes)
app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running successfully on http://localhost:${PORT}`);
});