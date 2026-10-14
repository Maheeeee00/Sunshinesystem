/* SolarOS — Canvas Hero Animation */
class SolarAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.particles = [];
    this.rays = 18;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    if (!this.reduced) requestAnimationFrame(t => this.loop(t));
    else this.drawStatic();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.cx = this.canvas.width / 2;
    this.cy = this.canvas.height * 0.42;
    this.sunR = Math.min(this.canvas.width, this.canvas.height) * 0.11;
  }

  initParticles() {
    this.particles = Array.from({ length: 60 }, () => ({
      angle: Math.random() * Math.PI * 2,
      r: this.sunR * (1.2 + Math.random() * 2.5),
      speed: 0.004 + Math.random() * 0.012,
      size: 1 + Math.random() * 2.5,
      alpha: 0.3 + Math.random() * 0.7,
      color: Math.random() > 0.5 ? '#f0a500' : '#00d4aa',
    }));
  }

  loop(t) {
    this.t = t * 0.001;
    this.draw();
    requestAnimationFrame(ts => this.loop(ts));
  }

  draw() {
    const { ctx, canvas, cx, cy, sunR, t } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBg();
    this.drawRays(t);
    this.drawSun(t);
    this.drawOrbit(t);
    this.drawEarth(t);
    this.drawParticles(t);
    this.drawPanels(t);
  }

  drawStatic() {
    this.t = 0;
    this.draw();
  }

  drawBg() {
    const { ctx, canvas, cx, cy } = this;
    // Stars
    if (!this._stars) {
      this._stars = Array.from({ length: 120 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.75,
        r: 0.4 + Math.random() * 1.2,
        a: 0.3 + Math.random() * 0.7,
      }));
    }
    this._stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.a})`;
      ctx.fill();
    });
    // Nebula glow
    const nb = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.55);
    nb.addColorStop(0, 'rgba(240,165,0,0.07)');
    nb.addColorStop(0.5, 'rgba(56,189,248,0.04)');
    nb.addColorStop(1, 'transparent');
    ctx.fillStyle = nb;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  drawRays(t) {
    const { ctx, cx, cy, sunR, rays } = this;
    for (let i = 0; i < rays; i++) {
      const angle = (i / rays) * Math.PI * 2 + t * 0.08;
      const len = sunR * (2.8 + Math.sin(t * 1.5 + i) * 0.5);
      const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      grad.addColorStop(0, 'rgba(240,165,0,0.15)');
      grad.addColorStop(0.5, 'rgba(240,165,0,0.06)');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * sunR * 0.9, cy + Math.sin(angle) * sunR * 0.9);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 8 + Math.sin(t + i) * 2;
      ctx.stroke();
    }
  }

  drawSun(t) {
    const { ctx, cx, cy, sunR } = this;
    // Outer glow
    const outer = ctx.createRadialGradient(cx, cy, sunR * 0.5, cx, cy, sunR * 2.2);
    outer.addColorStop(0, 'rgba(240,165,0,0.22)');
    outer.addColorStop(0.4, 'rgba(255,124,32,0.1)');
    outer.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, sunR * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = outer; ctx.fill();

    // Corona rings
    [1.45, 1.25, 1.1].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * r + Math.sin(t * 0.9 + i) * 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(240,165,0,${0.08 - i * 0.02})`;
      ctx.lineWidth = 6 - i * 1.5;
      ctx.stroke();
    });

    // Main body
    const body = ctx.createRadialGradient(cx - sunR * 0.2, cy - sunR * 0.2, 0, cx, cy, sunR);
    body.addColorStop(0, '#fff7d4');
    body.addColorStop(0.3, '#ffd050');
    body.addColorStop(0.7, '#f0a500');
    body.addColorStop(1, '#c07000');
    ctx.beginPath(); ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fillStyle = body; ctx.fill();

    // Shimmer
    const sh = ctx.createRadialGradient(cx - sunR * 0.3, cy - sunR * 0.35, 0, cx, cy, sunR);
    sh.addColorStop(0, `rgba(255,255,255,${0.25 + Math.sin(t * 2) * 0.06})`);
    sh.addColorStop(0.5, 'transparent');
    ctx.fillStyle = sh;
    ctx.beginPath(); ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fill();

    // Sunspots
    [[0.3, 0.1], [-0.25, 0.3], [0.1, -0.35]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(cx + dx * sunR, cy + dy * sunR, sunR * 0.1, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150,70,0,0.25)';
      ctx.fill();
    });
  }

  drawOrbit(t) {
    const { ctx, cx, cy, sunR } = this;
    const orbitR = sunR * 2.8;
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56,189,248,0.18)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawEarth(t) {
    const { ctx, cx, cy, sunR } = this;
    const orbitR = sunR * 2.8;
    const angle = t * 0.35;
    const ex = cx + Math.cos(angle) * orbitR;
    const ey = cy + Math.sin(angle) * orbitR;
    const er = sunR * 0.28;

    // Glow
    const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, er * 2);
    glow.addColorStop(0, 'rgba(56,189,248,0.3)');
    glow.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(ex, ey, er * 2, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    // Ocean
    const ocean = ctx.createRadialGradient(ex - er * 0.2, ey - er * 0.2, 0, ex, ey, er);
    ocean.addColorStop(0, '#6be0ff');
    ocean.addColorStop(1, '#0060a0');
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.fillStyle = ocean; ctx.fill();

    // Land
    ctx.save();
    ctx.clip();
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.clip();
    [[-0.1, -0.2, 0.4, 0.35], [0.2, 0.1, 0.3, 0.28], [-0.3, 0.15, 0.25, 0.2]].forEach(([dx, dy, w, h]) => {
      ctx.fillStyle = 'rgba(40,160,80,0.6)';
      ctx.fillRect(ex + dx * er, ey + dy * er, w * er, h * er);
    });
    ctx.restore();

    // Shine
    const shine = ctx.createRadialGradient(ex - er * 0.3, ey - er * 0.35, 0, ex, ey, er);
    shine.addColorStop(0, 'rgba(255,255,255,0.3)');
    shine.addColorStop(0.5, 'transparent');
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.fillStyle = shine; ctx.fill();

    // Energy beam to panels
    const panelY = this.canvas.height * 0.88;
    ctx.beginPath();
    ctx.moveTo(ex, ey + er);
    ctx.lineTo(cx, panelY);
    const beam = ctx.createLinearGradient(ex, ey, cx, panelY);
    beam.addColorStop(0, 'rgba(0,212,170,0.4)');
    beam.addColorStop(1, 'rgba(0,212,170,0)');
    ctx.strokeStyle = beam;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 8]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawParticles(t) {
    const { ctx, cx, cy, sunR } = this;
    this.particles.forEach(p => {
      if (!this.reduced) p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r;
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + p.angle);
      ctx.beginPath();
      ctx.arc(x, y, p.size * (0.8 + pulse * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace(')', `,${p.alpha * (0.4 + pulse * 0.6)}`).replace('rgb', 'rgba').replace('#f0a500', 'rgba(240,165,0').replace('#00d4aa', 'rgba(0,212,170');
      // simpler approach:
      ctx.globalAlpha = p.alpha * (0.5 + pulse * 0.5);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  drawPanels(t) {
    const { ctx, cx, canvas } = this;
    const y0 = canvas.height * 0.88;
    const panelW = 44, panelH = 26, gap = 10, count = 7;
    const totalW = count * panelW + (count - 1) * gap;
    let x0 = cx - totalW / 2;

    for (let i = 0; i < count; i++) {
      const x = x0 + i * (panelW + gap);
      const tilt = -0.18;
      const shine = 0.3 + 0.2 * Math.sin(t * 1.2 + i * 0.7);

      ctx.save();
      ctx.translate(x + panelW / 2, y0);
      ctx.rotate(tilt);

      // Panel body
      const pg = ctx.createLinearGradient(0, -panelH / 2, 0, panelH / 2);
      pg.addColorStop(0, `rgba(56,100,180,${0.7 + shine * 0.2})`);
      pg.addColorStop(1, 'rgba(20,50,120,0.9)');
      ctx.fillStyle = pg;
      ctx.fillRect(-panelW / 2, -panelH / 2, panelW, panelH);

      // Grid lines
      ctx.strokeStyle = 'rgba(100,150,255,0.25)';
      ctx.lineWidth = 0.7;
      for (let gx = 1; gx < 4; gx++) {
        ctx.beginPath();
        ctx.moveTo(-panelW / 2 + gx * (panelW / 4), -panelH / 2);
        ctx.lineTo(-panelW / 2 + gx * (panelW / 4), panelH / 2);
        ctx.stroke();
      }
      for (let gy = 1; gy < 3; gy++) {
        ctx.beginPath();
        ctx.moveTo(-panelW / 2, -panelH / 2 + gy * (panelH / 3));
        ctx.lineTo(panelW / 2, -panelH / 2 + gy * (panelH / 3));
        ctx.stroke();
      }

      // Shine
      const shineG = ctx.createLinearGradient(-panelW / 2, -panelH / 2, panelW / 2, panelH / 2);
      shineG.addColorStop(0, `rgba(255,255,255,${shine * 0.35})`);
      shineG.addColorStop(0.5, 'transparent');
      ctx.fillStyle = shineG;
      ctx.fillRect(-panelW / 2, -panelH / 2, panelW, panelH);

      // Border
      ctx.strokeStyle = 'rgba(100,160,255,0.4)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-panelW / 2, -panelH / 2, panelW, panelH);

      // Support pole
      ctx.beginPath();
      ctx.moveTo(0, panelH / 2);
      ctx.lineTo(0, panelH / 2 + 18);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SolarAnimation('hero-canvas');
});
