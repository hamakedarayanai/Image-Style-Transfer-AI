
import React from 'react';
import { ConversionType } from '../types';

interface ConversionControlsProps {
  conversionType: ConversionType;
  onConversionChange: (type: ConversionType) => void;
  isDisabled?: boolean;
}

const ConversionControls: React.FC<ConversionControlsProps> = ({ conversionType, onConversionChange, isDisabled }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-center text-slate-300 mb-3">Choose Conversion Style</h3>
      <div className="grid grid-cols-2 gap-4">
        <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${conversionType === ConversionType.REALISTIC_TO_CARTOON ? 'border-indigo-500 bg-indigo-900/50' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            type="radio"
            name="conversionType"
            value={ConversionType.REALISTIC_TO_CARTOON}
            checked={conversionType === ConversionType.REALISTIC_TO_CARTOON}
            onChange={() => onConversionChange(ConversionType.REALISTIC_TO_CARTOON)}
            className="absolute opacity-0 w-full h-full cursor-pointer"
            disabled={isDisabled}
          />
          <div className="text-center">
            <span className="text-2xl">📸 → 🎨</span>
            <p className="font-semibold mt-1">Realistic to Cartoon</p>
          </div>
        </label>
        <label className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${conversionType === ConversionType.CARTOON_TO_REALISTIC ? 'border-indigo-500 bg-indigo-900/50' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            type="radio"
            name="conversionType"
            value={ConversionType.CARTOON_TO_REALISTIC}
            checked={conversionType === ConversionType.CARTOON_TO_REALISTIC}
            onChange={() => onConversionChange(ConversionType.CARTOON_TO_REALISTIC)}
            className="absolute opacity-0 w-full h-full cursor-pointer"
            disabled={isDisabled}
          />
          <div className="text-center">
            <span className="text-2xl">🎨 → 🏞️</span>
            <p className="font-semibold mt-1">Cartoon to Realistic</p>
          </div>
        </label>
      </div>
    </div>
  );
};

export default ConversionControls;
