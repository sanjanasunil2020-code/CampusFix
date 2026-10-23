import React, { useState } from 'react';
import {
  Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, UserPlus,
  Sparkles, CheckCircle2, Building, Shield, KeyRound, Wrench, GraduationCap, Briefcase
} from 'lucide-react';
import RoleSelector, { ROLES } from '../components/RoleSelector';
import DemoCredentialsBar from '../components/DemoCredentialsBar';
import EmailVerificationModal from '../components/EmailVerificationModal';

export default function LoginPage({
  onLoginSuccess,
  onNavigateToSignup,
  showToast,
  onOpenForgotPassword
}) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Verification modal state
  const [pendingUserPayload, setPendingUserPayload] = useState(null);

  const handleAutoFillDemo = (demo) => {
    const matchedRole = ROLES.find(r => r.id === demo.roleId) || ROLES[0];
    setSelectedRole(matchedRole);
    setLoginEmail(demo.email);
    setLoginPassword('Campus#2026!');
    setCaptchaChecked(true);
    showToast(`Loaded demo credentials for ${demo.name} (${demo.email})`, 'info');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('Please enter your campus email and password', 'warning');
      return;
    }
    if (!captchaChecked) {
      showToast('Please check the security verification checkbox', 'warning');
      return;
    }

    const emailLower = loginEmail.toLowerCase().trim();

    // DOMAIN VALIDATION BY ROLE
    if (selectedRole.id === 'student' && !emailLower.endsWith('@student.com')) {
      showToast('Student email must end with @student.com (e.g. alex@student.com)', 'error');
      return;
    }
    if (selectedRole.id === 'faculty' && !emailLower.endsWith('@staff.com')) {
      showToast('Faculty & Staff email must end with @staff.com (e.g. sharma@staff.com)', 'error');
      return;
    }
    if (selectedRole.id === 'maintenance' && !emailLower.endsWith('@mstaff.com')) {
      showToast('Maintenance Staff email must end with @mstaff.com (e.g. david@mstaff.com)', 'error');
      return;
    }
    if (selectedRole.id === 'admin' && !emailLower.endsWith('@admin.com')) {
      showToast('College Admin email must end with @admin.com (e.g. dean@admin.com)', 'error');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      const emailPrefix = loginEmail.split('@')[0];
      const formatName = emailPrefix
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());

      // Determine maintenance specialization from email prefix keywords
      let maintenanceSpecialization = 'HVAC & Electrical'; // default
      let maintenanceDepartment = 'HVAC & Electrical Facilities';
      if (selectedRole.id === 'maintenance') {
        const ep = emailPrefix.toLowerCase();
        if (ep.includes('it') || ep.includes('net') || ep.includes('wifi') || ep.includes('tech')) {
          maintenanceSpecialization = 'IT & Wi-Fi Network';
          maintenanceDepartment = 'IT & Network Operations Wing';
        } else if (ep.includes('plumb') || ep.includes('sanit') || ep.includes('water')) {
          maintenanceSpecialization = 'Plumbing & Sanitation';
          maintenanceDepartment = 'Plumbing & Sanitation Wing';
        } else if (ep.includes('carpent') || ep.includes('furniture') || ep.includes('wood')) {
          maintenanceSpecialization = 'Furniture & Carpentry';
          maintenanceDepartment = 'Furniture & Carpentry Wing';
        } else if (ep.includes('security') || ep.includes('guard') || ep.includes('safe')) {
          maintenanceSpecialization = 'Campus Security & Safety';
          maintenanceDepartment = 'Campus Security & Safety Wing';
        }
        // else: HVAC & Electrical (default)
      }

      const payload = {
        name: formatName || (selectedRole.id === 'admin' ? 'Dean Office Admin' : selectedRole.id === 'maintenance' ? 'David Miller' : selectedRole.id === 'faculty' ? 'Dr. Rajesh Sharma' : 'Alex Morgan'),
        email: loginEmail,
        role: selectedRole.name,
        roleId: selectedRole.id,
        campusId: selectedRole.id === 'admin' ? 'ADM-001' : selectedRole.id === 'maintenance' ? 'TECH-8821' : selectedRole.id === 'faculty' ? 'EMP-4092' : '2024CS108',
        department: selectedRole.id === 'maintenance' ? maintenanceDepartment : selectedRole.id === 'admin' ? 'Central Administration' : selectedRole.id === 'faculty' ? 'Computer Science Department' : 'Undergraduate Engineering',
        specialization: selectedRole.id === 'maintenance' ? maintenanceSpecialization : null,
      };

      setPendingUserPayload(payload);
    }, 600);
  };

  const handleVerifyComplete = (verifiedPayload) => {
    setPendingUserPayload(null);
    onLoginSuccess(verifiedPayload);
  };

  return (
    <div className="page-container">
      <div className="page-grid">
        {/* Left Side Showcase */}
        <div className="hero-showcase-panel glass-panel">
          <div className="hero-image-wrapper">
            <img
              src="/images/smart_campus_hero.png"
              alt="Smart College Campus Building"
              className="hero-banner-img"
            />
            <div className="hero-image-overlay">
              <span className="brand-badge" style={{ background: 'rgba(6,182,212,0.3)', backdropFilter: 'blur(10px)' }}>
                Institutional Email Verification
              </span>
              <h2 className="hero-overlay-title">Smart College Issue & Grievance Portal</h2>
              <p className="hero-overlay-sub">
                Domain-verified role access for @student.com, @staff.com, @mstaff.com, and @admin.com portal members.
              </p>
            </div>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="feature-card">
              <div className="feature-icon blue">
                <GraduationCap size={20} />
              </div>
              <div className="feature-text">
                <h4>Verified @student.com Domain</h4>
                <p>Students authenticate via @student.com emails to log campus & library issues.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon purple">
                <ShieldCheck size={20} />
              </div>
              <div className="feature-text">
                <h4>Single Master @admin.com</h4>
                <p>One-time registration master college admin dashboard for oversight & ticket approval.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon emerald">
                <Wrench size={20} />
              </div>
              <div className="feature-text">
                <h4>Verified @mstaff.com Operations</h4>
                <p>Maintenance staff log in with @mstaff.com emails to receive admin-approved tasks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Login Form */}
        <div className="form-card glass-panel">
          <div className="page-header-title">
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Campus Role Log In
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Log in with your verified domain email address ({selectedRole.emailDomain}).
            </p>
          </div>

          {/* Role Switcher */}
          <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

          {/* Demo Personas 1-Click Auto Fill */}
          <DemoCredentialsBar onSelectDemo={handleAutoFillDemo} />

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">
                Campus Email (<span style={{ color: 'var(--accent-cyan)' }}>Must end with {selectedRole.emailDomain}</span>)
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  type="email"
                  className="form-input"
                  placeholder={`username${selectedRole.emailDomain}`}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="input-action-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember session on this device</span>
              </label>

              <button
                type="button"
                className="link-btn"
                onClick={onOpenForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {/* Security Check */}
            <div className="captcha-box">
              <label className="captcha-check">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={captchaChecked}
                  onChange={(e) => setCaptchaChecked(e.target.checked)}
                />
                <span>Verify Domain Email Security Check</span>
              </label>
              <div className="captcha-badge">
                <ShieldCheck size={15} style={{ color: 'var(--accent-emerald)' }} />
                <span>DOMAIN SSO</span>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{ marginBottom: '1.25rem' }}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Validating Email Domain...</span>
                </>
              ) : (
                <>
                  <span>Log In & Verify {selectedRole.name}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Navigation Link to Sign Up */}
          <div className="auth-switch-footer">
            <span>Don't have a registered account yet?</span>
            <button
              className="btn-switch-page"
              onClick={onNavigateToSignup}
            >
              <UserPlus size={16} />
              <span>Register Account →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Email Verification OTP Modal */}
      {pendingUserPayload && (
        <EmailVerificationModal
          userPayload={pendingUserPayload}
          onVerifySuccess={handleVerifyComplete}
          onCancel={() => setPendingUserPayload(null)}
          showToast={showToast}
        />
      )}
    </div>
  );
}
