import { prizeStatus } from '../lib/prizes';
import styles from './PrizeCard.module.css';

export default function PrizeCard({ prize, marked, claimed, onToggleClaimed }) {
  const s = prizeStatus(prize, marked);
  const isClaimed = claimed.has(prize.id);
  const pct = s.total ? (s.hit / s.total) * 100 : 0;
  const isNear = !isClaimed && !s.done && s.total > 0 && s.rem.length === 1;

  let cardClass = styles.card;
  if (isClaimed) cardClass += ` ${styles.claimed}`;
  else if (s.done) cardClass += ` ${styles.won}`;

  return (
    <div
      className={cardClass}
      style={{ '--pz-color': prize.color, '--pz-rgb': prize.rgb }}
    >
      <div className={styles.wonBadge}>✓ Claim!</div>

      <div className={styles.header}>
        <span className={styles.icon}>{prize.emoji}</span>
        <span className={styles.name}>{prize.name}</span>
        <span className={styles.amount}>₹{prize.amount}</span>
      </div>

      <div className={styles.pills}>
        {[...prize.cells].sort((a, b) => a.n - b.n).map(cell => {
          const hit = marked.has(`${cell.r},${cell.c}`);
          let cls = styles.pill;
          if (isClaimed) cls += ` ${styles.pillClaimed}`;
          else if (hit) cls += ` ${styles.pillHit}`;
          return <span key={`${cell.r},${cell.c}`} className={cls}>{cell.n}</span>;
        })}
      </div>

      <div className={styles.bar}>
        <div className={styles.barFill} style={{ width: `${pct}%` }} />
      </div>

      <div className={styles.claimRow}>
        {isNear
          ? <span className={styles.nearLabel}>⚡ Need {s.rem[0].n} to win!</span>
          : <span />
        }
        <button
          className={`${styles.claimBtn} ${isClaimed ? styles.claimBtnActive : ''}`}
          onClick={onToggleClaimed}
        >
          {isClaimed ? '↩ Restore' : '✗ Claimed'}
        </button>
      </div>
    </div>
  );
}
