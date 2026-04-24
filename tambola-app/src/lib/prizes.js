export const PRIZE_META = [
  { id: 'temp',    name: 'Temperature',    emoji: '🌡️', amount: 200, color: 'var(--c-temp)',    rgb: 'var(--rgb-temp)'    },
  { id: 'corners', name: 'Four Corners',   emoji: '🎯', amount: 200, color: 'var(--c-corners)', rgb: 'var(--rgb-corners)' },
  { id: 'bfast',   name: 'Breakfast',      emoji: '☀️', amount: 200, color: 'var(--c-bfast)',   rgb: 'var(--rgb-bfast)'   },
  { id: 'lunch',   name: 'Lunch',          emoji: '🌤️', amount: 200, color: 'var(--c-lunch)',   rgb: 'var(--rgb-lunch)'   },
  { id: 'dinner',  name: 'Dinner',         emoji: '🌙', amount: 200, color: 'var(--c-dinner)',  rgb: 'var(--rgb-dinner)'  },
  { id: 'ily',     name: 'I Love You 143', emoji: '💌', amount: 200, color: 'var(--c-ily)',     rgb: 'var(--rgb-ily)'     },
  { id: 'h1',      name: 'Grand Winner',   emoji: '🏆', amount: 450, color: 'var(--c-h1)',      rgb: 'var(--rgb-h1)',     rank: '1st Housie' },
  { id: 'h2',      name: 'Runner Up',      emoji: '🥈', amount: 350, color: 'var(--c-h2)',      rgb: 'var(--rgb-h2)',     rank: '2nd Housie' },
  { id: 'h3',      name: 'Third Place',    emoji: '🥉', amount: 250, color: 'var(--c-h3)',      rgb: 'var(--rgb-h3)',     rank: '3rd Housie' },
  { id: 'h4',      name: 'Fourth Place',   emoji: '🎖️', amount: 250, color: 'var(--c-h4)',      rgb: 'var(--rgb-h4)',     rank: '4th Housie' },
];

export function buildPrizes(ticket) {
  const all = [];
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 9; c++)
      if (ticket[r][c] !== null) all.push({ r, c, n: ticket[r][c] });

  function colRange(cs, ce) {
    const out = [];
    for (let r = 0; r < 3; r++)
      for (let c = cs; c <= ce; c++)
        if (ticket[r][c] !== null) out.push({ r, c, n: ticket[r][c] });
    return out;
  }

  function firstN(row, n) {
    const out = [];
    for (let c = 0; c < 9 && out.length < n; c++)
      if (ticket[row][c] !== null) out.push({ r: row, c, n: ticket[row][c] });
    return out;
  }

  const nums = all.map(x => x.n);
  const mn = Math.min(...nums), mx = Math.max(...nums);

  const cornerPos = [{ r: 0, c: 0 }, { r: 0, c: 8 }, { r: 2, c: 0 }, { r: 2, c: 8 }];
  const cornerCells = cornerPos
    .filter(p => ticket[p.r][p.c] !== null)
    .map(p => ({ ...p, n: ticket[p.r][p.c] }));

  return [
    { ...PRIZE_META[0], cells: all.filter(x => x.n === mn || x.n === mx) },
    { ...PRIZE_META[1], cells: cornerCells },
    { ...PRIZE_META[2], cells: colRange(0, 2) },
    { ...PRIZE_META[3], cells: colRange(3, 5) },
    { ...PRIZE_META[4], cells: colRange(6, 8) },
    { ...PRIZE_META[5], cells: [...firstN(0, 1), ...firstN(1, 4), ...firstN(2, 3)] },
    { ...PRIZE_META[6], cells: [...all] },
    { ...PRIZE_META[7], cells: [...all] },
    { ...PRIZE_META[8], cells: [...all] },
    { ...PRIZE_META[9], cells: [...all] },
  ];
}

export function prizeStatus(prize, marked) {
  if (!prize.cells.length) return { hit: 0, total: 0, done: false, rem: [] };
  const hit = prize.cells.filter(c => marked.has(`${c.r},${c.c}`));
  const rem = prize.cells.filter(c => !marked.has(`${c.r},${c.c}`));
  return { hit: hit.length, total: prize.cells.length, done: hit.length === prize.cells.length, rem };
}

export function validateTicket(ticket) {
  const errs = [];
  for (let r = 0; r < 3; r++) {
    const nums = ticket[r].filter(n => n !== null);
    if (nums.length !== 5) errs.push(`Row ${r + 1} has ${nums.length} numbers (needs exactly 5)`);
    nums.forEach(n => {
      if (!Number.isInteger(n) || n < 1 || n > 90)
        errs.push(`Row ${r + 1}: invalid number ${n}`);
    });
  }
  const all = ticket.flat().filter(n => n !== null);
  if (new Set(all).size !== all.length) errs.push('Duplicate numbers found — check your ticket');
  return errs;
}

export function emptyTicket() {
  return Array(3).fill(null).map(() => Array(9).fill(null));
}
