import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Building2, 
  Video, 
  Briefcase, 
  Calendar, 
  GraduationCap, 
  HelpCircle, 
  PlusCircle, 
  Zap,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ROTATING_PLACEHOLDERS = [
  "I need a creative studio in Lekki for 6 people under ₦80,000...",
  "Find a meeting room in Victoria Island for 10 people tomorrow...",
  "I need an office in Ikeja tomorrow morning...",
  "Find a quiet desk in VI with Starlink & backup generator...",
  "How does OFIS verify spaces and guarantee 24/7 power?",
  "Show me private offices under ₦300,000 per month..."
];

interface IntentCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  prompt: string;
  badge?: string;
  accentColor?: string;
}

const QUICK_INTENTS: IntentCard[] = [
  {
    id: 'find-space',
    title: 'FIND A SPACE',
    subtitle: 'Tell us what you need',
    icon: Search,
    prompt: 'I need a physical workspace in Lagos. What options are available?',
    accentColor: 'text-[#10B981]'
  },
  {
    id: 'meeting-room',
    title: 'MEETING ROOM',
    subtitle: 'Find somewhere for your next meeting',
    icon: Building2,
    prompt: 'Find a meeting room or boardroom in Victoria Island or Lekki for 8 to 12 people.',
    badge: 'Popular'
  },
  {
    id: 'creative-studio',
    title: 'CREATIVE STUDIO',
    subtitle: 'Find a space to create',
    icon: Video,
    prompt: 'I need a creative photo or podcast studio in Lekki with lighting equipment.',
    badge: 'Creator'
  },
  {
    id: 'private-office',
    title: 'PRIVATE OFFICE',
    subtitle: 'Find your next workspace',
    icon: Briefcase,
    prompt: 'Find a dedicated private office in Lagos with backup power and fiber internet.',
  },
  {
    id: 'event-space',
    title: 'EVENT SPACE',
    subtitle: 'Find somewhere for your event',
    icon: Calendar,
    prompt: 'Find an event hall or conference venue in Lagos for 50+ guests.',
  },
  {
    id: 'training-room',
    title: 'TRAINING ROOM',
    subtitle: 'Find a room for your team',
    icon: GraduationCap,
    prompt: 'Find a training room in Lagos with a projector, whiteboard, and high-speed internet.',
  },
  {
    id: 'about-ofis',
    title: 'ABOUT OFIS',
    subtitle: 'Ask us anything about OFIS',
    icon: HelpCircle,
    prompt: 'What is OFIS and how does it guarantee 24/7 power and verified fiber internet?',
  },
  {
    id: 'list-space',
    title: 'LIST YOUR SPACE',
    subtitle: 'Earn from your physical space',
    icon: PlusCircle,
    prompt: 'How do I list my space on OFIS and what are the host earnings & requirements?',
    badge: 'Hosts'
  }
];

export const OfisHeroAiSection: React.FC = () => {
  const { openAiModalWithQuery, setCurrentView } = useApp();
  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // Rotate placeholders every 4.5 seconds
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

  const handleSelectTemplate = (template: IntentCard) => {
    openAiModalWithQuery(template.prompt);
  };

  return (
    <section className="relative pt-12 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] dark:border-[#1E293B]/70 bg-[#F8FAFC] dark:bg-[#0B1220] overflow-hidden transition-colors duration-150">
      {/* Refined Emerald Ambient Glow Accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] md:w-[700px] md:h-[700px] pointer-events-none -z-0 opacity-40">
        <div className="w-full h-full bg-gradient-to-br from-[#10B981]/15 via-[#34D399]/10 to-transparent rounded-full blur-3xl" />
      </div>
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-[#10B981]/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7 sm:space-y-9">
        
        {/* Branding & Value Proposition */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 dark:bg-[#10B981]/15 backdrop-blur-md border border-[#10B981]/30 text-[#10B981] dark:text-[#34D399] text-xs font-semibold tracking-wider uppercase shadow-[0_0_18px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nigeria’s Physical Space Network</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#111827] dark:text-[#FAF8F5]">
            Find the right space. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-[#059669]">Book it when you need it.</span>
          </h1>

          <p className="text-lg sm:text-xl font-semibold text-[#1F2937] dark:text-[#E2E8F0]">
            “Tell OFIS what you need.”
          </p>

          <p className="text-sm sm:text-base font-medium text-[#374151] dark:text-[#94A3B8]">
            Verified desks, private offices, and studios across Nigeria with 24/7 power and high-speed fiber.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* DOMINANT INTERACTION: LARGE CONVERSATIONAL AI SEARCH INPUT (GLASSMORPHISM) */}
        {/* ========================================================================= */}
        <div className="max-w-3xl mx-auto">
          <form 
            onSubmit={handleAskOfis}
            className="relative bg-white/80 dark:bg-[#161F32]/75 backdrop-blur-2xl p-2 sm:p-2.5 rounded-3xl border border-[#E2E8F0] dark:border-white/[0.09] hover:border-[#10B981]/50 focus-within:border-[#10B981] shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.6),0_0_25px_rgba(16,185,129,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1),0_0_25px_rgba(16,185,129,0.1)] focus-within:shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15),0_0_35px_rgba(16,185,129,0.22)] transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1 flex items-center pl-3 sm:pl-4">
                <Search className="w-5 h-5 text-[#10B981] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={ROTATING_PLACEHOLDERS[placeholderIndex]}
                  className="w-full px-3 py-3 text-sm sm:text-base text-[#111827] dark:text-[#FAF8F5] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] bg-transparent outline-hidden font-normal"
                />
              </div>

              <button
                type="submit"
                className="relative overflow-hidden w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669] hover:from-[#10B981] hover:to-[#047857] text-[#0C0B0A] font-extrabold text-sm sm:text-base shadow-[0_4px_20px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.5),0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_6px_28px_rgba(16,185,129,0.5),inset_0_1px_2px_rgba(255,255,255,0.7),0_0_30px_rgba(16,185,129,0.35)] border border-white/20 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 shrink-0 cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/20 pointer-events-none" />
                <Sparkles className="w-4 h-4 text-[#0C0B0A]" />
                <span>ASK OFIS</span>
              </button>
            </div>
          </form>

          {/* Guarantee Badges in Frosted Glass Capsule */}
          <div className="mt-4 inline-flex items-center justify-center gap-3 sm:gap-5 px-4 sm:px-6 py-2 rounded-full bg-white/60 dark:bg-[#161F32]/50 backdrop-blur-xl border border-[#E2E8F0]/80 dark:border-white/[0.06] shadow-sm text-[11px] sm:text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span className="flex items-center space-x-1.5 text-[#111827] dark:text-[#E2E8F0]">
              <Zap className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Guaranteed 24/7 Power</span>
            </span>
            <span className="text-[#CBD5E1] dark:text-[#334155]">•</span>
            <span className="flex items-center space-x-1.5 text-[#111827] dark:text-[#E2E8F0]">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Verified On-Site</span>
            </span>
            <span className="text-[#CBD5E1] dark:text-[#334155]">•</span>
            <span className="text-[#111827] dark:text-[#E2E8F0]">Deterministic Naira Pricing</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. QUICK INTENT TEMPLATES (GLASSMORPHIC CARDS)                            */}
        {/* ========================================================================= */}
        <div className="pt-2 space-y-3 text-left">
          <div className="flex items-center justify-between px-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
              Quick Intent Starters
            </p>
            <span className="text-[11px] text-[#10B981] dark:text-[#34D399] font-medium hidden sm:inline">
              Click to open AI Concierge with context
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {QUICK_INTENTS.map((intent) => {
              const Icon = intent.icon;

              return (
                <button
                  key={intent.id}
                  type="button"
                  onClick={() => handleSelectTemplate(intent)}
                  className="group relative p-3 sm:p-3.5 rounded-2xl bg-white/70 dark:bg-[#161F32]/60 hover:bg-white dark:hover:bg-[#1E293B]/80 backdrop-blur-xl border border-[#E2E8F0]/80 dark:border-white/[0.07] hover:border-[#10B981]/50 text-left transition-all duration-200 shadow-[0_4px_16px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.05)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08),0_0_20px_rgba(16,185,129,0.12)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1),0_0_22px_rgba(16,185,129,0.16)] hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between overflow-hidden"
                >
                  {/* Subtle hover specular highlight */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative z-10 flex items-start justify-between w-full mb-2">
                    <div className="w-8 h-8 rounded-xl bg-[#F1F5F9]/80 dark:bg-[#0B1220]/80 group-hover:bg-[#10B981]/15 text-[#64748B] group-hover:text-[#10B981] dark:group-hover:text-[#34D399] transition-colors flex items-center justify-center border border-transparent group-hover:border-[#10B981]/30">
                      <Icon className="w-4 h-4" />
                    </div>
                    {intent.badge && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] dark:text-[#34D399] border border-[#10B981]/30 backdrop-blur-md">
                        {intent.badge}
                      </span>
                    )}
                  </div>

                  <div className="relative z-10">
                    <span className="block text-xs font-bold text-[#111827] dark:text-[#FAF8F5] group-hover:text-[#10B981] dark:group-hover:text-[#34D399] transition-colors">
                      {intent.title}
                    </span>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] line-clamp-1 mt-0.5">
                      {intent.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Traditional Explorer Alternative Link */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={() => {
              const target = document.getElementById('spaces-results-section');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
              } else {
                setCurrentView('explore');
              }
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#64748B] dark:text-[#94A3B8] hover:text-[#10B981] dark:hover:text-[#34D399] transition-colors cursor-pointer"
          >
            <span>Or browse verified directory with filters & map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
