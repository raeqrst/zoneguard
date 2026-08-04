const dashboardRoutes = require("./routes/dashboardRoutes");

app.use("/api/auth", authRoutes);

app.use("/api/property", propertyRoutes);

app.use("/api/complaints", complaintRoutes);

app.use("/api/dashboard", dashboardRoutes);