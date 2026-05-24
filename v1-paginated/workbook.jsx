/* global React, ReactDOM */
const { useState, useEffect, useMemo, useRef } = React;

/* ============================================================
   Workbook content (single source of truth)
   ============================================================ */

const STORAGE_KEY = "nonprofit-website-workbook-v1";

const PAGES = [
  { id: "cover",      kind: "cover",   label: "Cover" },
  { id: "premise",    kind: "section", label: "The Premise",         num: "I" },
  { id: "uvp",        kind: "section", label: "Unique Value",        num: "II" },
  { id: "onejob",     kind: "section", label: "One Job",             num: "III" },
  { id: "pathways",   kind: "section", label: "Client Pathways",     num: "IV" },
  { id: "scope",      kind: "section", label: "Scope",               num: "V" },
  { id: "people",     kind: "section", label: "People",              num: "VI" },
  { id: "show",       kind: "section", label: "Show, Don't Tell",    num: "VII" },
  { id: "review",     kind: "review",  label: "Your Answers" },
  { id: "close",      kind: "close",   label: "The Commitment" },
];

/* The prototype the workbook is calibrated against — used in "From the prototype" callouts */
const PROTOTYPE_URL = "https://womens-rights-information-center.vercel.app/";
const PROTOTYPE_NAME = "Women's Rights Information Center";

const UVP_DRILLS = [
  { id: "uvp_problem",  prompt: "What specific problem do we solve better than anyone else?" },
  { id: "uvp_approach", prompt: "What makes our approach more effective?" },
  { id: "uvp_proof",    prompt: "What proof do we have that lives are actually changing because of our work?" },
  { id: "uvp_loss",     prompt: "If our organization disappeared tomorrow, who would feel the loss?" },
  { id: "uvp_diff",     prompt: "What makes us different from any other nonprofit?" },
  { id: "uvp_feel",     prompt: "What single feeling do we want people to walk away with — motivation, hope, urgency, trust, warmth?" },
];

const PRIMARY_GOALS = [
  { id: "donate",   name: "Raise donations",                    sub: "Individual giving, year-end appeals, recurring." },
  { id: "found",    name: "Build credibility with funders",     sub: "Foundations, major donors, institutional support." },
  { id: "enroll",   name: "Enroll participants in programs",    sub: "Sign-ups, intake forms, service access." },
  { id: "volunteer",name: "Recruit volunteers",                 sub: "Hands, hours, expertise from the community." },
  { id: "resource", name: "Share resources with the community", sub: "Education, referrals, downloadable tools." },
];

const SCOPE_CHECKS = [
  "We have a small staff or are a young organization",
  "Our programs are simple enough to explain in 3-4 lines",
  "We rarely update news, events, or program details",
  "We don't have a content owner who can maintain pages weekly",
  "Our primary action is donate, sign up, or contact",
];

const PEOPLE_CHECKS = [
  { group: "staff", items: [
    "Each bio is short, human, and reinforces our UVP — not a résumé",
    "Photos are recent, warm, and consistent in style (not LinkedIn headshots)",
    "We avoid buzzwords like \"passionate change-maker\"",
    "Titles are real, plain-English, and unambiguous",
    "We've named who we serve — not just what we do",
  ]},
  { group: "board", items: [
    "Every name is current — no one who rotated off years ago",
    "Photos for every member (or no photos at all — consistency wins)",
    "Affiliations show stability and community ties",
    "The page signals trust to a funder doing due diligence in 60 seconds",
  ]},
];

const SHOT_LIST_CHECKS = [
  "Our people doing the actual work — not posed at a podium",
  "The people we serve (with permission) — faces, hands, moments",
  "The place — our space, our neighborhood, our table",
  "Outcomes, not infographics — what \"after\" looks like",
  "Behind-the-scenes that makes us human — not stock-photo polish",
];

const DISCOVERY_CHANNELS = [
  "Referral from another social service agency",
  "Referral from a hospital, clinic, or doctor",
  "Referral from a school, college, or counselor",
  "Court, prosecutor's office, or law enforcement",
  "A house of worship or community group",
  "Word of mouth — a friend or former client",
  "Google or another search engine",
  "Social media — Facebook, Instagram, LinkedIn",
  "A printed flyer, brochure, or poster",
  "Walked in off the street",
];

const FIRST_TEN_SECONDS = [
  "Who you are, in one sentence",
  "Whether the services are free or low-cost",
  "Whether contact is confidential",
  "A phone number, visible and clickable",
  "What language(s) you serve in",
  "Hours you're actually reachable",
  "A clear, gentle path for someone in crisis",
  "Reassurance that asking for help is normal here",
];

const TRUST_SIGNALS = [
  "Phone number in the header — clickable on mobile",
  "Hours of operation, in plain text",
  "A second language line if you serve a bilingual community",
  "The word \"confidential\" near the contact information",
  "A physical address that shows you're real and local",
  "An emergency referral (911 / hotline) for crisis moments",
  "Faces of staff, so visitors know who they're calling",
  "Years of service or founding date — a quiet credibility cue",
];

const CHANNELS = [
  { name: "Email newsletter",   use: "Donor updates, impact stories, year-end appeals." },
  { name: "Annual report PDF",  use: "Deep accountability for funders and major donors." },
  { name: "Social channels",    use: "Day-to-day proof, faces, moments." },
  { name: "Direct mail",        use: "Older donor cohorts, planned giving." },
  { name: "Board portal",       use: "Governance documents, minutes, financials." },
  { name: "Program flyers",     use: "Clients & community partners. On paper, where they are." },
];

/* ============================================================
   Persistence hook
   ============================================================ */

function useWorkbookState() {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
  }, [data]);

  const set = (key, val) => setData(d => ({ ...d, [key]: val }));
  const toggle = (key, val) => {
    setData(d => {
      const arr = new Set(d[key] || []);
      if (arr.has(val)) arr.delete(val); else arr.add(val);
      return { ...d, [key]: [...arr] };
    });
  };

  return { data, set, toggle, reset: () => setData({}) };
}

/* ============================================================
   Reusable primitives
   ============================================================ */

function Field({ label, prompt, value, onChange, placeholder, multiline = true }) {
  return (
    <div className="field">
      {label && <label className="field-label">{label}</label>}
      {prompt && <div className="field-prompt">{prompt}</div>}
      {multiline ? (
        <textarea value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} />
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
      <span className="box"></span>
      <span className="text">{children}</span>
    </label>
  );
}

function PickList({ value, onChange, options }) {
  return (
    <div className="pick-list">
      {options.map(o => (
        <label className="pick" key={o.id}>
          <input type="radio" checked={value === o.id} onChange={() => onChange(o.id)} />
          <span className="dot"></span>
          <span className="label">
            <span className="name">{o.name}</span>
            <span className="sub">{o.sub}</span>
          </span>
        </label>
      ))}
    </div>
  );
}

function PageHead({ num, label }) {
  return (
    <div className="page-head">
      <span className="num">{num}</span>
      <span>{label}</span>
      <span className="rule"></span>
      <span>Workbook</span>
    </div>
  );
}

/* "From the prototype" — references the WRIC site to show what the exercise produces.
   The workbook is calibrated to direct the working group toward that design. */
function DesignNote({ title, children, cite }) {
  return (
    <div className="design-note">
      <span className="tag">From the prototype</span>
      <h4>{title}</h4>
      {children}
      <span className="ref">
        See it live: <a href={PROTOTYPE_URL} target="_blank" rel="noopener noreferrer">{PROTOTYPE_NAME}</a>
        {cite ? <> &nbsp;·&nbsp; {cite}</> : null}
      </span>
    </div>
  );
}

/* ============================================================
   Pages
   ============================================================ */

function CoverPage({ onStart }) {
  return (
    <div className="page cover">
      <div className="cover-frame">
        <div className="eyebrow">A Working Guide for Boards & Committees</div>
        <h1 className="display">Before the<br/><em>Pretty Website</em></h1>
        <div className="ornament">✦ ✦ ✦</div>
        <div className="intro">
          <p>Most nonprofit websites are built backwards. The committee picks a template, argues over colors, and writes copy at the end — when every decision is already locked in.</p>
          <p>This workbook flips the order. Before you choose a color, a font, or a designer, you'll do seven exercises that produce something more valuable than any design: <em>clarity about what your website is actually for, and who it is for.</em></p>
          <p>You'll find <em>From the prototype</em> notes throughout, pointing at a real working site we've designed for an organization like yours. Each note shows what a specific exercise produces — not as a template to copy, but as proof that the exercises lead somewhere.</p>
          <p>Take it slowly. Do it together. The questions are not philosophical — they are clarity drills. Your answers save automatically as you go.</p>
        </div>
        <div className="by">— for the working group —</div>
      </div>
    </div>
  );
}

function PremisePage() {
  return (
    <div className="page">
      <PageHead num="I" label="The Premise" />
      <h2 className="section-title">A website is a <em>fundraising engine</em>, not a bulletin board.</h2>
      <p className="lede">Visit ten nonprofit websites and you'll see the pattern instantly: identical layouts, identical slogans, identical feel. It isn't intentional. It's structural.</p>

      <p className="body">Most nonprofits begin in the wrong place — picking colors, templates, menus, and whatever the last intern stitched together. Then they wonder why the site doesn't inspire donors, clarify the mission, or persuade anyone that this organization deserves support over the 1.5 million others in the country.</p>

      <div className="pull">If you want your website actually to work, you have to build it like a marketer — not like a committee.</div>

      <h3>What this workbook will and won't do</h3>
      <p className="body">It <em>will</em> force you to answer the questions that almost every nonprofit website skips. It will give you a document you can hand to a designer, a developer, or your board.</p>
      <p className="body">It <em>won't</em> tell you which template to buy or which colors to use. Those decisions are downstream of everything you're about to write down.</p>

      <div className="note">
        <span className="tag">A small instruction</span>
        Do this with at least three people in the room — staff, leadership, and at least one person who actually touches the work. The right answers only emerge from a real conversation.
      </div>

      <DesignNote title={<>This workbook is calibrated against a <em>real prototype</em>.</>} cite="Open the prototype in a second tab">
        <p>Throughout these pages you'll see “From the prototype” notes that point at specific decisions on the prototype site we've been building. The point isn't that your site should look like that one. The point is that every visible choice on that site is the downstream consequence of an exercise you're about to do.</p>
        <p>Bring the prototype up alongside this workbook. When your group disagrees about a decision, ask which exercise it should have come from — and whether you've actually done that exercise yet.</p>
      </DesignNote>
    </div>
  );
}

function UvpPage({ data, set }) {
  return (
    <div className="page">
      <PageHead num="II" label="Unique Value" />
      <h2 className="section-title">Find your <em>UVP</em> — before anything else.</h2>
      <p className="lede">Your Unique Value Proposition isn't discovered by one person having a solo moment of inspiration. It emerges when the whole team works together to uncover it.</p>

      <div className="warn">
        <span className="tag">Ground rule</span>
        <strong>No one critiques or shuts down ideas during the initial brainstorm.</strong> Every suggestion is welcomed and recorded without judgment. Keep the conversation open until the group has exhausted all possibilities — then refine.
      </div>

      <h3>Six clarity drills</h3>
      <p className="body">Answer in everyday language. Not jargon. Not clinical terms. If your organization were a movie, what would the trailer sound like?</p>

      <div style={{ marginTop: 28 }}>
        {UVP_DRILLS.map((d, i) => (
          <div className="drill" key={d.id}>
            <div className="drill-num">{String(i + 1).padStart(2, "0")}</div>
            <div className="drill-body">
              <div className="field-prompt">{d.prompt}</div>
              <textarea
                value={data[d.id] || ""}
                onChange={e => set(d.id, e.target.value)}
                placeholder="In plain language…"
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginTop: 40 }}>Now draft the trailer</h3>
      <p className="body">Pull the threads above into one or two sentences. Think: <em>"We're the only place in town where a family can get food, counseling, childcare, and job help, all in one place."</em></p>
      <Field
        label="Now draft the trailer"
        value={data.uvp_trailer}
        onChange={v => set("uvp_trailer", v)}
        placeholder="We're the only…"
      />

      <DesignNote title={<>Why the prototype hero says <em>"All in One Place."</em></>} cite="Hero + services grid">
        <p>The prototype doesn't open with a mission statement. It opens with a UVP rendered three ways — a tagline (<em>Safety. Support. Strength.</em>), a one-liner (<em>For women and families navigating challenges in their lives</em>), and a structural promise (<em>All in One Place</em>) that sits above seven service cards.</p>
        <p>The trailer sentence you just drafted is the raw material for that hero. If yours still reads like a mission statement, push it again until it sounds like something a friend would say out loud.</p>
      </DesignNote>
    </div>
  );
}

function OneJobPage({ data, set }) {
  return (
    <div className="page">
      <PageHead num="III" label="One Job" />
      <h2 className="section-title">What is the website's <em>one job?</em></h2>
      <p className="lede">Not: which template looks nice. Not: what color palette feels friendly. Not: should we add back the carousel. (The answer is always no.)</p>

      <p className="body">Before a single design choice is made, decide the website's primary job. Most nonprofits assume the site can do everything — and that is why it ends up doing nothing.</p>

      <div className="pull">Trying to excel at all of them guarantees mediocrity. Pick one.</div>

      <div className="field-label" style={{ marginTop: 32 }}>Our website's primary job is —</div>
      <PickList
        value={data.primary_goal}
        onChange={v => set("primary_goal", v)}
        options={PRIMARY_GOALS}
      />

      <Field
        label="And our secondary job — at most one, and only if it fits inside the UVP"
        value={data.secondary_goal}
        onChange={v => set("secondary_goal", v)}
        placeholder="e.g. share resources with current clients"
      />

      <div className="note">
        <span className="tag">Test it</span>
        Read your primary goal aloud. Then look at your current homepage. Does every element — every button, image, paragraph, and menu item — serve that job? If not, it is in the way.
      </div>

      <DesignNote title={<>Why the prototype keeps saying <em>"Get started with us."</em></>} cite="Hero CTA, services cards, three-paths module">
        <p>Look at the prototype and count the buttons that say some version of <em>Get started with us</em>. Hero. Every service card. The three-paths module. The contact block.</p>
        <p>That repetition isn't a copywriter's mistake — it's the point. The site has one primary job (route a new client into intake) and every section quietly funnels there. Everything else is supporting cast.</p>
      </DesignNote>
    </div>
  );
}

function PathwaysPage({ data, set, toggle }) {
  return (
    <div className="page">
      <PageHead num="IV" label="Client Pathways" />
      <h2 className="section-title">How do clients <em>find</em> you — and what do they need to see first?</h2>
      <p className="lede">Most board conversations skip this question. They assume people will type the org's name into Google. The people who most need your services rarely do.</p>

      <p className="body">The path a frightened, hopeful, or skeptical client takes to your website is shorter and more fragile than you think. They may arrive from a referral slip handed across a desk. From a Facebook post a friend shared. From a court-appointed advocate who said "try this number." They don't have time to wander. They will give your site about ten seconds.</p>

      <div className="pull">Design the website for the person who is scared, in a hurry, and not sure they're in the right place.</div>

      <h3>1. Where do potential clients hear about us?</h3>
      <p className="body">Tick every channel that brings real people to your services today. Be honest — not aspirational.</p>
      <div style={{ marginTop: 14 }}>
        {DISCOVERY_CHANNELS.map((c, i) => (
          <Check key={i} checked={(data.discovery || []).includes(c)} onChange={() => toggle("discovery", c)}>
            {c}
          </Check>
        ))}
      </div>

      <Field
        label="The single biggest source of new clients right now"
        value={data.top_source}
        onChange={v => set("top_source", v)}
        placeholder="e.g. The county prosecutor's office, the local hospital ER, our Spanish-language Facebook page…"
        multiline={false}
      />

      <h3 style={{ marginTop: 40 }}>2. The first ten seconds</h3>
      <p className="body">Imagine a woman in crisis lands on your homepage on her phone, in a parking lot, with one bar of service. Tick everything she <em>must</em> be able to see or find without scrolling far.</p>
      <div className="priority-list" style={{ marginTop: 14 }}>
        {FIRST_TEN_SECONDS.map((c, i) => (
          <Check key={i} checked={(data.first_ten || []).includes(c)} onChange={() => toggle("first_ten", c)}>
            {c}
          </Check>
        ))}
      </div>

      <DesignNote title={<>Why the prototype puts the phone number — <em>twice</em> — above the fold</>} cite="Hero call-bar, English + Spanish lines">
        <p>The hero block on the WRIC site doesn't lead with a donate ask. It leads with two phone numbers — one English, one Spanish — and the hours each is staffed.</p>
        <p>For a person in crisis, a clickable phone number is not a feature. It's the entire reason they came. Everything else (mission, history, gala photos) can wait for visit #2.</p>
      </DesignNote>

      <h3 style={{ marginTop: 40 }}>3. Three pathways, one homepage</h3>
      <p className="body">Different people arrive needing different things. A clean site offers each of them an obvious next step — without making them read about each other's needs.</p>
      <p className="body">Fill in what each kind of visitor needs from you. Keep it short — one sentence per box.</p>

      <div className="paths">
        <div className="path">
          <span className="num">01 · New client</span>
          <span className="who">Someone arriving <em>for the first time</em></span>
          <span className="what">What is the single first step you want them to take?</span>
          <textarea
            value={data.path_new || ""}
            onChange={e => set("path_new", e.target.value)}
            placeholder="e.g. Complete a short, plain-language intake form…"
            rows={3}
          />
        </div>
        <div className="path">
          <span className="num">02 · Learning more</span>
          <span className="who">Someone <em>not ready</em> to ask yet</span>
          <span className="what">What lets them learn before they commit?</span>
          <textarea
            value={data.path_learn || ""}
            onChange={e => set("path_learn", e.target.value)}
            placeholder="e.g. Register for a virtual orientation in English or Spanish…"
            rows={3}
          />
        </div>
        <div className="path">
          <span className="num">03 · Existing client</span>
          <span className="who">Someone <em>already enrolled</em></span>
          <span className="what">Where do they go without getting in the way of new clients?</span>
          <textarea
            value={data.path_existing || ""}
            onChange={e => set("path_existing", e.target.value)}
            placeholder="e.g. A clearly labeled client portal link…"
            rows={3}
          />
        </div>
      </div>

      <DesignNote title={<>Why the prototype has a <em>"Take the first step"</em> module with three paths</>} cite="Section: Get started">
        <p>The three-path block on the WRIC site is the structural answer to this exercise. New clients get the intake form. People still learning get a virtual orientation. Existing clients get a portal link.</p>
        <p>No one is forced through the wrong door. Each path is short, named, and obvious. The board doesn't have to argue about which audience the homepage is "really" for — all three are visibly served, without crowding each other.</p>
      </DesignNote>

      <h3 style={{ marginTop: 40 }}>4. Trust signals — non-negotiable</h3>
      <p className="body">A first-time visitor decides in seconds whether your site is credible enough to trust with their information, their story, or their family's safety. Tick the signals you'll commit to making impossible to miss.</p>
      <div style={{ marginTop: 14 }}>
        {TRUST_SIGNALS.map((c, i) => (
          <Check key={i} checked={(data.trust || []).includes(c)} onChange={() => toggle("trust", c)}>
            {c}
          </Check>
        ))}
      </div>

      <DesignNote title={<>Why the prototype's contact section <em>doesn't bury</em> "Need help right now?"</>} cite="Section: Contact, emergency block">
        <p>At the bottom of the WRIC contact section sits a small, calm block: <em>If you're in immediate danger, call 911. For urgent but non-emergency support, WRIC is here during business hours.</em></p>
        <p>It is not flashy. It does not blink. But it tells a person in crisis exactly what to do — including what the site itself <em>cannot</em> do for them. That honesty is what makes the rest of the site believable.</p>
      </DesignNote>

      <Field
        label="Notes from the room — what surprised us about this section"
        value={data.pathways_notes}
        onChange={v => set("pathways_notes", v)}
        placeholder="What did we learn that we hadn't thought through before?"
      />
    </div>
  );
}

function ScopePage({ data, set, toggle }) {
  const checked = data.scope_checks || [];
  const onePagerLeans = checked.length >= 3;

  return (
    <div className="page">
      <PageHead num="V" label="Scope" />
      <h2 className="section-title">One page, or <em>many?</em></h2>
      <p className="lede">A focused one-pager beats a sprawling, neglected site every single time. The right scope is the one you can actually maintain.</p>

      <p className="body">For smaller or newer organizations, a one-page website forces discipline. No clutter, no outdated content, no endless dropdowns. You can always add pages later.</p>

      <h3>Are you a candidate for a one-pager?</h3>
      <p className="body">Tick every statement that is honestly true about your organization today.</p>

      <div style={{ marginTop: 18 }}>
        {SCOPE_CHECKS.map((c, i) => (
          <Check key={i} checked={checked.includes(c)} onChange={() => toggle("scope_checks", c)}>
            {c}
          </Check>
        ))}
      </div>

      {checked.length > 0 && (
        <div className={onePagerLeans ? "note" : "warn"} style={{ marginTop: 22 }}>
          <span className="tag">Where you land</span>
          {onePagerLeans
            ? "Strong signal: a single-page site is likely the right call. Start with the basics. You can always add pages later."
            : "You lean toward more than one page — but the rule still holds: clarity over complexity. Don't add a page until you can name who maintains it."}
        </div>
      )}

      <h3 style={{ marginTop: 36 }}>If you go one-page, it has only what matters</h3>
      <div style={{ marginTop: 8 }}>
        {[
          "A crystal-clear UVP at the top",
          "Real proof of your impact (not infographics)",
          "A simple explanation of programs",
          "Who you serve and why it matters",
          "A clean, unmistakable Donate or Get Involved button",
        ].map((c, i) => (
          <Check key={i} checked={(data.onepager_checks || []).includes(c)} onChange={() => toggle("onepager_checks", c)}>
            {c}
          </Check>
        ))}
      </div>

      <Field
        label="Notes from the room"
        value={data.scope_notes}
        onChange={v => set("scope_notes", v)}
        placeholder="What does the group think? What are we afraid of cutting?"
      />

      <DesignNote title={<>Why the prototype <em>is</em> a one-pager (with footnotes).</>} cite="Anchor nav, single-scroll layout">
        <p>The prototype reads top-to-bottom as a single page: hero → services → first-step paths → history → people → support → contact. The header links don't take you to new pages — they jump down the same one.</p>
        <p>It is one page on purpose. Easier to maintain, harder to neglect, and impossible for a visitor to get lost in. The only secondary page is a video archive — because that content genuinely doesn't fit, and because it's owned by someone who maintains it.</p>
      </DesignNote>
    </div>
  );
}

function PeoplePage({ data, toggle }) {
  return (
    <div className="page">
      <PageHead num="VI" label="People" />
      <h2 className="section-title">People give to <em>people.</em></h2>
      <p className="lede">A faceless nonprofit is forgettable. A human one isn't. Two pages on your site do more work than the rest combined — staff, and board.</p>

      <p className="body">Donors want to know the organization is credible. Clients want to know it's trustworthy. Funders absolutely check the board page — they look for stability, governance quality, and community ties.</p>

      <h3>The staff page — done right</h3>
      <div style={{ marginTop: 14 }}>
        {PEOPLE_CHECKS[0].items.map((c, i) => (
          <Check key={i} checked={(data.staff_checks || []).includes(c)} onChange={() => toggle("staff_checks", c)}>
            {c}
          </Check>
        ))}
      </div>

      <h3 style={{ marginTop: 36 }}>The board page — done current</h3>
      <p className="body">Not a historical archive of people who rotated off three years ago. Funders do due diligence in sixty seconds. Make those seconds count.</p>
      <div style={{ marginTop: 14 }}>
        {PEOPLE_CHECKS[1].items.map((c, i) => (
          <Check key={i} checked={(data.board_checks || []).includes(c)} onChange={() => toggle("board_checks", c)}>
            {c}
          </Check>
        ))}
      </div>

      <div className="pull">Skip the résumés. Skip the buzzwords. Write short, human bios that reinforce the UVP and show the faces behind the work.</div>

      <DesignNote title={<>Why the prototype shows <em>everyone</em> — with a face.</>} cite="Section: Who we are">
        <p>The prototype lists four leadership profiles with photos, then a full grid of program leaders and support staff (also with photos), then every name on the Board of Trustees — with the chair, vice chair, treasurer, and secretary clearly marked.</p>
        <p>It signals two things at once. To a client: <em>real humans pick up the phone here.</em> To a funder: <em>this organization is governed, current, and accountable.</em> Two audiences, one page, almost no extra copy.</p>
      </DesignNote>
    </div>
  );
}

function ShowPage({ data, set, toggle }) {
  return (
    <div className="page">
      <PageHead num="VII" label="Show, Don't Tell" />
      <h2 className="section-title">Do not write a word — <em>yet.</em></h2>
      <p className="lede">Most committees start writing copy at this stage. Resist. Pick up a camera. Or better, make a shot list and decide how you will visualize your Unique Value Proposition.</p>

      <p className="body">What does your UVP look like? What would visitors see if they could look over your shoulder for a day? Are there high-quality images from your social feeds that show you in action?</p>

      <h3>Shot list — what we need to see</h3>
      <p className="body">Tick what you'll capture, then assign a name and a date to each row.</p>

      <div style={{ marginTop: 14 }}>
        {SHOT_LIST_CHECKS.map((c, i) => (
          <Check key={i} checked={(data.shots || []).includes(c)} onChange={() => toggle("shots", c)}>
            {c}
          </Check>
        ))}
      </div>

      <Field
        label="Who is taking the photos, and by when?"
        value={data.shot_owner}
        onChange={v => set("shot_owner", v)}
        placeholder="e.g. Marisol — first round of photos by Aug 15"
      />

      <Field
        label="The three images we MUST get right (describe them)"
        value={data.must_shots}
        onChange={v => set("must_shots", v)}
        placeholder="1. The Tuesday meal at the community center — wide, warm, faces visible.&#10;2. A staff member with a client — mid-conversation, not posed.&#10;3. ..."
      />

      <div className="warn">
        <span className="tag">Translation rule</span>
        Once the images exist, the copy almost writes itself. Caption first, then expand. If a sentence isn't anchored to something visible, ask whether it belongs on the site at all.
      </div>

      <DesignNote title={<>Why the prototype uses <em>watercolor illustrations</em> alongside photos.</>} cite="Service cards, hero silhouettes">
        <p>Some of the prototype's most prominent images aren't photographs at all — they're soft watercolor illustrations of women in profile, of paths, of leaves and flowers. Why?</p>
        <p>Because a survivor-serving nonprofit can't always show the faces of the people it helps. Photography has consent and safety limits that stock photos can't solve. Watercolor lets the site feel human and warm <em>without</em> putting any client at risk — and it gives the brand a visual signature no template could deliver.</p>
        <p>Your shot list above should be honest about which moments can be photographed at all. The ones that can't — commission an illustrator.</p>
      </DesignNote>
    </div>
  );
}

function ReviewPage({ data }) {
  const get = (k) => (data[k] || "").trim();
  const getList = (k) => data[k] || [];
  const primary = PRIMARY_GOALS.find(g => g.id === data.primary_goal);

  return (
    <div className="page">
      <PageHead num="✦" label="Your Answers" />
      <h2 className="section-title">What you've <em>decided.</em></h2>
      <p className="lede">Read this aloud at your next meeting. Print it, hand it to a designer, or paste it into a brief. The work is the answers — not the website yet.</p>

      <div className="review-section">
        <h4>Unique Value Proposition</h4>
        {UVP_DRILLS.map(d => {
          const v = get(d.id);
          return (
            <div className="review-q" key={d.id}>
              <div className="q">{d.prompt}</div>
              <div className={`a ${v ? "" : "empty"}`}>{v || "— not yet answered —"}</div>
            </div>
          );
        })}
        <div className="review-q">
          <div className="q">The trailer sentence</div>
          <div className={`a ${get("uvp_trailer") ? "" : "empty"}`}>{get("uvp_trailer") || "— not yet drafted —"}</div>
        </div>
      </div>

      <div className="review-section">
        <h4>The website's one job</h4>
        <div className="review-q">
          <div className="q">Primary goal</div>
          <div className={`a ${primary ? "" : "empty"}`}>{primary ? primary.name : "— not yet chosen —"}</div>
        </div>
        <div className="review-q">
          <div className="q">Secondary (if any, must fit the UVP)</div>
          <div className={`a ${get("secondary_goal") ? "" : "empty"}`}>{get("secondary_goal") || "— none —"}</div>
        </div>
      </div>

      <div className="review-section">
        <h4>Client pathways</h4>
        <div className="review-q">
          <div className="q">Where clients hear about us</div>
          <div className={`a ${getList("discovery").length ? "" : "empty"}`}>
            {getList("discovery").length ? getList("discovery").map(s => "• " + s).join("\n") : "— none —"}
          </div>
        </div>
        <div className="review-q">
          <div className="q">Biggest source of new clients today</div>
          <div className={`a ${get("top_source") ? "" : "empty"}`}>{get("top_source") || "— not named —"}</div>
        </div>
        <div className="review-q">
          <div className="q">First ten seconds — what must be visible</div>
          <div className={`a ${getList("first_ten").length ? "" : "empty"}`}>
            {getList("first_ten").length ? getList("first_ten").map(s => "• " + s).join("\n") : "— none —"}
          </div>
        </div>
        <div className="review-q">
          <div className="q">Path for a new client</div>
          <div className={`a ${get("path_new") ? "" : "empty"}`}>{get("path_new") || "— not yet defined —"}</div>
        </div>
        <div className="review-q">
          <div className="q">Path for someone learning more</div>
          <div className={`a ${get("path_learn") ? "" : "empty"}`}>{get("path_learn") || "— not yet defined —"}</div>
        </div>
        <div className="review-q">
          <div className="q">Path for an existing client</div>
          <div className={`a ${get("path_existing") ? "" : "empty"}`}>{get("path_existing") || "— not yet defined —"}</div>
        </div>
        <div className="review-q">
          <div className="q">Trust signals we'll commit to making impossible to miss</div>
          <div className={`a ${getList("trust").length ? "" : "empty"}`}>
            {getList("trust").length ? getList("trust").map(s => "• " + s).join("\n") : "— none —"}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h4>Scope</h4>
        <div className="review-q">
          <div className="q">One-pager signals checked</div>
          <div className={`a ${getList("scope_checks").length ? "" : "empty"}`}>
            {getList("scope_checks").length ? getList("scope_checks").map(s => "• " + s).join("\n") : "— none —"}
          </div>
        </div>
        <div className="review-q">
          <div className="q">Notes from the room</div>
          <div className={`a ${get("scope_notes") ? "" : "empty"}`}>{get("scope_notes") || "— none —"}</div>
        </div>
      </div>

      <div className="review-section">
        <h4>People — staff & board commitments</h4>
        <div className="review-q">
          <div className="q">Staff page standards we'll hold</div>
          <div className={`a ${getList("staff_checks").length ? "" : "empty"}`}>
            {getList("staff_checks").length ? getList("staff_checks").map(s => "• " + s).join("\n") : "— none —"}
          </div>
        </div>
        <div className="review-q">
          <div className="q">Board page standards we'll hold</div>
          <div className={`a ${getList("board_checks").length ? "" : "empty"}`}>
            {getList("board_checks").length ? getList("board_checks").map(s => "• " + s).join("\n") : "— none —"}
          </div>
        </div>
      </div>

      <div className="review-section">
        <h4>Show, don't tell — shot list</h4>
        <div className="review-q">
          <div className="q">Shots we'll capture</div>
          <div className={`a ${getList("shots").length ? "" : "empty"}`}>
            {getList("shots").length ? getList("shots").map(s => "• " + s).join("\n") : "— none —"}
          </div>
        </div>
        <div className="review-q">
          <div className="q">Owner and deadline</div>
          <div className={`a ${get("shot_owner") ? "" : "empty"}`}>{get("shot_owner") || "— not assigned —"}</div>
        </div>
        <div className="review-q">
          <div className="q">The three images we must get right</div>
          <div className={`a ${get("must_shots") ? "" : "empty"}`}>{get("must_shots") || "— not yet defined —"}</div>
        </div>
      </div>

      <div className="export-row">
        <button className="btn btn-primary" onClick={() => window.print()}>Print / Save as PDF</button>
        <button className="btn btn-ghost" onClick={() => {
          const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url; a.download = "workbook-answers.json"; a.click();
          URL.revokeObjectURL(url);
        }}>Download as JSON</button>
        <button className="btn btn-ghost" onClick={() => {
          if (confirm("Clear all your answers? This cannot be undone.")) {
            localStorage.removeItem(STORAGE_KEY);
            location.reload();
          }
        }}>Reset workbook</button>
      </div>
    </div>
  );
}

function ClosePage({ data }) {
  return (
    <div className="page">
      <PageHead num="✦" label="The Commitment" />
      <h2 className="section-title">Your website cannot do <em>everything.</em></h2>
      <p className="lede">It shouldn't. The most damaging instinct in nonprofit communications is the belief that the website is the one place where every audience, every program, and every update must live.</p>

      <p className="body">A website that tries to be a newsletter, an annual report, a board portal, a program flyer, a press kit, and a donor cultivation tool ends up doing none of those things well. The fix is not a bigger website. The fix is the right channel for the right audience.</p>

      <div className="pull">Cut the content. Move it where it actually belongs. Let the website do one job, ruthlessly well.</div>

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

      <p className="body">For every page you're tempted to add — board minutes, program updates, an event archive, an old PDF library — ask first: <em>is the website the best place for this audience to find it?</em> If the honest answer is no, route it to its real home.</p>

      <div className="commitment">
        <div className="seal">Our Pledge</div>
        <h3>What we will not do</h3>
        <p className="body">We will not start with templates, colors, or fonts. We will not write a single line of copy before we know the website's one job. We will not let the homepage become a bulletin board. We will move the content that doesn't belong to the channel where it does.</p>
        <p className="body">Design follows purpose. Purpose follows UVP. UVP follows honesty.</p>

        <div className="sign">
          <div className="sign-line">
            <input type="text" placeholder="signature" defaultValue={data.signed_by || ""} onChange={e => localStorage.setItem("nonprofit-workbook-signer", e.target.value)} />
            <span className="label">For the committee</span>
          </div>
          <div className="sign-line">
            <input type="text" placeholder="date" defaultValue={data.signed_on || ""} />
            <span className="label">Date</span>
          </div>
        </div>
      </div>

      <p className="tiny" style={{ marginTop: 32, textAlign: "center" }}>
        Adapted from <em>Stop Building Pretty Websites. Start Building Websites That Raise Money.</em> by Harry Martin.
      </p>
    </div>
  );
}

/* ============================================================
   Footer nav
   ============================================================ */

function FootNav({ idx, total, pages, onJump, onPrev, onNext }) {
  return (
    <div className="foot-nav">
      <div className="inner">
        <button className="btn btn-ghost" onClick={onPrev} disabled={idx === 0}>‹ Back</button>
        <div className="dots">
          {pages.map((p, i) => (
            <button
              key={p.id}
              className={`dot ${i === idx ? "active" : ""} ${i < idx ? "done" : ""}`}
              onClick={() => onJump(i)}
              aria-label={p.label}
            />
          ))}
        </div>
        <span className="label">{pages[idx].label} · {idx + 1}/{total}</span>
        <button className="btn btn-primary" onClick={onNext} disabled={idx === total - 1}>
          {idx === 0 ? "Begin" : idx === total - 2 ? "Close" : "Next"} ›
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   App
   ============================================================ */

function App() {
  const { data, set, toggle } = useWorkbookState();
  const [idx, setIdx] = useState(() => {
    const stored = parseInt(localStorage.getItem("nonprofit-workbook-page") || "0", 10);
    return isNaN(stored) ? 0 : Math.min(stored, PAGES.length - 1);
  });
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("nonprofit-workbook-page", String(idx));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  const page = PAGES[idx];

  return (
    <div className="app" ref={scrollRef}>
      <div className="masthead">
        <div className="mark">
          <span className="glyph">✦</span>
          <span>Nonprofit Website Workbook</span>
        </div>
        <div className="meta">
          <span>Working Group Edition</span>
          <span><b>Auto-saved</b></span>
        </div>
      </div>

      {page.kind === "cover"   && <CoverPage onStart={() => setIdx(1)} />}
      {page.kind === "section" && page.id === "premise"  && <PremisePage />}
      {page.kind === "section" && page.id === "uvp"      && <UvpPage      data={data} set={set} />}
      {page.kind === "section" && page.id === "onejob"   && <OneJobPage   data={data} set={set} />}
      {page.kind === "section" && page.id === "pathways" && <PathwaysPage data={data} set={set} toggle={toggle} />}
      {page.kind === "section" && page.id === "scope"    && <ScopePage    data={data} set={set} toggle={toggle} />}
      {page.kind === "section" && page.id === "people"   && <PeoplePage   data={data} toggle={toggle} />}
      {page.kind === "section" && page.id === "show"     && <ShowPage     data={data} set={set} toggle={toggle} />}
      {page.kind === "review"  && <ReviewPage data={data} />}
      {page.kind === "close"   && <ClosePage  data={data} />}

      <FootNav
        idx={idx}
        total={PAGES.length}
        pages={PAGES}
        onJump={setIdx}
        onPrev={() => setIdx(i => Math.max(0, i - 1))}
        onNext={() => setIdx(i => Math.min(PAGES.length - 1, i + 1))}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
