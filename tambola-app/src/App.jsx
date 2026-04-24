import { useState, useRef } from 'react';
import SetupScreen from './components/SetupScreen';
import PreviewScreen from './components/PreviewScreen';
import ManualScreen from './components/ManualScreen';
import TrackerScreen from './components/TrackerScreen';
import Toasts from './components/Toasts';
import WinModal from './components/WinModal';
import Confetti from './components/Confetti';
import { parseTicketImage } from './lib/api';
import { buildPrizes, prizeStatus } from './lib/prizes';

export default function App() {
  const [screen, setScreen] = useState('setup');
  const [ticket, setTicket] = useState(null);
  const [pendingImg, setPendingImg] = useState(null);
  const [scanning, setScanning] = useState(false);

  const [marked, setMarked] = useState(new Set());
  const [prizes, setPrizes] = useState([]);
  const [claimed, setClaimed] = useState(new Set());
  const [wonFired, setWonFired] = useState(new Set());
  const [nearFired, setNearFired] = useState(new Set());

  // Near-miss toasts (bottom slide-up)
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  // Win modal queue
  const [winQueue, setWinQueue] = useState([]);    // array of prize objects
  const currentWin = winQueue[0] ?? null;

  const [confettiTick, setConfettiTick] = useState(0);

  // ── helpers ──────────────────────────────────
  function addToast({ icon, title, msg, borderColor, duration }) {
    const id = ++toastIdRef.current;
    setToasts(prev => [...prev, { id, icon, title, msg, borderColor, duration }]);
  }

  function dismissToast(id) {
    setToasts(prev => prev.filter(t => t.id !== id));
  }

  function dismissWin() {
    setWinQueue(prev => prev.slice(1));
  }

  function startTracker(t) {
    setTicket(t);
    setMarked(new Set());
    setWonFired(new Set());
    setNearFired(new Set());
    setClaimed(new Set());
    setWinQueue([]);
    setPrizes(buildPrizes(t));
    setScreen('tracker');
  }

  // ── scan ──────────────────────────────────────
  async function handleScan(imgData) {
    setPendingImg(imgData);
    setScanning(true);
    try {
      const rows = await parseTicketImage(imgData.dataUrl, imgData.type);
      setTicket(rows);
      setScanning(false);
      setScreen('preview');
    } catch (err) {
      setScanning(false);
      throw err;
    }
  }

  // ── toggle mark ───────────────────────────────
  function handleToggle(r, c) {
    const key = `${r},${c}`;
    setMarked(prev => {
      const next = new Set(prev);
      let newWon = wonFired;
      let newNear = nearFired;

      if (next.has(key)) {
        // unmarking — allow alerts to re-fire for affected prizes
        next.delete(key);
        newWon = new Set(wonFired);
        newNear = new Set(nearFired);
        prizes.forEach(p => {
          if (p.cells.some(x => x.r === r && x.c === c)) {
            newWon.delete(p.id);
            newNear.delete(p.id);
          }
        });
        setWonFired(newWon);
        setNearFired(newNear);
      } else {
        next.add(key);

        // check alerts with new set
        const wf = new Set(wonFired);
        const nf = new Set(nearFired);
        const newWins = [];

        prizes.forEach(p => {
          if (claimed.has(p.id)) return;
          const s = prizeStatus(p, next);

          if (s.done && !wf.has(p.id)) {
            wf.add(p.id);
            newWins.push(p);
          } else if (!s.done && s.total > 0 && s.rem.length === 1 && !nf.has(p.id)) {
            nf.add(p.id);
            setTimeout(() => addToast({ icon: '🔥', title: `Almost there — ${p.name}!`, msg: `Just need ${s.rem[0].n} to win ₹${p.amount}. Stay sharp!`, borderColor: '#f5a623', duration: 6000 }), 0);
          }
        });

        if (newWins.length > 0) {
          setWonFired(wf);
          setTimeout(() => {
            setWinQueue(prev => [...prev, ...newWins]);
            setConfettiTick(t => t + 1);
          }, 0);
        }
        setNearFired(nf);
      }

      return next;
    });

    if (navigator.vibrate) navigator.vibrate(25);
  }

  // ── claimed ───────────────────────────────────
  function handleToggleClaimed(prizeId) {
    setClaimed(prev => {
      const next = new Set(prev);
      if (next.has(prizeId)) {
        next.delete(prizeId);
        setWonFired(wf => { const n = new Set(wf); n.delete(prizeId); return n; });
        setNearFired(nf => { const n = new Set(nf); n.delete(prizeId); return n; });
      } else {
        next.add(prizeId);
        setWonFired(wf => new Set([...wf, prizeId]));
        setNearFired(nf => new Set([...nf, prizeId]));
      }
      return next;
    });
  }

  // ── reset ─────────────────────────────────────
  function handleReset() {
    if (!confirm('Reset all marks? Claimed prizes stay.')) return;
    setMarked(new Set());
    setWonFired(new Set([...claimed]));
    setNearFired(new Set([...claimed]));
    setWinQueue([]);
  }

  return (
    <>
      <Toasts toasts={toasts} onDismiss={dismissToast} />
      <WinModal prize={currentWin} onDismiss={dismissWin} />
      <Confetti trigger={confettiTick} />

      {screen === 'setup' && (
        <SetupScreen onScan={handleScan} onManual={() => setScreen('manual')} scanning={scanning} />
      )}
      {screen === 'preview' && (
        <PreviewScreen
          ticket={ticket}
          imgSrc={pendingImg?.dataUrl}
          onConfirm={startTracker}
          onBack={() => setScreen('setup')}
        />
      )}
      {screen === 'manual' && (
        <ManualScreen onConfirm={startTracker} onBack={() => setScreen('setup')} />
      )}
      {screen === 'tracker' && ticket && (
        <TrackerScreen
          ticket={ticket}
          marked={marked}
          prizes={prizes}
          claimed={claimed}
          onToggle={handleToggle}
          onToggleClaimed={handleToggleClaimed}
          onReset={handleReset}
        />
      )}
    </>
  );
}
