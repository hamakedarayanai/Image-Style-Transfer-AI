import React, { useState, useCallback } from 'react';
import { ConversionType, CartoonStyle, RealisticStyle } from './types';
import { convertImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ConversionControls from './components/ConversionControls';
import ImageDisplay from './components/ImageDisplay';
import Spinner from './components/Spinner';
import StyleSelector from './components/StyleSelector';
import AppLogo from './components/AppLogo';

/**
 * Processes a raw error string from the AI service into a user-friendly message.
 * @param rawError The raw error message string.
 * @returns A formatted, user-friendly error message with suggestions.
 */
const processErrorMessage = (rawError: string): string => {
  console.error("Raw AI Error:", rawError); // For debugging purposes
  const lowerCaseError = rawError.toLowerCase();

  if (lowerCaseError.includes('safety') || lowerCaseError.includes('blocked')) {
    return "Request blocked due to safety policies. This can happen with images of people (especially children) or other restricted content. Please try a different image or style.";
  }
  if (lowerCaseError.includes('api key not valid')) {
    return "There's an issue with the application's API configuration. Please contact support.";
  }
  if (lowerCaseError.includes('quota')) {
    return "The application has exceeded its usage limit. Please try again later.";
  }
  if (lowerCaseError.includes('network error') || lowerCaseError.includes('fetch')) {
    return "A network error occurred. Please check your internet connection and try again.";
  }
  if (lowerCaseError.includes('resource has been exhausted')) {
    return "The AI model is currently overloaded with requests. Please try again in a moment.";
  }
  
  // Generic fallback for other errors
  return "An unexpected error occurred during generation. The AI may be temporarily unavailable. Please try again.";
};


const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImagePreview, setOriginalImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [conversionType, setConversionType] = useState<ConversionType>(ConversionType.REALISTIC_TO_CARTOON);
  const [cartoonStyle, setCartoonStyle] = useState<CartoonStyle>(CartoonStyle.ANIME);
  const [realisticStyle, setRealisticStyle] = useState<RealisticStyle>(RealisticStyle.PHOTOREALISTIC);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modelTextResponse, setModelTextResponse] = useState<string | null>(null);

  const CARTOON_STYLE_OPTIONS = {
    [CartoonStyle.ANIME]: { name: 'Anime / Manga', emoji: '🎌' },
    [CartoonStyle.PIXAR]: { name: '3D Pixar', emoji: '🧸' },
    [CartoonStyle.COMIC_BOOK]: { name: 'Comic Book', emoji: '💥' },
    [CartoonStyle.CLASSIC_DISNEY]: { name: 'Classic Disney', emoji: '🏰' },
  };

  const REALISTIC_STYLE_OPTIONS = {
    [RealisticStyle.PHOTOREALISTIC]: { name: 'Photorealistic', emoji: '📷' },
    [RealisticStyle.DIGITAL_PAINTING]: { name: 'Digital Painting', emoji: '🖼️' },
    [RealisticStyle.CINEMATIC]: { name: 'Cinematic', emoji: '🎬' },
  };

  const handleImageUpload = useCallback((file: File) => {
    setOriginalImage(file);
    setGeneratedImage(null);
    setError(null);
    setModelTextResponse(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleClear = useCallback(() => {
    setOriginalImage(null);
    setOriginalImagePreview(null);
    setGeneratedImage(null);
    setError(null);
    setModelTextResponse(null);
  }, []);

  const handleConversionChange = (type: ConversionType) => {
    setConversionType(type);
    setGeneratedImage(null);
    setError(null);
    setModelTextResponse(null);
  }

  const handleGenerate = async () => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setModelTextResponse(null);

    try {
      const selectedStyle = conversionType === ConversionType.REALISTIC_TO_CARTOON ? cartoonStyle : realisticStyle;
      const { imageUrl, text } = await convertImage(originalImage, conversionType, selectedStyle);
      
      setModelTextResponse(text);

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError(
          "The AI did not return an image. This can happen due to safety filters or if the request is unclear. " +
          (text ? `The AI's response: "${text}"` : 'Try using a different image or a different style.')
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(processErrorMessage(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };
  
  const Header: React.FC = () => (
    <header className="text-center p-4 md:p-6">
      <AppLogo />
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        Image Style Transfer AI
      </h1>
      <p className="text-slate-400 mt-2 text-lg">
        Let AI reimagine your photos with stunning artistic styles.
      </p>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4">
      <style>{`
        @keyframes slideUpFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up-fade-in {
          animation: slideUpFadeIn 0.3s ease-out forwards;
        }
      `}</style>
      <div className="w-full max-w-7xl mx-auto">
        <Header />
        
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column: Input & Controls */}
          <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg flex flex-col gap-6">
            {!originalImagePreview ? (
              <div className="flex flex-col gap-4 text-center">
                <h2 className="text-xl font-bold text-slate-300">1. Upload an Image</h2>
                <p className="text-slate-400 -mt-2">Start by selecting a photo from your device.</p>
                <ImageUploader onImageUpload={handleImageUpload} />
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center text-slate-300">1. Your Image</h2>
                  <div className="relative aspect-square w-full bg-slate-800 rounded-lg overflow-hidden ring-1 ring-slate-700">
                    <img src={originalImagePreview} alt="Original upload" className="object-contain w-full h-full" />
                  </div>
                  <button
                    onClick={handleClear}
                    className="w-full bg-slate-700 text-slate-300 font-bold py-2.5 px-4 rounded-lg hover:bg-slate-600 transition-all duration-300 flex items-center justify-center text-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" />
                    </svg>
                    Use a Different Image
                  </button>
                </div>
                
                <hr className="border-slate-700/60"/>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-center text-slate-300">2. Configure Style</h2>
                  <ConversionControls
                    conversionType={conversionType}
                    onConversionChange={handleConversionChange}
                    isDisabled={isLoading}
                  />
                  {conversionType === ConversionType.REALISTIC_TO_CARTOON && (
                    <StyleSelector
                      title="Choose Cartoon Style"
                      styles={CARTOON_STYLE_OPTIONS}
                      selectedStyle={cartoonStyle}
                      onStyleChange={(style) => setCartoonStyle(style as CartoonStyle)}
                      isDisabled={isLoading}
                    />
                  )}
                  {conversionType === ConversionType.CARTOON_TO_REALISTIC && (
                    <StyleSelector
                      title="Choose Realistic Style"
                      styles={REALISTIC_STYLE_OPTIONS}
                      selectedStyle={realisticStyle}
                      onStyleChange={(style) => setRealisticStyle(style as RealisticStyle)}
                      isDisabled={isLoading}
                    />
                  )}
                </div>

                <hr className="border-slate-700/60"/>

                <div className="space-y-4">
                   <h2 className="text-xl font-bold text-center text-slate-300">3. Generate!</h2>
                   <button
                    onClick={handleGenerate}
                    disabled={!originalImage || isLoading}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-indigo-500/30 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Generating...
                      </>
                    ) : '✨ Generate Image'}
                  </button>
                </div>
              </>
            )}

            {error && (
              <div className="animate-slide-up-fade-in mt-2 text-left bg-red-900/50 text-red-300 p-4 rounded-lg border border-red-700 space-y-2">
                <div className="flex items-center font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Generation Failed</span>
                </div>
                <p className="text-sm text-red-200 pl-7">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="lg:sticky lg:top-8">
            <ImageDisplay title="Generated Image" imageUrl={generatedImage} isLoading={isLoading} modelTextResponse={modelTextResponse} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
