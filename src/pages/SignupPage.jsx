import React, { useState } from 'react';
import { 
  User, Mail, Lock, Eye, EyeOff, Building2, KeyRound, CheckCircle, 
  ArrowRight, LogIn, Sparkles, ShieldCheck, ShieldAlert 
} from 'lucide-react';
import RoleSelector, { ROLES } from '../components/RoleSelector';
import DemoCredentialsBar from '../components/DemoCredentialsBar';
import EmailVerificationModal from '../components/EmailVerificationModal';

export default function SignupPage({ 
  onLoginSuccess, 
  onNavigateToLogin, 
  showToast,
  adminRegistered = true, // Default 1 admin registered, or passed from App
  setAdminRegistered
}) {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form States
  const [signupName, setSignupName] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDept, setSignupDept] = useState('Computer Science & Tech');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [signupSpecialization, setSignupSpecialization] = useState('HVAC & Electrical');

  // Verification modal state
  const [pendingUserPayload, setPendingUserPayload] = useState(null);

  const handleAutoFillDemo = (demo) => {
    const matchedRole = ROLES.find(r => r.id === demo.roleId) || ROLES[0];
    setSelectedRole(matchedRole);
    setSignupName(demo.name);
    setSignupId(demo.idVal);
    setSignupEmail(demo.email);
    setSignupPhone('+1 (555) 019-2834');
    setSignupPassword('Campus#2026!');
    setSignupConfirmPassword('Campus#2026!');
    setAgreeTerms(true);
    showToast(`Loaded demo signup data for ${demo.name} (${demo.email})`, 'info');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      showToast('Please complete all required registration fields', 'warning');
      return;
    }

    const emailLower = signupEmail.toLowerCase().trim();

    // STRICT DOMAIN VALIDATION
    if (selectedRole.id === 'student' && !emailLower.endsWith('@student.com')) {
      showToast('Student registration email must end with @student.com', 'error');
      return;
    }
    if (selectedRole.id === 'faculty' && !emailLower.endsWith('@staff.com')) {
      showToast('Faculty & Staff registration email must end with @staff.com', 'error');
      return;
    }
    if (selectedRole.id === 'maintenance' && !emailLower.endsWith('@mstaff.com')) {
      showToast('Maintenance staff registration email must end with @mstaff.com', 'error');
      return;
    }
    if (selectedRole.id === 'admin' && !emailLower.endsWith('@admin.com')) {
      showToast('College Admin registration email must end with @admin.com', 'error');
      return;
    }

    // ONE-TIME REGISTRATION RULE FOR COLLEGE ADMIN
    if (selectedRole.id === 'admin' && adminRegistered) {
      showToast('College Admin registration is ONE-TIME ONLY! An admin account has already been registered. Please log in with existing admin credentials.', 'error');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      showToast('Passwords do not match. Please re-enter.', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('You must agree to the College Code of Conduct', 'warning');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const payload = {
        name: signupName,
        email: signupEmail,
        role: selectedRole.name,
        roleId: selectedRole.id,
        campusId: signupId || (selectedRole.id === 'admin' ? 'ADM-001' : selectedRole.id === 'maintenance' ? 'TECH-8821' : selectedRole.id === 'faculty' ? 'EMP-4092' : '2024CS108'),
        department: selectedRole.id === 'maintenance'
          ? (() => {
              const wmap = {
                'IT & Wi-Fi Network': 'IT & Network Operations Wing',
                'HVAC & Electrical': 'HVAC & Electrical Facilities',
                'Plumbing & Sanitation': 'Plumbing & Sanitation Wing',
                'Furniture & Carpentry': 'Furniture & Carpentry Wing',
                'Campus Security & Safety': 'Campus Security & Safety Wing',
              };
              return wmap[signupSpecialization] || 'HVAC & Electrical Facilities';
            })()
          : signupDept,
        specialization: selectedRole.id === 'maintenance' ? signupSpecialization : null,
      };

      setPendingUserPayload(payload);
    }, 800);
  };

  const handleVerifyComplete = (verifiedPayload) => {
    setPendingUserPayload(null);
    if (verifiedPayload.roleId === 'admin' && setAdminRegistered) {
      setAdminRegistered(true);
    }
    onLoginSuccess(verifiedPayload);
  };

  return (
    <div className="page-container">
      <div className="page-grid">
        {/* Left Side Registration Form */}
        <div className="form-card glass-panel">
          <div className="page-header-title">
            <h2 className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Register Campus Account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Create an account using your official role email address ({selectedRole.emailDomain}).
            </p>
          </div>

          {/* Role Selector */}
          <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

          {/* Warning Banner if College Admin is already registered */}
          {selectedRole.id === 'admin' && adminRegistered && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--accent-rose)', fontSize: '0.82rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldAlert size={20} style={{ flexShrink: 0 }} />
              <div>
                <strong>Restricted: One-Time Admin Registration Only</strong>
                <div>College Admin has already been registered. Please log in using existing admin credentials.</div>
              </div>
            </div>
          )}

          {/* Demo Auto Fill Bar */}
          <DemoCredentialsBar onSelectDemo={handleAutoFillDemo} />

          {/* Registration Form */}
          <form onSubmit={handleSignupSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <div className="input-wrapper">
                  <User className="input-icon" size={18} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Alex Morgan"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{selectedRole.name} ID</label>
                <div className="input-wrapper">
                  <KeyRound className="input-icon" size={18} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder={selectedRole.placeholder}
                    value={signupId}
                    onChange={(e) => setSignupId(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Institutional Email (<span style={{ color: 'var(--accent-cyan)' }}>Ends with {selectedRole.emailDomain}</span>)
                </label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input
                    type="email"
                    className="form-input"
                    placeholder={`name${selectedRole.emailDomain}`}
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Department / Wing</label>
                <div className="input-wrapper">
                  <Building2 className="input-icon" size={18} />
                  <select
                    className="form-select"
                    value={signupDept}
                    onChange={(e) => setSignupDept(e.target.value)}
                  >
                    <option value="Computer Science & Tech">Computer Science & Tech</option>
                    <option value="Mechanical & Robotics">Mechanical & Robotics</option>
                    <option value="Electrical & Electronics">Electrical & Electronics</option>
                    <option value="Physics & Chemistry Labs">Physics & Chemistry Labs</option>
                    <option value="Library & Learning Commons">Library & Learning Commons</option>
                    <option value="Campus Facilities & Maintenance">Campus Facilities & Maintenance</option>
                    <option value="Administration & Student Affairs">Administration & Student Affairs</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Maintenance Wing Specialization – only shown for maintenance role */}
            {selectedRole.id === 'maintenance' && (
              <div className="form-row">
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">
                    🔧 Your Maintenance Wing / Specialization
                  </label>
                  <div className="input-wrapper">
                    <select
                      className="form-select"
                      value={signupSpecialization}
                      onChange={(e) => setSignupSpecialization(e.target.value)}
                    >
                      <option value="HVAC & Electrical">HVAC &amp; Electrical</option>
                      <option value="IT & Wi-Fi Network">IT &amp; Wi-Fi Network</option>
                      <option value="Plumbing & Sanitation">Plumbing &amp; Sanitation</option>
                      <option value="Furniture & Carpentry">Furniture &amp; Carpentry</option>
                      <option value="Campus Security & Safety">Campus Security &amp; Safety</option>
                    </select>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--accent-amber)', marginTop: '0.3rem' }}>
                    ⚠️ Only complaints of this type will be routed to your dashboard.
                  </p>
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Min. 8 characters"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
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

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Re-enter password"
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="input-action-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="form-options" style={{ marginBottom: '1.25rem' }}>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox-input"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>I agree to the College Code of Conduct & Email Verification Policy</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading || (selectedRole.id === 'admin' && adminRegistered)}
              style={{ marginBottom: '1.25rem', opacity: (selectedRole.id === 'admin' && adminRegistered) ? 0.6 : 1 }}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Creating Account & Sending OTP...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Email Verification</span>
                  <CheckCircle size={18} />
                </>
              )}
            </button>
          </form>

          {/* Switch link to Login */}
          <div className="auth-switch-footer">
            <span>Already have an account?</span>
            <button 
              className="btn-switch-page" 
              onClick={onNavigateToLogin}
            >
              <LogIn size={16} />
              <span>Log In to Existing Account →</span>
            </button>
          </div>
        </div>

        {/* Right Side Showcase */}
        <div className="hero-showcase-panel glass-panel">
          <div className="hero-image-wrapper">
            <img 
              src="/images/college_building_preview.png" 
              alt="College Library & Research Center" 
              className="hero-banner-img"
            />
            <div className="hero-image-overlay">
              <span className="brand-badge" style={{ background: 'rgba(139,92,246,0.3)', backdropFilter: 'blur(10px)' }}>
                Domain Requirements
              </span>
              <h2 className="hero-overlay-title">Role-Based Email Registration</h2>
              <p className="hero-overlay-sub">
                Student (@student.com), Faculty/Staff (@staff.com), Maintenance (@mstaff.com), and College Admin (@admin.com - One time only).
              </p>
            </div>
          </div>

          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="feature-card">
              <div className="feature-icon purple">
                <ShieldCheck size={20} />
              </div>
              <div className="feature-text">
                <h4>6-Digit Email Verification</h4>
                <p>Every account registration requires verifying a 6-digit OTP code sent to your role email.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon blue">
                <Sparkles size={20} />
              </div>
              <div className="feature-text">
                <h4>Protected Admin Command</h4>
                <p>College Admin registration is limited to a single master administrator account.</p>
              </div>
            </div>
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
