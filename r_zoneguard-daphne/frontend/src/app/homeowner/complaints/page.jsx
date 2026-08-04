'use client';

import React, { useState } from 'react';

// SVGs matched precisely to the dashboard design system
const Icons = {
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  upload: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
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
  ),
  arrowLeft: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
};

const mockComplaints = [
  {
    id: '#G3-0002',
    date: 'May 04, 2026',
    subject: 'Not paying credit to person A',
    category: 'FINANCIAL',
    status: 'Active',
    description: 'Concerns regarding outstanding community financial obligations.',
    timeline: [
      { status: 'Submitted', time: 'May 04, 2026 • 10:00 AM', desc: 'Ticket logged successfully.' }
    ]
  },
  {
    id: '#G3-0001',
    date: 'February 01, 2026',
    subject: 'Unauthorized parking in A Street',
    category: 'GRIEVANCE',
    status: 'Investigating',
    description: 'May nagparking sa harap ng garahe ko. Nde ko malabas motor ko. plz help. We tried negotiating pero mukhang siya pa may ganang magalit kahit na sabihin naming bawal magparking sa driveway.',
    timeline: [
      { status: 'Submitted', time: 'Feb 01, 2026 • 09:14 AM', desc: 'Ticket successfully received and logged into the maintenance queue.' },
      { status: 'Investigating', time: 'Feb 01, 2026 • 02:00 PM', desc: 'Worker is on-site investigating.' }
    ]
  },
  {
    id: '#G3-0000',
    date: 'Mar 2026',
    subject: 'Flickering lights',
    category: 'INFRASTRUCTURE',
    status: 'Resolved',
    description: 'Streetlight near Lot 4 is flickering intermittently.',
    timeline: [
      { status: 'Submitted', time: 'Mar 10, 2026 • 08:30 AM', desc: 'Issue logged.' },
      { status: 'Resolved', time: 'Mar 11, 2026 • 01:15 PM', desc: 'Bulb replaced by maintenance.' }
    ]
  }
];

export default function HomeownerComplaintsPage() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  return (
    <div>
      {selectedComplaint ? (
        /* DETAILED VIEW */
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <button 
            onClick={() => setSelectedComplaint(null)} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#064e3b', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', marginBottom: '24px', padding: 0 }}
          >
            {Icons.arrowLeft} Back to My Complaints
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800' }}>{selectedComplaint.id}</span>
            <span style={{ 
              backgroundColor: selectedComplaint.status === 'Active' ? '#fef3c7' : selectedComplaint.status === 'Investigating' ? '#e0f2fe' : '#d1fae5',
              color: selectedComplaint.status === 'Active' ? '#92400e' : selectedComplaint.status === 'Investigating' ? '#0369a1' : '#065f46',
              padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' 
            }}>
              {selectedComplaint.status}
            </span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: '900', color: '#0f172a', marginBottom: '24px', marginTop: 0 }}>{selectedComplaint.subject}</h1>

          {/* PROGRESSION TICKET CARD */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px 32px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>⏱</span> Complaint Progression
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedComplaint.timeline.map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#d1fae5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {Icons.check}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: '800' }}>{item.status}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{item.time}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: '1.4' }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMISSION DETAILS CARD */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px 32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#064e3b', margin: '0 0 20px 0' }}>Original Submission Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>SUBJECT</span>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{selectedComplaint.subject}</p>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>CATEGORY</span>
                <p style={{ fontSize: '0.9rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{selectedComplaint.category}</p>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px', letterSpacing: '0.5px' }}>DESCRIPTION</span>
              <p style={{ fontSize: '0.9rem', color: '#334155', margin: 0, lineHeight: '1.5' }}>{selectedComplaint.description}</p>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.5px' }}>PHOTO EVIDENCE (2)</span>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '100px', height: '100px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}></div>
                <div style={{ width: '100px', height: '100px', backgroundColor: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAIN COMPLAINTS LIST VIEW */
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* MEMBER STANDING BANNER */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '14px', padding: '18px 24px', marginBottom: '28px', color: '#065f46', fontSize: '0.9rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {Icons.check}
            </div>
            <div>
              <strong style={{ fontWeight: '800' }}>Member Standing:</strong>
              <span> Your account is in green status. You are permitted to submit new formal concerns.</span>
            </div>
          </div>

          {/* SUBMIT COMPLAINT FORM CARD */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', marginBottom: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>Submit a New Complaint</h2>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0 }}>Please provide details and any supporting evidence for your concern.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>SUBJECT</label>
                  <input type="text" placeholder="e.g. Broken perimeter fence" style={{ width: '100%', padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>CATEGORY</label>
                  <select style={{ width: '100%', padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', cursor: 'pointer' }}>
                    <option>Public Relations</option>
                    <option>Grievance</option>
                    <option>Financial</option>
                    <option>Infrastructure</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>DETAILS</label>
                  <textarea placeholder="Provide a brief summary of the issue..." style={{ width: '100%', height: '120px', padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}></textarea>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>UPLOAD PHOTOS OR EVIDENCE</label>
                  <div style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '120px', boxSizing: 'border-box', cursor: 'pointer' }}>
                    <div style={{ marginBottom: '8px' }}>{Icons.upload}</div>
                    <strong style={{ fontSize: '0.8rem', color: '#0f172a', fontWeight: '700', display: 'block' }}>Upload or drag and drop images</strong>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>JPG, PNG (Max 5MB)</span>
                  </div>
                </div>
              </div>

              <button style={{ backgroundColor: '#064e3b', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '14px 24px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '8px' }}>
                FILE FORMAT COMPLAINT
              </button>
            </div>
          </div>

          {/* ACTIVE COMPLAINTS SECTION */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {Icons.list}
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#064e3b', margin: 0 }}>Active Complaints</h3>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>Total: {mockComplaints.length}</span>
            </div>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '14px 32px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>DATE</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>SUBJECT</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>CATEGORY</th>
                    <th style={{ padding: '14px 20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px' }}>STATUS</th>
                    <th style={{ padding: '14px 32px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', letterSpacing: '0.5px', textAlign: 'right' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {mockComplaints.map((item, index) => (
                    <tr 
                      key={item.id} 
                      onClick={() => setSelectedComplaint(item)} 
                      style={{ borderBottom: index !== mockComplaints.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}
                    >
                      <td style={{ padding: '20px 32px', fontSize: '0.85rem', fontWeight: '600', color: '#334155' }}>{item.date}</td>
                      <td style={{ padding: '20px 20px', fontSize: '0.9rem', fontWeight: '800', color: '#0f172a' }}>{item.subject}</td>
                      <td style={{ padding: '20px 20px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-block' }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '20px 20px' }}>
                        <span style={{ 
                          backgroundColor: item.status === 'Active' ? '#fef3c7' : item.status === 'Investigating' ? '#e0f2fe' : '#d1fae5',
                          color: item.status === 'Active' ? '#92400e' : item.status === 'Investigating' ? '#0369a1' : '#065f46',
                          padding: '4px 10px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '800', display: 'inline-block' 
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: '20px 32px', textAlign: 'right', color: '#94a3b8', fontWeight: '700' }}>&gt;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}