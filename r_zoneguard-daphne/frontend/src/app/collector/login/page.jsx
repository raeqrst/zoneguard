'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

export default function CollectorLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform auth validation/API calls here if needed
    console.log('Logging in Collector:', formData);

    // Redirect straight to collector dashboard
    router.push('/collector/dashboard');
  };

  return (
    <>
      <style jsx global>{`
        /* Hide stray sidebars if wrapped in a dashboard layout */
        aside, .sidebar, [class*="sidebar"] {
          display: none !important;
        }
        /* Ensure the main container breaks out to full width */
        body, html, #__next {
          margin: 0;
          padding: 0;
          width: 100%;
          background-color: #ffffff;
        }
      `}</style>

      <div className="login-wrapper">
        {/* Top Header */}
        <header className="login-header">
          <div className="brand-logo">
            <svg
              className="brand-icon"
              viewBox="0 0 24 24"
              fill="currentColor"
              width="28"
              height="28"
            >
              <path d="M10.707 2.293a1 1 0 011.414 0l8 8a1 1 0 01-1.414 1.414L18 10.914V19a2 2 0 01-2 2H8a2 2 0 01-2-2v-8.086l-1.293 1.293a1 1 0 01-1.414-1.414l8-8z" />
            </svg>
            <span className="brand-name">ZoneGuard</span>
          </div>
          <div className="header-right">
            <span className="login-link-text">Collector Portal</span>
          </div>
        </header>

        {/* Main Container */}
        <main className="login-container">
          <div className="login-card">
            {/* Logo Badge */}
            <div className="card-logo">
              <div className="house-shield-icon">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="#064E3B"
                  className="icon-house"
                >
                  <path d="M12 3L2 12h3v8h14v-8h3L12 3z" />
                </svg>
                <div className="shield-badge">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="card-title">Collector Access</h1>
            <p className="card-subtitle">NIA VILLAGE SUBD.</p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="e.g. collector@zoneguard.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                  <Link href="/collector/forgot-password" className="forgot-link">
                    Forgot Password?
                  </Link>
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit" className="btn-login">
                Login
              </button>
            </form>

            <div className="card-footer">
              <span className="footer-text">Need assistance? </span>
              <Link href="/collector/support" className="signup-link">
                Contact Support
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}