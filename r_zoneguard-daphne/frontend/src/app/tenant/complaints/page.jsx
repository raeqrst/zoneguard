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
import { useParams } from 'next/navigation';
import './style.css';

export default function Complaints() {
  const params = useParams();
  
  const [tenantId, setTenantId] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const resolved = parsed.id || parsed.userId || parsed.user_id || parsed.tenantId;
          if (resolved) return resolved;
        } catch (e) {}
      }
      return localStorage.getItem('userId') || localStorage.getItem('tenantId') || localStorage.getItem('currentUserId') || params?.tenantId || '';
    }
    return '';
  });

  useEffect(() => {
    if (!tenantId && typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const resolved = parsed.id || parsed.userId || parsed.user_id || parsed.tenantId;
          if (resolved) setTenantId(resolved);
        } catch (e) {}
      }
    }
  }, [params]);

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

  const [userInfo, setUserInfo] = useState({ name: 'Resident', role: 'TENANT', initials: 'R' });
  const [complaintsList, setComplaintsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Public Relations');
  const [details, setDetails] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('complaints_activeTab', activeTab);
    if (selectedComplaint) {
      sessionStorage.setItem('complaints_selected', JSON.stringify(selectedComplaint));
    } else {
      sessionStorage.removeItem('complaints_selected');
    }
  }, [activeTab, selectedComplaint]);

  const fetchComplaints = async () => {
    if (!tenantId) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/tenant/complaints/${tenantId}`);
      const json = await res.json();
      if (json.success) {
        if (json.data.user) setUserInfo(json.data.user);
        if (json.data.complaints) setComplaintsList(json.data.complaints);
      }
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchComplaints();
    }
  }, [tenantId]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!subject || !details) {
      alert('Please fill in both the subject and details of your complaint.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch(`http://localhost:5000/api/tenant/complaints/${tenantId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          category,
          details,
          proofUrl: evidenceFile ? evidenceFile.name : null
        })
      });

      const json = await res.json();
      if (json.success) {
        alert('Complaint successfully filed!');
        setSubject('');
        setDetails('');
        setEvidenceFile(null);
        fetchComplaints();
        setActiveTab('list');
      } else {
        alert(json.message || 'Failed to submit complaint.');
      }
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert('Connection Error: ' + err.message + '. Please ensure the backend server is running on port 5000.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRowClick = (complaint) => {
    const enhancedComplaint = {
      ...complaint,
      statusClass: complaint.status === 'RESOLVED' ? 'pill-resolved' : complaint.status === 'INVESTIGATING' ? 'pill-investigating' : 'pill-active',
      categoryClass: complaint.category === 'Financial' ? 'cat-financial' : complaint.category === 'Grievance' ? 'cat-grievance' : 'cat-infrastructure',
      timeline: complaint.timeline || [
        { title: 'Complaint Filed', time: complaint.date, desc: complaint.details || 'Complaint submitted by resident for initial review.' },
        { title: 'Under Review', time: 'Pending', desc: 'Assigned to committee for evaluation.' }
      ]
    };
    setSelectedComplaint(enhancedComplaint);
    setActiveTab('detail');
  };

  const handleBackToList = () => {
    setSelectedComplaint(null);
    setActiveTab('list');
  };

  return (
    <div className="tenant-page-container">
      <header className="topbar">
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{userInfo.name}</span>
            <span className="user-role">{userInfo.role}</span>
          </div>
          <div className="user-avatar">{userInfo.initials}</div>
        </div>
      </header>

      <div className="main-content-wrapper">
        {activeTab === 'list' ? (
          <div className="complaints-main-container">
            <div className="member-standing-card">
              <div className="standing-icon">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <strong>Tenant Standing:</strong> Your account is in green status. You are permitted to submit new formal concerns.
              </div>
            </div>

            <div className="form-card">
              <div className="form-card-header">
                <h2>Submit a New Complaint</h2>
                <p>Please provide details and any supporting evidence for your concern.</p>
              </div>
              <form onSubmit={handleSubmitComplaint} className="form-card-body">
                <div className="form-grid-layout">
                  <div className="form-group">
                    <label>SUBJECT</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Broken perimeter fence"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>CATEGORY</label>
                    <select
                      className="form-input form-select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Public Relations">Public Relations</option>
                      <option value="Financial">Financial</option>
                      <option value="Grievance">Grievance</option>
                      <option value="Infrastructure">Infrastructure</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>DETAILS</label>
                    <textarea
                      className="form-input form-textarea"
                      placeholder="Provide a brief summary of the issue..."
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>UPLOAD PHOTOS OR EVIDENCE</label>
                    <div className="dropzone-box" style={{ cursor: 'pointer', position: 'relative' }}>
                      <input
                        type="file"
                        id="evidenceFileInput"
                        style={{ display: 'none' }}
                        onChange={(e) => setEvidenceFile(e.target.files[0])}
                      />
                      <label htmlFor="evidenceFileInput" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                        <UploadCloud size={22} className="dropzone-icon" />
                        <strong>{evidenceFile ? evidenceFile.name : 'Upload or drag and drop images'}</strong>
                        <span>JPG, PNG (Max 5MB)</span>
                      </label>
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-submit-complaint" disabled={submitting}>
                  {submitting ? 'SUBMITTING...' : 'FILE FORMAL COMPLAINT'}
                </button>
              </form>
            </div>

            <div className="active-complaints-section">
              <div className="section-header">
                <h3>
                  <AlertCircle size={18} /> Active Complaints
                </h3>
                <span className="total-count">Total: {complaintsList.length}</span>
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
                    {loading ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>Loading complaints...</td>
                      </tr>
                    ) : complaintsList.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>No active complaints filed yet.</td>
                      </tr>
                    ) : (
                      complaintsList.map((item, index) => {
                        const catClass = item.category === 'Financial' ? 'cat-financial' : item.category === 'Grievance' ? 'cat-grievance' : 'cat-infrastructure';
                        const statClass = item.status === 'RESOLVED' ? 'pill-resolved' : item.status === 'INVESTIGATING' ? 'pill-investigating' : 'pill-active';
                        return (
                          <tr key={item.id || index} className="table-row" onClick={() => handleRowClick(item)}>
                            <td>{item.date}</td>
                            <td className="subject-cell">{item.subject}</td>
                            <td>
                              <span className={`cat-badge ${catClass}`}>{item.category.toUpperCase()}</span>
                            </td>
                            <td>
                              <span className={`status-pill ${statClass}`}>{item.status}</span>
                            </td>
                            <td className="arrow-cell"><ChevronRight size={16} /></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="complaints-main-container" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button 
              onClick={handleBackToList}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                color: '#374151',
                width: 'fit-content',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <ArrowLeft size={16} /> Back to Complaints
            </button>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', color: '#6b7280', fontSize: '0.9rem' }}>{selectedComplaint?.id || 'P3-0040'}</span>
                <span className={`status-pill ${selectedComplaint?.statusClass}`}>{selectedComplaint?.status}</span>
                <span className={`cat-badge ${selectedComplaint?.categoryClass}`}>{selectedComplaint?.category?.toUpperCase()}</span>
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', margin: 0 }}>{selectedComplaint?.subject}</h1>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.5' }}>{selectedComplaint?.details}</p>
            </div>

            <div className="card" style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.05rem', fontWeight: '600', color: '#059669', marginBottom: '20px', marginTop: 0 }}>
                <Clock size={18} /> Complaint Timeline & Updates
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {selectedComplaint?.timeline?.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', position: 'relative', paddingBottom: i < selectedComplaint.timeline.length - 1 ? '20px' : '0' }}>
                    {i < selectedComplaint.timeline.length - 1 && (
                      <div style={{ position: 'absolute', left: '14px', top: '28px', bottom: '-4px', width: '2px', backgroundColor: '#e5e7eb' }}></div>
                    )}
                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', flexShrink: 0, zIndex: 1, border: '2px solid #ffffff', boxShadow: '0 0 0 1px #d1fae5' }}>✓</div>
                    <div style={{ flex: 1, background: '#f9fafb', padding: '14px 16px', borderRadius: '8px', border: '1px solid #f3f4f6' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.95rem', color: '#111827' }}>{t.title}</strong>
                        <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '500', background: '#e5e7eb', padding: '2px 8px', borderRadius: '4px' }}>{t.time}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', lineHeight: '1.4' }}>{t.desc}</p>
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