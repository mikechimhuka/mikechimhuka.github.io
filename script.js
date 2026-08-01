const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
const glow = document.querySelector(".cursor-glow");

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(isOpen));
    menuBtn.textContent = isOpen ? "\u00D7" : "\u2630";
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.textContent = "\u2630";
    });
  });
}

if (glow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("show"));
}

const counters = document.querySelectorAll("[data-count]");

const animateCounter = (element) => {
  const target = Number(element.dataset.count);
  if (!Number.isFinite(target) || target < 0) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    element.textContent = `${target.toLocaleString()}${target >= 10 ? "+" : ""}`;
    return;
  }

  const duration = 1100;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(target * eased);

    element.textContent = progress === 1
      ? `${target.toLocaleString()}${target >= 10 ? "+" : ""}`
      : current.toLocaleString();

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach(animateCounter);
}

const certCards = document.querySelectorAll(".cert-card[data-cert]");
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");
const certClose = document.getElementById("certClose");

let lastFocusedElement = null;

const closeCertificate = () => {
  if (!certModal || !certModalImg) return;

  certModal.classList.remove("active");
  certModal.setAttribute("aria-hidden", "true");
  certModalImg.removeAttribute("src");
  document.body.classList.remove("modal-open");

  if (lastFocusedElement instanceof HTMLElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const openCertificate = (card) => {
  const certPath = card.dataset.cert;
  if (!certPath) return;

  lastFocusedElement = document.activeElement;

  if (certModal && certModalImg) {
    certModalImg.src = certPath;
    certModalImg.alt = `${card.querySelector("h3")?.textContent || "Selected"} certificate`;
    certModal.classList.add("active");
    certModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    certClose?.focus();
  }
};

certCards.forEach((card) => {
  card.setAttribute("tabindex", "0");
  card.setAttribute("role", "button");
  card.setAttribute("aria-label", `View ${card.querySelector("h3")?.textContent || "certificate"}`);

  card.addEventListener("click", () => openCertificate(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openCertificate(card);
    }
  });
});

certClose?.addEventListener("click", closeCertificate);

certModal?.addEventListener("click", (event) => {
  if (event.target === certModal) closeCertificate();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && certModal?.classList.contains("active")) {
    closeCertificate();
  }
});
