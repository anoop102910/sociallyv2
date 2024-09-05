const images = {
  familyImage:
    'https://res.cloudinary.com/dt0h1catc/image/upload/v1725535784/socially/user/posts/dtorhgwi4tkuet7vhnwc.webp',
  birthdayImage:
    'https://res.cloudinary.com/dt0h1catc/image/upload/v1725535772/socially/user/posts/rihvulcbvmkxaihfuarn.webp',
  collegeImage:
    'https://res.cloudinary.com/dt0h1catc/image/upload/v1725535760/socially/user/posts/rh8e78opccgh6hzg5dmg.webp',
};

export default images;
const parts = [
  { text: 'input: ' },
  {
    fileData: {
      mimeType: 'image/jpeg',
      fileUri: images.familyImage,
    },
  },
  {
    text: 'output: "occasion": "Birthday",\n  "descriptions": [\n    "Celebrating a special day with a delicious birthday cake! 🎂",\n    "Another year older and celebrating with cake and candles! 🎉"\n  ]\n}',
  },
  { text: 'input: ' },
  {
    fileData: {
      mimeType: 'image/jpeg',
      fileUri: images.birthdayImage,
    },
  },
  {
    text: 'output: {\n  "occasion": "College Photo Shoot",\n  "descriptions": [\n    "A fantastic group photo with our amazing college friends! 📸🎓",\n    "Capturing memories with a fun and lively college photo shoot! 😊✨",\n    "Cherishing the moment with all our classmates in this awesome group picture! 🎉📷",\n    "Celebrating our college journey with a memorable photo shoot! 🎓❤️"\n  ]\n}',
  },
  { text: 'input: ' },
  {
    fileData: {
      mimeType: 'image/jpeg',
      fileUri: images.collegeImage,
    },
  },
  {
    text: 'output: {\n  "occasion": "Family Selfie",\n  "descriptions": [\n    "A sweet selfie with my dad! ❤️",\n    "Making memories with the best dad in the world! 😄",\n    "Smiling for the camera with my beloved father. 🥰"\n  ]\n}',
  },
  { text: 'input: ' },
  { text: 'output: ' },
];
