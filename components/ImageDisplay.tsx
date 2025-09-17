import React, { useState } from 'react';
import Spinner from './Spinner';

interface ImageDisplayProps {
  title: string;
  imageUrl: string | null;
  isLoading?: boolean;
  modelTextResponse?: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ title, imageUrl, isLoading = false, modelTextResponse }) => {
  const [showPreview, setShowPreview] = useState(false);

  const isGeneratedImage = title === 'Generated Image';

  return (
    <>
      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 shadow-lg flex flex-col h-full">
        <h2 className="text-xl font-bold text-center mb-4 text-slate-300">{title}</h2>
        <div 
          className="relative aspect-square w-full bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden group"
          onMouseEnter={() => isGeneratedImage && imageUrl && setShowPreview(true)}
          onMouseLeave={() => isGeneratedImage && setShowPreview(false)}
        >
          {isLoading ? (
            <div className="flex flex-col items-center text-slate-400">
              <Spinner />
              <p className="mt-2">Generating your image...</p>
            </div>
          ) : imageUrl ? (
            <>
              <img src={imageUrl} alt={title} className="object-contain w-full h-full" />
              {isGeneratedImage && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                   </svg>
                   <span className="ml-2 text-white font-semibold">View Larger</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-slate-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="mt-2">{isGeneratedImage ? 'Your generated image will appear here' : 'Upload an image to see the preview'}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4 space-y-4 flex-grow flex flex-col justify-end">
          {modelTextResponse && (
            <div className="p-3 bg-slate-700/50 rounded-lg">
              <p className="text-sm text-slate-300 italic">{modelTextResponse}</p>
            </div>
          )}
          
          {isGeneratedImage && imageUrl && !isLoading && (
            <a
              href={imageUrl}
              download={`generated-image-${new Date().toISOString()}.png`}
              className="w-full bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-emerald-500 transition-all duration-300 flex items-center justify-center text-md shadow-emerald-500/30 shadow-md"
              aria-label="Download generated image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </a>
          )}
        </div>
      </div>
      
      {showPreview && imageUrl && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setShowPreview(false)}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            .animate-fade-in {
              animation: fadeIn 0.2s ease-out forwards;
            }
          `}</style>
          <img 
            src={imageUrl} 
            alt={`${title} Preview`} 
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </>
  );
};

export default ImageDisplay;
