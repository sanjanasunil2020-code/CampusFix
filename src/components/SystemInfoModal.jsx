import React from 'react';
import { Info, ShieldCheck, Cpu, Clock, Server, Check } from 'lucide-react';

export default function SystemInfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Info size={20} style={{ color: 'var(--accent-cyan)' }} />
            <span>CampusFix System Architecture</span>
          </h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '0.4rem' }}>
              <ShieldCheck size={16} />
              <span>Multi-Role Access Control (RBAC)</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Supports Students, Faculty, Maintenance Technicians, and Department Heads with strict institutional SSO encryption.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--accent-indigo)', marginBottom: '0.4rem' }}>
              <Cpu size={16} />
              <span>AI Automated Dispatch Engine</span>
            </div>
            <p style={{ color: 'var(--text-secondary)' }}>
              Uses natural language classification to route complaints to appropriate departmental queues with live SLA timers.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--accent-emerald)', marginBottom: '0.4rem' }}>
              <Server size={16} />
              <span>System Operational Health</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>• Uptime: 99.98%</span>
              <span>• Latency: 14ms</span>
              <span>• Active Nodes: 8</span>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={onClose} style={{ marginTop: '1.5rem' }}>
          Got It
        </button>
      </div>
    </div>
  );
}
