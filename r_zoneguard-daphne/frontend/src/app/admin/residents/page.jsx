'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import './style.css';

function ResidentsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Grab top search bar value from URL (supports both ?q= and ?search=)
  const urlSearch = searchParams.get('q') || searchParams.get('search') || '';

  const [residents, setResidents] = useState([]);
  const [stats, setStats] = useState({ totalTenants: 0, totalHomeowners: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All Residents');
  const [selectedZone, setSelectedZone] = useState('');
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedResident, setSelectedResident] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newResidentForm, setNewResidentForm] = useState({
    fullName: '',
    type: 'Homeowner',
    zone: 'ZONE 1',
    street: '',
    block: '',
    lot: '',
    houseNo: '',
    phone: '',
    email: ''
  });

  // Keep local search state synced if URL parameter changes from top bar
  useEffect(() => {
    setSearchQuery(urlSearch);
  }, [urlSearch]);

  const fetchLiveResidents = async () => {
    setIsLoading(true);
    try {
      let url = `http://localhost:5000/api/residents?page=${currentPage}&`;
      if (selectedType) url += `type=${encodeURIComponent(selectedType)}&`;
      if (selectedZone) url += `zone=${encodeURIComponent(selectedZone)}&`;
      
      // Send active search term (from URL or local input) to your database API
      const activeSearch = searchQuery || urlSearch;
      if (activeSearch) url += `search=${encodeURIComponent(activeSearch)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setResidents(data.residents);
        setStats(data.stats);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to connect to database API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(fetchLiveResidents, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedType, selectedZone, searchQuery, urlSearch, currentPage]);

  // Handle local inner search bar typing (syncs with top search URL parameter)
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setCurrentPage(1);

    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('q', val);
    } else {
      params.delete('q');
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleCreateResident = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResidentForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewResidentForm({
          fullName: '',
          type: 'Homeowner',
          zone: 'ZONE 1',
          street: '',
          block: '',
          lot: '',
          houseNo: '',
          phone: '',
          email: ''
        });
        fetchLiveResidents();
      } else {
        alert(data.message || 'Failed to save resident record.');
      }
    } catch (err) {
      console.error('Error submitting new resident:', err);
    }
  };

  return (
    <div>
      {/* Page Title Section */}
      <div className="page-title-section">
        <h1>Resident Master List</h1>
        <p>Central management for all registered residents properties and homeowners.</p>
      </div>

      {/* Stats Cards Row */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-icon light-green-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-details">
            <span>Total Tenants</span>
            <h2>{stats.totalTenants.toLocaleString()}</h2>
            <div className="stat-year">
              <span className="yellow-dot"></span> Year 2026
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon dark-green-bg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div className="stat-details">
            <span>Total Homeowner</span>
            <h2>{stats.totalHomeowners.toLocaleString()}</h2>
            <div className="stat-year">
              <span className="yellow-dot"></span> Year 2026
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Actions Section */}
      <div className="filters-section">
        <div className="filter-group">
          {['All Residents', 'Tenants', 'Homeowners'].map((type) => (
            <button
              key={type}
              className={`pill ${selectedType === type ? 'active-pill' : 'light-pill'}`}
              onClick={() => { setSelectedType(type); setCurrentPage(1); }}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="filter-group">
          {['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'].map((zone) => (
            <button
              key={zone}
              className={`pill ${selectedZone === zone ? 'active-pill' : 'light-pill'}`}
              onClick={() => { setSelectedZone(selectedZone === zone ? '' : zone); setCurrentPage(1); }}
            >
              {zone}
            </button>
          ))}
        </div>

        <div className="action-group">
          <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>⊕ ADD AS RESIDENT</button>
          
          <div className="table-search">
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              placeholder="Type a name here.."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {/* Master Table */}
      <div className="table-container">
        <table className="residents-table">
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>ELECTION ELIGIBILITY</th>
              <th>RISK STATUS</th>
              <th>PERSONAL INFO</th>
              <th>RESIDENT TYPE</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  Fetching records from database...
                </td>
              </tr>
            ) : residents.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No matching records found in the database.
                </td>
              </tr>
            ) : (
              residents.map((res) => (
                <tr key={res.id}>
                  <td>
                    <div className="resident-cell">
                      <div className="resident-avatar" style={{ backgroundColor: res.bgColor }}>{res.init}</div>
                      <div className="resident-info">
                        <strong>{res.name}</strong>
                        <span>{res.address}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: res.electionTone === 'green' ? '#059669' : '#dc2626' }}>
                    {res.election}
                  </td>
                  <td>
                    {res.isAtRisk && (
                      <span className="risk-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <circle cx="12" cy="12" r="10"></circle>
                          <line x1="12" y1="8" x2="12" y2="12"></line>
                          <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        AT RISK
                      </span>
                    )}
                  </td>
                  <td>
                    <button className="btn-view-details" onClick={() => setSelectedResident(res)}>
                      View Details 
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <span className={`type-pill ${res.typeTone === 'blue' ? 'pill-blue' : 'pill-green'}`}>{res.type}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt;
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
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* View Resident Modal */}
      {selectedResident && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '28px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ color: '#064E3B', fontSize: '17px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
              PERSONAL INFORMATION PROFILE ({selectedResident.type.toUpperCase()})
            </h2>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>FULL NAME</label>
              <input type="text" readOnly value={selectedResident.fullNamedb || selectedResident.name} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '13px', fontWeight: '600', color: '#1F2937' }} />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>CONTACT NUMBER</label>
              <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#F9FAFB' }}>
                <span style={{ padding: '10px', backgroundColor: '#E5E7EB', color: '#374151', fontSize: '13px', borderRight: '1px solid #D1D5DB' }}>+63</span>
                <input type="text" readOnly value={selectedResident.phone || ''} style={{ width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent', fontSize: '13px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>EMAIL ADDRESS</label>
              <input type="text" readOnly value={selectedResident.email || ''} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '13px', color: '#1F2937' }} />
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '14px', marginBottom: '20px' }}>
              <h3 style={{ color: '#064E3B', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>PROPERTY ADDRESS</h3>
              
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>FULL FORMATTED ADDRESS</label>
                <input type="text" readOnly value={selectedResident.address || ''} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '12px', fontWeight: 'bold', color: '#1F2937' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>HOUSE NO.</label>
                  <input type="text" readOnly value={selectedResident.houseNo || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>BLOCK</label>
                  <input type="text" readOnly value={selectedResident.block || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>LOT</label>
                  <input type="text" readOnly value={selectedResident.lot || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '12px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>ZONE</label>
                  <input type="text" readOnly value={selectedResident.zone || ''} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>STREET</label>
                  <input type="text" readOnly value={selectedResident.street || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '12px' }} />
                </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedResident(null)}
              style={{
                width: '100%', padding: '11px', backgroundColor: '#064E3B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
              }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}

      {/* Add Resident Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white', padding: '28px', borderRadius: '12px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h2 style={{ color: '#064E3B', fontSize: '17px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold' }}>
              REGISTER NEW RESIDENT
            </h2>

            <form onSubmit={handleCreateResident}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>FULL NAME</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter full name"
                  value={newResidentForm.fullName}
                  onChange={(e) => setNewResidentForm({...newResidentForm, fullName: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', color: '#1F2937' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>RESIDENT TYPE</label>
                  <select 
                    value={newResidentForm.type}
                    onChange={(e) => setNewResidentForm({...newResidentForm, type: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', backgroundColor: 'white' }}
                  >
                    <option value="Homeowner">Homeowner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>ZONE</label>
                  <select 
                    value={newResidentForm.zone}
                    onChange={(e) => setNewResidentForm({...newResidentForm, zone: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', backgroundColor: 'white' }}
                  >
                    <option value="ZONE 1">ZONE 1</option>
                    <option value="ZONE 2">ZONE 2</option>
                    <option value="ZONE 3">ZONE 3</option>
                    <option value="ZONE 4">ZONE 4</option>
                    <option value="ZONE 5">ZONE 5</option>
                    <option value="ZONE 6">ZONE 6</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>CONTACT NUMBER</label>
                <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden' }}>
                  <span style={{ padding: '10px', backgroundColor: '#E5E7EB', color: '#374151', fontSize: '13px', borderRight: '1px solid #D1D5DB' }}>+63</span>
                  <input 
                    type="text" 
                    placeholder="9123456789"
                    value={newResidentForm.phone}
                    onChange={(e) => setNewResidentForm({...newResidentForm, phone: e.target.value})}
                    style={{ width: '100%', padding: '10px', border: 'none', fontSize: '13px', outline: 'none' }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4b5563', marginBottom: '4px' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  placeholder="resident@email.com"
                  value={newResidentForm.email}
                  onChange={(e) => setNewResidentForm({...newResidentForm, email: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px', color: '#1F2937' }} 
                />
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '14px', marginBottom: '18px' }}>
                <h3 style={{ color: '#064E3B', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>PROPERTY DETAILS</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>HOUSE NO.</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      value={newResidentForm.houseNo}
                      onChange={(e) => setNewResidentForm({...newResidentForm, houseNo: e.target.value})}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>BLOCK</label>
                    <input 
                      type="text" 
                      placeholder="Blk 4"
                      value={newResidentForm.block}
                      onChange={(e) => setNewResidentForm({...newResidentForm, block: e.target.value})}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>LOT</label>
                    <input 
                      type="text" 
                      placeholder="Lot 8"
                      value={newResidentForm.lot}
                      onChange={(e) => setNewResidentForm({...newResidentForm, lot: e.target.value})}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4b5563', marginBottom: '3px' }}>STREET</label>
                  <input 
                    type="text" 
                    placeholder="Rosal St."
                    value={newResidentForm.street}
                    onChange={(e) => setNewResidentForm({...newResidentForm, street: e.target.value})}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    flex: 1, padding: '11px', backgroundColor: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
                  }}
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1, padding: '11px', backgroundColor: '#064E3B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px'
                  }}
                >
                  SAVE RESIDENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Next.js requires searchParams logic to be wrapped inside a Suspense boundary
export default function AdminResidentsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center' }}>Fetching records from database...</div>}>
      <ResidentsContent />
    </Suspense>
  );
}