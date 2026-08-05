"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

export default function AddResidentPage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '+63',
    emailAddress: '',
    houseNo: '',
    block: '',
    lot: '',
    zone: '',
    street: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create resident');
      }

      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error submitting resident:', error);
      alert('Error adding resident. Please check your backend endpoint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowSuccessModal(false);
    router.push('/admin/residents');
  };

  const handleBackToResidents = (e) => {
    e.preventDefault();
    router.push('/admin/residents');
  };

  return (
    <div className="add-resident-container">
      {/* Clickable Back Button with programmatic navigation */}
      <button 
        type="button" 
        onClick={handleBackToResidents} 
        className="return-link-btn"
      >
        &rarr; Return To Residents
      </button>

      <h1 className="page-title">Add Resident</h1>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="form-card">
        {/* PERSONAL INFORMATION SECTION */}
        <div className="form-section">
          <h2 className="section-title">PERSONAL INFORMATION</h2>
          <div className="form-grid">
            <div className="form-col">
              <div className="form-group">
                <label htmlFor="firstName">FIRST NAME</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="e.g Juan"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="middleName">MIDDLE NAME</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  placeholder="e.g. Dela Cruz"
                  value={formData.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">LAST NAME</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="e.g Dela Cruz"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-col">
              <div className="form-group">
                <label htmlFor="contactNumber">CONTACT NUMBER</label>
                <input
                  type="text"
                  id="contactNumber"
                  name="contactNumber"
                  placeholder="+63"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailAddress">EMAIL ADDRESS</label>
                <input
                  type="email"
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="e.g JuanDelaCruz@gmail.com"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* PROPERTY ADDRESS SECTION */}
        <div className="form-section">
          <h2 className="section-title">PROPERTY ADDRESS</h2>
          
          <div className="triple-grid">
            <div className="form-group">
              <label htmlFor="houseNo">HOUSE NO.</label>
              <input
                type="text"
                id="houseNo"
                name="houseNo"
                placeholder="e.g. house number"
                value={formData.houseNo}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="block">BLOCK</label>
              <input
                type="text"
                id="block"
                name="block"
                placeholder="block number"
                value={formData.block}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lot">LOT</label>
              <input
                type="text"
                id="lot"
                name="lot"
                placeholder="lot number"
                value={formData.lot}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-grid margin-top-12">
            <div className="form-group">
              <label htmlFor="zone">ZONE</label>
              <input
                type="text"
                id="zone"
                name="zone"
                placeholder=""
                value={formData.zone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="street">STREET</label>
              <input
                type="text"
                id="street"
                name="street"
                placeholder=""
                value={formData.street}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            <span className="plus-icon">+</span> {isSubmitting ? 'ADDING...' : 'ADD AS RESIDENT'}
          </button>
        </div>
      </form>

      {/* SUCCESS MODAL POPUP */}
      {showSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-icon">✓</div>
            <h3 className="modal-title">Resident Added Successfully!</h3>
            <p className="modal-desc">
              The new resident record has been created and saved in the master list.
            </p>
            <button className="modal-btn" onClick={handleModalClose}>
              DONE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}