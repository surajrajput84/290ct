/**
 * ============================================================================
 * 🧩 MEMORY QUIZ & 5-SECOND PHOTO MEMORY AUTO-ADVANCING ENGINE
 * - Automatic direct display on correct answer
 * - 5-Second photographic memory presentation with live progress bar & countdown
 * - Automatically advances to next question after 5 seconds
 * - Uses custom user memories: image1.png, image2.png, image3.png, image4.png
 * - No ability to go back or change answered questions
 * ============================================================================
 */

class BirthdayQuizEngine {
  constructor() {
    this.quizList = (typeof BIRTHDAY_CONFIG !== 'undefined' && BIRTHDAY_CONFIG.quiz) || [];
    this.currentIndex = 0;
    this.selectedOptionIndex = null;
    this.optionKeys = ['A', 'B', 'C', 'D'];
    this.isLocked = false;
    this.photoInterval = null;
    this.photoDurationMs = 5000; // Strictly 5 seconds

    // DOM Elements
    this.stepText = document.getElementById('quizStepText');
    this.stepRatio = document.getElementById('quizStepRatio');
    this.progressFill = document.getElementById('quizProgressFill');
    this.questionTitle = document.getElementById('quizQuestionTitle');
    this.optionsGrid = document.getElementById('quizOptionsGrid');
    this.btnBack = document.getElementById('btnQuizBack');
    this.btnSubmit = document.getElementById('btnQuizSubmit');

    // Incorrect Modal Elements
    this.modalIncorrect = document.getElementById('modalIncorrect');
    this.hintBody = document.getElementById('quizHintBody');
    this.btnTryAgain = document.getElementById('btnTryAgain');

    // Correct Answer Scene Elements (Fallback)
    this.btnWatchVideo = document.getElementById('btnWatchVideo');

    // Photo Memory Unlock Scene Elements (Questions 1 - 3)
    this.photoFallbackContainer = document.getElementById('videoFallbackContainer');
    this.photoFallbackImg = document.getElementById('videoFallbackPhoto');
    this.photoCaption = document.getElementById('videoCaptionDisplay');
    this.btnContinueSurprise = document.getElementById('btnContinueSurprise');
    this.vidTrackFill = document.getElementById('vidTrackFill');
    this.vidTimeCounter = document.getElementById('vidTimeCounter');

    // Final Photo Memory Scene Elements (Question 4)
    this.finalPhotoFallback = document.getElementById('finalPhotoFallback');
    this.finalVidTrackFill = document.getElementById('finalVidTrackFill');
    this.finalVidTimeCounter = document.getElementById('finalVidTimeCounter');
    this.btnGoToLetter = document.getElementById('btnGoToLetter');

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadQuestion(0);
  }

  setupEventListeners() {
    // Back button disabled / no going back allowed
    if (this.btnBack) {
      this.btnBack.style.display = 'none';
    }

    // Submit Answer button
    if (this.btnSubmit) {
      this.btnSubmit.addEventListener('click', () => {
        this.handleSubmit();
      });
    }

    // Try Again button on Incorrect modal
    if (this.btnTryAgain) {
      this.btnTryAgain.addEventListener('click', () => {
        if (this.modalIncorrect) {
          this.modalIncorrect.classList.remove('active');
          this.modalIncorrect.setAttribute('aria-hidden', 'true');
        }
        this.isLocked = false;
      });
    }

    // Watch Video button (fallback if ever triggered)
    if (this.btnWatchVideo) {
      this.btnWatchVideo.addEventListener('click', () => {
        const isFinal = this.currentIndex === this.quizList.length - 1;
        this.startPhotoMemoryScene(isFinal);
      });
    }

    // Skip / Early Advance button on Memory screens
    if (this.btnContinueSurprise) {
      this.btnContinueSurprise.addEventListener('click', () => {
        this.stopPhotoTimer();
        this.advanceToNext();
      });
    }

    if (this.btnGoToLetter) {
      this.btnGoToLetter.addEventListener('click', () => {
        this.stopPhotoTimer();
        this.advanceToNext();
      });
    }
  }

  loadQuestion(index) {
    if (!this.quizList || index >= this.quizList.length || index < 0) return;

    this.currentIndex = index;
    this.selectedOptionIndex = null;
    this.isLocked = false;
    const item = this.quizList[index];

    // Header labels & Progress bar
    if (this.stepText) {
      this.stepText.textContent = item.step || `Question ${index + 1} of ${this.quizList.length}`;
    }
    if (this.stepRatio) {
      this.stepRatio.textContent = item.stepRatio || `${index + 1}/${this.quizList.length}`;
    }
    if (this.progressFill) {
      const pct = item.progress || ((index + 1) / this.quizList.length) * 100;
      this.progressFill.style.width = `${pct}%`;
    }

    // Question Prompt
    if (this.questionTitle) {
      this.questionTitle.textContent = item.question;
    }

    // Render Options List
    if (this.optionsGrid) {
      this.optionsGrid.innerHTML = '';
      item.options.forEach((optText, optIdx) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option-item';
        optionEl.setAttribute('role', 'radio');
        optionEl.setAttribute('aria-checked', 'false');
        optionEl.setAttribute('tabindex', '0');
        optionEl.dataset.index = optIdx;

        optionEl.innerHTML = `
          <div class="quiz-option-left">
            <span class="opt-letter-circle">${this.optionKeys[optIdx] || optIdx + 1}</span>
            <span class="opt-text">${optText}</span>
          </div>
          <div class="opt-check-badge">✓</div>
        `;

        optionEl.addEventListener('click', () => {
          this.selectOption(optIdx);
        });

        optionEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.selectOption(optIdx);
          }
        });

        this.optionsGrid.appendChild(optionEl);
      });
    }
  }

  selectOption(index) {
    if (this.isLocked) return; // Prevent changing after submission

    this.selectedOptionIndex = index;
    const allOptions = this.optionsGrid.querySelectorAll('.quiz-option-item');
    allOptions.forEach((opt, idx) => {
      if (idx === index) {
        opt.classList.add('selected');
        opt.setAttribute('aria-checked', 'true');
      } else {
        opt.classList.remove('selected');
        opt.setAttribute('aria-checked', 'false');
      }
    });
  }

  handleSubmit() {
    if (this.isLocked) return;

    if (this.selectedOptionIndex === null) {
      if (this.optionsGrid) {
        this.optionsGrid.style.transform = 'translateX(4px)';
        setTimeout(() => this.optionsGrid.style.transform = 'translateX(-4px)', 80);
        setTimeout(() => this.optionsGrid.style.transform = 'translateX(0)', 160);
      }
      return;
    }

    const currentItem = this.quizList[this.currentIndex];
    const isCorrect = this.selectedOptionIndex === currentItem.correctAnswerIndex;

    if (isCorrect) {
      // Correct! Lock options so user cannot change answer
      this.isLocked = true;

      // Celebrate
      if (window.soundSystem) {
        window.soundSystem.playSuccessChime();
      }
      if (window.confetti) {
        window.confetti.burst({ count: 40, speed: 9 });
      }

      const isFinal = this.currentIndex === this.quizList.length - 1;

      // Directly transition to the 5-second photo memory showcase
      setTimeout(() => {
        this.startPhotoMemoryScene(isFinal);
      }, 350);

    } else {
      // Incorrect!
      if (window.soundSystem) {
        window.soundSystem.playErrorBuzz();
      }

      if (this.hintBody) {
        this.hintBody.textContent = currentItem.hint || "Think about our funniest memories together!";
      }
      if (this.modalIncorrect) {
        this.modalIncorrect.classList.add('active');
        this.modalIncorrect.setAttribute('aria-hidden', 'false');
      }
    }
  }

  startPhotoMemoryScene(isFinal) {
    this.stopPhotoTimer();

    const currentItem = this.quizList[this.currentIndex];
    const memoryData = currentItem.video || {};

    // Elements based on scene
    const targetSceneId = isFinal ? 'sceneFinalVideo' : 'sceneVideoUnlock';
    const mainImg = isFinal ? document.getElementById('finalPhotoImg') : document.getElementById('videoFallbackPhoto');
    const blurImg = isFinal ? document.getElementById('finalBlurBgPhoto') : document.getElementById('videoBlurBgPhoto');
    const trackFill = isFinal ? this.finalVidTrackFill : this.vidTrackFill;
    const timeCounter = isFinal ? this.finalVidTimeCounter : this.vidTimeCounter;
    const skipBtn = isFinal ? this.btnGoToLetter : this.btnContinueSurprise;
    const countdownEl = isFinal ? document.getElementById('finalPhotoCountdownSec') : document.getElementById('photoCountdownSec');
    const headingEl = isFinal ? document.getElementById('finalVideoHeading') : document.getElementById('videoUnlockHeading');

    if (headingEl) {
      headingEl.textContent = isFinal ? 'Final Memory Surprise! 🌟' : `Memory Unlocked! (${this.currentIndex + 1}/4) ✨`;
    }

    // Set caption & image
    if (!isFinal && this.photoCaption) {
      this.photoCaption.textContent = memoryData.caption || 'A classic friendship memory just for you, Manu! 😂🎉';
    }
    if (mainImg && memoryData.fallbackImage) {
      mainImg.src = memoryData.fallbackImage;
    }
    if (blurImg && memoryData.fallbackImage) {
      blurImg.src = memoryData.fallbackImage;
    }

    // Reset progress track & counter for 5 seconds
    if (trackFill) trackFill.style.width = '0%';
    if (timeCounter) timeCounter.textContent = '0:00 / 0:05';
    if (countdownEl) countdownEl.textContent = '5';

    // Transition to scene
    if (window.app) {
      window.app.transitionToScene(targetSceneId, 'pastel-light');
    }

    // Run 5-Second Countdown & Auto-Advance Engine
    const startTime = Date.now();
    const duration = this.photoDurationMs; // 5000ms

    this.photoInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressRatio = Math.min(1, elapsed / duration);
      const elapsedSec = Math.min(5, Math.floor(elapsed / 1000));
      const remainingSec = Math.max(0, 5 - elapsedSec);

      // Update progress bar
      if (trackFill) {
        trackFill.style.width = `${(progressRatio * 100).toFixed(1)}%`;
      }

      // Update time counter (0:00 to 0:05)
      if (timeCounter) {
        timeCounter.textContent = `0:0${elapsedSec} / 0:05`;
      }

      // Update countdown text
      if (countdownEl) {
        countdownEl.textContent = remainingSec;
      }

      // 5s COMPLETED: Automatically advance!
      if (elapsed >= duration) {
        this.stopPhotoTimer();
        this.advanceToNext();
      }
    }, 100);
  }

  stopPhotoTimer() {
    if (this.photoInterval) {
      clearInterval(this.photoInterval);
      this.photoInterval = null;
    }

    // Stop animated playing zoom
    if (this.photoFallbackContainer) {
      this.photoFallbackContainer.classList.remove('playing');
    }
    if (this.finalPhotoFallback) {
      this.finalPhotoFallback.classList.remove('playing');
    }
  }

  advanceToNext() {
    this.stopPhotoTimer();

    const isFinal = this.currentIndex >= this.quizList.length - 1;

    if (!isFinal) {
      // Auto move directly to the next question!
      this.currentIndex++;
      this.loadQuestion(this.currentIndex);
      if (window.app) {
        window.app.transitionToScene('sceneQuiz', 'pastel-light');
      }
    } else {
      // Finished all 4 questions! Directly move to Final Birthday Letter
      if (window.app) {
        window.app.transitionToScene('sceneLetter', 'soft-pink');
      }
    }
  }

  reset() {
    this.stopPhotoTimer();
    this.currentIndex = 0;
    this.selectedOptionIndex = null;
    this.isLocked = false;
    this.loadQuestion(0);
  }
}

// Global instance
window.quizEngine = null;
document.addEventListener('DOMContentLoaded', () => {
  window.quizEngine = new BirthdayQuizEngine();
});
