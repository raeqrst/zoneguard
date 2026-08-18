'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import './style.css';

const Icons = {
  upload: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="17 8 12 3 7 8"></polyline>
      <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
  ),
  qrCode: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  cash: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M6 12h.01M18 12h.01"></path>
    </svg>
  ),
  arrowRight: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  ),
  arrowLeft: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  ),
  checkCircle: (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  )
};

export default function TenantVehicleStickerPage() {
  const [step, setStep] = useState(1);
  const [showQrModal, setShowQrModal] = useState(false);
  const [formData, setFormData] = useState({
    applicantName: '',
    plateNumber: '',
    category: '',
    makeModel: '',
    color: '',
    orFile: null,
    crFile: null,
    paymentMethod: '',
    proofOfPayment: null,
    referenceNumber: ''
  });

  const registeredVehicles = [
    { model: 'Toyota Avanza', plate: 'NDY 6767' },
    { model: 'Nissan Juke', plate: 'TXI 2436' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, [fileType]: e.target.files[0] }));
    }
  };

  const handleFormSubmit = () => {
    console.log("Submit clicked. Payment Method:", formData.paymentMethod);
    if (!formData.paymentMethod) {
      alert('Please select a payment method.');
      return;
    }
    if (formData.paymentMethod === 'digital') {
      console.log("Opening QR Modal...");
      setShowQrModal(true);
    } else {
      setStep(3);
    }
  };

  const handleQrSubmit = () => {
    setShowQrModal(false);
    setStep(3);
  };

  return (
    <div className="vehicle-sticker-page-wrapper">
      <div className="vehicle-sticker-container">
        {/* HEADER */}
        <div className="page-header">
          {step === 2 && (
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="btn-back"
            >
              {Icons.arrowLeft} Back to Vehicle Details
            </button>
          )}
          <h1>Vehicle Sticker Application</h1>
          <p>Register or update your vehicle to the property records.</p>
        </div>

        {/* STEPS INDICATOR */}
        <div className="steps-indicator">
          <div className="step-line" />
          
          <div className="step-item">
            <div className={`step-bubble ${step >= 1 ? 'active' : ''}`}>1</div>
            <span className={`step-label ${step >= 1 ? 'active' : ''}`}>Details</span>
          </div>

          <div className="step-item">
            <div className={`step-bubble ${step >= 2 ? 'active' : ''}`}>2</div>
            <span className={`step-label ${step >= 2 ? 'active' : ''}`}>Payment</span>
          </div>

          <div className="step-item">
            <div className={`step-bubble ${step >= 3 ? 'active' : ''}`}>3</div>
            <span className={`step-label ${step >= 3 ? 'active' : ''}`}>Pick-up</span>
          </div>
        </div>

        {/* STEP 1: DETAILS */}
        {step === 1 && (
          <div className="step-content-grid">
            <div className="form-card-column">
              
              {/* Personal Identification Card */}
              <div className="form-section-card">
                <h3 className="section-card-title">Personal Identification</h3>
                <div className="form-group mb-0">
                  <label>Name of Applicant</label>
                  <input 
                    type="text" 
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    placeholder="Enter full name" 
                  />
                </div>
              </div>

              {/* Vehicle Identification Card */}
              <div className="form-section-card">
                <h3 className="section-card-title">Vehicle Identification</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label>Plate Number (LTO Format)</label>
                    <input 
                      type="text" 
                      name="plateNumber"
                      value={formData.plateNumber}
                      onChange={handleInputChange}
                      placeholder="e.g., ABC 1234" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select 
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      <option value="">Select category</option>
                      <option value="Car">Car / Sedan</option>
                      <option value="SUV">SUV / AUV</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Van">Van / Pickup</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Make / Model</label>
                    <input 
                      type="text" 
                      name="makeModel"
                      value={formData.makeModel}
                      onChange={handleInputChange}
                      placeholder="e.g., Toyota Vios" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input 
                      type="text" 
                      name="color"
                      value={formData.color}
                      onChange={handleInputChange}
                      placeholder="e.g., Pearl White" 
                    />
                  </div>
                </div>

                <div className="form-divider" />

                <label className="upload-section-label">Upload Official Receipt and Certification of Registration (OR/CR)</label>
                <div className="upload-grid">
                  <label className="upload-box">
                    {Icons.upload}
                    <div className="upload-text-group">
                      <span className="upload-title">{formData.orFile ? formData.orFile.name : 'Upload OR'}</span>
                      <span className="upload-sub">JPG, PNG (Max 5MB)</span>
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'orFile')} style={{ display: 'none' }} />
                  </label>

                  <label className="upload-box">
                    {Icons.upload}
                    <div className="upload-text-group">
                      <span className="upload-title">{formData.crFile ? formData.crFile.name : 'Upload CR'}</span>
                      <span className="upload-sub">JPG, PNG (Max 5MB)</span>
                    </div>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'crFile')} style={{ display: 'none' }} />
                  </label>
                </div>
              </div>

              <div className="form-actions-right">
                <button 
                  type="button" 
                  onClick={() => setStep(2)}
                  className="btn-primary"
                >
                  Next Step {Icons.arrowRight}
                </button>
              </div>
            </div>

            {/* REGISTERED VEHICLES PANEL */}
            <div className="registered-panel">
              <div className="registered-header">
                <h3>Registered Vehicles</h3>
                <span className="badge-total">2 Total</span>
              </div>
              
              <div className="registered-list">
                {registeredVehicles.map((veh, idx) => (
                  <div key={idx} className="registered-item">
                    <span className="veh-model">{veh.model}</span>
                    <span className="veh-plate">{veh.plate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAYMENT */}
        {step === 2 && (
          <div className="payment-card-wrapper">
            <div className="payment-summary-row">
              <div>
                <h3>Payment Details</h3>
                <div className="fee-row">
                  <span>Standard Sticker Fee</span>
                  <span className="fee-value">₱250.00</span>
                </div>
                <div className="fee-row">
                  <span>Processing Fee</span>
                  <span className="fee-value">₱0.00</span>
                </div>
              </div>

              <div className="total-fee-box">
                <span className="total-fee-title">Vehicle Sticker Fee Total</span>
                <span className="total-fee-amount">₱250.00</span>
              </div>
            </div>

            <h3 className="payment-method-title">Payment Method</h3>

            <div className="payment-methods-grid">
              <div 
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'digital' }))}
                className={`payment-option ${formData.paymentMethod === 'digital' ? 'selected' : ''}`}
              >
                <div className="payment-option-icon">{Icons.qrCode}</div>
                <h4>Digital Payment</h4>
                <p>Scan to pay securely.</p>
              </div>

              <div 
                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                className={`payment-option ${formData.paymentMethod === 'cash' ? 'selected' : ''}`}
              >
                <div className="payment-option-icon">{Icons.cash}</div>
                <h4>Cash Payment</h4>
                <p>Pay directly to your Zone Collector.</p>
              </div>
            </div>

            <div className="form-actions-right">
              <button 
                type="button" 
                onClick={handleFormSubmit}
                className="btn-primary"
              >
                Submit Application {Icons.arrowRight}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PICK-UP / SUCCESS */}
        {step === 3 && (
          <div className="success-card">
            <div className="success-icon-wrapper">{Icons.checkCircle}</div>
            <h2>Application Submitted Successfully!</h2>
            <p>
              Your vehicle sticker request is currently under review by the association. You will be notified once ready for pick-up at the village admin office.
            </p>
            <button 
              type="button" 
              onClick={() => {
                setFormData({
                  applicantName: '',
                  plateNumber: '',
                  category: '',
                  makeModel: '',
                  color: '',
                  orFile: null,
                  crFile: null,
                  paymentMethod: '',
                  proofOfPayment: null,
                  referenceNumber: ''
                });
                setStep(1);
              }}
              className="btn-primary center-btn"
            >
              Register Another Vehicle
            </button>
          </div>
        )}
      </div>

      {/* QR CODE DIGITAL PAYMENT MODAL RENDERED VIA PORTAL WITH INLINE FALLBACK STYLES */}
      {showQrModal && typeof window !== 'undefined' && createPortal(
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999999,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            boxSizing: 'border-box'
          }} className="modal-container">
            <div className="modal-header">
              <div>
                <h2>QR Code Digital Payment</h2>
                <span className="transaction-id">Transaction ID: #ARV-2026-0004</span>
              </div>
              <button 
                type="button" 
                onClick={() => setShowQrModal(false)} 
                className="modal-close-btn"
              >
                {Icons.close}
              </button>
            </div>

            <div className="modal-body">
              <div className="provider-badge">
                <span className="provider-tag">GCash</span>
              </div>

              <div className="qr-code-frame">
                <div className="qr-simulated-box">
                  <div className="qr-center-pattern" />
                </div>
              </div>

              <label className="upload-proof-box">
                {Icons.upload}
                <div className="upload-text-group">
                  <span className="upload-title">{formData.proofOfPayment ? formData.proofOfPayment.name : 'Upload Proof of Payment'}</span>
                  <span className="upload-sub">JPG, PNG (Max 5MB)</span>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleFileChange(e, 'proofOfPayment')} 
                  style={{ display: 'none' }} 
                />
              </label>

              <div className="form-group text-left mb-0">
                <label className="ref-label-flex">
                  INPUT REFERENCE NUMBER
                  <span title="Enter the reference number from your receipt">{Icons.info}</span>
                </label>
                <input 
                  type="text" 
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 9012345678910" 
                />
              </div>

              <button 
                type="button" 
                onClick={handleQrSubmit}
                className="btn-primary modal-submit-btn"
              >
                SUBMIT FOR VALIDATION
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}