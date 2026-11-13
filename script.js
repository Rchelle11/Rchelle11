// ===================== RFC STUDIO =====================

// Where inquiries are sent. Replace with your business email.
const CONTACT_EMAIL = "hello@rfcstudio.com";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Footer year
document.querySelectorAll(".year").forEach((el) => (el.textContent = new Date().getFullYear()));

// Nav: background on scroll + mobile menu
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".menu-toggle");
const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

// Reveal on scroll (with a small stagger between siblings)
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => {
  const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(sibs.indexOf(el), 6) * 80}ms`;
  revealObs.observe(el);
});

// Animated counters
const fmt = (n, short) => {
  if (short && n >= 1e6) return (n / 1e6).toFixed(2).replace(/0$/, "") + "M";
  if (short && n >= 1e3) return Math.round(n / 1e3) + "K";
  return n.toLocaleString("en-US");
};
const countObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const short = el.dataset.format === "short";
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1800, 1);
        el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))), short);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  },
  { threshold: 0.4 }
);
document.querySelectorAll("[data-count]").forEach((el) => {
  if (reduceMotion) el.textContent = fmt(+el.dataset.count, el.dataset.format === "short");
  else countObs.observe(el);
});

// FAQ: one open at a time
const faqs = document.querySelectorAll(".faq details");
faqs.forEach((d) =>
  d.addEventListener("toggle", () => {
    if (d.open) faqs.forEach((o) => o !== d && (o.open = false));
  })
);

// Project videos -> pop-up player
const modal = document.getElementById("video-modal");
if (modal) {
  const frame = modal.querySelector(".vm-frame");
  const openLink = modal.querySelector(".vm-open");
  const closeVideo = () => {
    frame.innerHTML = "";
    if (modal.open) modal.close();
  };
  document.querySelectorAll("[data-embed]").forEach((el) =>
    el.addEventListener("click", () => {
      frame.className = `vm-frame ${el.dataset.ratio}`;
      frame.innerHTML = `<iframe src="${el.dataset.embed}" title="Project video" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
      openLink.href = el.dataset.link;
      openLink.querySelector("span").textContent = el.dataset.kind;
      modal.showModal();
    })
  );
  modal.querySelector(".vm-close").addEventListener("click", closeVideo);
  modal.addEventListener("click", (e) => e.target === modal && closeVideo());
  modal.addEventListener("cancel", (e) => {
    e.preventDefault();
    closeVideo();
  });
}

// Inquiry form -> opens the visitor's email app with everything filled in
const form = document.getElementById("inquiry-form");
if (form) {
  const status = form.querySelector(".form-status");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    let valid = true;
    ["name", "email", "message"].forEach((name) => {
      const input = form.elements[name];
      const v = input.value.trim();
      const ok = name === "email" ? /^\S+@\S+\.\S+$/.test(v) : v !== "";
      input.closest(".field").classList.toggle("invalid", !ok);
      if (!ok) valid = false;
    });
    if (!valid) {
      status.className = "form-status err";
      status.textContent = "Please add your name, a valid email, and a few words about your project.";
      return;
    }
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Company / Brand: ${data.get("company") || "—"}`,
      `Starting point: ${data.get("package") || "—"}`,
      `Service(s): ${data.getAll("service").join(", ") || "Not specified"}`,
      `Number of videos: ${data.get("quantity") || "—"}`,
      `Timeline: ${data.get("timeline") || "—"}`,
      "",
      "Project details:",
      data.get("message"),
    ].join("\n");
    const subject = `${form.elements.package ? "New booking request" : "New project inquiry"} — ${data.get("company") || data.get("name")}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    status.className = "form-status ok";
    status.textContent = "Thanks! Your email app should open with your inquiry ready to send.";
  });
}

// Book page: package buttons pre-fill the form
document.querySelectorAll("[data-package]").forEach((btn) =>
  btn.addEventListener("click", () => {
    const f = document.getElementById("inquiry-form");
    if (!f) return;
    const radio = f.querySelector(`input[name="package"][value="${btn.dataset.package}"]`);
    if (radio) radio.checked = true;
    if (btn.dataset.qty && f.elements.quantity) f.elements.quantity.value = btn.dataset.qty;
  })
);
