// Bio / CV / contact content for the homepage's about, cv, and contact sections.
// Projects live in the `projects` content collection — this file is everything else.

export const bio = {
  location: 'Seattle, WA',
  contactMessage:
    "I’m always happy to chat with fellow designers, recruiters, up-and-comers, potential collaborators, or anyone willing to nerd out about theme parks.",
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

export const experience = [
  {
    company: 'Meta Reality Labs Research',
    title: 'Senior Product Design Prototyper',
    dates: '2022–2026',
    description:
      'Developed AR/VR research prototypes across haptics, AI, wearables, and robotics to drive design exploration, executive reviews, and user studies. Started on contract in 2022 and came on full time in 2024.',
  },
  {
    company: 'Publicis Sapient',
    title: 'Experience Designer L1',
    dates: '2020–2022',
    description:
      'Prototyped digital products for Mercedes-Benz USA: sketches, wireframes, interaction flows, and click-throughs.',
  },
  {
    company: 'SpellBound AR',
    title: 'UX Designer / Engineer',
    dates: '2020 & 2016–2018',
    description:
      'Designed, built, and shipped five mobile AR minigames now used in 20+ pediatric hospitals.',
  },
  {
    company: 'Georgia Tech College of Design',
    title: 'Graduate Teaching Assistant',
    dates: '2019–2020',
    description:
      'Mentored graduate students concepting, designing, and fabricating interactive installations.',
  },
  {
    company: 'Second Story Interactive Studios',
    title: 'Experience Design Intern',
    dates: '2019',
    description:
      'Produced flow diagrams, videos, and software prototypes pitching physical installations to prospective clients.',
  },
  {
    company: 'IMAGINE Lab',
    title: 'Mixed Reality Research Assistant',
    dates: '2019',
    description:
      'Prototyped four mixed-reality interactions in Unity, supporting research into immersive visualization for city planning.',
  },
];

export const education = [
  { degree: 'MS Human-Computer Interaction', institution: 'Georgia Institute of Technology' },
  { degree: 'BSE Computer Science', institution: 'University of Michigan' },
];

export const skillGroups = [
  {
    group: 'Digital Prototyping',
    skills: ['Games, AR, and VR (Unity/C#)', 'Python', 'AI', 'Processing', 'Web (HTML/CSS/JS)'],
  },
  {
    group: 'Physical Prototyping',
    skills: ['3D printing', 'CAD', 'Electronics', 'Laser cutting', 'Model-making (cardboard / foam)'],
  },
  {
    group: 'Interaction Design',
    skills: ['Wireframing (Figma)', 'Workshops (Figjam)', 'Interaction flows', 'Video editing (Premiere)'],
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
    venue: 'CHI Student Game Competition',
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
