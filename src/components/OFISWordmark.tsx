import React from 'react';
import { useSafeApp } from '../context/AppContext';

interface OFISWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  variant?: 'compact' | 'mark-only';
  theme?: 'dark' | 'light' | 'auto';
  isBreathing?: boolean;
  breathingSpeed?: 'slow' | 'medium' | 'fast';
}

export const OFISWordmark: React.FC<OFISWordmarkProps> = ({
  className = '',
  size = 'md',
  variant = 'compact',
  theme = 'auto',
  isBreathing = false,
  breathingSpeed = 'medium',
}) => {
  const safeApp = useSafeApp();
  const resolvedTheme = safeApp?.resolvedTheme || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'dark');
  const isAppPerformingAction = safeApp?.isAppPerformingAction || false;
  const currentTheme = theme === 'auto' ? resolvedTheme : theme;
  const isDark = currentTheme === 'dark';

  // Determine if breathing animation should be active (either explicitly requested or when global app action is ongoing)
  const shouldBreathe = isBreathing || isAppPerformingAction;

  const getBreathingClass = () => {
    if (!shouldBreathe) return '';
    switch (breathingSpeed) {
      case 'slow':
        return 'animate-[ofis-breathe-slow_3s_ease-in-out_infinite]';
      case 'fast':
        return 'animate-[ofis-breathe-fast_1.2s_ease-in-out_infinite]';
      case 'medium':
      default:
        return 'animate-[ofis-breathe_2s_ease-in-out_infinite]';
    }
  };

  // Height rules calibrated for prominent, bold, crisp brand visibility
  const getHeightClass = () => {
    switch (size) {
      case 'sm':
        return 'h-7.5 sm:h-8.5';
      case 'lg':
        return 'h-12.5 sm:h-15.5';
      case 'hero':
        return 'h-16 sm:h-22';
      case 'md':
      default:
        return 'h-10 sm:h-12';
    }
  };

  const getIconClass = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 sm:w-9 sm:h-9';
      case 'lg':
        return 'w-13 h-13 sm:w-16 sm:h-16';
      case 'hero':
        return 'w-18 h-18 sm:w-22 sm:h-22';
      case 'md':
      default:
        return 'w-10 h-10 sm:w-12 sm:h-12';
    }
  };

  // Harmonized Mode Filtering & Glow:
  // Enhances boldness, contrast, and clean vector definition across dark and light themes
  const filterStyleClass = isDark
    ? 'filter brightness-[1.06] contrast-[1.15] drop-shadow-[0_0_1.2px_rgba(255,255,255,0.85)] drop-shadow-[0_0_12px_rgba(20,190,184,0.35)]'
    : 'filter brightness-[0.93] contrast-[1.22] drop-shadow-[0_0_1.2px_rgba(7,56,61,0.9)] drop-shadow-[0_1.5px_3px_rgba(7,56,61,0.18)]';

  if (variant === 'mark-only') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        {shouldBreathe && (
          <div className="absolute inset-0 rounded-full bg-[#14BEB8]/20 blur-sm animate-ping opacity-30 pointer-events-none" />
        )}
        <img
          src="/ofis-icon.svg"
          alt="OFIS Emblem"
          className={`${getIconClass()} object-contain transition-all duration-300 hover:scale-105 ${filterStyleClass} ${getBreathingClass()}`}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  // Automatic Theme Switcher for Horizontal Logo:
  // Dark mode -> /ofis-logo-dark.svg (crisp white text + teal portal)
  // Light mode -> /ofis-logo.svg (dark architectural #07383D text + teal portal)
  const logoSrc = isDark ? '/ofis-logo-dark.svg' : '/ofis-logo.svg';

  return (
    <div className={`relative inline-flex items-center select-none ${className}`}>
      {shouldBreathe && (
        <div className="absolute -inset-1 bg-gradient-to-r from-[#006B70]/20 via-[#14BEB8]/25 to-[#FFA987]/20 blur-xs rounded-xl animate-pulse pointer-events-none" />
      )}
      <img
        src={logoSrc}
        alt="OFIS"
        className={`${getHeightClass()} w-auto max-w-[240px] sm:max-w-[320px] object-contain transition-all duration-300 hover:scale-[1.015] ${filterStyleClass} ${getBreathingClass()}`}
        loading="eager"
        decoding="async"
      />
    </div>
  );
};
