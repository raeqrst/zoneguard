'use client';


import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  UploadCloud,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock
} from 'lucide-react';
import './style.css';


export default function Complaints() {
  // Initialize state from sessionStorage so refreshes don't wipe out the current view
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('complaints_activeTab') || 'list';
    }
    return 'list';
  });


  const [selectedComplaint, setSelectedComplaint] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('complaints_selected');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  });


  useEffect(() => {
    sessionStorage.setItem('complaints_activeTab', activeTab);
    if (selectedComplaint) {
      sessionStorage.setItem('complaints_selected', JSON.stringify(selectedComplaint));
    } else {
      sessionStorage.removeItem('complaints_selected');
    }
  }, [activeTab, selectedComplaint]);


  const complaintsData = [
    {
      id: 'COMP-2026-089',
      date: 'May 04, 2026',
      subject: 'Not paying credit to person A',
      category: 'Financial',
      categoryClass: 'cat-financial',
      status: 'Active',
      statusClass: 'pill-active',
      details: 'Dispute regarding delayed settlement of agreed dues with resident counterpart.',
      timeline: [
        { title: 'Complaint Filed', time: 'May 04, 2026 - 10:15 AM', desc: 'Complaint submitted by resident for initial review.' },
        { title: 'Under Review', time: 'May 04, 2026 - 02:00 PM', desc: 'Assigned to HOA Finance Committee for mediation.' }
      ]
    },
    {
      id: 'COMP-2026-072',
      date: 'February 01, 2026',
      subject: 'Unauthorized parking in A Street',
      category: 'Grievance',
      categoryClass: 'cat-grievance',
      status: 'Investigating',
      statusClass: 'pill-investigating',
      details: 'Vehicle regularly blocking the pathway on A Street during evening hours.',
      timeline: [
        { title: 'Complaint Filed', time: 'Feb 01, 2026 - 08:30 AM', desc: 'Logged into system with photographic evidence.' },
        { title: 'Guard Dispatched', time: 'Feb 01, 2026 - 09:00 AM', desc: 'Security personnel verified violation and issued notice.' }
      ]
    },
    {
      id: 'COMP-2026-041',
      date: 'Mar 2026',
      subject: 'Flickering lights',
      category: 'Infrastructure',
      categoryClass: 'cat-infrastructure',
      status: 'Resolved',
      statusClass: 'pill-resolved',
      details: 'Street light pole #14 showing consistent flickering issues at night.',
      timeline: [
        { title: 'Complaint Filed', time: 'Mar 10, 2026 - 04:20 PM', desc: 'Reported by community member.' },
        { title: 'Maintenance Fixed', time: 'Mar 12, 2026 - 11:00 AM', desc: 'Ballast and bulb replaced by electrical crew.' }
      ]
    }
  ];


  const handleRowClick = (complaint) => {
    setSelectedComplaint(complaint);
    setActiveTab('detail');
  };


  const handleBackToList = () => {
    setSelectedComplaint(null);
    setActiveTab('list');
  };


  return (
    <div className="tenant-page-container">
      {/* TOPBAR PROFILE SECTION */}
      <header className="topbar">
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Brian S.</span>
            <span className="user-role">TENANT</span>
          </div>
          <div className="user-avatar">BS</div>
        </div>
      </header>


      <div className="main-content-wrapper">
        {activeTab === 'list' ? (
          <div className="complaints-main-container">
            {/* MEMBER STANDING BANNER */}
            <div className="member-standing-card">
              <div className="standing-icon">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <strong>Tenant Standing:</strong> Your account is in green status. You are permitted to submit new formal concerns.
              </div>
            </div>


            {/* SUBMIT COMPLAINT FORM CARD */}
            <div className="form-card">
              <div className="form-card-header">
                <h2>Submit a New Complaint</h2>
                <p>Please provide details and any supporting evidence for your concern.</p>
              </div>
              <div className="form-card-body">
                <div className="form-grid-layout">
                  <div className="form-group">
                    <label>SUBJECT</label>
                    <input type="text" className="form-input" placeholder="e.g. Broken perimeter fence" />
                  </div>
                  <div className="form-group">
                    <label>CATEGORY</label>
                    <select className="form-input form-select" defaultValue="Public Relations">
                      <option>Public Relations</option>
                      <option>Financial</option>
                      <option>Grievance</option>
                      <option>Infrastructure</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>DETAILS</label>
                    <textarea className="form-input form-textarea" placeholder="Provide a brief summary of the issue..."></textarea>
                  </div>
                  <div className="form-group">
                    <label>UPLOAD PHOTOS OR EVIDENCE</label>
                    <div className="dropzone-box">
                      <UploadCloud size={22} className="dropzone-icon" />
                      <strong>Upload or drag and drop images</strong>
                      <span>JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                </div>
                <button className="btn-submit-complaint">FILE FORMAL COMPLAINT</button>
              </div>
            </div>


            {/* ACTIVE COMPLAINTS TABLE SECTION */}
            <div className="active-complaints-section">
              <div className="section-header">
                <h3>
                  <AlertCircle size={18} /> Active Complaints
                </h3>
                <span className="total-count">Total: {complaintsData.length}</span>
              </div>


              <div className="table-container">
                <table className="complaints-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>SUBJECT</th>
                      <th>CATEGORY</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaintsData.map((item, index) => (
                      <tr key={index} className="table-row" onClick={() => handleRowClick(item)}>
                        <td>{item.date}</td>
                        <td className="subject-cell">{item.subject}</td>
                        <td>
                          <span className={`cat-badge ${item.categoryClass}`}>{item.category.toUpperCase()}</span>
                        </td>
                        <td>
                          <span className={`status-pill ${item.statusClass}`}>{item.status}</span>
                        </td>
                        <td className="arrow-cell"><ChevronRight size={16} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* COMPLAINT DETAIL VIEW */
          <div className="complaints-main-container">
            <button className="btn-back" onClick={handleBackToList}>
              <ArrowLeft size={16} /> Back to Complaints
            </button>


            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="detail-header-tags">
                <span className="tag-id">{selectedComplaint?.id}</span>
                <span className={`status-pill ${selectedComplaint?.statusClass}`}>{selectedComplaint?.status}</span>
                <span className={`cat-badge ${selectedComplaint?.categoryClass}`}>{selectedComplaint?.category?.toUpperCase()}</span>
              </div>
              <h1 className="detail-title">{selectedComplaint?.subject}</h1>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '0.9rem' }}>{selectedComplaint?.details}</p>
            </div>


            <div className="card">
              <h3 className="card-heading green-text">
                <Clock size={18} /> Complaint Timeline & Updates
              </h3>
              <div className="timeline-list">
                {selectedComplaint?.timeline?.map((t, i) => (
                  <div className="timeline-item" key={i}>
                    <div className="timeline-badge">✓</div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong>{t.title}</strong>
                        <span className="timeline-time">{t.time}</span>
                      </div>
                      <p>{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

