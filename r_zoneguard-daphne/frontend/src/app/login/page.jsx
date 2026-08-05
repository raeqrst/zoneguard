'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './style.css';

export default function UnifiedLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Trim whitespace from email just in case
            const cleanPayload = {
                ...formData,
                email: formData.email.trim(),
            };

            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cleanPayload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            // Store Auth Credentials
            localStorage.setItem('token', data.token);
            
            // Kept your original user storage just in case other dashboards rely on it
            localStorage.setItem('user', JSON.stringify(data.user || data));
            
            // ✅ ADDED: This is the exact key the new Homeowner Dashboard needs to display the dynamic name!
            localStorage.setItem('zoneguard_user', JSON.stringify(data.user || data));

            // ✅ Bulletproof role check (handles lowercase & different property names)
            const rawRole = data.user?.system_role || data.user?.role || data.role || '';
            const userRole = String(rawRole).toUpperCase();

            switch (userRole) {
                case 'ADMIN':
                    router.push('/admin/dashboard');
                    break;
                case 'HOMEOWNER':
                    router.push('/homeowner/dashboard');
                    break;
                case 'TENANT':
                    router.push('/tenant/dashboard');
                    break;
                case 'COLLECTOR':
                    router.push('/collector/dashboard');
                    break;
                case 'DIRECTOR':
                    router.push('/director/dashboard');
                    break;
                default:
                    // If no valid role is found, don't default to admin!
                    throw new Error('User account has no assigned role. Contact support.');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
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
                    <span className="login-link-text">Login</span>
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

                    <h1 className="card-title">ZoneGuard Access</h1>
                    <p className="card-subtitle">NIA VILLAGE SUBD.</p>

                    {/* Error Message Box */}
                    {error && (
                        <div style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '12px', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="e.g. JuanDelaCruz@gmail.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <div className="password-header">
                                <label htmlFor="password">Password</label>
                                <Link href="/forgot-password" className="forgot-link">
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

                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="card-footer">
                        <span className="footer-text">Don't have an account? </span>
                        <Link href="/signup" className="signup-link">
                            Sign up
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}