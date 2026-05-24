/* ============================================================
   Step content components — one per workbook section.
   Each section consumes wizard.jsx primitives and data.jsx content.
   Layout pattern: <StepHeader/> + <div class="step-body"> with
   an <div class="exercise"> column and an <aside class="notes-col">
   column containing one or more <DesignNote/> components.
   ============================================================ */
/* global React */

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

          {solo && (
            <div className="respondent-card">
              <div className="head">
                Your name & role
                {t.senderName && <span className="sender">— requested by {t.senderName}</span>}
              </div>
              <div className="row">
                <label>
                  Your name
                  <input type="text" value={data.respondent_name || ""}
                         onChange={e => set("respondent_name", e.target.value)}
                         placeholder="Jane Q. Trustee" />
                </label>
                <label>
                  Your role at WRIC
                  <input type="text" value={data.respondent_role || ""}
                         onChange={e => set("respondent_role", e.target.value)}
                         placeholder="Board Vice Chair" />
                </label>
              </div>
            </div>
          )}

          <div className="meta-row">
            <div className="item">
              <span className="k">Format</span>
              <span className="v">7 sections</span>
            </div>
            <div className="item">
              <span className="k">Time</span>
              <span className="v">~30 minutes</span>
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
  const t = useTweakValues();
  const solo = t.mode === "solo";
  return (
    <section className="step">
      <StepHeader
        num="01" label="Premise"
        title={<>A website is a <em>fundraising engine</em>, not a bulletin board.</>}
        lede={<>Before you choose a design, agree on what the website needs to accomplish.</>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>A strong nonprofit website helps different audiences take the right next step. It can inspire donors to give, motivate potential clients to seek services, and help the wider community feel connected to the mission.</p>

          <div className="pull">The website does not work alone. Social media, email campaigns, brochures, and advertising each have their own role; the goal is to make them work together.</div>

          <h3>What this workbook does</h3>
          <p>This workbook turns those decisions into a simple brief, so the site can be planned around purpose instead of preferences.</p>
          
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
        lede={solo
          ? <>Answer for yourself first. The group can compare patterns later.</>
          : <>Your Unique Value Proposition gets clearer when the team names it together.</>}
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
          <p>Use everyday language. No jargon.</p>

          <div className="drills">
            {UVP_DRILLS.map((d, i) => (
              <div className="drill" key={d.id}>
                <div className="drill-head">
                  <span className="drill-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="prompt">{d.prompt}</span>
                </div>
                <textarea
                  value={data[d.id] || ""}
                  onChange={e => set(d.id, e.target.value)}
                  placeholder="In plain language…"
                  rows={3}
                />
              </div>
            ))}
          </div>

        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Why the hero says <em>"All in One Place."</em></>}
            cite="Hero + services grid"
          >
            <p>The prototype opens with a tagline, a one-line audience promise, and <em>All in One Place</em> above the service cards.</p>
            <p>Your trailer sentence is raw material for that hero. If it sounds like a mission statement, make it plainer.</p>
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
        lede={<>Before design, decide the site's primary job.</>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>Most nonprofit sites try to serve every audience at once. Rank the jobs from most important to least important.</p>
          <div className="pull">The top item becomes the website's primary job.</div>

          <h3>Rank the website jobs</h3>
          <p>Drag the cards into order, or use the up/down buttons.</p>
          <RankedGoalList value={goalRank} onChange={setGoalRank} options={PRIMARY_GOALS} />

          <div className="note">
            <span className="tag">Test it</span>
            Does every button, image, paragraph, and menu item serve that job?
          </div>
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Why the prototype keeps saying <em>"Get started with us."</em></>}
            cite="Hero CTA · service cards · contact"
          >
            <p>The prototype repeats <em>Get started with us</em> in the hero, service cards, pathway block, and contact section.</p>
            <p>That repetition is the point: every section routes a new client toward intake.</p>
          </DesignNote>
        </aside>
      </div>
    </section>
  );
}

/* ---------- 04 · Client Pathways ---------- */
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

          <Field
            label="The single biggest source of new clients right now"
            value={data.top_source}
            onChange={v => set("top_source", v)}
            placeholder="e.g. The county prosecutor's office, the local hospital ER…"
            multiline={false}
          />

          <h3>2 · The first ten seconds</h3>
          <p>What must be visible right away on a phone?</p>
          <CheckList items={FIRST_TEN_SECONDS} selected={data.first_ten || []} onToggle={v => toggle("first_ten", v)} />

          <h3>3 · Three pathways, one homepage</h3>
          <p>Give each audience a clear next step. One sentence per box.</p>
          <div className="paths">
            <div className="path">
              <span className="num">01 · New client</span>
              <span className="who">Someone arriving <em>for the first time</em></span>
              <span className="what">What is the single first step you want them to take?</span>
              <textarea value={data.path_new || ""} onChange={e => set("path_new", e.target.value)} placeholder="e.g. Complete a short intake form…" rows={3} />
            </div>
            <div className="path">
              <span className="num">02 · Learning more</span>
              <span className="who">Someone <em>not ready</em> to ask yet</span>
              <span className="what">What lets them learn before they commit?</span>
              <textarea value={data.path_learn || ""} onChange={e => set("path_learn", e.target.value)} placeholder="e.g. Register for a virtual orientation…" rows={3} />
            </div>
            <div className="path">
              <span className="num">03 · Existing client</span>
              <span className="who">Someone <em>already enrolled</em></span>
              <span className="what">Where do they go without crowding new clients?</span>
              <textarea value={data.path_existing || ""} onChange={e => set("path_existing", e.target.value)} placeholder="e.g. A clearly labeled client portal link…" rows={3} />
            </div>
          </div>

          <h3>4 · Trust signals — non-negotiable</h3>
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

          <Field
            label="Notes from the room"
            value={data.scope_notes}
            onChange={v => set("scope_notes", v)}
            placeholder="What does the group think? What are we afraid of cutting?"
          />
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>The prototype <em>is</em> a one-pager (with footnotes).</>}
            cite="Anchor nav · single-scroll layout"
          >
            <p>The prototype runs as one long page: hero, services, pathways, history, people, support, and contact.</p>
            <p>It is easier to maintain and harder to neglect.</p>
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
        lede={<>People need to see who is behind the work.</>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>Donors, clients, and funders all look for credibility and trust.</p>

          <h3>The staff page — done right</h3>
          <CheckList items={STAFF_CHECKS} selected={data.staff_checks || []} onToggle={v => toggle("staff_checks", v)} single />

          <h3>The board page — done current</h3>
          <p>Keep it current. Funders check.</p>
          <CheckList items={BOARD_CHECKS} selected={data.board_checks || []} onToggle={v => toggle("board_checks", v)} single />

          <div className="pull">Use short, human bios that show the faces behind the work.</div>
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>The prototype shows <em>everyone</em> — with a face.</>}
            cite="Who we are · Board of Trustees"
          >
            <p>The prototype shows leadership, staff, and trustees clearly, with roles marked.</p>
            <p>Clients see real people. Funders see accountability.</p>
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
        lede={<>Before writing copy, decide what the site needs to show.</>}
      />
      <div className="step-body">
        <div className="exercise">
          <p>What does your UVP look like in real life?</p>

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

          <div className="warn">
            <span className="tag">Translation rule</span>
            Caption what people can see. Then expand only where needed.
          </div>
        </div>

        <aside className="notes-col">
          <DesignNote
            title={<>Why the prototype uses <em>watercolor illustrations</em> alongside photos.</>}
            cite="Service cards · hero silhouettes"
          >
            <p>The prototype uses watercolor where photography could create consent or safety problems.</p>
            <p>Be honest about what can be photographed. Illustrate what cannot.</p>
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

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "workbook-brief.json"; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="step">
      <StepHeader
        num="✦" label="Your Answers"
        title={<>What you've <em>decided.</em></>}
        lede={t.mode === "solo"
          ? <>Your response can be printed, downloaded, or combined with the team's.</>
          : <>Use these answers as the starting brief.</>}
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
          <QA q="Biggest source of new clients today" a={get("top_source")} empty="— not named —" />
          <QA q="First ten seconds — what must be visible" a={getList("first_ten").map(s => "• " + s).join("\n")} empty="— none —" />
          <QA q="Path for a new client" a={get("path_new")} empty="— not yet defined —" />
          <QA q="Path for someone learning more" a={get("path_learn")} empty="— not yet defined —" />
          <QA q="Path for an existing client" a={get("path_existing")} empty="— not yet defined —" />
          <QA q="Trust signals we'll commit to" a={getList("trust").map(s => "• " + s).join("\n")} empty="— none —" />
        </div>

        <div className="review-section">
          <h4>Scope</h4>
          <QA q="One-pager signals checked" a={getList("scope_checks").map(s => "• " + s).join("\n")} empty="— none —" />
          <QA q="Notes from the room" a={get("scope_notes")} empty="— none —" />
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

        <div className="export-row">
          <button type="button" className="btn btn-primary" onClick={() => window.print()}>Print / Save as PDF</button>
          <button type="button" className="btn btn-ghost" onClick={downloadJSON}>Download as JSON</button>
          <button type="button" className="btn btn-ghost" onClick={() => {
            if (confirm("Clear all your answers? This cannot be undone.")) {
              localStorage.removeItem(STORAGE_KEY);
              location.reload();
            }
          }}>Reset workbook</button>
        </div>
      </div>
    </section>
  );
}

/* ---------- Close ---------- */
function CloseStep({ data }) {
  return (
    <section className="step">
      <StepHeader
        num="✦" label="The Commitment"
        title={<>Your website cannot do <em>everything.</em></>}
        lede={<>Let each communications channel do its own job.</>}
      />

      <div className="step-body">
        <div className="exercise">
          <p>A website should not replace every newsletter, report, flyer, press update, or campaign.</p>
          <div className="pull">Move content to the channel where it belongs.</div>

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

          <p>Before adding a page, ask: <em>is the website the best place for this audience to find it?</em></p>

          <div className="commitment">
            <span className="seal">Our Pledge</span>
            <h3>What we will not do</h3>
            <p>We will not start with templates, colors, or fonts. We will not let the homepage become a bulletin board. We will put each message in the channel where it belongs.</p>
            <p><em>Design follows purpose. Purpose follows UVP. UVP follows honesty.</em></p>

            <div className="sign">
              <div className="sign-line">
                <input type="text" placeholder="signature" />
                <span className="label">For the committee</span>
              </div>
              <div className="sign-line">
                <input type="text" placeholder="date" />
                <span className="label">Date</span>
              </div>
            </div>
          </div>

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
   Tweaks panel — sender controls (chair configures before sending)
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
          { value: "full",       label: "All 7" },
          { value: "essentials", label: "Core 4" },
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
          ["#e8654a", "#c94e35", "#f4a48f"], // coral (default)
          ["#0b3b7a", "#072452", "#7aa3d9"], // navy
          ["#3f7d58", "#27593a", "#8fbf9f"], // sage
          ["#6b4d80", "#4a3358", "#9b80b3"], // plum
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

  /* Filter steps based on depth tweak */
  const activeSteps = React.useMemo(() => (
    t.depth === "essentials"
      ? STEPS.filter(s => ESSENTIALS_STEP_IDS.includes(s.id))
      : STEPS
  ), [t.depth]);

  const [idx, setIdx] = React.useState(() => {
    const stored = parseInt(localStorage.getItem("nonprofit-workbook-v2-idx") || "0", 10);
    return isNaN(stored) ? 0 : Math.min(stored, activeSteps.length - 1);
  });

  /* Keep idx in bounds when depth changes */
  React.useEffect(() => {
    if (idx >= activeSteps.length) setIdx(Math.max(0, activeSteps.length - 1));
  }, [activeSteps.length, idx]);

  React.useEffect(() => {
    localStorage.setItem("nonprofit-workbook-v2-idx", String(idx));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [idx]);

  /* Apply accent palette as CSS variables */
  const accentStyle = {
    "--coral": t.accent || "#e8654a",
    "--coral-deep": t.accentDeep || "#c94e35",
    "--coral-soft": t.accentSoft || "#f4a48f",
  };

  const step = activeSteps[idx] || activeSteps[0];
  const onNext = () => setIdx(i => Math.min(activeSteps.length - 1, i + 1));
  const onPrev = () => setIdx(i => Math.max(0, i - 1));

  const renderStep = () => {
    if (step.kind === "cover")  return <CoverStep onStart={onNext} data={wb.data} set={wb.set} />;
    if (step.kind === "review") return <ReviewStep data={wb.data} reset={wb.reset} />;
    if (step.kind === "close")  return <CloseStep data={wb.data} />;
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

  /* Stepper + FootNav need their own active-list view */
  const stepperProps = {
    idx,
    onJump: (i) => setIdx(i),
    steps: activeSteps,
  };

  return (
    <TweakCtx.Provider value={t}>
      <div
        className="app"
        data-notes={t.showDesignNotes ? "on" : "off"}
        data-density={t.density || "comfortable"}
        style={accentStyle}
      >
        <TopBar />
        <Stepper {...stepperProps} />
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
