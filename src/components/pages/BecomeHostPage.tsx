import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Users, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Calculator,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpaceCategory } from '../../types';

export const BecomeHostPage: React.FC = () => {
  const { setIsListSpaceModalOpen, setCurrentView, formatPrice } = useApp();

  // Host Calculator State
  const [calcCity, setCalcCity] = useState<'Lagos' | 'Abuja' | 'Port Harcourt' | 'Ibadan'>('Lagos');
  const [calcSpaceType, setCalcSpaceType] = useState<string>('coworking');
  const [calcCapacity, setCalcCapacity] = useState<number>(10);
  const [calcDaysPerWeek, setCalcDaysPerWeek] = useState<number>(5);

  // Rate multipliers based on city and space type
  const estimatedMonthlyRevenue = useMemo(() => {
    let baseRatePerUnitDay = 5000; // NGN per day per desk/unit

    if (calcSpaceType === 'coworking') {
      baseRatePerUnitDay = calcCity === 'Lagos' ? 6000 : calcCity === 'Abuja' ? 5500 : 4000;
    } else if (calcSpaceType === 'meeting-room') {
      baseRatePerUnitDay = calcCity === 'Lagos' ? 45000 : calcCity === 'Abuja' ? 40000 : 30000;
    } else if (calcSpaceType === 'private-office') {
      baseRatePerUnitDay = calcCity === 'Lagos' ? 25000 : calcCity === 'Abuja' ? 22000 : 16000;
    } else if (calcSpaceType === 'studio') {
      baseRatePerUnitDay = calcCity === 'Lagos' ? 50000 : calcCity === 'Abuja' ? 45000 : 35000;
    }

    const estimatedOccupancy = 0.65; // conservative 65% occupancy
    const units = calcSpaceType === 'coworking' ? calcCapacity : Math.max(1, Math.floor(calcCapacity / 6));
    const weeksPerMonth = 4.3;
    const daysPerMonth = calcDaysPerWeek * weeksPerMonth;

    const gross = units * baseRatePerUnitDay * daysPerMonth * estimatedOccupancy;
    const net = gross * 0.90; // minus 10% platform commission

    return Math.round(net);
  }, [calcCity, calcSpaceType, calcCapacity, calcDaysPerWeek]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150">
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] dark:border-[#1E293B] text-center bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220] overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D1FAE5] dark:bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#10B981]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Monetize Commercial Real Estate in Nigeria</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
            Turn Unused Office Space into Recurring Monthly Revenue.
          </h1>

          <p className="text-base sm:text-lg text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
            List your coworking desks, executive meeting rooms, private suites, or creator studios on OFIS. Connect with thousands of verified Nigerian founders, tech workers, and enterprise teams.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              id="become-host-list-now-btn"
              onClick={() => setIsListSpaceModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              <span>List Your Space for Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                const calcEl = document.getElementById('earnings-calculator-section');
                if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3.5 rounded-2xl bg-white dark:bg-[#172033] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-bold text-[#111827] dark:text-[#F8FAFC] cursor-pointer"
            >
              Calculate Your Earnings
            </button>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
            Why Partner With OFIS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built for Commercial Property Owners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Guaranteed Friday Payouts</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              No chasing invoices or dealing with defaulted tenants. Bookings are prepaid via Paystack, and net earnings are deposited automatically every Friday to your Nigerian commercial bank account.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Verified Corporate & Tech Guests</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Every guest is identity-verified with phone and corporate email checks. Guests agree to strict community conduct standards, safeguarding your facilities and assets.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Complete Calendar & Pricing Control</h3>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Block internal dates anytime, adjust hourly/daily rates, set custom weekend multipliers, and manage capacity in real-time from your intuitive Host Operations Portal.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE HOST EARNINGS CALCULATOR                                      */}
      {/* ========================================================================= */}
      <section id="earnings-calculator-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#101827] border-y border-[#E5E7EB] dark:border-[#1E293B]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
              Revenue Forecaster
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Estimate Your Space Revenue
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#94A3B8]">
              See what your property could generate each month based on local market demand.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-[#F8FAFC] dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* City Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase">City</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'] as const).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCalcCity(city)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        calcCity === city
                          ? 'bg-[#10B981] text-white border-[#10B981] shadow-xs'
                          : 'bg-white dark:bg-[#101827] border-[#E5E7EB] dark:border-[#1E293B] text-[#6B7280] dark:text-[#94A3B8]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Space Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase">Space Category</label>
                <select
                  value={calcSpaceType}
                  onChange={(e) => setCalcSpaceType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-white dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-semibold cursor-pointer"
                >
                  <option value="coworking">Coworking Hot Desks</option>
                  <option value="meeting-room">Executive Meeting Room / Boardroom</option>
                  <option value="private-office">Private Serviced Office Suite</option>
                  <option value="studio">Podcast & Media Studio</option>
                </select>
              </div>

              {/* Capacity Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase">Total Capacity / Desks</span>
                  <span className="font-bold font-mono text-[#10B981] text-sm">{calcCapacity} People / Desks</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={calcCapacity}
                  onChange={(e) => setCalcCapacity(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>

              {/* Days per Week */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#6B7280] dark:text-[#94A3B8] uppercase">Operating Days per Week</span>
                  <span className="font-bold font-mono text-[#10B981] text-sm">{calcDaysPerWeek} Days/wk</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={calcDaysPerWeek}
                  onChange={(e) => setCalcDaysPerWeek(Number(e.target.value))}
                  className="w-full accent-[#10B981] cursor-pointer"
                />
              </div>

            </div>

            {/* Estimated Output (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-4 shadow-md">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#6B7280] dark:text-[#94A3B8]">
                Estimated Monthly Net Payout
              </span>
              
              <div className="text-3xl sm:text-4xl font-black text-[#10B981] font-mono tracking-tight">
                {formatPrice(estimatedMonthlyRevenue)}
              </div>

              <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                Based on 65% projected occupancy in {calcCity} with automated 10% platform fee deducted.
              </p>

              <button
                type="button"
                onClick={() => setIsListSpaceModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
              >
                List This Space Now
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 3-Step Listing Workflow */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
            Fast Onboarding
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How to Get Listed in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-mono font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm">Submit Space Details & Photos</h4>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Upload high-resolution images, describe amenities, specify seating capacity, and configure your hourly or daily rates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-mono font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm">Fast Track Infrastructure Audit</h4>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Our team verifies generator changeover backup, speed-tests your fiber connection, and issues your OFIS Verified Badge.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#10B981] text-white font-mono font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm">Receive Bookings & Friday Payouts</h4>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
              Guests scan digital QR passes at check-in. Your revenue automatically accrues and pays out every Friday.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
