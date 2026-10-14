/* SolarOS — Shared JS */

// ── Nav scroll effect ──────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile nav ─────────────────────────────────────────────
const burger = document.querySelector('.nav-burger');
const mobileNav = document.querySelector('.nav-mobile');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    burger.textContent = mobileNav.classList.contains('open') ? '✕' : '☰';
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.textContent = '☰';
  }));
}

// ── Active nav link ────────────────────────────────────────
(function setActiveNav() {
  const path = location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href').replace(/\/$/, '') || '/';
    if (href === path || (path === '' && href === '/') || (path !== '/' && href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    }
  });
})();

// ── Scroll reveal ──────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Counter animation ──────────────────────────────────────
function animateCounter(el, end, duration = 2000, suffix = '') {
  const start = performance.now();
  const startVal = 0;
  const isDecimal = String(end).includes('.');
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = startVal + (end - startVal) * ease;
    el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Trigger counters when in view
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (raw) animateCounter(el, parseFloat(raw), 2200, suffix);
    statObserver.unobserve(el);
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));

// ── Hero bar animation ─────────────────────────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.bar-fill').forEach(el => {
    const w = el.dataset.width || '0%';
    setTimeout(() => { el.style.width = w; }, 400);
  });
});

// ── Toast ──────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;padding:14px 22px;border-radius:12px;font-family:Inter,sans-serif;font-size:.9rem;font-weight:500;color:#fff;background:${type==='success'?'#00d4aa':'#ff7c20'};box-shadow:0 8px 32px rgba(0,0,0,.4);transition:all .3s;transform:translateY(12px);opacity:0;`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'none'; t.style.opacity = '1'; });
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(12px)'; setTimeout(() => t.remove(), 300); }, 3500);
}

// ── Contact form ───────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      showToast('Message sent! We\'ll be in touch soon. ☀️');
      contactForm.reset();
      btn.textContent = 'Send Message';
      btn.disabled = false;
    }, 1400);
  });
}
