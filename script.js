// ===================== RFC STUDIO =====================

// Where inquiries are sent. Replace with your business email.
const CONTACT_EMAIL = "hello@rfcstudio.com";

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

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
document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Reveal on scroll
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
document.querySelectorAll(".reveal").forEach((el, i) => {
  // small stagger for siblings
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
  el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 70}ms`;
  revealObs.observe(el);
});

// Animated counters
const formatNum = (n) => n.toLocaleString("en-US");
const countObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const duration = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = formatNum(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      countObs.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll("[data-count]").forEach((el) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = formatNum(+el.dataset.count);
  } else {
    countObs.observe(el);
  }
});

// Services accordion (one open at a time)
const heads = document.querySelectorAll(".service-head");
heads.forEach((btn) =>
  btn.addEventListener("click", () => {
    const isOpen = btn.getAttribute("aria-expanded") === "true";
    heads.forEach((b) => b.setAttribute("aria-expanded", "false"));
    btn.setAttribute("aria-expanded", String(!isOpen));
  })
);

// FAQ: close others when one opens
const faqs = document.querySelectorAll(".faq details");
faqs.forEach((d) =>
  d.addEventListener("toggle", () => {
    if (d.open) faqs.forEach((o) => o !== d && (o.open = false));
  })
);

// Inquiry form -> opens the visitor's email app with everything filled in
const form = document.getElementById("inquiry-form");
const status = form.querySelector(".form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  let valid = true;

  ["name", "email", "message"].forEach((name) => {
    const input = form.elements[name];
    const ok = name === "email" ? /^\S+@\S+\.\S+$/.test(input.value.trim()) : input.value.trim() !== "";
    input.closest(".field").classList.toggle("invalid", !ok);
    if (!ok) valid = false;
  });

  if (!valid) {
    status.className = "form-status err";
    status.textContent = "Please fill in your name, a valid email, and a few words about your project.";
    return;
  }

  const services = data.getAll("service").join(", ") || "Not specified";
  const body = [
    `Name: ${data.get("name")}`,
    `Email: ${data.get("email")}`,
    `Company / Brand: ${data.get("company") || "—"}`,
    `Service(s): ${services}`,
    `Number of videos: ${data.get("quantity") || "—"}`,
    `Timeline: ${data.get("timeline") || "—"}`,
    "",
    "Project details:",
    data.get("message"),
  ].join("\n");

  const subject = `New project inquiry — ${data.get("company") || data.get("name")}`;
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.className = "form-status ok";
  status.textContent = "Thanks! Your email app should open with your inquiry ready to send.";
});

// Project videos -> play in a pop-up
const modal = document.getElementById("video-modal");
const frame = modal.querySelector(".vm-frame");
const openLink = modal.querySelector(".vm-open");

function closeVideo() {
  frame.innerHTML = ""; // stops playback
  if (modal.open) modal.close();
}
document.querySelectorAll("[data-embed]").forEach((el) =>
  el.addEventListener("click", () => {
    frame.className = `vm-frame ${el.dataset.ratio}`;
    frame.innerHTML = `<iframe src="${el.dataset.embed}" title="Project video" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;
    openLink.href = el.dataset.link;
    openLink.querySelector("span").textContent = el.dataset.kind;
    modal.showModal();
  })
);
modal.querySelector(".vm-close").addEventListener("click", closeVideo);
modal.addEventListener("click", (e) => { if (e.target === modal) closeVideo(); });
modal.addEventListener("cancel", (e) => { e.preventDefault(); closeVideo(); });
