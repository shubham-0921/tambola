import { useRef, useState } from 'react';
import styles from './SetupScreen.module.css';

export default function SetupScreen({ onScan, onManual, scanning }) {
  const [imgData, setImgData] = useState(null);
  const [error, setError] = useState('');
  const [drag, setDrag] = useState(false);
  const fileRef = useRef();

  function loadFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    setError('');
    const reader = new FileReader();
    reader.onload = e => setImgData({ dataUrl: e.target.result, type: file.type || 'image/jpeg' });
    reader.readAsDataURL(file);
  }

  function handleScan() {
    if (!imgData) { setError('Please select a ticket photo first.'); return; }
    onScan(imgData).catch(err => {
      let msg = err.message;
      if (msg.includes('Failed to fetch')) msg = 'Network error — check your connection.';
      setError(`Scan failed: ${msg}`);
    });
  }

  return (
    <div className="screen" style={{ maxWidth: 480, textAlign: 'center' }}>
      <header className={styles.header}>
        <div className="badge">🎲 Tambola Tracker</div>
        <h1 className={`serif ${styles.h1}`}>Tambola</h1>
        <p className={styles.sub}>Upload your ticket · AI reads every number</p>
      </header>

      <div className={`card ${styles.uploadCard}`}>
        <p className={styles.cardTitle}>📷 Scan Ticket Photo</p>
        <div
          className={`${styles.uploadArea} ${drag ? styles.drag : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); loadFile(e.dataTransfer.files[0]); }}
          onClick={() => fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={e => loadFile(e.target.files[0])}
          />
          <div className={styles.uploadIcon}>📸</div>
          <p>Tap to take a photo or <strong>choose from gallery</strong></p>
        </div>
        {imgData && <img className={styles.thumb} src={imgData.dataUrl} alt="Ticket preview" />}
        {error && <p className="error-text">{error}</p>}
        <button
          className="btn btn-primary"
          style={{ marginTop: 14 }}
          disabled={!imgData || scanning}
          onClick={handleScan}
        >
          {scanning ? '⏳ Scanning…' : '✨ Scan with AI →'}
        </button>
      </div>

      <div className="divider">— or —</div>
      <button className="btn btn-secondary" onClick={onManual}>Enter numbers manually</button>
    </div>
  );
}
