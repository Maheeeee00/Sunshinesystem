/* ============================================================
   Sunshine Solar — main.js
   Scroll reveals, animated counters, nav, ticker
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ── Animated Counters ── */
  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();
    function step(ts) {
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = current.toLocaleString('en-PK') + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  if (counterEls.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.4 });
    counterEls.forEach(el => cio.observe(el));
  }

  /* ── Sticky nav shadow on scroll ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 32px rgba(0,0,0,.6)';
      } else {
        navbar.style.boxShadow = '0 2px 24px rgba(0,0,0,.4)';
      }
    }, { passive: true });
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ── Hover glow on service/product cards ── */
  document.querySelectorAll('.service-card, .product-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(249,115,22,.07), var(--navy-card) 60%)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  /* ── Savings pulse animation ── */
  const savingVal = document.querySelector('.hib-val');
  if (savingVal) {
    setInterval(() => {
      savingVal.style.transform = 'scale(1.06)';
      savingVal.style.transition = 'transform .3s ease';
      setTimeout(() => { savingVal.style.transform = 'scale(1)'; }, 300);
    }, 4000);
  }

  /* ── Ticker pause on hover ── */
  const ticker = document.querySelector('.ticker-track');
  if (ticker) {
    ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
    ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
  }

  /* ── Smooth section entrance for page heroes ── */
  const pageHero = document.querySelector('.page-hero');
  if (pageHero) {
    pageHero.style.opacity = '0';
    pageHero.style.transform = 'translateY(20px)';
    pageHero.style.transition = 'opacity .6s ease, transform .6s ease';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pageHero.style.opacity = '1';
        pageHero.style.transform = 'none';
      });
    });
  }

  /* ── Active nav link highlight ── */
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.remove('active');
    const href = a.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href))) {
      a.classList.add('active');
    } else if (href === '/' && path === '/') {
      a.classList.add('active');
    }
  });

});
