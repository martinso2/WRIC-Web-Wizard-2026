/* ============================================================
   Workbook content — single source of truth.
   Edit this file to change copy, prompts, or section structure.
   Each section has: id, num, label, title (JSX-safe string), lede.
   ============================================================ */
/* eslint-disable */

const STORAGE_KEY = "nonprofit-workbook-v2";

/* ─── Sender-configurable tweaks ────────────────────────────────────────
   The chair / sender opens the Tweaks panel to configure these BEFORE
   distributing the wizard to individual respondents. Edits made through
   the panel are persisted into this block. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "solo",
  "orgName": "Nonprofit Website Workbook",
  "senderName": "",
  "deadline": "",
  "showDesignNotes": true,
  "accent": "#e8654a",
  "density": "comfortable",
  "depth": "full"
}/*EDITMODE-END*/;

const STEPS = [
  { id: "cover",    kind: "cover",   label: "Start" },
  { id: "premise",  kind: "section", label: "Premise",         num: "01" },
  { id: "uvp",      kind: "section", label: "Unique Value",    num: "02" },
  { id: "onejob",   kind: "section", label: "One Job",         num: "03" },
  { id: "pathways", kind: "section", label: "Client Pathways", num: "04" },
  { id: "scope",    kind: "section", label: "Scope",           num: "05" },
  { id: "people",   kind: "section", label: "People",          num: "06" },
  { id: "show",     kind: "section", label: "Show, Don't Tell",num: "07" },
  { id: "review",   kind: "review",  label: "Your Answers" },
  { id: "close",    kind: "close",   label: "Commit" },
];

const UVP_DRILLS = [
  {
    id: "uvp_problem",
    prompt: "What primary challenge brings people to us?",
    options: [
      "People need help but aren't quite sure where to go",
      "People are overwhelmed by separate agencies, forms, and referrals",
      "Women need support from people who understand their specific challenges",
    ],
  },
  {
    id: "uvp_approach",
    prompt: "What makes our approach more effective?",
    options: [
      "We offer personal, human support",
      "We coordinate multiple services in one place",
      "The community trusts us deeply",
    ],
  },
  {
    id: "uvp_proof",
    prompt: "What proof do we have that lives are actually changing because of our work?",
    options: [
      "Client outcomes and success stories",
      "Years of service and community presence",
      "Partner, funder, or referral relationships",
    ],
  },
  {
    id: "uvp_loss",
    prompt: "If our organization disappeared tomorrow, who would feel the loss?",
    options: [
      "Clients who rely on direct services",
      "Families and community members connected to those clients",
      "Partner organizations that refer people to us",
    ],
  },
  {
    id: "uvp_diff",
    prompt: "What makes us different from any other nonprofit?",
    options: [
      "We serve a specific community especially well",
      "We combine services others keep separate",
      "We are known, trusted, and accessible",
    ],
  },
  {
    id: "uvp_feel",
    prompt: "What single feeling should web visitors come away with?",
    options: [
      "Hope",
      "Trust",
      "Urgency",
    ],
  },
];

const PRIMARY_GOALS = [
  { id: "donate",    name: "Raise donations",                    sub: "Individual giving, year-end appeals, recurring." },
  { id: "found",     name: "Build credibility with funders",     sub: "Foundations, major donors, institutional support." },
  { id: "enroll",    name: "Enroll Additional Clients",                     sub: "Sign-ups, intake forms, service access." },
  { id: "volunteer", name: "Recruit volunteers",                 sub: "Hands, hours, expertise from the community." },
  { id: "resource",  name: "Educate the community",                sub: "Guides, referrals, downloadable tools." },
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
  "Who we are, in one sentence",
  "Whether services are free or low-cost",
  "Whether contact is confidential",
  "A phone number, visible and clickable",
  "What language(s) we offer",
  "Hours we're actually reachable",
  "A clear, gentle path for someone in crisis",
  "Reassurance that seeking services is judgment-free here",
];

const PATHWAY_NEW_CLIENT = [
  "Call us",
  "Complete a short intake form",
  "Request an appointment",
  "Find eligibility requirements",
  "See what services are available",
];

const PATHWAY_POTENTIAL_DONOR = [
  "Understand the impact of a donation",
  "See proof that donations are used well",
  "Find a clear donate button",
  "Learn about recurring giving",
  "See who funds or partners with us",
];

const PATHWAY_EXISTING_CLIENT = [
  "Access a client portal",
  "Find forms or documents",
  "Check hours and contact information",
  "Get updates about appointments or programs",
  "Reach the right staff person",
];

const TRUST_SIGNALS = [
  "Phone number in the header — clickable on mobile",
  "Hours of operation, in plain text",
  "A second or third language line to serve more languages",
  "The word \"confidential\" near the contact info",
  "A physical address that shows you're real and local",
  "An emergency referral (hotline) for crisis moments",
  "Faces of staff, so visitors know who they're calling",
  "Years of service or founding date — a quiet credibility cue",
];

const SCOPE_CHECKS = [
  "We have a relatively small staff and are better served assisting clients",
  "Our programs are simple enough to explain in 3-4 lines",
  "We update news, events, or program details weekly",
  "We don't have a content manager or web person who can maintain pages weekly",
  "We have staff who are experts in designing and updating our website",
  "Our primary action is donate, sign up, or contact",
];

const ONEPAGER_CHECKS = [
  "A crystal-clear Unique Value Proposition at the top",
  "Real proof of our impact",
  "A simple explanation of programs",
  "Who we serve and why it matters",
  "A clean, unmistakable Donate or Get Involved button",
  "None of the above — we need all of these",
];

const STAFF_CHECKS = [
  "Each bio is short, and reflects our mission — not a résumé",
  "Photos are recent, warm, and consistent in style",
  "We avoid buzzwords like \"passionate change-maker\"",
  "Titles are real, plain-English, and unambiguous",
  "We've named who we serve — not just what we do",
];

const BOARD_CHECKS = [
  "Every name is current — no one who rotated off years ago",
  "Photos for every member (or no photos at all — consistency wins)",
  "Affiliations show stability and community ties",
  "LinkedIn profiles for each member (or no profiles at all — consistency wins)",
];

const SHOT_LIST = [
  "Our people doing the actual work — not posed at a podium or gala event",
  "The people we serve (with consent) — faces, hands, success stories",
  "The place — our space, our neighborhood, our table",
  "Outcomes, not infographics — what \"after\" looks like",
  "Behind-the-scenes staff members doing the work, not stock photos",
];

const CHANNELS = [
  { name: "Email newsletter",  use: "Donor updates, impact stories, year-end appeals." },
  { name: "Annual report PDF", use: "Deep accountability for funders and major donors." },
  { name: "Social channels",   use: "Day-to-day proof, faces, moments." },
  { name: "Direct mail",       use: "Older donor cohorts, planned giving." },
  { name: "Board portal",      use: "Governance documents, minutes, financials." },
  { name: "Program flyers",    use: "Clients & community partners. On paper, where they are." },
];

/* Steps included when depth = "essentials" (the trimmed-down version
   chairs can send to people who don't have time for the full 7 sections) */
const ESSENTIALS_STEP_IDS = ["cover", "premise", "uvp", "onejob", "pathways", "review", "close"];

/* Expose to other scripts (Babel script scopes don't share by default) */
Object.assign(window, {
  STORAGE_KEY, TWEAK_DEFAULTS, ESSENTIALS_STEP_IDS,
  STEPS, UVP_DRILLS, PRIMARY_GOALS, DISCOVERY_CHANNELS,
  FIRST_TEN_SECONDS, PATHWAY_NEW_CLIENT, PATHWAY_POTENTIAL_DONOR, PATHWAY_EXISTING_CLIENT,
  TRUST_SIGNALS, SCOPE_CHECKS, ONEPAGER_CHECKS,
  STAFF_CHECKS, BOARD_CHECKS, SHOT_LIST, CHANNELS,
});
