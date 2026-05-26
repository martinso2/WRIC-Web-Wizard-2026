/* ============================================================
   Step content components — one per workbook section.
   Each section consumes wizard.jsx primitives and data.jsx content.
   Layout pattern: <StepHeader/> + <div class="step-body"> with
   an <div class="exercise"> column and an <aside class="notes-col">
   column containing one or more <DesignNote/> components.

   Updated: Added 8 effective website design principles survey
   as a dedicated "Design Brief" phase that feeds into the existing
   scope / brief flow.
   ============================================================ */
/* global React */

/* ============================================================
   DESIGN PRINCIPLES DATA
   8 principles used in the survey steps below.
   ============================================================ */

const DESIGN_PRINCIPLES = [
  {
    id: "attention",
    num: "P1",
    label: "Attention First",
    title: "Earn attention before reading",
    sub: "You do not earn reading. You earn attention. Design for the eye before the mind.",
  },
  {
    id: "onegoal",
    num: "P2",
    label: "One Goal Per Screen",
    title: "One question, one action",
    sub: "Every section should answer one question or drive one action.",
  },
  {
    id: "mobile",
    num: "P3",
    label: "Mobile Is the Default",
    title: "Design for mobile and thumbs first — desktops and mice second",
    sub: "Start with mobile and expand upward.",
  },
  {
    id: "show",
    num: "P4",
    label: "Show, Then Explain",
    title: "Let people understand before they read",
    sub: "Use images, layout, icons, proof, and examples before paragraphs.",
  },
  {
    id: "decisions",
    num: "P5",
    label: "Make Decisions Easy",
    title: "Reduce choices and friction",
    sub: "Reduce choices. Reduce navigation. Reduce clicks.",
  },
  {
    id: "scanners",
    num: "P6",
    label: "Design for Scanners",
    title: "Assume users skim",
    sub: "Use short headlines, visual anchors, spacing, and clear sections.",
  },
  {
    id: "trust",
    num: "P7",
    label: "Trust Is a Design Feature",
    title: "Credibility starts visually",
    sub: "Professional visuals, consistency, real photography, outcomes, testimonials, and clear language build credibility.",
  },
  {
    id: "whitespace",
    num: "P8",
    label: "White Space Creates Understanding",
    title: "Space helps people think",
    sub: "Space is not empty. It helps people organize information and notice what matters.",
  },
];

/* ============================================================
   SURVEY QUESTION DATA — keyed per principle
   ============================================================ */

const PRINCIPLE_QUESTIONS = {
  attention: {
    mc: {
      label: "What should a visitor notice first?",
      key: "attention_first",
      options: [
        "Who we are",
        "Who we serve",
        "How to get services",
        "Why work matters",
        "How to donate",
      ],
    },
  },
  onegoal: {
    mc: {
      label: "What should the first major section do?",
      key: "onegoal_section",
      options: [
        "Explain who WRIC helps",
        "Route people to services",
        "Build donor confidence",
        "Introduce the organization",
      ],
    },
  },
  mobile: {
    mc: {
      label: "Where are people most likely to first view the website?",
      key: "mobile_device",
      options: [
        "Phone",
        "Laptop or desktop",
        "Tablet",
        "Not sure",
      ],
    },
  },
  show: {
    mc: {
      label: "What should we show before asking people to read?",
      key: "show_first",
      multi: true,
      options: [
        "Real people behind the work",
        "Services at a glance",
        "Impact numbers",
        "A client story or testimonial",
        "Clear icons or visual cues",
      ],
    },
  },
  decisions: {
    mc: {
      label: "Where can the new website reduce choices?",
      key: "decisions_reduce",
      options: [
        "Navigation",
        "Homepage calls to action",
        "Service descriptions",
        "Donation flow",
      ],
    },
  },
  scanners: {
    mc: {
      label: "Which design pattern would help skimmers most?",
      key: "scanners_pattern",
      options: [
        "Short section headlines",
        "Visual anchors",
        "Clear section spacing",
        "Plain-language labels",
      ],
    },
  },
  trust: {
    mc: {
      label: "What builds trust fastest on a nonprofit website? (pick all that apply)",
      key: "trust_signals",
      multi: true,
      options: [
        "Real photos of staff",
        "Client testimonials",
        "Logos of funders",
        "Years in service",
        "Clean, simple design",
        "Clear confidentiality language",
      ],
    },
  },
  whitespace: {
    mc: {
      label: "How should the new website use space?",
      key: "whitespace_style",
      options: [
        "Roomy and calm",
        "Balanced",
        "Dense and detailed",
        "Highly visual",
      ],
    },
  },
};

/* ============================================================
   SHARED SURVEY PRIMITIVES
   Reusable question components used across all 8 principle steps.
   ============================================================ */

/* Multiple-choice rows — single or multi select */
function PillQuestion({ q, data, set }) {
  const val = data[q.key];
  const selected = q.multi
    ? (Array.isArray(val) ? val : [])
    : val;

  const toggle = (opt) => {
    if (q.multi) {
      const arr = Array.isArray(val) ? val : [];
      set(q.key, arr.includes(opt) ? arr.filter(x => x !== opt) : [...arr, opt]);
    } else {
      set(q.key, opt === val ? "" : opt);
    }
  };

  return (
    <div className="survey-q">
      <div className="survey-q-label">{q.label}</div>
      <div className="check-list single">
        {q.options.map(opt => (
          <label
            key={opt}
            className={`check ${q.multi ? "" : "path-choice"}`}
          >
            <input
              type={q.multi ? "checkbox" : "radio"}
              name={q.key}
              checked={q.multi ? selected.includes(opt) : selected === opt}
              onChange={() => toggle(opt)}
            />
            <span className="box" aria-hidden="true" />
            <span className="text">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* UVP card grid — single select */
function UvpQuestion({ q, data, set }) {
  const val = data[q.key];
  return (
    <div className="survey-q">
      <div className="survey-q-label">{q.label}</div>
      <div className="uvp-grid">
        {q.options.map(opt => (
          <button
            key={opt.title}
            type="button"
            className={`uvp-card${val === opt.title ? " selected" : ""}`}
            onClick={() => set(q.key, opt.title === val ? "" : opt.title)}
          >
            <div className="uvp-title">{opt.title}</div>
            <div className="uvp-desc">{opt.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* Drag-and-drop rank list */
function RankQuestion({ q, data, set }) {
  const saved = data[q.key];
  const items = React.useMemo(() => {
    if (Array.isArray(saved) && saved.length === q.items.length) return saved;
    return q.items;
  }, [saved, q.items]);

  const [dragIdx, setDragIdx] = React.useState(null);

  const move = (from, to) => {
    if (from === to) return;
    const next = [...items];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    set(q.key, next);
  };

  const moveBy = (index, delta) => {
    const nextIndex = index + delta;
    if (nextIndex < 0 || nextIndex >= items.length) return;
    move(index, nextIndex);
  };

  return (
    <div className="survey-q">
      <div className="survey-q-label">{q.label}</div>
      <div className="ranked-goals">
        {items.map((item, i) => (
          <div
            key={item}
            className={`rank-card${dragIdx === i ? " dragging" : ""}`}
            draggable
            onDragStart={() => setDragIdx(i)}
            onDragOver={e => { e.preventDefault(); }}
            onDrop={() => { move(dragIdx, i); setDragIdx(null); }}
            onDragEnd={() => setDragIdx(null)}
          >
            <span className="rank-num">{i + 1}</span>
            <span className="rank-handle" aria-hidden="true">Drag</span>
            <span className="rank-body">
              <span className="name">{item}</span>
            </span>
            <span className="rank-actions">
              <button type="button" onClick={() => moveBy(i, -1)} disabled={i === 0} aria-label={`Move ${item} up`}>
                Up
              </button>
              <button type="button" onClick={() => moveBy(i, 1)} disabled={i === items.length - 1} aria-label={`Move ${item} down`}>
                Down
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* Scale / slider */
function ScaleQuestion({ q, data, set }) {
  const val = data[q.key] !== undefined ? data[q.key] : q.defaultVal;
  return (
    <div className="survey-q">
      <div className="survey-q-label">{q.label}</div>
      <div className="scale-wrap">
        <span className="scale-label">{q.leftLabel}</span>
        <input
          type="range"
          min={q.min}
          max={q.max}
          step="1"
          value={val}
          onChange={e => set(q.key, Number(e.target.value))}
        />
        <span className="scale-val">{val}</span>
        <span className="scale-label">{q.rightLabel}</span>
      </div>
    </div>
  );
}

/* Two-column checkbox grid (used by completeness step) */
function CheckGridQuestion({ q, data, set }) {
  const all = [...(q.left.items), ...(q.right.items)];
  const selected = data[q.key] || [];
  const toggle = (item) => {
    set(q.key, selected.includes(item)
      ? selected.filter(x => x !== item)
      : [...selected, item]);
  };
  return (
    <div className="survey-q">
      <div className="survey-q-label">{q.label}</div>
      <div className="check-grid-wrap">
        {[q.left, q.right].map(col => (
          <div key={col.heading} className="check-col">
            <div className="check-col-head">{col.heading}</div>
            {col.items.map(item => (
              <div
                key={item}
                className={`check-item${selected.includes(item) ? " checked" : ""}`}
                onClick={() => toggle(item)}
              >
                <span className="check-box">{selected.includes(item) ? "✓" : ""}</span>
                <span className="check-text">{item}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   DESIGN PRINCIPLE STEP FACTORY
   Renders a single principle's survey slide.
   ============================================================ */
function PrincipleStep({ principleId, data, set, note, headerNum }) {
  const p = DESIGN_PRINCIPLES.find(x => x.id === principleId);
  const qs = PRINCIPLE_QUESTIONS[principleId] || {};

  const renderQ = (key) => {
    const q = qs[key];
    if (!q) return null;
    if (key === "checks") return <CheckGridQuestion key={key} q={q} data={data} set={set} />;
    if (key.startsWith("uvp")) return <UvpQuestion key={key} q={q} data={data} set={set} />;
    if (key.startsWith("mc")) return <PillQuestion key={key} q={q} data={data} set={set} />;
    if (key === "rank") return <RankQuestion key={key} q={q} data={data} set={set} />;
    if (key === "scale") return <ScaleQuestion key={key} q={q} data={data} set={set} />;
    return null;
  };

  return (
    <section className="step">
      <StepHeader
        num={headerNum || p.num}
        label={p.label}
        title={<em>{p.title}</em>}
      />
      <div className="step-body">
        <div className="exercise">
          {Object.keys(qs).map(k => renderQ(k))}
        </div>
        <aside className="notes-col">
          {note && (
            <DesignNote title={note.title} cite={note.cite}>
              {note.body}
            </DesignNote>
          )}
          {!note && (
            <DesignNote
              title={<>Why this matters for <em>Us</em></>}
              cite={`Design principle ${p.num}`}
            >
              <p>{p.sub}</p>
            </DesignNote>
          )}
        </aside>
      </div>
    </section>
  );
}

/* ============================================================
   DESIGN PRINCIPLES INTRO STEP
   Shown before the 8-principle survey begins.
   ============================================================ */
function DesignPrinciplesIntroStep() {
  return (
    <section className="step">
      <StepHeader
        num="08"
        label="Design Principles"
        title={<>8 Principles for <em>Your Site.</em></>}
      />
      <div className="design-principles-layout">
        <div className="note golden-rule">
          <span className="tag">Golden rule</span>
          <p>Can someone understand it in 5 seconds, trust it in 15 seconds, and act in 30 seconds? If not, simplify.</p>
          <p>People scan first, decide emotionally, validate rationally, and act only when friction is low. These principles are about how people actually consume websites.</p>
         
        </div>

        <h3>The 8 principles</h3>
        <div className="principles-index">
          {[DESIGN_PRINCIPLES.slice(0, 4), DESIGN_PRINCIPLES.slice(4)].map((principles, columnIndex) => (
            <div className="principle-index-col" key={columnIndex}>
              {principles.map(p => (
                <div className="principle-index-item" key={p.id}>
                  <span className="principle-index-num">{p.num.replace("P", "")}</span>
                  <div>
                    <strong>{p.label}</strong>
                    <span className="principle-index-title"> — {p.title}</span>
                  </div>
                </div>
              ))}
              </div>
          ))}
        </div>

        <div className="design-note-wide">
          <DesignNote
            title={<>These principles point toward the <em>new website.</em></>}
            cite="Design direction"
            hero={true}
          >
            <p>Each principle helps translate your input into practical website decisions.</p>
            <p>Your job is to confirm, refine, and direct the content of the website before design work gets locked in.</p>
          </DesignNote>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DESIGN PRINCIPLES REVIEW STEP
   Summarizes all 8 principle responses.
   ============================================================ */
function DesignPrinciplesReviewStep({ data, headerNum = "✦", showActions = true }) {
  const get = (k) => {
    const v = data[k];
    if (Array.isArray(v)) return v.join(", ") || "— not answered —";
    if (v !== undefined && v !== "") return String(v);
    return "— not answered —";
  };

  const summaries = [
    { label: "First thing visitors should notice", key: "attention_first" },
    { label: "First major section goal", key: "onegoal_section" },
    { label: "Primary device expectation", key: "mobile_device" },
    { label: "Where to reduce choices", key: "decisions_reduce" },
    { label: "Best scanner-friendly pattern", key: "scanners_pattern" },
    { label: "Top trust signals", key: "trust_signals" },
    { label: "Preferred use of space", key: "whitespace_style" },
  ];

  return (
    <section className="step">
      <StepHeader
        num={headerNum}
        label="Design Brief"
        title={<>What the group has <em>agreed on.</em></>}
      />
      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="review-section">
          <h4>Design principles — all responses</h4>
          {summaries.map(s => (
            <div className="review-q" key={s.key}>
              <div className="q">{s.label}</div>
              <div className={`a${data[s.key] !== undefined && data[s.key] !== "" ? "" : " empty"}`}>
                {get(s.key)}
              </div>
            </div>
          ))}
        </div>

        {showActions && (
          <div className="export-row">
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>
              Print / Save as PDF
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   DESIGN NOTES — per principle, used inside PrincipleStep
   ============================================================ */
const PRINCIPLE_NOTES = {
  attention: {
    title: <>Design for the <em>first glance.</em></>,
    cite: "Attention",
    body: <p>Strong hierarchy, imagery, scale, and contrast should tell the story before anyone reads a sentence.</p>,
  },
  onegoal: {
    title: <>Give each section <em>one job.</em></>,
    cite: "Focus",
    body: <p>If a section has competing messages, visitors have to decide what matters. Many will choose none.</p>,
  },
  mobile: {
    title: <>The new website should be built <em>mobile-first.</em></>,
    cite: "Mobile",
    body: <p>Smaller screens force clarity. Tap targets, phone links, short forms, and readable text matter more than decorative complexity.</p>,
  },
  show: {
    title: <>Show before asking people to <em>read.</em></>,
    cite: "Visual communication",
    body: <p>Images, examples, icons, outcomes, and layout can help people understand the page before they commit to reading it.</p>,
  },
  decisions: {
    title: <>Reduce the work required to <em>act.</em></>,
    cite: "Friction",
    body: <p>Every extra menu item, button, field, or unclear label creates another decision. Fewer decisions usually means more action.</p>,
  },
  scanners: {
    title: <>Design for people who <em>skim.</em></>,
    cite: "Scanning",
    body: <p>Short headlines, clear sections, and visual anchors help visitors understand the page even when they do not read every word.</p>,
  },
  trust: {
    title: <>Trust is built before the details.</>,
    cite: "Credibility",
    body: <p>People judge credibility quickly. Consistent visuals, real proof, and clear language, help the website feel trustworthy.</p>,
  },
  whitespace: {
    title: <>Use <em>generous spacing</em> to make choices clearer.</>,
    cite: "White space",
    body: <p>Each section should have room to breathe. White space is not emptiness; it is a way to show what matters enough to stand alone.</p>,
  },
};

/* ============================================================
   EXISTING STEPS — unchanged from original
   ============================================================ */

/* ---------- 00 · Cover ---------- */
function CoverStep({ onStart, data, set }) {
  const t = useTweakValues();
  const solo = t.mode === "solo";
  const hasIdentity = (data.respondent_name || "").trim()
    && (data.respondent_email || "").trim()
    && (data.respondent_role || "").trim();
  const hasSavedData = Object.keys(data || {}).length > 0;
  const startNewResponse = () => {
    if (!confirm("Clear the saved answers in this browser and start a new response?")) return;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("nonprofit-workbook-v2-idx");
    if (window.WorkbookFirebase) {
      window.WorkbookFirebase.resetResponseId();
    }
    location.reload();
  };

  return (
    <section className="step">
      <div className="cover">
        <div className="cover-text">
          <div className="cover-eyebrow">
            <span className="dot"></span>
            <span>{solo
              ? <>A working guide for <em style={{fontStyle:"italic",color:"var(--navy-bright)"}}>your perspective</em></>
              : "A working guide for boards & committees"}</span>
          </div>
          <h1>{solo ? <>Your view, before the <em>pretty website.</em></> : <>Before the <em>pretty website.</em></>}</h1>
          <p className="deck">
            {solo
              ? <>Your honest answers help shape the website.</>
              : <>Most nonprofit websites start with layout and colors. This workbook starts with purpose.</>}
          </p>
          {!solo && (
            <p className="deck">
              First, decide what the site needs to do. Then turn those decisions into <em>a website design.</em>
            </p>
          )}

          <div className="respondent-card">
            <div className="head">
              Your contact information
              {t.senderName && <span className="sender">— requested by {t.senderName}</span>}
            </div>
            <p className="privacy-note">
              Your responses will be kept confidential. Name and email are collected only so the survey results can be organized and shared back with the group.
            </p>
            <p className="privacy-note">
              This is your survey sign-in. No password or magic link is required.
            </p>
            <div className="row">
              <label>
                Your name
                <input type="text" value={data.respondent_name || ""}
                       onChange={e => set("respondent_name", e.target.value)}
                       placeholder="Jane Q. Trustee" />
              </label>
              <label>
                Email
                <input type="email" value={data.respondent_email || ""}
                       onChange={e => set("respondent_email", e.target.value)}
                       placeholder="jane@example.org" />
              </label>
              <label>
                Your role at WRIC
                <input type="text" value={data.respondent_role || ""}
                       onChange={e => set("respondent_role", e.target.value)}
                       placeholder="Board Vice Chair" />
              </label>
            </div>
          </div>

          <div className="meta-row">
            <div className="item">
              <span className="k">Format</span>
              <span className="v">9 sections</span>
            </div>
            <div className="item">
              <span className="k">Time</span>
              <span className="v">~25 minutes</span>
            </div>
            <div className="item">
              <span className="k">Output</span>
              <span className="v">A printable brief</span>
            </div>
            <div className="item">
              <span className="k">{t.deadline ? "Due by" : "Guided by"}</span>
              <span className="v">{t.deadline || "A new website brief"}</span>
            </div>
          </div>

          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={onStart} disabled={!hasIdentity}>
             Start here →
            </button>
            {hasSavedData && (
              <button type="button" className="btn btn-ghost" onClick={startNewResponse}>
                Start a new blank response
              </button>
            )}
          </div>
          {!hasIdentity && (
            <p className="privacy-note">Enter your name, email, and role to begin.</p>
          )}
        </div>

        <div className="cover-art">
          <img src="./assets/hero-women-2.jpg" alt="Watercolor portraits of women in profile, layered in shades of blue and teal." />
        </div>
      </div>
    </section>
  );
}

/* ---------- 01 · Premise ---------- */
function PremiseStep() {
  return (
    <section className="step">
      <StepHeader
        num="01" label="Premise"
        title={<>Your website can showcase your mission, raise funds, and become a <em>valuable client resource.</em></>}
      />
      <div className="full-width-note">
          <DesignNote
            title={<>How to use this <em>workbook.</em></>}
            cite="Website brief"
            hero={true}
          >
            <p>Before choosing a design, agree on what the website needs to accomplish. That's what drives the design of the site</p>
            <p>This workbook turns your expertise into a simple brief, so the website can work alongside social media, email, brochures, and advertising instead of doing all the work alone.</p>
          </DesignNote>
      </div>
    </section>
  );
}

/* ---------- 02 · UVP ---------- */
function UvpStep({ data, set }) {
  const t = useTweakValues();
  const solo = t.mode === "solo";
  return (
    <section className="step">
      <StepHeader
        num="02" label="Unique Value"
        title={<>Find your <em>Unique Value Proposition.</em> It drives content!</>}
      />
      <div className="step-body">
        <div className="exercise">
          {/* {solo ? (
            <div className="warn">
              <span className="tag">Ground rule</span>
              <strong>Answer first, refine later.</strong>
            </div>
          ) : (
            <div className="warn">
              <span className="tag">Ground rule</span>
              <strong>No critiques during the first pass.</strong> Capture ideas first, refine after.
            </div>
          )} */}

          <h3>Six clarity drills</h3>
          <p>Choose the answer that feels closest and makes the most sense for your organization.</p>
          <div className="drills">
            {UVP_DRILLS.map((d, i) => (
              <div className="drill" key={d.id}>
                <div className="drill-head">
                  <span className="drill-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="prompt">{d.prompt}</span>
                </div>
                <PathwayChoiceList
                  name={d.id}
                  items={d.options}
                  value={data[d.id]}
                  onChange={v => set(d.id, v)}
                />
              </div>
            ))}
          </div>
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Turn the UVP into a <em>plain promise.</em></>}
            cite="Hero + services"
          >
            <p>The strongest homepage message is usually short, direct, and compelling.</p>
            <p>If the message sounds like a mission statement, it won't resonate.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ---------- 03 · One Job ---------- */
function normalizeGoalRank(savedRank, savedPrimary) {
  const ids = PRIMARY_GOALS.map(g => g.id);
  const saved = Array.isArray(savedRank) ? savedRank : (savedPrimary ? [savedPrimary] : []);
  const uniqueSaved = saved.filter((id, index) => saved.indexOf(id) === index);
  return [
    ...uniqueSaved.filter(id => ids.includes(id)),
    ...ids.filter(id => !uniqueSaved.includes(id)),
  ];
}

function OneJobStep({ data, set }) {
  const goalRank = normalizeGoalRank(data.primary_goal_rank, data.primary_goal);

  React.useEffect(() => {
    if (!Array.isArray(data.primary_goal_rank)) {
      set("primary_goal_rank", goalRank);
      set("primary_goal", goalRank[0] || "");
    }
  }, [data.primary_goal_rank, data.primary_goal, set]);

  const setGoalRank = (rank) => {
    set("primary_goal_rank", rank);
    set("primary_goal", rank[0] || "");
  };

  return (
    <section className="step">
      <StepHeader
        num="03" label="One Job"
        title={<>What is the website's <em>one job?</em></>}
      />
      <div className="step-body">
        <div className="exercise">
          <h3>Rank the website jobs</h3>
          <p>Drag the cards into order, or use the up/down buttons. The top item becomes the website's primary job.</p>
          <RankedGoalList value={goalRank} onChange={setGoalRank} options={PRIMARY_GOALS} />
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Repeat the <em>main action</em> where it matters.</>}
            cite="Calls to action"
          >
            <p>Once the website has a primary job, the main call to action should appear in more than one place.</p>
            <p>Repetition helps visitors move without wondering what to do next.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ---------- 04 · Client Pathways ---------- */
function PathwayChoiceList({ name, items, value, onChange }) {
  return (
    <div className="pathway-choice-list">
      {items.map((item) => (
        <label className="check path-choice" key={item}>
          <input
            type="radio"
            name={name}
            checked={value === item}
            onChange={() => onChange(item)}
          />
          <span className="box" aria-hidden="true" />
          <span className="text">{item}</span>
        </label>
      ))}
    </div>
  );
}

function PathwaysStep({ data, set, toggle }) {
  const selectedValue = (key) => {
    const value = data[key];
    return Array.isArray(value) ? value[0] : value;
  };

  return (
    <section className="step">
      <StepHeader
        num="04" label="Client Pathways"
        title={<>How do clients <em>find</em> you — and what do they need to see first?</>}
      />
      <div className="step-body">
        <div className="exercise">
          <h3>1 · How do potential clients hear about us?</h3>
          <p>Choose the one channel that brings the most people to your services now.</p>
          <PathwayChoiceList
            name="discovery"
            items={DISCOVERY_CHANNELS}
            value={selectedValue("discovery")}
            onChange={v => set("discovery", v)}
          />

          <h3>2 · The first ten seconds</h3>
          <p>What should we see first on the website?</p>
          <PathwayChoiceList
            name="first_ten"
            items={FIRST_TEN_SECONDS}
            value={selectedValue("first_ten")}
            onChange={v => set("first_ten", v)}
          />

          <h3>3 · Three pathways, one homepage</h3>
          <p>Choose the actions each audience should be able to take.</p>
          <div className="paths">
            <div className="path">
              <span className="num">01 · New client</span>
              <span className="who">Someone visiting the website <em>for the first time</em></span>
              <span className="what">What should they be able to do?</span>
              <PathwayChoiceList
                name="path_new_action"
                items={PATHWAY_NEW_CLIENT}
                value={data.path_new_action}
                onChange={v => set("path_new_action", v)}
              />
            </div>
            <div className="path">
              <span className="num">02 · Potential donors</span>
              <span className="who">Someone deciding whether to <em>give</em></span>
              <span className="what">What do they need to feel confident donating?</span>
              <PathwayChoiceList
                name="path_donor_action"
                items={PATHWAY_POTENTIAL_DONOR}
                value={data.path_donor_action}
                onChange={v => set("path_donor_action", v)}
              />
            </div>
            <div className="path">
              <span className="num">03 · Existing client</span>
              <span className="who">Someone <em>already enrolled</em></span>
              <span className="what">What do they need quick access to?</span>
              <PathwayChoiceList
                name="path_existing_action"
                items={PATHWAY_EXISTING_CLIENT}
                value={data.path_existing_action}
                onChange={v => set("path_existing_action", v)}
              />
            </div>
          </div>

          <h3>4 · Trust signals</h3>
          <p>Choose the trust signal visitors should not have to hunt for.</p>
          <PathwayChoiceList
            name="trust"
            items={TRUST_SIGNALS}
            value={selectedValue("trust")}
            onChange={v => set("trust", v)}
          />
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Why the phone number sits in the hero — <em>twice.</em></>}
            cite="Hero call-bar · English + Spanish"
          >
            <p>The WRIC hero leads with English and Spanish phone numbers, plus staffed hours.</p>
            <p>For someone in crisis, that may be the whole reason they came.</p>
          </DesignNote>

          <DesignNote
            title={<>The <em>"Take the first step"</em> module is the structural answer.</>}
            cite="Get started · three-path block"
          >
            <p>New clients get intake. People still learning get orientation. Existing clients get a portal.</p>
            <p>Each audience gets a door without crowding the others.</p>
          </DesignNote>

          <DesignNote
            title={<>The contact section doesn't bury <em>"Need help right now?"</em></>}
            cite="Contact · emergency block"
          >
            <p>The contact section says what to do in an emergency, and what WRIC can handle during business hours.</p>
            <p>That clarity builds trust.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ---------- 05 · Scope ---------- */
function ScopeStep({ data, set, toggle }) {
  const checked = data.scope_checks || [];
  const onePagerLeans = checked.length >= 3;

  return (
    <section className="step">
      <StepHeader
        num="05" label="Scope"
        title={<>One page, or <em>many?</em></>}
      />
      <div className="step-body">
        <div className="exercise">
          <h3>Are you a candidate for a one-pager?</h3>
          <p>Tick every statement that is honestly true about your organization today.</p>
          <CheckList items={SCOPE_CHECKS} selected={checked} onToggle={v => toggle("scope_checks", v)} single />

          {checked.length > 0 && (
            <div className={onePagerLeans ? "note" : "warn"}>
              <span className="tag">Where you land</span>
              {onePagerLeans
                ? "Strong signal: a single-page site is likely the right call."
                : "A few extra pages may make sense, but each one needs a clear purpose and someone responsible for keeping it current-if not it just becomes cluttered, design starts to drift, and the site becomes harder to maintain and navigate."}
            </div>
          )}

          <h3>If you go one-page, it's easier to navigate and more cost effective to maintain.</h3>
          <p>Tick every statement that is honestly true about your website today.</p>
          <CheckList items={ONEPAGER_CHECKS} selected={data.onepager_checks || []} onToggle={v => toggle("onepager_checks", v)} single />
         
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>A focused site is easier to <em>use and maintain.</em></>}
            cite="Scope strategy"
          >
            <p>A smaller site can still feel complete when the most important information is organized clearly.</p>
            <p>Add extra pages only when they have a real audience and someone responsible for keeping them current. </p> <p>Websites are like closets-they need to be tidy and organized to be useful. Once a season you need to clean them out. Once every few years you need to throw everything out and start over.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ---------- 06 · People ---------- */
function PeopleStep({ data, toggle }) {
  return (
    <section className="step">
      <StepHeader
        num="06" label="People"
        title={<>People give to <em>people.</em></>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>Donors, clients, and funders all look for credibility and trust. Use clear, current staff and board information to show who is behind the work.</p>

          <h3>The staff page — done right</h3>
          <p>Tick every statement that makes sense for the site.</p>
          <CheckList items={STAFF_CHECKS} selected={data.staff_checks || []} onToggle={v => toggle("staff_checks", v)} single />

          <h3>The board page — done current</h3>
          <p>Keep it current. Funders check.</p>
          <CheckList items={BOARD_CHECKS} selected={data.board_checks || []} onToggle={v => toggle("board_checks", v)} single />
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>People pages should build <em>trust quickly.</em></>}
            cite="Staff + board"
          >
            <p>Clear staff and board information helps visitors understand who is responsible for the work.</p>
            <p>Clients look for real people. Funders look for stability and accountability.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ---------- 07 · Show, Don't Tell ---------- */
function ShowStep({ data, set, toggle }) {
  return (
    <section className="step">
      <StepHeader
        num="07" label="Show, Don't Tell"
        title={<>Do not write a word — <em>yet.</em></>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>Before writing copy, decide what the site needs to show. What does your Unique Value Proposition look like in real life?</p>

          <h3>Shot list — what we need to see</h3>
          <CheckList items={SHOT_LIST} selected={data.shots || []} onToggle={v => toggle("shots", v)} single />
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Consider illustration when photos are <em>sensitive.</em></>}
            cite="Visual approach"
          >
            <p>Some organizations cannot safely or appropriately photograph everyone they serve.</p>
            <p>In those cases, illustration can add warmth without creating consent or privacy concerns.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ---------- Review ---------- */
function ReviewStep({ data, reset }) {
  const [responseCount, setResponseCount] = React.useState(null);
  const get = (k) => (data[k] || "").trim();
  const getList = (k) => data[k] || [];
  const getChoice = (k) => Array.isArray(data[k]) ? (data[k][0] || "") : get(k);
  const goalRank = Array.isArray(data.primary_goal_rank) ? data.primary_goal_rank : [];
  const rankedGoals = goalRank
    .map(id => PRIMARY_GOALS.find(g => g.id === id))
    .filter(Boolean);
  const primary = rankedGoals[0] || PRIMARY_GOALS.find(g => g.id === data.primary_goal);

  React.useEffect(() => {
    let mounted = true;
    if (!window.WorkbookFirebase || !window.WorkbookFirebase.getPublicSummaries) return () => { mounted = false; };
    window.WorkbookFirebase.getPublicSummaries()
      .then((summaries) => {
        if (mounted) setResponseCount(summaries.length);
      })
      .catch(() => {
        if (mounted) setResponseCount(null);
      });
    return () => { mounted = false; };
  }, []);

  const QA = ({ q, a, empty = "— not yet answered —" }) => (
    <div className="review-q">
      <div className="q">{q}</div>
      <div className={`a ${a ? "" : "empty"}`}>{a || empty}</div>
    </div>
  );

  return (
    <section className="step">
      <StepHeader
        num="✦" label="Your Answers"
        title={<>What you've <em>decided.</em></>}
      />

      <div style={{ maxWidth: "var(--max-w)", margin: "0 auto" }}>
        <div className="respondent-badge">
          <span>{responseCount === null ? "Responses are being collected." : `${responseCount} response${responseCount === 1 ? "" : "s"} received so far.`}</span>
        </div>

        <div className="review-section">
          <h4>Unique Value Proposition</h4>
          {UVP_DRILLS.map(d => <QA key={d.id} q={d.prompt} a={get(d.id)} />)}
        </div>

        <div className="review-section">
          <h4>Website job ranking</h4>
          <QA q="Primary goal" a={primary ? primary.name : ""} empty="— not yet chosen —" />
          <QA
            q="Top-to-bottom priorities"
            a={rankedGoals.map((g, i) => `${i + 1}. ${g.name}`).join("\n")}
            empty="— not yet ranked —"
          />
        </div>

        <div className="review-section">
          <h4>Client pathways</h4>
          <QA q="Where clients hear about us" a={getChoice("discovery")} empty="— none —" />
          <QA q="First ten seconds — what must be visible" a={getChoice("first_ten")} empty="— none —" />
          <QA q="Path for a new client" a={get("path_new_action")} empty="— none —" />
          <QA q="Path for a potential donor" a={get("path_donor_action")} empty="— none —" />
          <QA q="Path for an existing client" a={get("path_existing_action")} empty="— none —" />
          <QA q="Trust signal we'll commit to" a={getChoice("trust")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>Scope</h4>
          <QA q="Why a One Page Website may be best" a={getList("scope_checks").map(s => "• " + s).join("\n")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>People — staff & board commitments</h4>
          <QA q="Staff Section design preferences" a={getList("staff_checks").map(s => "• " + s).join("\n")} empty="— none —" />
          <QA q="Board Section design preferences" a={getList("board_checks").map(s => "• " + s).join("\n")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>Show, don't tell — shot list</h4>
          <QA q="Shots we'll capture" a={getList("shots").map(s => "• " + s).join("\n")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>Design principles — group consensus</h4>
          <DesignPrinciplesReviewStep data={data} showActions={false} />
        </div>

        <div className="export-row">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>Print / Save as PDF</button>
          <button type="button" className="btn btn-ghost" onClick={() => {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = "workbook-brief.json"; a.click();
            URL.revokeObjectURL(url);
          }}>Download as JSON</button>
          <button type="button" className="btn btn-ghost" onClick={() => {
            if (confirm("Clear all your answers? This cannot be undone.")) {
              localStorage.removeItem(STORAGE_KEY);
              if (window.WorkbookFirebase) {
                window.WorkbookFirebase.resetResponseId();
              }
              location.reload();
            }
          }}>Reset workbook</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Close ---------- */
const RESULT_FIELDS = [
  { key: "primary_goal", label: "Top-ranked website job" },
  { key: "path_new_action", label: "What new clients should be able to do" },
  { key: "path_donor_action", label: "What potential donors need" },
  { key: "path_existing_action", label: "What existing clients need" },
  { key: "attention_first", label: "What visitors should notice first" },
  { key: "decisions_reduce", label: "Where the website can reduce choices" },
];

const UVP_RESULT_FIELDS = [
  { key: "uvp_problem", label: "Why Clients Come to Us" },
  { key: "uvp_approach", label: "What makes our approach effective" },
  { key: "uvp_proof", label: "Proof that lives are changing" },
  { key: "uvp_loss", label: "Who would feel the loss" },
  { key: "uvp_diff", label: "What makes WRIC different" },
  { key: "uvp_feel", label: "What visitors should feel" },
];

const SCOPE_RESULT_FIELDS = [
  { key: "scope_checks", label: "One-page site signals" },
  { key: "onepager_checks", label: "What a one-page site would need" },
];

const PEOPLE_RESULT_FIELDS = [
  { key: "staff_checks", label: "Staff page priorities" },
  { key: "board_checks", label: "Board page priorities" },
];

const VISUAL_RESULT_FIELDS = [
  { key: "show_first", label: "What to show before asking people to read" },
  { key: "shots", label: "What the website needs to show" },
];

function normalizeSummaryAnswers(summary) {
  const answers = { ...((summary && summary.answers) || {}) };
  if (summary && summary.respondentRole && !answers.respondent_role) {
    answers.respondent_role = summary.respondentRole;
  }
  return answers;
}

function percent(count, total) {
  if (!total) return 0;
  return Math.round((count / total) * 100);
}

function tallyValues(summaries, field) {
  const counts = {};
  let answered = 0;

  summaries.forEach((summary) => {
    const answers = normalizeSummaryAnswers(summary);
    const raw = answers[field.key];
    const values = Array.isArray(raw) ? raw : (raw ? [raw] : []);
    if (values.length) answered += 1;
    values.forEach((value) => {
      counts[value] = (counts[value] || 0) + 1;
    });
  });

  return {
    answered,
    results: Object.keys(counts)
      .map((value) => ({ value, count: counts[value], pct: percent(counts[value], summaries.length) }))
      .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)),
  };
}

function tallyRankings(summaries, field) {
  const scores = {};
  const firstPlace = {};
  let answered = 0;

  summaries.forEach((summary) => {
    const answers = normalizeSummaryAnswers(summary);
    const ranking = Array.isArray(answers[field.key]) ? answers[field.key] : [];
    if (!ranking.length) return;
    answered += 1;
    ranking.forEach((value, index) => {
      scores[value] = (scores[value] || 0) + (ranking.length - index);
      if (index === 0) firstPlace[value] = (firstPlace[value] || 0) + 1;
    });
  });

  return {
    answered,
    results: Object.keys(scores)
      .map((value) => ({ value, score: scores[value], first: firstPlace[value] || 0 }))
      .sort((a, b) => b.score - a.score || b.first - a.first || a.value.localeCompare(b.value)),
  };
}

function ResultsSnapshot() {
  const [state, setState] = React.useState({
    error: "",
    loading: true,
    summaries: [],
  });

  React.useEffect(() => {
    let mounted = true;
    if (!window.WorkbookFirebase || !window.WorkbookFirebase.getPublicSummaries) {
      setState({ error: "Results are available after Firebase sync is enabled.", loading: false, summaries: [] });
      return () => { mounted = false; };
    }

    window.WorkbookFirebase.getPublicSummaries()
      .then((summaries) => {
        if (mounted) setState({ error: "", loading: false, summaries });
      })
      .catch((error) => {
        if (mounted) {
          const message = error && (error.code || error.message) ? ` (${error.code || error.message})` : "";
          setState({ error: `Results are not available yet${message}. Check Firebase Anonymous Auth and Realtime Database rules.`, loading: false, summaries: [] });
        }
      });

    return () => { mounted = false; };
  }, []);

  const rows = React.useMemo(() => {
    const countValues = (key) => {
      const counts = {};
      state.summaries.forEach((summary) => {
        const value = summary.answers && summary.answers[key];
        const values = Array.isArray(value) ? value : (value ? [value] : []);
        values.forEach((item) => {
          counts[item] = (counts[item] || 0) + 1;
        });
      });
      return Object.keys(counts)
        .map((value) => ({ value, count: counts[value] }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
    };

    const buildRows = (fields) => fields
      .map((field) => ({ ...field, results: countValues(field.key) }))
      .filter((field) => field.results.length > 0);

    const onePageSignals = state.summaries.reduce((total, summary) => {
      const answers = normalizeSummaryAnswers(summary);
      const checked = Array.isArray(answers.scope_checks) ? answers.scope_checks : [];
      return total + (checked.length >= 3 ? 1 : 0);
    }, 0);

    return {
      onePageSignals,
      peopleRows: buildRows(PEOPLE_RESULT_FIELDS),
      rows: buildRows(RESULT_FIELDS),
      scopeRows: buildRows(SCOPE_RESULT_FIELDS),
      uvpRows: buildRows(UVP_RESULT_FIELDS),
      visualRows: buildRows(VISUAL_RESULT_FIELDS),
    };
  }, [state.summaries]);

  return (
    <div className="results-panel">
      <h3>Group results so far</h3>
      {state.loading && <p>Loading results...</p>}
      {!state.loading && state.error && <p>{state.error}</p>}
      {!state.loading && !state.error && (
        <>
          <p>{state.summaries.length} response{state.summaries.length === 1 ? "" : "s"} received.</p>
          {rows.rows.length === 0 && rows.uvpRows.length === 0 && rows.scopeRows.length === 0 && rows.peopleRows.length === 0 && rows.visualRows.length === 0 ? (
            <p>No aggregate results are available yet.</p>
          ) : (
            <>
              {rows.uvpRows.length > 0 && (
                <div className="result-group">
                  <h4>Unique Value Proposition</h4>
                  <div className="results-grid">
                    {rows.uvpRows.map((row) => (
                      <div className="result-card" key={row.key}>
                        <div className="result-label">{row.label}</div>
                        {row.results.map((result) => (
                          <div className="result-row" key={result.value}>
                            <span>{result.value}</span>
                            <strong>{result.count}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rows.scopeRows.length > 0 && (
                <div className="result-group">
                  <h4>One-page website direction</h4>
                  <div className="result-card result-card-wide">
                    <div className="result-label">One-page signal</div>
                    <div className="result-row">
                      <span>{rows.onePageSignals} of {state.summaries.length} responses selected three or more one-page signals.</span>
                      <strong>{percent(rows.onePageSignals, state.summaries.length)}%</strong>
                    </div>
                  </div>
                  <div className="results-grid">
                    {rows.scopeRows.map((row) => (
                      <div className="result-card" key={row.key}>
                        <div className="result-label">{row.label}</div>
                        {row.results.map((result) => (
                          <div className="result-row" key={result.value}>
                            <span>{result.value}</span>
                            <strong>{result.count}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rows.peopleRows.length > 0 && (
                <div className="result-group">
                  <h4>Staff and board pages</h4>
                  <div className="results-grid">
                    {rows.peopleRows.map((row) => (
                      <div className="result-card" key={row.key}>
                        <div className="result-label">{row.label}</div>
                        {row.results.map((result) => (
                          <div className="result-row" key={result.value}>
                            <span>{result.value}</span>
                            <strong>{result.count}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rows.visualRows.length > 0 && (
                <div className="result-group">
                  <h4>Visual priorities</h4>
                  <div className="results-grid">
                    {rows.visualRows.map((row) => (
                      <div className="result-card" key={row.key}>
                        <div className="result-label">{row.label}</div>
                        {row.results.map((result) => (
                          <div className="result-row" key={result.value}>
                            <span>{result.value}</span>
                            <strong>{result.count}</strong>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rows.rows.length > 0 && (
                <div className="results-grid">
                  {rows.rows.map((row) => (
                    <div className="result-card" key={row.key}>
                      <div className="result-label">{row.label}</div>
                      {row.results.map((result) => (
                        <div className="result-row" key={result.value}>
                          <span>{result.value}</span>
                          <strong>{result.count}</strong>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function CloseStep({ data }) {
  return (
    <section className="step">
      <StepHeader
        num="✦" label="The Commitment"
        title={<>Your website cannot do <em>everything.</em></>}
      />

      <div className="step-body">
        <div className="exercise">
          <ResultsSnapshot />

          <h3>Where the rest of the content goes</h3>
          <div className="channel-grid">
            {CHANNELS.map(c => (
              <div className="channel-card" key={c.name}>
                <div className="ico">✦</div>
                <div className="name">{c.name}</div>
                <div className="use">{c.use}</div>
              </div>
            ))}
          </div>

          <p>Before adding a page, ask whether the website is the best place for that audience to find it.</p>

          <p className="attribution">
            Adapted from <em>Stop Building Pretty Websites. Start Building Websites That Raise Money.</em> by Harry Martin.
          </p>
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Why the new website can stay <em>focused</em>.</>}
            cite="The whole site"
          >
            <p>A focused site leaves out archives, PDF dumps, and stale press pages.</p>
            <p>Content that belongs elsewhere is routed elsewhere.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ============================================================
   Tweaks panel — unchanged from original
   ============================================================ */
function WorkbookTweaks({ t, setTweak }) {
  return (
    <TweaksPanel title="Workbook Tweaks">
      <TweakSection label="Distribution" />
      <TweakRadio
        label="Mode"
        value={t.mode}
        options={[
          { value: "group", label: "Group" },
          { value: "solo",  label: "Solo" },
        ]}
        onChange={(v) => setTweak("mode", v)}
      />
      <TweakText
        label="Workbook title"
        value={t.orgName}
        placeholder="e.g. Acme Foundation"
        onChange={(v) => setTweak("orgName", v)}
      />
      <TweakText
        label="Sender (you)"
        value={t.senderName}
        placeholder="e.g. Sarah, Board Chair"
        onChange={(v) => setTweak("senderName", v)}
      />
      <TweakText
        label="Deadline"
        value={t.deadline}
        placeholder="Friday, Aug 15"
        onChange={(v) => setTweak("deadline", v)}
      />

      <TweakSection label="Scope" />
      <TweakRadio
        label="Depth"
        value={t.depth}
        options={[
          { value: "full",       label: "All sections" },
          { value: "essentials", label: "Core 4 only" },
          { value: "design",     label: "Design principles only" },
        ]}
        onChange={(v) => setTweak("depth", v)}
      />
      <TweakToggle
        label="Show design notes"
        value={t.showDesignNotes}
        onChange={(v) => setTweak("showDesignNotes", v)}
      />

      <TweakSection label="Appearance" />
      <TweakColor
        label="Accent"
        value={[t.accent]}
        options={[
          ["#e8654a", "#c94e35", "#f4a48f"],
          ["#0b3b7a", "#072452", "#7aa3d9"],
          ["#3f7d58", "#27593a", "#8fbf9f"],
          ["#6b4d80", "#4a3358", "#9b80b3"],
        ]}
        onChange={(arr) => setTweak({
          accent: arr[0],
          accentDeep: arr[1],
          accentSoft: arr[2],
        })}
      />
      <TweakRadio
        label="Density"
        value={t.density}
        options={[
          { value: "compact",     label: "Compact" },
          { value: "comfortable", label: "Comfy" },
          { value: "generous",    label: "Roomy" },
        ]}
        onChange={(v) => setTweak("density", v)}
      />
    </TweaksPanel>
  );
}

/* ============================================================
   App — wires tweaks, persistence, and step routing
   ============================================================ */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const wb = useWorkbook();

  /* Build the full step list including the 10 design principle steps */
  const ALL_STEPS = React.useMemo(() => {
    const principleSteps = DESIGN_PRINCIPLES.map((p, i) => ({
      id: `principle_${p.id}`,
      label: p.label,
      kind: "principle",
      principleId: p.id,
      num: String(i + 9).padStart(2, "0"),
    }));

    return [
      ...STEPS.slice(0, STEPS.findIndex(s => s.kind === "review")),
      { id: "design_intro", label: "Design", kind: "design_intro", num: "08" },
      ...principleSteps,
      { id: "design_brief", label: "Design Brief", kind: "design_brief", num: "17" },
      ...STEPS.slice(STEPS.findIndex(s => s.kind === "review")),
    ];
  }, []);

  /* Filter steps based on depth tweak */
  const activeSteps = React.useMemo(() => {
    if (t.depth === "essentials") {
      return ALL_STEPS.filter(s => ESSENTIALS_STEP_IDS.includes(s.id));
    }
    if (t.depth === "design") {
      return ALL_STEPS.filter(s =>
        s.kind === "cover" ||
        s.kind === "design_intro" ||
        s.kind === "principle" ||
        s.kind === "design_brief" ||
        s.kind === "review"
      );
    }
    return ALL_STEPS;
  }, [t.depth, ALL_STEPS]);

  const [idx, setIdx] = React.useState(() => {
    const stored = parseInt(localStorage.getItem("nonprofit-workbook-v2-idx") || "0", 10);
    return isNaN(stored) ? 0 : Math.min(stored, activeSteps.length - 1);
  });

  React.useEffect(() => {
    if (idx >= activeSteps.length) setIdx(Math.max(0, activeSteps.length - 1));
  }, [activeSteps.length, idx]);

  React.useEffect(() => {
    localStorage.setItem("nonprofit-workbook-v2-idx", String(idx));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const accentStyle = {
    "--coral": t.accent || "#e8654a",
    "--coral-deep": t.accentDeep || "#c94e35",
    "--coral-soft": t.accentSoft || "#f4a48f",
  };

  const step = activeSteps[idx] || activeSteps[0];
  const onNext = () => setIdx(i => Math.min(activeSteps.length - 1, i + 1));
  const onPrev = () => setIdx(i => Math.max(0, i - 1));
  const onDone = () => {
    if (!window.WorkbookFirebase || Object.keys(wb.data).length === 0) {
      alert("Your response is saved locally in this browser.");
      return;
    }

    window.WorkbookFirebase.save(wb.data)
      .then(() => {
        alert("Your response has been saved.");
      })
      .catch((error) => {
        const message = error && (error.code || error.message) ? `\n\n${error.code || error.message}` : "";
        alert(`We could not save to Firebase. Your response is still saved locally in this browser.${message}`);
      });
  };

  const renderStep = () => {
    if (step.kind === "cover")        return <CoverStep onStart={onNext} data={wb.data} set={wb.set} />;
    if (step.kind === "review")       return <ReviewStep data={wb.data} reset={wb.reset} />;
    if (step.kind === "close")        return <CloseStep data={wb.data} />;
    if (step.kind === "design_intro") return <DesignPrinciplesIntroStep />;
    if (step.kind === "design_brief") return <DesignPrinciplesReviewStep data={wb.data} headerNum={step.num} />;
    if (step.kind === "principle") {
      return (
        <PrincipleStep
          principleId={step.principleId}
          data={wb.data}
          set={wb.set}
          note={PRINCIPLE_NOTES[step.principleId]}
          headerNum={step.num}
        />
      );
    }
    switch (step.id) {
      case "premise":  return <PremiseStep />;
      case "uvp":      return <UvpStep      data={wb.data} set={wb.set} />;
      case "onejob":   return <OneJobStep   data={wb.data} set={wb.set} />;
      case "pathways": return <PathwaysStep data={wb.data} set={wb.set} toggle={wb.toggle} />;
      case "scope":    return <ScopeStep    data={wb.data} set={wb.set} toggle={wb.toggle} />;
      case "people":   return <PeopleStep   data={wb.data}              toggle={wb.toggle} />;
      case "show":     return <ShowStep     data={wb.data} set={wb.set} toggle={wb.toggle} />;
      default:         return null;
    }
  };

  return (
    <TweakCtx.Provider value={{ ...t, stepHeaderTotal: activeSteps.length }}>
      <div
        className="app"
        data-notes={t.showDesignNotes ? "on" : "off"}
        data-density={t.density || "comfortable"}
        style={accentStyle}
      >
        <TopBar />
        <Stepper idx={idx} onJump={(i) => setIdx(i)} steps={activeSteps} />
        <main className="main">{renderStep()}</main>
        <FootNav idx={idx} total={activeSteps.length} steps={activeSteps} onPrev={onPrev} onNext={onNext} onDone={onDone} />
        <WorkbookTweaks t={t} setTweak={setTweak} />
      </div>
    </TweakCtx.Provider>
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
