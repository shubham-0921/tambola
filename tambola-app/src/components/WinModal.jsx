import { useEffect, useState } from 'react';
import styles from './WinModal.module.css';

export default function WinModal({ prize, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!prize) return;
    setVisible(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
  }, [prize?.id]);

  if (!prize) return null;

  function dismiss() {
    setVisible(false);
    setTimeout(onDismiss, 320);
  }

  return (
    <div className={`${styles.backdrop} ${visible ? styles.show : ''}`} onClick={dismiss}>
      <div
        className={`${styles.modal} ${visible ? styles.modalShow : ''}`}
        style={{ '--pz-color': prize.color, '--pz-rgb': prize.rgb }}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.glow} />
        <span className={styles.emojiWrap}>{prize.emoji}</span>
        <div className={styles.tag}>Prize Won!</div>
        <h2 className={styles.prizeName}>{prize.name}</h2>
        <div className={styles.amountRow}>
          <span className={styles.rupee}>₹</span>
          <span className={styles.amount}>{prize.amount}</span>
        </div>
        <p className={styles.instruction}>
          Shout <strong>"{prize.name.toUpperCase()}"</strong> right now!
        </p>
        <button className={styles.claimBtn} onClick={dismiss}>🎉 Claim ₹{prize.amount}</button>
        <button className={styles.dismissBtn} onClick={dismiss}>Dismiss</button>
      </div>
    </div>
  );
}
