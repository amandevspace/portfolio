// =========================================================
// FEATURE DETECTION
// If a CDN hiccups, the site still has to work — just with
// less motion. Nothing below assumes GSAP/Lenis exist.
// =========================================================
const HAS_GSAP = typeof gsap !== "undefined";
const HAS_SCROLLTRIGGER = HAS_GSAP && typeof ScrollTrigger !== "undefined";
const HAS_LENIS = typeof Lenis !== "undefined";
const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_TOUCH = window.matchMedia("(pointer: coarse)").matches;

if (HAS_GSAP && HAS_SCROLLTRIGGER) gsap.registerPlugin(ScrollTrigger);

// =========================================================
// RENDER — every piece of identity/content comes from CONFIG,
// nothing here is hardcoded. index.html only has empty
// containers with IDs; this fills them in once on load.
// =========================================================
function renderPersonal() {
  document.getElementById("location-tag").textContent = CONFIG.person.location;
  document.title = `${CONFIG.person.name} — Developer`;

  // Hero name split into characters for the stagger-in on load.
  const nameEl = document.getElementById("hero-name");
  nameEl.innerHTML = CONFIG.person.name
    .split("")
    .map((ch) => `<span class="char">${ch}</span>`)
    .join("") + '<span class="char dot">.</span>';

  document.getElementById("hero-role").innerHTML =
    `${CONFIG.person.role}<br>${CONFIG.person.roleLine2}`;
  document.getElementById("hero-intro").textContent = CONFIG.person.intro;

  document.getElementById("logo-mark").textContent = CONFIG.person.initial;
}

function renderAbout() {
  document.getElementById("about-body").innerHTML = CONFIG.about
    .map((p) => `<p>${p}</p>`)
    .join("");
}

function renderSidebarLinks() {
  const { links } = CONFIG;
  const items = [
    { key: "resume", label: "Resume", href: links.resume },
    { key: "github", label: "GitHub", href: links.github },
    { key: "linkedin", label: "LinkedIn", href: links.linkedin },
    { key: "leetcode", label: "LeetCode", href: links.leetcode }
  ];
  document.getElementById("sidebar-links").innerHTML = items
    .map((i) => linkMarkup(i, "side-link"))
    .join("");
}

function renderContactLinks() {
  const { links } = CONFIG;
  const items = [
    { key: "email", label: "Email", href: links.email },
    { key: "github", label: "GitHub", href: links.github },
    { key: "linkedin", label: "LinkedIn", href: links.linkedin },
    { key: "leetcode", label: "LeetCode", href: links.leetcode },
    { key: "resume", label: "Resume", href: links.resume }
  ];
  document.getElementById("contact-links").innerHTML = items
    .map((i) => linkMarkup(i, ""))
    .join("");
}

function linkMarkup(item, cls) {
  const isPlaceholder = item.href === "#";
  const attrs = isPlaceholder
    ? `href="#" data-fill="${item.key}"`
    : `href="${item.href}" target="_blank" rel="noopener"`;
  return `<a ${attrs} class="${cls}">${item.label}</a>`;
}

function renderProjects() {
  const html = CONFIG.projects
    .map((p, i) => {
      const linkBits = [];
      if (p.links.live) linkBits.push(`<a href="${p.links.live}" target="_blank" rel="noopener" data-stop>Live</a>`);
      linkBits.push(`<a href="${p.links.code}" target="_blank" rel="noopener" data-stop>Code</a>`);

      return `
        <article class="project ${i % 2 ? "offset" : ""}" data-project-index="${i}" tabindex="0" role="button" aria-haspopup="dialog">
          <div class="project-head">
            <h3>${p.name}</h3>
            <span class="project-links">${linkBits.join("")}</span>
          </div>
          <p class="project-tag-label">${p.tag}</p>
          <p class="project-desc">${p.desc}</p>
          <div class="project-tags">${p.stack.map((t) => `<span>${t}</span>`).join("")}</div>
          <p class="project-hint">Click for details →</p>
        </article>`;
    })
    .join("");
  document.getElementById("projects-list").innerHTML = html;
}

function renderSkills() {
  document.getElementById("skills-grid").innerHTML = CONFIG.skills
    .map((s) => `
      <div class="skill-group">
        <h3>${s.group}</h3>
        <p>${s.items}</p>
      </div>`)
    .join("");
}

renderPersonal();
renderAbout();
renderSidebarLinks();
renderContactLinks();
renderProjects();
renderSkills();

document.getElementById("footer-date").textContent = new Date().toLocaleDateString(
  "en-US",
  { month: "long", year: "numeric" }
);

// =========================================================
// LOADER — one short beat on first paint, skipped entirely
// for reduced-motion users (no frozen overlay, no flash).
// =========================================================
const loader = document.getElementById("loader");

function finishLoad() {
  loader.remove();
  runHeroIntro();
}

if (PREFERS_REDUCED || !HAS_GSAP) {
  finishLoad();
} else {
  gsap.to(".loader-mark", { opacity: 1, duration: 0.4, delay: 0.15 });
  gsap.to(loader, {
    opacity: 0,
    duration: 0.5,
    delay: 0.9,
    ease: "power2.inOut",
    onComplete: finishLoad
  });
}

// =========================================================
// HERO INTRO — staggered reveal of the name, then the rest
// of the hero block. Runs once, after the loader clears.
// =========================================================
function runHeroIntro() {
  if (!HAS_GSAP || PREFERS_REDUCED) {
    document.querySelectorAll(".reveal-word, .char").forEach((el) => {
      el.style.opacity = 1;
      el.style.transform = "none";
    });
    document.querySelector(".hero").classList.add("in-view");
    return;
  }

  const tl = gsap.timeline();
  tl.to(".hero-name .char", {
    opacity: 1,
    y: 0,
    duration: 0.65,
    stagger: 0.035,
    ease: "power3.out"
  }, 0)
    .to(".reveal-word", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power2.out"
    }, 0.3);

  gsap.set(".hero-name .char", { opacity: 0, y: 16 });
  tl.play(0);
}

// Chars start hidden even before GSAP runs, so there's no flash
// of fully-visible text before the timeline sets initial state.
document.querySelectorAll(".hero-name .char").forEach((el) => {
  el.style.opacity = 0;
  el.style.transform = "translateY(16px)";
});

// =========================================================
// SMOOTH SCROLL (Lenis), synced to GSAP's ticker if both loaded
// =========================================================
if (HAS_LENIS && !PREFERS_REDUCED) {
  const lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 3) });

  if (HAS_GSAP) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Keep ScrollTrigger's measurements in sync with Lenis's virtual scroll.
  if (HAS_SCROLLTRIGGER) lenis.on("scroll", ScrollTrigger.update);
}

// =========================================================
// SCROLL REVEAL for sections — one pass each, staggered
// children where it actually helps (project cards, skill groups).
// =========================================================
if (HAS_GSAP && HAS_SCROLLTRIGGER && !PREFERS_REDUCED) {
  gsap.utils.toArray(".section").forEach((section) => {
    gsap.fromTo(section, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
      scrollTrigger: { trigger: section, start: "top 82%" }
    });
  });

  gsap.fromTo(".project", { opacity: 0, y: 16 }, {
    opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.08,
    scrollTrigger: { trigger: "#work", start: "top 75%" }
  });

  gsap.fromTo(".skill-group", { opacity: 0, y: 12 }, {
    opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.06,
    scrollTrigger: { trigger: "#skills", start: "top 75%" }
  });
} else {
  // Fallback: plain IntersectionObserver reveal if GSAP didn't load.
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".section").forEach((el) => revealObserver.observe(el));
}

// =========================================================
// SCROLL-SPY NAV with a sliding indicator
// =========================================================
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const navIndicator = document.getElementById("nav-indicator");
const sections = document.querySelectorAll("main .section");

function moveIndicatorTo(link) {
  if (!link) return;
  const linkRect = link.getBoundingClientRect();
  const navRect = link.closest(".side-nav").getBoundingClientRect();
  const top = linkRect.top - navRect.top + linkRect.height / 2 - 0.5;
  navIndicator.classList.add("visible");
  if (HAS_GSAP) {
    gsap.to(navIndicator, { top, duration: 0.4, ease: "power2.out" });
  } else {
    navIndicator.style.top = `${top}px`;
  }
}

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const activeLink = navLinks.find((l) => l.getAttribute("href") === `#${id}`);
        navLinks.forEach((l) => l.classList.toggle("active", l === activeLink));
        moveIndicatorTo(activeLink);
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);

sections.forEach((section) => navObserver.observe(section));

// =========================================================
// MAGNETIC BUTTONS — small pull toward the cursor, capped
// distance, reset on leave. Desktop only.
// =========================================================
if (!IS_TOUCH && !PREFERS_REDUCED) {
  document.querySelectorAll(".magnetic").forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const pull = 0.25;
      const moveFn = HAS_GSAP
        ? () => gsap.to(el, { x: x * pull, y: y * pull, duration: 0.3, ease: "power2.out" })
        : () => { el.style.transform = `translate(${x * pull}px, ${y * pull}px)`; };
      moveFn();
    });
    el.addEventListener("mouseleave", () => {
      if (HAS_GSAP) gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "elastic.out(1, 0.4)" });
      else el.style.transform = "translate(0, 0)";
    });
  });
}

// =========================================================
// PROJECT CARD TILT
// =========================================================
if (!IS_TOUCH) {
  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${(-y * 2.2).toFixed(2)}deg) rotateY(${(x * 2.2).toFixed(2)}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

// =========================================================
// SPOTLIGHT + CURSOR DOT
// =========================================================
if (!IS_TOUCH) {
  const dot = document.querySelector(".cursor-dot");
  const spotlight = document.getElementById("spotlight");
  let shown = false;

  window.addEventListener("mousemove", (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top = `${e.clientY}px`;
    spotlight.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    if (!shown) {
      dot.classList.add("visible");
      spotlight.classList.add("visible");
      shown = true;
    }
  });

  document.querySelectorAll("a, button, .project").forEach((el) => {
    el.addEventListener("mouseenter", () => dot.classList.add("hovering"));
    el.addEventListener("mouseleave", () => dot.classList.remove("hovering"));
  });
} else {
  document.querySelector(".cursor-dot").style.display = "none";
  document.getElementById("spotlight").style.display = "none";
}

// =========================================================
// PROJECT MODAL
// =========================================================
const backdrop = document.getElementById("modal-backdrop");
const modal = document.getElementById("modal");
let lastFocused = null;

function openModal(index) {
  const p = CONFIG.projects[index];
  document.getElementById("modal-tag").textContent = p.tag;
  document.getElementById("modal-title").textContent = p.name;
  document.getElementById("modal-detail").textContent = p.detail;
  document.getElementById("modal-highlights").innerHTML = p.highlights.map((h) => `<li>${h}</li>`).join("");
  document.getElementById("modal-stack").innerHTML = p.stack.map((t) => `<span>${t}</span>`).join("");

  const linkHtml = [];
  if (p.links.live) linkHtml.push(`<a href="${p.links.live}" target="_blank" rel="noopener" class="primary">View live</a>`);
  linkHtml.push(`<a href="${p.links.code}" target="_blank" rel="noopener">View code</a>`);
  document.getElementById("modal-links").innerHTML = linkHtml.join("");

  lastFocused = document.activeElement;
  backdrop.classList.add("open");
  document.body.classList.add("modal-locked");
  document.getElementById("modal-close").focus();
}

function closeModal() {
  backdrop.classList.remove("open");
  document.body.classList.remove("modal-locked");
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".project").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("[data-stop]")) return; // let Live/Code links behave normally
    openModal(Number(card.dataset.projectIndex));
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(Number(card.dataset.projectIndex));
    }
  });
});

document.getElementById("modal-close").addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });

// Basic focus trap while the modal is open.
document.addEventListener("keydown", (e) => {
  if (!backdrop.classList.contains("open")) return;
  if (e.key === "Escape") { closeModal(); return; }
  if (e.key === "Tab") {
    const focusables = modal.querySelectorAll("a, button");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// =========================================================
// KEYBOARD SECTION NAVIGATION — ArrowDown/Up jump between
// sections. Disabled while typing in the contact form or
// while the modal is open, so it never steals input.
// =========================================================
const orderedSectionIds = ["hero", "about", "work", "skills", "contact"];

function isTypingContext() {
  const tag = document.activeElement.tagName;
  return tag === "INPUT" || tag === "TEXTAREA";
}

document.addEventListener("keydown", (e) => {
  if (isTypingContext() || backdrop.classList.contains("open")) return;
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

  const scrollY = window.scrollY + window.innerHeight * 0.3;
  let currentIndex = 0;
  orderedSectionIds.forEach((id, i) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) currentIndex = i;
  });

  const nextIndex = e.key === "ArrowDown"
    ? Math.min(currentIndex + 1, orderedSectionIds.length - 1)
    : Math.max(currentIndex - 1, 0);

  const target = document.getElementById(orderedSectionIds[nextIndex]);
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: PREFERS_REDUCED ? "auto" : "smooth", block: "start" });
  }
});

// =========================================================
// CONTACT FORM — no backend wired up, so this gives honest
// feedback rather than pretending to send anything. Swap in
// a real handler (Formspree, your own API route) when ready.
// =========================================================
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  note.textContent = `Thanks${name ? ", " + name : ""} — this form isn't wired to anything yet. Email me directly for now.`;
});

// =========================================================
// PLACEHOLDER LINK WARNING — console nudge for links still
// pointing at "#" in config.js (resume/email by default).
// =========================================================
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-fill]");
  if (link && link.getAttribute("href") === "#") {
    e.preventDefault();
    console.warn(`[portfolio] "${link.dataset.fill}" isn't set yet — update it in config.js.`);
  }
});
