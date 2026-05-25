import { useEffect, useRef } from 'react';
import styles from './GoddessCanvas.module.css';

// Palette màu sắc
const GOLD     = '#c4a35a';
const GOLD2    = '#e8d5a0';
const TEAL     = '#52b788';
const WHITE    = '#ffffff';
const PURPLE   = '#9b59b6';

// ─── Helpers ─────────────────────────────────────────────────────────────────
const rand  = (a, b) => Math.random() * (b - a) + a;
const lerp  = (a, b, t) => a + (b - a) * t;

// ─── Particle class ───────────────────────────────────────────────────────────
class Particle {
  constructor(cx, cy) {
    this.reset(cx, cy);
  }
  reset(cx, cy) {
    const angle  = rand(0, Math.PI * 2);
    const speed  = rand(0.5, 3.5);
    this.x       = cx + rand(-60, 60);
    this.y       = cy + rand(-20, 20);
    this.vx      = Math.cos(angle) * speed;
    this.vy      = Math.sin(angle) * speed - rand(1, 3);
    this.alpha   = rand(0.6, 1);
    this.decay   = rand(0.008, 0.018);
    this.size    = rand(1.5, 4);
    this.color   = [GOLD, GOLD2, TEAL, WHITE, PURPLE][Math.floor(rand(0, 5))];
    this.gravity = 0.04;
    this.twinkle = rand(0, Math.PI * 2);
    this.twinkleSpeed = rand(0.05, 0.15);
  }
}

// ─── Floating Book ─────────────────────────────────────────────────────────────
class FloatingBook {
  constructor(cx, height) {
    this.cx     = cx;
    this.maxH   = height;
    this.reset();
  }
  reset() {
    const colors = [
      ['#e74c3c', '#c0392b'],
      ['#3498db', '#2980b9'],
      ['#2ecc71', '#27ae60'],
      ['#9b59b6', '#8e44ad'],
      ['#f39c12', '#d68910'],
      ['#1abc9c', '#16a085'],
    ];
    const c      = colors[Math.floor(rand(0, colors.length))];
    this.spine   = c[0];
    this.cover   = c[1];
    this.x       = this.cx + rand(-200, 200);
    this.y       = this.maxH + rand(20, 100);
    this.vy      = -rand(0.8, 2.2);
    this.vx      = rand(-0.5, 0.5);
    this.angle   = rand(-0.4, 0.4);
    this.dAngle  = rand(-0.012, 0.012);
    this.w       = rand(28, 48);
    this.h       = rand(38, 62);
    this.alpha   = 0;
    this.phase   = 'fadein'; // fadein | float | fadeout
    this.life    = 0;
    this.maxLife = rand(180, 320);
  }
  update() {
    this.y     += this.vy;
    this.x     += this.vx;
    this.angle += this.dAngle;
    this.life++;

    if (this.phase === 'fadein')  this.alpha = Math.min(1, this.alpha + 0.03);
    if (this.life > this.maxLife * 0.7) this.phase = 'fadeout';
    if (this.phase === 'fadeout') this.alpha = Math.max(0, this.alpha - 0.018);

    if (this.alpha <= 0 && this.phase === 'fadeout') this.reset();
    if (this.alpha >= 0.4 && this.phase === 'fadein') this.phase = 'float';
  }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    // Book shadow
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur  = 10;
    ctx.shadowOffsetX = 4;
    ctx.shadowOffsetY = 4;

    // Cover
    ctx.fillStyle = this.cover;
    ctx.beginPath();
    ctx.roundRect(-this.w / 2, -this.h / 2, this.w, this.h, 3);
    ctx.fill();

    // Spine
    ctx.shadowBlur = 0;
    ctx.fillStyle = this.spine;
    ctx.fillRect(-this.w / 2, -this.h / 2, 6, this.h);

    // Pages (white edge)
    ctx.fillStyle = '#fffde7';
    ctx.fillRect(this.w / 2 - 4, -this.h / 2 + 2, 3, this.h - 4);

    // Gold title lines
    ctx.fillStyle = 'rgba(255,215,0,0.6)';
    ctx.fillRect(-this.w / 2 + 10, -this.h / 2 + 10, this.w - 18, 3);
    ctx.fillRect(-this.w / 2 + 10, -this.h / 2 + 18, this.w - 24, 2);

    ctx.restore();
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────
function GoddessCanvas() {
  const canvasRef   = useRef(null);
  const stateRef    = useRef({ frame: 0, textAlpha: 0, subAlpha: 0 });
  const rafRef      = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx   = canvas.getContext('2d');
    let W = canvas.width  = canvas.offsetWidth;
    let H = canvas.height = canvas.offsetHeight;
    let cx = W / 2, cy = H * 0.55;

    // Particles
    const particles = Array.from({ length: 220 }, () => new Particle(cx, cy));

    // Books
    const books = Array.from({ length: 14 }, () => new FloatingBook(cx, H));
    // stagger start
    books.forEach((b, i) => { b.life = -i * 25; });

    // Resize
    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
      cx = W / 2; cy = H * 0.55;
    };
    window.addEventListener('resize', onResize);

    // ── Draw gradient background ──────────────────────────────────────────────
    const drawBg = () => {
      const bg = ctx.createRadialGradient(cx, cy * 0.9, 20, cx, H * 0.5, W * 0.7);
      bg.addColorStop(0,   '#1a0a2e');
      bg.addColorStop(0.35,'#0d1b2a');
      bg.addColorStop(0.7, '#0a1628');
      bg.addColorStop(1,   '#050c14');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle star field
      if (stateRef.current.frame === 0) {
        stateRef.current.stars = Array.from({ length: 120 }, () => ({
          x: rand(0, W), y: rand(0, H * 0.7),
          r: rand(0.5, 1.8), a: rand(0.2, 0.8),
        }));
      }
      (stateRef.current.stars || []).forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a * (0.5 + 0.5 * Math.sin(stateRef.current.frame * 0.02 + s.x))})`;
        ctx.fill();
      });
    };

    // ── Draw goddess hands (artistic silhouette) ──────────────────────────────
    const drawHands = () => {
      ctx.save();
      ctx.globalAlpha = 0.35;

      // Left hand
      const gL = ctx.createLinearGradient(cx - 180, cy + 60, cx - 30, cy - 20);
      gL.addColorStop(0, 'rgba(196,163,90,0)');
      gL.addColorStop(1, 'rgba(232,213,160,0.6)');
      ctx.fillStyle = gL;
      ctx.beginPath();
      ctx.ellipse(cx - 90, cy + 30, 80, 22, -0.35, 0, Math.PI * 2);
      ctx.fill();

      // Right hand
      const gR = ctx.createLinearGradient(cx + 30, cy - 20, cx + 180, cy + 60);
      gR.addColorStop(0, 'rgba(232,213,160,0.6)');
      gR.addColorStop(1, 'rgba(196,163,90,0)');
      ctx.fillStyle = gR;
      ctx.beginPath();
      ctx.ellipse(cx + 90, cy + 30, 80, 22, 0.35, 0, Math.PI * 2);
      ctx.fill();

      // Glow center (energy core)
      const gC = ctx.createRadialGradient(cx, cy, 0, cx, cy, 100);
      gC.addColorStop(0,   'rgba(196,163,90,0.7)');
      gC.addColorStop(0.3, 'rgba(82,183,136,0.3)');
      gC.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.globalAlpha = 0.5 + 0.2 * Math.sin(stateRef.current.frame * 0.05);
      ctx.fillStyle   = gC;
      ctx.beginPath();
      ctx.arc(cx, cy, 100, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ── Draw text ─────────────────────────────────────────────────────────────
    const drawText = (frame) => {
      const s = stateRef.current;

      if (frame > 90)  s.textAlpha = Math.min(1, s.textAlpha + 0.012);
      if (frame > 160) s.subAlpha  = Math.min(1, s.subAlpha  + 0.015);

      if (s.textAlpha > 0) {
        ctx.save();

        // Glow backdrop
        const gT = ctx.createLinearGradient(cx - 260, 0, cx + 260, 0);
        gT.addColorStop(0, 'transparent');
        gT.addColorStop(0.4, 'rgba(196,163,90,0.08)');
        gT.addColorStop(0.6, 'rgba(196,163,90,0.08)');
        gT.addColorStop(1, 'transparent');
        ctx.fillStyle   = gT;
        ctx.globalAlpha = s.textAlpha;
        ctx.fillRect(cx - 300, H * 0.12, 600, 80);

        // Main title
        ctx.globalAlpha = s.textAlpha;
        ctx.font        = `bold ${Math.min(W / 10, 52)}px "Playfair Display", Georgia, serif`;
        ctx.textAlign   = 'center';
        ctx.textBaseline= 'middle';

        // Gold gradient text
        const grad = ctx.createLinearGradient(cx - 200, 0, cx + 200, 0);
        grad.addColorStop(0,    '#c4a35a');
        grad.addColorStop(0.3,  '#e8d5a0');
        grad.addColorStop(0.5,  '#fff8e7');
        grad.addColorStop(0.7,  '#e8d5a0');
        grad.addColorStop(1,    '#c4a35a');

        ctx.shadowColor  = 'rgba(196,163,90,0.8)';
        ctx.shadowBlur   = 30;
        ctx.fillStyle    = grad;
        ctx.fillText('ThanhStore', cx, H * 0.2);

        // Sub-line
        if (s.subAlpha > 0) {
          ctx.globalAlpha  = s.subAlpha;
          ctx.font         = `${Math.min(W / 22, 22)}px "Playfair Display", Georgia, serif`;
          ctx.shadowBlur   = 12;
          ctx.shadowColor  = 'rgba(82,183,136,0.6)';
          ctx.fillStyle    = '#a8edcf';
          ctx.fillText('✦  Thánh Địa Tri Thức  ✦', cx, H * 0.2 + Math.min(W / 10, 52) * 0.85);

          // Decorative divider
          ctx.globalAlpha  = s.subAlpha * 0.6;
          ctx.strokeStyle  = '#c4a35a';
          ctx.lineWidth    = 1;
          ctx.shadowBlur   = 0;
          const dW = 140;
          ctx.beginPath(); ctx.moveTo(cx - dW, H * 0.2 + 74); ctx.lineTo(cx + dW, H * 0.2 + 74); ctx.stroke();
          // diamond
          ctx.fillStyle   = '#c4a35a';
          ctx.save();
          ctx.translate(cx, H * 0.2 + 74);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-5, -5, 10, 10);
          ctx.restore();
        }
        ctx.restore();
      }
    };

    // ── Animation loop ────────────────────────────────────────────────────────
    const loop = () => {
      const s = stateRef.current;
      s.frame++;

      ctx.clearRect(0, 0, W, H);
      drawBg();
      drawHands();

      // Particles
      particles.forEach(p => {
        p.twinkle += p.twinkleSpeed;
        p.x  += p.vx;
        p.vy += p.gravity;
        p.y  += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) p.reset(cx, cy);

        const pulse = 0.7 + 0.3 * Math.sin(p.twinkle);
        ctx.save();
        ctx.globalAlpha = p.alpha * pulse;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 8;
        ctx.fillStyle   = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Books
      books.forEach(b => {
        b.cx = cx;
        b.maxH = H;
        b.update();
        b.draw(ctx);
      });

      drawText(s.frame);

      rafRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

export default GoddessCanvas;
