/* ── Selectors ──────────────────────────────────────── */
const navbar     = document.getElementById("navbar");
const menuBtn    = document.getElementById("menu-btn");
const navLinks   = document.getElementById("nav-links");
const allAnchors = document.querySelectorAll('a[href^="#"]');
const menuAnchors = navLinks.querySelectorAll('a[href^="#"]');
const sections   = document.querySelectorAll("section[id]");
const reveals    = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");
const projectCards = document.querySelectorAll(".project-card");

/* ── Mobile menu ────────────────────────────────────── */
function openMenu() {
  navLinks.classList.add("is-open");
  menuBtn.classList.add("is-open");
  menuBtn.setAttribute("aria-expanded", "true");
  menuBtn.setAttribute("aria-label", "Close menu");
  document.body.style.overflow = "hidden";
}

function closeMenu() {
  navLinks.classList.remove("is-open");
  menuBtn.classList.remove("is-open");
  menuBtn.setAttribute("aria-expanded", "false");
  menuBtn.setAttribute("aria-label", "Open menu");
  document.body.style.overflow = "";
}

function toggleMenu() {
  navLinks.classList.contains("is-open") ? closeMenu() : openMenu();
}

menuBtn.addEventListener("click", toggleMenu);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeMenu();
});

/* ── Smooth scroll ──────────────────────────────────── */
allAnchors.forEach(function (link) {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    closeMenu();
    const offset = navbar.offsetHeight;
    window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
  });
});

/* ── Navbar scroll state ────────────────────────────── */
function updateNavbar() {
  navbar.classList.toggle("is-scrolled", window.scrollY > 24);
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

/* ── Active section spy ─────────────────────────────── */
const sectionObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        menuAnchors.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  },
  { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.1, 0.25, 0.5] }
);

sections.forEach(function (s) { sectionObserver.observe(s); });

/* ── Reveal on scroll ───────────────────────────────── */
const revealObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
);

if (window.IntersectionObserver) {
  reveals.forEach(function (el) { revealObserver.observe(el); });
} else {
  reveals.forEach(function (el) { el.classList.add("is-visible"); });
}

/* ── Skill bars ─────────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        const level = entry.target.getAttribute("data-level") || "0";
        setTimeout(function () {
          entry.target.style.width = level + "%";
        }, 100);
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.4 }
);

skillFills.forEach(function (fill) { skillObserver.observe(fill); });

/* ── Project card spotlight ─────────────────────────── */
projectCards.forEach(function (card) {
  card.addEventListener("mousemove", function (e) {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty("--mx", x + "%");
    card.style.setProperty("--my", y + "%");
  });
});
