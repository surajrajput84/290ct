/**
 * ============================================================================
 * 🎂 BIRTHDAY CAKE & CANDLE BLOWING MANAGER
 * Exact match with Card 2: Interactive candles on cake, Make a Wish button,
 * audio player bar integration, and direct transition to After Celebration.
 * ============================================================================
 */

class BirthdayCakeManager {
  constructor() {
    this.candlesGroup = document.getElementById('cakeCandlesGroup');
    this.makeWishBtn = document.getElementById('btnMakeWish');
    this.bottomMuteBtn = document.getElementById('btnBottomMute');
    this.bottomPlayBtn = document.getElementById('btnBottomPlay');

    this.candles = [];
    this.allBlown = false;

    this.init();
  }

  init() {
    this.setupCandles();
    this.setupEventListeners();
  }

  setupCandles() {
    if (!this.candlesGroup) return;
    this.candles = Array.from(this.candlesGroup.querySelectorAll('.interactive-candle'));

    this.candles.forEach((candle, idx) => {
      candle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.blowCandle(candle);
      });
    });
  }

  setupEventListeners() {
    // "Make a Wish ✨" button
    if (this.makeWishBtn) {
      this.makeWishBtn.addEventListener('click', () => {
        this.blowAllCandlesAndWish();
      });
    }

    // Bottom music bar buttons
    if (this.bottomMuteBtn) {
      this.bottomMuteBtn.addEventListener('click', () => {
        if (window.soundSystem) {
          window.soundSystem.toggleMute();
          this.bottomMuteBtn.textContent = window.soundSystem.isMuted ? '🔇' : '🔊';
        }
      });
    }

    if (this.bottomPlayBtn) {
      this.bottomPlayBtn.addEventListener('click', () => {
        if (window.soundSystem) {
          window.soundSystem.toggleAudio();
        }
      });
    }
  }

  // Blow single candle
  blowCandle(candleEl) {
    if (candleEl.classList.contains('blown')) return;

    candleEl.classList.add('blown');

    if (window.soundSystem) {
      window.soundSystem.playCandleBlow();
    }

    if (window.confetti) {
      const rect = candleEl.getBoundingClientRect();
      window.confetti.burst({
        x: rect.left + rect.width / 2,
        y: rect.top,
        count: 20,
        speed: 6
      });
    }

    this.checkIfAllBlown();
  }

  // Blow all candles when "Make a Wish ✨" is clicked
  blowAllCandlesAndWish() {
    if (this.allBlown) {
      this.onWishComplete();
      return;
    }

    let unblown = this.candles.filter(c => !c.classList.contains('blown'));
    if (unblown.length === 0) {
      this.onWishComplete();
      return;
    }

    unblown.forEach((candle, idx) => {
      setTimeout(() => {
        this.blowCandle(candle);
      }, idx * 120);
    });

    setTimeout(() => {
      this.onWishComplete();
    }, (unblown.length * 120) + 400);
  }

  checkIfAllBlown() {
    const unblown = this.candles.filter(c => !c.classList.contains('blown'));
    if (unblown.length === 0 && !this.allBlown) {
      this.allBlown = true;
      setTimeout(() => {
        this.onWishComplete();
      }, 500);
    }
  }

  onWishComplete() {
    this.allBlown = true;

    if (window.soundSystem) {
      window.soundSystem.playSuccessChime();
    }

    if (window.confetti) {
      window.confetti.celebrationCannon();
    }

    // Direct smooth transition to Card 3: After Celebration
    setTimeout(() => {
      if (window.app) {
        window.app.transitionToScene('sceneAfterCelebration', 'pastel-light');
      }
    }, 700);
  }

  reset() {
    this.allBlown = false;
    this.candles.forEach(c => c.classList.remove('blown'));
  }
}

// Global instance
window.cakeManager = null;
document.addEventListener('DOMContentLoaded', () => {
  window.cakeManager = new BirthdayCakeManager();
});
