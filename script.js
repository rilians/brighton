const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.querySelector(".sr-only").textContent = isExpanded ? "Buka menu" : "Tutup menu";
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "Buka menu";
    siteNav.classList.remove("is-open");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.querySelector(".sr-only").textContent = "Buka menu";
    siteNav.classList.remove("is-open");
    menuToggle.focus();
  }
});

const artworkDialog = document.querySelector(".artwork-dialog");
const dialogImage = document.querySelector(".dialog-image");
const dialogCaption = document.querySelector(".dialog-caption");

artworkDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    artworkDialog.close();
  }
});

const scrollProgress = document.querySelector(".scroll-progress");
let progressFrame = 0;

const updateScrollProgress = () => {
  if (progressFrame) {
    return;
  }

  progressFrame = window.requestAnimationFrame(() => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
    scrollProgress.style.transform = `scaleX(${Math.min(progress, 1)})`;
    progressFrame = 0;
  });
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

if ("IntersectionObserver" in window) {
  const revealTargets = document.querySelectorAll(
    ".story-grid, .story-stats, .collection-heading, .artwork-card, .identity-grid, .identity-banner"
  );
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("reveal-pending");
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.body.classList.add("motion-ready");
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal-pending");
    if (target.classList.contains("artwork-card")) {
      target.style.animationDelay = `${(index % 3) * 90}ms`;
    }
    revealObserver.observe(target);
  });
}

document.querySelectorAll(".artwork-card").forEach((card) => {
  card.addEventListener("click", () => {
    const image = card.querySelector("img");
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialogCaption.textContent = card.dataset.title;
    artworkDialog.showModal();
  });
});

document.querySelector(".dialog-close").addEventListener("click", () => {
  artworkDialog.close();
});

artworkDialog.addEventListener("click", (event) => {
  if (event.target === artworkDialog) {
    artworkDialog.close();
  }
});
