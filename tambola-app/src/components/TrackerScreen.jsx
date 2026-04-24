import TicketGrid from './TicketGrid';
import PrizeCard from './PrizeCard';
import HousieCard from './HousieCard';
import styles from './TrackerScreen.module.css';

export default function TrackerScreen({ ticket, marked, prizes, claimed, onToggle, onToggleClaimed, onReset }) {
  const markedCount = [...marked].filter(k => {
    const [r, c] = k.split(',').map(Number);
    return ticket[r]?.[c] != null;
  }).length;

  const specials = prizes.slice(0, 6);
  const housies  = prizes.slice(6);
  const pct = (markedCount / 15) * 100;

  return (
    <div className="screen">

      {/* Header */}
      <header className={styles.header}>
        <div className="badge">🎲 Live Tracker</div>
        <h1 className={`serif ${styles.h1}`}>Tambola</h1>
        <p className={styles.sub}>Tap numbers as they're called</p>
      </header>

      {/* Progress */}
      <div className={`card ${styles.progressCard}`}>
        <span className={styles.progressLabel}>Numbers marked</span>
        <div className={styles.progressBarWrap}>
          <div className={styles.progressBarFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressCount}>
          <span className={styles.progressNum}>{markedCount}</span> / 15
        </span>
      </div>

      {/* Ticket */}
      <div className={`card ${styles.ticketCard}`}>
        <TicketGrid ticket={ticket} marked={marked} onToggle={onToggle} />
        <p className={styles.ticketHint}>TAP A NUMBER TO MARK IT · TAP AGAIN TO UNMARK</p>
      </div>

      {/* Special Prizes */}
      <div className="sec-title">Special Prizes</div>
      <div className={styles.prizeGrid}>
        {specials.map(p => (
          <PrizeCard
            key={p.id}
            prize={p}
            marked={marked}
            claimed={claimed}
            onToggleClaimed={() => onToggleClaimed(p.id)}
          />
        ))}
      </div>

      {/* Full Housie */}
      <div className="sec-title" style={{ marginTop: '1.5rem' }}>Full Housie</div>
      <div className={styles.housieGrid}>
        {housies.map(p => (
          <HousieCard
            key={p.id}
            prize={p}
            marked={marked}
            claimed={claimed}
            onToggleClaimed={() => onToggleClaimed(p.id)}
          />
        ))}
      </div>

      <button className={styles.resetBtn} onClick={onReset}>↺ Reset ticket</button>
    </div>
  );
}
