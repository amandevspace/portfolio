// =========================================================
// CONFIG — the single source of truth for personal data.
// Everything with a name, a link, or project copy lives here;
// index.html has no hardcoded identity strings left in it.
// Edit this file, not the HTML, when your info changes.
// =========================================================

const CONFIG = {
  person: {
    name: "Aman",
    initial: "A.",
    role: "Computer Science & Engineering student, class of 2027 —",
    roleLine2: "building with the MERN stack and, lately, a lot of RAG pipelines.",
    location: "Bhopal, India",
    intro: "I'm based in Bhopal. Most nights you'll find me deep in a codebase or wiring up something with an LLM in it — I learn best by shipping something that has to actually work, not by reading about it."
  },

  links: {
    github: "https://github.com/amandevspace",
    linkedin: "https://www.linkedin.com/in/aman-kumar-518a18304",
    leetcode: "https://leetcode.com/u/Aman_Ambidextrous/",
    // Place your resume PDF in the SAME folder as index.html and name it
    // "resume.pdf" — this path will then just work. (Or replace this with
    // a Google Drive / Docs share link if you'd rather host it there.)
    resume: "./resume.pdf",
    email: "mailto:kumaramansingh2005@gmail.com"
  },

  // Restructured as checkpoints in a timeline rather than flat prose.
  // The <span class="key-phrase"> markup is intentional — those are the
  // specific lines meant to carry weight when someone reads this.
  journey: [
    {
      n: "01",
      title: "Copying UI",
      body: "I started by copying things I liked — <span class=\"key-phrase\">pixel-for-pixel remakes</span> of login screens and glassmorphism UIs, just to understand how they were actually built, mountain-landscape background and all. That habit turned into building fuller systems."
    },
    {
      n: "02",
      title: "Building Systems",
      body: "A sign-language-to-speech platform with a 3D avatar took <span class=\"key-phrase\">three different rendering pipelines</span> before it moved naturally — I went from a flat 2D image-based avatar, to FBX with a Mixamo-retargeted rig, and back to GLB once the camera framing finally behaved. A RAG pipeline needed per-user isolated storage before I'd trust it with someone else's documents. An API monitor exists because <span class=\"key-phrase\">\"it works on my machine\" isn't a monitoring strategy</span>."
    },
    {
      n: "03",
      title: "Real-World Thinking",
      body: "I care more about whether something holds up under real conditions than how it looks in a screenshot — though by the end I usually end up caring about that too."
    }
  ],

  projects: [
    {
      name: "VaaniSetu",
      tag: "sign language → speech",
      desc: "A sign-language ↔ speech platform built on React, Vite, and Three.js / React Three Fiber, with MediaPipe handling gesture recognition.",
      detail: "The hard part wasn't the ML — it was getting a GLB avatar to rig, retarget from Mixamo, and auto-frame itself in camera without looking broken. Went through three full pipelines (2D image-based, then FBX, then GLB) before the animation held up, followed by a full UI redesign once it did.",
      highlights: [
        "GLB/FBX avatar pipeline with Mixamo rig retargeting",
        "Bounding-box camera auto-positioning",
        "Fixed a duplicate-animation trigger bug and speech-recognition state issues"
      ],
      stack: ["React", "Three.js", "MediaPipe", "Vite"],
      links: { code: "https://github.com/amandevspace" }
    },
    {
      name: "ContextIQ",
      tag: "RAG pipeline",
      desc: "A custom RAG pipeline on top of an OpenRouter LLM, with JWT auth and per-user isolated storage.",
      detail: "One person's uploaded documents never leak into another's context window — isolation is enforced at the storage layer, not just the UI. Deployed across Netlify and Render.",
      highlights: [
        "Per-user isolated document storage",
        "JWT-authenticated API layer",
        "Split deployment: Netlify (frontend) / Render (backend)"
      ],
      stack: ["RAG", "Node.js", "JWT", "OpenRouter"],
      links: { code: "https://github.com/amandevspace", live: "https://contextiqfrontend.onrender.com/" }
    },
    {
      name: "ApiVigil",
      tag: "monitoring",
      desc: "An API failure detection and monitoring tool — it watches endpoints so problems surface before a user has to report them.",
      detail: "Ran it through a passive vulnerability assessment using securityheaders.com and OWASP guidance to tighten up its own header configuration before trusting it to watch anything else.",
      highlights: [
        "Live at apivigil.onrender.com",
        "Passive vulnerability assessment against OWASP guidance",
        "Failure detection before it hits a user report"
      ],
      stack: ["Node.js", "Monitoring", "Security"],
      links: { code: "https://github.com/amandevspace", live: "https://apivigil.onrender.com" }
    },
    {
      name: "Clix Chat",
      tag: "real-time chat",
      desc: "A real-time MERN chat application. Contributed the navbar layer end to end.",
      detail: "Active-route highlighting, initials-based avatars for users without a profile picture, and the logout state styling — the small details that make a chat app feel finished instead of assembled.",
      highlights: [
        "Active-route highlighting in the navbar",
        "Initials-based fallback avatars",
        "Logout state styling"
      ],
      stack: ["MongoDB", "Express", "React", "Node.js"],
      links: { code: "https://github.com/amandevspace/clix-chat", live: "https://clix-chat.onrender.com/" }
    },
    {
      name: "CaptionCraft",
      tag: "Gemini API",
      desc: "A caption generator built on the Gemini API — feed it an image, get captions back that don't read like they came from a template.",
      detail: "The interesting part was prompt design, not plumbing: getting captions that sound like a person wrote them, not a caption-generator.",
      highlights: [
        "Gemini API integration",
        "Prompt tuning for natural-sounding output"
      ],
      stack: ["Gemini API", "JavaScript"],
      links: { code: "https://github.com/amandevspace", live: "https://captioncraft-4jip.onrender.com" }
    },
    {
      name: "CRYPTOTrail",
      tag: "blockchain",
      desc: "A blockchain compliance tool for tracing and flagging transaction activity.",
      detail: "The kind of project that starts as \"let's just parse some transactions\" and turns into a real rabbit hole once you start tracing activity across addresses.",
      highlights: [
        "Transaction tracing and flagging logic",
        "Compliance-focused output"
      ],
      stack: ["Blockchain", "JavaScript"],
      links: { code: "https://github.com/amandevspace" }
    },
    {
      name: "FlowLimiter",
      tag: "concept + marketing site",
      desc: "Marketing site for a distributed API rate-limiting service — the site is live; the service itself is still a concept, not a shipped product.",
      detail: "Built as a standalone Vite app with React Three Fiber, Three.js, and Framer Motion — a 3D Earth hero section and a glassmorphism login page, deliberately just the front door for now. The rate-limiting service it markets hasn't been built yet.",
      highlights: [
        "3D Earth hero section built with React Three Fiber",
        "Glassmorphism login page",
        "Framer Motion micro-interactions throughout"
      ],
      stack: ["React Three Fiber", "Three.js", "Framer Motion", "Vite"],
      links: { live: "https://flowlimiter-web.onrender.com" }
    }
  ],

  skills: [
    { group: "Languages", items: ["JavaScript", "Java"] },
    { group: "Frontend", items: ["React", "Vite", "Three.js / R3F", "Tailwind CSS"] },
    { group: "Backend", items: ["Node.js", "Express", "MongoDB", "JWT auth"] },
    { group: "AI / GenAI", items: ["RAG pipelines", "OpenRouter", "Gemini API", "MediaPipe"] },
    { group: "Tools & hosting", items: ["Git", "GitHub", "Render", "Netlify"] }
  ]
};
