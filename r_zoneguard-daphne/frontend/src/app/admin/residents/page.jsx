"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./style.css";

export default function ResidentsPage() {
  const [totalTenants, setTotalTenants] = useState(0);
  const [totalHomeowners, setTotalHomeowners] = useState(0);
  
  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState("All Residents");
  const [searchQuery, setSearchQuery] = useState("");

  // Selected resident state for View Modal
  const [selectedResident, setSelectedResident] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock residents data
  const [residents, setResidents] = useState([
    {
      id: 1,
      firstName: "Thelma",
      lastName: "Ipac",
      fullName: "Thelma Ipac",
      type: "Homeowner",
      stickerEligibility: "Eligible",
      electionEligibility: "Eligible",
      riskStatus: "Low Risk",
      contactNumber: "917 123 4567",
      emailAddress: "thelma.ipac@gmail.com",
      houseNo: "16",
      block: "n/a",
      lot: "n/a",
      zone: "Zone 1",
      street: "Pantabangan St."
    },
    {
      id: 2,
      firstName: "Marilou",
      lastName: "Del Rosario",
      fullName: "Marilou Del Rosario",
      type: "Tenant",
      stickerEligibility: "Eligible",
      electionEligibility: "Eligible",
      riskStatus: "Low Risk",
      contactNumber: "977 543 2341",
      emailAddress: "marilou.delrosario@gmail.com",
      houseNo: "22",
      block: "Blk 4",
      lot: "Lot 12",
      zone: "Zone 2",
      street: "Magat St."
    }
  ]);

  // Backend integration point for stats and data
  useEffect(() => {
    /*
    async function fetchResidents() {
      try {
        const res = await fetch('/api/residents');
        const data = await res.json();
        setResidents(data);
      } catch (err) {
        console.error("Error loading residents:", err);
      }
    }
    fetchResidents();
    */
    setTotalTenants(residents.filter(r => r.type === "Tenant").length);
    setTotalHomeowners(residents.filter(r => r.type === "Homeowner").length);
  }, [residents]);

  // Client-side filtering logic
  const filteredResidents = residents.filter((resident) => {
    const matchesSearch = resident.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "All Residents") return true;
    if (activeFilter === "Tenants") return resident.type === "Tenant";
    if (activeFilter === "Homeowners") return resident.type === "Homeowner";
    if (activeFilter.startsWith("ZONE")) {
      return resident.zone.toUpperCase() === activeFilter.toUpperCase();
    }

    return true;
  });

  const handleOpenModal = (resident) => {
    setSelectedResident(resident);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResident(null);
  };

  const getInitials = (name) => {
    const parts = name.split(" ");
    return parts.map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  };

  const filterOptions = [
    "All Residents",
    "Tenants",
    "Homeowners",
    "ZONE 1",
    "ZONE 2",
    "ZONE 3",
    "ZONE 4",
    "ZONE 5",
    "ZONE 6"
  ];

  return (
    <div className="residents-master-container">
      {/* HEADER & METRIC CARDS */}
      <div className="header-section">
        <div className="title-area">
          <h1 className="main-title">Resident Master List</h1>
          <p className="subtitle">
            Central management for all registered residents properties and homeowners.
          </p>
        </div>

        <div className="stats-cards-wrapper">
          {/* Total Tenants Card */}
          <div className="stat-card">
            <div className="stat-icon-box green-light">
              <svg className="stat-svg-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Tenants</span>
              <span className="stat-value">{totalTenants}</span>
              <span className="stat-subtext">
                <span className="dot yellow"></span> Year 2026
              </span>
            </div>
          </div>

          {/* Total Homeowners Card */}
          <div className="stat-card">
            <div className="stat-icon-box green-dark">
              <svg className="stat-svg-icon light" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Homeowner</span>
              <span className="stat-value">{totalHomeowners}</span>
              <span className="stat-subtext">
                <span className="dot yellow"></span> Year 2026
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS AND ACTIONS BAR */}
      <div className="controls-bar">
        <div className="filter-chips">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              className={`chip ${activeFilter === filter ? "active" : ""} ${
                filter.startsWith("ZONE") ? "zone" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="actions-group">
          <Link href="/admin/residents/add" className="btn-add-resident">
            + ADD RESIDENT
          </Link>
          <div className="search-input-wrapper">
            <svg className="search-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="text"
              placeholder="Type name here..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* MASTER LIST TABLE */}
      <div className="table-card">
        <table className="residents-table">
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>STICKER ELIGIBILITY</th>
              <th>ELECTION ELIGIBILITY</th>
              <th>RISK STATUS</th>
              <th>PERSONAL INFO</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length > 0 ? (
              filteredResidents.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="resident-identity">
                      <div className="avatar-circle">{getInitials(item.fullName)}</div>
                      <span className="resident-name">{item.fullName}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-eligible">
                      {item.stickerEligibility}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-eligible">
                      {item.electionEligibility}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-risk">{item.riskStatus}</span>
                  </td>
                  <td className="info-text">{item.houseNo} {item.street}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-view-action"
                      onClick={() => handleOpenModal(item)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-records">
                  No residents found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW PROFILE MODAL */}
      {isModalOpen && selectedResident && (
        <div className="modal-overlay">
          <div className="modal-profile-card">
            <h2 className="modal-header-title">
              PERSONAL INFORMATION PROFILE <br />({selectedResident.type.toUpperCase()})
            </h2>

            <div className="modal-form-content">
              <div className="modal-field-group">
                <label>FULL NAME</label>
                <input
                  type="text"
                  readOnly
                  value={selectedResident.fullName}
                  className="modal-input"
                />
              </div>

              <div className="modal-field-group">
                <label>CONTACT NUMBER</label>
                <input
                  type="text"
                  readOnly
                  value={selectedResident.contactNumber}
                  className="modal-input"
                />
              </div>

              <div className="modal-field-group">
                <label>EMAIL ADDRESS</label>
                <input
                  type="text"
                  readOnly
                  value={selectedResident.emailAddress}
                  className="modal-input"
                />
              </div>

              <h3 className="modal-subheading">
                {selectedResident.type.toUpperCase()} ADDRESS
              </h3>

              <div className="triple-input-grid">
                <div className="modal-field-group">
                  <label>HOUSE NO.</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedResident.houseNo}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field-group">
                  <label>BLOCK</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedResident.block}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field-group">
                  <label>LOT</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedResident.lot}
                    className="modal-input"
                  />
                </div>
              </div>

              <div className="double-input-grid">
                <div className="modal-field-group">
                  <label>ZONE</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedResident.zone}
                    className="modal-input"
                  />
                </div>
                <div className="modal-field-group">
                  <label>STREET</label>
                  <input
                    type="text"
                    readOnly
                    value={selectedResident.street}
                    className="modal-input"
                  />
                </div>
              </div>
            </div>

            <div className="modal-action-footer">
              <button
                type="button"
                className="btn-modal-close"
                onClick={handleCloseModal}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}