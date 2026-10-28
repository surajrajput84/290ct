# 🎵 Birthday Audio Directory

Place your custom birthday background music or song file here!

### Recommended File Name:
- `happy_birthday.mp3`

### Built-in Web Audio API Synthesizer:
Even if you do not add an MP3 file, the website has a built-in Web Audio API Music Box synthesizer that automatically plays a warm, gentle acoustic music-box rendition of the "Happy Birthday" melody along with synthesized sound effects for candle blowing, confetti pops, and success chimes!

To use your own custom song, drop your `.mp3` file here and ensure the path is set in `config.js`:
```javascript
music: {
  bgMusicUrl: "assets/audio/happy_birthday.mp3",
  synthMelodyEnabled: true,
  defaultVolume: 0.6
}
```
