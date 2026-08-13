'use client';

import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { useSearchParams } from 'next/navigation';
import './style.css';

const AVATAR_COLORS = [
  '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#0891B2', '#4F46E5',
];

function getConsistentColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatAddressEntry(addrObj) {
  if (!addrObj) return '';
  
  const houseNo = addrObj.houseNo || addrObj.house_no;
  const street = addrObj.street || addrObj.lot_number_street || '';
  const lotNumber = addrObj.lotNumber || addrObj.lot_number || addrObj.lot;

  if (houseNo !== undefined && houseNo !== null && String(houseNo).trim() !== '') {
    return `${String(houseNo).trim()}${street ? ` ${street}` : ''}`;
  } else if (lotNumber !== undefined && lotNumber !== null && String(lotNumber).trim() !== '') {
    const cleanLot = String(lotNumber).replace(/^lot\s*/i, '').trim();
    return `Lot ${cleanLot}${street ? ` ${street}` : ''}`;
  }
  
  return addrObj.address || '';
}

function getStatusTone(statusStr) {
  const status = (statusStr || '').toLowerCase();
  if (status === 'approved') return 'green';
  if (status === 'rejected') return 'red';
  return 'yellow';
}

=======
import './style.css';

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
export default function TenantManagementPage() {
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All Tenants');
  const [searchQuery, setSearchQuery] = useState('');
<<<<<<< HEAD
  
  // 🔥 Catch Next.js URL query params from the top navbar search bar
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get('q') || searchParams.get('search') || '';

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const [activeView, setActiveView] = useState('list');
  const [selectedTenant, setSelectedTenant] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [updateStatusValue, setUpdateStatusValue] = useState('');
  const [statusDescription, setStatusDescription] = useState('');
  
  const [successModalData, setSuccessModalData] = useState({ title: '', desc: '', color: '#065F46' });
  const [isUpdating, setIsUpdating] = useState(false);
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

  useEffect(() => {
    const fetchTenants = async () => {
      setIsLoading(true);
      try {
<<<<<<< HEAD
        // Combine inner input search and top navbar URL search
        const activeSearch = searchQuery || urlSearch;

        let url = `http://localhost:5000/api/tenant_management?`;
        if (selectedFilter && selectedFilter !== 'All Tenants') url += `filter=${encodeURIComponent(selectedFilter)}&`;
        if (activeSearch) url += `search=${encodeURIComponent(activeSearch)}`;
=======
        let url = `/api/tenant_management?`;
        if (selectedFilter) url += `filter=${encodeURIComponent(selectedFilter)}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
<<<<<<< HEAD
          const groupedMap = {};
          
          data.tenants.forEach(row => {
            const key = row.resident.name;
            const formattedAddr = formatAddressEntry(row.resident);

            if (!groupedMap[key]) {
              groupedMap[key] = {
                ...row,
                resident: {
                  ...row.resident,
                  bgColor: getConsistentColor(row.resident.name),
                  rawAddresses: [formattedAddr]
                },
                tenant: {
                  ...row.tenant,
                  bgColor: getConsistentColor(row.tenant.name)
                }
              };
            } else {
              if (!groupedMap[key].resident.rawAddresses.includes(formattedAddr)) {
                groupedMap[key].resident.rawAddresses.push(formattedAddr);
              }
            }
          });

          const formattedTenants = Object.values(groupedMap).map(item => {
            item.resident.rawAddresses.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
            
            return {
              ...item,
              combinedAddress: item.resident.rawAddresses.join(', ')
            };
          });

          setTenants(formattedTenants);
          setCurrentPage(1);
=======
          setTenants(data.tenants);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        }
      } catch (err) {
        console.error('Failed to load tenants:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchTenants, 300);
    return () => clearTimeout(debounceTimer);
<<<<<<< HEAD
  }, [selectedFilter, searchQuery, urlSearch]); // 🔥 Added urlSearch so top navbar triggers re-fetch

  const totalPages = Math.ceil(tenants.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTenants = tenants.slice(indexOfFirstRow, indexOfLastRow);

  const handleOpenDetails = (row) => {
    setIsUpdateModalOpen(false);
    setSelectedTenant(row);
    setActiveView('details');
  };

  const handleOpenUpdateModal = (row) => {
    setSelectedTenant(row);
    setUpdateStatusValue(row.status || '');
    setStatusDescription('');
    setIsUpdateModalOpen(true);
  };

  const handleExecuteStatusUpdate = async () => {
    if (!selectedTenant) return;
    
    setIsUpdating(true);
    
    try {
      const res = await fetch('http://localhost:5000/api/tenant_management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tenantId: selectedTenant.id, 
          lotId: selectedTenant.lotId, 
          status: updateStatusValue,
          description: statusDescription 
        })
      });
      
      const data = await res.json().catch(() => ({ success: false, message: 'Server returned an invalid response.' }));
      
      if (data.success) {
        const dbStatus = data.tenant?.approvalStatus?.toLowerCase() || String(updateStatusValue).trim().toLowerCase();
        const displayStatus = dbStatus.charAt(0).toUpperCase() + dbStatus.slice(1);
        const newTone = getStatusTone(dbStatus);

        setTenants((prev) =>
          prev.map((item) =>
            item.id === selectedTenant.id
              ? { ...item, status: displayStatus, statusTone: newTone }
              : item
          )
        );

        setSelectedTenant(prev => prev ? { ...prev, status: displayStatus, statusTone: newTone } : null);

        if (dbStatus === 'approved') {
          setSuccessModalData({
            title: 'Tenant Approved Successfully!',
            desc: 'Tenant Account Approval Update has been sent to Homeowner ',
            color: '#065F46' 
          });
        } else if (dbStatus === 'rejected') {
          setSuccessModalData({
            title: 'Tenant Rejected Successfully!',
            desc: 'Tenant Account Rejection Update has been sent to Homeowner ',
            color: '#DC2626' 
          });
        } else {
          setSuccessModalData({
            title: 'Tenant Set to Pending Successfully!',
            desc: 'Tenant Account status has been set back to Pending for review. Notice sent to Homeowner ',
            color: '#854D0E' 
          });
        }

        setIsUpdateModalOpen(false);
        setIsSuccessModalOpen(true);
      } else {
        alert(`Update Failed: ${data.message || 'Unknown backend error occurred.'}`);
      }
    } catch (err) {
      console.error('Failed to update tenant status:', err);
      alert(`Network Error: Cannot reach the backend API. ${err.message}`);
    } finally {
      setIsUpdating(false);
=======
  }, [selectedFilter, searchQuery]);

  const handleUpdateAction = async (tenantId, lotId) => {
    try {
      const res = await fetch('/api/tenant_management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, lotId, status: 'APPROVED' })
      });
      const data = await res.json();
      if (data.success) {
        setTenants((prev) =>
          prev.map((item) =>
            item.id === tenantId && item.lotId === lotId
              ? { ...item, status: 'Approved', statusTone: 'green', canUpdate: false }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to update tenant status:', err);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
    }
  };

  return (
    <div className="tenant-management-page">
<<<<<<< HEAD
      {activeView === 'list' && (
        <>
          <div className="page-title-section">
            <h1>Tenant Management</h1>
            <p>Manage property occupancy and authorize resident permissions.</p>
          </div>

          <div className="filters-section">
            <div className="filter-group type-filters">
              {['All Tenants', 'Approved', 'Pending', 'Rejected'].map((filter) => (
                <button
                  key={filter}
                  className={`pill ${selectedFilter === filter ? 'active-pill' : 'light-pill'}`}
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="action-group">
              <div className="table-search">
                <input
                  type="text"
                  placeholder="Type a name here.."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </span>
              </div>
            </div>
          </div>

          <div className="table-container" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>RESIDENT</th>
                  <th>TENANT</th>
                  <th>DETAILS</th>
                  <th>STATUS</th>
                  <th>EXECUTIVE ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      Fetching tenant records from database...
                    </td>
                  </tr>
                ) : currentTenants.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      No tenant records found in the database.
                    </td>
                  </tr>
                ) : (
                  currentTenants.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="person-cell">
                          <div className="avatar" style={{ backgroundColor: row.resident.bgColor }}>
                            {row.resident.init}
                          </div>
                          <div className="person-info">
                            <strong>{row.resident.name}</strong>
                            <span>{row.combinedAddress}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="person-cell">
                          <div className="avatar" style={{ backgroundColor: row.tenant.bgColor }}>
                            {row.tenant.init}
                          </div>
                          <div className="person-info">
                            <strong>{row.tenant.name}</strong>
                            <span>{row.tenant.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <button className="btn-view-details" onClick={() => handleOpenDetails(row)}>
                          View Details 
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                      </td>

                      <td>
                        <span className={`status-badge status-${row.statusTone}`}>
                          {row.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="btn-action btn-update-active"
                          onClick={() => handleOpenUpdateModal(row)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* PAGINATION */}
            <div className="pagination" style={{ marginTop: '20px', paddingBottom: '10px' }}>
              <button 
                className="page-btn" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                {'<'}
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`page-btn ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}

              <button 
                className="page-btn" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* DETAILS VIEW */}
      {activeView === 'details' && selectedTenant && (
        <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
          <button 
            onClick={() => { setActiveView('list'); setSelectedTenant(null); }} 
            style={{ background: 'none', border: 'none', color: '#065F46', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ← Return To Tenant Management
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', color: '#065F46', fontWeight: 'bold' }}>View Details</h1>
            <span className={`status-badge status-${selectedTenant.statusTone}`} style={{ padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
              STATUS: {selectedTenant.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>HOMEOWNER INFORMATION</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>FULL NAME</label>
                <input type="text" readOnly value={selectedTenant.homeowner?.fullName || selectedTenant.resident.name} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>EMAIL ADDRESS</label>
                <input type="text" readOnly value={selectedTenant.homeowner?.email || selectedTenant.resident.email} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              </div>
            </div>

            <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>TENANT INFORMATION</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>FULL NAME</label>
                <input type="text" readOnly value={selectedTenant.tenant.name} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>EMAIL ADDRESS</label>
                <input type="text" readOnly value={selectedTenant.tenant.email} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
            <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>PROPERTY ADDRESS</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>HOUSE NO.</label>
                  <input type="text" readOnly value={selectedTenant.propertyAddress?.houseNo || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>BLOCK</label>
                  <input type="text" readOnly value={selectedTenant.propertyAddress?.block || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>LOT</label>
                  <input type="text" readOnly value={selectedTenant.propertyAddress?.lot || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>ZONE</label>
                  <input type="text" readOnly value={selectedTenant.propertyAddress?.zone || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>STREET</label>
                  <input type="text" readOnly value={selectedTenant.propertyAddress?.street || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                </div>
              </div>
            </div>

            <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>PHOTO PERMIT</h3>
              <div style={{ background: '#f3f4f6', flex: 1, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', minHeight: '120px' }}>
                Permit Preview Placeholder
              </div>
            </div>
          </div>

          <button 
            onClick={() => handleOpenUpdateModal(selectedTenant)}
            style={{ backgroundColor: '#065F46', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            UPDATE STATUS
          </button>
        </div>
      )}

      {/* UPDATE MODAL */}
      {isUpdateModalOpen && selectedTenant && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', position: 'relative' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF08A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#854D0E', fontWeight: 'bold' }}>
                ⚙️
              </div>
              <h3 style={{ fontSize: '20px', color: '#065F46', fontWeight: 'bold', margin: 0 }}>Update Tenant Status</h3>
            </div>

            <label style={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>UPDATE STATUS</label>
            <select 
              value={updateStatusValue} 
              onChange={(e) => setUpdateStatusValue(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', fontWeight: '500', color: '#1f2937' }}
            >
              <option value="">Select Status...</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <label style={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>DESCRIPTION OF STATUS</label>
            <textarea 
              placeholder="Document the findings or required next steps for this status change..."
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
              style={{ width: '100%', padding: '12px', height: '110px', marginBottom: '20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', color: '#1f2937', resize: 'vertical' }}
            />

            <div style={{ background: '#FEFCE8', border: '1px solid #FEF08A', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '12px', color: '#854D0E', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
              <span>⚠️</span> Resident will be notified regarding the status update.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setIsCancelConfirmOpen(true)}
                disabled={isUpdating}
                style={{ backgroundColor: '#DC2626', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isUpdating ? 'not-allowed' : 'pointer', fontSize: '13px', opacity: isUpdating ? 0.6 : 1 }}
              >
                CANCEL UPDATE
              </button>

              <button 
                onClick={handleExecuteStatusUpdate}
                disabled={isUpdating}
                style={{ backgroundColor: isUpdating ? '#9ca3af' : '#065F46', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: isUpdating ? 'not-allowed' : 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isUpdating ? '⏳ UPDATING...' : <><span>✔</span> UPDATE STATUS</>}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* CANCEL CONFIRM MODAL */}
      {isCancelConfirmOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>Are you sure you want to cancel?</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>You have unsaved changes that will be reverted.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => { setIsCancelConfirmOpen(false); setIsUpdateModalOpen(false); }}
                style={{ backgroundColor: '#065F46', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Confirm
              </button>
              <button 
                onClick={() => setIsCancelConfirmOpen(false)}
                style={{ backgroundColor: '#DC2626', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccessModalOpen && selectedTenant && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '420px', width: '100%' }}>
            
            <h3 style={{ color: successModalData.color, marginBottom: '10px', fontWeight: 'bold' }}>
              {successModalData.title}
            </h3>
            
            <p style={{ color: '#4b5563', fontSize: '13px', marginBottom: '20px' }}>
              {successModalData.desc}
              <strong>{selectedTenant.resident?.email || selectedTenant.homeowner?.email || 'N/A'}</strong>
            </p>

            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              style={{ backgroundColor: successModalData.color, color: 'white', padding: '10px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              CLOSE
            </button>
            
          </div>
        </div>
      )}
=======
      {/* PAGE HEADER */}
      <div className="page-title-section">
        <h1>Tenant Management</h1>
        <p>Manage property occupancy and authorize resident permissions.</p>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="filters-section">
        <div className="filter-group type-filters">
          {['All Tenants', 'Approved', 'Pending', 'Rejected'].map((filter) => (
            <button
              key={filter}
              className={`pill ${selectedFilter === filter ? 'active-pill' : 'light-pill'}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="action-group">
          <div className="table-search">
            <input
              type="text"
              placeholder="Type a name here.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>TENANT</th>
              <th>DETAILS</th>
              <th>STATUS</th>
              <th>EXECUTIVE ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  Fetching tenant records from database...
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No tenant records found in the database.
                </td>
              </tr>
            ) : (
              tenants.map((row) => (
                <tr key={`${row.id}-${row.lotId}`}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar" style={{ backgroundColor: row.resident.bgColor }}>
                        {row.resident.init}
                      </div>
                      <div className="person-info">
                        <strong>{row.resident.name}</strong>
                        <span>{row.resident.address}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="person-cell">
                      <div className="avatar" style={{ backgroundColor: row.tenant.bgColor }}>
                        {row.tenant.init}
                      </div>
                      <div className="person-info">
                        <strong>{row.tenant.name}</strong>
                        <span>{row.tenant.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <button className="btn-view-details">
                      View Details 
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </td>

                  <td>
                    <span className={`status-badge status-${row.statusTone}`}>
                      {row.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className={`btn-action ${row.canUpdate ? 'btn-update-active' : 'btn-update-disabled'}`}
                      disabled={!row.canUpdate}
                      onClick={() => handleUpdateAction(row.id, row.lotId)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <button className="page-btn">{'<'}</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">{'>'}</button>
        </div>
      </div>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
    </div>
  );
}