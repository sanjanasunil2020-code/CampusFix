import React, { useState } from 'react';
import { KeyRound, Mail, CheckCircle, ArrowRight } from 'lucide-react';

export default function ForgotPasswordModal({ onClose, showToast }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
      showToast(`Password reset link and OTP sent to ${email}`, 'success');
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <KeyRound size={20} style={{ color: 'var(--accent-cyan)' }} />
            <span>Reset Account Password</span>
          </h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Enter your registered campus email address. We'll send a 6-digit OTP security link to reset your portal password.
            </p>

            <div className="form-group">
              <label className="form-label">Campus Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input"
                  placeholder="alex.morgan@student.college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset OTP</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <CheckCircle size={48} style={{ color: 'var(--accent-emerald)', margin: '0 auto 1rem' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reset Instructions Sent!</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Check your inbox at <strong>{email}</strong> for the 2FA password reset instructions.
            </p>
            <button className="btn-primary" onClick={onClose}>
              Return to Login Portal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
