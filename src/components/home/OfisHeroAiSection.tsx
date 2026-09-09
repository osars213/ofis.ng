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
    <section className="relative pt-10 sm:pt-14 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 border-b border-[#D9E1E3] dark:border-[#1E3A4D] bg-[#F5F7F7] dark:bg-[#071521] overflow-hidden transition-colors duration-150">
      {/* Subtle Teal Ambient Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[520px] sm:h-[520px] md:w-[680px] md:h-[680px] pointer-events-none -z-0 opacity-25">
        <div className="w-full h-full bg-gradient-to-br from-[#0F766E]/20 via-[#14B8A6]/10 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
        
        {/* Value Proposition Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#0F766E]/10 dark:bg-[#14B8A6]/15 backdrop-blur-md border border-[#0F766E]/25 dark:border-[#14B8A6]/30 text-[#0F766E] dark:text-[#14B8A6] text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nigeria’s Physical Space Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
            Find the right space.{' '}
            <span className="text-[#0F766E] dark:text-[#14B8A6]">Book it when you need it.</span>
          </h1>

          <p className="text-sm sm:text-base font-normal text-[#4B5563] dark:text-[#94A3B8] max-w-xl mx-auto">
            Verified desks, meeting rooms, and production studios across Nigeria with guaranteed 24/7 power and enterprise fiber.
          </p>
        </div>

        {/* Conversational Search Input */}
        <div className="max-w-2xl mx-auto">
          <form 
            onSubmit={handleAskOfis}
            className="relative bg-white/95 dark:bg-[#0B1F33]/90 backdrop-blur-2xl p-2 rounded-2xl sm:rounded-3xl border border-[#D9E1E3] dark:border-[#1E3A4D] hover:border-[#0F766E]/60 focus-within:border-[#0F766E] shadow-[0_8px_30px_rgba(11,31,51,0.06)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] focus-within:ring-2 focus-within:ring-[#0F766E]/20 transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 flex items-center pl-3 sm:pl-4">
                <Search className="w-4.5 h-4.5 text-[#0F766E] dark:text-[#14B8A6] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                  className="w-full px-3 py-2.5 text-xs sm:text-sm text-[#111827] dark:text-[#F8FAFC] placeholder:text-[#64748B] dark:placeholder:text-[#94A3B8] bg-transparent outline-hidden font-normal"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-[#14B8A6] text-white font-bold text-xs sm:text-sm shadow-sm active:scale-[0.98] transition-all duration-150 flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>ASK OFIS</span>
              </button>
            </div>
          </form>

          {/* Guarantee Badges - Uncluttered and Compact */}
          <div className="mt-3 flex items-center justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">
            <span className="flex items-center space-x-1.5 text-[#172B3A] dark:text-[#CBD5E1]">
              <Zap className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
              <span>24/7 Power Guaranteed</span>
            </span>
            <span className="text-[#D9E1E3] dark:text-[#1E3A4D]">•</span>
            <span className="flex items-center space-x-1.5 text-[#172B3A] dark:text-[#CBD5E1]">
              <MapPin className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
              <span>Physically Verified</span>
            </span>
            <span className="text-[#D9E1E3] dark:text-[#1E3A4D]">•</span>
            <span className="flex items-center space-x-1.5 text-[#172B3A] dark:text-[#CBD5E1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
              <span>Instant Turnstile Pass</span>
            </span>
          </div>
        </div>

        {/* 4 CORE PILLARS WITH REFLECTIVE ICONS (WORK • MEET • CREATE • RECORD) */}
        <div className="pt-2 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {HERO_PILLARS.map((pillar) => {
              const isActive = selectedPillar === pillar.id;

              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => handleSelectPillar(pillar)}
                  className={`group relative p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#0B1F33] hover:bg-white dark:hover:bg-[#102A3D] border transition-all duration-300 text-center flex flex-col items-center justify-between cursor-pointer ${
                    isActive
                      ? 'border-[#0F766E] ring-2 ring-[#0F766E]/20 shadow-md scale-[1.02]'
                      : 'border-[#D9E1E3] dark:border-[#1E3A4D] hover:border-[#0F766E]/50 shadow-xs hover:shadow-md hover:-translate-y-0.5'
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
                    <span className="block text-xs sm:text-sm font-extrabold tracking-wider text-[#172B3A] dark:text-[#F8FAFC] group-hover:text-[#0F766E] dark:group-hover:text-[#14B8A6] transition-colors">
                      {pillar.title}
                    </span>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium line-clamp-1 mt-0.5">
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
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F766E] dark:hover:text-[#14B8A6] transition-colors cursor-pointer"
          >
            <span>Browse all workspaces with interactive map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
