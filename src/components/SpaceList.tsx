import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  RotateCcw, 
  MapPin, 
  Zap, 
  Wifi, 
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight, 
  Compass, 
  Laptop, 
  Presentation, 
  Camera, 
  Mic, 
  ChevronRight,
  Search,
  CheckCircle2,
  ExternalLink,
  Building2,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Space, SpaceCategory } from '../types';
import { OfisAiProvider, ChatMessage } from '../services/ofisAiProvider';
import { StructuredSearchIntent } from '../services/ofisIntentParser';
import { getSpacePricing, formatPriceNGN } from '../utils/pricing';

// =========================================================================
// 1. INDIGENOUS NIGERIAN GREETINGS ENGINE (RETAINED)
// =========================================================================
const PIDGIN_GREETINGS = [
  'Twale my great boss🙌🏼',
  'Special hailings my Oga',
  'I throway Salute Boss',
  'I dey with you 100% Boss'
];

interface GreetingLocale {
  code: 'en' | 'yo' | 'ig' | 'ha' | 'pcm';
  langName: string;
  getGreeting: (hour: number, randomPidgin?: string) => string;
  formatName: (rawFirstName: string) => string;
}

const GREETING_LOCALES: GreetingLocale[] = [
  {
    code: 'en',
    langName: 'English',
    getGreeting: (hour) => {
      if (hour >= 4 && hour < 12) return 'Good Morning';
      if (hour >= 12 && hour < 17) return 'Good Afternoon';
      return 'Good Evening';
    },
    formatName: (name) => name || 'Tunde',
  },
  {
    code: 'yo',
    langName: 'Yorùbá',
    getGreeting: (hour) => {
      if (hour >= 4 && hour < 12) return 'Ẹ kú àárọ̀';
      if (hour >= 12 && hour < 17) return 'Ẹ kú ọ̀sán';
      return 'Ẹ kú ìrọ̀lẹ́';
    },
    formatName: (name) => {
      if (/tunde/i.test(name)) return 'Túndé';
      if (/babatunde/i.test(name)) return 'Bábátúndé';
      if (/adeyemi/i.test(name)) return 'Adéyẹmí';
      if (/funke/i.test(name)) return 'Fúnkẹ́';
      if (/babajide/i.test(name)) return 'Bàbájídé';
      if (/guest|explorer/i.test(name)) return 'Olùwòye';
      return name || 'Túndé';
    }
  },
  {
    code: 'ig',
    langName: 'Igbo',
    getGreeting: (hour) => {
      if (hour >= 4 && hour < 12) return 'Ụtụtụ ọma';
      if (hour >= 12 && hour < 17) return 'Ehihie ọma';
      return 'Mgbede ọma';
    },
    formatName: (name) => {
      if (/chidi/i.test(name)) return 'Chìdí';
      if (/emeka/i.test(name)) return 'Èméká';
      if (/guest|explorer/i.test(name)) return 'Onye nchọpụta';
      return name || 'Tunde';
    }
  },
  {
    code: 'ha',
    langName: 'Hausa',
    getGreeting: (hour) => {
      if (hour >= 4 && hour < 12) return 'Ina kwana';
      if (hour >= 12 && hour < 17) return 'Barka da rana';
      return 'Barka da yamma';
    },
    formatName: (name) => {
      if (/amina/i.test(name)) return 'Amīna';
      if (/guest|explorer/i.test(name)) return 'Mai bincike';
      return name || 'Tunde';
    }
  },
  {
    code: 'pcm',
    langName: 'Pidgin',
    getGreeting: (_hour, randomPidgin) => {
      return randomPidgin || 'Twale my great boss🙌🏼';
    },
    formatName: (name) => name || 'Tunde',
  }
];

// =========================================================================
// 2. CORE PILLARS & ATTRIBUTES DEFINITIONS (IN EXACT RIGHT ORDER)
// =========================================================================
type PillarId = 'all' | 'work' | 'meet' | 'create' | 'record';

interface PillarConfig {
  id: PillarId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  promptSuggestion: string;
  attributes: string[];
}

const PILLARS_IN_ORDER: PillarConfig[] = [
  {
    id: 'work',
    label: 'WORK',
    icon: Laptop,
    promptSuggestion: 'Find a quiet coworking desk or private office in Victoria Island with 24/7 power',
    attributes: ['Hot Desks', 'Dedicated Desks', 'Private Team Offices']
  },
  {
    id: 'meet',
    label: 'MEET',
    icon: Presentation,
    promptSuggestion: 'Find a meeting room or boardroom in Lekki for 8 people with a 4K display',
    attributes: ['Meeting Rooms', 'Executive Boardrooms', 'Training & Conference Suites']
  },
  {
    id: 'create',
    label: 'CREATE',
    icon: Camera,
    promptSuggestion: 'Find a photography studio in Yaba with lighting equipment and cyclorama wall',
    attributes: ['Photography Studios', 'Video Production Sets', 'Creator Suites']
  },
  {
    id: 'record',
    label: 'RECORD',
    icon: Mic,
    promptSuggestion: 'Find a soundproof podcast recording studio in Ikeja GRA with Shure mics',
    attributes: ['Soundproof Podcast Booths', 'Audio Recording Suites', 'Voiceover Rooms']
  }
];

// Core Platform Attributes in right order of priority
const CORE_ATTRIBUTES = [
  { id: 'power', icon: Zap, label: '24/7 Guaranteed Power', detail: 'Dual Generators + Solar & Inverter Backup' },
  { id: 'fiber', icon: Wifi, label: 'High-Speed Fiber Internet', detail: 'Starlink & Dedicated Fiber, 0% Downtime' },
  { id: 'verified', icon: ShieldCheck, label: '100% Physically Verified', detail: 'Noise, Security & Ergonomics Audited' },
  { id: 'instant', icon: Clock, label: 'Instant Flexible Booking', detail: 'Hourly, Daily & Monthly Passes' },
  { id: 'locations', icon: MapPin, label: 'Prime Hubs', detail: 'Lagos (VI, Lekki, Ikeja), Abuja & Port Harcourt' },
];

// Suggested Gemini prompt starters
const GEMINI_PROMPTS = [
  {
    title: 'Hot desk in Victoria Island',
    subtitle: '24/7 power & high-speed fiber wifi',
    prompt: 'I need a quiet coworking desk in Victoria Island with guaranteed 24/7 power and fiber internet.',
    pillar: 'work' as PillarId,
  },
  {
    title: 'Meeting room in Lekki Phase 1',
    subtitle: '8-10 people with 4K display & whiteboard',
    prompt: 'Find a meeting room for 8 to 10 people in Lekki Phase 1 with a presentation screen for tomorrow.',
    pillar: 'meet' as PillarId,
  },
  {
    title: 'Podcast studio in Ikeja GRA',
    subtitle: 'Soundproof acoustic booth with mics',
    prompt: 'I need an acoustically treated soundproof podcast recording studio in Ikeja GRA for 3 people.',
    pillar: 'record' as PillarId,
  },
  {
    title: 'Creative photo suite in Yaba',
    subtitle: 'Continuous lighting & backdrops',
    prompt: 'Find a photography or creative video studio in Yaba with continuous lighting gear.',
    pillar: 'create' as PillarId,
  },
  {
    title: 'Private team office in Abuja',
    subtitle: '4 people in Maitama with backup gen',
    prompt: 'Find a furnished private office for a team of 4 in Maitama Abuja under ₦250,000.',
    pillar: 'work' as PillarId,
  },
  {
    title: 'How does OFIS guarantee power?',
    subtitle: 'Learn about verification & solar backup',
    prompt: 'How does OFIS verify physical spaces and guarantee 24/7 uninterrupted power in Nigeria?',
    pillar: 'all' as PillarId,
  }
];

export const SpaceList: React.FC = () => {
  const {
    currentUser,
    allSpaces,
    setSelectedSpaceId,
    setCurrentView,
    openQuickBook,
    openInfoModal,
    aiInitialQuery,
    setAiInitialQuery,
  } = useApp();

  // Greeting cycling state
  const [localeIndex, setLocaleIndex] = useState(0);
  const [cycleStep, setCycleStep] = useState(0);
  const [pidginGreeting, setPidginGreeting] = useState(PIDGIN_GREETINGS[0]);

  // Pillar selection state
  const [selectedPillar, setSelectedPillar] = useState<PillarId>('all');

  // Gemini Chat state
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeIntent, setActiveIntent] = useState<StructuredSearchIntent | undefined>(undefined);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Cycle greetings every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setLocaleIndex((prev) => (prev + 1) % GREETING_LOCALES.length);
      setCycleStep((prev) => prev + 1);
      setPidginGreeting(PIDGIN_GREETINGS[Math.floor(Math.random() * PIDGIN_GREETINGS.length)]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute greeting text
  const currentHour = new Date().getHours();
  const currentLocale = GREETING_LOCALES[localeIndex];
  const rawFirstName = currentUser?.name?.split(' ')[0] || (currentUser?.role === 'host' ? 'Chief' : 'Tunde');
  const localizedName = currentLocale.formatName(rawFirstName);
  const greetingPrefix = currentLocale.getGreeting(currentHour, pidginGreeting);
  const greetingText = `${greetingPrefix}, ${localizedName}`;

  // Handle external or pre-filled queries (e.g. from navbar or routing)
  useEffect(() => {
    if (aiInitialQuery && aiInitialQuery.trim()) {
      const q = aiInitialQuery.trim();
      setAiInitialQuery('');
      handleSendMessage(q);
    }
  }, [aiInitialQuery]);

  // Scroll smoothly to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Send message through the OFIS reasoning engine
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await OfisAiProvider.processMessage(
        textToSend,
        allSpaces,
        messages,
        activeIntent
      );

      if (response.intent) {
        setActiveIntent(response.intent);
      }

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ofis',
          text: "I experienced a brief connection hiccup while searching the network. Please browse our directory or try asking again.",
          suggestedFollowUps: ['Show all spaces in Lagos', 'Find a meeting room', 'What is OFIS?'],
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([]);
    setActiveIntent(undefined);
    setInputQuery('');
    setSelectedPillar('all');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handlePillarClick = (pillar: PillarConfig) => {
    if (selectedPillar === pillar.id) {
      setSelectedPillar('all');
    } else {
      setSelectedPillar(pillar.id);
      setInputQuery(pillar.promptSuggestion);
      inputRef.current?.focus();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] flex flex-col transition-colors duration-150 relative">
      
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[340px] h-[340px] sm:w-[540px] sm:h-[540px] bg-[#10B981]/5 dark:bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32 flex flex-col justify-start relative z-10">

        {/* ========================================================================= */}
        {/* HEADER: GREETING, SUBTITLE, PILLARS & CORE ATTRIBUTES                     */}
        {/* ========================================================================= */}
        <div className={`text-center transition-all duration-300 ${hasMessages ? 'py-4 border-b border-[#E5E7EB] dark:border-[#1E293B] mb-6' : 'py-6 sm:py-10 space-y-6'}`}>
          
          {/* 1. Dynamic Indigenous Nigerian Greeting */}
          <div className="flex items-center justify-center min-h-[38px] sm:min-h-[46px]">
            <AnimatePresence mode="wait">
              <motion.h1
                key={`${currentLocale.code}-${localizedName}-${cycleStep}`}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`${hasMessages ? 'text-xl sm:text-2xl font-bold' : 'text-3xl sm:text-4xl md:text-5xl font-extrabold'} tracking-tight text-[#111827] dark:text-[#F8FAFC]`}
              >
                {greetingText}
              </motion.h1>
            </AnimatePresence>
          </div>

          {/* Subtitle */}
          {!hasMessages && (
            <p className="text-base sm:text-lg font-medium text-[#6B7280] dark:text-[#94A3B8] max-w-lg mx-auto">
              What workspace do you need today?
            </p>
          )}

          {/* 2. Core Pillars in Exact Right Order: WORK • MEET • CREATE • RECORD */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {PILLARS_IN_ORDER.map((pillar) => {
              const Icon = pillar.icon;
              const isSelected = selectedPillar === pillar.id;

              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => handlePillarClick(pillar)}
                  className={`inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#10B981] text-white shadow-sm'
                      : 'bg-white dark:bg-[#161F32] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#1E293B] text-[#4B5563] dark:text-[#94A3B8] hover:text-[#10B981] dark:hover:text-[#10B981]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{pillar.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Core Attributes in Exact Right Order */}
          {!hasMessages && (
            <div className="pt-2">
              {/* Selected Pillar Specific Attributes if active */}
              {selectedPillar !== 'all' ? (
                <div className="inline-flex items-center flex-wrap justify-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#161F32] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-medium text-[#4B5563] dark:text-[#94A3B8] shadow-2xs">
                  <span className="font-bold text-[#10B981] uppercase tracking-wider text-[11px]">
                    {selectedPillar.toUpperCase()} SPACES:
                  </span>
                  {PILLARS_IN_ORDER.find(p => p.id === selectedPillar)?.attributes.map((attr, idx, arr) => (
                    <React.Fragment key={attr}>
                      <span className="text-[#111827] dark:text-[#F8FAFC]">{attr}</span>
                      {idx < arr.length - 1 && <span className="text-[#94A3B8] dark:text-[#64748B]">•</span>}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                /* Platform Core Attributes: Power, Fiber, Verified, Instant, Hubs */
                <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#6B7280] dark:text-[#94A3B8] font-medium">
                  {CORE_ATTRIBUTES.map((attr, idx) => {
                    const AttrIcon = attr.icon;
                    return (
                      <div key={attr.id} className="inline-flex items-center space-x-1.5" title={attr.detail}>
                        <AttrIcon className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{attr.label}</span>
                        {idx < CORE_ATTRIBUTES.length - 1 && (
                          <span className="text-[#CBD5E1] dark:text-[#334155] pl-2 hidden sm:inline">•</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Reset Chat Header Button (Only visible during active conversation) */}
          {hasMessages && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8]">
                Conversational Search
              </span>
              <button
                type="button"
                onClick={handleResetChat}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#10B981] hover:bg-[#E5E7EB]/50 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                title="Start a fresh conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Chat</span>
              </button>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* CONVERSATION STREAM (MESSAGES & WORKSPACE CARDS)                          */}
        {/* ========================================================================= */}
        {hasMessages && (
          <div className="space-y-6 mb-8 flex-1">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-3`}
                >
                  {/* Message Bubble */}
                  <div
                    className={`max-w-[92%] sm:max-w-[85%] rounded-3xl px-4 sm:px-5 py-3.5 text-sm sm:text-base leading-relaxed ${
                      isUser
                        ? 'bg-[#10B981] text-white font-medium rounded-br-xs shadow-xs'
                        : 'bg-white dark:bg-[#161F32] border border-[#E5E7EB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] rounded-bl-xs shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Knowledge base link button if present */}
                    {msg.knowledgeLink && (
                      <div className="mt-3 pt-3 border-t border-[#E5E7EB] dark:border-[#1E293B]">
                        <button
                          type="button"
                          onClick={() => {
                            if (msg.knowledgeLink?.tab) {
                              openInfoModal(msg.knowledgeLink.tab as any);
                            } else {
                              setCurrentView(msg.knowledgeLink?.view as any || 'explore');
                            }
                          }}
                          className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
                        >
                          <span>{msg.knowledgeLink.label}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Matching Workspaces Grid (If message returned spaces) */}
                  {!isUser && msg.matchingSpaces && msg.matchingSpaces.length > 0 && (
                    <div className="w-full space-y-3 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider px-1">
                        <span>Verified Real Inventory ({msg.matchingSpaces.length} {msg.matchingSpaces.length === 1 ? 'Space' : 'Spaces'})</span>
                        <button
                          type="button"
                          onClick={() => setCurrentView('explore')}
                          className="text-[#10B981] hover:underline cursor-pointer lowercase first-letter:uppercase"
                        >
                          view in catalog →
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {msg.matchingSpaces.slice(0, 4).map((space) => {
                          const pricing = getSpacePricing(space);

                          return (
                            <div
                              key={space.id}
                              className="rounded-2xl bg-white dark:bg-[#161F32] border border-[#E5E7EB] dark:border-[#1E293B] overflow-hidden shadow-xs hover:border-[#10B981]/50 transition-all flex flex-col justify-between group"
                            >
                              {/* Photo Header */}
                              <div className="relative h-40 w-full overflow-hidden bg-[#E2E8F0] dark:bg-[#1E293B]">
                                <img
                                  src={space.images?.[0] || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80'}
                                  alt={space.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                                  <Zap className="w-3 h-3 text-amber-400" />
                                  <span>{space.powerType || '24/7 Power'}</span>
                                </div>
                                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                                  ★ {space.rating?.toFixed(1) || '4.9'}
                                </div>
                              </div>

                              {/* Content Details */}
                              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                                <div className="space-y-1">
                                  <h3 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC] line-clamp-1">
                                    {space.title}
                                  </h3>
                                  <p className="text-xs text-[#374151] dark:text-[#94A3B8] flex items-center space-x-1">
                                    <MapPin className="w-3.5 h-3.5 text-[#047857] dark:text-[#10B981] shrink-0" />
                                    <span className="line-clamp-1">{space.neighborhood || space.city}, {space.city}</span>
                                  </p>
                                </div>

                                {/* Key Specs: Capacity & Fiber Internet */}
                                <div className="flex items-center space-x-3 text-xs text-[#6B7280] dark:text-[#94A3B8] pt-1">
                                  <span className="flex items-center space-x-1">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{space.capacity} {space.capacity === 1 ? 'desk' : 'seats'}</span>
                                  </span>
                                  {space.internetSpeedMbps && (
                                    <span className="flex items-center space-x-1">
                                      <Wifi className="w-3.5 h-3.5 text-[#10B981]" />
                                      <span>{space.internetSpeedMbps}Mbps</span>
                                    </span>
                                  )}
                                </div>

                                {/* Pricing & Actions */}
                                <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-2">
                                  <div>
                                    <span className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                                      {formatPriceNGN(pricing.rate)}
                                    </span>
                                    <span className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">
                                      /{pricing.period}
                                    </span>
                                  </div>

                                  <div className="flex items-center space-x-1.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedSpaceId(space.id);
                                        setCurrentView('details');
                                      }}
                                      className="px-2.5 py-1.5 rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-semibold text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                                    >
                                      Details
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => openQuickBook(space)}
                                      className="px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer"
                                    >
                                      Book Space
                                    </button>
                                  </div>
                                </div>

                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Suggested Follow-Ups Pills */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 pl-1">
                      {msg.suggestedFollowUps.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleSendMessage(suggestion)}
                          className="px-3 py-1 rounded-full bg-white dark:bg-[#161F32] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#1E293B] text-xs text-[#4B5563] dark:text-[#94A3B8] hover:text-[#10B981] dark:hover:text-[#10B981] transition-all cursor-pointer shadow-2xs"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}

                </div>
              );
            })}

            {/* Thinking / Searching State */}
            {loading && (
              <div className="flex items-center space-x-2 text-xs font-semibold text-[#10B981] pl-2 py-2">
                <Sparkles className="w-4 h-4 animate-spin text-[#10B981]" />
                <span>Searching verified spaces & calculating real rates...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        )}

        {/* ========================================================================= */}
        {/* GEMINI CHAT INPUT BOX (CENTERED ON INITIAL VIEW)                          */}
        {/* ========================================================================= */}
        {!hasMessages && (
          <div className="w-full space-y-6">
            
            {/* The Gemini Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="relative bg-white dark:bg-[#161F32] rounded-3xl border-2 border-[#E2E8F0] dark:border-[#1E293B] focus-within:border-[#10B981] shadow-xl focus-within:shadow-2xl transition-all duration-200 p-2 sm:p-3"
            >
              <div className="flex flex-col gap-2">
                <textarea
                  ref={inputRef}
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  rows={2}
                  placeholder="Ask anything about workspaces in Nigeria, or describe what you need..."
                  className="w-full px-3 py-2 text-sm sm:text-base text-[#111827] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] bg-transparent outline-hidden resize-none"
                />

                <div className="flex items-center justify-between pt-1 px-2">
                  <span className="text-[11px] text-[#94A3B8] dark:text-[#64748B] hidden sm:inline">
                    Press <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] dark:bg-[#1E293B] font-mono text-[10px]">Enter ↵</kbd> to search
                  </span>

                  <button
                    type="submit"
                    disabled={!inputQuery.trim() || loading}
                    className={`ml-auto px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center space-x-2 transition-all cursor-pointer ${
                      inputQuery.trim() && !loading
                        ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-md active:scale-95'
                        : 'bg-[#E2E8F0] dark:bg-[#1E293B] text-[#94A3B8] dark:text-[#64748B] cursor-not-allowed opacity-70'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Ask OFIS</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Starter Prompt Cards (Like Gemini Chat) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GEMINI_PROMPTS.map((starter) => (
                <button
                  key={starter.title}
                  type="button"
                  onClick={() => handleSendMessage(starter.prompt)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#161F32] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#1E293B] hover:border-[#10B981]/50 text-left transition-all cursor-pointer shadow-2xs group flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                      {starter.title}
                    </p>
                    <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">
                      {starter.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center justify-end text-[#94A3B8] group-hover:text-[#10B981] text-xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>

            {/* Subtle Catalog & Map Exploration Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('explore')}
                className="text-xs font-semibold text-[#6B7280] dark:text-[#94A3B8] hover:text-[#10B981] dark:hover:text-[#10B981] transition-colors inline-flex items-center space-x-1 cursor-pointer"
              >
                <span>Or browse our full directory of 40+ physical workspaces</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* STICKY BOTTOM INPUT BAR (DURING ACTIVE GEMINI CHAT)                       */}
      {/* ========================================================================= */}
      {hasMessages && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0B1220]/95 backdrop-blur-xl border-t border-[#E5E7EB] dark:border-[#1E293B] py-3 px-4 sm:px-6 shadow-xl">
          <div className="max-w-4xl mx-auto flex items-center space-x-2">
            
            {/* New Chat Reset Button */}
            <button
              type="button"
              onClick={handleResetChat}
              className="p-3 rounded-2xl bg-[#F1F5F9] dark:bg-[#161F32] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8] hover:text-[#10B981] transition-colors cursor-pointer shrink-0"
              title="Reset and start new chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex-1 flex items-center bg-[#F8FAFC] dark:bg-[#161F32] border border-[#E2E8F0] dark:border-[#1E293B] focus-within:border-[#10B981] rounded-2xl px-3 py-1.5 shadow-2xs"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask follow-up or refine (e.g., 'under ₦15,000' or 'in Lekki Phase 1')..."
                className="w-full text-xs sm:text-sm text-[#111827] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] dark:placeholder:text-[#64748B] bg-transparent outline-hidden py-1.5"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || loading}
                className={`p-2 rounded-xl text-white transition-all cursor-pointer shrink-0 ${
                  inputQuery.trim() && !loading
                    ? 'bg-[#10B981] hover:bg-[#059669] shadow-xs active:scale-95'
                    : 'bg-[#E2E8F0] dark:bg-[#1E293B] text-[#94A3B8] dark:text-[#64748B] cursor-not-allowed opacity-60'
                }`}
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
