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

// ── Scroll reveal (normal .reveal + .reveal-cta) ───────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // Slight stagger for sibling reveals triggered at same moment
      const siblings = e.target.parentElement
        ? [...e.target.parentElement.querySelectorAll('.reveal:not(.visible), .reveal-cta:not(.visible)')]
        : [];
      const idx = siblings.indexOf(e.target);
      const delay = Math.min(idx * 80, 400);
      setTimeout(() => e.target.classList.add('visible'), delay);
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal, .reveal-cta').forEach(el => revealObs.observe(el));

// ── Counter animation ──────────────────────────────────────
function animateCounter(el, end, duration = 2000, suffix = '') {
  const start = performance.now();
  const isDecimal = String(end).includes('.');
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    const val = (end * ease);
    el.textContent = (isDecimal ? val.toFixed(1) : Math.round(val).toLocaleString()) + suffix;
    if (p < 1) {
      requestAnimationFrame(step);
    } else {
      el.classList.add('counted');
    }
  }
  requestAnimationFrame(step);
}

const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const raw = el.dataset.count;
    const suffix = el.dataset.suffix || '';
    if (raw) animateCounter(el, parseFloat(raw), 2000, suffix);
    statObs.unobserve(el);
  });
}, { threshold: .4 });
document.querySelectorAll('[data-count]').forEach(el => statObs.observe(el));

// ── Hero bar animation ─────────────────────────────────────
window.addEventListener('load', () => {
  document.querySelectorAll('.bar-fill').forEach((el, i) => {
    const w = el.dataset.width || '0%';
    setTimeout(() => { el.style.width = w; }, 600 + i * 150);
  });
});

// ── Parallax on img-row images ─────────────────────────────
const parallaxImgs = document.querySelectorAll('.img-row-img img, .hero-bg');
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    parallaxImgs.forEach(img => {
      const rect = img.closest('.img-row-img, .hero-bg') ? img.parentElement.getBoundingClientRect() : null;
      if (!rect) return;
      const offset = ((rect.top + rect.height / 2) - window.innerHeight / 2) * 0.07;
      img.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

// ── Ticking live kW on hero card ──────────────────────────
(function liveKw() {
  const kpiEl = document.querySelector('.hero-card-kpi');
  if (!kpiEl) return;
  let base = 8.4;
  setInterval(() => {
    base = Math.max(5.0, Math.min(12.0, base + (Math.random() - 0.48) * 0.15));
    kpiEl.textContent = base.toFixed(1) + ' kW';
  }, 3200);
})();

// ── Trusted logos duplicate for infinite scroll ───────────
(function setupLogoScroll() {
  const logos = document.querySelector('.trusted-logos');
  if (!logos) return;
  // Only scroll if logos overflow container
  logos.innerHTML += logos.innerHTML; // duplicate
})();

// ── Toast ──────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:28px;right:28px;z-index:9999;padding:14px 22px;border-radius:12px;font-family:Inter,sans-serif;font-size:.9rem;font-weight:500;color:#fff;background:${type==='success'?'#00d4aa':'#ff7c20'};box-shadow:0 8px 32px rgba(0,0,0,.4);transition:all .4s cubic-bezier(.16,1,.3,1);transform:translateY(16px);opacity:0;`;
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.transform = 'none'; t.style.opacity = '1'; });
  setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(16px)'; setTimeout(() => t.remove(), 400); }, 3500);
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

// ── Cursor ripple on buttons ───────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const r = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    r.style.cssText = `position:absolute;border-radius:50%;background:rgba(255,255,255,.25);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size/2}px;top:${e.clientY - rect.top - size/2}px;pointer-events:none;animation:ripple .6s ease-out forwards;`;
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(r);
    setTimeout(() => r.remove(), 700);
  });
});
