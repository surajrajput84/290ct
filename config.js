/**
 * ============================================================================
 * 🎂 BIRTHDAY SURPRISE WEBSITE - CONFIGURATION FILE
 * ============================================================================
 */

const BIRTHDAY_CONFIG = {
  // 👤 FRIEND'S PROFILE
  friend: {
    name: "Mansi",
    fullName: "Mansi",
    nickname: "Manu",
    birthdayDate: "Today",
    welcomeTitle: "Happy Birthday,",
    welcomeSubtitle: "To one of the truest and coolest friends out there—hope your birthday is as awesome, fun, and energetic as you are, Manu! ✨🎉",
    letterSalutation: "Dear Mansi (Manu),",
    letterParagraphs: [
      "Happy Birthday, Manu! Thank you for being such an incredible friend and always bringing nonstop laughs, fun vibes, and positivity wherever you go. No matter what, you're always someone our group can count on.",
      "Never change—stay the hilarious, supportive, and amazing best friend that you are. Here's to making countless more crazy memories together!",
      "Your best friend always! 🤝🎉"
    ]
  },

  // 🎂 CELEBRATION & CAKE
  cake: {
    candleCount: 5,
    title: "Blow the Candles!",
    subtitle: "Make a wish... ✨",
    buttonText: "Make a Wish ✨",
    caption: "(Click to blow the candles)"
  },

  // 🎵 AUDIO
  music: {
    bgMusicUrl: "assets/audio/happy_birthday.mp3",
    synthMelodyEnabled: true,
    defaultVolume: 0.6,
    songTitle: "Birthday Song Playing..."
  },

  // 🧩 4-QUESTION MEMORY QUIZ (Matches exact mock flow)
  quiz: [
    {
      id: 1,
      step: "Question 1 of 4",
      stepRatio: "1/4",
      progress: 25,
      question: "Who is the don of our group?",
      options: [
        "Sakshi",
        "Saurabh",
        "Harshu",
        "Rajshri"
      ],
      correctAnswerIndex: 0,
      hint: "Think about who rules the group with full boss energy! 🕶️👑",
      video: {
        title: "You Unlocked a Memory! 📸✨",
        caption: "A classic friendship memory just for you, Manu! 😂🎉",
        duration: "0:05",
        url: "",
        fallbackImage: "assets/images/image1.png"
      }
    },
    {
      id: 2,
      step: "Question 2 of 4",
      stepRatio: "2/4",
      progress: 50,
      question: "Who is the biggest army fan of our group?",
      options: [
        "Sakshi",
        "Saurabh",
        "Harshu",
        "Rajshri"
      ],
      correctAnswerIndex: 2,
      hint: "Salute! Someone who is crazy passionate about the armed forces & uniforms! 🪖🇮🇳",
      video: {
        title: "You Unlocked a Memory! 📸✨",
        caption: "Another golden memory with you, Manu! 😂🌟",
        duration: "0:05",
        url: "",
        fallbackImage: "assets/images/image2.png"
      }
    },
    {
      id: 3,
      step: "Question 3 of 4",
      stepRatio: "3/4",
      progress: 75,
      question: "Who is Masao in the group?",
      options: [
        "Aryan",
        "Sakshi",
        "Saurabh",
        "Suraj"
      ],
      correctAnswerIndex: 2,
      hint: "Think about our sweetest onigiri / emotional cutie character from Shinchan! 🍙😅",
      video: {
        title: "You Unlocked a Memory! 📸✨",
        caption: "One of the best moments with our squad and you, Manu! 🥳✨",
        duration: "0:05",
        url: "",
        fallbackImage: "assets/images/image3.png"
      }
    },
    {
      id: 4,
      step: "Question 4 of 4",
      stepRatio: "4/4",
      progress: 100,
      question: "Who is Nobita's best friend?",
      options: [
        "Saurabh",
        "Suraj",
        "Harshu",
        "Aryan"
      ],
      correctAnswerIndex: 3,
      hint: "Think about who always teams up like Nobita's ultimate partner in crime! 👓✨",
      video: {
        isFinal: true,
        title: "Final Memory Surprise! 👑📸",
        overlayText: "Best friends forever, Manu! 🌟🤜🤛",
        caption: "Celebrating an awesome friendship with you, Mansi! 🔥✨",
        duration: "0:05",
        url: "",
        fallbackImage: "assets/images/image4.png"
      }
    }
  ],

  // 📸 MEMORIES FOR POLAROID COLLAGE
  polaroids: [
    {
      image: "assets/images/image1.png",
      caption: "Unforgettable Moments ✨",
      rotation: "-4deg"
    },
    {
      image: "assets/images/image2.png",
      caption: "Full Masti with Manu 😄",
      rotation: "5deg"
    },
    {
      image: "assets/images/image3.png",
      caption: "Squad Stories 🎉",
      rotation: "-2deg"
    },
    {
      image: "assets/images/image4.png",
      caption: "Golden Memories 🌟",
      rotation: "6deg"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BIRTHDAY_CONFIG;
}
