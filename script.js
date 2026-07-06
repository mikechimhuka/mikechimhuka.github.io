const root = document.documentElement;
const toggle = document.getElementById('themeToggle');
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('nav');
const glow = document.querySelector('.cursor-glow');

toggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  toggle.textContent = next === 'light' ? '☀' : '☾';
  localStorage.setItem('portfolio-theme', next);
});

const savedTheme = localStorage.getItem('portfolio-theme');
if (savedTheme) {
  root.setAttribute('data-theme', savedTheme);
  toggle.textContent = savedTheme === 'light' ? '☀' : '☾';
}

menuBtn.addEventListener('click', () => nav.classList.toggle('open'));
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => nav.classList.remove('open')));

window.addEventListener('pointermove', (event) => {
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 45));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + (target >= 10 ? '+' : '');
        clearInterval(timer);
      } else {
        el.textContent = current;
      }
    }, 22);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

counters.forEach(counter => counterObserver.observe(counter));
const certCards = document.querySelectorAll(".cert-card[data-cert]");
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");
const certClose = document.getElementById("certClose");

certCards.forEach((card) => {
  card.addEventListener("click", () => {
    certModalImg.src = card.dataset.cert;
    certModal.classList.add("active");
  });
});

certClose.addEventListener("click", () => {
  certModal.classList.remove("active");
  certModalImg.src = "";
});

certModal.addEventListener("click", (e) => {
  if (e.target === certModal) {
    certModal.classList.remove("active");
    certModalImg.src = "";
  }
});
