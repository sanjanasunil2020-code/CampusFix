import React from 'react';
import { Shield, Sun, Moon, AlertTriangle, Info, LogOut, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

export default function Header({ 
  currentPage,
  setCurrentPage,
  theme, 
  toggleTheme, 
  onOpenSOS, 
  onOpenInfo, 
  currentUser, 
  onLogout 
}) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setCurrentPage(currentUser ? 'dashboard' : 'login')}>
        <div className="brand-icon">
          <Shield size={24} />
        </div>
        <div>
          <div className="brand-title">
            CampusFix <span className="brand-badge">College Portal 2.0</span>
          </div>
        </div>
      </div>

      <div className="nav-actions">
        {/* Navigation Page Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', marginRight: '0.5rem' }}>
          {!currentUser ? (
            <>
              <button 
                className={`nav-page-link ${currentPage === 'login' ? 'active' : ''}`}
                onClick={() => setCurrentPage('login')}
              >
                <LogIn size={15} />
                <span>Log In</span>
              </button>
              <button 
                className={`nav-page-link ${currentPage === 'signup' ? 'active' : ''}`}
                onClick={() => setCurrentPage('signup')}
              >
                <UserPlus size={15} />
                <span>Sign Up</span>
              </button>
            </>
          ) : (
            <button 
              className={`nav-page-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              <LayoutDashboard size={15} />
              <span>Campus Dashboard</span>
            </button>
          )}
        </div>

        <div className="status-indicator">
          <span className="status-dot"></span>
          <span>Campus Network Online</span>
        </div>

        <button 
          className="btn-sos" 
          onClick={onOpenSOS}
          title="Campus Emergency SOS Helpline"
        >
          <AlertTriangle size={16} />
          <span>Emergency SOS</span>
        </button>

        <button 
          className="btn-icon-secondary" 
          onClick={onOpenInfo}
          title="System SLA & Information"
        >
          <Info size={18} />
        </button>

        <button 
          className="btn-icon-secondary" 
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0.75rem', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bg-glass-border)' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {currentUser.name}
            </span>
            <span className="brand-badge" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>
              {currentUser.role || 'Member'}
            </span>
            <button 
              className="btn-icon-secondary" 
              onClick={onLogout}
              title="Log Out of Portal"
              style={{ width: '28px', height: '28px', color: '#f43f5e', borderColor: 'rgba(244,63,94,0.3)', marginLeft: '0.2rem' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
