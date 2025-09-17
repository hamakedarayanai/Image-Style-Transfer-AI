import React, { useState, useCallback } from 'react';
import { ConversionType, CartoonStyle, RealisticStyle } from './types';
import { convertImage } from './services/geminiService';
import ImageUploader from './components/ImageUploader';
import ConversionControls from './components/ConversionControls';
import ImageDisplay from './components/ImageDisplay';
import Spinner from './components/Spinner';
import StyleSelector from './components/StyleSelector';

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
      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        setError("The AI did not return an image. It might have refused the request.");
      }
      setModelTextResponse(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const Header: React.FC = () => (
    <header className="text-center p-4 md:p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
        Image Style Transfer AI
      </h1>
      <p className="text-slate-400 mt-2 text-lg">
        Transform your images between <span className="font-semibold text-slate-300">realistic photos</span> and <span className="font-semibold text-slate-300">stylized cartoons</span>.
      </p>
    </header>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <Header />
        
        <main className="mt-8 flex flex-col items-center gap-8">
          <div className="w-full max-w-lg bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg">
            <ImageUploader onImageUpload={handleImageUpload} />
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
            <button
              onClick={handleGenerate}
              disabled={!originalImage || isLoading}
              className="w-full mt-6 bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center text-lg shadow-indigo-500/30 shadow-md"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  Generating...
                </>
              ) : 'Generate'}
            </button>
            {error && (
              <div className="mt-4 text-center bg-red-900/50 text-red-300 p-3 rounded-lg border border-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <ImageDisplay title="Original Image" imageUrl={originalImagePreview} />
            <ImageDisplay title="Generated Image" imageUrl={generatedImage} isLoading={isLoading} modelTextResponse={modelTextResponse} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;