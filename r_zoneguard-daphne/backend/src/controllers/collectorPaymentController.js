const prisma = require('../config/prisma');

// Helper to generate initials and avatar background color dynamically
const getAvatarProps = (nameStr) => {
  const name = nameStr || 'Resident';
  const parts = name.split(' ');
  const initials = parts.length > 1 
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() 
    : name.substring(0, 2).toUpperCase();
  
  const colors = ['#8a6d3b', '#2e7d32', '#1565c0', '#6a1b9a', '#c62828', '#ef6c00'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const bgColor = colors[Math.abs(hash) % colors.length];
  return { initials, bgColor };
};

// GET /api/collector/payments
const getPendingPayments = async (req, res) => {
  try {
    const transactionClient = prisma.transaction || prisma.Transaction;
    const userClient = prisma.user || prisma.User;

    let transactions = [];
    let usersMap = {};

    if (transactionClient) {
      try {
        transactions = await transactionClient.findMany({
          where: {
            OR: [
              { paymentStatus: 'PENDING' },
              { paymentStatus: 'Pending' },
              { paymentStatus: 'pending' }
            ]
          },
          orderBy: { transactionDate: 'desc' }
        });
      } catch {
        const allTransactions = await transactionClient.findMany();
        transactions = allTransactions.filter(t => {
          const status = (t.paymentStatus || '').toUpperCase();
          return status === 'PENDING';
        });
      }
    }

    // Explicitly sort transactions from latest to oldest (descending by date)
    transactions.sort((a, b) => {
      const dateA = new Date(a.transactionDate || 0);
      const dateB = new Date(b.transactionDate || 0);
      return dateB - dateA;
    });

    // Fetch users to map user IDs to their actual names
    if (userClient) {
      const users = await userClient.findMany();
      users.forEach(u => {
        const uid = u.userId || u.id;
        if (uid) {
          usersMap[uid] = {
            firstName: u.firstName || '',
            lastName: u.lastName || ''
          };
        }
      });
    }

    const formattedPayments = transactions.map(t => {
      const uid = t.userId;
      const residentInfo = usersMap[uid] || {};
      const firstName = residentInfo.firstName || '';
      const lastName = residentInfo.lastName || '';
      
      const rawUser = `${firstName} ${lastName}`.trim() || uid || 'Resident User';
      const rawAmount = t.amount || 0;
      const rawPeriod = (t.paymentCategory || t.billingId || 'HOA Dues').replace('_', ' ');

      const { initials, bgColor } = getAvatarProps(rawUser);

      return {
        id: t.id,
        transactionId: t.id,
        billingId: t.billingId || null,
        name: rawUser,
        address: t.zoneId ? `Zone ${t.zoneId}` : 'NIA Village Subd.',
        initials,
        bgColor,
        amount: `₱${Number(rawAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        period: rawPeriod,
        document: t.paymentProof || null,
        refNumber: t.referenceNo || '',
        status: (t.paymentStatus || 'PENDING').toUpperCase()
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedPayments
    });
  } catch (error) {
    console.error('>>> [BACKEND] Error in getPendingPayments:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/collector/payments/:id
const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const transactionClient = prisma.transaction || prisma.Transaction;
    const arClient = prisma.accountsReceivable || prisma.AccountsReceivable || prisma.accounts_receivable;
    
    const isApproved = ['ACCEPT', 'ACCEPTED', 'APPROVED', 'VERIFIED'].includes((status || '').toUpperCase());
    
    // Put 'VERIFIED' first so it matches and writes VERIFIED instead of COMPLETED
    const targetStatuses = isApproved 
      ? ['VERIFIED', 'APPROVED', 'PAID', 'COMPLETED', 'SUCCESS'] 
      : ['DECLINED', 'REJECTED', 'FAILED', 'CANCELLED'];

    if (transactionClient && id) {
      let tx = null;
      try {
        tx = await transactionClient.findFirst({
          where: {
            OR: [
              { id: id },
              { billingId: id }
            ]
          }
        });
      } catch (err) {
        console.error('>>> [BACKEND] Error querying transaction:', err);
      }

      if (!tx) {
        return res.status(404).json({ success: false, message: `Transaction not found for ID or billingId: ${id}` });
      }

      // Update transaction status using 'VERIFIED' first
      let updatedTx = null;
      let lastError = null;
      for (const st of targetStatuses) {
        try {
          updatedTx = await transactionClient.update({
            where: { id: tx.id },
            data: { paymentStatus: st }
          });
          break;
        } catch (e) {
          lastError = e;
        }
      }

      if (!updatedTx) {
        throw lastError || new Error('Failed to update transaction status due to enum mismatch.');
      }

      // If approved, update the matching Accounts Receivable billing_status to 'PAID' (or 'VERIFIED')
      if (isApproved && tx.billingId && arClient) {
        const arStatuses = ['PAID', 'VERIFIED', 'APPROVED', 'COMPLETED'];
        for (const arSt of arStatuses) {
          try {
            await arClient.update({
              where: { billingId: tx.billingId },
              data: { billingStatus: arSt }
            });
            break;
          } catch {
            // try next enum option if needed
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Transaction successfully ${isApproved ? 'verified' : 'declined'}`
    });
  } catch (error) {
    console.error('>>> [BACKEND] Error in updatePaymentStatus:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPendingPayments, updatePaymentStatus };