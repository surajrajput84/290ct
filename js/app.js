/**
 * ============================================================================
 * 🚀 BIRTHDAY SURPRISE MASTER CONTROLLER & FIREWORKS ENGINE
 * Exactly handles scene transitions, theme switching, direct appearance,
 * ambient starry skies, and dazzling fireworks for Card 11.
 * ============================================================================
 */

class BirthdayApp {
  constructor() {
    this.config = typeof BIRTHDAY_CONFIG !== 'undefined' ? BIRTHDAY_CONFIG : {};
    this.currentSceneId = 'sceneWelcome';

    // Canvases
    this.particlesCanvas = document.getElementById('particlesCanvas');
    this.particlesCtx = this.particlesCanvas ? this.particlesCanvas.getContext('2d') : null;
    this.stars = [];
    this.starsAnimId = null;

    this.fireworksCanvas = document.getElementById('fireworksCanvas');
    this.fireworksCtx = this.fireworksCanvas ? this.fireworksCanvas.getContext('2d') : null;
    this.fireworks = [];
    this.particles = [];
    this.fireworksAnimId = null;
    this.isFireworksActive = false;

    // Navigation & Buttons
    this.btnOpenSurprise = document.getElementById('btnOpenSurprise');
    this.btnPlayGame = document.getElementById('btnPlayGame');
    this.btnGoToFireworks = document.getElementById('btnGoToFireworks');
    this.btnReplayJourney = document.getElementById('btnReplayJourney');
    this.globalMusicBtn = document.getElementById('globalMusicBtn');
    this.globalMusicLabel = document.getElementById('globalMusicLabel');

    this.init();
  }

  init() {
    this.populateFriendData();
    this.setupStarCanvas();
    this.setupFireworksCanvas();
    this.setupEventListeners();
  }

  // Populate dynamic names and greeting from config
  populateFriendData() {
    const friend = this.config.friend || {};
    const displayName = friend.name || 'Mansi';
    const nickname = friend.nickname || 'Manu';

    // Populate all .friend-name elements
    const friendNameEls = document.querySelectorAll('.friend-name');
    friendNameEls.forEach(el => {
      el.textContent = displayName;
    });

    // Populate all .friend-nickname elements
    const friendNicknameEls = document.querySelectorAll('.friend-nickname');
    friendNicknameEls.forEach(el => {
      el.textContent = nickname;
    });

    // Update welcome body text if available
    const welcomeBodyEl = document.querySelector('.welcome-body-text');
    if (welcomeBodyEl && friend.welcomeSubtitle) {
      welcomeBodyEl.textContent = friend.welcomeSubtitle;
    }

    // Update letter salutation
    const letterSalutationEl = document.querySelector('.letter-salutation');
    if (letterSalutationEl && friend.letterSalutation) {
      letterSalutationEl.textContent = friend.letterSalutation;
    }

    // Update letter paragraphs
    const letterBodyCopyEl = document.getElementById('letterBodyCopy');
    if (letterBodyCopyEl && Array.isArray(friend.letterParagraphs) && friend.letterParagraphs.length > 0) {
      letterBodyCopyEl.innerHTML = '';
      friend.letterParagraphs.forEach((pText, idx) => {
        const p = document.createElement('p');
        if (idx === friend.letterParagraphs.length - 1) {
          p.className = 'letter-sign-off';
        }
        p.textContent = pText;
        letterBodyCopyEl.appendChild(p);
      });
    }

    // Set page title
    document.title = `Happy Birthday ${displayName} (${nickname})! ✨🎂`;
  }

  setupEventListeners() {
    // Card 1 -> Card 2 (Welcome -> Cake)
    if (this.btnOpenSurprise) {
      this.btnOpenSurprise.addEventListener('click', () => {
        // Start background music on user's first gesture
        if (window.soundSystem && !window.soundSystem.isPlaying) {
          window.soundSystem.startBackgroundMusic();
        }
        if (window.soundSystem) {
          window.soundSystem.playSuccessChime();
        }
        if (window.confetti) {
          window.confetti.burst({ count: 40, speed: 8 });
        }
        this.transitionToScene('sceneCake', 'dark-night');
      });
    }

    // Card 3 -> Card 4 (After Celebration -> Quiz)
    if (this.btnPlayGame) {
      this.btnPlayGame.addEventListener('click', () => {
        if (window.soundSystem) {
          window.soundSystem.playSuccessChime();
        }
        this.transitionToScene('sceneQuiz', 'pastel-light');
      });
    }

    // Card 10 -> Card 11 (Letter -> Final Message / Fireworks)
    if (this.btnGoToFireworks) {
      this.btnGoToFireworks.addEventListener('click', () => {
        this.transitionToScene('sceneFinalMessage', 'fireworks-night');
      });
    }

    // Card 11 -> Card 1 (Replay Journey)
    if (this.btnReplayJourney) {
      this.btnReplayJourney.addEventListener('click', () => {
        this.resetAll();
      });
    }

    // Global Top Music Toggle
    if (this.globalMusicBtn) {
      this.globalMusicBtn.addEventListener('click', () => {
        if (window.soundSystem) {
          window.soundSystem.toggleAudio();
          this.updateMusicUI(window.soundSystem.isPlaying);
        }
      });
    }
  }

  updateMusicUI(isPlaying) {
    if (this.globalMusicLabel) {
      this.globalMusicLabel.textContent = isPlaying ? 'Playing' : 'Muted';
    }
  }

  // Direct scene presentation (No page scrolling)
  transitionToScene(sceneId, themeName) {
    const currentScene = document.getElementById(this.currentSceneId);
    const nextScene = document.getElementById(sceneId);

    if (!nextScene) return;

    if (currentScene) {
      currentScene.classList.remove('active');
    }

    // Switch theme attribute on body
    if (themeName) {
      document.body.dataset.theme = themeName;
    }

    // Stop fireworks if leaving final scene
    if (this.currentSceneId === 'sceneFinalMessage' && sceneId !== 'sceneFinalMessage') {
      this.stopFireworks();
    }

    // Appear direct
    setTimeout(() => {
      nextScene.classList.add('active');
      this.currentSceneId = sceneId;

      // Special triggers
      if (sceneId === 'sceneFinalMessage') {
        this.startFireworks();
        if (window.confetti) {
          window.confetti.celebrationCannon();
        }
      }
    }, 150);
  }

  resetAll() {
    if (window.cakeManager) window.cakeManager.reset();
    if (window.quizEngine) window.quizEngine.reset();
    this.transitionToScene('sceneWelcome', 'dark-night');
  }

  // --------------------------------------------------------------------------
  // AMBIENT STAR CANVAS
  // --------------------------------------------------------------------------
  setupStarCanvas() {
    if (!this.particlesCanvas || !this.particlesCtx) return;

    const resize = () => {
      this.particlesCanvas.width = window.innerWidth;
      this.particlesCanvas.height = window.innerHeight;
      this.initStars();
    };

    window.addEventListener('resize', resize);
    resize();
    this.animateStars();
  }

  initStars() {
    this.stars = [];
    const count = Math.floor((this.particlesCanvas.width * this.particlesCanvas.height) / 7000);
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.particlesCanvas.width,
        y: Math.random() * this.particlesCanvas.height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  animateStars() {
    if (!this.particlesCtx) return;
    this.particlesCtx.clearRect(0, 0, this.particlesCanvas.width, this.particlesCanvas.height);

    const theme = document.body.dataset.theme;
    if (theme === 'dark-night' || theme === 'fireworks-night') {
      this.particlesCtx.fillStyle = '#ffffff';
      this.stars.forEach(s => {
        s.alpha += s.speed;
        const currentAlpha = (Math.sin(s.alpha) + 1) / 2 * 0.8 + 0.15;
        this.particlesCtx.globalAlpha = currentAlpha;
        this.particlesCtx.beginPath();
        this.particlesCtx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        this.particlesCtx.fill();
      });
    }

    this.starsAnimId = requestAnimationFrame(() => this.animateStars());
  }

  // --------------------------------------------------------------------------
  // DAZZLING FIREWORKS ENGINE (Card 11: Final Message)
  // --------------------------------------------------------------------------
  setupFireworksCanvas() {
    if (!this.fireworksCanvas || !this.fireworksCtx) return;

    const resize = () => {
      this.fireworksCanvas.width = window.innerWidth;
      this.fireworksCanvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();
  }

  startFireworks() {
    this.isFireworksActive = true;
    this.fireworks = [];
    this.particles = [];
    this.animateFireworks();
  }

  stopFireworks() {
    this.isFireworksActive = false;
    if (this.fireworksAnimId) {
      cancelAnimationFrame(this.fireworksAnimId);
    }
    if (this.fireworksCtx) {
      this.fireworksCtx.clearRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);
    }
  }

  animateFireworks() {
    if (!this.isFireworksActive || !this.fireworksCtx) return;

    // Slight fade trail
    this.fireworksCtx.fillStyle = 'rgba(6, 2, 12, 0.22)';
    this.fireworksCtx.fillRect(0, 0, this.fireworksCanvas.width, this.fireworksCanvas.height);

    // Launch random firework rocket
    if (Math.random() < 0.08) {
      const colors = ['#ff4985', '#ffd166', '#8c42f6', '#06d6a0', '#118ab2', '#ff5c8a', '#ffffff'];
      const targetX = Math.random() * (this.fireworksCanvas.width * 0.8) + (this.fireworksCanvas.width * 0.1);
      const targetY = Math.random() * (this.fireworksCanvas.height * 0.5) + (this.fireworksCanvas.height * 0.1);
      
      this.fireworks.push({
        x: this.fireworksCanvas.width / 2 + (Math.random() * 200 - 100),
        y: this.fireworksCanvas.height,
        targetX,
        targetY,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: 8,
        angle: Math.atan2(targetY - this.fireworksCanvas.height, targetX - (this.fireworksCanvas.width / 2)),
        isDead: false
      });
    }

    // Update fireworks rockets
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const fw = this.fireworks[i];
      const vx = Math.cos(fw.angle) * fw.speed;
      const vy = Math.sin(fw.angle) * fw.speed;
      fw.x += vx;
      fw.y += vy;

      this.fireworksCtx.fillStyle = fw.color;
      this.fireworksCtx.beginPath();
      this.fireworksCtx.arc(fw.x, fw.y, 3, 0, Math.PI * 2);
      this.fireworksCtx.fill();

      // Explode when reached height
      if (fw.y <= fw.targetY) {
        this.createExplosion(fw.x, fw.y, fw.color);
        this.fireworks.splice(i, 1);
      }
    }

    // Update sparks/particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // Gravity
      p.alpha -= 0.016;

      this.fireworksCtx.save();
      this.fireworksCtx.globalAlpha = Math.max(0, p.alpha);
      this.fireworksCtx.fillStyle = p.color;
      this.fireworksCtx.beginPath();
      this.fireworksCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.fireworksCtx.fill();
      this.fireworksCtx.restore();

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }

    this.fireworksAnimId = requestAnimationFrame(() => this.animateFireworks());
  }

  createExplosion(x, y, color) {
    const particleCount = 45;
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: Math.random() * 2 + 1,
        alpha: 1
      });
    }
  }
}

// Global initialization
window.app = null;
document.addEventListener('DOMContentLoaded', () => {
  window.app = new BirthdayApp();
});
