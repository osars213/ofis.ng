import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Zap, 
  Wifi, 
  ShieldCheck, 
  Star, 
  Users, 
  Clock, 
  Building2, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Calendar,
  Layers,
  Laptop,
  Presentation,
  Mic,
  Camera,
  GraduationCap,
  Shield,
  HeartHandshake,
  TrendingUp,
  CreditCard,
  QrCode,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { SpaceCategory, Space } from '../../types';
import { WorkspaceCard } from '../WorkspaceCard';
import { getSpacePricing } from '../../utils/pricing';
import { OfisHeroAiSection } from '../home/OfisHeroAiSection';

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
    formatName: (name) => name || 'Chief',
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
      return name || 'Chief';
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
      return name || 'Chief';
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
      return name || 'Chief';
    }
  },
  {
    code: 'pcm',
    langName: 'Pidgin',
    getGreeting: (_hour, randomPidgin) => randomPidgin || 'Twale my great boss🙌🏼',
    formatName: (name) => name || 'Chief',
  }
];

const NIGERIAN_CITIES = [
  {
    name: 'Lagos',
    state: 'Lagos State',
    neighborhoods: 'Victoria Island • Lekki • Ikeja • Yaba',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80',
    spacesCount: '120+ Spaces',
    tag: 'Fintech & Creative Capital'
  },
  {
    name: 'Abuja',
    state: 'Federal Capital Territory',
    neighborhoods: 'Maitama • CBD • Wuse II • Jabi',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    spacesCount: '45+ Spaces',
    tag: 'Executive & Diplomatic Hub'
  },
  {
    name: 'Port Harcourt',
    state: 'Rivers State',
    neighborhoods: 'Old GRA • Peter Odili • Trans-Amadi',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80',
    spacesCount: '25+ Spaces',
    tag: 'Energy & Corporate Corridor'
  },
  {
    name: 'Ibadan',
    state: 'Oyo State',
    neighborhoods: 'Bodija • Ring Road • Jericho • Samonda',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80',
    spacesCount: '18+ Spaces',
    tag: 'Emerging Tech & Talent Center'
  }
];

const CATEGORIES_DATA = [
  {
    id: 'coworking',
    title: 'Coworking Desks',
    tagline: 'Hot desks, ergonomic setups & focus quiet pods',
    icon: Laptop,
    badge: 'WORK',
    startRate: '₦1,500/hr',
    bgGradient: 'from-emerald-500/10 to-teal-500/5'
  },
  {
    id: 'meeting-room',
    title: 'Meeting Rooms & Boardrooms',
    tagline: '4K displays, video conferencing & executive seating',
    icon: Presentation,
    badge: 'MEET',
    startRate: '₦8,000/hr',
    bgGradient: 'from-blue-500/10 to-indigo-500/5'
  },
  {
    id: 'private-office',
    title: 'Private Executive Suites',
    tagline: 'Fully serviced enclosed offices for teams of 2-20',
    icon: Building2,
    badge: 'WORK',
    startRate: '₦15,000/day',
    bgGradient: 'from-violet-500/10 to-purple-500/5'
  },
  {
    id: 'studio',
    title: 'Podcast & Media Studios',
    tagline: 'Acoustic treatment, Shure mics & multi-cam setups',
    icon: Mic,
    badge: 'RECORD',
    startRate: '₦12,000/hr',
    bgGradient: 'from-amber-500/10 to-orange-500/5'
  },
  {
    id: 'photography',
    title: 'Photography & Production',
    tagline: 'Infinity cyc walls, Godox strobes & dressing rooms',
    icon: Camera,
    badge: 'CREATE',
    startRate: '₦20,000/hr',
    bgGradient: 'from-pink-500/10 to-rose-500/5'
  },
  {
    id: 'event-space',
    title: 'Event & Training Spaces',
    tagline: 'Keynotes, hackathons, workshops & corporate demos',
    icon: GraduationCap,
    badge: 'MEET',
    startRate: '₦45,000/session',
    bgGradient: 'from-cyan-500/10 to-sky-500/5'
  }
];

const TRUSTED_COMPANIES = [
  'Szndpay',
  'Flutterwave',
  'Paystack',
  'Andela',
  'Kuda Bank',
  'Moniepoint',
  'Piggyvest',
  'Eden Life',
  'Techstars Alumni'
];

const TESTIMONIALS = [
  {
    quote: 'OFIS solves the biggest headache for tech teams in Lagos: guaranteed power and enterprise fiber. We booked a 10-person boardroom in Victoria Island with 3 clicks and had zero downtime.',
    name: 'Babatunde Adeyemi',
    role: 'Staff Engineer at Fintech Systems',
    city: 'Lagos, Nigeria',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    space: 'The Hive Coworking VI'
  },
  {
    quote: 'We recorded 6 podcast episodes in their soundproof studio in Maitama Abuja. Audio acoustics were pristine and the instant QR turnstile pass made arrival effortless.',
    name: 'Chioma Nwosu',
    role: 'Executive Producer, Africa Talks Tech',
    city: 'Abuja, Nigeria',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    space: 'The SoundPod Broadcast Studio'
  },
  {
    quote: 'As a commercial property manager in Ikeja, listing our surplus meeting rooms on OFIS generated over ₦1.8M in bookings in our first 60 days. Transparent weekly payouts via Paystack.',
    name: 'Funke Akindele-Cole',
    role: 'Commercial Host & Facility Director',
    city: 'Lagos, Nigeria',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    rating: 5,
    space: 'Capital Edge Hub Ikeja'
  }
];

export const LandingPage: React.FC = () => {
  const {
    currentUser,
    allSpaces,
    spaces,
    setCurrentView,
    updateFilter,
    setActiveCategory,
    filters,
    executeSearchQuery,
    setIsListSpaceModalOpen,
    formatPrice
  } = useApp();

  // Search input state on hero
  const [heroSearchCity, setHeroSearchCity] = useState(filters.city || 'All Cities');
  const [heroSearchCategory, setHeroSearchCategory] = useState<string>('all');
  const [heroSearchDate, setHeroSearchDate] = useState('Today');
  const [heroSearchGuests, setHeroSearchGuests] = useState(1);
  const [heroSearchPillar, setHeroSearchPillar] = useState<'all' | 'work' | 'meet' | 'create' | 'record'>('all');

  // Greeting cycling state
  const [cycleStep, setCycleStep] = useState(0);
  const [randomPidginIndex, setRandomPidginIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCycleStep((prev) => {
        const next = prev + 1;
        setRandomPidginIndex(Math.floor(Math.random() * PIDGIN_GREETINGS.length));
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const indigenousLocales = GREETING_LOCALES.slice(1);
  const isEnglish = cycleStep % 2 === 0;
  const currentLocale = isEnglish 
    ? GREETING_LOCALES[0] 
    : indigenousLocales[Math.floor((cycleStep % (2 * indigenousLocales.length)) / 2) % indigenousLocales.length];

  const hour = new Date().getHours();
  const baseFirstName = currentUser && currentUser.id !== 'guest' && currentUser.id !== 'guest-user' && currentUser.name 
    ? currentUser.name.split(' ')[0] 
    : '';

  const localizedName = baseFirstName ? currentLocale.formatName(baseFirstName) : 'Chief';
  const currentPidginPhrase = PIDGIN_GREETINGS[randomPidginIndex];
  const greetingPhrase = currentLocale.getGreeting(hour, currentPidginPhrase);
  const greetingText = `${greetingPhrase}, ${localizedName}`;

  // Filter curated featured spaces
  const featuredSpaces = allSpaces
    .filter(s => s.rating >= 4.8 || s.isSuperhost || s.isVerified)
    .slice(0, 6);

  const handleExecuteHeroSearch = () => {
    updateFilter('city', heroSearchCity);
    if (heroSearchCategory !== 'all') {
      setActiveCategory(heroSearchCategory as SpaceCategory);
    } else if (heroSearchPillar === 'work') {
      setActiveCategory('coworking');
    } else if (heroSearchPillar === 'meet') {
      setActiveCategory('meeting-room');
    } else if (heroSearchPillar === 'create') {
      setActiveCategory('photography');
    } else if (heroSearchPillar === 'record') {
      setActiveCategory('studio');
    }
    updateFilter('guests', heroSearchGuests);
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCitySelect = (cityName: string) => {
    updateFilter('city', cityName);
    updateFilter('searchQuery', '');
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      setActiveCategory('all');
    } else {
      setActiveCategory(categoryId as SpaceCategory);
    }
    updateFilter('searchQuery', '');
    setCurrentView('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION: AI-FIRST ASK OFIS & QUICK INTENT TEMPLATES              */}
      {/* ========================================================================= */}
      <OfisHeroAiSection />

      {/* ========================================================================= */}
      {/* 2. INFRASTRUCTURE & TRUST METRICS BAR                                    */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-[#101827] border-b border-[#E5E7EB] dark:border-[#1E293B] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          
          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2 text-[#10B981]">
              <Zap className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black font-mono">100% Power</span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Dual Diesel + Solar Hybrid Backup</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2 text-[#10B981]">
              <Wifi className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black font-mono">100+ Mbps</span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Dedicated Enterprise Fiber Optic</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2 text-[#10B981]">
              <Building2 className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black font-mono">200+ Hubs</span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Vetted in Lagos, Abuja & PH</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center space-x-2 text-[#10B981]">
              <QrCode className="w-5 h-5" />
              <span className="text-xl sm:text-2xl font-black font-mono">15s Check-in</span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Instant Turnstile QR Mobile Passes</p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. POPULAR NIGERIAN CITIES DIRECTORY                                     */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
              Prime Hubs Across Nigeria
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight mt-1">
              Popular Cities & Neighborhoods
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-1">
              Discover verified workspaces in Nigeria&apos;s fastest growing tech and commercial zones.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('map');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center space-x-2 text-xs font-bold text-[#10B981] hover:underline cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Interactive Map</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {NIGERIAN_CITIES.map((city) => (
            <div
              key={city.name}
              onClick={() => handleCitySelect(city.name)}
              className="group relative rounded-3xl overflow-hidden bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm hover:shadow-xl transition-all cursor-pointer h-80 flex flex-col justify-end p-6"
            >
              {/* Background Image with Dark Overlay */}
              <img
                src={city.image}
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/60 to-transparent" />

              {/* Tag Pill Top Right */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-mono font-bold">
                  {city.spacesCount}
                </span>
              </div>

              {/* City Details */}
              <div className="relative z-10 space-y-1.5 text-white">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#10B981] font-bold">
                  {city.tag}
                </span>
                <h3 className="text-xl font-extrabold flex items-center justify-between">
                  <span>{city.name}</span>
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#10B981]" />
                </h3>
                <p className="text-xs text-[#CBD5E1] line-clamp-1">
                  {city.neighborhoods}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. WORKSPACE CATEGORIES SHOWCASE                                          */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#101827] border-y border-[#E5E7EB] dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
              Every Way You Work
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
              Spaces Tailored to Your Workday
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
              From quiet solo focus pods to 50-person broadcast studios and executive suites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES_DATA.map((cat) => {
              const Icon = cat.icon;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="p-6 rounded-3xl bg-[#F8FAFC] dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] hover:border-[#10B981]/50 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-white dark:bg-[#1E293B] text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#1E293B]">
                        {cat.badge}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                        {cat.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#10B981]">From {cat.startRate}</span>
                    <span className="text-[#6B7280] dark:text-[#94A3B8] group-hover:text-[#111827] dark:group-hover:text-white font-semibold flex items-center space-x-1">
                      <span>Browse</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED TOP-RATED WORKSPACES GRID                                     */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
              Curated Excellence
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight mt-1">
              Featured Nigerian Workspaces
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8] mt-1">
              Top-rated spaces verified for power uptime, high internet bandwidth, and exceptional host standards.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentView('explore');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-2.5 rounded-xl bg-white dark:bg-[#172033] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-bold text-[#111827] dark:text-[#F8FAFC] hover:border-[#10B981]/50 shadow-2xs transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
          >
            <span>View All ({allSpaces.length}) Spaces</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#10B981]" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredSpaces.map((space) => (
            <WorkspaceCard
              key={space.id}
              space={space}
              layout="grid"
            />
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY OFIS VS TRADITIONAL LEASES / CAFES                                */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#101827] border-y border-[#E5E7EB] dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
              The OFIS Standard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
              Why High-Performers Choose OFIS
            </h2>
            <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
              Say goodbye to noisy cafes, 2-year upfront commercial rent lock-in, and unpredictable grid blackouts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 rounded-3xl bg-[#F8FAFC] dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">100% Uninterrupted Power</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                Every space is audited for automated dual generator + solar pure sine inverter auto-switchover with 0.00ms switchover lag. Your zoom calls never drop.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FAFC] dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">Enterprise Dedicated Fiber</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                Speed-tested 50Mbps to 300Mbps low-latency fiber lines from top ISPs (Starlink, MainOne, ipNX) with wired ethernet backup for remote developers and creators.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-[#F8FAFC] dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center border border-[#10B981]/30">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">Zero-Friction QR Passes</h3>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                Book in seconds with Paystack/Flutterwave in Naira or USD. Arrive at the space and flash your digital QR pass at reception for immediate seamless access.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. HOW IT WORKS (3 SIMPLE STEPS)                                          */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
            Simple & Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            How OFIS Works
          </h2>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            From search to turnstile pass in under 60 seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Step 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#10B981] text-white font-mono font-black text-lg flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">Discover & Compare</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Filter by city, neighborhood, desk type, verified power rating, and live availability on our interactive map.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#10B981] text-white font-mono font-black text-lg flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">Book Instantly</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Choose an hour, full day, or multi-day pass. Checkout securely via Paystack, card, or wallet with instant confirmation.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#10B981] text-white font-mono font-black text-lg flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">Scan & Get to Work</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Scan your digital QR pass at the entrance. Get high-speed Wi-Fi credentials automatically and focus on what matters.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. TRUSTED ECOSYSTEM LOGOS                                               */}
      {/* ========================================================================= */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#101827] border-y border-[#E5E7EB] dark:border-[#1E293B]">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <p className="text-xs font-bold font-mono uppercase tracking-widest text-[#6B7280] dark:text-[#94A3B8]">
            Trusted by teams & remote professionals across Africa
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 dark:opacity-50 grayscale hover:grayscale-0 transition-all">
            {TRUSTED_COMPANIES.map((company) => (
              <span key={company} className="font-extrabold text-sm sm:text-base tracking-wider text-[#111827] dark:text-[#F8FAFC]">
                {company}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. REAL TESTIMONIALS                                                      */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
            Verified Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
            What Our Community Says
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1E293B] flex items-center space-x-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#10B981]/50"
                />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">{t.name}</h4>
                  <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. DUAL CALL TO ACTION: GUEST EXPLORE & BECOME A HOST                    */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Guest CTA Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase">
                For Guests & Teams
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Ready to Find Your Focus Hub?
              </h3>
              <p className="text-sm text-emerald-50 leading-relaxed max-w-md">
                Book a hot desk, boardroom, or creator suite in under 60 seconds with instant digital pass access.
              </p>
            </div>

            <div>
              <button
                type="button"
                id="landing-find-space-cta"
                onClick={() => {
                  setCurrentView('explore');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-2xl bg-white text-[#059669] hover:bg-emerald-50 font-bold text-sm shadow-md transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
              >
                <span>Explore All Spaces</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Host CTA Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-[#172033] border border-[#1E293B] text-white shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-[10px] font-mono font-bold uppercase">
                For Property Owners & Hosts
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Monetize Your Commercial Space
              </h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed max-w-md">
                Turn unused meeting rooms, podcast studios, or desks into recurring revenue. Automated payments and verified guests.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                id="landing-become-host-cta"
                onClick={() => {
                  setCurrentView('become_host');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
              >
                <span>Calculate Earnings</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                type="button"
                onClick={() => setIsListSpaceModalOpen(true)}
                className="px-5 py-3.5 rounded-2xl bg-[#1F2937] hover:bg-[#374151] border border-[#374151] text-white font-bold text-sm transition-all cursor-pointer"
              >
                List Space Now
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
