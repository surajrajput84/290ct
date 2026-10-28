# 🎂 Birthday Surprise Interactive Website

A complete, responsive, and deeply personal **Birthday Surprise Website** crafted with HTML5, CSS3, and JavaScript.

Features a grand welcome portal, an interactive 3D birthday cake with blowable/clickable candles, a 4-question multiple-choice memory quest where each correct answer unlocks a unique video memory, non-revealing friendly hints with retry capabilities, background music with animated equalizer and mute toggle, and an emotional finale with a friendship letter, memory photo gallery, and an interactive "Make a Wish" shooting star ritual.

---

## ✨ Features

- 🌟 **Grand Welcome Portal**: Festive glowing aura, personalized friend greeting, profile photo, and sound prompt.
- 🎂 **Interactive Cake & Candles**: 3D styled layered cake with realistic flickering flames. Candles can be blown out individually by clicking, all at once with "Blow Out Candles", or by gently blowing into your microphone!
- 🎊 **Confetti & Particle Cannon**: Zero-dependency, high-performance canvas confetti bursts and fireworks.
- 🧩 **4-Question Memory Quest**:
  - Multiple-choice cards with smooth hover animations.
  - **Friendly Hints on Wrong Answers**: Soft bounce animation and non-revealing personalized hints encouraging retries without giving the answer away.
  - **Stage Progress Bar**: Step indicators tracking progress through all 4 chapters.
- 🎬 **Video Reward Unlocks**:
  - Unlocks a custom video memory after each correct answer.
  - Supports local `.mp4`/`.webm` video files, direct video URLs, and YouTube embeds.
  - **Strict Sequencing**: Enforces watching until completion or explicit skip before the next question unlocks.
  - **Graceful Error Handling & Fallbacks**: If a custom video hasn't been added yet or fails to load, it automatically displays an animated memory photo card with a notice, allowing testing without broken screens or blockers.
- 💌 **Grand Finale**:
  - Massive celebratory confetti cannon.
  - Warm personal letter formatted like luxury parchment with personalized signature and quotes.
  - **Memory Photo Gallery**: Grid of memory cards with hover zoom and full-screen lightbox view.
  - **Interactive Birthday Extras**:
    - 🌠 *Make a Wish*: Launches an animated shooting star across the screen and saves the wish.
    - 🎈 *Pop Balloons*: Spawns interactive floating balloons that pop into confetti when tapped.
    - 🔄 *Relive Journey*: Allows replaying the entire experience from the start.
    - 💌 *Share Surprise*: Web Share API / clipboard copy helper.
- 🎵 **Adaptive Sound System**:
  - Floating music controller with animated equalizer bars and mute toggle.
  - Works 100% out-of-the-box: even if no MP3 file is provided, an automatic Web Audio API Synthesizer plays a gentle music-box version of "Happy Birthday" and synthesizes realistic candle puff, chime, and confetti SFX!
- 📱 **Mobile-Friendly & Accessible**: Fully responsive on iPhone, Android, tablets, and desktop. Meets WCAG contrast standards and respects `prefers-reduced-motion`.

---

## 🚀 Quick Start (Running Locally)

### Option 1: Instant Local Dev Server (Recommended)
You can run the project using Vite:
```bash
# Install dependencies (only needed once)
npm install

# Start local development server
npm run dev
```
Open the URL shown in your terminal (usually `http://localhost:5173`).

### Option 2: Python Static Server (Zero-install)
If Python is installed on your machine:
```bash
# Python 3
python -m http.server 8000
```
Open `http://localhost:8000` in your web browser.

### Option 3: Double-click to Open
Because this website uses vanilla HTML5, CSS3, and JavaScript, you can open `index.html` directly in any modern browser! *(Note: for local video and audio files, running through a local server like Option 1 or 2 is recommended due to browser CORS policies on file:// URLs).*

---

## 🛠️ Personalization Guide (`config.js`)

All the text, photos, questions, answers, hints, and video paths are kept in a single, well-organized configuration file: **[`config.js`](config.js)**.

### 1. Friend's Profile
```javascript
friend: {
  name: "Mansi",                   // Friend's display name
  nickname: "Manu",                // Loving nickname used in greetings
  birthdayDate: "Today",           // Date of their special day
  welcomeSubtitle: "On this special day, I just want to remind you how amazing, kind and wonderful you are, Manu! You deserve all the happiness in the world! ✨",
}
```

### 2. Custom Videos & Quiz Questions
In `config.js`, find the `quiz` array. Each of the 4 questions has the following structure:
```javascript
{
  id: 1,
  badge: "Chapter 1",
  title: "The Golden Road Trip",
  question: "Where did we take that legendary road trip where we rolled all windows down?",
  options: [
    "Pacific Coast Highway at Sunset",
    "The Rocky Mountain Switchbacks",
    "The Midnight Downtown Loop",
    "The Country Lakeside Trail"
  ],
  correctAnswerIndex: 0, // 0 = 1st option, 1 = 2nd option, etc.
  hint: "Remember the warm ocean breeze and golden hour sunlight? 🌊🚗",
  video: {
    title: "Unlocked Memory #1: Highway Harmonies 🎶",
    url: "assets/videos/memory1.mp4", // Or a YouTube link!
    caption: "Still the best sunset drive of all time.",
    fallbackImage: "assets/images/memory_1.jpg",
    description: "That golden hour was pure magic."
  }
}
```

### 3. Adding Your Own Media Files
- **Photos**: Place your images in `assets/images/` (e.g. `hero_avatar.jpg`, `memory_1.jpg`, `memory_2.jpg`, etc.).
- **Videos**: Place your MP4 videos in `assets/videos/` (e.g. `memory1.mp4`, `memory2.mp4`, `memory3.mp4`, `memory4.mp4`).
- **Music**: Place your song file in `assets/audio/` (e.g. `happy_birthday.mp3`).

---

## 🌐 Free Deployment Guide

### Deploying to GitHub Pages (Free)
1. Initialize a git repository and push your project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Birthday Surprise Website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/birthday-surprise.git
   git push -u origin main
   ```
2. On GitHub, navigate to **Settings** > **Pages**.
3. Under **Branch**, select `main` and `/ (root)`, then click **Save**.
4. Within 1–2 minutes, your website will be live at `https://YOUR_USERNAME.github.io/birthday-surprise/`!

### Deploying to Vercel (Free)
1. Install Vercel CLI (or connect your GitHub repository in [vercel.com](https://vercel.com)):
   ```bash
   npx vercel
   ```
2. Follow the 2-step prompt. Because this is a static web application, Vercel will immediately deploy and provide a secure `https://birthday-surprise.vercel.app` link with instant global CDN speed!

---

## 📂 Project Architecture

```
birthday/
├── index.html              # Main HTML5 entrypoint
├── config.js               # Central configuration file for all customizations
├── css/
│   ├── style.css           # Design tokens, reset, typography, and responsive layout
│   ├── animations.css      # Keyframes for candles, balloons, stars, and shakes
│   └── components.css      # Glassmorphic cards, cake, quiz, video modal, and gallery
├── js/
│   ├── audio.js            # Background music + Web Audio API synthesizer & SFX
│   ├── confetti.js         # Canvas confetti & celebration cannons engine
│   ├── cake.js             # Interactive cake, candle click, and microphone detection
│   ├── quiz.js             # 4-question quiz engine, hints, and retries
│   ├── video.js            # Video reward unlock modal, skip & completion logic
│   └── app.js              # Master application controller and scene transitions
├── assets/
│   ├── images/             # Hero portrait and memory gallery photos
│   ├── videos/             # Custom video directory
│   └── audio/              # Custom audio directory
├── package.json            # Vite scripts for optional dev server
└── README.md               # Documentation and guides
```

---

## ✨ Crafted for Best Friends & Unforgettable Birthdays
Feel free to customize, add your favorite inside jokes, and give your friend a celebration they'll remember forever!
