/* ============================================================
   Step content components — one per workbook section.
   Each section consumes wizard.jsx primitives and data.jsx content.
   Layout pattern: <StepHeader/> + <div class="step-body"> with
   an <div class="exercise"> column and an <aside class="notes-col">
   column containing one or more <DesignNote/> components.

   Updated: Added 12 web design principles survey (Steps 08–19)
   as a dedicated "Design Brief" phase that feeds into the existing
   scope / brief flow.
   ============================================================ */
/* global React */

/* ============================================================
   DESIGN PRINCIPLES DATA
   12 principles used in the survey steps below.
   ============================================================ */

const DESIGN_PRINCIPLES = [
  {
    id: "focus",
    num: "P1",
    label: "Focus",
    title: "One message wins every time",
    sub: "Your website should do one thing — reinforce your brand and mission. It's not a bulletin board. Every extra thing you add competes with the most important thing.",
  },
  {
    id: "clarity",
    num: "P2",
    label: "Clarity",
    title: "If it needs an explanation, redesign it",
    sub: "A confused visitor leaves. Plain language, simple navigation, and a clear call to action mean clients find help without guessing.",
  },
  {
    id: "trust",
    num: "P3",
    label: "Trust",
    title: "Your website is your first handshake",
    sub: "Clients in need are already anxious. A professional, warm design says \"you are safe here\" before a single word is read.",
  },
  {
    id: "mobile",
    num: "P4",
    label: "Mobile first",
    title: "Your clients are on their phones",
    sub: "Most people in crisis reach for their phone, not a laptop. If your site doesn't work perfectly on a small screen, it fails the people who need it most.",
  },
  {
    id: "onepage",
    num: "P5",
    label: "One page",
    title: "Scroll is better than lost",
    sub: "A single-page site keeps everyone on the same path. Visitors scroll instead of clicking through a maze — and they always know where they are.",
  },
  {
    id: "action",
    num: "P6",
    label: "Action",
    title: "Every page needs one clear next step",
    sub: "A website without a call to action is a dead end. Visitors need to know exactly what to do next — call, apply, donate, or get help.",
  },
  {
    id: "audience",
    num: "P7",
    label: "Audience",
    title: "Design for your most vulnerable visitor",
    sub: "Your site serves clients in crisis, board members reviewing governance, and donors evaluating impact. But if it works for someone in distress on a cheap phone — it works for everyone.",
  },
  {
    id: "simplicity",
    num: "P8",
    label: "Simplicity",
    title: "White space is not wasted space",
    sub: "Crowded pages feel chaotic and untrustworthy. Breathing room signals confidence. If every inch is filled, nothing stands out — and nothing gets done.",
  },
  {
    id: "brand",
    num: "P9",
    label: "Brand",
    title: "Your colors and fonts are your voice",
    sub: "A consistent brand builds recognition. Using 8 fonts and 12 colors looks like a yard sale. Pick one color palette, one or two fonts, and stick to them everywhere.",
  },
  {
    id: "impact",
    num: "P10",
    label: "Impact",
    title: "Show the work, not just the words",
    sub: "\"We helped 847 women last year\" is more powerful than \"We provide comprehensive legal services.\" Show real impact, in plain language.",
  },
  {
    id: "legacy",
    num: "P11",
    label: "Legacy brand",
    title: "Don't throw away what already works",
    sub: "Your blue and white brand and your logo are already recognized by clients, funders, and the community. The goal is to modernize — not replace. Familiarity is a strategic asset you've earned over years.",
  },
  {
    id: "complete",
    num: "P12",
    label: "Homepage completeness",
    title: "The first page tells the whole story",
    sub: "A visitor should never have to dig into other pages to understand who you are, what you do, and how to reach you. Everything essential lives on page one. Secondary pages — videos, calendars, photo galleries — add richness but are never required.",
  },
];

/* ============================================================
   SURVEY QUESTION DATA — keyed per principle
   ============================================================ */

const PRINCIPLE_QUESTIONS = {
  focus: {
    mc: {
      label: "When a visitor lands on your site, what should they feel in the first 5 seconds?",
      key: "focus_feeling",
      options: [
        "Confident they're in the right place",
        "Overwhelmed with options",
        "Curious to explore everything",
        "Immediately know how to get help",
      ],
    },
  },
  clarity: {
    uvp: {
      label: "Which of these homepage headlines works best?",
      key: "clarity_headline",
      options: [
        { title: '"Free legal help for women"', desc: "Clear, direct, specific" },
        { title: '"Empowering communities through integrated support systems"', desc: "Vague, jargon-heavy" },
        { title: '"WRIC: Your partner in justice"', desc: "Brand-forward but unclear" },
        { title: '"Get the legal help you deserve — today"', desc: "Action-focused, urgent" },
      ],
    },
    scale: {
      label: "How many clicks should it take a client to find help?",
      key: "clarity_clicks",
      min: 1, max: 5, leftLabel: "1 click", rightLabel: "5+ clicks", defaultVal: 2,
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
        "Certifications and awards",
      ],
    },
    rank: {
      label: "Rank these trust signals for your audience (drag to reorder)",
      key: "trust_rank",
      items: [
        "Professional photography",
        "Privacy and confidentiality notice",
        "Funder and partner logos",
        "Years of service",
      ],
    },
  },
  mobile: {
    uvp: {
      label: "Where are your clients most likely discovering your website?",
      key: "mobile_device",
      options: [
        { title: "Phone", desc: "On the go, in crisis, limited time" },
        { title: "Laptop or desktop", desc: "Office or home setting" },
        { title: "Tablet", desc: "Shared device, library" },
        { title: "I don't know", desc: "We haven't measured" },
      ],
    },
    scale: {
      label: "How important is it that your site works perfectly on a phone?",
      key: "mobile_importance",
      min: 1, max: 5, leftLabel: "Nice to have", rightLabel: "Absolutely critical", defaultVal: 4,
    },
  },
  onepage: {
    mc: {
      label: "What's your gut reaction to a one-page scrolling website?",
      key: "onepage_reaction",
      options: [
        "Modern and clean",
        "Missing information",
        "Easy to use",
        "Too simple for a nonprofit",
        "Perfect for clients in crisis",
      ],
    },
    mc2: {
      label: "Which sections belong on your one-pager? (pick all that apply)",
      key: "onepage_sections",
      multi: true,
      options: [
        "Mission and who we serve",
        "Services at a glance",
        "How to get help",
        "Donate",
        "Contact and location",
        "News and events",
        "Staff directory",
        "Board of directors",
      ],
    },
  },
  action: {
    uvp: {
      label: "What is the single most important action a visitor should take?",
      key: "action_cta",
      options: [
        { title: "Call us now", desc: "Immediate connection" },
        { title: "Apply for services", desc: "Start the intake process" },
        { title: "Donate", desc: "Support the mission" },
        { title: "Get in touch", desc: "Start a conversation" },
      ],
    },
  },
  audience: {
    rank: {
      label: "Rank your audiences by who the website should serve first (drag to reorder)",
      key: "audience_rank",
      items: [
        "Clients seeking services",
        "Donors and funders",
        "Community partners",
        "Media and press",
        "Board members",
      ],
    },
  },
  simplicity: {
    uvp: {
      label: "Which describes your current or ideal website?",
      key: "simplicity_style",
      options: [
        { title: "Clean and minimal", desc: "Lots of space, big clear text, one thing at a time" },
        { title: "Information-rich", desc: "Everything visible, comprehensive, detailed" },
        { title: "Balanced", desc: "Core info up front, depth available if needed" },
        { title: "News-style", desc: "Always updated, content-forward, dynamic" },
      ],
    },
  },
  brand: {
    mc: {
      label: "Which tone should your visual brand communicate?",
      key: "brand_tone",
      options: [
        "Warm and welcoming",
        "Authoritative and professional",
        "Bold and activist",
        "Calm and safe",
        "Hopeful and empowering",
      ],
    },
    mc2: {
      label: "How many colors should define your brand online?",
      key: "brand_colors",
      options: [
        "1–2 core colors",
        "3–4 colors",
        "5+ colors",
        "No strong preference",
      ],
    },
    rank: {
      label: "Rank these brand elements by importance (drag to reorder)",
      key: "brand_rank",
      items: [
        "Logo placement",
        "Color consistency",
        "Font choice",
        "Photography style",
      ],
    },
  },
  impact: {
    uvp: {
      label: "Which impact statement is more compelling?",
      key: "impact_statement",
      options: [
        { title: '"847 women helped last year"', desc: "Specific, measurable, credible" },
        { title: '"Comprehensive legal services for women"', desc: "Descriptive but vague" },
        { title: "A client's story in her own words", desc: "Emotional, personal, relatable" },
        { title: "A visual chart of outcomes", desc: "Data-driven, board-friendly" },
      ],
    },
  },
  legacy: {
    uvp: {
      label: "Your current brand colors are blue and white. What should happen to them?",
      key: "legacy_colors",
      options: [
        { title: "Keep them exactly as they are", desc: "Consistency above all — don't change a thing" },
        { title: "Refine them slightly", desc: "Same family, modernized shades for screens" },
        { title: "Add an accent color", desc: "Blue and white stay primary, a warm tone supports" },
        { title: "Start fresh", desc: "New identity for a new chapter" },
      ],
    },
    uvp2: {
      label: "Your current logo — what should the new site do with it?",
      key: "legacy_logo",
      options: [
        { title: "Use it prominently — it's recognizable", desc: "Front and center, hero placement" },
        { title: "Standard nav placement", desc: "Top left, professional, consistent with norms" },
        { title: "Refresh the logo, keep the spirit", desc: "Modernize without losing recognition" },
        { title: "New logo entirely", desc: "A clean break with the past" },
      ],
    },
    mc2: {
      label: "How would you describe the goal of the redesign?",
      key: "legacy_goal",
      options: [
        "Polish what we have",
        "Same brand, better experience",
        "Modernize without losing recognition",
        "Signal a new era for the organization",
        "Complete fresh start",
      ],
    },
  },
  complete: {
    mc: {
      label: "Which pages belong beyond the homepage — as extras, not essentials? (pick all that apply)",
      key: "complete_extra",
      multi: true,
      options: [
        "Video library",
        "Event calendar",
        "Photo gallery",
        "Gala and fundraiser recaps",
        "Annual reports",
        "Board meeting minutes",
        "Staff directory",
        "Press coverage",
        "Newsletter archive",
      ],
    },
    rank: {
      label: "Rank the sections of the homepage in the order a visitor should encounter them (drag to reorder)",
      key: "complete_order",
      items: [
        "Hero — mission and call to action",
        "Who we serve",
        "Our services",
        "Our impact",
        "Client story",
        "Funders and partners",
        "Donate",
        "Contact and location",
      ],
    },
    uvp: {
      label: "What's the right relationship between the homepage and the extra pages?",
      key: "complete_relationship",
      options: [
        { title: "Homepage is the whole story", desc: "Extra pages are a bonus — never required" },
        { title: "Homepage is the front door", desc: "Other pages complete the picture" },
        { title: "All pages share equal weight", desc: "Visitors explore freely in any order" },
        { title: "Different pages for different audiences", desc: "Clients, donors, and board get separate paths" },
      ],
    },
  },
};

/* ============================================================
   SHARED SURVEY PRIMITIVES
   Reusable question components used across all 12 principle steps.
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
              title={<>Why this matters for <em>WRIC.</em></>}
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
   Shown before the 12-principle survey begins.
   ============================================================ */
function DesignPrinciplesIntroStep() {
  return (
    <section className="step">
      <StepHeader
        num="08"
        label="Design Principles"
        title={<>Twelve things to know about <em>good web design.</em></>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>Answer the design questions before choosing colors, layouts, or page structure.</p>

          <h3>The twelve principles</h3>
          <div className="principles-index">
            {DESIGN_PRINCIPLES.map(p => (
              <div className="principle-index-item" key={p.id}>
                <span className="principle-index-num">{p.num.replace("P", "")}</span>
                <div>
                  <strong>{p.label}</strong>
                  <span className="principle-index-title"> — {p.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>These principles are calibrated against the <em>WRIC prototype.</em></>}
            cite="Open it side-by-side"
            hero={true}
          >
            <p>Every principle points to a decision already made in the live prototype at the link above.</p>
            <p>Your job is not to critique the prototype — it's to confirm, refine, or redirect it.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ============================================================
   DESIGN PRINCIPLES REVIEW STEP
   Summarizes all 12 principle responses.
   ============================================================ */
function DesignPrinciplesReviewStep({ data }) {
  const get = (k) => {
    const v = data[k];
    if (Array.isArray(v)) return v.join(", ") || "— not answered —";
    if (v !== undefined && v !== "") return String(v);
    return "— not answered —";
  };

  const summaries = [
    { label: "First impression feeling", key: "focus_feeling" },
    { label: "Best headline choice", key: "clarity_headline" },
    { label: "Clicks to find help", key: "clarity_clicks" },
    { label: "Top trust signals", key: "trust_signals" },
    { label: "Trust signal ranking", key: "trust_rank" },
    { label: "Primary device for clients", key: "mobile_device" },
    { label: "Mobile priority score", key: "mobile_importance" },
    { label: "Reaction to one-page design", key: "onepage_reaction" },
    { label: "Sections on the one-pager", key: "onepage_sections" },
    { label: "Primary call to action", key: "action_cta" },
    { label: "Audience priority ranking", key: "audience_rank" },
    { label: "Ideal design style", key: "simplicity_style" },
    { label: "Brand tone", key: "brand_tone" },
    { label: "Number of brand colors", key: "brand_colors" },
    { label: "Brand element ranking", key: "brand_rank" },
    { label: "Most compelling impact format", key: "impact_statement" },
    { label: "Blue and white brand decision", key: "legacy_colors" },
    { label: "Logo decision", key: "legacy_logo" },
    { label: "Redesign goal", key: "legacy_goal" },
    { label: "Pages beyond the homepage", key: "complete_extra" },
    { label: "Homepage section order", key: "complete_order" },
    { label: "Homepage vs extra pages relationship", key: "complete_relationship" },
  ];

  return (
    <section className="step">
      <StepHeader
        num="✦"
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

        <div className="export-row">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>
            Print / Save as PDF
          </button>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   DESIGN NOTES — per principle, used inside PrincipleStep
   ============================================================ */
const PRINCIPLE_NOTES = {
  focus: {
    title: <>Why the prototype should open with <em>one thing.</em></>,
    cite: "Hero section",
    body: <p>The WRIC prototype leads with mission, then immediately routes to services. There is no news ticker, no event list, no announcements. One job: connect a woman who needs our services.</p>,
  },
  clarity: {
    title: <>Why a section says <em>"All in One Place."</em></>,
    cite: "Hero + services grid",
    body: <p>The prototype should open with a tagline and a one-line audience promise. If it sounds like a mission statement, make it plainer. Plain language is not dumbing down — it's clearing it up.</p>,
  },
  trust: {
    title: <>Why the phone number sits in the hero — <em>twice.</em></>,
    cite: "Hero call-bar · English + Spanish",
    body: <p>The WRIC hero leads with English and Spanish phone numbers, plus staffed hours. For someone in crisis, that may be the whole reason they came. Credibility starts before the scroll.</p>,
  },
  mobile: {
    title: <>The prototype is built <em>phone-first.</em></>,
    cite: "Responsive layout",
    body: <p>Every layout decision in the prototype was tested on a 375px screen first. Tap targets are large. The phone number is a live link. Text is legible at arm's length.No .PDFs and long signup forms.</p>,
  },
  onepage: {
    title: <>The prototype <em>is</em> a one-pager (with footnotes).</>,
    cite: "Anchor nav · single-scroll layout",
    body: <p>The prototype runs as one long page: hero, services, pathways, history, people, support, and contact. It is easier to maintain and harder to neglect. Secondary pages (videos, gallaries and calander) exist to augment the homepage, not replace it.</p>,
  },
  action: {
    title: <>Why the prototype keeps saying <em>"Get started with us."</em></>,
    cite: "Hero CTA · service cards · contact",
    body: <p>The prototype repeats <em>Get started with us</em> in the hero, service cards, pathway block, and contact section. That repetition is the point: every section routes a new client toward intake.</p>,
  },
  audience: {
    title: <>The <em>"Take the first step"</em> module is the structural answer.</>,
    cite: "Get started · three-path block",
    body: <><p>New clients get intake. People still learning get orientation. Existing clients get a portal.</p><p>Each audience gets a door without crowding the others.</p></>,
  },
  simplicity: {
    title: <>Why the prototype uses <em>generous spacing.</em></>,
    cite: "Section rhythm",
    body: <p>Each section of the prototype breathes. Content is never wall-to-wall. White space is not emptiness — it is editorial judgment about what matters enough to stand alone.</p>,
  },
  brand: {
    title: <>The prototype uses <em>two colors and two fonts.</em></>,
    cite: "Global stylesheet",
    body: <p>Navy and white carry the brand. Those colors are iconic for WRIC A warm coral accent marks calls to action. One serif for headlines, one sans-serif for body. Consistency is credibility. Images add color.</p>,
  },
  impact: {
    title: <>Why the prototype leads with <em>numbers and a story.</em></>,
    cite: "Impact block",
    body: <p>The prototype shows client counts, case outcomes, and a short anonymized testimonial side by side. Numbers build donor trust. Stories build human connection. Both belong on the page.</p>,
  },
  legacy: {
    title: <>The prototype kept <em>blue and white</em> on purpose.</>,
    cite: "Color palette · logo placement",
    body: <><p>Funders and major donors associate your brand colors with credibility and stability. Changing them can create doubt — even if the new colors are objectively better.</p><p>The prototype modernizes the palette without abandoning it.</p></>,
  },
  complete: {
    title: <>The contact section doesn't bury <em>"Need help right now?"</em></>,
    cite: "Contact · emergency block",
    body: <><p>The homepage answers every essential question: who you are, what you do, who you serve, how to get help, how to give, and how to reach you.</p><p>Secondary pages add the gala photos, the video library, and the event calendar — for people who are already engaged, not for people who are still deciding.</p></>,
  },
};

/* ============================================================
   EXISTING STEPS — unchanged from original
   ============================================================ */

/* ---------- 00 · Cover ---------- */
function CoverStep({ onStart, data, set }) {
  const t = useTweakValues();
  const solo = t.mode === "solo";
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
              ? <>Your honest answers help shape the brief.</>
              : <>Most nonprofit websites start with layout and colors. This workbook starts with purpose.</>}
          </p>
          {!solo && (
            <p className="deck">
              First, decide what the site needs to do. Then turn those decisions into <em>a brief.</em>
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
              <span className="v">~45 minutes</span>
            </div>
            <div className="item">
              <span className="k">Output</span>
              <span className="v">A printable brief</span>
            </div>
            <div className="item">
              <span className="k">{t.deadline ? "Due by" : "Calibrated to"}</span>
              <span className="v">{t.deadline || "A live prototype"}</span>
            </div>
          </div>

          <div className="actions">
            <button type="button" className="btn btn-primary" onClick={onStart}>
             Start here →
            </button>
            {t.showDesignNotes && (
              <a href={PROTOTYPE_URL} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                Open the prototype in a new tab ↗
              </a>
            )}
          </div>
        </div>

        <div className="cover-art">
          <img src="./assets/hero-women.jpeg" alt="Watercolor portraits of women in profile, layered in shades of blue and teal." />
          <span className="credit">Prototype hero · WRIC</span>
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
        title={<>A website is a <em>fundraising engine</em>, not a bulletin board.</>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>Before choosing a design, agree on what the website needs to accomplish. It should help donors give, help clients seek services, and help the wider community understand the mission.</p>

          <h3>What this workbook does</h3>
          <p>This workbook turns those decisions into a simple brief, so the website can work alongside social media, email, brochures, and advertising instead of trying to replace them.</p>
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>This workbook is calibrated against a <em>real site</em>.</>}
            cite="Open it side-by-side"
            hero={true}
          >
            <p>The notes point to decisions from the Women's Rights Information Center prototype.</p>
          </DesignNote>
        </aside>
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
        title={<>Find your <em>UVP</em> — before anything else.</>}
      />
      <div className="step-body">
        <div className="exercise">
          {solo ? (
            <div className="warn">
              <span className="tag">Ground rule</span>
              <strong>Answer first, refine later.</strong>
            </div>
          ) : (
            <div className="warn">
              <span className="tag">Ground rule</span>
              <strong>No critiques during the first pass.</strong> Capture ideas first, refine after.
            </div>
          )}

          <h3>Six clarity drills</h3>
          <p>Choose the answer that feels closest. The group can compare patterns later.</p>

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
            <p>The strongest homepage message is usually short, direct, and useful to the visitor.</p>
            <p>If the answer sounds like a mission statement, make it plainer.</p>
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
  return (
    <section className="step">
      <StepHeader
        num="04" label="Client Pathways"
        title={<>How do clients <em>find</em> you — and what do they need to see first?</>}
      />
      <div className="step-body">
        <div className="exercise">
          <h3>1 · Where do potential clients hear about us?</h3>
          <p>Tick the channels that bring people to your services now.</p>
          <CheckList items={DISCOVERY_CHANNELS} selected={data.discovery || []} onToggle={v => toggle("discovery", v)} />

          <h3>2 · The first ten seconds</h3>
          <p>When viewing our website on a phone, what should be visible right away?</p>
          <CheckList items={FIRST_TEN_SECONDS} selected={data.first_ten || []} onToggle={v => toggle("first_ten", v)} />

          <h3>3 · Three pathways, one homepage</h3>
          <p>Choose the actions each audience should be able to take.</p>
          <div className="paths">
            <div className="path">
              <span className="num">01 · New client</span>
              <span className="who">Someone arriving <em>for the first time</em></span>
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
          <p>Tick the signals visitors should not have to hunt for.</p>
          <CheckList items={TRUST_SIGNALS} selected={data.trust || []} onToggle={v => toggle("trust", v)} />
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
                : "You may need more than one page. Add pages only when someone owns them."}
            </div>
          )}

          <h3>If you go one-page, it has only what matters</h3>
          <CheckList items={ONEPAGER_CHECKS} selected={data.onepager_checks || []} onToggle={v => toggle("onepager_checks", v)} single />
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>A focused site is easier to <em>use and maintain.</em></>}
            cite="Scope strategy"
          >
            <p>A smaller site can still feel complete when the most important information is organized clearly.</p>
            <p>Add extra pages only when they have a real audience and someone responsible for keeping them current.</p>
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
          <p>Before writing copy, decide what the site needs to show. What does your UVP look like in real life?</p>

          <h3>Shot list — what we need to see</h3>
          <CheckList items={SHOT_LIST} selected={data.shots || []} onToggle={v => toggle("shots", v)} single />

          <Field
            label="Who is taking the photos, and by when?"
            value={data.shot_owner}
            onChange={v => set("shot_owner", v)}
            placeholder="e.g. Marisol — first round of photos by Aug 15"
            multiline={false}
          />

          <Field
            label="The three images we MUST get right (describe them)"
            value={data.must_shots}
            onChange={v => set("must_shots", v)}
            placeholder={"1. The Tuesday meal at the community center — wide, warm, faces visible.\n2. A staff member with a client — mid-conversation, not posed.\n3. …"}
            rows={5}
          />
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
  const t = useTweakValues();
  const get = (k) => (data[k] || "").trim();
  const getList = (k) => data[k] || [];
  const goalRank = Array.isArray(data.primary_goal_rank) ? data.primary_goal_rank : [];
  const rankedGoals = goalRank
    .map(id => PRIMARY_GOALS.find(g => g.id === id))
    .filter(Boolean);
  const primary = rankedGoals[0] || PRIMARY_GOALS.find(g => g.id === data.primary_goal);
  const name = get("respondent_name");
  const role = get("respondent_role");
  const initials = name ? name.split(/\s+/).map(s => s[0]).join("").slice(0, 2).toUpperCase() : "";

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
        {t.mode === "solo" && name && (
          <div className="respondent-badge">
            <span className="avatar">{initials || "?"}</span>
            <span>Response from <strong>{name}</strong>{role ? <>, {role}</> : null}</span>
          </div>
        )}

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
          <QA q="Where clients hear about us" a={getList("discovery").map(s => "• " + s).join("\n")} empty="— none —" />
          <QA q="First ten seconds — what must be visible" a={getList("first_ten").map(s => "• " + s).join("\n")} empty="— none —" />
          <QA q="Path for a new client" a={get("path_new_action")} empty="— none —" />
          <QA q="Path for a potential donor" a={get("path_donor_action")} empty="— none —" />
          <QA q="Path for an existing client" a={get("path_existing_action")} empty="— none —" />
          <QA q="Trust signals we'll commit to" a={getList("trust").map(s => "• " + s).join("\n")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>Scope</h4>
          <QA q="One-pager signals checked" a={getList("scope_checks").map(s => "• " + s).join("\n")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>People — staff & board commitments</h4>
          <QA q="Staff page standards we'll hold" a={getList("staff_checks").map(s => "• " + s).join("\n")} empty="— none —" />
          <QA q="Board page standards we'll hold" a={getList("board_checks").map(s => "• " + s).join("\n")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>Show, don't tell — shot list</h4>
          <QA q="Shots we'll capture" a={getList("shots").map(s => "• " + s).join("\n")} empty="— none —" />
          <QA q="Owner and deadline" a={get("shot_owner")} empty="— not assigned —" />
          <QA q="The three images we must get right" a={get("must_shots")} empty="— not yet defined —" />
        </div>

        <div className="review-section">
          <h4>Design principles — group consensus</h4>
          <DesignPrinciplesReviewStep data={data} />
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
  { key: "primary_goal", label: "Primary website job" },
  { key: "uvp_problem", label: "Core problem" },
  { key: "uvp_approach", label: "Most effective approach" },
  { key: "path_new_action", label: "New client path" },
  { key: "path_donor_action", label: "Potential donor path" },
  { key: "path_existing_action", label: "Existing client path" },
  { key: "action_cta", label: "Primary call to action" },
  { key: "legacy_goal", label: "Redesign goal" },
  { key: "complete_relationship", label: "Homepage relationship" },
];

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
      .catch(() => {
        if (mounted) {
          setState({ error: "Results are not available yet. Check Firebase Auth and database rules.", loading: false, summaries: [] });
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

    return RESULT_FIELDS
      .map((field) => ({ ...field, results: countValues(field.key) }))
      .filter((field) => field.results.length > 0);
  }, [state.summaries]);

  return (
    <div className="results-panel">
      <h3>Group results so far</h3>
      {state.loading && <p>Loading results...</p>}
      {!state.loading && state.error && <p>{state.error}</p>}
      {!state.loading && !state.error && (
        <>
          <p>{state.summaries.length} response{state.summaries.length === 1 ? "" : "s"} received.</p>
          {rows.length === 0 ? (
            <p>No aggregate results are available yet.</p>
          ) : (
            <div className="results-grid">
              {rows.map((row) => (
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
            title={<>Why the prototype site is <em>short</em>.</>}
            cite="The whole site"
          >
            <p>The prototype leaves out archives, PDF dumps, and stale press pages.</p>
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

  /* Build the full step list including the 12 design principle steps */
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
      { id: "design_brief", label: "Design Brief", kind: "design_brief", num: "21" },
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

  const renderStep = () => {
    if (step.kind === "cover")        return <CoverStep onStart={onNext} data={wb.data} set={wb.set} />;
    if (step.kind === "review")       return <ReviewStep data={wb.data} reset={wb.reset} />;
    if (step.kind === "close")        return <CloseStep data={wb.data} />;
    if (step.kind === "design_intro") return <DesignPrinciplesIntroStep />;
    if (step.kind === "design_brief") return <DesignPrinciplesReviewStep data={wb.data} />;
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
        <FootNav idx={idx} total={activeSteps.length} steps={activeSteps} onPrev={onPrev} onNext={onNext} />
        <WorkbookTweaks t={t} setTweak={setTweak} />
      </div>
    </TweakCtx.Provider>
  );
}

/* Mount */
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
