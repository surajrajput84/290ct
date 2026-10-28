/**
 * ============================================================================
 * 🎬 VIDEO REWARD UNLOCK MANAGER
 * Handles video playback, YouTube embeds, local MP4/WebM files, error handling,
 * fallback memory reels, and enforce video finish/skip before proceeding.
 * ============================================================================
 */

class BirthdayVideoManager {
  constructor() {
    this.modal = document.getElementById('videoModalBackdrop');
    this.titleEl = document.getElementById('videoTitle');
    this.captionEl = document.getElementById('videoCaption');
    this.videoPlayer = document.getElementById('rewardVideoPlayer');
    this.iframeContainer = document.getElementById('videoIframeContainer');
    this.fallbackScreen = document.getElementById('videoFallbackScreen');
    this.fallbackImg = document.getElementById('fallbackMemoryImg');
    this.fallbackNotice = document.getElementById('fallbackNoticeText');
    this.statusText = document.getElementById('videoStatusText');
    this.skipBtn = document.getElementById('skipVideoBtn');
    this.continueBtn = document.getElementById('continueNextBtn');

    this.currentVideoConfig = null;
    this.onCompleteCallback = null;
    this.isFinishedOrSkipped = false;

    this.setupListeners();
  }

  setupListeners() {
    if (this.videoPlayer) {
      // Trigger when video naturally finishes playing
      this.videoPlayer.addEventListener('ended', () => {
        this.markFinished('finished');
      });

      // Handle loading or playback errors
      this.videoPlayer.addEventListener('error', (e) => {
        console.warn('[Video Player] Playback/Load error:', e);
        this.handleVideoError();
      });

      // Update status while playing
      this.videoPlayer.addEventListener('timeupdate', () => {
        if (!this.isFinishedOrSkipped && this.videoPlayer.duration) {
          const current = Math.floor(this.videoPlayer.currentTime);
          const total = Math.floor(this.videoPlayer.duration);
          if (this.statusText) {
            this.statusText.innerHTML = `<span>⏳ Playing memory... (${current}s / ${total}s)</span>`;
          }
        }
      });
    }

    // Skip Button
    if (this.skipBtn) {
      this.skipBtn.addEventListener('click', () => {
        this.markFinished('skipped');
      });
    }

    // Continue to next question or finale
    if (this.continueBtn) {
      this.continueBtn.addEventListener('click', () => {
        if (!this.isFinishedOrSkipped) return;
        this.closeModal();
        if (typeof this.onCompleteCallback === 'function') {
          this.onCompleteCallback();
        }
      });
    }
  }

  // Open and play the unlocked video for a stage
  playRewardVideo(videoConfig, isLastQuestion, onComplete) {
    this.currentVideoConfig = videoConfig;
    this.onCompleteCallback = onComplete;
    this.isFinishedOrSkipped = false;

    // Reset UI states
    this.titleEl.textContent = videoConfig.title || 'Unlocked Birthday Memory 🎬';
    this.captionEl.textContent = videoConfig.caption || '';
    
    // Configure Next button text
    if (isLastQuestion) {
      this.continueBtn.innerHTML = `Proceed to Grand Finale 🎁✨`;
    } else {
      this.continueBtn.innerHTML = `Continue to Next Question ➡️`;
    }

    this.continueBtn.disabled = true;
    this.continueBtn.style.opacity = '0.5';
    this.continueBtn.style.cursor = 'not-allowed';

    this.statusText.innerHTML = `<span>▶️ Memory playback in progress...</span>`;

    // Reset players
    this.fallbackScreen.style.display = 'none';
    this.iframeContainer.style.display = 'none';
    this.iframeContainer.innerHTML = '';
    this.videoPlayer.style.display = 'none';
    this.videoPlayer.pause();
    this.videoPlayer.removeAttribute('src');
    this.videoPlayer.load();

    const url = (videoConfig.url || '').trim();

    // Show modal
    this.modal.classList.add('active');

    if (!url) {
      this.handleVideoError('No video URL specified in config.js');
      return;
    }

    // Detect YouTube URL
    const youtubeId = this.extractYouTubeId(url);
    if (youtubeId) {
      this.playYouTubeVideo(youtubeId);
      return;
    }

    // Direct MP4 / WebM / Local video file
    this.playDirectVideo(url);
  }

  // Play direct video file
  playDirectVideo(url) {
    this.videoPlayer.style.display = 'block';
    this.videoPlayer.src = url;
    this.videoPlayer.controls = true;

    // Soft duck background music while video plays
    if (window.soundSystem && window.soundSystem.isPlaying) {
      window.soundSystem.stopBackgroundMusic();
      this.resumedBgMusicNeeded = true;
    }

    const playPromise = this.videoPlayer.play();
    if (playPromise !== undefined) {
      playPromise.catch(err => {
        console.warn('[Video Player] Autoplay could not start:', err);
        // User can click play button on video player
        this.statusText.innerHTML = `<span>👆 Press Play to watch the memory clip</span>`;
      });
    }
  }

  // Embed YouTube player
  playYouTubeVideo(videoId) {
    this.iframeContainer.style.display = 'block';
    this.iframeContainer.innerHTML = `
      <iframe 
        id="ytPlayerIframe"
        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    `;

    this.statusText.innerHTML = `<span>📺 Playing YouTube memory clip. You can watch or skip when ready.</span>`;
  }

  // Handle missing files or video load failure gracefully
  handleVideoError(customMsg) {
    this.videoPlayer.style.display = 'none';
    this.iframeContainer.style.display = 'none';
    this.fallbackScreen.style.display = 'flex';

    if (this.currentVideoConfig && this.currentVideoConfig.fallbackImage) {
      this.fallbackImg.src = this.currentVideoConfig.fallbackImage;
      this.fallbackImg.alt = this.currentVideoConfig.title || 'Unlocked memory photo';
    }

    const videoUrl = this.currentVideoConfig?.url || 'unspecified';
    this.fallbackNotice.innerHTML = `
      <strong>💡 Video Preview Notice:</strong><br/>
      We couldn't load <code>${videoUrl}</code>.<br/>
      ${customMsg || "You can drop your video into <code>assets/videos/</code> and update <code>config.js</code> anytime!"}<br/>
      <em>In the meantime, your unlocked memory photo is displayed above! ✨</em>
    `;

    // Immediately enable continue/skip so user is never stuck
    this.markFinished('fallback');
  }

  // Mark video as finished or skipped
  markFinished(reason) {
    this.isFinishedOrSkipped = true;

    if (this.videoPlayer) {
      this.videoPlayer.pause();
    }

    if (reason === 'skipped') {
      this.statusText.innerHTML = `<span>⏭️ Video skipped. Ready to continue!</span>`;
    } else {
      this.statusText.innerHTML = `<span>✅ Memory unlocked & completed!</span>`;
    }

    // Enable continue button
    this.continueBtn.disabled = false;
    this.continueBtn.style.opacity = '1';
    this.continueBtn.style.cursor = 'pointer';
    this.continueBtn.classList.add('pop-in');

    if (window.soundSystem) {
      window.soundSystem.playSuccessChime();
    }
  }

  // Close modal and resume ambient music if needed
  closeModal() {
    this.modal.classList.remove('active');
    if (this.videoPlayer) {
      this.videoPlayer.pause();
      this.videoPlayer.src = '';
    }
    if (this.iframeContainer) {
      this.iframeContainer.innerHTML = '';
    }

    if (this.resumedBgMusicNeeded && window.soundSystem && !window.soundSystem.isMuted) {
      window.soundSystem.startBackgroundMusic();
      this.resumedBgMusicNeeded = false;
    }
  }

  // Extract ID from youtube.com or youtu.be
  extractYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
}

// Global Video Manager
window.videoManager = null;
document.addEventListener('DOMContentLoaded', () => {
  window.videoManager = new BirthdayVideoManager();
});
