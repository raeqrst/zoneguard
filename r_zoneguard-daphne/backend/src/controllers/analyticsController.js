const prisma = require('../config/db');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Core Summary Metrics Card
exports.getAnalyticsData = async (req, res) => {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const totalHouseholds = await prisma.lot.count();
    const totalResidents = await prisma.user.count();

    const transactions = await prisma.transaction.findMany({
      where: { paymentStatus: { in: ['VERIFIED', 'COMPLETED', 'PAID', 'SUCCESS', 'APPROVED'] } },
      select: { amount: true, transactionDate: true, createdAt: true }
    });

    let totalCollected = 0;
    let paidThisMonthCount = 0;

    transactions.forEach(t => {
      totalCollected += Number(t.amount) || 0;
      const txDate = t.transactionDate || t.createdAt;
      if (txDate) {
        const dt = new Date(txDate);
        if (dt.getMonth() + 1 === currentMonth && dt.getFullYear() === currentYear) {
          paidThisMonthCount++;
        }
      }
    });

    const receivables = await prisma.accountsReceivable.findMany({
      select: { baseAmount: true, billingStatus: true, billingMonth: true, billingYear: true }
    });

    let totalExpected = 0;
    let overdueCount = 0;
    let pendingCount = 0;

    receivables.forEach(r => {
      if (r.billingMonth === currentMonth && r.billingYear === currentYear) {
        totalExpected += Number(r.baseAmount) || 0;
      }
      const status = (r.billingStatus || '').toUpperCase();
      if (['PENDING', 'PARTIAL', 'UNPAID'].includes(status)) pendingCount++;
      else if (['OVERDUE', 'DELINQUENT'].includes(status)) overdueCount++;
    });

    if (totalExpected === 0) {
      totalExpected = totalHouseholds * 200;
    }

    const delinquentLotsCount = await prisma.lot.count({
      where: { OR: [{ isDelinquent: true }, { lotStanding: { in: ['DELINQUENT', 'UNPAID', 'WITH_ARREARS'] } }] }
    });

    const collectionRate = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;
    const riskIndex = totalHouseholds > 0 ? (delinquentLotsCount / totalHouseholds) * 100 : 0;

    const resolvedComplaints = await prisma.complaint.findMany({
      where: { status: { in: ['RESOLVED', 'CLOSED'] } },
      select: { createdAt: true, updatedAt: true }
    });

    let totalMinutes = 0;
    resolvedComplaints.forEach(c => {
      if (c.createdAt && c.updatedAt) {
        const diff = (new Date(c.updatedAt) - new Date(c.createdAt)) / 60000;
        if (diff >= 0) totalMinutes += diff;
      }
    });
    const avgHours = resolvedComplaints.length > 0 ? (totalMinutes / resolvedComplaints.length / 60).toFixed(1) : '0.0';

    return res.status(200).json({
      success: true,
      data: {
        totalHouseholds,
        totalResidents,
        collection_rate: Number(collectionRate.toFixed(1)),
        currentRevenue: totalCollected,
        expectedRevenue: totalExpected,
        riskIndex: Number(riskIndex.toFixed(1)),
        paidThisMonth: paidThisMonthCount,
        pending: pendingCount,
        overdue: overdueCount > 0 ? overdueCount : delinquentLotsCount,
        avgResponseTime: `${avgHours} Hrs`
      }
    });
  } catch (error) {
    console.error("Summary Analytics Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Revenue Monitoring Detail Card
exports.getRevenueMonitoringDetail = async (req, res) => {
  try {
    const totalHouseholds = await prisma.lot.count();
    const receivables = await prisma.accountsReceivable.findMany({ select: { baseAmount: true } });
    const baseAmount = receivables.length > 0 && receivables[0].baseAmount ? Number(receivables[0].baseAmount) : 200;
    const expectedRevenue = totalHouseholds * baseAmount;

    const transactions = await prisma.transaction.findMany({
      where: { paymentStatus: { in: ['VERIFIED', 'COMPLETED', 'PAID', 'SUCCESS', 'APPROVED'] } },
      select: { amount: true }
    });

    const collectedRevenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
    const outstandingRevenue = Math.max(0, expectedRevenue - collectedRevenue);

    return res.status(200).json({
      success: true,
      data: { householdsCount: totalHouseholds, baseAmount, expectedRevenue, collectedRevenue, outstandingRevenue }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Payment Distribution Card & Chart
exports.getPaymentDistribution = async (req, res) => {
  try {
    const receivables = await prisma.accountsReceivable.findMany({ select: { billingStatus: true } });
    let paidCount = 0, pendingCount = 0, overdueCount = 0;

    receivables.forEach(r => {
      const status = (r.billingStatus || '').toUpperCase();
      if (['PAID', 'VERIFIED', 'COMPLETED'].includes(status)) paidCount++;
      else if (['PENDING', 'PARTIAL', 'UNPAID'].includes(status)) pendingCount++;
      else if (['OVERDUE', 'DELINQUENT'].includes(status)) overdueCount++;
    });

    if (receivables.length === 0) {
      const totalLots = await prisma.lot.count();
      overdueCount = await prisma.lot.count({
        where: { OR: [{ isDelinquent: true }, { lotStanding: { in: ['DELINQUENT', 'UNPAID', 'WITH_ARREARS'] } }] }
      });
      pendingCount = Math.max(0, totalLots - overdueCount);
    }

    const totalBills = paidCount + pendingCount + overdueCount || 1;
    return res.status(200).json({
      success: true,
      data: {
        paidPercentage: Number(((paidCount / totalBills) * 100).toFixed(1)),
        pendingPercentage: Number(((pendingCount / totalBills) * 100).toFixed(1)),
        overduePercentage: Number(((overdueCount / totalBills) * 100).toFixed(1)),
        paidCount, pendingCount, overdueCount, totalBills
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Complaint Forecast
exports.getComplaintForecast = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({ select: { createdAt: true } });
    const monthlyCounts = Array(12).fill(0);
    complaints.forEach(c => {
      if (c.createdAt) {
        const m = new Date(c.createdAt).getMonth();
        if (m >= 0 && m < 12) monthlyCounts[m]++;
      }
    });
    const activeMonths = monthlyCounts.filter(v => v > 0);
    const avg = activeMonths.length > 0 ? activeMonths.reduce((a, b) => a + b, 0) / activeMonths.length : 0;
    const projected = [Number(avg.toFixed(1)), Number(avg.toFixed(1)), Number(avg.toFixed(1)), Number(avg.toFixed(1))];

    return res.status(200).json({
      success: true,
      data: { historical: monthlyCounts, projected, labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Financial Forecast
exports.getFinancialForecast = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { paymentStatus: { in: ['VERIFIED', 'COMPLETED', 'PAID', 'SUCCESS', 'APPROVED'] } },
      select: { amount: true, transactionDate: true, createdAt: true }
    });
    const monthlyRev = Array(12).fill(0);
    transactions.forEach(t => {
      const txDate = t.transactionDate || t.createdAt;
      if (txDate) {
        const m = new Date(txDate).getMonth();
        if (m >= 0 && m < 12) monthlyRev[m] += Number(t.amount) || 0;
      }
    });
    const activeRev = monthlyRev.filter(v => v > 0);
    const avgRev = activeRev.length > 0 ? activeRev.reduce((a, b) => a + b, 0) / activeRev.length : 0;
    const projected = [Math.round(avgRev), Math.round(avgRev), Math.round(avgRev), Math.round(avgRev)];

    return res.status(200).json({
      success: true,
      data: { historical: monthlyRev, projected, labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 6. Zone Operational Status (True Database-Driven R-Analytics Pipeline)
exports.getOperationalStatus = async (req, res) => {
  try {
    // Fetch ALL raw complaints to build a real dataset for R's glm() and kmeans()
    const complaints = await prisma.complaint.findMany({
      select: { complaintCategory: true, status: true, createdAt: true, updatedAt: true }
    });

    // Fetch ALL lots to build a real dataset for R's rpart() classification
    const lots = await prisma.lot.findMany({
      select: { isDelinquent: true, lotStanding: true }
    });

    // Structure raw database rows into JSON payload for R execution
    const rawPayload = {
      complaints: complaints.map(c => {
        const cat = (c.complaintCategory || '').toUpperCase();
        const isResolved = ['RESOLVED', 'CLOSED'].includes((c.status || '').toUpperCase());
        const durationMins = (isResolved && c.createdAt && c.updatedAt) ? Math.max(0, (new Date(c.updatedAt) - new Date(c.createdAt)) / 60000) : null;
        return {
          category: cat,
          resolved: isResolved ? 1 : 0,
          durationMins: durationMins
        };
      }),
      lots: lots.map(l => ({
        isDelinquent: (l.isDelinquent || ['UNPAID', 'DELINQUENT', 'WITH_ARREARS'].includes((l.lotStanding || '').toUpperCase())) ? 1 : 0
      }))
    };

    const jsonInputPath = path.join(__dirname, '../../r_scripts/input_raw_data.json');
    fs.writeFileSync(jsonInputPath, JSON.stringify(rawPayload, null, 2));

    const rScriptPath = path.join(__dirname, '../../r_scripts/operational_insights.R');
    const rOutput = execSync(`Rscript "${rScriptPath}" "${jsonInputPath}"`, { encoding: 'utf8' });
    const parsedResults = JSON.parse(rOutput.trim());

    if (fs.existsSync(jsonInputPath)) fs.unlinkSync(jsonInputPath);

    return res.status(200).json({
      success: true,
      data: parsedResults
    });
  } catch (error) {
    console.error("Operational Status Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// 7. Zone Heatmap
exports.getHeatmap = async (req, res) => {
  try {
    const lotsWithCoords = await prisma.lot.findMany({
      where: { latitude: { not: null }, longitude: { not: null } },
      select: { houseNumber: true, street: true, latitude: true, longitude: true, isDelinquent: true }
    });

    let hotspots = [];
    if (lotsWithCoords.length > 0) {
      hotspots = lotsWithCoords.map((l, idx) => ({
        x: 20 + (idx * 5) % 65,
        y: 25 + (idx * 7) % 60,
        label: `Lot ${l.houseNumber || idx + 1}`,
        status: l.isDelinquent ? 'Delinquent' : 'Active'
      }));
    }

    return res.status(200).json({ success: true, data: hotspots });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};