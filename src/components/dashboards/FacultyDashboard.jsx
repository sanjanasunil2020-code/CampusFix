import React from 'react';
import { 
  Plus, Briefcase, MapPin, Clock, AlertCircle, Wrench, CheckCircle2, Shield, Radio, Sparkles
} from 'lucide-react';

export default function FacultyDashboard({ 
  user, 
  complaints, 
  notifications = [],
  onOpenReportModal, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}) {
  const facultyTickets = complaints;
  const urgentCount = facultyTickets.filter(c => c.priority === 'Urgent' || c.priority === 'High').length;
  const pendingCount = facultyTickets.filter(c => c.status === 'pending').length;
  const inProgressCount = facultyTickets.filter(c => c.status === 'in-progress' || c.status === 'approved').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Faculty Banner Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.12) 100%)', border: '1px solid rgba(99,102,241,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.4rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <Briefcase size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Faculty & Staff Portal • {user.name}</h2>
              <span className="brand-badge" style={{ background: 'rgba(99,102,241,0.2)', color: 'var(--accent-indigo)' }}>Faculty & Research</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Employee ID: <strong style={{ color: 'var(--text-primary)' }}>{user.campusId || 'EMP-4092'}</strong> • Email: {user.email} • Dept: {user.department || 'Computer Science Department'}
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={onOpenReportModal} style={{ width: 'auto', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          <Plus size={18} />
          <span>Report Academic / Lab Issue</span>
        </button>
      </div>

      {/* Target Admin Broadcast Notifications for Faculty */}
      {notifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <div key={n.id} className="glass-panel" style={{ padding: '1rem 1.25rem', border: '1px solid rgba(99,102,241,0.4)', background: 'rgba(99,102,241,0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radio size={24} style={{ color: 'var(--accent-indigo)', flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="brand-badge" style={{ background: 'rgba(99,102,241,0.25)', color: 'var(--accent-indigo)' }}>📢 Admin Faculty Broadcast</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{n.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Faculty Metrics */}
      <div className="stats-grid">
        <div className="stat-item glass-panel">
          <div className="stat-value">{facultyTickets.length}</div>
          <div className="stat-label">Academic Infrastructure Tickets</div>
        </div>
        <div className="stat-item glass-panel">
          <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>{urgentCount}</div>
          <div className="stat-label">High Priority / Urgent</div>
        </div>
        <div className="stat-item glass-panel">
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{inProgressCount}</div>
          <div className="stat-label">Dispatched to Maintenance</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '1rem', flex: 1 }}
          placeholder="Search lecture hall, lab equipment, AV projectors, AC issues..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select"
          style={{ paddingLeft: '1rem', width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Academic Issues Grid */}
      <div className="dash-grid">
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={20} style={{ color: 'var(--accent-indigo)' }} />
            <span>Academic & Department Maintenance Feed ({facultyTickets.length})</span>
          </h3>

          {facultyTickets.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.5rem' }} />
              <p>No academic issues logged.</p>
            </div>
          ) : (
            facultyTickets.map(item => (
              <div key={item.id} className="ticket-card">
                <div className="ticket-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="ticket-id">{item.id}</span>
                    <span className="tag" style={{ background: 'rgba(99,102,241,0.15)', color: 'var(--accent-indigo)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
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
                    {item.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Clock size={14} style={{ color: 'var(--text-muted)' }} />
                    ETA: {item.eta}
                  </span>
                  <span style={{ fontWeight: 600, color: item.priority === 'Urgent' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                    Priority: {item.priority}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--bg-glass-border)', paddingTop: '0.6rem', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Assigned Technician: <strong style={{ color: 'var(--text-primary)' }}>{item.technician}</strong>
                  </span>
                  <span style={{ color: 'var(--accent-indigo)', fontWeight: 600 }}>
                    {item.status === 'pending' && "⏳ Sent to Admin for Fast Track Dispatch"}
                    {item.status === 'approved' && "✅ Approved & Assigned to Tech Team"}
                    {item.status === 'in-progress' && "⚡ Tech Team on-site working"}
                    {item.status === 'resolved' && "🎉 Work Complete"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>Academic SLA Escalation</span>
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Lecture hall AV, projector bulbs & exam room electrical breakdowns receive automatic top-tier dispatch priority (&lt; 30 mins SLA).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
