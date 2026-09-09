import React from 'react';
import { MapPin, Star, ShieldCheck, Wifi, ArrowRight, Zap, Building2, Video, Mic, Users, Calendar } from 'lucide-react';

interface FeaturedSpacesSectionProps {
  onExploreClick: () => void;
}

export const FeaturedSpacesSection: React.FC<FeaturedSpacesSectionProps> = ({ onExploreClick }) => {
  const featuredSpaces = [
    {
      id: 'vi-atrium',
      title: 'The Atrium Executive Coworking',
      location: 'Victoria Island, Lagos',
      category: 'Coworking Desks',
      price: '₦8,500',
      period: '/ day',
      rating: 4.96,
      reviews: 48,
      badge: '24/7 Generator Backup',
      badgeIcon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'abuja-capital',
      title: 'Capital Boardroom & Conference Suite',
      location: 'Maitama, Abuja',
      category: 'Meeting Rooms',
      price: '₦25,000',
      period: '/ hr',
      rating: 4.98,
      reviews: 62,
      badge: 'Dual Starlink + Fiber',
      badgeIcon: Wifi,
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'ikoyi-heritage',
      title: 'The Heritage Glasshouse Suite',
      location: 'Old Ikoyi, Lagos',
      category: 'Private Offices',
      price: '₦22,000',
      period: '/ day',
      rating: 4.94,
      reviews: 39,
      badge: 'Solar Hybrid 24/7',
      badgeIcon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'lekki-soundstage',
      title: 'Lekki Soundstage & Podcast Studio',
      location: 'Lekki Phase 1, Lagos',
      category: 'Podcast / Production Studios',
      price: '₦35,000',
      period: '/ hr',
      rating: 5.0,
      reviews: 31,
      badge: 'Soundproofed + Lights',
      badgeIcon: Mic,
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'apex-auditorium',
      title: 'Apex Amphitheater & Training Hall',
      location: 'Ikeja GRA, Lagos',
      category: 'Event & Training Spaces',
      price: '₦65,000',
      period: '/ hr',
      rating: 4.97,
      reviews: 28,
      badge: 'Heavy Audio/Visual Rig',
      badgeIcon: Zap,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0F766E]/15 border border-[#0F766E]/40 text-xs font-bold text-[#14B8A6] uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F4A261]" />
            <span>The OFIS Verified Standard</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Featured Spaces
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8] mt-2">
            Inspected workspaces with guaranteed 24/7 power, high-speed fiber internet, and instant digital check-in.
          </p>
        </div>
        <button
          onClick={onExploreClick}
          className="inline-flex items-center space-x-2 text-sm font-bold text-[#14B8A6] hover:text-white transition-colors group cursor-pointer shrink-0"
        >
          <span>View all 70+ verified spaces</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {featuredSpaces.map((space) => {
          const BadgeIcon = space.badgeIcon;
          return (
            <div
              key={space.id}
              onClick={onExploreClick}
              className="rounded-2xl bg-[#0B1F33] border border-[#1E3A4D] overflow-hidden group hover:border-[#0F766E]/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-md flex flex-col justify-between"
            >
              {/* Image */}
              <div>
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={space.image}
                    alt={space.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071521] via-transparent to-transparent" />
                  
                  <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#071521]/85 backdrop-blur-md border border-[#1E3A4D] text-[10px] font-semibold text-[#14B8A6]">
                    <BadgeIcon className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>{space.badge}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-xs text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{space.rating}</span>
                    <span className="text-[#94A3B8] font-normal">({space.reviews})</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    {space.category}
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#14B8A6] transition-colors">
                    {space.title}
                  </h3>
                  <div className="flex items-center text-xs text-[#94A3B8]">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-[#0F766E] shrink-0" />
                    <span className="truncate">{space.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 pt-3 border-t border-[#1E3A4D] flex items-center justify-between text-xs">
                <span className="font-extrabold text-white text-sm">
                  {space.price} <span className="text-[11px] font-normal text-[#94A3B8]">{space.period}</span>
                </span>
                <span className="text-[11px] font-semibold text-[#14B8A6] group-hover:underline">
                  View →
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
