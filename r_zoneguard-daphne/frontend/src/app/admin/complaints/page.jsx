'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Eye, MapPin, X, CheckCircle2 
} from 'lucide-react';

export default function ComplaintsPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [complaints, setComplaints] = useState([]);
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState('All Complaints');
  const [selectedZone, setSelectedZone] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modal states
  const [activeModal, setActiveModal] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  
  // Form fields for modals
  const [resolutionNote, setResolutionNote] = useState('');
  const [updateStatusVal, setUpdateStatusVal] = useState('');
  const [updateDescVal, setUpdateDescVal] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');

  const categories = ['All Complaints', 'Infrastructure', 'Public Relations', 'Grievance', 'Financial', 'Beautification', 'Sport', 'Resolved'];
  const zones = ['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'];

  useEffect(() => {
    setSearchQuery(queryParam);
    setCurrentPage(1);
  }, [queryParam]);

  const cleanAddress = (c) => {
    if (!c) return 'Zone 3, NIA Subdivision';
    let addr = typeof c === 'string' ? c : (c.address || '');
    if (!addr) return 'Zone 3, NIA Subdivision';

    const zoneMatch = addr.match(/Zone\s*\d+/i);
    const zoneDisplay = zoneMatch ? zoneMatch[0].replace(/zone/i, 'Zone').trim() : 'Zone 3';

    let cleaned = addr
      .replace(/Zone\s*\d+/gi, '')
      .replace(/NIA\s*Subdivision/gi, '')
      .replace(/Tandang Sora/gi, '')
      .replace(/,+/g, ' ')
      .trim();

    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    return cleaned ? `${zoneDisplay}, NIA Subdivision, ${cleaned}` : `${zoneDisplay}, NIA Subdivision`;
  };

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      let url = 'http://localhost:5000/api/complaints?';
      if (selectedCategory !== 'All Complaints') {
        url += `category=${encodeURIComponent(selectedCategory)}&`;
      }
      if (selectedZone) {
        url += `zone=${encodeURIComponent(selectedZone)}&`;
      }
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (Array.isArray(data)) {
        setComplaints(data);
      } else {
        setComplaints([]);
      }
    } catch (err) {
      console.error('Failed to fetch complaints from API', err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedZone, searchQuery]);

  const handleResolveSubmit = async () => {
    if (!selectedComplaint) return;
    const ticketId = selectedComplaint.ticket_id;
    try {
      await fetch(`http://localhost:5000/api/complaints/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED', resolution_note: resolutionNote })
      });
    } catch (err) {
      console.error('Failed to resolve complaint on backend', err);
    }
    setComplaints(prev => prev.map(c => c.ticket_id === ticketId ? { ...c, complaint_status: 'RESOLVED', status: 'RESOLVED', priority_score: 0 } : c));
    setActiveModal(null);
    setResolutionNote('');
  };

  const handleUpdateStatusSubmit = async () => {
    if (!selectedComplaint) return;
    const ticketId = selectedComplaint.ticket_id;
    try {
      await fetch(`http://localhost:5000/api/complaints/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updateStatusVal, description: updateDescVal })
      });
    } catch (err) {
      console.error('Failed to update status on backend', err);
    }
    setComplaints(prev => prev.map(c => c.ticket_id === ticketId ? { ...c, complaint_status: updateStatusVal, status: updateStatusVal } : c));
    setSelectedComplaint(prev => ({ ...prev, complaint_status: updateStatusVal, status: updateStatusVal }));
    setActiveModal('success_update');
  };

  const handleEscalateSubmit = async () => {
    if (!selectedComplaint) return;
    const ticketId = selectedComplaint.ticket_id;
    try {
      await fetch(`http://localhost:5000/api/complaints/${ticketId}/escalate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: escalationReason, director: selectedDirector })
      });
    } catch (err) {
      console.error('Failed to escalate complaint on backend', err);
    }
    setComplaints(prev => prev.map(c => c.ticket_id === ticketId ? { ...c, complaint_status: 'ESCALATED', status: 'ESCALATED' } : c));
    setActiveModal('success_escalate');
  };

  const openDetailModal = async (ticketId) => {
    const found = complaints.find(c => c.ticket_id === ticketId);
    if (found) {
      setSelectedComplaint(found);
      setActiveModal('view');
    } else {
      try {
        const res = await fetch(`http://localhost:5000/api/complaints/${ticketId}`);
        const data = await res.json();
        setSelectedComplaint(data);
        setActiveModal('view');
      } catch (err) {
        console.error('Failed to fetch complaint details', err);
      }
    }
  };

  const getEffectivePriority = (c) => {
    const status = (c.complaint_status || c.status || '').toUpperCase();
    if (status === 'RESOLVED') return 0;
    const raw = Number(c.priority_score) || 5;
    return Math.min(10, Math.max(1, raw));
  };

  const filteredComplaints = complaints.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const ticketId = String(c.ticket_id || '').toLowerCase();
    const residentName = String(c.name || '').toLowerCase();
    const subject = String(c.complaint_subject || '').toLowerCase();
    const addressStr = String(c.address || '').toLowerCase();

    return ticketId.includes(q) || 
           residentName.includes(q) || 
           subject.includes(q) || 
           addressStr.includes(q);
  });

  filteredComplaints.sort((a, b) => {
    const pA = getEffectivePriority(a);
    const pB = getEffectivePriority(b);
    if (pB !== pA) return pB - pA;
    const dateA = new Date(a.date_filled || a.created_at || 0).getTime();
    const dateB = new Date(b.date_filled || b.created_at || 0).getTime();
    return dateA - dateB;
  });

  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentComplaints = filteredComplaints.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryBadgeStyle = (category) => {
    const catUpper = (category || '').toUpperCase();
    let bg = '#f1f5f9';
    if (catUpper.includes('SPORT') || catUpper.includes('SPORTS')) bg = '#fbcfe8';
    else if (catUpper.includes('GRIEVANCE')) bg = '#fbcfe8';
    else if (catUpper.includes('FINANCIAL')) bg = '#fef08a';
    else if (catUpper.includes('INFRASTRUCTURE')) bg = '#ccfbf1';
    else if (catUpper.includes('PUBLIC')) bg = '#e0f2fe';
    else if (catUpper.includes('BEAUTIFICATION')) bg = '#dcfce7';

    return {
      padding: '4px 12px',
      borderRadius: '9999px',
      fontSize: '11px',
      fontWeight: '700',
      backgroundColor: bg,
      color: '#000000',
      display: 'inline-block',
      textAlign: 'center',
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap'
    };
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 'bold', color: '#064e3b', margin: '0 0 4px 0' }}>Community Complaint Queue</h1>
        <p style={{ color: '#64748b', margin: 0, fontSize: '13px' }}>Managing community wellness and reported environmental incidents.</p>
      </div>

      {/* Category Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
            style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              border: '1px solid #cbd5e1',
              backgroundColor: selectedCategory === cat ? '#064e3b' : '#ffffff',
              color: selectedCategory === cat ? '#ffffff' : '#334155',
              transition: 'all 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Zone Filters */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {zones.map((zone) => (
          <button
            key={zone}
            onClick={() => { setSelectedZone(selectedZone === zone ? '' : zone); setCurrentPage(1); }}
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '11px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: '1px solid #cbd5e1',
              backgroundColor: selectedZone === zone ? '#047857' : '#ffffff',
              color: selectedZone === zone ? '#ffffff' : '#334155'
            }}
          >
            {zone}
          </button>
        ))}
      </div>

      {/* Complaints Table */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>
              <th style={{ padding: '16px', width: '110px' }}>Ticket #</th>
              <th style={{ padding: '16px', width: '280px' }}>Resident</th>
              <th style={{ padding: '16px', width: '140px' }}>Category</th>
              <th style={{ padding: '16px', width: '120px' }}>Status</th>
              <th style={{ padding: '16px', width: '80px' }}>Priority</th>
              <th style={{ padding: '16px', width: '200px' }}>Complaint Subject</th>
              <th style={{ padding: '16px', width: '140px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>Loading complaints...</td>
              </tr>
            ) : currentComplaints.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>No records found matching filters.</td>
              </tr>
            ) : (
              currentComplaints.map((c) => {
                const formattedAddr = cleanAddress(c);
                const effectivePriority = getEffectivePriority(c);
                const isResolved = (c.complaint_status || c.status) === 'RESOLVED';

                return (
                  <tr key={c.ticket_id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px', fontFamily: 'monospace', fontWeight: 'bold', color: '#0f172a', whiteSpace: 'nowrap' }}>{c.ticket_id}</td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ backgroundColor: c.bgColor || '#064e3b', width: '36px', height: '36px', minWidth: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 'bold', fontSize: '12px' }}>
                          {c.init || (c.name ? c.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'US')}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <div style={{ fontWeight: '600', color: '#0f172a', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formattedAddr}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={getCategoryBadgeStyle(c.complaint_category)}>
                        {c.complaint_category}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 'bold', color: '#ffffff', backgroundColor: isResolved ? '#059669' : (c.complaint_status || c.status) === 'ESCALATED' ? '#2563eb' : (c.complaint_status || c.status) === 'INVESTIGATING' ? '#d97706' : '#dc2626', whiteSpace: 'nowrap' }}>
                        {c.complaint_status || c.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 'bold', color: isResolved ? '#94a3b8' : '#dc2626' }}>
                      {effectivePriority}
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button onClick={() => openDetailModal(c.ticket_id)} style={{ background: 'none', border: 'none', color: '#064e3b', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', padding: 0, textAlign: 'left', fontSize: '13px', width: '100%' }}>
                        <span style={{ textDecoration: 'underline', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.complaint_subject}</span> 
                        <Eye size={15} style={{ color: '#047857', flexShrink: 0 }} />
                      </button>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedComplaint(c);
                            setActiveModal('resolve');
                          }}
                          style={{ padding: '6px 12px', backgroundColor: '#064e3b', color: '#ffffff', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => openDetailModal(c.ticket_id)}
                          style={{ padding: '6px 8px', backgroundColor: '#f1f5f9', color: '#064e3b', border: '1px solid #cbd5e1', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title="Map Location"
                        >
                          <MapPin size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>&lt;</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button key={num} onClick={() => setCurrentPage(num)} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontWeight: currentPage === num ? 'bold' : 'normal', backgroundColor: currentPage === num ? '#064e3b' : '#ffffff', color: currentPage === num ? '#ffffff' : '#334155', cursor: 'pointer' }}>
            {num}
          </button>
        ))}
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>&gt;</button>
      </div>

      {/* ================= MODALS ================= */}

      {/* 1. MARK AS RESOLVED MODAL */}
      {activeModal === 'resolve' && selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '28px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: '#ecfdf5', color: '#059669', borderRadius: '8px' }}><CheckCircle2 size={24} /></div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#064e3b', margin: 0 }}>Mark as Resolved</h2>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Ticket # {selectedComplaint.ticket_id}</p>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Resolution Note</label>
              <textarea
                placeholder='e.g., "Issue has been resolved."...'
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleResolveSubmit} style={{ flex: 1, padding: '12px', backgroundColor: '#00873e', color: '#ffffff', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                ✓ MARK AS RESOLVED
              </button>
              <button onClick={() => setActiveModal(null)} style={{ padding: '12px 20px', backgroundColor: '#dc2626', color: '#ffffff', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                ✕ CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. VIEW MODAL */}
      {activeModal === 'view' && selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '780px', width: '100%', padding: '32px', position: 'relative', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#064e3b', zIndex: 5 }}><X size={22} /></button>

            <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Subject</span>
                <h3 style={{ fontSize: '17px', fontWeight: 'bold', color: '#0f172a', margin: '4px 0 0 0' }}>{selectedComplaint.complaint_subject || selectedComplaint.subject}</h3>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' }}>Description</span>
                <p style={{ fontSize: '13px', color: '#334155', margin: '4px 0 0 0', lineHeight: '1.5' }}>{selectedComplaint.description || selectedComplaint.complaint_desc || 'No description provided.'}</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#064e3b', borderRadius: '12px', padding: '24px', color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 18px 0', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '12px' }}>
                  TICKET # {selectedComplaint.ticket_id}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#a7f3d0', fontSize: '10px', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>Uploaded by:</span>
                    <span style={{ fontWeight: '600' }}>{selectedComplaint.uploaded_by || selectedComplaint.name}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a7f3d0', fontSize: '10px', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>Address:</span>
                    <span>{cleanAddress(selectedComplaint)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#a7f3d0', fontSize: '10px', textTransform: 'uppercase', display: 'block', fontWeight: 'bold' }}>Status</span>
                    <span>{selectedComplaint.complaint_status || selectedComplaint.status}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                <button onClick={() => setActiveModal('escalate')} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '8px', color: '#ffffff', fontWeight: '600', cursor: 'pointer', textAlign: 'center', fontSize: '13px' }}>
                  Escalate to Director
                </button>
                <button onClick={() => setActiveModal('update_status')} style={{ width: '100%', padding: '10px', backgroundColor: '#ffffff', border: 'none', borderRadius: '8px', color: '#064e3b', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', fontSize: '13px' }}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. UPDATE STATUS MODAL */}
      {activeModal === 'update_status' && selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '28px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#064e3b', marginBottom: '16px' }}>Update Complaint Status</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>New Status</label>
              <select
                value={updateStatusVal}
                onChange={(e) => setUpdateStatusVal(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }}
              >
                <option value="">Select Status...</option>
                <option value="Investigating">Investigating</option>
                <option value="Escalated">Escalated</option>
                <option value="Resolved">Resolved</option>
                <option value="Active">Active</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Description</label>
              <textarea
                value={updateDescVal}
                onChange={(e) => setUpdateDescVal(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleUpdateStatusSubmit} style={{ flex: 1, padding: '12px', backgroundColor: '#00873e', color: '#ffffff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                UPDATE STATUS
              </button>
              <button onClick={() => setActiveModal(null)} style={{ padding: '12px 20px', backgroundColor: '#dc2626', color: '#ffffff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. ESCALATE MODAL */}
      {activeModal === 'escalate' && selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '28px', position: 'relative' }}>
            <button onClick={() => setActiveModal(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={20} /></button>
            
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#064e3b', marginBottom: '16px' }}>Escalate to Director</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Escalation Reason</label>
              <select
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }}
              >
                <option value="">Select a reason...</option>
                <option value="Unresolved Action Delay">Unresolved Action Delay</option>
                <option value="Policy Violation / Dispute">Policy Violation / Dispute</option>
                <option value="Financial Discrepancy">Financial Discrepancy</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#475569', textTransform: 'uppercase', marginBottom: '6px' }}>Target Zone Director</label>
              <select
                value={selectedDirector}
                onChange={(e) => setSelectedDirector(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#fff' }}
              >
                <option value="">Select a director...</option>
                <option value="Zone 1">Zone 1</option>
                <option value="Zone 2">Zone 2</option>
                <option value="Zone 3">Zone 3</option>
                <option value="Zone 4">Zone 4</option>
                <option value="Zone 5">Zone 5</option>
                <option value="Zone 6">Zone 6</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={handleEscalateSubmit} style={{ flex: 1, padding: '12px', backgroundColor: '#00873e', color: '#ffffff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                ESCALATE
              </button>
              <button onClick={() => setActiveModal(null)} style={{ padding: '12px 20px', backgroundColor: '#dc2626', color: '#ffffff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUCCESS MODALS */}
      {(activeModal === 'success_update' || activeModal === 'success_escalate') && selectedComplaint && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 70, padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', padding: '32px', textAlign: 'center', position: 'relative' }}>
            <div style={{ width: '52px', height: '52px', backgroundColor: '#a7f3d0', color: '#064e3b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '22px', fontWeight: 'bold' }}>
              ✓
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#064e3b', margin: '0 0 4px 0' }}>Successfully Processed!</h2>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>Ticket # {selectedComplaint.ticket_id} has been updated.</p>
            <button onClick={() => setActiveModal(null)} style={{ width: '100%', padding: '12px', backgroundColor: '#064e3b', color: '#ffffff', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}