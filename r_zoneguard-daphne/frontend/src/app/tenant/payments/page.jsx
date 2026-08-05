"use client";

import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';
import { useParams } from 'next/navigation';
import './style.css';

export default function PaymentsPage() {
  const params = useParams();
  
  // Dynamically retrieve the exact logged-in user ID from localStorage set during login
  const [tenantId, setTenantId] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedUserId = localStorage.getItem('userId') || localStorage.getItem('tenantId') || localStorage.getItem('currentUserId');
    
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setTenantId(parsed.id || parsed.userId || parsed.tenantId || parsed.user_id);
      } catch (e) {
        setTenantId(storedUser);
      }
    } else if (storedUserId) {
      setTenantId(storedUserId);
    } else if (params?.tenantId) {
      setTenantId(params.tenantId);
    }
  }, [params]);

  const [activeYear, setActiveYear] = useState('2026');
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState({
    summary: {
      currentBalance: 0,
      standingStatus: 'UP TO DATE',
      junePaymentStatus: 'UNPAID',
      lastPaymentDate: 'N/A',
      paymentMethod: 'N/A',
      nextBillingCycle: 'July 2026'
    },
    ledger: []
  });
  
  const [userInfo, setUserInfo] = useState({
    name: '',
    role: 'TENANT',
    initials: ''
  });

  useEffect(() => {
    async function fetchPaymentData() {
      if (!tenantId) return;
      
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/tenant/payments/${tenantId}`);
        const json = await res.json();
        if (json.success) {
          setPaymentData(json.data);
          if (json.data.user) {
            setUserInfo(json.data.user);
          }
        }
      } catch (err) {
        console.error('Error fetching payment data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPaymentData();
  }, [tenantId]);

  const filteredLedger = paymentData.ledger.filter(item => {
    if (!item.period) return true;
    return item.period.includes(activeYear);
  });

  const isGoodStanding = paymentData.summary.currentBalance === 0 && paymentData.summary.standingStatus === 'UP TO DATE';
  const juneStatus = paymentData.summary.junePaymentStatus || (isGoodStanding ? 'APPROVED' : 'UNPAID');

  return (
    <div className="tenant-page-container">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input type="text" className="search-input" placeholder="Search transactions, receipts..." />
        </div>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{userInfo.name}</span>
            <span className="user-role">{userInfo.role}</span>
          </div>
          <div className="user-avatar">{userInfo.initials}</div>
        </div>
      </header>

      <div className="main-content-wrapper">
        <div className="payments-main-container">
          
          {/* CURRENT OUTSTANDING BALANCE CARD */}
          <div className="balance-card">
            <div className="balance-card-top">
              <div className="balance-title-group">
                <h3>Current Outstanding Balance</h3>
                <h1 className="balance-amount">
                  ₱{Number(paymentData.summary.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h1>
              </div>
              <div className={`standing-badge ${!isGoodStanding ? 'pending-standing' : ''}`}>
                {isGoodStanding ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />} 
                {paymentData.summary.standingStatus}
              </div>
            </div>

            <div className="balance-card-grid">
              <div className="balance-meta-item">
                <span className="meta-label">JUNE 2026 PAYMENT</span>
                <span className="meta-value">
                  <span className={juneStatus === 'APPROVED' || juneStatus === 'PAID' ? "status-pill-approved" : "status-pill-pending"}>
                    {juneStatus}
                  </span>
                </span>
              </div>
              <div className="balance-meta-item">
                <span className="meta-label">LAST PAYMENT</span>
                <span className="meta-value">{paymentData.summary.lastPaymentDate}</span>
              </div>
              <div className="balance-meta-item">
                <span className="meta-label">PAYMENT METHOD</span>
                <span className="meta-value">{paymentData.summary.paymentMethod}</span>
              </div>
              <div className="balance-meta-item" style={{ gridColumn: 'span 3', borderTop: '1px solid #f3f4f6', paddingTop: '12px', marginTop: '4px' }}>
                <span className="meta-label">NEXT BILLING CYCLE</span>
                <span className="meta-value">{paymentData.summary.nextBillingCycle}</span>
              </div>
            </div>
          </div>

          {/* ANNUAL PAYMENT LEDGER SECTION */}
          <div className="ledger-section">
            <div className="section-header">
              <h3>
                <FileText size={18} /> Annual Payment Ledger
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="year-tabs">
                  <button
                    className={`year-tab ${activeYear === '2026' ? 'active' : ''}`}
                    onClick={() => setActiveYear('2026')}
                  >
                    2026
                  </button>
                  <button
                    className={`year-tab ${activeYear === '2025' ? 'active' : ''}`}
                    onClick={() => setActiveYear('2025')}
                  >
                    2025
                  </button>
                </div>
                <button className="export-link">Export Year-to-End Statement</button>
              </div>
            </div>

            <div className="table-container">
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>PERIOD</th>
                    <th>MODE</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>DATE PAID</th>
                    <th>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        Loading payment history...
                      </td>
                    </tr>
                  ) : filteredLedger.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                        No payment history found for {activeYear}.
                      </td>
                    </tr>
                  ) : (
                    filteredLedger.map((item, index) => (
                      <tr key={item.id || index} className="table-row">
                        <td className="period-cell">{item.period}</td>
                        <td>{item.mode}</td>
                        <td className="amount-cell">
                          ₱{Number(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                        <td>
                          <span className={item.status === 'PAID' ? 'status-paid' : 'status-unpaid'}>
                            {item.status}
                          </span>
                        </td>
                        <td>{item.datePaid}</td>
                        <td>
                          <div className="action-cell">
                            {item.status === 'PAID' && <button className="btn-action">View AOR</button>}
                            <button className="btn-action">Dispute</button>
                            {item.mode === 'Cash' && <button className="btn-action">View OR</button>}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}