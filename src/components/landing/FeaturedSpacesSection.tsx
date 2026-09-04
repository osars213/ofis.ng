import React from 'react';
import { MapPin, Star, ShieldCheck, Wifi, ArrowRight, Zap, Building2 } from 'lucide-react';

interface FeaturedSpacesSectionProps {
  onExploreClick: () => void;
}

export const FeaturedSpacesSection: React.FC<FeaturedSpacesSectionProps> = ({ onExploreClick }) => {
  const featuredSpaces = [
    {
      id: 'vi-atrium',
      title: 'The Atrium Executive Worksuite',
      location: 'Victoria Island, Lagos',
      category: 'Workstations & Private Suites',
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
      title: 'Capital Boardroom & Video Suite',
      location: 'Maitama, Abuja',
      category: 'Meeting & Boardroom',
      price: '₦25,000',
      period: '/ hr',
      rating: 4.98,
      reviews: 62,
      badge: 'Dual Starlink + Fiber',
      badgeIcon: Wifi,
      image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'lekki-soundstage',
      title: 'Lekki Soundstage & Podcast Studio',
      location: 'Lekki Phase 1, Lagos',
      category: 'Production Studio',
      price: '₦35,000',
      period: '/ hr',
      rating: 5.0,
      reviews: 31,
      badge: 'Soundproofed + Lights',
      badgeIcon: Zap,
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: 'ikoyi-heritage',
      title: 'The Heritage Glasshouse & Garden Loft',
      location: 'Old Ikoyi, Lagos',
      category: 'Executive Private Office',
      price: '₦18,000',
      period: '/ day',
      rating: 4.94,
      reviews: 39,
      badge: 'Solar Hybrid 24/7',
      badgeIcon: ShieldCheck,
      image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#10B981] block mb-2">
            Inspected Spaces
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight">
            Featured Spaces
          </h2>
        </div>
        <button
          onClick={onExploreClick}
          className="inline-flex items-center space-x-2 text-sm font-bold text-[#34D399] hover:text-[#10B981] transition-colors group cursor-pointer"
        >
          <span>View all 70+ verified spaces</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredSpaces.map((space) => {
          const BadgeIcon = space.badgeIcon;
          return (
            <div
              key={space.id}
              onClick={onExploreClick}
              className="rounded-2xl bg-[#171615] border border-[#292724] overflow-hidden group hover:border-[#10B981]/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-900">
                <img
                  src={space.image}
                  alt={space.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0B0A] via-transparent to-transparent" />
                
                <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#0C0B0A]/85 backdrop-blur-md border border-white/10 text-[10px] font-semibold text-[#34D399]">
                  <BadgeIcon className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>{space.badge}</span>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-xs text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{space.rating}</span>
                  <span className="text-[#A8A29E] font-normal">({space.reviews})</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#A8A29E]">
                  {space.category}
                </div>
                <h4 className="text-base font-bold text-[#FAF8F5] line-clamp-1 group-hover:text-[#34D399] transition-colors">
                  {space.title}
                </h4>
                <div className="flex items-center text-xs text-[#A8A29E]">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-[#10B981] shrink-0" />
                  <span className="truncate">{space.location}</span>
                </div>
                
                <div className="pt-3 border-t border-[#292724] flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#FAF8F5] text-sm">
                    {space.price} <span className="text-[11px] font-normal text-[#A8A29E]">{space.period}</span>
                  </span>
                  <span className="text-[11px] font-semibold text-[#10B981] group-hover:underline">
                    View Space →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
