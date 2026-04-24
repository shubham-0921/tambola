const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || 'YOUR_GROQ_API_KEY_HERE';

const PROMPT = `This is a Tambola/Housie ticket. It has exactly 3 rows and 9 columns.
Each row has exactly 5 numbers and 4 blank cells. Numbers never move columns — a number printed in column 3 of the ticket MUST be at index 2 in its row array.

Column ranges (1-indexed): col1=1-9, col2=10-19, col3=20-29, col4=30-39, col5=40-49, col6=50-59, col7=60-69, col8=70-79, col9=80-90.
Use these ranges to verify each number is in the correct column position.

Return ONLY this JSON (no markdown, no explanation):
{"rows":[[r1c1,r1c2,r1c3,r1c4,r1c5,r1c6,r1c7,r1c8,r1c9],[r2c1,r2c2,r2c3,r2c4,r2c5,r2c6,r2c7,r2c8,r2c9],[r3c1,r3c2,r3c3,r3c4,r3c5,r3c6,r3c7,r3c8,r3c9]]}

Use null for every blank cell. Each number must be an integer 1–90. Double-check: each inner array must have exactly 9 elements.`;

export async function parseTicketImage(dataUrl, mediaType) {
  const base64 = dataUrl.split(',')[1];

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: `data:${mediaType};base64,${base64}` } },
          { type: 'text', text: PROMPT },
        ],
      }],
    }),
  });

  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try { const e = await res.json(); msg = e.error?.message || msg; } catch (_) {}
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.choices[0].message.content.trim();
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('No JSON found in response');

  const parsed = JSON.parse(m[0]);
  if (!parsed.rows || parsed.rows.length !== 3 || parsed.rows.some(r => r.length !== 9))
    throw new Error('Unexpected ticket format returned by AI');

  return fixColumns(parsed.rows);
}

// Tambola rule: a number's column is entirely determined by its value.
// 1-9 → col 0, 10-19 → col 1, …, 80-90 → col 8.
// The AI may misplace numbers horizontally, so we keep its row assignment
// but move every number to its correct column.
function fixColumns(rows) {
  const ticket = Array(3).fill(null).map(() => Array(9).fill(null));

  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 9; c++) {
      const n = rows[r][c];
      if (n !== null && Number.isInteger(n) && n >= 1 && n <= 90) {
        const correctCol = Math.min(Math.floor(n / 10), 8);
        // Skip duplicates (keeps first occurrence)
        if (ticket[r][correctCol] === null) {
          ticket[r][correctCol] = n;
        }
      }
    }
  }

  return ticket;
}
