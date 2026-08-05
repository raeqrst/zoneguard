'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './style.css';

function ComplaintsContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';

  const [isDelinquent, setIsDelinquent] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('Public Relations');
  const [details, setDetails] = useState('');
  const [evidenceFile, setEvidenceFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data states
  const [complaints, setComplaints] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      const dashboardUrl = new URL('http://localhost:5000/api/homeowner/dashboard');
      if (propertyId) dashboardUrl.searchParams.append('propertyId', propertyId);
      if (loggedInUserId) dashboardUrl.searchParams.append('userId', loggedInUserId);

      const dashboardRes = await fetch(dashboardUrl.toString());
      const dashboardData = await dashboardRes.json();

      if (dashboardRes.ok && dashboardData.dues) {
        setIsDelinquent(dashboardData.dues.isDelinquent);
      }

      const complaintsUrl = new URL('http://localhost:5000/api/homeowner/complaints');
      if (propertyId) complaintsUrl.searchParams.append('propertyId', propertyId);
      if (loggedInUserId) complaintsUrl.searchParams.append('userId', loggedInUserId);

      const complaintsRes = await fetch(complaintsUrl.toString());
      const complaintsData = await complaintsRes.json();

      if (complaintsRes.ok) {
        setComplaints(complaintsData.complaints || []);
      }
    } catch (err) {
      console.error('Failed to load complaints data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [propertyId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setEvidenceFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !details.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const response = await fetch('http://localhost:5000/api/homeowner/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          userId: loggedInUserId,
          subject: subject.trim(),
          category,
          details: details.trim(),
          evidenceUrl: evidenceFile ? evidenceFile.name : null
        })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Complaint submitted successfully!');
        setSubject('');
        setDetails('');
        setEvidenceFile(null);
        fetchData();
      } else {
        alert('Failed to submit complaint: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Complaint submission error:', error);
      alert('Network error while submitting complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#6b7280' }}>Loading complaints data...</div>;
  }

  return (
    <div className="cmp-container">
      {/* 1. Page Title Header */}
      <div className="page-title-section" style={{ marginBottom: '24px' }}>
        <h1>Complaints &amp; Feedback</h1>
        <p>Submit official homeowner concerns and track resolution status in real-time.</p>
      </div>

      {isDelinquent ? (
        /* RESTRICTED VIEW (Arrears) */
        <>
          {/* Member Standing Warning Banner */}
          <div className="cmp-banner cmp-banner-warning">
            <div className="cmp-banner-icon cmp-banner-icon-warning">!</div>
            <div>
              <strong>Member Standing:</strong> Your account has outstanding balances. Submission of new formal concerns is restricted.
            </div>
          </div>

          {/* Locked Restricted Card matching the visual style */}
          <div className="cmp-card cmp-locked-card">
            <div className="cmp-locked-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h2>Submission Restricted: Account with Arrears</h2>
            <p>Your account has outstanding balances. Please settle your remaining dues to regain access to the formal complaint system.</p>
          </div>
        </>
      ) : (
        /* ACTIVE VIEW (Good Standing) */
        <>
          {/* 2. Member Standing Banner */}
          <div className="cmp-banner">
            <div className="cmp-banner-icon">✓</div>
            <div>
              <strong>Member Standing:</strong> Your account is in green status. You are permitted to submit new formal concerns.
            </div>
          </div>

          {/* 3. Two-Column Grid Layout */}
          <div className="cmp-grid">
            {/* Left Column (Main Form & Table) */}
            <div className="cmp-left-col">
              {/* Submit Card */}
              <div className="cmp-card">
                <div className="cmp-card-title">
                  <div className="cmp-icon-box">✍️</div>
                  <h3>Submit a New Complaint</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginTop: '-12px', marginBottom: '20px' }}>
                  Please provide details and any supporting evidence for your concern.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="cmp-form-grid">
                    <div className="cmp-form-group">
                      <label className="cmp-label">SUBJECT</label>
                      <input
                        type="text"
                        className="cmp-input"
                        placeholder="e.g. Broken perimeter fence"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                      />
                    </div>
                    <div className="cmp-form-group">
                      <label className="cmp-label">CATEGORY</label>
                      <select className="cmp-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Public Relations">Public Relations</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Security">Security</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Financial">Financial</option>
                        <option value="General">General</option>
                      </select>
                    </div>
                  </div>

                  <div className="cmp-form-grid">
                    <div className="cmp-form-group">
                      <label className="cmp-label">DETAILS</label>
                      <textarea
                        className="cmp-textarea"
                        placeholder="Provide a brief summary of the issue..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="cmp-form-group">
                      <label className="cmp-label">UPLOAD PHOTOS OR EVIDENCE</label>
                      <label className="cmp-upload-box" style={{ cursor: 'pointer' }}>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} style={{ display: 'none' }} />
                        <span style={{ fontSize: '1.2rem', color: '#044e3a' }}>↑</span>
                        <strong>{evidenceFile ? evidenceFile.name : 'Upload or drag and drop images'}</strong>
                        <span>JPG, PNG (Max 5MB)</span>
                      </label>
                    </div>
                  </div>

                  <div className="cmp-action-row">
                    <button type="submit" className="cmp-btn-primary" disabled={isSubmitting}>
                      {isSubmitting ? 'SUBMITTING...' : 'FILE FORMAL COMPLAINT'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Active Complaints Card */}
              <div className="cmp-card">
                <div className="cmp-linked-header">
                  <h3>Active Complaints</h3>
                  <span className="cmp-badge-count">Total: {complaints.length}</span>
                </div>

                <div className="cmp-table-wrapper">
                  <table className="cmp-table">
                    <thead>
                      <tr>
                        <th>DATE</th>
                        <th>SUBJECT</th>
                        <th>CATEGORY</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.length > 0 ? (
                        complaints.map((c, idx) => (
                          <tr key={idx}>
                            <td>{new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
                            <td><strong>#{c.ticketId}</strong> - {c.complaintSubject}</td>
                            <td>{c.complaintCategory}</td>
                            <td>
                              <span className={`cmp-status-badge-${(c.status || 'PENDING').toLowerCase()}`}>
                                {c.status || 'PENDING'}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="cmp-empty-state">No complaints filed yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column (Sidebar Guidelines) */}
            <div className="cmp-right-col">
              <div className="cmp-card">
                <div className="cmp-linked-header">
                  <h3>Complaint Guidelines</h3>
                </div>
                <ul className="cmp-guidelines-list">
                  <li>Urgent security matters should be reported directly to the HOA gate officer.</li>
                  <li>Allow 24–48 hours for director review and escalation updates.</li>
                  <li>Photos attached will be encrypted and visible only to assigned directors.</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function ComplaintsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: '#6b7280' }}>Loading complaints...</div>}>
      <ComplaintsContent />
    </Suspense>
  );
}