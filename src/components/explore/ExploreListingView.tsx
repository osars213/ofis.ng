import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Zap, 
  Wifi, 
  Star, 
  SlidersHorizontal, 
  RotateCcw, 
  Map as MapIcon, 
  Grid3X3, 
  LayoutList, 
  ChevronDown, 
  X, 
  Check, 
  ArrowUpDown, 
  Building2, 
  Layers, 
  ShieldCheck,
  Compass,
  Laptop,
  Presentation,
  Mic,
  Camera,
  GraduationCap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Space, SpaceCategory } from '../../types';
import { WorkspaceCard } from '../WorkspaceCard';
import { getSpacePricing } from '../../utils/pricing';
import { getSpaceAvailability } from '../../utils/availability';
import { optimizeImageUrl } from '../../utils/imageOptimizer';

const POPULAR_NEIGHBORHOODS: Record<string, string[]> = {
  'Lagos': ['Victoria Island', 'Lekki Phase 1', 'Ikoyi', 'Ikeja GRA', 'Yaba', 'Maryland'],
  'Abuja': ['Maitama', 'Central Business District', 'Wuse II', 'Garki', 'Jabi'],
  'Port Harcourt': ['Old GRA', 'New GRA', 'Peter Odili', 'Trans-Amadi'],
  'Ibadan': ['Bodija', 'Ring Road', 'Jericho', 'Samonda'],
  'All Cities': ['Victoria Island', 'Maitama', 'Lekki Phase 1', 'Ikeja GRA', 'Old GRA']
};

const AMENITY_OPTIONS = [
  'Dual Diesel Generator',
  'Solar Inverter Backup',
  '100+ Mbps Fiber',
  'Starlink High-Speed',
  '4K Presentation Display',
  'Ergonomic Chairs',
  'Private Phone Booths',
  'Acoustic Soundproofing',
  'Specialty Coffee & Tea',
  'Free Parking',
  '24/7 Access Pass'
];

export const ExploreListingView: React.FC = () => {
  const {
    spaces,
    allSpaces,
    isLoadingSpaces,
    filters,
    updateFilter,
    resetFilters,
    activeCategory,
    setActiveCategory,
    currency,
    formatPrice,
    setSelectedSpaceId,
    setCurrentView,
    savedSpaceIds
  } = useApp();

  // Desktop view modes: 'split' (List + Map side-by-side) or 'grid' (Full-width grid)
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');
  const [sortBy, setSortBy] = useState<'recommended' | 'price_low' | 'price_high' | 'rating' | 'speed'>('recommended');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeHoverSpace, setActiveHoverSpace] = useState<Space | null>(null);

  // Filter and sort spaces
  const sortedSpaces = useMemo(() => {
    let list = [...spaces];

    if (sortBy === 'price_low') {
      list.sort((a, b) => getSpacePricing(a).rate - getSpacePricing(b).rate);
    } else if (sortBy === 'price_high') {
      list.sort((a, b) => getSpacePricing(b).rate - getSpacePricing(a).rate);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'speed') {
      list.sort((a, b) => (b.internetSpeedMbps || 0) - (a.internetSpeedMbps || 0));
    }

    return list;
  }, [spaces, sortBy]);

  // Active filters counting
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.city && filters.city !== 'All Cities') count++;
    if (activeCategory && activeCategory !== 'all') count++;
    if (filters.searchQuery) count++;
    if (filters.guests > 1) count++;
    if (filters.instantBookingOnly) count++;
    if (filters.availableNowOnly) count++;
    if (filters.minPrice > 0 || (filters.maxPrice && filters.maxPrice < 100000)) count++;
    if (filters.amenities && filters.amenities.length > 0) count += filters.amenities.length;
    return count;
  }, [filters, activeCategory]);

  const currentCity = filters.city || 'All Cities';
  const neighborhoods = POPULAR_NEIGHBORHOODS[currentCity] || POPULAR_NEIGHBORHOODS['All Cities'];

  const handleToggleAmenity = (amenity: string) => {
    const current = filters.amenities || [];
    const updated = current.includes(amenity)
      ? current.filter(a => a !== amenity)
      : [...current, amenity];
    updateFilter('amenities', updated);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07383D] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150">
      
      {/* Top Breadcrumb & Controls Bar */}
      <div className="sticky top-16 sm:top-[70px] z-30 bg-white/95 dark:bg-[#07383D]/95 backdrop-blur-md border-b border-[#E5E7EB] dark:border-[#166D74] px-4 sm:px-6 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Left: Summary & City / Category quick info */}
          <div className="flex items-center space-x-3 overflow-x-auto pb-1 md:pb-0">
            <h1 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] whitespace-nowrap">
              Explore Workspaces
            </h1>

            <span className="text-[#94A3B8]">•</span>

            <div className="flex items-center space-x-1.5 text-xs font-mono text-[#006B70] dark:text-[#28D2CB] shrink-0">
              <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
              <span className="font-bold">{sortedSpaces.length} Verified</span>
            </div>

            <span className="text-[#94A3B8] hidden sm:inline">•</span>

            <div className="flex items-center space-x-1 text-xs text-[#374151] dark:text-[#94A3B8] whitespace-nowrap">
              <span>Location:</span>
              <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">{currentCity}</span>
            </div>

            {activeCategory !== 'all' && (
              <>
                <span className="text-[#94A3B8] hidden sm:inline">•</span>
                <span className="px-2 py-0.5 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] text-[10px] font-mono font-bold uppercase">
                  {String(activeCategory).replace(/-/g, ' ')}
                </span>
              </>
            )}
          </div>

          {/* Right: Actions, Sorting & View Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
            
            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-xs font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center space-x-1.5 shadow-2xs cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#006B70] text-white text-[10px] flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-xs shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
              <select
                id="explore-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium text-[#111827] dark:text-[#F8FAFC] focus:outline-none cursor-pointer text-xs"
                aria-label="Sort Workspaces"
              >
                <option value="recommended" className="bg-white dark:bg-[#0B4A50]">Recommended</option>
                <option value="price_low" className="bg-white dark:bg-[#0B4A50]">Price: Low to High</option>
                <option value="price_high" className="bg-white dark:bg-[#0B4A50]">Price: High to Low</option>
                <option value="rating" className="bg-white dark:bg-[#0B4A50]">Highest Rated (4.8+)</option>
                <option value="speed" className="bg-white dark:bg-[#0B4A50]">Fastest Fiber (Mbps)</option>
              </select>
            </div>

            {/* View Mode Toggle (Grid vs Split Map on Desktop) */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#006B70] text-white shadow-xs'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
                }`}
                title="Grid Layout"
              >
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'split'
                    ? 'bg-[#006B70] text-white shadow-xs'
                    : 'text-[#6B7280] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC]'
                }`}
                title="Split Map Layout"
              >
                <MapIcon className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* Responsive Horizontal Category Submenu Bar */}
        <div className="max-w-7xl mx-auto mt-2.5 pt-2.5 border-t border-[#E5E7EB]/80 dark:border-[#166D74]/80 flex items-center space-x-1.5 overflow-x-auto scrollbar-none snap-x touch-pan-x py-0.5">
          {[
            { id: 'all', label: 'All Spaces' },
            { id: 'coworking', label: 'Coworking Desks' },
            { id: 'private-office', label: 'Private Offices' },
            { id: 'meeting-room', label: 'Meeting Rooms' },
            { id: 'studio', label: 'Studios & Audio' },
            { id: 'training-room', label: 'Training Rooms' },
            { id: 'event-space', label: 'Event Venues' },
          ].map((cat) => {
            const isSelected = (!activeCategory && cat.id === 'all') || activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id === 'all' ? null : (cat.id as any))}
                className={`snap-start shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#FFA987] via-[#FF8A65] to-[#E05626] text-[#12383B] font-black shadow-sm ring-1 ring-[#FFA987]/60'
                    : 'bg-[#F1F6F5] dark:bg-[#0B4A50] hover:bg-[#FFF9F4] dark:hover:bg-[#105A60] text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#C85A32] dark:hover:text-[#FFA987]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT SIDEBAR: FILTERS DESKTOP PANEL (3 cols on lg)                        */}
          {/* ========================================================================= */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-36 space-y-6 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
            
            <div className="p-5 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] shadow-sm space-y-6">
              
              {/* Header with Reset */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#166D74]">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#006B70] dark:text-[#28D2CB]" />
                  <h2 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">Filters</h2>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-bold text-[#006B70] dark:text-[#28D2CB] hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block">
                  City
                </label>
                <select
                  value={filters.city || 'All Cities'}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] focus:outline-none focus:border-[#006B70] cursor-pointer"
                >
                  <option value="All Cities">All Cities in Nigeria</option>
                  <option value="Lagos">Lagos (VI, Lekki, Ikeja)</option>
                  <option value="Abuja">Abuja (Maitama, CBD)</option>
                  <option value="Port Harcourt">Port Harcourt (Old GRA)</option>
                  <option value="Ibadan">Ibadan (Bodija, Ring Rd)</option>
                </select>
              </div>

              {/* Neighborhood Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block">
                  Popular Neighborhoods
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {neighborhoods.map((n) => {
                    const isSelected = (filters.searchQuery || '').toLowerCase().includes(n.toLowerCase());
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => updateFilter('searchQuery', isSelected ? '' : n)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#006B70] text-white shadow-2xs font-bold'
                            : 'bg-[#F8FAFC] dark:bg-[#105A60] text-[#6B7280] dark:text-[#94A3B8] border border-[#E5E7EB] dark:border-[#166D74] hover:border-[#006B70]'
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category Pills */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block">
                  Space Category
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Categories' },
                    { id: 'coworking', label: 'Coworking Desks' },
                    { id: 'meeting-room', label: 'Meeting Rooms' },
                    { id: 'private-office', label: 'Private Offices' },
                    { id: 'studio', label: 'Podcast Studios' },
                    { id: 'photography', label: 'Photography Suites' },
                    { id: 'event-space', label: 'Event Spaces' },
                  ].map((cat) => {
                    const isSelected = activeCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setActiveCategory(cat.id as any)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-medium text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#006B70]/15 dark:bg-[#006B70]/25 text-[#006B70] dark:text-[#28D2CB] font-bold border border-[#006B70]/40'
                            : 'text-[#4B5563] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#101827]'
                        }`}
                      >
                        <span>{cat.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles: Available Now & Instant Book */}
              <div className="space-y-2.5 pt-2 border-t border-[#E5E7EB] dark:border-[#166D74]">
                <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                  <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Available Right Now</span>
                  <input
                    type="checkbox"
                    checked={!!filters.availableNowOnly}
                    onChange={(e) => updateFilter('availableNowOnly', e.target.checked)}
                    className="w-4 h-4 accent-[#006B70] rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer select-none">
                  <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Instant Digital Pass</span>
                  <input
                    type="checkbox"
                    checked={!!filters.instantBookingOnly}
                    onChange={(e) => updateFilter('instantBookingOnly', e.target.checked)}
                    className="w-4 h-4 accent-[#006B70] rounded cursor-pointer"
                  />
                </label>
              </div>

              {/* Amenities Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#E5E7EB] dark:border-[#166D74]">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase tracking-wider block">
                  Guaranteed Amenities
                </label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {AMENITY_OPTIONS.map((am) => {
                    const isChecked = (filters.amenities || []).includes(am);
                    return (
                      <label key={am} className="flex items-center space-x-2 text-xs text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleAmenity(am)}
                          className="w-3.5 h-3.5 accent-[#006B70] rounded cursor-pointer"
                        />
                        <span className="truncate">{am}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

            </div>
          </aside>

          {/* ========================================================================= */}
          {/* CENTER: WORKSPACES GRID (9 cols if grid, 5-6 cols if split on lg)        */}
          {/* ========================================================================= */}
          <main className={`${viewMode === 'split' ? 'lg:col-span-5' : 'lg:col-span-9'} space-y-6`}>
            
            {/* Active Filters Bar */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-xs">
                <span className="font-bold text-[#6B7280] dark:text-[#94A3B8]">Active:</span>
                
                {filters.city && filters.city !== 'All Cities' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/25 text-[#006B70] dark:text-[#28D2CB] font-bold">
                    <span>{filters.city}</span>
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('city', 'All Cities')} />
                  </span>
                )}

                {activeCategory !== 'all' && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/25 text-[#006B70] dark:text-[#28D2CB] font-bold">
                    <span>{String(activeCategory).replace(/-/g, ' ')}</span>
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveCategory('all')} />
                  </span>
                )}

                {filters.searchQuery && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/25 text-[#006B70] dark:text-[#28D2CB] font-bold">
                    <span>&ldquo;{filters.searchQuery}&rdquo;</span>
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('searchQuery', '')} />
                  </span>
                )}

                {filters.availableNowOnly && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/25 text-[#006B70] dark:text-[#28D2CB] font-bold">
                    <span>Available Now</span>
                    <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('availableNowOnly', false)} />
                  </span>
                )}

                {(filters.amenities || []).map((am) => (
                  <span key={am} className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/25 text-[#006B70] dark:text-[#28D2CB] font-bold">
                    <span>{am}</span>
                    <X className="w-3 h-3 cursor-pointer" onClick={() => handleToggleAmenity(am)} />
                  </span>
                ))}

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-xs font-bold text-[#EF4444] hover:underline ml-auto cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Workspaces Grid */}
            {isLoadingSpaces ? (
              <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'sm:grid-cols-1 xl:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-80 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] animate-pulse p-4 flex flex-col justify-between">
                    <div className="w-full h-44 bg-[#E2E8F0] dark:bg-[#105A60] rounded-2xl" />
                    <div className="space-y-2">
                      <div className="w-3/4 h-4 bg-[#E2E8F0] dark:bg-[#105A60] rounded" />
                      <div className="w-1/2 h-3 bg-[#E2E8F0] dark:bg-[#105A60] rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedSpaces.length === 0 ? (
              <div className="p-12 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] text-center space-y-4 max-w-md mx-auto my-12">
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] dark:bg-[#105A60] flex items-center justify-center mx-auto text-[#6B7280] dark:text-[#94A3B8]">
                  <Search className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">No matching workspaces</h2>
                  <p className="text-xs text-[#374151] dark:text-[#94A3B8]">
                    No verified spaces match your active filters. Try broadening your location or resetting filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className={`grid grid-cols-1 ${viewMode === 'split' ? 'sm:grid-cols-1 xl:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                {sortedSpaces.map((space) => (
                  <div
                    key={space.id}
                    onMouseEnter={() => setActiveHoverSpace(space)}
                  >
                    <WorkspaceCard
                      space={space}
                      layout="grid"
                    />
                  </div>
                ))}
              </div>
            )}

          </main>

          {/* ========================================================================= */}
          {/* RIGHT SIDEBAR: INTERACTIVE SPLIT MAP (4 cols on lg when viewMode === 'split') */}
          {/* ========================================================================= */}
          {viewMode === 'split' && (
            <div className="hidden lg:block lg:col-span-4 sticky top-36 h-[calc(100vh-10rem)] rounded-3xl overflow-hidden border border-[#E5E7EB] dark:border-[#166D74] bg-[#F1F5F9] dark:bg-[#07383D] relative shadow-lg">
              
              {/* Stylized Nigeria Map Background Grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:20px_20px] opacity-20" />
              
              {/* Map Header */}
              <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between p-2.5 rounded-2xl bg-white/90 dark:bg-[#0B4A50]/90 backdrop-blur-md border border-[#E5E7EB] dark:border-[#166D74] shadow-sm text-xs">
                <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">Live Map Preview</span>
                <button
                  type="button"
                  onClick={() => setCurrentView('map')}
                  className="text-xs font-bold text-[#006B70] dark:text-[#28D2CB] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Full Map</span>
                </button>
              </div>

              {/* Interactive Nodes */}
              <div className="absolute inset-0 pt-16 p-4">
                {sortedSpaces.slice(0, 20).map((space, idx) => {
                  const isHovered = activeHoverSpace?.id === space.id;
                  const topOffset = 20 + (idx * 14) % 65;
                  const leftOffset = 15 + (idx * 17) % 70;
                  const pricing = getSpacePricing(space);

                  return (
                    <button
                      key={space.id}
                      type="button"
                      onClick={() => {
                        setSelectedSpaceId(space.id);
                        setCurrentView('details');
                      }}
                      onMouseEnter={() => setActiveHoverSpace(space)}
                      style={{ top: `${topOffset}%`, left: `${leftOffset}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold transition-all shadow-md cursor-pointer ${
                        isHovered
                          ? 'bg-[#006B70] text-white scale-110 z-30 ring-4 ring-[#14B8A6]/30'
                          : 'bg-white dark:bg-[#0B4A50] text-[#111827] dark:text-[#F8FAFC] border border-[#E5E7EB] dark:border-[#166D74] hover:border-[#006B70] z-10'
                      }`}
                    >
                      <span>{formatPrice(pricing.rate)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hovered Card Preview at Bottom */}
              {activeHoverSpace && (
                <div className="absolute bottom-4 left-4 right-4 z-20">
                  <div 
                    onClick={() => {
                      setSelectedSpaceId(activeHoverSpace.id);
                      setCurrentView('details');
                    }}
                    className="p-3 rounded-2xl bg-white dark:bg-[#0B4A50] border border-[#E5E7EB] dark:border-[#166D74] shadow-xl flex items-center space-x-3 cursor-pointer hover:border-[#006B70]"
                  >
                    <img
                      src={optimizeImageUrl(activeHoverSpace.featuredImage, { width: 200, quality: 75 })}
                      alt={activeHoverSpace.title}
                      loading="lazy"
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] truncate">
                        {activeHoverSpace.title}
                      </h3>
                      <p className="text-[10px] text-[#374151] dark:text-[#94A3B8]">
                        {activeHoverSpace.neighborhood}, {activeHoverSpace.city}
                      </p>
                      <span className="text-xs font-extrabold text-[#006B70] dark:text-[#28D2CB] font-mono">
                        {formatPrice(getSpacePricing(activeHoverSpace).rate)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end lg:hidden">
          <div className="w-full max-w-sm bg-white dark:bg-[#0B4A50] h-full overflow-y-auto p-6 space-y-6 shadow-2xl flex flex-col justify-between">
            
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB] dark:border-[#166D74]">
                <h2 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">Filter Workspaces</h2>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-2 rounded-xl text-[#6B7280] hover:text-[#111827] dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* City Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase">City</label>
                <select
                  value={filters.city || 'All Cities'}
                  onChange={(e) => updateFilter('city', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#105A60] border border-[#E5E7EB] dark:border-[#166D74] text-xs font-semibold"
                >
                  <option value="All Cities">All Cities in Nigeria</option>
                  <option value="Lagos">Lagos (VI, Lekki, Ikeja)</option>
                  <option value="Abuja">Abuja (Maitama, CBD)</option>
                  <option value="Port Harcourt">Port Harcourt (Old GRA)</option>
                  <option value="Ibadan">Ibadan (Bodija, Ring Rd)</option>
                </select>
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'coworking', label: 'Coworking' },
                    { id: 'meeting-room', label: 'Meeting' },
                    { id: 'private-office', label: 'Office' },
                    { id: 'studio', label: 'Podcast' },
                    { id: 'photography', label: 'Photo' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setActiveCategory(cat.id as any)}
                      className={`p-2 rounded-xl text-xs font-medium border text-center ${
                        activeCategory === cat.id
                          ? 'bg-[#006B70] text-white border-[#006B70]'
                          : 'border-[#E5E7EB] dark:border-[#166D74] text-[#6B7280] dark:text-[#94A3B8]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#166D74] flex items-center gap-3">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-3 rounded-xl border border-[#E5E7EB] dark:border-[#166D74] text-xs font-bold"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 rounded-xl bg-[#006B70] text-white text-xs font-bold shadow-md"
              >
                Show Results
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
