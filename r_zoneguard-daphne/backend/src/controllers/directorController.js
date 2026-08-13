const prisma = require('../config/prisma');

// Calculate real-time financial totals
const getFinancials = async (req, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        paymentStatus: 'VERIFIED',
        transactionDate: {
          gte: new Date('2026-01-01T00:00:00.000Z'),
          lt: new Date('2027-01-01T00:00:00.000Z')
        }
      }
    });

    const monthlyTotals = Array(12).fill(0);

    transactions.forEach(tx => {
      if (tx.transactionDate) {
        const monthIndex = new Date(tx.transactionDate).getMonth();
        monthlyTotals[monthIndex] += Number(tx.amount || 0);
      }
    });

    return res.json({ success: true, monthlyTotals });
  } catch (error) {
    console.error("Financial fetch error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch all complaints for the director
const getComplaints = async (req, res) => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ message: 'Error fetching complaints', error: error.message });
  }
};

module.exports = {
  getFinancials,
  getComplaints
};