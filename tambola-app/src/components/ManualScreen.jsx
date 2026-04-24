import { useState } from 'react';
import TicketGrid from './TicketGrid';
import { validateTicket, emptyTicket } from '../lib/prizes';

export default function ManualScreen({ onConfirm, onBack }) {
  const [ticket, setTicket] = useState(emptyTicket);
  const [error, setError] = useState('');

  function handleEdit(r, c, val) {
    setTicket(prev => { const n = prev.map(row => [...row]); n[r][c] = val; return n; });
  }

  function handleConfirm() {
    const errs = validateTicket(ticket);
    if (errs.length) { setError(errs[0]); return; }
    onConfirm(ticket);
  }

  return (
    <div className="screen" style={{ maxWidth: 480 }}>
      <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="badge">📝 Manual Entry</div>
        <h1 className="serif" style={{
          fontSize: 'clamp(1.8rem,6vw,2.8rem)', fontWeight: 900,
          background: 'linear-gradient(135deg,#f5a623,#f7d94c,#f09020)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', lineHeight: 1, margin: '0.5rem 0 0.3rem'
        }}>Your Ticket</h1>
        <p style={{ fontSize: '.88rem', color: 'rgba(240,232,216,0.45)' }}>
          Fill in numbers 1–90 · 5 per row · leave blanks empty
        </p>
      </header>

      <div className="card" style={{ marginBottom: 14 }}>
        <TicketGrid ticket={ticket} editable onEdit={handleEdit} />
        {error && <p className="error-text">{error}</p>}
      </div>

      <button className="btn btn-primary" onClick={handleConfirm}>Start Tracking →</button>
      <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={onBack}>← Back</button>
    </div>
  );
}
