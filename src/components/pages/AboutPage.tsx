import React from 'react';
import { 
  Building2, 
  Zap, 
  Wifi, 
  ShieldCheck, 
  Users, 
  MapPin, 
  ArrowRight, 
  Globe2, 
  Award, 
  CheckCircle2,
  Sparkles,
  Heart
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AboutPage: React.FC = () => {
  const { setCurrentView, setIsListSpaceModalOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] transition-colors duration-150">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E2ECEB] dark:border-[#166D74] bg-gradient-to-b from-white via-[#FFF9F4] to-[#F1F6F5] dark:from-[#07383D] dark:via-[#0B4A50] dark:to-[#07383D] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/20 border border-[#006B70]/30 text-xs font-bold text-[#006B70] dark:text-[#28D2CB]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powering African Remote Work & Creators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#12383B] dark:text-[#FFFFFF]">
            Making Physical Space Accessible, Reliable, and Instant.
          </h1>

          <p className="text-base sm:text-lg text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
            OFIS is Nigeria&apos;s physical-space marketplace connecting software engineers, founders, creators, and corporate teams with vetted workspaces equipped with 100% guaranteed power and enterprise fiber.
          </p>
        </div>
      </section>

      {/* Core Mission & Story */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#006B70] dark:text-[#28D2CB]">Our Genesis</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">The Infrastructure Challenge We Solved</h2>
            <p className="text-sm text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              Across Lagos, Abuja, and Port Harcourt, African tech professionals and remote talent faced a persistent barrier: unpredictable electricity grids, intermittent internet, and long 2-year commercial lease lock-ins with high agency fees.
            </p>
            <p className="text-sm text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
              OFIS built an automated marketplace that audits physical space infrastructure, guarantees 0.00ms automated generator/solar switchover, speed-tests enterprise fiber connections, and enables digital turnstile QR mobile passes for instant hourly or daily access.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-lg space-y-6">
            <h3 className="text-lg font-bold">The OFIS Infrastructure Pledge</h3>
            <ul className="space-y-3.5 text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#006B70] dark:text-[#28D2CB] shrink-0 mt-0.5" />
                <span><strong className="text-[#12383B] dark:text-white">100% Guaranteed Power:</strong> Automated dual-diesel + pure-sine solar backup.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#006B70] dark:text-[#28D2CB] shrink-0 mt-0.5" />
                <span><strong className="text-[#12383B] dark:text-white">50 - 300 Mbps Fiber:</strong> Starlink & enterprise fiber lines verified on site.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#006B70] dark:text-[#28D2CB] shrink-0 mt-0.5" />
                <span><strong className="text-[#12383B] dark:text-white">15s Mobile Turnstile Check-in:</strong> Real-time QR access with instant WiFi credentials.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#006B70] dark:text-[#28D2CB] shrink-0 mt-0.5" />
                <span><strong className="text-[#12383B] dark:text-white">Vetted Hosts & Safe Spaces:</strong> Strict security audits and verified reviews.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Operating Hubs in Nigeria */}
        <div className="space-y-8 pt-8 border-t border-[#E2ECEB] dark:border-[#166D74]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#006B70] dark:text-[#28D2CB]">Physical Presence</span>
            <h2 className="text-2xl font-extrabold">Operating Across Major Commercial Corridors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
              <h3 className="font-bold text-sm">Lagos State</h3>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">VI, Lekki Phase 1, Ikoyi, Ikeja GRA, Yaba Hub</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
              <h3 className="font-bold text-sm">Abuja (FCT)</h3>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">Maitama, CBD, Wuse II, Jabi Lake</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
              <h3 className="font-bold text-sm">Port Harcourt</h3>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">Old GRA, Peter Odili, Trans-Amadi</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
              <h3 className="font-bold text-sm">Ibadan</h3>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">Bodija, Ring Road, Samonda Tech Park</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0B4A50] border border-[#166D74] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-xl font-bold">Ready to experience OFIS?</h2>
            <p className="text-xs text-[#B8D1D0]">Find focus desks, boardrooms, and creator studios near you today.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentView('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Explore Spaces
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('become_host');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-[#07383D] hover:bg-[#105A60] text-white text-xs font-bold cursor-pointer transition-all border border-[#166D74]"
            >
              Become a Host
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
