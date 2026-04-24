import { prizeStatus } from '../lib/prizes';
import styles from './HousieCard.module.css';

export default function HousieCard({ prize, marked, claimed, onToggleClaimed }) {
  const s = prizeStatus(prize, marked);
  const isClaimed = claimed.has(prize.id);

  return (
    <div
      className={`${styles.card} ${isClaimed ? styles.claimed : ''} ${s.done && !isClaimed ? styles.won : ''}`}
      style={{ '--pz-color': prize.color }}
    >
      <div className={styles.rank}>{prize.rank} · ₹{prize.amount}</div>
      <div className={styles.label}>{prize.emoji} {prize.name}</div>
      <div className={styles.progress}>{s.hit}</div>
      <div className={styles.total}>/ 15 numbers</div>
      <button
        className={`${styles.claimBtn} ${isClaimed ? styles.claimBtnActive : ''}`}
        onClick={onToggleClaimed}
      >
        {isClaimed ? '↩' : '✗'}
      </button>
    </div>
  );
}
