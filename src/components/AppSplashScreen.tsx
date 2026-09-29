import React, { useEffect, useState } from 'react';
import { OFISWordmark } from './OFISWordmark';

interface AppSplashScreenProps {
  onComplete?: () => void;
  minDuration?: number;
}

export const AppSplashScreen: React.FC<AppSplashScreenProps> = ({
  onComplete,
  minDuration = 1800,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Opening secure workspace network...');

  useEffect(() => {
    // Smooth progress simulation
    const pInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(pInterval);
          return 95;
        }
        const delta = Math.floor(Math.random() * 20) + 10;
        return Math.min(prev + delta, 95);
      });
    }, 280);

    const msgTimer1 = setTimeout(() => {
      setStatusMessage('Locating verified workspaces across Nigeria...');
    }, 600);

    const msgTimer2 = setTimeout(() => {
      setStatusMessage('Calibrating instant access & booking engines...');
    }, 1100);

    const completeTimer = setTimeout(() => {
      setProgress(100);
      setStatusMessage('Welcome to OFIS');
      setIsFadingOut(true);
      setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, 500); // 500ms fade transition
    }, minDuration);

    return () => {
      clearInterval(pInterval);
      clearTimeout(msgTimer1);
      clearTimeout(msgTimer2);
      clearTimeout(completeTimer);
    };
  }, [minDuration, onComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#07383D] text-[#FFFFFF] transition-all duration-500 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 pointer-events-none scale-105 filter blur-xs' : 'opacity-100'
      }`}
    >
      {/* Background Architectural Ambient Radial Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,720px)] h-[min(90vw,720px)] bg-gradient-to-tr from-[#006B70]/35 via-[#14BEB8]/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Logo Scaled to Fill Viewport Appropriately */}
      <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-4xl text-center">
        <img 
          src="/ofis-logo-dark.svg" 
          alt="OFIS — Nigeria's Physical Space Network" 
          className="w-[min(88vw,760px)] max-h-[42vh] object-contain drop-shadow-[0_0_24px_rgba(20,190,184,0.25)]"
        />

        {/* Subtle, Minimal Loading Indicator */}
        <div className="w-8 h-8 border-[2.5px] border-[#14BEB8]/30 border-t-[#14BEB8] rounded-full animate-spin mt-9 shadow-[0_0_12px_rgba(20,190,184,0.3)]" />

        {/* Progress status */}
        <div className="w-full max-w-xs mt-6 space-y-2">
          <div className="h-1 w-full bg-[#166D74] rounded-full overflow-hidden border border-[#14BEB8]/30">
            <div 
              className="h-full bg-gradient-to-r from-[#006B70] via-[#14BEB8] to-[#FFA987] rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(20,190,184,0.5)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#B8D1D0] px-1">
            <span className="truncate pr-2">{statusMessage}</span>
            <span className="font-bold text-[#28D2CB]">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
