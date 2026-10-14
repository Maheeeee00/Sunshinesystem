/* =============================================
   SOLAR PANEL MANAGEMENT — SHARED JS
   ============================================= */

// ---- NAV ACTIVE STATE ----
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('open');
      }
    });
  }
})();

// ---- INTERSECTION OBSERVER (fade-in-up) ----
(function() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(el);
  });
})();

// ---- PROGRESS BAR ANIMATION ----
function animateProgressBars() {
  document.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
    const w = bar.dataset.width;
    setTimeout(() => { bar.style.width = w; }, 200);
  });
}
document.addEventListener('DOMContentLoaded', animateProgressBars);

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 1200, decimals = 0, prefix = '', suffix = '') {
  const start = performance.now();
  const update = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = (target * eased).toFixed(decimals);
    el.textContent = prefix + val + suffix;
    if (p < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// ---- LIVE CLOCK ----
function startClock(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const tick = () => {
    const now = new Date();
    el.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };
  tick();
  setInterval(tick, 1000);
}

// ---- MINI LINE CHART (Canvas) ----
function drawSparkline(canvas, data, color = '#f0a500', fill = true) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 8;

  const pts = data.map((v, i) => ({
    x: pad + (i / (data.length - 1)) * (w - pad * 2),
    y: h - pad - ((v - min) / range) * (h - pad * 2)
  }));

  // Fill
  if (fill) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, color + '50');
    grad.addColorStop(1, color + '00');
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(pts[pts.length - 1].x, h);
    ctx.lineTo(pts[0].x, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.slice(1).forEach(p => ctx.lineTo(p.x, p.y));
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  // Dot at end
  const last = pts[pts.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 4, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// ---- BAR CHART (Canvas) ----
function drawBarChart(canvas, labels, values, color = '#f0a500') {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const max = Math.max(...values) * 1.15;
  const padL = 40, padR = 16, padT = 16, padB = 36;
  const chartW = w - padL - padR;
  const chartH = h - padT - padB;
  const barW   = chartW / values.length;
  const barGap = barW * 0.25;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padT + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(padL + chartW, y);
    ctx.stroke();

    const val = Math.round(max - (max / 4) * i);
    ctx.fillStyle = 'rgba(141,163,196,0.5)';
    ctx.font = `${9 * dpr / dpr}px Inter`;
    ctx.textAlign = 'right';
    ctx.fillText(val, padL - 6, y + 3);
  }

  // Bars
  values.forEach((v, i) => {
    const bh = (v / max) * chartH;
    const bx = padL + i * barW + barGap / 2;
    const by = padT + chartH - bh;
    const bw = barW - barGap;

    const grad = ctx.createLinearGradient(0, by, 0, by + bh);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '60');

    ctx.beginPath();
    ctx.roundRect(bx, by, bw, bh, [4, 4, 0, 0]);
    ctx.fillStyle = grad;
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(141,163,196,0.7)';
    ctx.font = `${9 * dpr / dpr}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], padL + i * barW + barW / 2, h - padB + 14);
  });
}

// ---- DONUT CHART (Canvas) ----
function drawDonut(canvas, segments, labels, colors) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  canvas.width  = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2 - 14;
  const inner = r * 0.58;
  const total = segments.reduce((a, b) => a + b, 0);
  let angle = -Math.PI / 2;

  segments.forEach((seg, i) => {
    const sweep = (seg / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + sweep);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    angle += sweep;
  });

  // Hole
  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = '#0b1629';
  ctx.fill();

  // Center text
  const pct = Math.round((segments[0] / total) * 100);
  ctx.fillStyle = '#f0f4ff';
  ctx.font = `bold ${20 * dpr / dpr}px Outfit`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(pct + '%', cx, cy - 6);
  ctx.font = `${10 * dpr / dpr}px Inter`;
  ctx.fillStyle = '#8da3c4';
  ctx.fillText('Efficiency', cx, cy + 12);
}

// ---- TOAST NOTIFICATIONS ----
function showToast(msg, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
      position:fixed;bottom:1.5rem;right:1.5rem;
      z-index:9999;display:flex;flex-direction:column;gap:.5rem;
    `;
    document.body.appendChild(container);
  }

  const colors = { info: '#38bdf8', success: '#00d4aa', warning: '#f0a500', error: '#ff7c20' };
  const icons  = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '🔴' };
  const toast = document.createElement('div');
  toast.style.cssText = `
    background:#0f1e38;border:1px solid rgba(255,255,255,.08);
    border-left:3px solid ${colors[type]};
    border-radius:10px;padding:.75rem 1rem;
    display:flex;align-items:center;gap:.6rem;
    min-width:260px;max-width:340px;
    font-family:Inter,sans-serif;font-size:.85rem;
    color:#f0f4ff;box-shadow:0 8px 24px rgba(0,0,0,.4);
    animation:fadeInUp .3s ease both;
  `;
  toast.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeIn .3s ease reverse both';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---- SIMULATE LIVE DATA ----
function startLiveFlicker(selectors, min, max, decimals = 1, suffix = '') {
  selectors.forEach(sel => {
    const el = document.querySelector(sel);
    if (!el) return;
    setInterval(() => {
      const v = (min + Math.random() * (max - min)).toFixed(decimals);
      el.textContent = v + suffix;
    }, 2500 + Math.random() * 1500);
  });
}
