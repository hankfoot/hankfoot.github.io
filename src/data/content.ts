// Central portfolio data — edit this file to update bio, experience, skills, etc.
// Projects are managed separately in src/content/projects/*.mdx

export const bio = {
  name: "Hank Duhaime",
  location: "Seattle, WA",
  contactMessage:
    "I'm always happy to chat with fellow designers, recruiters, up-and-comers, potential collaborators, or anyone willing to nerd out about theme parks.",
}

export const aboutParagraphs = [
  "I'm Hank — a design technologist who builds playful interactive experiences.",
  "Most recently I've been focused on emergent digital spaces: from AR tools for healthcare to XR, haptics, and AI at Meta Reality Labs.",
  "I thrive where code, hardware, and imagination meet: turning early ideas into prototypes that can be felt, heard, seen, and (sometimes) smelled. Not tasted though, at least… not yet 🤔",
  "Outside of work, I'm a hobbyist maker with skills in electronics and 3D printing. My love languages are threaded inserts and programmable LEDs.",
  "I also enjoy teaching others how to bring their own interactive ideas to life — whether that's wiring a first circuit or helping shape a full installation.",
]

export const experience = [
  {
    company: "Meta Reality Labs Research",
    title: "Senior Product Design Prototyper",
    dates: "2022 – Present",
    description:
      "Prototyping for R&D in AR/VR to enable design explorations, value assessments, and research studies for emergent research technologies including haptics, AI, wearables, and robotics",
  },
  {
    company: "Publicis Sapient",
    title: "Experience Designer L1",
    dates: "2020 – 2022",
    description:
      "Designed digital products for Mercedes-Benz USA through the creation of sketches, wireframes, interaction flows, and click-through prototypes",
  },
  {
    company: "SpellBound AR",
    title: "UX Designer / Engineer",
    dates: "2020 – 2021 & 2016-2018",
    description:
      "Designed, programmed, and shipped 5 mobile AR minigames used in 20+ pediatric hospitals to improve the patient experience",
  },
  {
    company: "Second Story Interactive Studios",
    title: "Experience Design Intern",
    dates: "2019",
    description:
      "Developed flow diagrams, videos, and software prototypes to represent interactive physical installations to prospective clients",
  },
  {
    company: "Georgia Tech College of Design",
    title: "Graduate Teaching Assistant",
    dates: "2019-2020",
    description:
      "Mentored graduate students through the process of concepting, designing, and fabricating interactive physical installations",
  },
]

export const skillGroups = [
  {
    group: "Digital Prototyping",
    skills: ["Games, AR, and VR (Unity/C#)", "Python", "AI", "Processing", "Web (HTML/CSS/JS)"],
  },
  {
    group: "Physical Prototyping",
    skills: ["3D printing", "CAD", "Electronics", "Laser cutting", "Model-making (cardboard / foam)"],
  },
  {
    group: "Interaction Design",
    skills: ["Wireframing (Figma)", "Workshops (Figjam)", "Interaction flows", "Video editing (Premiere)"],
  },
]

export const publications = [
  {
    title:
      "Enabling Immersive, Fantastical Interactions in Virtual Reality Using EMG and Haptics (CHI Workshop, 2025)",
    link: "https://sensorimotordevices.github.io/pages/accepted",
  },
  {
    title:
      "Explorations of Wrist Haptic Feedback for AR/VR Interactions with Tasbi (UIST Demo, 2022)",
    link: "https://dl.acm.org/doi/10.1145/3526114.3558658",
  },
  {
    title:
      "Safecracker: Exploring Immersion Through Audio and Object-Based Controllers (CHI Student Games Competition, 2020)",
    link: "https://dl.acm.org/doi/fullHtml/10.1145/3334480.3381656",
  },
  {
    title:
      "System and Method for Delivering Augmented Reality Using Scalable Frames to Pre-Existing Media (Utility Patents, 2017)",
    link: "https://patents.google.com/patent/US20170169598A1/en",
  },
]

export const education = [
  { degree: "MS Human-Computer Interaction", institution: "Georgia Institute of Technology" },
  { degree: "BSE Computer Science", institution: "University of Michigan" },
]

export const social = {
  bluesky: "https://bsky.app/profile/schmardware.bsky.social",
  linkedin: "https://www.linkedin.com/in/henryduhaime/",
  resume: "https://hankduhaime.com/s/DuhaimeResume2023-V-Nov.pdf",
}
