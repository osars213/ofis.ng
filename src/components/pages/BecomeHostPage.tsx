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
    <div className="min-h-screen bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] transition-colors duration-150">
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E2ECEB] dark:border-[#166D74] text-center bg-gradient-to-b from-white via-[#FFF9F4] to-[#F1F5F9] dark:from-[#07383D] dark:via-[#0B4A50] dark:to-[#07383D] overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#14BEB8]/15 dark:bg-[#14BEB8]/20 border border-[#14BEB8]/30 text-xs font-bold text-[#006B70] dark:text-[#28D2CB]">
            <Building2 className="w-3.5 h-3.5 text-[#FFA987]" />
            <span>OFIS Host Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#12383B] dark:text-[#FFFFFF]">
            Turn Unused Office Space into Recurring Monthly Revenue.
          </h1>

          <p className="text-base sm:text-lg text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
            List your coworking desks, executive meeting rooms, private suites, or creator studios on the OFIS Host Platform. Connect with thousands of verified Nigerian founders, tech workers, and enterprise teams.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              id="become-host-list-now-btn"
              onClick={() => setIsListSpaceModalOpen(true)}
              className="min-h-[44px] px-6 py-3 rounded-2xl bg-gradient-to-r from-[#006B70] via-[#14BEB8] to-[#FFA987] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center space-x-2 cursor-pointer"
            >
              <span>List Your Space on OFIS</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                const calcEl = document.getElementById('earnings-calculator-section');
                if (calcEl) calcEl.scrollIntoView({ behavior: 'smooth' });
              }}
              className="min-h-[44px] px-6 py-3 rounded-2xl bg-white dark:bg-[#0B4A50] hover:bg-[#F1F6F5] dark:hover:bg-[#105A60] border border-[#E2ECEB] dark:border-[#166D74] text-xs font-bold text-[#12383B] dark:text-[#FFFFFF] cursor-pointer"
            >
              Calculate Your Earnings
            </button>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-14">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#006B70] dark:text-[#28D2CB]">
            Why Host on OFIS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Built for Commercial Property Owners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Guaranteed Friday Payouts</h3>
            <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              No chasing invoices or dealing with defaulted tenants. Bookings are prepaid via Paystack, and net earnings are deposited automatically every Friday to your Nigerian commercial bank account.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Verified Corporate & Tech Guests</h3>
            <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              Every guest is identity-verified with phone and corporate email checks. Guests agree to strict community conduct standards, safeguarding your facilities and assets.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Complete Calendar & Pricing Control</h3>
            <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              Block internal dates anytime, adjust hourly/daily rates, set custom weekend multipliers, and manage capacity in real-time from your intuitive Host Operations Portal.
            </p>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE HOST EARNINGS CALCULATOR                                      */}
      {/* ========================================================================= */}
      <section id="earnings-calculator-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAF9] dark:bg-[#07383D]/60 border-y border-[#E2ECEB] dark:border-[#166D74]">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#006B70] dark:text-[#28D2CB]">
              Revenue Forecaster
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Estimate Your Space Revenue
            </h2>
            <p className="text-xs sm:text-sm text-[#5D7A7D] dark:text-[#B8D1D0]">
              See what your property could generate each month based on local market demand.
            </p>
          </div>

          <div className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* City Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#12383B] dark:text-[#B8D1D0] uppercase">City</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan'] as const).map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setCalcCity(city)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        calcCity === city
                          ? 'bg-[#006B70] text-white border-[#006B70] shadow-xs'
                          : 'bg-[#F1F6F5] dark:bg-[#07383D] border-[#E2ECEB] dark:border-[#166D74] text-[#5D7A7D] dark:text-[#B8D1D0]'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Space Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#12383B] dark:text-[#B8D1D0] uppercase">Space Category</label>
                <select
                  value={calcSpaceType}
                  onChange={(e) => setCalcSpaceType(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-xs font-semibold text-[#12383B] dark:text-[#FFFFFF] cursor-pointer"
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
                  <span className="font-bold text-[#12383B] dark:text-[#B8D1D0] uppercase">Total Capacity / Desks</span>
                  <span className="font-bold font-mono text-[#006B70] dark:text-[#28D2CB] text-sm">{calcCapacity} People / Desks</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={calcCapacity}
                  onChange={(e) => setCalcCapacity(Number(e.target.value))}
                  className="w-full accent-[#006B70] cursor-pointer"
                />
              </div>

              {/* Days per Week */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#12383B] dark:text-[#B8D1D0] uppercase">Operating Days per Week</span>
                  <span className="font-bold font-mono text-[#006B70] dark:text-[#28D2CB] text-sm">{calcDaysPerWeek} Days/wk</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  value={calcDaysPerWeek}
                  onChange={(e) => setCalcDaysPerWeek(Number(e.target.value))}
                  className="w-full accent-[#006B70] cursor-pointer"
                />
              </div>

            </div>

            {/* Estimated Output (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-center space-y-4 shadow-md">
              <span className="text-[10px] font-bold font-mono uppercase tracking-widest text-[#5D7A7D] dark:text-[#B8D1D0]">
                Estimated Monthly Net Payout
              </span>
              
              <div className="text-3xl sm:text-4xl font-black text-[#006B70] dark:text-[#28D2CB] font-mono tracking-tight">
                {formatPrice(estimatedMonthlyRevenue)}
              </div>

              <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
                Based on 65% projected occupancy in {calcCity} with automated 10% platform fee deducted.
              </p>

              <button
                type="button"
                onClick={() => setIsListSpaceModalOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-md cursor-pointer transition-all active:scale-95"
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
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#006B70] dark:text-[#28D2CB]">
            Fast Onboarding
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How to Get Listed in 3 Simple Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#006B70] text-white font-mono font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="font-bold text-sm">Submit Space Details & Photos</h4>
            <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              Upload high-resolution images, describe amenities, specify seating capacity, and configure your hourly or daily rates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#006B70] text-white font-mono font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="font-bold text-sm">Fast Track Infrastructure Audit</h4>
            <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              Our team verifies generator changeover backup, speed-tests your fiber connection, and issues your OFIS Verified Badge.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#006B70] text-white font-mono font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="font-bold text-sm">Receive Bookings & Friday Payouts</h4>
            <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              Guests scan digital QR passes at check-in. Your revenue automatically accrues and pays out every Friday.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
