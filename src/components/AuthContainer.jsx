import React, { useState } from 'react';
import { 
  Mail, Lock, Eye, EyeOff, User, Building2, Phone, KeyRound, 
  ArrowRight, ShieldCheck, CheckCircle, HelpCircle, LogIn, UserPlus 
} from 'lucide-react';
import RoleSelector, { ROLES } from './RoleSelector';
import DemoCredentialsBar from './DemoCredentialsBar';

export default function AuthContainer({ onLoginSuccess, showToast, onOpenForgotPassword }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [selectedRole, setSelectedRole] = useState(ROLES[0]); // Default Student
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  // Signup Form States
  const [signupName, setSignupName] = useState('');
  const [signupId, setSignupId] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupDept, setSignupDept] = useState('Computer Science');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Calculate Password Strength for Signup
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1: return { score: 25, label: 'Weak', color: 'var(--accent-rose)' };
      case 2: return { score: 50, label: 'Fair', color: 'var(--accent-amber)' };
      case 3: return { score: 75, label: 'Good', color: 'var(--accent-blue)' };
      case 4: return { score: 100, label: 'Strong', color: 'var(--accent-emerald)' };
      default: return { score: 10, label: 'Very Weak', color: 'var(--accent-rose)' };
    }
  };

  const passStrength = getPasswordStrength(signupPassword);

  // Handle Demo Persona Auto-Fill
  const handleAutoFillDemo = (demo) => {
    const matchedRole = ROLES.find(r => r.id === demo.roleId) || ROLES[0];
    setSelectedRole(matchedRole);

    if (activeTab === 'login') {
      setLoginEmail(demo.email);
      setLoginPassword('Campus#2026!');
      setCaptchaChecked(true);
      showToast(`Auto-filled login for ${demo.name} (${matchedRole.name})`, 'info');
    } else {
      setSignupName(demo.name);
      setSignupId(demo.idVal);
      setSignupEmail(demo.email);
      setSignupPhone('+1 (555) 019-2834');
      setSignupPassword('Campus#2026!');
      setSignupConfirmPassword('Campus#2026!');
      setAgreeTerms(true);
      showToast(`Auto-filled signup form for ${demo.name}`, 'info');
    }
  };

  // Submit Login
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      showToast('Please enter your institutional email and password', 'warning');
      return;
    }
    if (!captchaChecked) {
      showToast('Please check the human verification box', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userName = loginEmail.split('@')[0].replace('.', ' ').toUpperCase();
      const userPayload = {
        name: userName || 'Alex Morgan',
        email: loginEmail,
        role: selectedRole.name,
        roleId: selectedRole.id,
        campusId: '2024CS108'
      };
      showToast(`Welcome back, ${userPayload.name}! Signed in successfully.`, 'success');
      onLoginSuccess(userPayload);
    }, 1200);
  };

  // Submit Signup
  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      showToast('Please complete all required signup fields', 'warning');
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      showToast('Passwords do not match. Please verify.', 'error');
      return;
    }
    if (!agreeTerms) {
      showToast('You must agree to the Campus Code of Conduct', 'warning');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUserPayload = {
        name: signupName,
        email: signupEmail,
        role: selectedRole.name,
        roleId: selectedRole.id,
        campusId: signupId || 'NEW-REG-001',
        department: signupDept
      };
      showToast(`Account created successfully! Welcome to CampusFix, ${signupName}.`, 'success');
      onLoginSuccess(newUserPayload);
    }, 1400);
  };

  return (
    <div className="form-card">
      {/* Sliding Tab Switcher */}
      <div className="tab-switcher">
        <div className={`tab-indicator ${activeTab === 'signup' ? 'signup' : ''}`}></div>
        <button
          className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
          onClick={() => setActiveTab('login')}
          type="button"
        >
          <LogIn size={18} />
          <span>Log In</span>
        </button>
        <button
          className={`tab-btn ${activeTab === 'signup' ? 'active' : ''}`}
          onClick={() => setActiveTab('signup')}
          type="button"
        >
          <UserPlus size={18} />
          <span>Sign Up</span>
        </button>
      </div>

      {/* Role Selection */}
      <RoleSelector selectedRole={selectedRole} onSelectRole={setSelectedRole} />

      {/* Demo Credentials Auto-Fill Bar */}
      <DemoCredentialsBar onSelectDemo={handleAutoFillDemo} />

      {/* LOGIN FORM TAB */}
      {activeTab === 'login' ? (
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label className="form-label">Campus Email / Institutional ID</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder={`name${selectedRole.emailDomain}`}
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
                title={showPassword ? 'Hide password' : 'Show password'}
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
              <span>Remember me on this device</span>
            </label>

            <button
              type="button"
              className="link-btn"
              onClick={onOpenForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {/* Captcha Box */}
          <div className="captcha-box">
            <label className="captcha-check">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={captchaChecked}
                onChange={(e) => setCaptchaChecked(e.target.checked)}
              />
              <span>I'm a human (Campus SSO Verification)</span>
            </label>
            <div className="captcha-badge">
              <ShieldCheck size={15} style={{ color: 'var(--accent-emerald)' }} />
              <span>2FA SECURED</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Authenticating Portal...</span>
              </>
            ) : (
              <>
                <span>Access Campus Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      ) : (
        /* SIGN UP FORM TAB */
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
              <label className="form-label">{selectedRole.name} ID Number</label>
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
              <label className="form-label">Campus Email</label>
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
              <label className="form-label">Department / Block</label>
              <div className="input-wrapper">
                <Building2 className="input-icon" size={18} />
                <select
                  className="form-select"
                  value={signupDept}
                  onChange={(e) => setSignupDept(e.target.value)}
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Hostel Housing & Residence">Hostel Housing & Residence</option>
                  <option value="Library & Academic Resource">Library & Academic Resource</option>
                  <option value="Campus Facilities & Grounds">Campus Facilities & Grounds</option>
                </select>
              </div>
            </div>
          </div>

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
              {/* Password Strength Meter */}
              {signupPassword && (
                <div className="password-strength-container">
                  <div className="strength-meter">
                    <div
                      className="strength-bar"
                      style={{ width: `${passStrength.score}%`, backgroundColor: passStrength.color }}
                    ></div>
                  </div>
                  <div className="strength-info">
                    <span>Password Strength:</span>
                    <span style={{ color: passStrength.color, fontWeight: 700 }}>{passStrength.label}</span>
                  </div>
                </div>
              )}
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
              <span>I agree to the Campus Code of Conduct & Issue SLA Policy</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Register Campus Account</span>
                <CheckCircle size={18} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
