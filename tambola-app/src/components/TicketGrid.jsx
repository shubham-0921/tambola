import styles from './TicketGrid.module.css';

const COL_LABELS = ['C1','C2','C3','C4','C5','C6','C7','C8','C9'];

export default function TicketGrid({ ticket, marked, onToggle, editable, onEdit }) {
  return (
    <div>
      <div className={styles.colHeaders}>
        {COL_LABELS.map(l => <span key={l} className={styles.colHeader}>{l}</span>)}
      </div>
      <div className={styles.grid}>
        {ticket.map((row, r) =>
          row.map((val, c) => {
            const key = `${r},${c}`;
            const isMarked = marked?.has(key);
            const isEmpty = val === null;

            if (editable) {
              return (
                <div key={key} className={`${styles.cell} ${isEmpty ? styles.emptyEdit : styles.numEdit}`}>
                  {/* Controlled input — value always mirrors ticket state so positions stay correct */}
                  <input
                    type="number"
                    min={1}
                    max={90}
                    value={val ?? ''}
                    placeholder=""
                    onChange={e => {
                      const v = parseInt(e.target.value);
                      onEdit(r, c, isNaN(v) || v < 1 || v > 90 ? null : v);
                    }}
                  />
                </div>
              );
            }

            return (
              <div
                key={key}
                className={`${styles.cell} ${isEmpty ? styles.empty : isMarked ? styles.marked : styles.num}`}
                onClick={() => !isEmpty && onToggle?.(r, c)}
              >
                {!isEmpty && <span className={styles.cellNum}>{val}</span>}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
