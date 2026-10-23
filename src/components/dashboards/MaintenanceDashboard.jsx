import React, { useState } from 'react';
import { 
  Wrench, Check, Clock, MapPin, AlertCircle, Sparkles, CheckCircle2, ShieldAlert, UserCheck, Radio
} from 'lucide-react';

export default function MaintenanceDashboard({ 
  user, 
  complaints, 
  notifications = [],
  onStaffStartWork, 
  onMarkResolved, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}) {
  const [activeTab, setActiveTab] = useState('all'); // default 'all' so routed tickets are immediately visible
  const [onDuty, setOnDuty] = useState(true);

  // ── Wing-based routing: only show complaints that belong to this technician's specialization ──
  // Normalize both sides to lowercase + trim to avoid any encoding/whitespace mismatch
  const normalizeCategory = (s) => (s || '').toLowerCase().trim();
  const techSpec = normalizeCategory(user.specialization);

  const wingComplaints = techSpec
    ? complaints.filter(c => {
        const cat = normalizeCategory(c.category);
        const assigned = normalizeCategory(c.assignedCategory);
        return cat === techSpec || assigned === techSpec;
      })
    : complaints; // no specialization = fallback: show all

  // Tab counts are computed from wing-filtered complaints
  const approvedTasks   = wingComplaints.filter(c => c.status === 'approved');
  const inProgressTasks = wingComplaints.filter(c => c.status === 'in-progress');
  const pendingTasks    = wingComplaints.filter(c => c.status === 'pending');
  const resolvedTasks   = wingComplaints.filter(c => c.status === 'resolved');

  const displayedTasks = wingComplaints.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesTab = true;
    if (activeTab === 'approved')    matchesTab = c.status === 'approved';
    else if (activeTab === 'in-progress') matchesTab = c.status === 'in-progress';
    else if (activeTab === 'pending')     matchesTab = c.status === 'pending';
    else if (activeTab === 'resolved')    matchesTab = c.status === 'resolved';
    return matchesSearch && matchesTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Maintenance Staff Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(217,119,6,0.12) 100%)', border: '1px solid rgba(245,158,11,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.4rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Wrench size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Maintenance Staff Portal • {user.name}</h2>
              <span className="brand-badge" style={{ background: 'rgba(245,158,11,0.2)', color: 'var(--accent-amber)', borderColor: 'rgba(245,158,11,0.4)' }}>Field Technician</span>
              {user.specialization && (
                <span className="brand-badge" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)', borderColor: 'rgba(16,185,129,0.35)', maxWidth: 220 }}>
                  🔧 Wing: {user.specialization}
                </span>
              )}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Staff ID: <strong style={{ color: 'var(--text-primary)' }}>{user.campusId || 'TECH-8821'}</strong> • Email: {user.email} • Wing: {user.department || user.specialization || 'HVAC & Electrical Facilities'}
            </p>
          </div>
        </div>

        {/* Shift Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button 
            type="button"
            className="demo-chip-btn"
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem',
              fontWeight: 700,
              background: onDuty ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
              borderColor: onDuty ? 'var(--accent-emerald)' : 'var(--accent-amber)',
              color: onDuty ? 'var(--accent-emerald)' : 'var(--accent-amber)'
            }}
            onClick={() => setOnDuty(!onDuty)}
          >
            {onDuty ? '🟢 On Duty / Receiving Work Orders' : '🟡 In Field / On Job'}
          </button>
        </div>
      </div>

      {/* Target Admin Broadcast Notifications for Maintenance Staff */}
      {notifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <div key={n.id} className="glass-panel" style={{ padding: '1rem 1.25rem', border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radio size={24} style={{ color: 'var(--accent-amber)', flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="brand-badge" style={{ background: 'rgba(245,158,11,0.25)', color: 'var(--accent-amber)' }}>📢 Admin Maintenance Order</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{n.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="stats-grid">
        <div className="stat-item glass-panel" style={{ borderLeft: '4px solid var(--accent-amber)' }}>
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{approvedTasks.length}</div>
          <div className="stat-label">Admin Approved Tasks (Ready to Start)</div>
        </div>
        <div className="stat-item glass-panel" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{inProgressTasks.length}</div>
          <div className="stat-label">Active Work Orders In Progress</div>
        </div>
        <div className="stat-item glass-panel" style={{ borderLeft: '4px solid var(--accent-emerald)' }}>
          <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{resolvedTasks.length}</div>
          <div className="stat-label">Completed Jobs</div>
        </div>
      </div>

      {/* Work Order Category Filter Tabs */}
      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            className={`nav-page-link ${activeTab === 'approved' ? 'active' : ''}`}
            onClick={() => setActiveTab('approved')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.83rem' }}
          >
            <Sparkles size={14} />
            <span>Admin Approved ({approvedTasks.length})</span>
          </button>
          <button 
            className={`nav-page-link ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.83rem' }}
          >
            <Wrench size={14} />
            <span>In Progress ({inProgressTasks.length})</span>
          </button>
          <button 
            className={`nav-page-link ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.83rem' }}
          >
            <Clock size={14} />
            <span>Awaiting Admin ({pendingTasks.length})</span>
          </button>
          <button 
            className={`nav-page-link ${activeTab === 'resolved' ? 'active' : ''}`}
            onClick={() => setActiveTab('resolved')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.83rem' }}
          >
            <CheckCircle2 size={14} />
            <span>Resolved ({resolvedTasks.length})</span>
          </button>
          <button 
            className={`nav-page-link ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.83rem' }}
          >
            <span>All Orders ({wingComplaints.length})</span>
          </button>
        </div>

        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '1rem', width: '220px' }}
          placeholder="Filter work orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Main Work Order List */}
      <div className="dash-grid">
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={20} style={{ color: 'var(--accent-amber)' }} />
            <span>Technician Work Orders ({displayedTasks.length})</span>
            {user.specialization && (
              <span style={{ marginLeft: 'auto', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-emerald)', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '0.2rem 0.6rem' }}>
                🔧 {user.specialization} Wing Only
              </span>
            )}
          </h3>

          {displayedTasks.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.5rem' }} />
              <p>No work orders found under "{activeTab}" tab{user.specialization ? ` for the ${user.specialization} wing` : ''}.</p>
              {user.specialization && (
                <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--accent-amber)' }}>
                  Only tickets categorised as <strong>{user.specialization}</strong> are routed to your dashboard.
                </p>
              )}
            </div>
          ) : (
            displayedTasks.map(item => (
              <div key={item.id} className="ticket-card" style={{ borderColor: item.status === 'approved' ? 'rgba(245,158,11,0.4)' : undefined }}>
                <div className="ticket-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="ticket-id">{item.id}</span>
                    <span className="tag" style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-amber)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
                      {item.category}
                    </span>
                  </div>
                  <span className={`status-chip ${item.status}`}>
                    {item.status === 'pending' ? 'Pending Admin Approval' : item.status.replace('-', ' ')}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.4rem 0' }}>{item.title}</h4>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <strong style={{ color: 'var(--text-primary)' }}>{item.location}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    ETA Target: {item.eta}
                  </span>
                  <span style={{ fontWeight: 600, color: item.priority === 'Urgent' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                    Priority: {item.priority}
                  </span>
                </div>

                {/* Maintenance Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--bg-glass-border)', paddingTop: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Assigned: <strong style={{ color: 'var(--text-primary)' }}>{item.technician}</strong>
                  </span>

                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                    {/* Approved Status -> Maintenance Staff can START WORK */}
                    {item.status === 'approved' && (
                      <button 
                        className="btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', width: 'auto' }}
                        onClick={() => onStaffStartWork(item.id)}
                      >
                        <Wrench size={16} />
                        <span>Start Work (Accept Job)</span>
                      </button>
                    )}

                    {/* In Progress Status -> Maintenance Staff can MARK RESOLVED */}
                    {item.status === 'in-progress' && (
                      <button 
                        className="btn-primary"
                        style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981, #059669)', width: 'auto' }}
                        onClick={() => onMarkResolved(item.id)}
                      >
                        <Check size={16} />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    {/* Pending Status -> Cannot start work until Admin approves */}
                    {item.status === 'pending' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.1)', padding: '0.3rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <ShieldAlert size={14} />
                        <span>Awaiting College Admin Approval</span>
                      </div>
                    )}

                    {item.status === 'resolved' && (
                      <span style={{ fontSize: '0.78rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                        ✓ Job Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Inventory & Tool Sidebar */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--accent-amber)' }} />
              <span>Technician Workflow Rules</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div><strong>1. Admin Approval:</strong> Work orders appear in "Admin Approved" tab once verified by Admin.</div>
              <div><strong>2. Start Work:</strong> Click "Start Work" to change status to In-Progress and update ETA.</div>
              <div><strong>3. Resolution:</strong> Once issue fixed, click "Mark Resolved" to notify student/faculty.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
