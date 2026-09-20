// Bio / CV / contact content for the homepage's about, cv, and contact sections.
// Projects live in the `projects` content collection — this file is everything else.

export const bio = {
  location: 'Seattle, WA',
  contactMessage:
    "I’m always happy to chat with fellow designers, recruiters, up-and-comers, potential collaborators, or anyone willing to nerd out about theme parks.",
};

// The hero line on the homepage, and the resume's summary. One string in two
// shapes because the homepage sets two of its words in its inline-code style
// and the resume needs flat text — splitting it here is what stops the two from
// drifting, which is the same reason the resume reads `experience` rather than
// keeping its own copy of the history.
const TAGLINE_EMPHASIS = 'creative technologist';
const TAGLINE_TAIL = 'with 8+ years of experience designing playful, embodied interactions';

export const tagline = {
  /** Set in `.intro-code` on the homepage; plain everywhere else. */
  emphasis: TAGLINE_EMPHASIS,
  tail: TAGLINE_TAIL,
  /** Flat form — the resume summary. A fragment, so no terminal period. */
  plain: `A ${TAGLINE_EMPHASIS} ${TAGLINE_TAIL}`,
};

export const aboutParagraphs = [
  "Hi, I’m Hank, a creative technologist who builds playful interactive experiences.",
  "Most recently, I’ve been focused on emergent digital spaces in XR, haptics, and AI at Meta Reality Labs Research, and AR tools for healthcare before that.",
  'I thrive where code, hardware, and design meet: turning early ideas into prototypes that can be felt, heard, seen, and (sometimes) smelled. Not tasted, though — at least not yet 🤔',
  "Outside of work, I’m a hobbyist maker with skills in electronics and 3D printing. My love languages are threaded inserts and programmable LEDs.",
];

// The "formerly @" row in the hero
export const formerly = [
  { name: 'meta reality labs research', url: 'https://tech.facebook.com/reality-labs/' },
  { name: 'publicis sapient', url: 'https://www.publicissapient.com/' },
  { name: 'spellbound ar', url: 'https://www.spellboundar.com/' },
];

// Capabilities, not history — rendered as the row under `formerly` in the hero.
// Kept short: these sit on one line beside their label, so a fourth entry or a
// longer phrase will wrap the row before the column runs out.
export const focus = [
  'rapid prototyping',
  'game design',
  'hardware × software',
];

export const aboutPhoto = {
  src: '/about/hank-duck.jpg',
  alt: 'Hank sitting on a giant LEGO duck outside the LEGO House in Billund',
  caption: 'Me riding the duck outside of LEGO headquarters',
};

// A role is either one prose block (`description`, what the homepage CV shows)
// or a bullet list (`bullets`, what a resume wants). Both are optional and the
// resume prefers `bullets`, so a role can gain bullets without touching the
// homepage, and the two views never need separate copies of the same history.
export interface Role {
  company: string;
  title: string;
  dates: string;
  description: string;
  bullets?: string[];
  /** Resume only. Where the job was — the homepage CV does not show it. */
  location?: string;
  /**
   * Resume only. Qualifies `dates` when a single span hides something a
   * recruiter should see — a contract that converted, a role held twice.
   * `dates` stays the plain range so the homepage CV is unaffected.
   */
  dateNote?: string;
  /**
   * Resume only, month precision, sourced from LinkedIn — which is the record
   * of truth for these and disagreed with the old hand-made PDF in two places.
   * `dates` keeps the year range because the homepage CV's rail is too narrow
   * for months; the resume prefers this when present. Spaced en dash, not the
   * tight one house style uses for bare years: the operands contain spaces.
   */
  datesFull?: string;
}

export const experience: Role[] = [
  {
    company: 'Meta Reality Labs Research',
    datesFull: 'Jan 2022 – Mar 2026',
    location: 'Redmond, WA',
    title: 'Senior Product Design Prototyper',
    dates: '2022–2026',
    dateNote: 'contract to Jan 2024, full-time from Feb 2024',
    description:
      'Developed AR/VR research prototypes across haptics, AI, wearables, and robotics to drive design exploration, executive reviews, and user studies. Started on contract in 2022 and came on full time in 2024.',
    bullets: [
      'Developed novel interaction concepts for nascent R&D technologies across AR/VR, haptics, wearables, AI, and robotics',
      'Prototyped low- and high-fidelity experiences to support design exploration, value assessment, executive demos, and conferences',
      'Collaborated with cross-functional partners to document research insights, develop code libraries, and facilitate design workshops',
    ],
  },
  {
    company: 'Publicis Sapient',
    datesFull: 'Oct 2020 – Jan 2022',
    location: 'Seattle, WA',
    title: 'Experience Designer L1',
    dates: '2020–2022',
    description:
      'Prototyped digital products for Mercedes-Benz USA: sketches, wireframes, interaction flows, and click-throughs.',
    bullets: [
      'Designed digital products for Mercedes-Benz USA through the creation of sketches, wireframes, interaction flows, and click-through prototypes',
      'Generated prototype-driven insights for digital business transformation concepts within a specialized rapid innovation lab',
    ],
  },
  {
    company: 'SpellBound AR',
    datesFull: 'Jul – Oct 2020 & Jun 2016 – Jul 2018',
    location: 'Ann Arbor, MI',
    title: 'UX Designer / Engineer',
    dates: '2020 & 2016–2018',
    description:
      'Designed, built, and shipped five mobile AR minigames now used in 20+ pediatric hospitals.',
    bullets: [
      'Designed, programmed, and shipped five mobile AR games used in 20+ pediatric hospitals to improve the patient experience',
      'Patented a novel AR practice of leveraging multiple visual targets to create scalable, room-filling content',
    ],
  },
  {
    company: 'Georgia Tech College of Design',
    datesFull: 'Aug 2019 – May 2020',
    location: 'Atlanta, GA',
    title: 'Graduate Teaching Assistant',
    dates: '2019–2020',
    description:
      'Mentored graduate students concepting, designing, and fabricating interactive installations.',
    bullets: [
      'Mentored graduate students through the process of concepting, designing, and fabricating interactive physical installations',
      'Lectured on physical computing topics such as Arduino, addressable LEDs, and general hardware troubleshooting',
    ],
  },
  {
    company: 'Second Story Interactive Studios',
    datesFull: 'Jun – Aug 2019',
    location: 'Atlanta, GA',
    title: 'Experience Design Intern',
    dates: '2019',
    description:
      'Produced flow diagrams, videos, and software prototypes pitching physical installations to prospective clients.',
    bullets: [
      'Developed flow diagrams, videos, and software prototypes to represent interactive physical installations to prospective clients',
      'Conducted two rapid prototyping explorations to evaluate emergent physical sensing technologies for future client work',
    ],
  },
  {
    company: 'IMAGINE Lab',
    datesFull: 'Jan – May 2019',
    location: 'Atlanta, GA',
    title: 'Mixed Reality Research Assistant',
    dates: '2019',
    description:
      'Prototyped four mixed-reality interactions in Unity, supporting research into immersive visualization for city planning.',
    bullets: [
      'Prototyped four mixed-reality interactions in Unity to support research on immersive visualization technology for city planning',
    ],
  },
];

export const education = [
  {
    degree: 'MS Human-Computer Interaction',
    institution: 'Georgia Institute of Technology',
    location: 'Atlanta, GA',
  },
  {
    degree: 'BSE Computer Science',
    institution: 'University of Michigan',
    location: 'Ann Arbor, MI',
  },
];

export const skillGroups = [
  {
    group: 'Digital Prototyping',
    skills: [
      'AI (Claude Code / ChatGPT)',
      'Games, AR, and VR (Unity / Unreal)',
      'Generative art (Processing)',
      'Scripting (Python / C#)',
      'Web (HTML / CSS / JS)',
    ],
  },
  {
    group: 'Physical Prototyping',
    skills: [
      '3D printing',
      'CAD (Fusion 360)',
      'Laser cutting',
      'Model making (foam / cardboard)',
      'Physical computing (Arduino)',
    ],
  },
  {
    group: 'UX Design',
    skills: [
      'Interaction flows and journey maps',
      'Wireframing (Figma)',
      'Workshops (Figjam)',
      'Pitching and presenting',
      'Video editing (Premiere)',
    ],
  },
];

// `venue` and `year` are split out of the title so the list can render them as metadata.
export const publications = [
  {
    title: 'Enabling Immersive, Fantastical Interactions in Virtual Reality Using EMG and Haptics',
    venue: 'CHI Workshop',
    year: '2025',
    link: 'https://sensorimotordevices.github.io/pages/accepted',
  },
  {
    title: 'Explorations of Wrist Haptic Feedback for AR/VR Interactions with Tasbi',
    venue: 'UIST Demo',
    year: '2022',
    link: 'https://dl.acm.org/doi/10.1145/3526114.3558658',
  },
  {
    title: 'Safecracker: Exploring Immersion Through Audio and Object-Based Controllers',
    venue: 'CHI Student Games (1st Place)',
    year: '2020',
    link: 'https://dl.acm.org/doi/10.1145/3334480.3381656',
  },
  {
    title: 'System and Method for Delivering Augmented Reality Using Scalable Frames to Pre-Existing Media',
    venue: 'Utility Patent',
    year: '2017',
    link: 'https://patents.google.com/patent/US20170169598A1/en',
  },
];

// Served from public/ rather than hankduhaime.com so the file is versioned with
// the site and deploys with it. Stable filename on purpose: the link does not
// change when the PDF is replaced, and it is what the browser saves it as.
export const resumeUrl = '/hank-duhaime-resume.pdf';

// Shared by the CV section's "full history" pointer and the contact list below
// it, so the two can never drift apart.
export const linkedinUrl = 'https://www.linkedin.com/in/henryduhaime/';

export const contactLinks = [
  { label: 'hello.hank.d@gmail.com', href: 'mailto:hello.hank.d@gmail.com' },
  { label: 'linkedin', href: linkedinUrl },
  { label: 'instagram', href: 'https://www.instagram.com/hankware.d/' },
];

// ─── Resume ──────────────────────────────────────────────────────────────
// Identity for the rendered resume at /resume. Everything else on that page —
// experience, education, skillGroups, publications — is the same data the
// homepage CV reads, which is the whole point: one source, two views, no drift.

export const resumeMeta = {
  name: 'Hank Duhaime',
  // Sits under the name: the plain job title, which is what an ATS matches on.
  // It deliberately does not repeat the summary's opening words.
  headline: 'Senior Product Design Prototyper',
  // The homepage hero line, not a second copy of it — see `tagline` above.
  // Override with a literal here if the resume ever needs to say something the
  // front page does not.
  summary: tagline.plain,
  siteLabel: 'hankduhaime.com',
  siteUrl: 'https://hankduhaime.com',
};
