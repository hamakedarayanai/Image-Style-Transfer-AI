import React from 'react';

interface StyleSelectorProps {
  title: string;
  styles: { [key: string]: { name: string; emoji: string; } };
  selectedStyle: string;
  onStyleChange: (style: string) => void;
  isDisabled?: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ title, styles, selectedStyle, onStyleChange, isDisabled }) => {
  return (
    <div className="w-full">
      <h3 className="text-md font-semibold text-left text-slate-300 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {/* FIX: Destructuring the value from Object.entries directly in the map parameters was causing a TypeScript inference issue. Changed to a simple variable `styleDetails` and accessed properties from it to resolve the error. */}
        {Object.entries(styles).map(([styleKey, styleDetails]) => (
          <label
            key={styleKey}
            className={`relative flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 text-center
            ${selectedStyle === styleKey ? 'border-indigo-500 bg-indigo-900/50' : 'border-slate-600 bg-slate-800 hover:bg-slate-700'}
            ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <input
              type="radio"
              name="style-selector"
              value={styleKey}
              checked={selectedStyle === styleKey}
              onChange={() => onStyleChange(styleKey)}
              className="absolute opacity-0 w-full h-full cursor-pointer"
              disabled={isDisabled}
            />
            <div>
                <span className="text-xl" role="img" aria-label={`${styleDetails.name} emoji`}>{styleDetails.emoji}</span>
                <p className="font-semibold text-sm mt-1">{styleDetails.name}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
