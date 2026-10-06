import React from 'react';
import { Laptop, Presentation, Camera, Mic, LucideIcon } from 'lucide-react';

export type PillarType = 'work' | 'meet' | 'create' | 'record';

interface ReflectivePillarIconProps {
  pillar: PillarType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isActive?: boolean;
  className?: string;
  showMirrorReflect?: boolean;
}

const PILLAR_CONFIG: Record<
  PillarType,
  {
    label: string;
    icon: LucideIcon;
    badgeColor: string;
    glowColor: string;
    activeGradient: string;
    tintHex: string;
    textClass: string;
    description: string;
  }
> = {
  work: {
    label: 'WORK',
    icon: Laptop,
    badgeColor: 'from-[#FFA987]/40 via-[#FFD0BD]/25 to-transparent',
    glowColor: 'rgba(255, 169, 135, 0.85)',
    activeGradient: 'from-[#FFA987] via-[#FF8A65] to-[#E05626]',
    tintHex: '#FFA987',
    textClass: 'text-[#C85A32] dark:text-[#FFA987]',
    description: 'Desks & Private Offices',
  },
  meet: {
    label: 'MEET',
    icon: Presentation,
    badgeColor: 'from-[#FFA987]/40 via-[#FFD0BD]/25 to-transparent',
    glowColor: 'rgba(255, 169, 135, 0.85)',
    activeGradient: 'from-[#FFA987] via-[#FF8A65] to-[#E05626]',
    tintHex: '#FFA987',
    textClass: 'text-[#C85A32] dark:text-[#FFA987]',
    description: 'Boardrooms & Conference',
  },
  create: {
    label: 'CREATE',
    icon: Camera,
    badgeColor: 'from-[#FFA987]/40 via-[#FFD0BD]/25 to-transparent',
    glowColor: 'rgba(255, 169, 135, 0.85)',
    activeGradient: 'from-[#FFA987] via-[#FF8A65] to-[#E05626]',
    tintHex: '#FFA987',
    textClass: 'text-[#C85A32] dark:text-[#FFA987]',
    description: 'Photo & Video Sets',
  },
  record: {
    label: 'RECORD',
    icon: Mic,
    badgeColor: 'from-[#FFA987]/40 via-[#FFD0BD]/25 to-transparent',
    glowColor: 'rgba(255, 169, 135, 0.85)',
    activeGradient: 'from-[#FFA987] via-[#FF8A65] to-[#E05626]',
    tintHex: '#FFA987',
    textClass: 'text-[#C85A32] dark:text-[#FFA987]',
    description: 'Soundproof Podcast Suites',
  },
};

export const ReflectivePillarIcon: React.FC<ReflectivePillarIconProps> = ({
  pillar,
  size = 'md',
  isActive = false,
  className = '',
  showMirrorReflect = true,
}) => {
  const config = PILLAR_CONFIG[pillar];
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      container: 'w-8 h-8 rounded-xl',
      icon: 'w-4 h-4',
      mirrorH: 'h-2',
    },
    md: {
      container: 'w-11 h-11 rounded-2xl',
      icon: 'w-5 h-5',
      mirrorH: 'h-3',
    },
    lg: {
      container: 'w-14 h-14 rounded-2xl',
      icon: 'w-6 h-6',
      mirrorH: 'h-4',
    },
    xl: {
      container: 'w-16 h-16 rounded-3xl',
      icon: 'w-7 h-7',
      mirrorH: 'h-5',
    },
  }[size];

  return (
    <div className={`relative inline-flex flex-col items-center group select-none ${className}`}>
      {/* 1. Main Reflective Glass Badge */}
      <div
        className={`relative ${sizeClasses.container} flex items-center justify-center transition-all duration-300 overflow-hidden cursor-pointer ${
          isActive
            ? `bg-gradient-to-br from-[#FFA987] via-[#FF8A65] to-[#E05626] text-white shadow-[0_8px_24px_rgba(255,169,135,0.7),inset_0_1.5px_1px_rgba(255,255,255,0.5)] scale-105 ring-2 ring-white/50`
            : `bg-white dark:bg-[#0B4A50] text-[#FFA987] border border-[#FFA987]/50 dark:border-[#FFA987]/40 shadow-[0_4px_16px_rgba(255,169,135,0.15)] dark:shadow-[0_6px_20px_rgba(0,0,0,0.4)] hover:border-[#FFA987] hover:scale-105`
        }`}
      >
        {/* Optical Specular Glare (Top 45% Curved Bevel Highlight) */}
        <div
          className="absolute top-0 left-0 right-0 h-[48%] pointer-events-none rounded-t-2xl opacity-80"
          style={{
            background:
              'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.12) 65%, rgba(255, 255, 255, 0) 100%)',
          }}
        />

        {/* Dynamic Reflective Light Sweep on Hover */}
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/20 to-transparent rotate-45 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />

        {/* Secondary Inner Lustre Tint */}
        <div className={`absolute inset-0 bg-gradient-to-tr ${config.badgeColor} pointer-events-none`} />

        {/* Crisp Central Icon with Optical Depth - Signature Peach */}
        <div className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)] group-hover:scale-110 transition-transform duration-200">
          <Icon className={`${sizeClasses.icon} ${isActive ? 'text-white' : 'text-[#FFA987] group-hover:text-[#E05626] dark:group-hover:text-[#FFA987]'} transition-colors`} strokeWidth={2.25} />
        </div>
      </div>

      {/* 2. Mirrored Surface Floor Reflection (Luxury Glass Dock Effect) */}
      {showMirrorReflect && (
        <div
          className={`relative ${sizeClasses.mirrorH} w-3/4 mt-1 pointer-events-none overflow-hidden rounded-full opacity-35 dark:opacity-40 transition-opacity group-hover:opacity-60`}
          aria-hidden="true"
        >
          {/* Fading gradient reflection */}
          <div
            className="w-full h-full rounded-full blur-[1.5px]"
            style={{
              background: `linear-gradient(180deg, ${config.glowColor} 0%, transparent 100%)`,
            }}
          />
        </div>
      )}
    </div>
  );
};
