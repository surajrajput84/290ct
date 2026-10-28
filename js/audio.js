/**
 * ============================================================================
 * 🎵 BIRTHDAY SOUND & MUSIC SYSTEM
 * Supports custom MP3 background audio + Full Web Audio API Music Box & SFX!
 * 100% reliable - works out-of-the-box even with zero audio files!
 * ============================================================================
 */

class BirthdaySoundSystem {
  constructor() {
    this.audioCtx = null;
    this.bgAudio = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.synthLoopTimer = null;
    this.currentNoteIndex = 0;
    this.volume = (typeof BIRTHDAY_CONFIG !== 'undefined' && BIRTHDAY_CONFIG.music?.defaultVolume) || 0.6;
    this.isSynthPlaying = false;

    // Musical notes frequency map (Hz)
    this.notes = {
      'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23,
      'G4': 392.00, 'A4': 440.00, 'Bb4': 466.16, 'B4': 493.88,
      'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46,
      'G5': 783.99, 'A5': 880.00, 'Bb5': 932.33, 'C6': 1046.50
    };

    // "Happy Birthday to You" Melody Sheet (Note, duration in beats)
    this.melody = [
      { note: 'C4', d: 0.75 }, { note: 'C4', d: 0.25 }, { note: 'D4', d: 1.0 }, { note: 'C4', d: 1.0 }, { note: 'F4', d: 1.0 }, { note: 'E4', d: 2.0 },
      { note: 'C4', d: 0.75 }, { note: 'C4', d: 0.25 }, { note: 'D4', d: 1.0 }, { note: 'C4', d: 1.0 }, { note: 'G4', d: 1.0 }, { note: 'F4', d: 2.0 },
      { note: 'C4', d: 0.75 }, { note: 'C4', d: 0.25 }, { note: 'C5', d: 1.0 }, { note: 'A4', d: 1.0 }, { note: 'F4', d: 1.0 }, { note: 'E4', d: 1.0 }, { note: 'D4', d: 2.0 },
      { note: 'Bb4', d: 0.75 }, { note: 'Bb4', d: 0.25 }, { note: 'A4', d: 1.0 }, { note: 'F4', d: 1.0 }, { note: 'G4', d: 1.0 }, { note: 'F4', d: 2.5 }
    ];
  }

  // Initialize AudioContext upon first user gesture (to bypass autoplay block)
  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Play background music (tries MP3 first, falls back to Web Audio Music Box)
  startBackgroundMusic() {
    this.initContext();

    const configMusicUrl = (typeof BIRTHDAY_CONFIG !== 'undefined' && BIRTHDAY_CONFIG.music?.bgMusicUrl) || '';

    if (configMusicUrl) {
      if (!this.bgAudio) {
        this.bgAudio = new Audio(configMusicUrl);
        this.bgAudio.loop = true;
        this.bgAudio.volume = this.volume;

        // Fallback to Synth if audio file fails to load
        this.bgAudio.onerror = () => {
          console.warn('[Audio] Custom MP3 file could not be loaded. Seamlessly switching to Web Audio API Music Box!');
          this.startSynthMelody();
        };
      }

      this.bgAudio.play()
        .then(() => {
          this.isPlaying = true;
          this.updateControllerUI(true);
        })
        .catch(() => {
          // If browser policy or file not accessible, start synth melody
          this.startSynthMelody();
        });
    } else {
      this.startSynthMelody();
    }
  }

  // Soft Music Box Synthesizer
  startSynthMelody() {
    if (this.isSynthPlaying || this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    this.isSynthPlaying = true;
    this.isPlaying = true;
    this.updateControllerUI(true);

    let noteIdx = 0;
    const tempo = 270; // ms per beat

    const playNext = () => {
      if (!this.isSynthPlaying || this.isMuted) return;

      const item = this.melody[noteIdx];
      const freq = this.notes[item.note] || 440;
      const durationSec = (item.d * tempo) / 1000;

      this.playChimeTone(freq, durationSec);

      noteIdx = (noteIdx + 1) % this.melody.length;
      const delay = (item.d * tempo) + 60; // slight gap between notes

      this.synthLoopTimer = setTimeout(playNext, delay);
    };

    playNext();
  }

  // Synthesize a gentle music-box bell/chime
  playChimeTone(freq, duration) {
    if (!this.audioCtx || this.isMuted) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Soft sine + gentle triangle harmonic
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + Math.max(0.4, duration * 1.5));

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + Math.max(0.45, duration * 1.6));
    } catch (e) {
      console.warn('[Audio Synth]', e);
    }
  }

  // Stop / Pause all background music
  stopBackgroundMusic() {
    this.isPlaying = false;
    this.isSynthPlaying = false;
    if (this.synthLoopTimer) {
      clearTimeout(this.synthLoopTimer);
      this.synthLoopTimer = null;
    }
    if (this.bgAudio) {
      this.bgAudio.pause();
    }
    this.updateControllerUI(false);
  }

  // Toggle Mute / Play
  toggleAudio() {
    this.initContext();
    if (this.isPlaying) {
      this.stopBackgroundMusic();
      this.isMuted = true;
    } else {
      this.isMuted = false;
      this.startBackgroundMusic();
    }
  }

  // Update Equalizer & Button UI
  updateControllerUI(playing) {
    const controller = document.getElementById('musicController');
    const label = document.getElementById('musicLabel');
    const icon = document.getElementById('musicIcon');

    if (!controller) return;

    if (playing) {
      controller.classList.remove('paused');
      if (label) label.textContent = 'Music Playing';
      if (icon) icon.textContent = '🔊';
    } else {
      controller.classList.add('paused');
      if (label) label.textContent = 'Sound Muted';
      if (icon) icon.textContent = '🔇';
    }
  }

  // --------------------------------------------------------------------------
  // SOUND EFFECTS (SFX)
  // --------------------------------------------------------------------------

  // Extinguishing Candle Puff sound
  playCandleBlow() {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;

    try {
      const now = this.audioCtx.currentTime;
      const bufferSize = this.audioCtx.sampleRate * 0.45;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(100, now + 0.4);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
      noise.stop(now + 0.45);
    } catch (e) {
      console.warn('[SFX Candle]', e);
    }
  }

  // Correct answer joyous chime (C5 -> E5 -> G5 -> C6)
  playSuccessChime() {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;

    const pitches = [523.25, 659.25, 783.99, 1046.50];
    pitches.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          const now = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.2, now + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.4);
        } catch (e) {}
      }, idx * 75);
    });
  }

  // Gentle buzz for incorrect attempt
  playWrongAttempt() {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(196, now); // G3
      osc.frequency.linearRampToValueAtTime(164.81, now + 0.22); // E3

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }

  // Confetti Pop
  playConfettiPop() {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.12);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {}
  }

  // Shooting star sparkle sound
  playShootingStar() {
    this.initContext();
    if (!this.audioCtx || this.isMuted) return;

    const freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98];
    freqs.forEach((f, i) => {
      setTimeout(() => {
        try {
          const now = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.38);
        } catch (e) {}
      }, i * 90);
    });
  }
}

// Global Sound Instance
window.soundSystem = new BirthdaySoundSystem();
