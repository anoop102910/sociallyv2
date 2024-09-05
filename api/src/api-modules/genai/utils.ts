import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { Part } from '@google/generative-ai';
import images from './data';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function uploadToGemini(path: string, mimeType: string) {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

export async function geminiGenContent(imageUrl: string) {
  const parts = [
    { text: 'input: ' },
    {
      fileData: {
        mimeType: 'image/jpeg',
        fileUri: images.birthdayImage,
      },
    },
    {
      text: 'output: "occasion": "Birthday",\n  "descriptions": [\n    "Celebrating a special day with a delicious birthday cake! 🎂",\n    "Another year older and celebrating with cake and candles! 🎉"\n  ]\n}',
    },
    { text: 'input: ' },
    {
      fileData: {
        mimeType: 'image/jpeg',
        fileUri: images.collegeImage,
      },
    },
    {
      text: 'output: {\n  "occasion": "College Photo Shoot",\n  "descriptions": [\n    "A fantastic group photo with our amazing college friends! 📸🎓",\n    "Capturing memories with a fun and lively college photo shoot! 😊✨",\n    "Cherishing the moment with all our classmates in this awesome group picture! 🎉📷",\n    "Celebrating our college journey with a memorable photo shoot! 🎓❤️"\n  ]\n}',
    },
    { text: 'input: ' },
    {
      fileData: {
        mimeType: 'image/jpeg',
        fileUri: images.familyImage,
      },
    },
    {
      text: 'output: {\n  "occasion": "Family Selfie",\n  "descriptions": [\n    "A sweet selfie with my dad! ❤️",\n    "Making memories with the best dad in the world! 😄",\n    "Smiling for the camera with my beloved father. 🥰"\n  ]\n}',
    },
    { text: 'input: ' },
    {
      fileData: {
        mimeType: 'image/jpeg',
        fileUri: imageUrl,
      },
    },
    { text: 'output: ' },
  ];

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: parts as Part[] }],
    generationConfig,
  });
  console.log(result.response.text());
  return result.response.text();
}
