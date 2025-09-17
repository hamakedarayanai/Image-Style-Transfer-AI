import { GoogleGenAI, Modality, GenerateContentResponse } from "@google/genai";
import { ConversionType, CartoonStyle, RealisticStyle } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: File): Promise<{ inlineData: { mimeType: string, data: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error("Failed to read file as base64 string."));
      }
      const base64String = reader.result.split(',')[1];
      resolve({
        inlineData: {
          mimeType: file.type,
          data: base64String,
        },
      });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const getPromptForConversion = (type: ConversionType, style: CartoonStyle | RealisticStyle): string => {
  const basePrompt = "Analyze the provided image and convert it. Maintain the core subject and composition, but reimagine it";

  switch (type) {
    case ConversionType.REALISTIC_TO_CARTOON:
      switch (style as CartoonStyle) {
        case CartoonStyle.ANIME:
          return `${basePrompt} in a vibrant, stylized Japanese anime/manga style, with characteristic features like large expressive eyes, bold lines, and dynamic shading.`;
        case CartoonStyle.PIXAR:
          return `${basePrompt} in the style of a 3D animated film, similar to those by Pixar. Focus on soft lighting, detailed textures, and characters with appealing, rounded features.`;
        case CartoonStyle.COMIC_BOOK:
          return `${basePrompt} into a classic American comic book style. Use halftone dots for shading, bold inks for outlines, and a dynamic, action-oriented composition.`;
        case CartoonStyle.CLASSIC_DISNEY:
            return `${basePrompt} into the style of a classic 2D Disney animation. Emphasize fluid lines, expressive faces, and a warm, storybook color palette.`;
        default:
          return `${basePrompt} into a vibrant, stylized cartoon.`;
      }
    case ConversionType.CARTOON_TO_REALISTIC:
       switch (style as RealisticStyle) {
        case RealisticStyle.PHOTOREALISTIC:
          return `${basePrompt} into a photorealistic style. Render the subjects with lifelike textures, accurate lighting and shadows, and fine details to make it look like a real-life photograph.`;
        case RealisticStyle.DIGITAL_PAINTING:
          return `${basePrompt} as a detailed digital painting. It should look realistic but with visible brushstrokes and an artistic, painterly quality.`;
        case RealisticStyle.CINEMATIC:
          return `${basePrompt} into a cinematic, photorealistic style. Give it dramatic lighting, a shallow depth of field, and a color grade that evokes a specific movie genre or mood.`;
        default:
          return `${basePrompt} into a photorealistic style.`;
      }
    default:
      return "Change the style of this image.";
  }
}

export const convertImage = async (imageFile: File, conversionType: ConversionType, style: CartoonStyle | RealisticStyle): Promise<{ imageUrl: string | null, text: string | null }> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const textPart = {
      text: getPromptForConversion(conversionType, style),
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
          parts: [imagePart, textPart],
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    let imageUrl: string | null = null;
    let text: string | null = null;

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
                text = part.text;
            }
        }
    }
    
    return { imageUrl, text };
  } catch (error) {
    console.error("Error converting image:", error);
    // Re-throw the original error so the UI layer can process it for more specific feedback.
    throw error;
  }
};