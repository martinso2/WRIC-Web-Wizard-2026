/* ============================================================
   Wizard shell — TopBar, Stepper, Step header, FootNav.
   Plus reusable primitives: Field, Check, PickGrid, RankedGoalList, DesignNote.
   Step content lives in steps.jsx.
   ============================================================ */
/* global React */
const { useState, useEffect, useRef, useCallback } = React;

/* ---------- Tweak context (sender-configured settings) ---------- */
const TweakCtx = React.createContext({ ...TWEAK_DEFAULTS });
const useTweakValues = () => React.useContext(TweakCtx);

/* ---------- Persistence ---------- */
function useWorkbook() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });
  const firebaseSaveTimer = useRef(null);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}

    if (firebaseSaveTimer.current) {
      clearTimeout(firebaseSaveTimer.current);
    }

    if (window.WorkbookFirebase && Object.keys(data).length > 0) {
      firebaseSaveTimer.current = setTimeout(() => {
        window.WorkbookFirebase.save(data).catch((error) => {
          console.warn("Firebase workbook sync failed:", error);
        });
      }, 800);
    }

    return () => {
      if (firebaseSaveTimer.current) {
        clearTimeout(firebaseSaveTimer.current);
      }
    };
  }, [data]);

  const set = useCallback((key, val) => setData(d => ({ ...d, [key]: val })), []);
  const toggle = useCallback((key, val) => setData(d => {
    const s = new Set(d[key] || []);
    if (s.has(val)) s.delete(val); else s.add(val);
    return { ...d, [key]: [...s] };
  }), []);
  const reset = () => {
    if (window.WorkbookFirebase) {
      window.WorkbookFirebase.resetResponseId();
    }
    setData({});
  };
  return { data, set, toggle, reset };
}

/* ---------- TopBar ---------- */
function TopBar() {
  const t = useTweakValues();
  const isCustomName = t.orgName && t.orgName !== "Nonprofit Website Workbook";
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a href="#" className="brand" onClick={(e) => e.preventDefault()}>
          <span className="brand-mark">{(t.orgName || "W").charAt(0).toUpperCase()}</span>
          <span className="brand-name">
            <span className="title">{t.orgName || "Nonprofit Website Workbook"}</span>
            <span className="sub">
              {isCustomName ? "Website Workbook" : (t.mode === "solo" ? "For Individual Respondents" : "For Working Groups")}
            </span>
          </span>
        </a>
        <div className="topbar-actions">
          {t.deadline ? <span className="deadline-pill">Due {t.deadline}</span> : null}
          <span className="save-pill">Auto-saved</span>
        </div>
      </div>
    </header>
  );
}

/* ---------- Stepper ---------- */
function Stepper({ idx, onJump, steps = STEPS }) {
  const compact = steps.length > 12;
  return (
    <nav className={`stepper ${compact ? "compact" : ""}`} aria-label="Workbook progress">
      <div className="stepper-inner">
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <button
              type="button"
              className={`stepper-item ${i === idx ? "active" : ""} ${i < idx ? "done" : ""}`}
              onClick={() => onJump(i)}
              aria-current={i === idx ? "step" : undefined}
              title={step.label}
            >
              <span className="pill">{step.num || (i < idx ? "✓" : "·")}</span>
              <span className="lbl">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <span className={`stepper-divider ${i < idx ? "done" : ""}`} aria-hidden="true" />
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}

/* ---------- Step header ---------- */
function StepHeader({ num, label, title, lede }) {
  const t = useTweakValues();
  const totalSteps = t.stepHeaderTotal || STEPS.length;
  return (
    <header className="step-head">
      <div className="left">
        <div className="step-eyebrow">
          <span className="sep"></span>
          <span>{label}</span>
        </div>
        <h2 className="step-title">{title}</h2>
        {lede && <p className="step-lede">{lede}</p>}
      </div>
      <div className="step-meta right">
        <div className="num">{num}</div>
        <div className="of">of {String(totalSteps).padStart(2, "0")}</div>
      </div>
    </header>
  );
}

/* ---------- FootNav ---------- */
function FootNav({ idx, total, onPrev, onNext, steps = STEPS }) {
  const step = steps[idx];
  const next = steps[idx + 1];
  const isLast = idx === total - 1;
  return (
    <nav className="footnav" aria-label="Step navigation">
      <div className="footnav-inner">
        <button type="button" className="btn btn-ghost" onClick={onPrev} disabled={idx === 0}>
          ← Back
        </button>
        <div className="position">
          <span className="k">Now</span>
          <span className="v">{step.label}</span>
        </div>
        <button type="button" className="btn btn-primary" onClick={onNext} disabled={isLast}>
          {idx === 0 ? "Begin Workbook" : next ? `Next · ${next.label}` : "Done"} →
        </button>
      </div>
    </nav>
  );
}

/* ============================================================
   Reusable primitives
   ============================================================ */

function Field({ label, prompt, value, onChange, placeholder, multiline = true, rows = 3 }) {
  return (
    <div className="field">
      {label && <span className="field-label">{label}</span>}
      {prompt && <div className="field-prompt">{prompt}</div>}
      {multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
      ) : (
        <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
      )}
    </div>
  );
}

function Check({ checked, onChange, children }) {
  return (
    <label className="check">
      <input type="checkbox" checked={!!checked} onChange={onChange} />
      <span className="box" aria-hidden="true" />
      <span className="text">{children}</span>
    </label>
  );
}

function CheckList({ items, selected = [], onToggle, single = false }) {
  return (
    <div className={`check-list ${single ? "single" : ""}`}>
      {items.map((it, i) => (
        <Check key={i} checked={selected.includes(it)} onChange={() => onToggle(it)}>{it}</Check>
      ))}
    </div>
  );
}

function PickGrid({ value, onChange, options }) {
  return (
    <div className="pick-grid">
      {options.map(o => (
        <label className="pick" key={o.id}>
          <input type="radio" name="pick-grid" checked={value === o.id} onChange={() => onChange(o.id)} />
          <span className="dot" aria-hidden="true" />
          <span className="name">{o.name}</span>
          <span className="sub">{o.sub}</span>
        </label>
      ))}
    </div>
  );
}

function RankedGoalList({ value, onChange, options }) {
  const ids = options.map(o => o.id);
  const order = Array.isArray(value)
    ? [...value.filter(id => ids.includes(id)), ...ids.filter(id => !value.includes(id))]
    : ids;
  const byId = options.reduce((acc, option) => {
    acc[option.id] = option;
    return acc;
  }, {});
  const [dragId, setDragId] = useState(null);

  const moveTo = (fromId, toId) => {
    if (!fromId || fromId === toId) return;
    const next = order.filter(id => id !== fromId);
    const toIndex = next.indexOf(toId);
    next.splice(toIndex < 0 ? next.length : toIndex, 0, fromId);
    onChange(next);
  };

  const moveBy = (index, delta) => {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    const next = [...order];
    const [item] = next.splice(index, 1);
    next.splice(nextIndex, 0, item);
    onChange(next);
  };

  return (
    <div className="ranked-goals" aria-label="Rank website jobs from highest to lowest priority">
      {order.map((id, index) => {
        const option = byId[id];
        return (
          <div
            className={`rank-card ${dragId === id ? "dragging" : ""}`}
            key={id}
            draggable
            onDragStart={() => setDragId(id)}
            onDragEnd={() => setDragId(null)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => {
              moveTo(dragId, id);
              setDragId(null);
            }}
          >
            <span className="rank-num">{index + 1}</span>
            <span className="rank-handle" aria-hidden="true">Drag</span>
            <span className="rank-body">
              <span className="name">{option.name}</span>
              <span className="sub">{option.sub}</span>
            </span>
            <span className="rank-actions">
              <button type="button" onClick={() => moveBy(index, -1)} disabled={index === 0} aria-label={`Move ${option.name} up`}>
                Up
              </button>
              <button type="button" onClick={() => moveBy(index, 1)} disabled={index === order.length - 1} aria-label={`Move ${option.name} down`}>
                Down
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* Design notes callout — hidden when the sender has turned off design notes. */
function DesignNote({ title, children, cite, hero = false }) {
  const t = useTweakValues();
  if (!t.showDesignNotes) return null;
  return (
    <aside className="design-note">
      {hero && <div className="dn-preview" style={{ backgroundImage: "url(./assets/hero-women.jpeg)" }} />}
      <span className="tag">Design notes</span>
      <h4>{title}</h4>
      {children}
      {/* <span className="ref">
        <a href={PROTOTYPE_URL} target="_blank" rel="noopener noreferrer">View on the WRIC site →</a>
        {cite ? <span style={{ color: "var(--faint)" }}>· {cite}</span> : null}
      </span> */}
    </aside>
  );
}

/* Expose to other Babel script scopes */
Object.assign(window, {
  useWorkbook, TweakCtx, useTweakValues,
  TopBar, Stepper, StepHeader, FootNav,
  Field, Check, CheckList, PickGrid, RankedGoalList, DesignNote,
});
