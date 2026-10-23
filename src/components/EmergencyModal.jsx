import React from 'react';
import { AlertTriangle, Phone, ShieldAlert, Zap, Flame, HeartPulse } from 'lucide-react';

export default function EmergencyModal({ onClose, showToast }) {
  const contacts = [
    { title: 'Campus Security Main Gate', phone: '+1 (555) 911-0001', icon: ShieldAlert, color: 'var(--accent-rose)' },
    { title: 'Electrical & Fire Hazard Desk', phone: '+1 (555) 911-0002', icon: Flame, color: 'var(--accent-amber)' },
    { title: 'Campus Medical & First Aid', phone: '+1 (555) 911-0003', icon: HeartPulse, color: 'var(--accent-cyan)' },
    { title: 'Campus Duty Director SOS', phone: '+1 (555) 911-0004', icon: Zap, color: 'var(--accent-purple)' }
  ];

  const handleCall = (title, phone) => {
    showToast(`Dispatching emergency alert to ${title} (${phone})...`, 'error');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ color: 'var(--accent-rose)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={22} />
            <span>Campus Emergency SOS Hotline</span>
          </h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          For critical hazards requiring immediate emergency response (fire, medical, electrical hazard, security threats):
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {contacts.map((c, i) => {
            const Icon = c.icon;
            return (
              <div 
                key={i} 
                className="glass-panel" 
                style={{ padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${c.color}` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={20} style={{ color: c.color }} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{c.phone}</div>
                  </div>
                </div>

                <button 
                  className="btn-sos"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
                  onClick={() => handleCall(c.title, c.phone)}
                >
                  <Phone size={14} />
                  <span>Call Desk</span>
                </button>
              </div>
            );
          })}
        </div>

        <button className="btn-primary" onClick={onClose} style={{ background: 'var(--bg-card-hover)', color: 'var(--text-primary)', border: '1px solid var(--bg-glass-border)' }}>
          Close Emergency Panel
        </button>
      </div>
    </div>
  );
}
