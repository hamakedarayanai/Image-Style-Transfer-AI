import React from 'react';

const AppLogo: React.FC = () => (
  <div className="mx-auto mb-2 w-16 h-16" aria-label="App Logo">
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5eead4" />
        </linearGradient>
      </defs>
      {/* Background shape for a subtle glow/fill effect */}
      <path d="M50,95 C25.147,95 5,74.853 5,50 C5,25.147 25.147,5 50,5 L95,5 L95,95 L50,95 Z" fill="url(#logoGradient)" fillOpacity="0.2" />
      {/* Main transforming line */}
      <path
        d="M50,90 C27.909,90 10,72.091 10,50 C10,27.909 27.909,10 50,10 L90,10 L90,90 L50,90 Z"
        stroke="url(#logoGradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default AppLogo;
