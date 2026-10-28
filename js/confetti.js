/**
 * ============================================================================
 * 🎊 STANDALONE CANVAS CONFETTI & FIREWORKS ENGINE
 * High-performance, lightweight, zero external dependencies!
 * ============================================================================
 */

class ConfettiEngine {
  constructor(canvasId = 'confettiCanvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.colors = [
      '#ff4d88', '#ff75a0', '#ffbe0b', '#fb8500', 
      '#8338ec', '#3a86ff', '#06d6a0', '#ffffff', '#ffd166'
    ];

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  // Create a burst of confetti from a specific location or center
  burst(options = {}) {
    const count = options.count || 80;
    const originX = options.x !== undefined ? options.x : this.width / 2;
    const originY = options.y !== undefined ? options.y : this.height / 2;
    const spread = options.spread || 360;
    const speed = options.speed || 10;

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI / 180) * (options.angle !== undefined ? options.angle + (Math.random() - 0.5) * spread : Math.random() * 360);
      const velocity = (Math.random() * 0.6 + 0.4) * speed;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - (options.lift || 3),
        size: Math.random() * 9 + 5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        gravity: 0.18,
        friction: 0.98,
        opacity: 1,
        decay: Math.random() * 0.012 + 0.008
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  // Cannon shot from bottom left and right
  celebrationCannon() {
    this.burst({ x: this.width * 0.1, y: this.height * 0.9, angle: -45, spread: 60, speed: 18, count: 90, lift: 8 });
    this.burst({ x: this.width * 0.9, y: this.height * 0.9, angle: -135, spread: 60, speed: 18, count: 90, lift: 8 });

    setTimeout(() => {
      this.burst({ x: this.width * 0.5, y: this.height * 0.3, spread: 360, speed: 14, count: 120 });
    }, 300);
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;

      p.x += p.vx;
      p.y += p.vy;

      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);

      const scaleX = Math.cos(p.wobble);

      this.ctx.fillStyle = p.color;

      if (p.shape === 'rect') {
        this.ctx.fillRect(-p.size / 2 * scaleX, -p.size / 2, p.size * scaleX, p.size * 0.6);
      } else {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, (p.size / 2) * Math.abs(scaleX), 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
}

// Global instance
window.confetti = new ConfettiEngine();
