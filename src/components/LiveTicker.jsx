import React from 'react';
import { Activity, CheckCircle2, Clock } from 'lucide-react';

const TICKER_ITEMS = [
  { id: 1, text: "Elevator B2 Maintenance Completed", location: "Engineering Block B", tag: "Resolved", time: "12m ago" },
  { id: 2, text: "Science Lab 3 Wi-Fi High-Speed Router Replaced", location: "Science Complex", tag: "Resolved", time: "28m ago" },
  { id: 3, text: "Central Library AC Temperature Calibrated", location: "Main Library", tag: "Resolved", time: "45m ago" },
  { id: 4, text: "Physics Lab Water Leak Fixed", location: "Science Complex", tag: "Resolved", time: "1h ago" },
  { id: 5, text: "Auditorium Projector Bulb Replaced", location: "Campus Center", tag: "Resolved", time: "2h ago" },
  { id: 6, text: "Cafeteria Water Cooler Sanitized", location: "Student Center", tag: "Resolved", time: "3h ago" }
];

export default function LiveTicker() {
  return (
    <div className="ticker-bar">
      <div className="ticker-label">
        <Activity size={14} />
        <span>Live Campus Status Feed</span>
      </div>
      <div className="ticker-content">
        {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="ticker-item">
            <CheckCircle2 size={13} style={{ color: 'var(--accent-emerald)' }} />
            <span><strong>{item.location}:</strong> {item.text}</span>
            <span className="tag">{item.tag}</span>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Clock size={11} /> {item.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
