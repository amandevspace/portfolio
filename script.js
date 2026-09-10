// =========================================================
// FEATURE DETECTION
// =========================================================
const HAS_GSAP = typeof gsap !== "undefined";
const HAS_SCROLLTRIGGER = HAS_GSAP && typeof ScrollTrigger !== "undefined";
const HAS_LENIS = typeof Lenis !== "undefined";
const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const IS_TOUCH = window.matchMedia("(pointer: coarse)").matches;

if (HAS_GSAP && HAS_SCROLLTRIGGER) gsap.registerPlugin(ScrollTrigger);

// =========================================================
// CONFIG SAFETY
// The HTML already has real fallback text baked into every
// section (see index.html). If config.js failed to load, or a
// field is missing, we warn once and simply leave that fallback
// alone instead of overwriting it with "undefined".
// =========================================================
const CFG = typeof CONFIG !== "undefined" && CONFIG ? CONFIG : null;

if (!CFG) {
  console.warn("[portfolio] config.js did not load — showing fallback content baked into the HTML.");
}

function need(path, obj) {
  const val = path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
  if (val === undefined || val === null || val === "") {
    console.warn(`[portfolio] config is missing "${path}" — leaving existing content in place.`);
    return undefined;
  }
  return val;
}

// =========================================================
// RENDER
// Each function only touches the DOM once it has a real value
// for that piece — a missing field skips just that field rather
// than blanking the section.
// =========================================================
function renderPersonal() {
  if (!CFG) return;

  const location = need("person.location", CFG);
  if (location) document.getElementById("location-tag").textContent = location;

  const name = need("person.name", CFG);
  if (name) {
    document.title = `${name} — Developer`;
    const nameEl = document.getElementById("hero-name");
    nameEl.dataset.fallback = `${name}.`;
    nameEl.innerHTML =
      name.split("").map((ch) => `<span class="char">${ch}</span>`).join("") +
      '<span class="char dot">.</span>';
    document.getElementById("logo-mark").textContent = CFG.person.initial || `${name[0]}.`;
  }

  const role = need("person.role", CFG);
  const roleLine2 = need("person.roleLine2", CFG);
  if (role || roleLine2) {
    document.getElementById("hero-role").innerHTML = `${role || ""}${role && roleLine2 ? "<br>" : ""}${roleLine2 || ""}`;
  }

  const intro = need("person.intro", CFG);
  if (intro) document.getElementById("hero-intro").textContent = intro;
}

function renderJourney() {
  if (!CFG || !Array.isArray(CFG.journey) || !CFG.journey.length) {
    console.warn('[portfolio] config is missing "journey" — leaving existing content in place.');
    return;
  }
  const rail = '<div class="journey-rail" aria-hidden="true"><div class="journey-rail-fill" id="journey-rail-fill"></div></div>';
  const steps = CFG.journey
    .map((s) => `
      <div class="journey-step">
        <span class="journey-node"></span>
        <p class="journey-index">${s.n || ""}</p>
        <h3 class="journey-title">${s.title || ""}</h3>
        <p class="journey-body">${s.body || ""}</p>
      </div>`)
    .join("");
  document.getElementById("journey").innerHTML = rail + steps;
}

// =========================================================
// ICONS — small hand-written SVGs, no icon library needed.
// Each is just the inner markup; iconSvg() wraps it consistently.
// =========================================================
const ICON_PATHS = {
  github: '<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle>',
  leetcode: '<polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline>',
  resume: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line>',
  email: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>'
};

function iconSvg(name, extraClass) {
  const cls = extraClass ? `link-icon ${extraClass}` : "link-icon";
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name] || ""}</svg>`;
}

const LINK_TOOLTIPS = {
  github: "View GitHub",
  linkedin: "Connect on LinkedIn",
  leetcode: "View LeetCode profile",
  resume: "Download résumé",
  email: "Send an email"
};

function linkMarkup(item, variant) {
  const isPlaceholder = !item.href || item.href === "#";
  const attrs = isPlaceholder
    ? `href="#" data-fill="${item.key}"`
    : `href="${item.href}" target="_blank" rel="noopener"`;
  const tooltip = LINK_TOOLTIPS[item.key] ? `data-tooltip="${LINK_TOOLTIPS[item.key]}"` : "";
  const showExternal = !isPlaceholder && item.key !== "email";

  if (variant === "sidebar") {
    // Button-like row: bright icon + label at rest (not faded), a
    // real background surface, and a hover state with actual lift.
    return `<a ${attrs} ${tooltip} class="connect-row">
      ${iconSvg(item.key, "connect-icon")}
      <span class="link-label">${item.label}</span>
      ${showExternal ? iconSvg("external", "ext-icon") : ""}
    </a>`;
  }

  return `<a ${attrs} ${tooltip} class="icon-link u-line">
    ${iconSvg(item.key)}<span class="link-label">${item.label}</span>${showExternal ? iconSvg("external", "ext-icon") : ""}
  </a>`;
}

function renderSidebarLinks() {
  if (!CFG) return;
  const { links } = CFG;
  const items = [
    { key: "resume", label: "Resume", href: links.resume },
    { key: "github", label: "GitHub", href: links.github },
    { key: "linkedin", label: "LinkedIn", href: links.linkedin },
    { key: "leetcode", label: "LeetCode", href: links.leetcode }
  ];
  const rows = items.map((i) => linkMarkup(i, "sidebar")).join("");
  document.getElementById("sidebar-links").innerHTML = `<p class="connect-label">Let's connect</p>${rows}`;
}

function renderContactLinks() {
  if (!CFG) return;
  const { links } = CFG;
  const items = [
    { key: "email", label: "Email", href: links.email },
    { key: "github", label: "GitHub", href: links.github },
    { key: "linkedin", label: "LinkedIn", href: links.linkedin },
    { key: "leetcode", label: "LeetCode", href: links.leetcode },
    { key: "resume", label: "Resume", href: links.resume }
  ];
  document.getElementById("contact-links").innerHTML = items.map((i) => linkMarkup(i, "")).join("");
}

function renderProjects() {
  if (!CFG || !Array.isArray(CFG.projects) || !CFG.projects.length) {
    console.warn('[portfolio] config is missing "projects" — leaving existing content in place.');
    return;
  }
  const html = CFG.projects
    .map((p, i) => {
      const linkBits = [];
      if (p.links && p.links.live) linkBits.push(`<a href="${p.links.live}" target="_blank" rel="noopener" data-stop class="u-line">Live</a>`);
      if (p.links && p.links.code) linkBits.push(`<a href="${p.links.code}" target="_blank" rel="noopener" data-stop class="u-line">Code</a>`);

      const tags = (p.stack || [])
        .map((t, ti) => `<span style="--i:${ti}">${t}</span>`)
        .join("");

      return `
        <article class="project ${i % 2 ? "offset" : ""}" data-project-index="${i}" tabindex="0" role="button" aria-haspopup="dialog">
          <div class="project-head">
            <h3>${p.name || "Untitled project"}</h3>
            <span class="project-links">${linkBits.join("")}</span>
          </div>
          ${p.tag ? `<p class="project-tag-label">${p.tag}</p>` : ""}
          <p class="project-desc">${p.desc || ""}</p>
          <div class="project-tags">${tags}</div>
          <p class="project-hint">Click for details →</p>
        </article>`;
    })
    .join("");
  document.getElementById("projects-list").innerHTML = html;
}

function renderSkills() {
  if (!CFG || !Array.isArray(CFG.skills) || !CFG.skills.length) {
    console.warn('[portfolio] config is missing "skills" — leaving existing content in place.');
    return;
  }
  document.getElementById("skills-grid").innerHTML = CFG.skills
    .map((s) => {
      const items = Array.isArray(s.items) ? s.items : String(s.items || "").split(",").map((x) => x.trim());
      const badges = items.map((item, i) => `<li style="--i:${i}"><span class="skill-dot"></span>${item}</li>`).join("");
      return `<div class="skill-card"><h3>${s.group || ""}</h3><ul class="skill-items">${badges}</ul></div>`;
    })
    .join("");
}

renderPersonal();
renderJourney();
renderSidebarLinks();
renderContactLinks();
renderProjects();
renderSkills();

document.getElementById("footer-date").textContent = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });

// =========================================================
// CONNECT ROWS — small stagger on load, one time only. GSAP owns
// the transform/opacity during this animation, then explicitly
// clears its inline styles afterward so the CSS hover lift
// (translateX) isn't blocked by a leftover inline transform.
// =========================================================
(function revealConnectRows() {
  const rows = document.querySelectorAll(".connect-row");
  if (!rows.length || !HAS_GSAP || PREFERS_REDUCED) return;
  gsap.fromTo(rows,
    { opacity: 0, x: -10 },
    {
      opacity: 1, x: 0, duration: 0.45, ease: "power2.out", stagger: 0.08, delay: 0.4,
      onComplete: () => gsap.set(rows, { clearProps: "transform,opacity" })
    }
  );
})();

// =========================================================
// JOURNEY — step-level "focus" interaction (hovering one step
// dims the others), same mechanism as before, just retargeted
// from paragraphs to steps.
// =========================================================
(function setupJourneyFocus() {
  const container = document.getElementById("journey");
  const steps = container.querySelectorAll(".journey-step");
  steps.forEach((step) => {
    step.addEventListener("mouseenter", () => container.classList.add("hovering"));
    step.addEventListener("mouseleave", () => container.classList.remove("hovering"));
  });
})();

// =========================================================
// LOADER → HERO INTRO
// Fixed: previously two different pieces of code both set the
// hero name's opacity, in an order that could leave it hidden
// forever if GSAP failed to load. Now there is exactly ONE place
// that hides it (inside runHeroIntro, only on the animated path)
// and it uses gsap.fromTo — which owns both the start AND end
// state in one call — so nothing else can clobber it.
// =========================================================
const loader = document.getElementById("loader");

function finishLoad() {
  if (loader && loader.parentNode) loader.remove();
  runHeroIntro();
}

function runHeroIntro() {
  const chars = document.querySelectorAll(".hero-name .char");
  const words = document.querySelectorAll(".reveal-word");

  if (!HAS_GSAP || PREFERS_REDUCED) {
    // Nothing to hide-then-show — the HTML was already visible
    // by default (see the "Content is visible by DEFAULT" note
    // in style.css). Just make sure nothing is left half-set.
    chars.forEach((el) => { el.style.opacity = ""; el.style.transform = ""; });
    initHeroScramble();
    return;
  }

  // GSAP owns the hidden state here directly (fromTo sets it the
  // moment the tween is created) — no CSS class involved, so there's
  // no CSS transition anywhere nearby to compete with it.
  gsap.timeline()
    .fromTo(chars, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.65, stagger: 0.035, ease: "power3.out" })
    .fromTo(words, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }, 0.3)
    .call(initHeroScramble);
}

if (!loader) {
  runHeroIntro();
} else if (PREFERS_REDUCED || !HAS_GSAP) {
  finishLoad();
} else {
  gsap.to(".loader-mark", { opacity: 1, duration: 0.4, delay: 0.15 });
  gsap.to(loader, { opacity: 0, duration: 0.5, delay: 0.9, ease: "power2.inOut", onComplete: finishLoad });
}

// =========================================================
// NAME SCRAMBLE — the one signature interaction tied to identity.
// After the load-in stagger finishes, the per-letter spans are
// replaced with plain text so hovering can scramble it. Runs
// once per hover, settles back to the real name.
// =========================================================
function initHeroScramble() {
  const nameEl = document.getElementById("hero-name");
  const finalText = nameEl.dataset.fallback || nameEl.textContent;
  if (IS_TOUCH || PREFERS_REDUCED) return;

  nameEl.innerHTML = `<span id="scramble-target">${finalText.slice(0, -1)}</span><span class="dot">${finalText.slice(-1)}</span>`;
  const target = document.getElementById("scramble-target");
  const glyphs = "!<>-_\\/[]{}=+*^?#$%&";
  let running = false;

  nameEl.addEventListener("mouseenter", () => {
    if (running) return;
    running = true;
    const chars = finalText.slice(0, -1).split("");
    const totalFrames = 22;
    let frame = 0;

    function step() {
      target.textContent = chars
        .map((ch, i) => {
          const revealAt = (i / chars.length) * totalFrames * 0.6;
          return frame > revealAt ? ch : glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");
      frame++;
      if (frame <= totalFrames) requestAnimationFrame(step);
      else { target.textContent = chars.join(""); running = false; }
    }
    step();
  });
}

// =========================================================
// SMOOTH SCROLL (Lenis)
// =========================================================
if (HAS_LENIS && !PREFERS_REDUCED) {
  const lenis = new Lenis({ duration: 1.05, easing: (t) => 1 - Math.pow(1 - t, 3) });
  if (HAS_GSAP) {
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })();
  }
  if (HAS_SCROLLTRIGGER) lenis.on("scroll", ScrollTrigger.update);
}

// =========================================================
// SCROLL DEPTH — sections ease in with a touch of scale + blur
// as they cross into view, scrubbed to scroll position rather
// than a binary on/off toggle. Kept subtle: 4% scale, 3px blur.
// =========================================================
if (HAS_GSAP && HAS_SCROLLTRIGGER && !PREFERS_REDUCED) {
  gsap.utils.toArray(".section").forEach((section) => {
    gsap.fromTo(
      section,
      { autoAlpha: 0, y: 24, scale: 0.97, filter: "blur(3px)" },
      {
        autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", ease: "none",
        scrollTrigger: { trigger: section, start: "top 88%", end: "top 55%", scrub: 0.4 }
      }
    );
  });

  // Batched, performant reveal for the many repeated project/skill
  // elements — one shared trigger per group instead of per element.
  ScrollTrigger.batch(".project", {
    start: "top 85%",
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.08 })
  });
  ScrollTrigger.batch(".skill-card", {
    start: "top 88%",
    onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", stagger: 0.06 })
  });

  // Rail fill — one tween, tracks scroll progress through the whole
  // journey block. This is the "timeline" from the brief: functional,
  // not decorative, since its length IS the read progress.
  gsap.to("#journey-rail-fill", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: { trigger: "#journey", start: "top 65%", end: "bottom 55%", scrub: 0.3 }
  });

  // Each step gets its own entrance (fade + rise + blur-in) AND its
  // own "active" toggle (node fills, title brightens) as it becomes
  // the checkpoint currently being read — two different triggers
  // because they cover different points in the scroll range.
  document.querySelectorAll(".journey-step").forEach((step) => {
    gsap.fromTo(step,
      { opacity: 0, y: 20, filter: "blur(6px)" },
      {
        opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "power2.out",
        scrollTrigger: { trigger: step, start: "top 85%" },
        onComplete: () => step.classList.add("revealed")
      }
    );
    ScrollTrigger.create({
      trigger: step,
      start: "top 60%",
      end: "bottom 40%",
      toggleClass: { targets: step, className: "active" }
    });
  });

  // A small parallax drift on the whole grid as the section scrolls
  // past — cheap because it's one tween on one container, not per card.
  gsap.to("#skills-grid", {
    y: -22,
    ease: "none",
    scrollTrigger: { trigger: "#skills", start: "top bottom", end: "bottom top", scrub: 0.6 }
  });
} else {
  document.querySelectorAll(".journey-step").forEach((el) => el.classList.add("revealed"));
  document.querySelectorAll(".section").forEach((el) => el.classList.add("prep-hidden", "scroll-fallback"));
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
// SCROLL-SPY NAV — sliding indicator with a spring ease, plus
// a lighter "preview" position on hover that snaps back to the
// real active section on mouseleave.
// =========================================================
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
const navIndicator = document.getElementById("nav-indicator");
const sections = document.querySelectorAll("main .section");
let activeLink = null;

function moveIndicatorTo(link, isPreview) {
  if (!link) return;
  const linkRect = link.getBoundingClientRect();
  const navRect = link.closest(".side-nav").getBoundingClientRect();
  const top = linkRect.top - navRect.top + linkRect.height / 2 - 0.5;
  navIndicator.classList.add("visible");
  navIndicator.classList.toggle("preview", !!isPreview);
  if (HAS_GSAP) {
    gsap.to(navIndicator, { top, duration: 0.5, ease: PREFERS_REDUCED ? "power1.out" : "elastic.out(1, 0.75)" });
  } else {
    navIndicator.style.top = `${top}px`;
  }
}

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        activeLink = navLinks.find((l) => l.getAttribute("href") === `#${id}`) || activeLink;
        navLinks.forEach((l) => l.classList.toggle("active", l === activeLink));
        moveIndicatorTo(activeLink, false);
      }
    });
  },
  { rootMargin: "-45% 0px -45% 0px" }
);
sections.forEach((section) => navObserver.observe(section));

navLinks.forEach((link) => {
  link.addEventListener("mouseenter", () => moveIndicatorTo(link, true));
  link.addEventListener("mouseleave", () => moveIndicatorTo(activeLink, false));
});

// =========================================================
// BACK TO TOP / SCROLL PROGRESS RING
// =========================================================
(function setupProgress() {
  const btn = document.getElementById("back-to-top");
  const ring = document.getElementById("ring-fill");
  const circumference = 106.8;

  function update() {
    const scrollTop = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(scrollTop / max, 1) : 0;
    ring.style.strokeDashoffset = String(circumference * (1 - pct));
    btn.classList.toggle("visible", scrollTop > window.innerHeight * 0.6);
  }

  window.addEventListener("scroll", update, { passive: true });
  if (HAS_SCROLLTRIGGER) ScrollTrigger.addEventListener("refresh", update);
  update();

  btn.addEventListener("click", () => {
    document.getElementById("top").scrollIntoView({ behavior: PREFERS_REDUCED ? "auto" : "smooth" });
  });
})();

// =========================================================
// POINTER EFFECTS — ONE rAF loop drives the spotlight, cursor
// dot, and magnetic pull together, instead of each having its
// own mousemove handler doing its own layout reads. Magnetic
// elements only react inside a proximity radius, with force
// that falls off by distance (direction-aware, distance-aware).
// =========================================================
if (!IS_TOUCH) {
  const dot = document.querySelector(".cursor-dot");
  const spotlight = document.getElementById("spotlight");
  let mouseX = -9999, mouseY = -9999;
  let shown = false;

  const magneticEls = Array.from(document.querySelectorAll(".magnetic")).map((el) => ({
    el,
    radius: 90,
    quickX: HAS_GSAP ? gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" }) : null,
    quickY: HAS_GSAP ? gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" }) : null,
    rect: null
  }));

  function cacheRects() {
    magneticEls.forEach((m) => { m.rect = m.el.getBoundingClientRect(); });
  }
  cacheRects();
  window.addEventListener("resize", debounce(cacheRects, 150));

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!shown) {
      dot.classList.add("visible");
      spotlight.classList.add("visible");
      shown = true;
    }
  }, { passive: true });

  document.querySelectorAll("a, button, .project, .skill-card").forEach((el) => {
    el.addEventListener("mouseenter", () => { dot.classList.add("hovering"); spotlight.classList.add("tight"); });
    el.addEventListener("mouseleave", () => { dot.classList.remove("hovering"); spotlight.classList.remove("tight"); });
  });

  function tick() {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
    spotlight.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    if (!PREFERS_REDUCED) {
      magneticEls.forEach((m) => {
        if (!m.rect) return;
        const cx = m.rect.left + m.rect.width / 2;
        const cy = m.rect.top + m.rect.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < m.radius) {
          const strength = 1 - dist / m.radius;
          const pull = 0.35 * strength;
          if (m.quickX) { m.quickX(dx * pull); m.quickY(dy * pull); }
        } else if (m.quickX) {
          m.quickX(0); m.quickY(0);
        }
      });
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
} else {
  document.querySelector(".cursor-dot").style.display = "none";
  document.getElementById("spotlight").style.display = "none";
}

function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// =========================================================
// PROJECT + SKILL CARD TILT — one reusable function, applied to
// both. Cheap enough (12 elements total) to run per-element.
// =========================================================
function applyTilt(selector, maxDeg) {
  if (IS_TOUCH) return;
  document.querySelectorAll(selector).forEach((card) => {
    const quickRotX = HAS_GSAP ? gsap.quickTo(card, "rotateX", { duration: 0.25, ease: "power2" }) : null;
    const quickRotY = HAS_GSAP ? gsap.quickTo(card, "rotateY", { duration: 0.25, ease: "power2" }) : null;
    if (HAS_GSAP) gsap.set(card, { transformPerspective: 700 });

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      if (quickRotX) {
        quickRotX(-y * maxDeg);
        quickRotY(x * maxDeg);
      } else {
        card.style.transform = `perspective(700px) rotateX(${(-y * maxDeg).toFixed(2)}deg) rotateY(${(x * maxDeg).toFixed(2)}deg)`;
      }
    });
    card.addEventListener("mouseleave", () => {
      if (quickRotX) { quickRotX(0); quickRotY(0); }
      else card.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg)";
    });
  });
}

applyTilt(".project", 2.2);
applyTilt(".skill-card", 3);

// =========================================================
// PROJECT MODAL — opens with a FLIP-style transition from the
// clicked card's actual position/size into the modal's resting
// position, so it reads as the card expanding rather than a
// new box appearing from nowhere.
// =========================================================
const backdrop = document.getElementById("modal-backdrop");
const modal = document.getElementById("modal");
let lastFocused = null;
if (!HAS_GSAP) modal.classList.add("fallback-anim");

function openModal(index, originEl) {
  const project = (CFG && CFG.projects && CFG.projects[index]) || null;
  if (!project) return;

  document.getElementById("modal-tag").textContent = project.tag || "";
  document.getElementById("modal-title").textContent = project.name || "";
  document.getElementById("modal-detail").textContent = project.detail || project.desc || "";
  document.getElementById("modal-highlights").innerHTML = (project.highlights || []).map((h) => `<li>${h}</li>`).join("");
  document.getElementById("modal-stack").innerHTML = (project.stack || []).map((t) => `<span>${t}</span>`).join("");

  // Procedural preview panel — angled two-tone wash, varied by
  // index, standing in for a real screenshot until one exists.
  const angle = 120 + index * 35;
  document.getElementById("modal-preview").style.background =
    `linear-gradient(${angle}deg, var(--bg-card), var(--bg-elevated) 55%, var(--accent-glow))`;

  const linkHtml = [];
  if (project.links && project.links.live) linkHtml.push(`<a href="${project.links.live}" target="_blank" rel="noopener" class="primary">View live</a>`);
  if (project.links && project.links.code) linkHtml.push(`<a href="${project.links.code}" target="_blank" rel="noopener">View code</a>`);
  document.getElementById("modal-links").innerHTML = linkHtml.join("");

  lastFocused = document.activeElement;
  backdrop.classList.add("open");
  document.body.classList.add("modal-locked");

  if (HAS_GSAP && originEl && !PREFERS_REDUCED) {
    const from = originEl.getBoundingClientRect();
    const to = modal.getBoundingClientRect();
    const scaleX = Math.max(from.width / to.width, 0.3);
    const scaleY = Math.max(from.height / to.height, 0.3);
    const dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    const dy = (from.top + from.height / 2) - (to.top + to.height / 2);
    gsap.fromTo(modal,
      { x: dx, y: dy, scaleX, scaleY, opacity: 0.5 },
      { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1, duration: 0.5, ease: "power3.out" }
    );
  }

  document.getElementById("modal-close").focus();
}

function closeModal() {
  backdrop.classList.remove("open");
  document.body.classList.remove("modal-locked");
  if (HAS_GSAP) gsap.set(modal, { clearProps: "transform,opacity" });
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll(".project").forEach((card) => {
  card.addEventListener("click", (e) => {
    if (e.target.closest("[data-stop]")) return;
    openModal(Number(card.dataset.projectIndex), card);
  });
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(Number(card.dataset.projectIndex), card);
    }
  });
});

document.getElementById("modal-close").addEventListener("click", closeModal);
backdrop.addEventListener("click", (e) => { if (e.target === backdrop) closeModal(); });

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
// KEYBOARD SECTION NAVIGATION
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
// CONTACT FORM
// =========================================================
const form = document.getElementById("contact-form");
const note = document.getElementById("form-note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = form.name.value.trim();
  note.textContent = `Thanks${name ? ", " + name : ""} — this form isn't wired to anything yet. Email me directly for now.`;
});

// =========================================================
// PLACEHOLDER LINK WARNING
// =========================================================
document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-fill]");
  if (link && link.getAttribute("href") === "#") {
    e.preventDefault();
    console.warn(`[portfolio] "${link.dataset.fill}" isn't set yet — update it in config.js.`);
  }
});
