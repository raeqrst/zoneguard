'use client';

import React, { useState } from 'react';

// SVGs matched precisely to the dashboard design system
const Icons = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
};

const ledgerData2026 = [
  { period: 'June 2026', mode: '-', amount: '₱200.00', statusType: 'withArrears', statusText: 'WITH ARREARS', datePaid: 'Past Due', actions: ['Pay Now', 'Dispute'] },
  { period: 'May 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'May 01, 2026', actions: ['View AOR', 'Dispute'] },
  { period: 'Apr 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'April 01, 2026', actions: ['View AOR', 'Dispute'] },
  { period: 'Mar 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'March 01, 2026', actions: ['View AOR', 'Dispute'] },
  { period: 'Feb 2026', mode: 'Cash', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'February 21, 2026', actions: ['View AOR', 'View OR', 'Dispute'] },
  { period: 'Jan 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'January 01, 2026', actions: ['View AOR', 'Dispute'] },
];

const ledgerData2025 = [
  { period: 'Dec 2025', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'December 01, 2025', actions: ['View AOR', 'Dispute'] },
  { period: 'Nov 2025', mode: 'Cash', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'November 05, 2025', actions: ['View AOR', 'Dispute'] },
];

export default function HomeownerPaymentsPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');

  const currentLedger = selectedYear === '2026' ? ledgerData2026 : ledgerData2025;

  return (
    <div>
      {/* PAGE-SPECIFIC SEARCH HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ position: 'relative', width: '420px' }}>
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', display: 'flex' }}>
            {Icons.search}
          </span>
          <input
            type="text"
            placeholder="Search transactions, receipts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 46px',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '30px',
              fontSize: '0.9rem',
              outline: 'none',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              boxSizing: 'border-box'
            }}
          />
        </div>
      </div>

      {/* PAYMENTS CONTAINER */}
      <div>
        
        {/* TOP SUMMARY CARD */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px 36px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: '700', color: '#64748b', marginBottom: '8px' }}>Current Outstanding Balance</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>₱200.00</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fef3c7', color: '#92400e', padding: '6px 16px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '800' }}>
              {Icons.warning}
              WITH ARREARS
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '20px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.3px' }}>JUNE 2026 PAYMENT</span>
              <span style={{ display: 'inline-block', backgroundColor: '#fee2e2', color: '#991b1b', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>REJECTED</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.3px' }}>LAST PAYMENT</span>
              <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>May 01, 2026</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.3px' }}>PAYMENT METHOD</span>
              <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>Digital</span>
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.3px' }}>NEXT BILLING CYCLE</span>
              <span style={{ display: 'block', fontSize: '0.95rem', fontWeight: '800', color: '#0f172a' }}>-</span>
            </div>
          </div>
        </div>

        {/* ANNUAL PAYMENT LEDGER SECTION */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          
          {/* LEDGER HEADER BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {Icons.list}
              <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#064e3b', margin: 0 }}>Annual Payment Ledger</h2>
              <div style={{ display: 'flex', backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '3px', marginLeft: '12px' }}>
                <button 
                  onClick={() => setSelectedYear('2026')}
                  style={{
                    padding: '4px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: selectedYear === '2026' ? '#ffffff' : 'transparent',
                    color: selectedYear === '2026' ? '#0f172a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: selectedYear === '2026' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  2026
                </button>
                <button 
                  onClick={() => setSelectedYear('2025')}
                  style={{
                    padding: '4px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: selectedYear === '2025' ? '#ffffff' : 'transparent',
                    color: selectedYear === '2025' ? '#0f172a' : '#64748b',
                    fontSize: '0.8rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: selectedYear === '2025' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  2025
                </button>
              </div>
            </div>

            <button style={{ background: 'none', border: 'none', color: '#064e3b', fontSize: '0.85rem', fontWeight: '800', cursor: 'pointer' }}>
              Export Year-to-End Statement
            </button>
          </div>

          {/* LEDGER TABLE */}
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px 32px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>PERIOD</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>MODE</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>AMOUNT</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>STATUS</th>
                  <th style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>DATE PAID</th>
                  <th style={{ padding: '14px 32px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px', textAlign: 'right' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {currentLedger.map((row, index) => (
                  <tr key={index} style={{ borderBottom: index !== currentLedger.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '20px 32px', fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{row.period}</td>
                    <td style={{ padding: '20px 20px', fontSize: '0.85rem', fontWeight: '600', color: '#64748b' }}>{row.mode}</td>
                    <td style={{ padding: '20px 20px', fontSize: '0.9rem', fontWeight: '700', color: '#0f172a' }}>{row.amount}</td>
                    <td style={{ padding: '20px 20px' }}>
                      {row.statusType === 'withArrears' ? (
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-block' }}>
                          {row.statusText}
                        </span>
                      ) : (
                        <span style={{ backgroundColor: '#d1fae5', color: '#065f46', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-block' }}>
                          {row.statusText}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '20px 20px', fontSize: '0.85rem', fontWeight: '600', color: row.datePaid === 'Past Due' ? '#dc2626' : '#334155' }}>
                      {row.datePaid}
                    </td>
                    <td style={{ padding: '20px 32px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        {row.actions.map((action, actIdx) => {
                          const isPayNow = action === 'Pay Now';
                          const isDispute = action === 'Dispute';
                          return (
                            <button
                              key={actIdx}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                border: isDispute ? '1px solid #cbd5e1' : 'none',
                                backgroundColor: isPayNow ? '#064e3b' : isDispute ? '#ffffff' : '#f1f5f9',
                                color: isPayNow ? '#ffffff' : isDispute ? '#475569' : '#0f172a',
                                fontSize: '0.75rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                              }}
                            >
                              {action}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </div>
  );
}