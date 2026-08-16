'use client';

import { useState, useEffect, useCallback } from 'react';

export default function VehicleManagementPage() {
    const [selectedZone, setSelectedZone] = useState('ALL ZONES');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    
    // States for backend integration
    const [vehiclesData, setVehiclesData] = useState([]);
    const [totalVehicles, setTotalVehicles] = useState(0);
    const [zoneCounts, setZoneCounts] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const itemsPerPage = 5;
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    // Fetch data from backend
    const fetchVehiclesData = useCallback(async (signal) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/api/registered-vehicles`, { signal }); 
            if (!response.ok) throw new Error(`Server returned status ${response.status}`);
            
            const data = await response.json();
            
            setVehiclesData(data.residents || []);
            setTotalVehicles(data.totalVehicles || 0);
            setZoneCounts(data.zoneCounts || {});
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error loading vehicle data:", err);
                setError(err.message || 'Failed to connect to the server.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [API_BASE_URL]);

    useEffect(() => {
        const controller = new AbortController();
        fetchVehiclesData(controller.signal);

        return () => controller.abort();
    }, [fetchVehiclesData]);

    // Dynamic zone list with 'ALL ZONES' prepended
    const baseZoneKeys = Object.keys(zoneCounts).filter(
        z => z.toUpperCase() !== 'ALL ZONES' && z.toUpperCase() !== 'ALL'
    );
    
    const sortedZones = baseZoneKeys.length > 0 
        ? baseZoneKeys.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
        : ['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'];

    const availableZones = ['ALL ZONES', ...sortedZones];

    // Filter logic supporting 'ALL ZONES' wildcard + search term
    const filteredVehicles = vehiclesData.filter(item => {
        const isAllZones = selectedZone.toUpperCase() === 'ALL ZONES' || selectedZone.toUpperCase() === 'ALL';
        const matchesZone = isAllZones || (item?.zone || '').toUpperCase() === selectedZone.toUpperCase();
        
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = (item?.name || '').toLowerCase().includes(searchLower);
        const addressMatch = (item?.address || '').toLowerCase().includes(searchLower);
        
        return matchesZone && (nameMatch || addressMatch);
    });

    // Dynamic Zone Count calculation for KPI card
    const currentZoneCount = (selectedZone.toUpperCase() === 'ALL ZONES' || selectedZone.toUpperCase() === 'ALL')
        ? (totalVehicles || vehiclesData.length)
        : (zoneCounts[selectedZone] || 0);

    // Pagination logic
    const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    const paginatedVehicles = filteredVehicles.slice(
        (currentPage - 1) * itemsPerPage, 
        currentPage * itemsPerPage
    );

    return (
        <div className="vehicle-management-container">
            <style jsx>{`
                .vehicle-management-container {
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                    width: 100%;
                }
                .page-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 20px;
                    flex-wrap: wrap;
                }
                .page-title {
                    font-size: 2.25rem;
                    font-weight: 800;
                    color: #064e3b;
                    margin: 0 0 6px 0;
                }
                .page-subtitle {
                    font-size: 0.9rem;
                    color: #4b5563;
                    margin: 0;
                }
                .kpi-cards-wrapper {
                    display: flex;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .kpi-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    min-width: 240px;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .kpi-icon-box {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .blue-icon { background-color: #e0f2fe; color: #0284c7; }
                .pink-icon { background-color: #fce7f3; color: #db2777; }
                .kpi-content {
                    display: flex;
                    flex-direction: column;
                }
                .kpi-label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #374151;
                    text-transform: uppercase;
                }
                .kpi-main-val {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: #111827;
                    line-height: 1.2;
                }
                .kpi-badge {
                    font-size: 0.7rem;
                    color: #059669;
                    font-weight: 600;
                    background: #ecfdf5;
                    padding: 2px 6px;
                    border-radius: 4px;
                    width: fit-content;
                    margin-top: 4px;
                }
                .kpi-zone-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .zone-dropdown {
                    background: #ecfdf5;
                    border: none;
                    color: #065f46;
                    font-weight: 700;
                    font-size: 0.75rem;
                    padding: 4px 8px;
                    border-radius: 6px;
                    cursor: pointer;
                    outline: none;
                }
                .filter-search-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 16px;
                    flex-wrap: wrap;
                }
                .zone-pills {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                }
                .filter-icon-inline {
                    color: #111827;
                    display: flex;
                    align-items: center;
                    margin-right: 4px;
                }
                .zone-pill {
                    background: transparent;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #4b5563;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .zone-pill.active {
                    background-color: #d1fae5;
                    color: #065f46;
                }
                .table-search-box {
                    position: relative;
                    width: 260px;
                }
                .table-search-box input {
                    width: 100%;
                    padding: 8px 34px 8px 12px;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    background: #ffffff;
                    font-size: 0.85rem;
                    outline: none;
                }
                .table-search-box input:focus {
                    border-color: #059669;
                }
                .table-search-box svg {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                }
                .vehicle-table-card {
                    background: #ffffff;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }
                .table-responsive-wrapper {
                    width: 100%;
                    overflow-x: auto;
                }
                .vehicle-table {
                    width: 100%;
                    border-collapse: collapse;
                    text-align: left;
                    min-width: 600px;
                }
                .vehicle-table th {
                    background: #f9fafb;
                    padding: 14px 24px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: #6b7280;
                    letter-spacing: 0.05em;
                    border-bottom: 1px solid #e5e7eb;
                }
                .vehicle-table td {
                    padding: 16px 24px;
                    border-bottom: 1px solid #f3f4f6;
                    font-size: 0.875rem;
                    color: #111827;
                }
                .vehicle-table tr:last-child td {
                    border-bottom: none;
                }
                .resident-cell {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .resident-avatar {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.8rem;
                    flex-shrink: 0;
                }
                .resident-name {
                    font-weight: 700;
                    color: #111827;
                }
                .address-cell {
                    font-weight: 600;
                    color: #374151;
                }
                .count-cell {
                    font-weight: 800;
                    text-align: right;
                    padding-right: 48px !important;
                }
                .text-right {
                    text-align: right;
                    padding-right: 48px !important;
                }
                .empty-state {
                    text-align: center;
                    color: #6b7280;
                    padding: 32px !important;
                }
                .error-state {
                    text-align: center;
                    color: #dc2626;
                    padding: 32px !important;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                }
                .retry-btn {
                    background: #065f46;
                    color: white;
                    border: none;
                    padding: 6px 16px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .table-footer {
                    background: #f9fafb;
                    padding: 12px 24px;
                    display: flex;
                    justify-content: flex-end;
                    border-top: 1px solid #e5e7eb;
                }
                .pagination-controls {
                    display: flex;
                    gap: 6px;
                }
                .page-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                    background: #ffffff;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #374151;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }
                .page-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .page-btn.active {
                    background: #065f46;
                    color: #ffffff;
                    border-color: #065f46;
                }
                .loading-state {
                    text-align: center;
                    padding: 40px;
                    color: #065f46;
                    font-weight: 600;
                }
            `}</style>

            {/* Page Header */}
            <div className="page-header-row">
                <div>
                    <h1 className="page-title">Vehicle Management</h1>
                    <p className="page-subtitle">Monitor sticker inventory, vehicle registrations, and distributions.</p>
                </div>

                {/* Top KPI Cards */}
                <div className="kpi-cards-wrapper">
                    <div className="kpi-card">
                        <div className="kpi-icon-box blue-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>
                        </div>
                        <div className="kpi-content">
                            <span className="kpi-label">Total Registered Vehicle</span>
                            <div className="kpi-main-val">{totalVehicles}</div>
                            <span className="kpi-badge">Active Directory</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon-box pink-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        </div>
                        <div className="kpi-content">
                            <span className="kpi-label">Total Each Zone</span>
                            <div className="kpi-zone-row">
                                <span className="kpi-main-val">{currentZoneCount}</span>
                                <select 
                                    className="zone-dropdown" 
                                    value={selectedZone}
                                    onChange={(e) => {
                                        setSelectedZone(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    aria-label="Select Zone Filter"
                                >
                                    {availableZones.map(zone => (
                                        <option key={zone} value={zone}>{zone}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar Row */}
            <div className="filter-search-row">
                <div className="zone-pills">
                    <span className="filter-icon-inline">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                    </span>
                    {availableZones.map((zone) => (
                        <button
                            key={zone}
                            onClick={() => {
                                setSelectedZone(zone);
                                setCurrentPage(1);
                            }}
                            className={`zone-pill ${selectedZone === zone ? 'active' : ''}`}
                        >
                            {zone}
                        </button>
                    ))}
                </div>

                <div className="table-search-box">
                    <input 
                        type="text" 
                        placeholder="Type a name or address here.." 
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>

            {/* Data Table */}
            <div className="vehicle-table-card">
                {isLoading ? (
                    <div className="loading-state">Fetching vehicle data...</div>
                ) : error ? (
                    <div className="error-state">
                        <span>{error}</span>
                        <button className="retry-btn" onClick={() => fetchVehiclesData()}>Retry</button>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive-wrapper">
                            <table className="vehicle-table">
                                <thead>
                                    <tr>
                                        <th>RESIDENT</th>
                                        <th>ADDRESS</th>
                                        <th className="text-right">NO. OF REGISTERED VEHICLE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedVehicles.length > 0 ? (
                                        paginatedVehicles.map((item, index) => (
                                            <tr key={item.id || item._id || index}>
                                                <td>
                                                    <div className="resident-cell">
                                                        <div className="resident-avatar" style={{ backgroundColor: item.color || '#059669' }}>
                                                            {item.initials || item.name?.charAt(0) || '?'}
                                                        </div>
                                                        <span className="resident-name">{item.name || 'Unnamed Resident'}</span>
                                                    </div>
                                                </td>
                                                <td className="address-cell">{item.address || 'N/A'}</td>
                                                <td className="count-cell">{item.count ?? 0}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="empty-state">
                                                {searchTerm 
                                                    ? `No search results for "${searchTerm}" in ${selectedZone}.` 
                                                    : `No records found for ${selectedZone}.`}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Table Footer / Pagination */}
                        <div className="table-footer">
                            <div className="pagination-controls">
                                <button 
                                    className="page-btn" 
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    aria-label="Previous Page"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                </button>
                                
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                    <button 
                                        key={page}
                                        className={`page-btn ${currentPage === page ? 'active' : ''}`} 
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button 
                                    className="page-btn" 
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || filteredVehicles.length === 0}
                                    aria-label="Next Page"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}