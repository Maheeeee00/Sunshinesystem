/* =============================================
   SOLAR ANIMATION — HERO CANVAS
   Orbital orrery with light rays, energy particles
   and an animated Earth receiving power
   ============================================= */

class SolarAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.dpr = window.devicePixelRatio || 1;
    this.t = 0;
    this.particles = [];
    this.rays = [];
    this.energyParticles = [];
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    this.buildRays();
    this.buildEnergyParticles();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    const el = this.canvas.parentElement;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    this.canvas.style.width  = w + 'px';
    this.canvas.style.height = h + 'px';
    this.canvas.width  = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    this.W = w; this.H = h;
    // Sun sits slightly left of center
    this.sunX = w * 0.35;
    this.sunY = h * 0.5;
    this.sunR = Math.min(w, h) * 0.13;
    // Earth orbits sun
    this.orbitR = this.sunR * 2.8;
  }

  buildRays() {
    this.rays = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      this.rays.push({
        angle:   (i / count) * Math.PI * 2,
        length:  0.6 + Math.random() * 0.5,
        speed:   0.0008 + Math.random() * 0.0006,
        opacity: 0.4 + Math.random() * 0.4,
        phase:   Math.random() * Math.PI * 2
      });
    }
  }

  buildEnergyParticles() {
    this.energyParticles = [];
    for (let i = 0; i < 60; i++) {
      this.spawnEnergyParticle(true);
    }
  }

  spawnEnergyParticle(init = false) {
    const angle = Math.random() * Math.PI * 2;
    const dist  = init
      ? this.sunR + Math.random() * (this.orbitR + this.sunR * 2)
      : this.sunR * 1.05;
    this.energyParticles.push({
      angle,
      dist,
      speed: 0.3 + Math.random() * 0.6,
      size:  1 + Math.random() * 2,
      life:  init ? Math.random() : 0,
      alpha: 0.6 + Math.random() * 0.4,
      color: Math.random() < 0.6 ? '#f0a500' : (Math.random() < 0.5 ? '#ff7c20' : '#ffd700')
    });
  }

  drawSun(t) {
    const { ctx, sunX: cx, sunY: cy, sunR: r } = this;

    // Outer corona glow (multi-layer)
    for (let i = 4; i >= 1; i--) {
      const grad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * (1 + i * 0.55));
      grad.addColorStop(0,   `rgba(255,180,0,${0.08 / i})`);
      grad.addColorStop(0.5, `rgba(255,120,0,${0.04 / i})`);
      grad.addColorStop(1,   'rgba(255,80,0,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * (1 + i * 0.55), 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    // Sun body
    const sunGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
    sunGrad.addColorStop(0,   '#fff9d0');
    sunGrad.addColorStop(0.25,'#ffe066');
    sunGrad.addColorStop(0.55,'#f0a500');
    sunGrad.addColorStop(0.85,'#e07000');
    sunGrad.addColorStop(1,   '#c04000');
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = sunGrad;
    ctx.fill();

    // Surface shimmer rings
    for (let i = 0; i < 3; i++) {
      const phase = t * 0.5 + (i * Math.PI * 2 / 3);
      const shimR = r * (0.6 + 0.25 * i);
      const alpha = 0.06 + 0.04 * Math.sin(phase);
      ctx.beginPath();
      ctx.arc(cx, cy, shimR, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255,220,100,${alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Animated sunspots
    const spots = [
      { a: 0.6, d: 0.45, r: 0.09 },
      { a: 1.8, d: 0.55, r: 0.06 },
      { a: 3.5, d: 0.40, r: 0.07 },
    ];
    spots.forEach(s => {
      const angle = s.a + t * 0.15;
      const sx = cx + Math.cos(angle) * r * s.d;
      const sy = cy + Math.sin(angle) * r * s.d;
      ctx.beginPath();
      ctx.arc(sx, sy, r * s.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150,60,0,0.35)';
      ctx.fill();
    });
  }

  drawRays(t) {
    const { ctx, sunX: cx, sunY: cy, sunR: r } = this;
    this.rays.forEach(ray => {
      const angle = ray.angle + t * ray.speed;
      const len   = r * (1.4 + ray.length) * (0.8 + 0.2 * Math.sin(t * 1.2 + ray.phase));
      const alpha = ray.opacity * (0.5 + 0.5 * Math.sin(t * 0.8 + ray.phase));
      const x2 = cx + Math.cos(angle) * len;
      const y2 = cy + Math.sin(angle) * len;
      const grad = ctx.createLinearGradient(cx, cy, x2, y2);
      grad.addColorStop(0.3, `rgba(240,165,0,${alpha})`);
      grad.addColorStop(1,   'rgba(240,165,0,0)');
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });
  }

  drawOrbit(t) {
    const { ctx, sunX: cx, sunY: cy, orbitR } = this;
    // Dashed orbit ring
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56,189,248,0.12)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawEarth(t) {
    const { ctx, sunX: cx, sunY: cy, orbitR, sunR } = this;
    const angle = t * 0.25;
    const ex = cx + Math.cos(angle) * orbitR;
    const ey = cy + Math.sin(angle) * orbitR;
    const er = sunR * 0.32;

    // Glow around earth
    const glow = ctx.createRadialGradient(ex, ey, er * 0.5, ex, ey, er * 2.5);
    glow.addColorStop(0,   'rgba(56,189,248,0.25)');
    glow.addColorStop(0.5, 'rgba(56,189,248,0.07)');
    glow.addColorStop(1,   'rgba(56,189,248,0)');
    ctx.beginPath();
    ctx.arc(ex, ey, er * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Earth body
    const eGrad = ctx.createRadialGradient(ex - er * 0.3, ey - er * 0.3, er * 0.1, ex, ey, er);
    eGrad.addColorStop(0,   '#a8e6ff');
    eGrad.addColorStop(0.4, '#38bdf8');
    eGrad.addColorStop(0.75,'#1e6fa8');
    eGrad.addColorStop(1,   '#0b3d5a');
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.fillStyle = eGrad;
    ctx.fill();

    // Land masses hint
    ctx.save();
    ctx.beginPath();
    ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.clip();
    const landR = t * 0.4;
    [[0.3, -0.2, 0.35], [-0.1, 0.1, 0.3], [0.5, 0.3, 0.2]].forEach(([lx, ly, lr]) => {
      const rx = ex + Math.cos(landR) * er * lx - Math.sin(landR) * er * ly;
      const ry = ey + Math.sin(landR) * er * lx + Math.cos(landR) * er * ly;
      ctx.beginPath();
      ctx.arc(rx, ry, er * lr, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(60,170,80,0.45)';
      ctx.fill();
    });
    ctx.restore();

    // Panel array on earth surface (tiny)
    const panelAngle = angle + Math.PI * 0.1;
    const px = ex + Math.cos(panelAngle) * er * 0.95;
    const py = ey + Math.sin(panelAngle) * er * 0.95;
    ctx.beginPath();
    ctx.rect(px - 3, py - 2, 6, 4);
    ctx.fillStyle = 'rgba(56,189,248,0.8)';
    ctx.fill();

    // Power beam from sun to earth
    this.drawPowerBeam(cx, cy, ex, ey, t);

    return { ex, ey };
  }

  drawPowerBeam(x1, y1, x2, y2, t) {
    const { ctx, sunR } = this;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const nx = dx / dist;
    const ny = dy / dist;

    // Start from sun surface
    const sx = x1 + nx * sunR * 1.05;
    const sy = y1 + ny * sunR * 1.05;

    const alpha = 0.12 + 0.05 * Math.sin(t * 2);
    const grad = ctx.createLinearGradient(sx, sy, x2, y2);
    grad.addColorStop(0,   `rgba(240,165,0,${alpha * 2})`);
    grad.addColorStop(0.5, `rgba(240,165,0,${alpha})`);
    grad.addColorStop(1,   `rgba(56,189,248,${alpha * 1.5})`);

    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawEnergyParticles(t) {
    const { ctx, sunX: cx, sunY: cy, sunR, orbitR } = this;
    this.energyParticles = this.energyParticles.filter(p => {
      p.life += 0.008 * p.speed;
      p.dist = sunR * 1.05 + (orbitR + sunR) * p.life;
      if (p.life >= 1) return false;

      const x = cx + Math.cos(p.angle) * p.dist;
      const y = cy + Math.sin(p.angle) * p.dist;
      const alpha = p.alpha * Math.sin(p.life * Math.PI);

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
      return true;
    });

    // Spawn new ones
    if (this.energyParticles.length < 80 && !this.reduced) {
      this.spawnEnergyParticle(false);
    }
  }

  drawSolarPanels(t) {
    // Draw stylised ground installation panels (bottom right area)
    const { ctx, W, H, sunX, sunY } = this;
    const baseX = W * 0.7;
    const baseY = H * 0.78;
    const panels = 5;
    const pW = 38, pH = 22, gap = 12;
    const totalW = panels * pW + (panels - 1) * gap;
    const startX = baseX - totalW / 2;

    for (let i = 0; i < panels; i++) {
      const px = startX + i * (pW + gap);
      const py = baseY;
      // Tilt based on sun position
      const tilt = 0.25 + 0.05 * Math.sin(t * 0.3 + i * 0.3);
      const tiltX = Math.cos(tilt) * pW;
      const tiltY = Math.sin(tilt) * pW;

      // Panel body
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + tiltX, py - tiltY);
      ctx.lineTo(px + tiltX, py - tiltY + pH * 0.6);
      ctx.lineTo(px, py + pH * 0.6);
      ctx.closePath();
      const pGrad = ctx.createLinearGradient(px, py, px + tiltX, py - tiltY);
      pGrad.addColorStop(0,   '#1a3a6a');
      pGrad.addColorStop(0.5, '#1e4d8a');
      pGrad.addColorStop(1,   '#38bdf8');
      ctx.fillStyle = pGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(56,189,248,0.4)';
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Cell grid lines
      ctx.strokeStyle = 'rgba(56,189,248,0.2)';
      ctx.lineWidth = 0.5;
      for (let g = 1; g <= 3; g++) {
        const fx = g / 4;
        ctx.beginPath();
        ctx.moveTo(px + tiltX * fx, py - tiltY * fx);
        ctx.lineTo(px + tiltX * fx, py - tiltY * fx + pH * 0.6);
        ctx.stroke();
      }

      // Sun reflection glint
      const glint = 0.4 + 0.6 * Math.abs(Math.sin(t * 0.5 + i * 0.8));
      ctx.beginPath();
      ctx.arc(px + tiltX * 0.35, py - tiltY * 0.35 + pH * 0.2, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,240,180,${glint * 0.7})`;
      ctx.fill();

      // Stand
      const mx = px + tiltX / 2;
      const my = py + pH * 0.3;
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx + 1, my + 22);
      ctx.moveTo(mx + 1, my + 22);
      ctx.lineTo(mx - 8, my + 22);
      ctx.moveTo(mx + 1, my + 22);
      ctx.lineTo(mx + 10, my + 22);
      ctx.strokeStyle = 'rgba(56,189,248,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Energy line to ground
      const eAlpha = 0.15 + 0.15 * Math.sin(t * 3 + i);
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(baseX + 30, baseY + 40);
      ctx.strokeStyle = `rgba(0,212,170,${eAlpha})`;
      ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Ground line
    ctx.beginPath();
    ctx.moveTo(W * 0.55, baseY + 42);
    ctx.lineTo(W * 0.95, baseY + 42);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawStats(t) {
    const { ctx, W, H } = this;
    // Live output figure (right side)
    const x = W * 0.78;
    const y = H * 0.28;
    const kw = (24.6 + 0.4 * Math.sin(t * 0.5)).toFixed(1);
    ctx.font = `bold ${32}px Outfit, sans-serif`;
    ctx.fillStyle = '#f0a500';
    ctx.textAlign = 'center';
    ctx.fillText(kw + ' kW', x, y);
    ctx.font = `${12}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(141,163,196,0.7)';
    ctx.fillText('Live Output', x, y + 18);

    // Efficiency indicator
    const eff = (92.3 + 1.5 * Math.sin(t * 0.3)).toFixed(1);
    ctx.font = `bold ${22}px Outfit, sans-serif`;
    ctx.fillStyle = '#00d4aa';
    ctx.fillText(eff + '%', x, y + 55);
    ctx.font = `${11}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(141,163,196,0.7)';
    ctx.fillText('Efficiency', x, y + 70);
  }

  loop() {
    const { ctx, W, H } = this;
    ctx.clearRect(0, 0, W, H);

    if (!this.reduced) {
      this.t += 0.016;
    }
    const t = this.t;

    // Background nebula
    const nebGrad = ctx.createRadialGradient(
      this.sunX, this.sunY, this.sunR,
      this.sunX, this.sunY, Math.max(W, H) * 0.9
    );
    nebGrad.addColorStop(0,   'rgba(240,120,0,0.04)');
    nebGrad.addColorStop(0.4, 'rgba(56,189,248,0.02)');
    nebGrad.addColorStop(1,   'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(this.sunX, this.sunY, Math.max(W, H), 0, Math.PI * 2);
    ctx.fillStyle = nebGrad;
    ctx.fill();

    // Stars (static)
    if (!this._stars) {
      this._stars = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.3 + Math.random() * 0.9,
        a: 0.3 + Math.random() * 0.5,
        p: Math.random() * Math.PI * 2
      }));
    }
    this._stars.forEach(s => {
      const a = s.a * (0.6 + 0.4 * Math.sin(t * 0.4 + s.p));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.fill();
    });

    this.drawRays(t);
    this.drawOrbit(t);
    this.drawEarth(t);
    this.drawEnergyParticles(t);
    this.drawSun(t);
    this.drawSolarPanels(t);
    this.drawStats(t);

    requestAnimationFrame(() => this.loop());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SolarAnimation('hero-canvas');
});
