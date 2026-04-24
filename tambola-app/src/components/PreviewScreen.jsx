import { useState } from 'react';
import TicketGrid from './TicketGrid';
import { validateTicket } from '../lib/prizes';
import styles from './PreviewScreen.module.css';

export default function PreviewScreen({ ticket, imgSrc, onConfirm, onBack }) {
  const [localTicket, setLocalTicket] = useState(ticket.map(r => [...r]));
  const [error, setError] = useState('');

  function handleEdit(r, c, val) {
    setLocalTicket(prev => { const n = prev.map(row => [...row]); n[r][c] = val; return n; });
  }

  function handleConfirm() {
    const errs = validateTicket(localTicket);
    if (errs.length) { setError(errs[0]); return; }
    onConfirm(localTicket);
  }

  return (
    <div className="screen" style={{ maxWidth: 480 }}>
      <header style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div className="badge">✅ Review Ticket</div>
        <h1 className={`serif ${styles.h1}`}>Parsed Ticket</h1>
        <p style={{ fontSize: '.88rem', color: 'rgba(240,232,216,0.45)' }}>Tap any cell to correct it</p>
      </header>

      {imgSrc && <img className={styles.previewImg} src={imgSrc} alt="Ticket" />}

      <div className="card" style={{ marginBottom: 14 }}>
        <TicketGrid ticket={localTicket} editable onEdit={handleEdit} />
        {error && <p className="error-text">{error}</p>}
      </div>

      <button className="btn btn-primary" onClick={handleConfirm}>Confirm & Start Tracking →</button>
      <button className="btn btn-secondary" style={{ marginTop: 8 }} onClick={onBack}>← Rescan / Change photo</button>
    </div>
  );
}
