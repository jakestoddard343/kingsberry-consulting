// Single source of truth for every piece of copy on the site.
// TODO: replace the placeholder contact details in `site` with real ones.

export const site = {
  name: "Kingsberry Consulting",
  tagline: "AI-Powered Revenue Growth Consultancy",
  positioning:
    "We build automated lead-generation systems that turn marketing into measurable revenue.",
  subPositioning:
    "AI, automation, CRM optimization, and analytics — assembled into one system that works while you sleep.",
  // TODO: swap in real contact details
  email: "hello@kingsberryconsulting.com",
  phone: "+1 (555) 010-0134",
  bookingUrl: "#contact",
  linkedin: "https://www.linkedin.com/",
  location: "Remote · United States",
};

export const problems = [
  {
    stat: "78%",
    label: "Leads falling through the cracks",
    body: "Form fills land in an inbox nobody owns. By the time anyone follows up, the buyer has already talked to someone else.",
  },
  {
    stat: "5 min",
    label: "Slow follow-up times",
    body: "Contact a lead within five minutes and you are 21× more likely to qualify them. Most teams take hours — or days.",
  },
  {
    stat: "30%",
    label: "Poor CRM data",
    body: "Duplicates, dead fields, and half-built pipelines. Your CRM decays roughly 30% a year without maintenance.",
  },
  {
    stat: "12 hrs",
    label: "Manual marketing processes",
    body: "Copy-paste between tools, manual list uploads, hand-built reports. Hours a week that produce zero new pipeline.",
  },
  {
    stat: "0",
    label: "No visibility into ROI",
    body: "Spend goes out, leads come in, and nobody can draw a straight line between the two. So budget decisions become guesses.",
  },
];

export type Service = {
  id: string;
  n: string;
  title: string;
  summary: string;
  detail: string;
  bullets: string[];
  tools: string[];
  deliverables: string[];
};

export const services: Service[] = [
  {
    id: "ai-lead-gen",
    n: "01",
    title: "AI Lead Generation Systems",
    summary: "Assistants that qualify and book while your team sleeps.",
    detail:
      "Deploy AI assistants that answer questions, qualify prospects, book appointments, and route leads straight to the right rep — then score every lead automatically on website activity, form submissions, email engagement, and CRM history.",
    bullets: [
      "AI chatbots that qualify and book",
      "Lead scoring models",
      "Automated routing and sales alerts",
      "Appointment booking automation",
    ],
    tools: ["ChatGPT", "Claude", "Intercom", "Drift", "HubSpot Chat"],
    deliverables: [
      "Website chatbot",
      "Lead qualification workflows",
      "Lead scoring model",
      "Automated routing",
    ],
  },
  {
    id: "marketing-automation",
    n: "02",
    title: "Marketing Automation",
    summary: "Journeys that nurture without anyone touching a keyboard.",
    detail:
      "Welcome sequences, lead nurturing, re-engagement, and event follow-up — built as journeys, not one-off blasts. Then we automate the plumbing around them so a form fill creates the record, assigns the rep, sends the email, and books the meeting on its own.",
    bullets: [
      "Welcome and nurture sequences",
      "Re-engagement campaigns",
      "Event follow-up automation",
      "End-to-end workflow automation",
    ],
    tools: ["HubSpot", "Salesforce Marketing Cloud", "Mailchimp", "ActiveCampaign", "Zapier", "Make"],
    deliverables: ["Journey maps", "Automated campaigns", "Performance dashboards"],
  },
  {
    id: "crm",
    n: "03",
    title: "CRM Consulting",
    summary: "Salesforce and HubSpot, audited and rebuilt to actually close.",
    detail:
      "We audit data quality, duplicate records, pipeline structure, and reporting — then fix them. Salesforce administration, HubSpot implementation, lead routing, dashboards, and automation setup, delivered by someone who has run these systems in production.",
    bullets: [
      "CRM audit and cleanup roadmap",
      "Salesforce administration",
      "HubSpot implementation",
      "Lead routing and dashboards",
    ],
    tools: ["Salesforce", "HubSpot", "Salesforce Flow"],
    deliverables: ["Audit report", "Recommendations", "Cleanup roadmap", "Dashboards"],
  },
  {
    id: "journey",
    n: "04",
    title: "Customer Journey Consulting",
    summary: "Find the exact step where your pipeline leaks.",
    detail:
      "Map the entire customer experience end to end, then pinpoint conversion bottlenecks, lead leakage, and poor handoffs between marketing and sales. You get a picture of where revenue is actually being lost — and what to fix first.",
    bullets: [
      "Conversion bottleneck analysis",
      "Lead leakage identification",
      "Marketing-to-sales handoff review",
      "Prioritized opportunity list",
    ],
    tools: ["Miro", "Salesforce", "HubSpot"],
    deliverables: ["Journey maps", "Funnel analysis", "Opportunity recommendations"],
  },
  {
    id: "analytics",
    n: "05",
    title: "Analytics & Reporting",
    summary: "Dashboards your executives will actually open.",
    detail:
      "Most companies collect plenty of data and use almost none of it. We build executive dashboards that show leads, opportunities, revenue, marketing ROI, and customer acquisition cost in one place — with a monthly reporting package to match.",
    bullets: [
      "Executive dashboards",
      "Marketing ROI attribution",
      "Customer acquisition cost tracking",
      "Monthly reporting package",
    ],
    tools: ["Tableau", "Power BI", "Looker Studio"],
    deliverables: ["Executive dashboard", "Monthly reporting package"],
  },
  {
    id: "content-ops",
    n: "06",
    title: "AI Content Operations",
    summary: "A content engine, not a content freelancer.",
    detail:
      "We do not sell content by the article. We build the system that produces it: workflows that generate blogs and social posts, repurpose webinars, and spin up email campaigns — with the prompts and SOPs your team needs to run it without us.",
    bullets: [
      "Blog and social generation workflows",
      "Webinar repurposing pipelines",
      "Email campaign generation",
      "Prompt libraries and SOPs",
    ],
    tools: ["ChatGPT", "Claude", "Perplexity", "Canva"],
    deliverables: ["Content engine", "Editorial workflow", "AI prompts and SOPs"],
  },
  {
    id: "local",
    n: "07",
    title: "Local Business Lead Generation",
    summary: "For contractors, clinics, and firms that live on inbound.",
    detail:
      "Built for contractors, roofers, realtors, dentists, law firms, and medical practices. Google Business Profile optimization, automated review generation, lead capture, and booking automation — the four things that move the needle for local demand.",
    bullets: [
      "Google Business Profile optimization",
      "Review generation automation",
      "Lead capture systems",
      "Appointment booking automation",
    ],
    tools: ["Google Business Profile", "Zapier", "HubSpot"],
    deliverables: ["Optimized profile", "Review engine", "Booking automation"],
  },
  {
    id: "cx",
    n: "08",
    title: "Customer Experience Optimization",
    summary: "Voice of Customer programs that produce decisions.",
    detail:
      "Survey programs, NPS implementation, and customer feedback systems built on real Qualtrics experience — wired into executive dashboards so feedback turns into an action plan instead of a slide nobody reads.",
    bullets: [
      "Survey program design",
      "NPS implementation",
      "Customer feedback systems",
      "Experience dashboards",
    ],
    tools: ["Qualtrics", "Tableau", "Power BI"],
    deliverables: ["Voice of Customer program", "Executive reporting", "Action plans"],
  },
];

export const packages = [
  {
    id: "starter",
    tier: 1,
    name: "Lead Engine Starter",
    target: "Small businesses",
    pitch: "Stop the bleeding. Find where leads are lost and plug the biggest holes.",
    includes: [
      "CRM audit",
      "Lead funnel review",
      "AI chatbot deployment",
      "Lead capture optimization",
    ],
  },
  {
    id: "growth",
    tier: 2,
    name: "Growth Automation System",
    target: "Growing companies",
    pitch: "Build the machine. Automated nurture, scored leads, and dashboards that prove it works.",
    includes: [
      "CRM optimization",
      "Email automation build-out",
      "Lead scoring model",
      "Dashboard creation",
    ],
  },
  {
    id: "revops",
    tier: 3,
    name: "Revenue Operations Transformation",
    target: "Mid-market organizations",
    pitch: "Rebuild revenue operations end to end, and train your team to own it.",
    includes: [
      "Full marketing automation",
      "CRM redesign",
      "AI implementation",
      "Reporting ecosystem",
      "Executive training",
    ],
  },
];

export const retainer = {
  id: "retainer",
  name: "Monthly AI Growth Partner",
  eyebrow: "Ongoing partnership",
  headline: "The build is the start, not the finish.",
  pitch:
    "Systems drift. Campaigns go stale. Dashboards break the moment someone renames a field. The retainer keeps the machine tuned every month — and keeps us accountable to the number, not the ticket queue.",
  catchAll:
    "It also absorbs whatever comes next. A new campaign, a migration, another dashboard, an integration nobody planned for — it fits inside the retainer instead of becoming a new scope document.",
  includes: [
    "Dashboard maintenance",
    "Automation monitoring",
    "Campaign optimization",
    "CRM administration",
    "Monthly strategy calls",
  ],
  // The loop shown running in the retainer column.
  cycle: ["Monitor", "Tune", "Report", "Repeat"],
};

/**
 * Project options for the engagement picker.
 *
 * `tier` is the lowest package that covers the item, so the recommendation is
 * the highest tier among everything checked — the smallest engagement that
 * still covers the whole selection.
 *
 * Deliberately not grouped by tier in the UI: the ordering below interleaves
 * them so the answer isn't visible before anyone checks a box.
 *
 * Ongoing work is not listed here. It belongs to the retainer, which is its own
 * column in the picker rather than an option competing with project scope.
 */
export type ProjectOption = {
  id: string;
  label: string;
  tier: 1 | 2 | 3;
};

export const projectOptions: ProjectOption[] = [
  { id: "crm-audit", label: "Audit my CRM for bad data", tier: 1 },
  { id: "crm-opt", label: "Restructure my CRM and pipelines", tier: 2 },
  { id: "full-automation", label: "Automate marketing end to end", tier: 3 },
  { id: "funnel-review", label: "Find where my funnel leaks", tier: 1 },
  { id: "email-auto", label: "Build automated email journeys", tier: 2 },
  { id: "crm-redesign", label: "Redesign my CRM from scratch", tier: 3 },
  { id: "chatbot", label: "Put an AI chatbot on my site", tier: 1 },
  { id: "lead-scoring", label: "Score and route leads automatically", tier: 2 },
  { id: "ai-impl", label: "Implement AI across the business", tier: 3 },
  { id: "lead-capture", label: "Improve how I capture leads", tier: 1 },
  { id: "dashboards", label: "Build executive dashboards", tier: 2 },
  { id: "reporting", label: "Stand up a full reporting ecosystem", tier: 3 },
  { id: "training", label: "Train my team to run it themselves", tier: 3 },
];

export const process = [
  {
    step: "01",
    title: "Audit",
    body: "We map your current stack, CRM, and funnel end to end — and quantify exactly where leads are leaking out.",
  },
  {
    step: "02",
    title: "Design",
    body: "You get a journey map and a build plan: what gets automated, what gets scored, what gets reported, and in what order.",
  },
  {
    step: "03",
    title: "Build",
    body: "We implement it. Chatbots, workflows, scoring models, routing rules, and dashboards — configured in your tools, not ours.",
  },
  {
    step: "04",
    title: "Measure",
    body: "Executive dashboards go live on day one of launch, so you can see lead volume, conversion, and ROI move in real time.",
  },
  {
    step: "05",
    title: "Optimize",
    body: "As an ongoing partner we monitor automations, tune campaigns, keep CRM data clean, and meet monthly on strategy.",
  },
];

export const industries = [
  "Aerospace suppliers",
  "Manufacturers",
  "Industrial services",
  "Engineering firms",
  "B2B technology",
];

export const credibility = [
  {
    k: "Salesforce",
    v: "Administration",
    note: "Pipeline architecture, Flow automation, and lead routing built in production orgs.",
  },
  {
    k: "Qualtrics",
    v: "Customer Experience",
    note: "NPS and Voice of Customer programs wired into executive reporting.",
  },
  {
    k: "Analytics",
    v: "Revenue Reporting",
    note: "Tableau, Power BI, and Looker dashboards tying spend to closed revenue.",
  },
  {
    k: "AI + Automation",
    v: "Workflow Design",
    note: "Chatbots, scoring models, and content engines that run without supervision.",
  },
];
