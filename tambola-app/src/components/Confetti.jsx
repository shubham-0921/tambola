import { useEffect, useRef } from 'react';

const COLORS = ['#f5a623','#22c55e','#3b82f6','#ec4899','#a855f7','#ef4444','#fbbf24'];

export default function Confetti({ trigger }) {
  const canvasRef = useRef();
  const particlesRef = useRef([]);
  const frameRef = useRef(null);

  function spawn() {
    const cvs = canvasRef.current;
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    for (let i = 0; i < 140; i++) {
      particlesRef.current.push({
        x: Math.random() * cvs.width,
        y: -10,
        r: Math.random() * 5 + 3,
        vy: Math.random() * 3 + 2,
        vx: (Math.random() - 0.5) * 2,
        tiltA: 0,
        tiltV: Math.random() * .08 + .04,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    }
    if (!frameRef.current) animate();
  }

  function animate() {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    particlesRef.current.forEach(p => {
      p.y += p.vy; p.x += p.vx; p.tiltA += p.tiltV;
      const tilt = Math.sin(p.tiltA) * 12;
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + tilt, p.y);
      ctx.lineTo(p.x + tilt + p.r, p.y + p.r * 2);
      ctx.stroke();
    });
    particlesRef.current = particlesRef.current.filter(p => p.y < cvs.height + 20);
    if (particlesRef.current.length > 0) {
      frameRef.current = requestAnimationFrame(animate);
    } else {
      frameRef.current = null;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
    }
  }

  useEffect(() => {
    if (trigger > 0) spawn();
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 999 }}
    />
  );
}
