/* CM6 — interactions */
(function () {
  "use strict";

  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");

  // Year in footer
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Header height (for mobile menu placement) + shadow on scroll
  const setHeaderH = () =>
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  setHeaderH();
  window.addEventListener("resize", setHeaderH);
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Ouvrir le menu");
  };
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });

  // Active nav link by section in view
  const links = [...menu.querySelectorAll('a[href^="#"]:not(.btn)')];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  // Animated counters (only when a real value is set in data-count)
  const counters = document.querySelectorAll("[data-count]");
  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10);
    if (!target) return; // keep placeholder "—" until real figures are provided
    const suffix = el.dataset.suffix || "";
    const dur = 1600;
    const start = performance.now();
    const fmt = new Intl.NumberFormat("fr-FR");
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt.format(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animate(entry.target); obs.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((c) => co.observe(c));
  } else {
    counters.forEach(animate);
  }

  // Programme filters
  const chips = document.querySelectorAll(".chip");
  const programs = document.querySelectorAll(".program");
  chips.forEach((chip) => chip.addEventListener("click", () => {
    chips.forEach((c) => { c.classList.remove("is-active"); c.setAttribute("aria-pressed", "false"); });
    chip.classList.add("is-active");
    chip.setAttribute("aria-pressed", "true");
    const f = chip.dataset.filter;
    programs.forEach((p) => {
      const show = f === "all" || p.dataset.cat === f;
      p.classList.toggle("is-hidden", !show);
      if (show) p.classList.add("is-visible");
    });
  }));

  // Forms (front-end validation only — connect to a backend/service before going live)
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const contact = document.getElementById("contact-form");
  if (contact) {
    contact.addEventListener("submit", (e) => {
      e.preventDefault();
      const status = contact.querySelector(".form__status");
      let ok = true;
      contact.querySelectorAll("[required]").forEach((field) => {
        const valid = field.type === "email" ? isEmail(field.value.trim()) : field.value.trim() !== "";
        field.classList.toggle("is-invalid", !valid);
        field.setAttribute("aria-invalid", String(!valid));
        if (!valid) ok = false;
      });
      status.className = "form__status " + (ok ? "ok" : "err");
      status.textContent = ok
        ? "Merci ! Votre message a bien été pris en compte."
        : "Merci de compléter correctement les champs requis.";
      if (ok) contact.reset();
    });
  }

  const nl = document.getElementById("newsletter-form");
  if (nl) {
    nl.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = nl.querySelector("input");
      const status = document.querySelector(".newsletter__status");
      const ok = isEmail(input.value.trim());
      status.className = "newsletter__status " + (ok ? "ok" : "err");
      status.textContent = ok ? "Inscription enregistrée." : "Adresse e-mail invalide.";
      if (ok) nl.reset();
    });
  }
})();
