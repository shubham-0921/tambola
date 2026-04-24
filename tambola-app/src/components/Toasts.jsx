import { useEffect, useState } from 'react';
import styles from './Toasts.module.css';

export default function Toasts({ toasts, onDismiss }) {
  // Only show the latest toast (matches reference single-toast behaviour)
  const latest = toasts[toasts.length - 1];
  return (
    <div className={styles.container}>
      {latest && <Toast key={latest.id} toast={latest} onDismiss={() => onDismiss(latest.id)} />}
    </div>
  );
}

function Toast({ toast, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    if (toast.duration > 0) {
      const id = setTimeout(() => { setVisible(false); setTimeout(onDismiss, 400); }, toast.duration);
      return () => clearTimeout(id);
    }
  }, []);

  function dismiss() {
    setVisible(false);
    setTimeout(onDismiss, 400);
  }

  return (
    <div
      className={`${styles.toast} ${visible ? styles.show : ''}`}
      style={{ border: `1.5px solid ${toast.borderColor || 'rgba(245,166,35,0.6)'}` }}
    >
      <div className={styles.icon}>{toast.icon}</div>
      <div className={styles.body}>
        <div className={styles.title}>{toast.title}</div>
        <div className={styles.msg}>{toast.msg}</div>
      </div>
      <button className={styles.closeBtn} onClick={dismiss}>✕</button>
    </div>
  );
}
