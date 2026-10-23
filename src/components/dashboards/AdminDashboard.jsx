import React, { useState } from 'react';
import { 
  ShieldCheck, AlertCircle, Wrench, CheckCircle2, Clock, MapPin, 
  Sparkles, Filter, Search, ShieldAlert, Users, Radio, ArrowUpRight,
  GraduationCap, Briefcase, UserCheck, UserX, Send, Bell, Check, X, BookOpen
} from 'lucide-react';

export default function AdminDashboard({ 
  user, 
  complaints, 
  onAdminApprove, 
  onMarkResolved,
  pendingRegistrations,
  onApproveRegistration,
  onRejectRegistration,
  sentBroadcasts,
  onSendNotification,
  searchQuery, 
  setSearchQuery, 
  statusFilter, 
  setStatusFilter,
  showToast 
}) {
  const [adminTab, setAdminTab] = useState('ticket-approvals'); // 'ticket-approvals', 'student-history', 'staff-history', 'registrations', 'broadcasts', 'master-feed'
  
  // Broadcast Form State
  const [broadcastTarget, setBroadcastTarget] = useState('student'); // 'student', 'faculty', 'maintenance', 'all'
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastPriority, setBroadcastPriority] = useState('Important');

  // Filter complaints
  const pendingTicketApprovals = complaints.filter(c => c.status === 'pending');
  const studentComplaints = complaints.filter(c => c.category || c.title);
  
  // Mock Staff Work History
  const staffWorkHistory = [
    {
      id: "WRK-1092",
      staffName: "David Miller",
      staffRole: "HVAC & Network Lead",
      staffId: "TECH-8821",
      ticketId: "CMP-9042",
      issueTitle: "High-Speed Wi-Fi Disconnection in Library 3rd Floor",
      location: "Main Library - Quiet Reading Hall B",
      assignedTime: "Sep 2, 2026 - 10:20 AM",
      completedTime: "Sep 2, 2026 - 11:05 AM",
      slaDuration: "45 mins",
      status: "in-progress"
    },
    {
      id: "WRK-1088",
      staffName: "Robert Hayes",
      staffRole: "Plumbing Department",
      staffId: "TECH-4091",
      ticketId: "CMP-7412",
      issueTitle: "Water Tap Leakage in Chemistry Lab 2 Washroom",
      location: "Science Building - Chemistry Lab 2",
      assignedTime: "Sep 1, 2026 - 02:10 PM",
      completedTime: "Sep 1, 2026 - 04:00 PM",
      slaDuration: "1 hr 50 mins",
      status: "resolved"
    },
    {
      id: "WRK-1081",
      staffName: "Electrical Team",
      staffRole: "Campus Electrical Dept",
      staffId: "TECH-9012",
      ticketId: "CMP-8105",
      issueTitle: "Projector Bulb Flickering in Physics Auditorium Lab",
      location: "Science Complex - Hall A",
      assignedTime: "Sep 2, 2026 - 11:10 AM",
      completedTime: "In Progress",
      slaDuration: "Target 30 mins",
      status: "approved"
    }
  ];

  const handleSendBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) {
      showToast('Please enter broadcast title and notification message', 'warning');
      return;
    }

    onSendNotification({
      id: `BC-${Date.now()}`,
      target: broadcastTarget,
      title: broadcastTitle,
      message: broadcastMessage,
      priority: broadcastPriority,
      timestamp: 'Just now',
      sender: user.name || 'Dean Office Admin'
    });

    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Central Admin Confidential Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', background: 'linear-gradient(135deg, rgba(139,92,246,0.18) 0%, rgba(99,102,241,0.18) 100%)', border: '1px solid rgba(139,92,246,0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="user-avatar" style={{ width: '56px', height: '56px', fontSize: '1.4rem', background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Central Admin Master Command Dashboard</h2>
              <span className="brand-badge" style={{ background: 'rgba(139,92,246,0.3)', color: '#fff', borderColor: 'rgba(139,92,246,0.5)' }}>Confidential Access</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Administrator: <strong style={{ color: 'var(--text-primary)' }}>{user.name}</strong> • Key: {user.campusId || 'ADM-001'} • Email: {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Stat Overview */}
      <div className="stats-grid">
        <div className="stat-item glass-panel" style={{ borderLeft: '4px solid var(--accent-rose)' }}>
          <div className="stat-value" style={{ color: 'var(--accent-rose)' }}>{pendingTicketApprovals.length}</div>
          <div className="stat-label">Pending Ticket Approvals</div>
        </div>
        <div className="stat-item glass-panel" style={{ borderLeft: '4px solid var(--accent-purple)' }}>
          <div className="stat-value" style={{ color: 'var(--accent-purple)' }}>{pendingRegistrations.length}</div>
          <div className="stat-label">Pending Account Registrations</div>
        </div>
        <div className="stat-item glass-panel" style={{ borderLeft: '4px solid var(--accent-cyan)' }}>
          <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{complaints.length}</div>
          <div className="stat-label">Total Complaint History</div>
        </div>
      </div>

      {/* ADMIN MASTER NAVIGATION TABS */}
      <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button 
          className={`nav-page-link ${adminTab === 'ticket-approvals' ? 'active' : ''}`}
          onClick={() => setAdminTab('ticket-approvals')}
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.83rem' }}
        >
          <ShieldAlert size={15} />
          <span>Ticket Approvals ({pendingTicketApprovals.length})</span>
        </button>

        <button 
          className={`nav-page-link ${adminTab === 'student-history' ? 'active' : ''}`}
          onClick={() => setAdminTab('student-history')}
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.83rem' }}
        >
          <GraduationCap size={15} />
          <span>1. Student Complaint History</span>
        </button>

        <button 
          className={`nav-page-link ${adminTab === 'staff-history' ? 'active' : ''}`}
          onClick={() => setAdminTab('staff-history')}
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.83rem' }}
        >
          <Wrench size={15} />
          <span>2. Staff Work History</span>
        </button>

        <button 
          className={`nav-page-link ${adminTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setAdminTab('registrations')}
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.83rem' }}
        >
          <Users size={15} />
          <span>3. Registration Approvals ({pendingRegistrations.length})</span>
        </button>

        <button 
          className={`nav-page-link ${adminTab === 'broadcasts' ? 'active' : ''}`}
          onClick={() => setAdminTab('broadcasts')}
          style={{ padding: '0.5rem 0.9rem', fontSize: '0.83rem' }}
        >
          <Radio size={15} />
          <span>4. Separate Role Broadcasts</span>
        </button>
      </div>

      {/* TAB 1: PENDING TICKET APPROVALS */}
      {adminTab === 'ticket-approvals' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert size={20} style={{ color: 'var(--accent-rose)' }} />
            <span>Ticket Approval Queue ({pendingTicketApprovals.length})</span>
          </h3>

          {pendingTicketApprovals.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} style={{ margin: '0 auto 0.5rem', color: 'var(--accent-emerald)' }} />
              <p>No pending complaint tickets awaiting admin approval.</p>
            </div>
          ) : (
            pendingTicketApprovals.map(ticket => (
              <div key={ticket.id} className="glass-panel" style={{ padding: '1.25rem', border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.05)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <span className="ticket-id">{ticket.id}</span>
                    <span className="tag" style={{
                      background: ticket.category === 'Academics & Examinations' ? 'rgba(167,139,250,0.2)' : 'rgba(244,63,94,0.15)',
                      color: ticket.category === 'Academics & Examinations' ? '#a78bfa' : 'var(--accent-rose)',
                      padding: '0.1rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem'
                    }}>
                      {ticket.category === 'Academics & Examinations' && <BookOpen size={11} style={{ display: 'inline', marginRight: '3px' }} />}
                      {ticket.category}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.75rem', color: ticket.priority === 'Urgent' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                      Priority: {ticket.priority}
                    </span>
                    {ticket.isNew && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontSize: '0.68rem', fontWeight: 800, padding: '0.1rem 0.45rem', borderRadius: '4px', animation: 'pulse 2s infinite' }}>
                        🟢 NEW
                      </span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{ticket.title}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    📍 Location: <strong>{ticket.location}</strong> • Logged {ticket.date}
                  </div>
                  {ticket.submittedBy && (
                    <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(0,0,0,0.15)', borderRadius: '6px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                      <GraduationCap size={14} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
                      <span>Submitted by: <strong style={{ color: 'var(--text-primary)' }}>{ticket.submittedBy.name}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Roll: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'monospace' }}>{ticket.submittedBy.campusId}</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Email: <strong style={{ color: 'var(--text-primary)' }}>{ticket.submittedBy.email}</strong></span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0, flexWrap: 'wrap' }}>
                  <button 
                    className="btn-primary"
                    style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', background: 'linear-gradient(135deg, #10b981, #059669)', width: 'auto' }}
                    onClick={() => onAdminApprove(ticket.id)}
                  >
                    <ShieldCheck size={16} />
                    <span>Approve & Dispatch</span>
                  </button>
                  <button 
                    className="demo-chip-btn"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)', fontWeight: 700 }}
                    onClick={() => onMarkResolved && onMarkResolved(ticket.id, 'rejected')}
                  >
                    <X size={15} />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: FUNCTION 1 - STUDENT COMPLAINT HISTORY */}
      {adminTab === 'student-history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={20} style={{ color: 'var(--accent-cyan)' }} />
              <span>Student Complaint History Log ({complaints.length})</span>
            </h3>

            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem', width: '280px' }}
              placeholder="Search student history by ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }} className="glass-panel">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid var(--bg-glass-border)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Ticket ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Student / User</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Issue Title</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Campus Location</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Technician</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      {item.id}
                      {item.isNew && <span style={{ marginLeft: '6px', fontSize: '0.65rem', background: 'rgba(16,185,129,0.2)', color: '#10b981', padding: '1px 5px', borderRadius: '3px', fontFamily: 'sans-serif' }}>NEW</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                      {item.submittedBy ? item.submittedBy.name : 'Alex Morgan'} <br />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Roll: {item.submittedBy ? item.submittedBy.campusId : '2024CS108'}</span><br />
                      <span style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)' }}>{item.submittedBy ? item.submittedBy.email : ''}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>{item.title}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="tag" style={{
                        background: item.category === 'Academics & Examinations' ? 'rgba(167,139,250,0.2)' : 'rgba(6,182,212,0.15)',
                        color: item.category === 'Academics & Examinations' ? '#a78bfa' : 'var(--accent-cyan)',
                        padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem'
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{item.location}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`status-chip ${item.status}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem' }}>{item.technician}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FUNCTION 2 - STAFF MAINTENANCE HISTORY */}
      {adminTab === 'staff-history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wrench size={20} style={{ color: 'var(--accent-amber)' }} />
            <span>Maintenance Staff Work History & Performance</span>
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }} className="glass-panel">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.05)', textAlign: 'left', borderBottom: '1px solid var(--bg-glass-border)' }}>
                  <th style={{ padding: '0.85rem 1rem' }}>Staff Name & ID</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Role / Wing</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Assigned Ticket</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Location</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Assigned Time</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Completion SLA</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Job Status</th>
                </tr>
              </thead>
              <tbody>
                {staffWorkHistory.map(work => (
                  <tr key={work.id} style={{ borderBottom: '1px solid var(--bg-glass-border)' }}>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>
                      {work.staffName} <br />
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent-amber)', fontFamily: 'monospace' }}>ID: {work.staffId}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{work.staffRole}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: 'var(--accent-cyan)' }}>{work.ticketId}</strong>: {work.issueTitle}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{work.location}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>{work.assignedTime}</td>
                    <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>{work.slaDuration}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className={`status-chip ${work.status}`}>
                        {work.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FUNCTION 3 - APPROVAL AND REJECTION OF REGISTRATIONS */}
      {adminTab === 'registrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users size={20} style={{ color: 'var(--accent-purple)' }} />
            <span>Account Registration Approvals & Rejections ({pendingRegistrations.length})</span>
          </h3>

          {pendingRegistrations.length === 0 ? (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <UserCheck size={36} style={{ margin: '0 auto 0.5rem', color: 'var(--accent-emerald)' }} />
              <p>No pending account registrations requiring admin approval.</p>
            </div>
          ) : (
            pendingRegistrations.map(reg => (
              <div key={reg.id} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                    <span className="brand-badge" style={{ background: reg.roleId === 'student' ? 'rgba(6,182,212,0.2)' : reg.roleId === 'faculty' ? 'rgba(99,102,241,0.2)' : 'rgba(245,158,11,0.2)' }}>
                      {reg.role}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      ID: {reg.campusId}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)' }}>
                      Email: {reg.email}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{reg.name}</h4>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    Dept: {reg.department} • Requested {reg.date}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button 
                    className="btn-primary"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', background: 'linear-gradient(135deg, #10b981, #059669)', width: 'auto' }}
                    onClick={() => onApproveRegistration(reg.id)}
                  >
                    <Check size={16} />
                    <span>Approve Registration</span>
                  </button>

                  <button 
                    className="demo-chip-btn"
                    style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', borderColor: 'var(--accent-rose)', color: 'var(--accent-rose)', fontWeight: 700 }}
                    onClick={() => onRejectRegistration(reg.id)}
                  >
                    <X size={16} />
                    <span>Reject Account</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 5: FUNCTION 4 - SEND NOTIFICATIONS TO DASHBOARDS SEPARATELY */}
      {adminTab === 'broadcasts' && (
        <div className="dash-grid">
          {/* Left Form */}
          <div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Radio size={20} style={{ color: 'var(--accent-purple)' }} />
                <span>Dispatch Separate Role Notification</span>
              </h3>

              <form onSubmit={handleSendBroadcastSubmit}>
                <div className="form-group">
                  <label className="form-label">Target Dashboard Audience</label>
                  <select
                    className="form-select"
                    style={{ paddingLeft: '1rem' }}
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                  >
                    <option value="student">🎓 Students Dashboard Only (@student.com)</option>
                    <option value="faculty">💼 Faculty & Staff Dashboard Only (@staff.com)</option>
                    <option value="maintenance">🔧 Maintenance Staff Dashboard Only (@mstaff.com)</option>
                    <option value="all">📢 All Campus Dashboards (Global Broadcast)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Notification Title</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="e.g. Scheduled Library Network Maintenance"
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Announcement Message Content</label>
                  <textarea
                    className="form-input"
                    style={{ paddingLeft: '1rem', minHeight: '90px', resize: 'vertical' }}
                    placeholder="Type details of the announcement to display on the selected dashboard..."
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)' }}>
                  <Send size={16} />
                  <span>Send Notification to Selected Dashboard</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right Log of Sent Broadcasts */}
          <div>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} style={{ color: 'var(--accent-purple)' }} />
                <span>Recent Role Notifications Sent</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {sentBroadcasts.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No broadcasts sent yet.</p>
                ) : (
                  sentBroadcasts.map(bc => (
                    <div key={bc.id} style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--bg-glass-border)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                        <span className="tag" style={{ background: bc.target === 'student' ? 'rgba(6,182,212,0.2)' : bc.target === 'faculty' ? 'rgba(99,102,241,0.2)' : bc.target === 'maintenance' ? 'rgba(245,158,11,0.2)' : 'rgba(139,92,246,0.2)', color: '#fff', fontSize: '0.68rem', fontWeight: 700 }}>
                          Target: {bc.target.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{bc.timestamp}</span>
                      </div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700 }}>{bc.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{bc.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
