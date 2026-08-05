'use client';

import React from 'react';
import './style.css';

export default function ComplaintsPage() {
  return (
    <div className="cmp-container">
      {/* 1. Page Title Header */}
      <div className="page-title-section" style={{ marginBottom: '24px' }}>
        <h1>Complaints &amp; Feedback</h1>
        <p>Submit official homeowner concerns and track resolution status in real-time.</p>
      </div>

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

            <form onSubmit={(e) => e.preventDefault()}>
              <div className="cmp-form-grid">
                <div className="cmp-form-group">
                  <label className="cmp-label">SUBJECT</label>
                  <input type="text" className="cmp-input" placeholder="e.g. Broken perimeter fence" />
                </div>
                <div className="cmp-form-group">
                  <label className="cmp-label">CATEGORY</label>
                  <select className="cmp-select">
                    <option>Public Relations</option>
                    <option>Maintenance</option>
                    <option>Security</option>
                    <option>Noise Complaint</option>
                  </select>
                </div>
              </div>

              <div className="cmp-form-grid">
                <div className="cmp-form-group">
                  <label className="cmp-label">DETAILS</label>
                  <textarea className="cmp-textarea" placeholder="Provide a brief summary of the issue..."></textarea>
                </div>
                <div className="cmp-form-group">
                  <label className="cmp-label">UPLOAD PHOTOS OR EVIDENCE</label>
                  <div className="cmp-upload-box">
                    <span style={{ fontSize: '1.2rem', color: '#044e3a' }}>↑</span>
                    <strong>Upload or drag and drop images</strong>
                    <span>JPG, PNG (Max 5MB)</span>
                  </div>
                </div>
              </div>

              <div className="cmp-action-row">
                <button type="submit" className="cmp-btn-primary">FILE FORMAL COMPLAINT</button>
              </div>
            </form>
          </div>

          {/* Active Complaints Card */}
          <div className="cmp-card">
            <div className="cmp-linked-header">
              <h3>Active Complaints</h3>
              <span className="cmp-badge-count">Total: 0</span>
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
                  <tr>
                    <td colSpan="4" className="cmp-empty-state">No complaints filed yet.</td>
                  </tr>
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
    </div>
  );
}