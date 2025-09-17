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
    <div className="mt-6">
      <h3 className="text-lg font-semibold text-center text-slate-300 mb-3">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(styles).map(([styleKey, { name, emoji }]) => (
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
                <span className="text-xl" role="img" aria-label={`${name} emoji`}>{emoji}</span>
                <p className="font-semibold text-sm mt-1">{name}</p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
