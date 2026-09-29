import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Zap,
  MapPin,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReflectivePillarIcon, PillarType } from '../ReflectivePillarIcon';

const ROTATING_PLACEHOLDERS = [
  "Find a quiet coworking desk in Victoria Island with 24/7 power...",
  "Meeting room in Lekki Phase 1 for 8 people with 4K display tomorrow...",
  "Soundproof podcast studio in Ikeja GRA with Shure microphones...",
  "Photography studio in Yaba with cyclorama wall and studio lighting...",
  "Private office suite in Abuja Maitama for a 6-person tech team..."
];

interface PillarItem {
  id: PillarType;
  title: string;
  subtitle: string;
  prompt: string;
  category: string;
}

const HERO_PILLARS: PillarItem[] = [
  {
    id: 'work',
    title: 'WORK',
    subtitle: 'Desks & Private Offices',
    prompt: 'Find verified coworking hot desks and private team offices in Lagos with 24/7 power and high-speed fiber.',
    category: 'coworking',
  },
  {
    id: 'meet',
    title: 'MEET',
    subtitle: 'Meeting & Boardrooms',
    prompt: 'Find high-speed meeting rooms and executive boardrooms with 4K conference displays in Victoria Island or Lekki.',
    category: 'meeting-room',
  },
  {
    id: 'create',
    title: 'CREATE',
    subtitle: 'Photo & Video Sets',
    prompt: 'Find photography studios and video production suites equipped with professional lighting and backdrops.',
    category: 'photography',
  },
  {
    id: 'record',
    title: 'RECORD',
    subtitle: 'Podcast & Audio Booths',
    prompt: 'Find soundproof podcast booths and broadcast recording suites in Lagos or Abuja with acoustic treatment.',
    category: 'studio',
  },
];

export const OfisHeroAiSection: React.FC = () => {
  const { openAiModalWithQuery, setCurrentView, setActiveCategory } = useApp();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [selectedPillar, setSelectedPillar] = useState<PillarType | null>(null);

  // Rotate placeholders smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % ROTATING_PLACEHOLDERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleAskOfis = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const finalPrompt = query.trim() || ROTATING_PLACEHOLDERS[placeholderIndex];
    openAiModalWithQuery(finalPrompt);
  };

  const handleSelectPillar = (pillar: PillarItem) => {
    setSelectedPillar(pillar.id);
    setActiveCategory(pillar.category as any);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E2ECEB] dark:border-[#166D74] bg-[#FFF9F4] dark:bg-[#07383D] overflow-hidden transition-colors duration-150">
      {/* Radiant Multi-Color Ambient Backdrops with Warm Peach Highlight */}
      <div className="absolute -top-24 -left-20 w-[420px] sm:w-[580px] h-[420px] sm:h-[580px] pointer-events-none -z-0 opacity-70">
        <div className="w-full h-full bg-gradient-to-br from-[#006B70]/30 via-[#14BEB8]/25 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="absolute -top-16 -right-10 w-[440px] sm:w-[600px] h-[440px] sm:h-[600px] pointer-events-none -z-0 opacity-85">
        <div className="w-full h-full bg-gradient-to-bl from-[#FFA987]/45 via-[#FF8A65]/30 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[220px] pointer-events-none -z-0 opacity-60">
        <div className="w-full h-full bg-gradient-to-t from-[#FFA987]/25 via-[#14BEB8]/20 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Value Proposition Header */}
        <div className="space-y-3.5 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#FFA987]/25 via-[#FF8A65]/20 to-[#14BEB8]/20 dark:from-[#FFA987]/35 dark:via-[#FF8A65]/25 dark:to-[#14BEB8]/30 backdrop-blur-md border border-[#FFA987]/60 dark:border-[#FFA987]/70 text-[#C85A32] dark:text-[#FFA987] text-xs font-bold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#FFA987]" />
            <span>Nigeria’s Physical Space Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-extrabold tracking-tight text-[#12383B] dark:text-[#FFFFFF] leading-[1.12]">
            Find the right space.{' '}
            <span className="bg-gradient-to-r from-[#006B70] via-[#FFA987] to-[#14BEB8] dark:from-[#28D2CB] dark:via-[#FFA987] dark:to-[#FF8A65] bg-clip-text text-transparent">
              Book it when you need it.
            </span>
          </h1>

          <p className="text-sm sm:text-base font-medium text-[#5D7A7D] dark:text-[#B8D1D0] max-w-xl mx-auto leading-relaxed">
            Verified desks, meeting rooms, podcast suites, and production sets across Nigeria with guaranteed 24/7 power and enterprise fiber.
          </p>
        </div>

        {/* Conversational Search Input with Dual-Tone Glow */}
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleAskOfis}
            className="relative bg-white/95 dark:bg-[#0B4A50]/95 backdrop-blur-2xl p-2 rounded-2xl sm:rounded-3xl border border-[#FFA987]/50 dark:border-[#FFA987]/40 hover:border-[#FFA987] focus-within:border-[#FFA987] shadow-[0_12px_36px_rgba(255,169,135,0.12)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.5)] focus-within:ring-4 focus-within:ring-[#FFA987]/25 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 flex items-center pl-3 sm:pl-4">
                <Search className="w-5 h-5 text-[#FFA987] dark:text-[#FFA987] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm text-[#12383B] dark:text-[#FFFFFF] placeholder:text-[#5D7A7D] dark:placeholder:text-[#B8D1D0]/70 bg-transparent outline-hidden font-medium"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#006B70] via-[#14BEB8] to-[#FFA987] hover:opacity-95 text-white font-bold text-xs sm:text-sm shadow-[0_4px_18px_rgba(255,169,135,0.4)] active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#FFA987]" />
                <span>ASK OFIS</span>
              </button>
            </div>
          </form>

          {/* Guarantee Badges - Bright and High Contrast with Warm Peach Highlight */}
          <div className="mt-3.5 flex items-center justify-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#5D7A7D] dark:text-[#B8D1D0] font-semibold">
            <span className="flex items-center space-x-1.5 text-[#C85A32] dark:text-[#FFA987] font-bold">
              <Zap className="w-3.5 h-3.5 text-[#FFA987] fill-[#FFA987]/30" />
              <span>24/7 Power Guaranteed</span>
            </span>
            <span className="text-[#FFA987]/50">•</span>
            <span className="flex items-center space-x-1.5 text-[#12383B] dark:text-[#FFFFFF]">
              <MapPin className="w-3.5 h-3.5 text-[#14BEB8] dark:text-[#28D2CB]" />
              <span>Physically Verified</span>
            </span>
            <span className="text-[#FFA987]/50">•</span>
            <span className="flex items-center space-x-1.5 text-[#12383B] dark:text-[#FFFFFF]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#28D2CB]" />
              <span>Instant Turnstile Pass</span>
            </span>
          </div>
        </div>

        {/* 4 CORE PILLARS WITH REFLECTIVE ICONS (WORK • MEET • CREATE • RECORD) */}
        <div className="pt-3 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {HERO_PILLARS.map((pillar) => {
              const isActive = selectedPillar === pillar.id;

              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => handleSelectPillar(pillar)}
                  className={`group relative p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0B4A50] hover:bg-white dark:hover:bg-[#105A60] border transition-all duration-300 text-center flex flex-col items-center justify-between cursor-pointer ${
                    isActive
                      ? 'border-[#14BEB8] ring-2 ring-[#14BEB8]/30 shadow-[0_8px_24px_rgba(20,190,184,0.25)] scale-[1.03]'
                      : 'border-[#E2ECEB] dark:border-[#166D74] hover:border-[#14BEB8]/70 shadow-xs hover:shadow-lg hover:-translate-y-0.5'
                  }`}
                >
                  {/* Reflective Lustre Icon with Mirror Drop */}
                  <div className="mb-2">
                    <ReflectivePillarIcon
                      pillar={pillar.id}
                      size="md"
                      isActive={isActive}
                      showMirrorReflect={true}
                    />
                  </div>

                  {/* Pillar Label & Subtitle */}
                  <div className="mt-1">
                    <span className="block text-xs sm:text-sm font-extrabold tracking-wider text-[#12383B] dark:text-[#FFFFFF] group-hover:text-[#006B70] dark:group-hover:text-[#28D2CB] transition-colors">
                      {pillar.title}
                    </span>
                    <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0] font-medium line-clamp-1 mt-0.5">
                      {pillar.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Direct Explorer Jump Link */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => {
              setCurrentView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#006B70] dark:hover:text-[#FFA987] transition-colors cursor-pointer group"
          >
            <span>Browse all workspaces with interactive map</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FFA987] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
