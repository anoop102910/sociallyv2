import { Injectable } from '@nestjs/common';
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import { Part } from '@google/generative-ai';
import images from './data';
import axios from 'axios';

@Injectable()
export class GeminiService {
  private apiKey = process.env.GEMINI_API_KEY;
  private genAI = new GoogleGenerativeAI(this.apiKey);
  private fileManager = new GoogleAIFileManager(this.apiKey);
  private model = this.genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
  private generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: 'text/plain',
  };

  async uploadToGemini(path: string, mimeType: string) {
    try {
      const uploadResult = await this.fileManager.uploadFile(
        '/home/anoop4735/Projects/Completed/socially/api/src/api-modules/genai/test.png',
        {
          mimeType: 'application/octet-stream',
          displayName: path,
        },
      );
      const file = uploadResult.file;
      console.log(file);
      console.log(file.uri);
      console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
      return file;
    } catch (error) {
      throw error;
      console.error(error);
    }
  }

  async createContent(fileUri: string) {
    const base64 = await this.getImageBase64(fileUri);

    const parts = [
      { text: 'input: ' },
      {
        fileData: {
          mimeType: 'image/webp',
          fileUri: await this.getImageBase64(images.birthdayImage),
        },
      },
      {
        text: 'output: "occasion": "Birthday",\n  "descriptions": [\n    "Celebrating a special day with a delicious birthday cake! 🎂",\n    "Another year older and celebrating with cake and candles! 🎉"\n  ]\n}',
      },
      { text: 'input: ' },
      {
        fileData: {
          mimeType: 'image/webp',
          fileUri: await this.getImageBase64(images.collegeImage),
        },
      },
      {
        text: 'output: {\n  "occasion": "College Photo Shoot",\n  "descriptions": [\n    "A fantastic group photo with our amazing college friends! 📸🎓",\n    "Capturing memories with a fun and lively college photo shoot! 😊✨",\n    "Cherishing the moment with all our classmates in this awesome group picture! 🎉📷",\n    "Celebrating our college journey with a memorable photo shoot! 🎓❤️"\n  ]\n}',
      },
      { text: 'input: ' },
      {
        fileData: {
          mimeType: 'image/webp',
          fileUri: await this.getImageBase64(images.familyImage),
        },
      },
      {
        text: 'output: {\n  "occasion": "Family Selfie",\n  "descriptions": [\n    "A sweet selfie with my dad! ❤️",\n    "Making memories with the best dad in the world! 😄",\n    "Smiling for the camera with my beloved father. 🥰"\n  ]\n}',
      },
      { text: 'input: ' },
      {
        fileData: {
          mimeType: 'image/webp',
          fileUri: base64,
        },
      },
      { text: 'output: ' },
    ];

    const result = await this.model.generateContent({
      contents: [{ role: 'user', parts: parts as Part[] }],
      generationConfig: this.generationConfig,
    });
    console.log(result.response.text());
    return result.response.text();
  }

  async getImageBase64(imageUrl: string) {
    const response = await axios({
      method: 'get',
      url: imageUrl,
      responseType: 'arraybuffer',
    });
    const photoBase64 = Buffer.from(response.data, 'binary').toString('base64');
    return photoBase64;
  }
}
