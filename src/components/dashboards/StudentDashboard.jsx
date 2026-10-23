import React from 'react';
import { 
  Plus, Clock, MapPin, Sparkles, AlertCircle, CheckCircle2, 
  GraduationCap, Wifi, Building, ThumbsUp, BookOpen
} from 'lucide-react';

export default function StudentDashboard({ 
  user, 
  complaints, 
  notifications = [],
  onOpenReportModal, 
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter 
}) {
  const studentTickets = complaints;
  const pendingCount = studentTickets.filter(c => c.status === 'pending').length;
  const inProgressCount = studentTickets.filter(c => c.status === 'in-progress' || c.status === 'approved').length;
  const resolvedCount = studentTickets.filter(c => c.status === 'resolved').length;
  const academicsTickets = studentTickets.filter(c => c.category === 'Academics & Examinations');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Student Banner Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.1) 100%)', border: '1px solid rgba(6,182,212,0.25)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.4rem', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}>
            <GraduationCap size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Student Portal • {user.name}</h2>
              <span className="brand-badge" style={{ background: 'rgba(6,182,212,0.2)', color: 'var(--accent-cyan)' }}>Student</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Roll No: <strong style={{ color: 'var(--text-primary)' }}>{user.campusId || '2024CS108'}</strong> • Email: {user.email} • Dept: {user.department || 'Undergraduate Engineering'}
            </p>
          </div>
        </div>

        <button className="btn-primary" onClick={onOpenReportModal} style={{ width: 'auto', padding: '0.75rem 1.5rem' }}>
          <Plus size={18} />
          <span>Report Campus Issue</span>
        </button>
      </div>

      {/* Target Admin Broadcast Notifications for Students */}
      {notifications.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.map(n => (
            <div key={n.id} className="glass-panel" style={{ padding: '1rem 1.25rem', border: '1px solid rgba(6,182,212,0.4)', background: 'rgba(6,182,212,0.08)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Sparkles size={24} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className="brand-badge" style={{ background: 'rgba(6,182,212,0.25)', color: 'var(--accent-cyan)' }}>📢 Admin Student Broadcast</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{n.timestamp}</span>
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{n.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Metrics */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        <div className="stat-item glass-panel">
          <div className="stat-value">{studentTickets.length}</div>
          <div className="stat-label">Total Reported Issues</div>
        </div>
        <div className="stat-item glass-panel">
          <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{inProgressCount + pendingCount}</div>
          <div className="stat-label">Active / In Progress</div>
        </div>
        <div className="stat-item glass-panel">
          <div className="stat-value" style={{ color: 'var(--accent-emerald)' }}>{resolvedCount}</div>
          <div className="stat-label">Resolved Issues</div>
        </div>
        <div className="stat-item glass-panel" style={{ border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.07)' }}>
          <div className="stat-value" style={{ color: '#a78bfa' }}>{academicsTickets.length}</div>
          <div className="stat-label" style={{ color: '#a78bfa' }}>Academics Complaints</div>
        </div>
      </div>

      {/* Academics Complaints Section */}
      {academicsTickets.length > 0 && (
        <div className="glass-panel" style={{ padding: '1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(167,139,250,0.35)', background: 'linear-gradient(135deg, rgba(167,139,250,0.08) 0%, rgba(99,102,241,0.06) 100%)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#a78bfa' }}>
            <BookOpen size={20} />
            <span>Academics & Examinations Complaints ({academicsTickets.length})</span>
            <span className="brand-badge" style={{ background: 'rgba(167,139,250,0.2)', color: '#a78bfa', marginLeft: 'auto' }}>Academic Track</span>
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {academicsTickets.map(item => (
              <div key={item.id} style={{ background: 'rgba(167,139,250,0.07)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 'var(--radius-md)', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: 0 }}>
                  <div style={{ background: 'rgba(167,139,250,0.2)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BookOpen size={18} style={{ color: '#a78bfa' }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'monospace' }}>{item.id}</span>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{item.title}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={12} style={{ color: '#a78bfa' }} />
                        {item.location}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={12} />
                        {item.date}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`status-chip ${item.status}`} style={{ flexShrink: 0 }}>
                  {item.status === 'pending' ? '⏳ Pending Approval' : item.status.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '0.75rem', opacity: 0.7 }}>
            📚 Academic complaints are forwarded to the Dean's Office & Department Heads for review.
          </p>
        </div>
      )}

      {/* Quick Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '1rem', flex: 1 }}
          placeholder="Search your reported issues by title, ticket ID, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="form-select"
          style={{ paddingLeft: '1rem', width: 'auto' }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Ticket Statuses</option>
          <option value="pending">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* Main Ticket Stream */}
      <div className="dash-grid">
        <div>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={20} style={{ color: 'var(--accent-cyan)' }} />
            <span>My Campus Complaints & Trackers ({studentTickets.length})</span>
          </h3>

          {studentTickets.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <AlertCircle size={36} style={{ margin: '0 auto 0.5rem' }} />
              <p>No complaints found matching filter.</p>
            </div>
          ) : (
            studentTickets.map(item => (
              <div key={item.id} className="ticket-card">
                <div className="ticket-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span className="ticket-id">{item.id}</span>
                    <span className="tag" style={{ background: 'rgba(6,182,212,0.15)', color: 'var(--accent-cyan)', padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 600 }}>
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
                </div>

                {/* Live Progress Stage */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem', background: 'rgba(0,0,0,0.15)', padding: '0.6rem', borderRadius: '8px', marginBottom: '0.6rem' }}>
                  {item.timeline.map((step, idx) => (
                    <div key={idx} style={{ fontSize: '0.72rem', color: step.done ? 'var(--accent-emerald)' : 'var(--text-muted)' }}>
                      <div style={{ height: '4px', background: step.done ? 'var(--accent-emerald)' : 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '4px' }}></div>
                      <span style={{ fontWeight: step.done ? 700 : 400 }}>{step.step}</span>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--bg-glass-border)', paddingTop: '0.6rem', fontSize: '0.78rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Technician Status: <strong style={{ color: 'var(--text-primary)' }}>{item.technician}</strong>
                  </span>
                  <span style={{ color: item.status === 'resolved' ? 'var(--accent-emerald)' : 'var(--accent-cyan)', fontWeight: 600 }}>
                    {item.status === 'pending' && "⏳ Sent to Dean/Admin for Approval"}
                    {item.status === 'approved' && "✅ Approved! Dispatched to Tech Staff"}
                    {item.status === 'in-progress' && "⚡ Tech Staff actively fixing issue"}
                    {item.status === 'resolved' && "🎉 Issue Resolved"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Info Sidebar */}
        <div>
          <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wifi size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Campus Wi-Fi & Services</span>
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Library Fiber Wi-Fi:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>Operational (99.8%)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Lab AC & Power:</span>
                <strong style={{ color: 'var(--accent-emerald)' }}>Operational</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Auditorium Projectors:</span>
                <strong style={{ color: 'var(--accent-amber)' }}>1 Maintenance Job</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
