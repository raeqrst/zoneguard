const prisma = require('../config/prisma');

// Helper to generate initials and avatar background color dynamically
const getAvatarProps = (nameStr) => {
  const name = nameStr || 'Resident';
  const parts = name.split(' ').filter(Boolean);
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
    const { search } = req.query;

    // 1. Query pending transactions WITHOUT directly including non-existent 'user' relation
    const transactions = await prisma.transaction.findMany({
      where: {
        paymentStatus: 'PENDING',
        ...(search ? {
          OR: [
            { referenceNo: { contains: search, mode: 'insensitive' } },
            { id: { contains: search, mode: 'insensitive' } }
          ]
        } : {})
      },
      orderBy: { transactionDate: 'desc' }
    });

    // 2. Collect unique user IDs from transactions and fetch matching users
    const userIds = [...new Set(transactions.map(t => t.userId).filter(Boolean))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } }
    }).catch(() => []);

    // Create a lookup map for fast user resolution
    const usersMap = {};
    users.forEach(u => {
      usersMap[u.id] = u;
    });

    // 3. Map payments safely
    const formattedPayments = transactions.map(t => {
      const u = usersMap[t.userId];

      let realName = 'Resident User';
      if (u && (u.firstName || u.lastName)) {
        realName = `${u.firstName || ''} ${u.lastName || ''}`.trim();
      } else if (t.userId) {
        realName = `User (${t.userId})`;
      }

      let address = 'Zone Z-3';
      if (t.zoneId) {
        address = `Zone ${t.zoneId}`;
      } else if (t.lotId) {
        address = `Lot ${t.lotId}`;
      }

      const rawAmount = t.amount || 0;
      const rawPeriod = (t.paymentCategory || t.billingId || 'HOA Dues').replace('_', ' ');
      const { initials, bgColor } = getAvatarProps(realName);

      return {
        id: t.id,
        transactionId: t.id,
        billingId: t.billingId || null,
        name: realName,
        address: address,
        initials,
        bgColor,
        amount: `₱${Number(rawAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
        period: rawPeriod,
        document: t.paymentProof || null,
        refNumber: t.referenceNo || '',
        status: (t.paymentStatus || 'PENDING').toUpperCase()
      };
    });

    // 4. In-memory search filtering by resident name
    let finalData = formattedPayments;
    if (search) {
      const q = search.toLowerCase();
      finalData = formattedPayments.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.refNumber.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q)
      );
    }

    return res.status(200).json({
      success: true,
      data: finalData
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
    const isApproved = ['ACCEPT', 'ACCEPTED', 'APPROVED', 'VERIFIED'].includes((status || '').toUpperCase());
    const targetStatuses = isApproved 
      ? ['VERIFIED', 'APPROVED', 'PAID', 'COMPLETED', 'SUCCESS'] 
      : ['DECLINED', 'REJECTED', 'FAILED', 'CANCELLED'];

    const tx = await prisma.transaction.findFirst({
      where: {
        OR: [
          { id: id },
          { billingId: id }
        ]
      }
    });

    if (!tx) {
      return res.status(404).json({ success: false, message: `Transaction not found for ID or billingId: ${id}` });
    }

    let updatedTx = null;
    let lastError = null;
    for (const st of targetStatuses) {
      try {
        updatedTx = await prisma.transaction.update({
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

    if (isApproved && tx.billingId) {
      const arStatuses = ['PAID', 'VERIFIED', 'APPROVED', 'COMPLETED'];
      for (const arSt of arStatuses) {
        try {
          await prisma.accountsReceivable.update({
            where: { id: tx.billingId },
            data: { billingStatus: arSt }
          });
          break;
        } catch {
          // ignore if status enum mismatch
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