import React, { useState, useEffect } from 'react';
import { MailCheck, KeyRound, ShieldCheck, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export default function EmailVerificationModal({ 
  userPayload, 
  onVerifySuccess, 
  onCancel, 
  showToast 
}) {
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [expectedCode, setExpectedCode] = useState('849201');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    // Generate random 6-digit code for verification simulation
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(randomCode);
    showToast(`Verification OTP sent to ${userPayload.email}: ${randomCode}`, 'info');

    const interval = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [userPayload.email]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...otpCode];
    newCode[index] = value;
    setOtpCode(newCode);

    // Auto focus next field
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoFillCode = () => {
    setOtpCode(expectedCode.split(''));
    showToast('Auto-filled 6-digit verification code', 'info');
  };

  const handleResend = () => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setExpectedCode(newCode);
    setTimer(45);
    setOtpCode(['', '', '', '', '', '']);
    showToast(`New OTP sent to ${userPayload.email}: ${newCode}`, 'info');
  };

  const handleSubmitVerification = (e) => {
    e.preventDefault();
    const enteredCode = otpCode.join('');

    if (enteredCode.length < 6) {
      showToast('Please enter complete 6-digit verification code', 'warning');
      return;
    }

    if (enteredCode !== expectedCode) {
      showToast('Invalid verification code. Please check code or click Auto-fill.', 'error');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showToast(`Email ${userPayload.email} verified successfully!`, 'success');
      onVerifySuccess({
        ...userPayload,
        isVerified: true
      });
    }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '480px', textAlign: 'center', position: 'relative' }}>
        <button 
          className="close-btn" 
          onClick={onCancel}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}
        >
          ✕
        </button>

        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'var(--accent-cyan)' }}>
          <MailCheck size={32} />
        </div>

        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.3rem' }}>
          Verify Institutional Email
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          A 6-digit security code has been sent to <br />
          <strong style={{ color: 'var(--accent-cyan)' }}>{userPayload.email}</strong>
        </p>

        {/* Demo Simulated Banner Notification */}
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(16,185,129,0.1)', border: '1px border-dashed rgba(16,185,129,0.3)', marginBottom: '1.25rem', fontSize: '0.82rem', color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>🔑 Demo Verification Code: <strong>{expectedCode}</strong></span>
          <button 
            type="button" 
            className="demo-chip-btn" 
            onClick={handleAutoFillCode}
            style={{ background: 'rgba(16,185,129,0.2)', borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)', fontWeight: 700 }}
          >
            Auto-Fill OTP
          </button>
        </div>

        <form onSubmit={handleSubmitVerification}>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {otpCode.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '46px',
                  height: '52px',
                  borderRadius: '10px',
                  background: 'rgba(0,0,0,0.25)',
                  border: digit ? '2px solid var(--accent-cyan)' : '1px solid var(--bg-glass-border)',
                  color: '#fff',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  textAlign: 'center',
                  outline: 'none',
                  boxShadow: digit ? '0 0 12px rgba(6,182,212,0.25)' : 'none'
                }}
              />
            ))}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isVerifying}
            style={{ marginBottom: '1rem' }}
          >
            {isVerifying ? (
              <>
                <div className="spinner"></div>
                <span>Verifying Email Security...</span>
              </>
            ) : (
              <>
                <span>Verify Email & Enter Dashboard</span>
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Didn't receive the code?</span>
          {timer > 0 ? (
            <span style={{ color: 'var(--accent-cyan)' }}>Resend in {timer}s</span>
          ) : (
            <button 
              type="button" 
              className="link-btn" 
              onClick={handleResend}
              style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
            >
              <RotateCw size={13} />
              <span>Resend Code</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
