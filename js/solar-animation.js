/* SolarOS — Canvas Hero Animation (Light Theme) */
class SolarAnimation {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initParticles();
    if (!this.reduced) requestAnimationFrame(t => this.loop(t));
    else this.drawStatic();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.cx = this.canvas.width * 0.72;
    this.cy = this.canvas.height * 0.38;
    this.sunR = Math.min(this.canvas.width, this.canvas.height) * 0.1;
    this._stars = null;
    this.initParticles();
  }

  initParticles() {
    this.particles = Array.from({ length: 50 }, () => ({
      angle: Math.random() * Math.PI * 2,
      r: (this.sunR || 60) * (1.3 + Math.random() * 2.2),
      speed: 0.004 + Math.random() * 0.01,
      size: 1.5 + Math.random() * 2.5,
      alpha: 0.4 + Math.random() * 0.6,
      color: Math.random() > 0.5 ? '#f59e0b' : '#0d9488',
    }));
  }

  loop(t) {
    this.t = t * 0.001;
    this.draw();
    requestAnimationFrame(ts => this.loop(ts));
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawRays(this.t);
    this.drawSun(this.t);
    this.drawOrbit(this.t);
    this.drawEarth(this.t);
    this.drawParticles(this.t);
    this.drawPanels(this.t);
  }

  drawStatic() { this.t = 0; this.draw(); }

  drawRays(t) {
    const { ctx, cx, cy, sunR } = this;
    const count = 16;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + t * 0.07;
      const len = sunR * (2.6 + Math.sin(t * 1.4 + i) * 0.4);
      const grad = ctx.createLinearGradient(cx, cy, cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      grad.addColorStop(0, 'rgba(245,158,11,0.22)');
      grad.addColorStop(0.5, 'rgba(245,158,11,0.08)');
      grad.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * sunR * 0.85, cy + Math.sin(angle) * sunR * 0.85);
      ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 10 + Math.sin(t + i) * 3;
      ctx.stroke();
    }
  }

  drawSun(t) {
    const { ctx, cx, cy, sunR } = this;
    // Outer glow — subtle on light bg
    const outer = ctx.createRadialGradient(cx, cy, sunR * 0.6, cx, cy, sunR * 2);
    outer.addColorStop(0, 'rgba(245,158,11,0.18)');
    outer.addColorStop(0.5, 'rgba(249,115,22,0.07)');
    outer.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(cx, cy, sunR * 2, 0, Math.PI * 2);
    ctx.fillStyle = outer; ctx.fill();

    // Pulse rings
    [1.4, 1.22].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(cx, cy, sunR * r + Math.sin(t * 0.9 + i) * 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245,158,11,${0.12 - i * 0.04})`;
      ctx.lineWidth = 5 - i * 1.5;
      ctx.stroke();
    });

    // Main body
    const body = ctx.createRadialGradient(cx - sunR * 0.25, cy - sunR * 0.25, 0, cx, cy, sunR);
    body.addColorStop(0, '#fff7c0');
    body.addColorStop(0.3, '#fcd34d');
    body.addColorStop(0.7, '#f59e0b');
    body.addColorStop(1, '#d97706');
    ctx.beginPath(); ctx.arc(cx, cy, sunR, 0, Math.PI * 2);
    ctx.fillStyle = body; ctx.fill();

    // Shimmer
    const sh = ctx.createRadialGradient(cx - sunR * 0.3, cy - sunR * 0.35, 0, cx, cy, sunR);
    sh.addColorStop(0, `rgba(255,255,255,${0.35 + Math.sin(t * 2) * 0.08})`);
    sh.addColorStop(0.5, 'transparent');
    ctx.fillStyle = sh;
    ctx.beginPath(); ctx.arc(cx, cy, sunR, 0, Math.PI * 2); ctx.fill();

    // Sunspots
    [[0.28, 0.12], [-0.22, 0.28], [0.08, -0.32]].forEach(([dx, dy]) => {
      ctx.beginPath();
      ctx.arc(cx + dx * sunR, cy + dy * sunR, sunR * 0.09, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,90,0,0.2)'; ctx.fill();
    });
  }

  drawOrbit(t) {
    const { ctx, cx, cy, sunR } = this;
    const orbitR = sunR * 2.8;
    ctx.beginPath();
    ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(14,165,233,0.25)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawEarth(t) {
    const { ctx, cx, cy, sunR, canvas } = this;
    const orbitR = sunR * 2.8;
    const angle = t * 0.35;
    const ex = cx + Math.cos(angle) * orbitR;
    const ey = cy + Math.sin(angle) * orbitR;
    const er = sunR * 0.26;

    // Glow
    const glow = ctx.createRadialGradient(ex, ey, 0, ex, ey, er * 2.2);
    glow.addColorStop(0, 'rgba(14,165,233,0.25)');
    glow.addColorStop(1, 'transparent');
    ctx.beginPath(); ctx.arc(ex, ey, er * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = glow; ctx.fill();

    // Ocean
    const ocean = ctx.createRadialGradient(ex - er * 0.2, ey - er * 0.2, 0, ex, ey, er);
    ocean.addColorStop(0, '#7dd3fc');
    ocean.addColorStop(1, '#0284c7');
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.fillStyle = ocean; ctx.fill();

    // Land patches
    ctx.save();
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.clip();
    [[-0.1, -0.2, 0.4, 0.32], [0.18, 0.12, 0.28, 0.25], [-0.28, 0.16, 0.22, 0.18]].forEach(([dx, dy, w, h]) => {
      ctx.fillStyle = 'rgba(34,197,94,0.65)';
      ctx.fillRect(ex + dx * er, ey + dy * er, w * er, h * er);
    });
    ctx.restore();

    // Shine
    const shine = ctx.createRadialGradient(ex - er * 0.3, ey - er * 0.35, 0, ex, ey, er);
    shine.addColorStop(0, 'rgba(255,255,255,0.35)');
    shine.addColorStop(0.5, 'transparent');
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.fillStyle = shine; ctx.fill();

    // Border
    ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1.5; ctx.stroke();

    // Energy beam to panels
    const panelY = canvas.height * 0.88;
    const panelX = cx - (this.canvas.width * 0.18);
    ctx.beginPath();
    ctx.moveTo(ex, ey + er);
    ctx.lineTo(panelX, panelY);
    const beam = ctx.createLinearGradient(ex, ey, panelX, panelY);
    beam.addColorStop(0, 'rgba(13,148,136,0.35)');
    beam.addColorStop(1, 'rgba(13,148,136,0)');
    ctx.strokeStyle = beam;
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 7]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawParticles(t) {
    const { ctx, cx, cy } = this;
    this.particles.forEach(p => {
      if (!this.reduced) p.angle += p.speed;
      const x = cx + Math.cos(p.angle) * p.r;
      const y = cy + Math.sin(p.angle) * p.r;
      const pulse = 0.5 + 0.5 * Math.sin(t * 3 + p.angle * 2);
      ctx.globalAlpha = p.alpha * (0.5 + pulse * 0.5);
      ctx.beginPath();
      ctx.arc(x, y, p.size * (0.7 + pulse * 0.5), 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  drawPanels(t) {
    const { ctx, cx, canvas } = this;
    const y0 = canvas.height * 0.88;
    const panelW = 42, panelH = 26, gap = 10, count = 6;
    const totalW = count * panelW + (count - 1) * gap;
    const x0 = cx - totalW * 0.85;

    for (let i = 0; i < count; i++) {
      const x = x0 + i * (panelW + gap);
      const tilt = -0.16;
      const shine = 0.25 + 0.18 * Math.sin(t * 1.2 + i * 0.8);

      ctx.save();
      ctx.translate(x + panelW / 2, y0);
      ctx.rotate(tilt);

      // Panel shadow
      ctx.shadowColor = 'rgba(0,0,0,0.12)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      // Panel body
      const pg = ctx.createLinearGradient(0, -panelH / 2, 0, panelH / 2);
      pg.addColorStop(0, `rgba(30,58,138,${0.75 + shine * 0.15})`);
      pg.addColorStop(1, 'rgba(15,23,42,0.9)');
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.roundRect(-panelW / 2, -panelH / 2, panelW, panelH, 3);
      ctx.fill();

      ctx.shadowColor = 'transparent';

      // Grid lines
      ctx.strokeStyle = 'rgba(148,163,184,0.3)';
      ctx.lineWidth = 0.6;
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

      // Shine overlay
      const shG = ctx.createLinearGradient(-panelW / 2, -panelH / 2, panelW / 4, panelH / 4);
      shG.addColorStop(0, `rgba(255,255,255,${shine * 0.45})`);
      shG.addColorStop(1, 'transparent');
      ctx.fillStyle = shG;
      ctx.beginPath();
      ctx.roundRect(-panelW / 2, -panelH / 2, panelW, panelH, 3);
      ctx.fill();

      // Border
      ctx.strokeStyle = 'rgba(100,116,139,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(-panelW / 2, -panelH / 2, panelW, panelH, 3);
      ctx.stroke();

      // Support pole
      ctx.beginPath();
      ctx.moveTo(0, panelH / 2);
      ctx.lineTo(0, panelH / 2 + 16);
      ctx.strokeStyle = 'rgba(100,116,139,0.35)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }

    // Ground line
    ctx.beginPath();
    ctx.moveTo(x0 - 20, y0 + 24);
    ctx.lineTo(x0 + totalW + 20, y0 + 24);
    const groundG = ctx.createLinearGradient(x0, 0, x0 + totalW, 0);
    groundG.addColorStop(0, 'transparent');
    groundG.addColorStop(0.2, 'rgba(13,148,136,0.35)');
    groundG.addColorStop(0.8, 'rgba(13,148,136,0.35)');
    groundG.addColorStop(1, 'transparent');
    ctx.strokeStyle = groundG;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SolarAnimation('hero-canvas');
});
