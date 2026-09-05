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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150">
      
      {/* Hero Header */}
      <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] dark:border-[#1E293B] bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D1FAE5] dark:bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#047857] dark:text-[#10B981]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powering African Remote Work & Creators</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111827] dark:text-[#F8FAFC]">
            Making Physical Space Accessible, Reliable, and Instant.
          </h1>

          <p className="text-base sm:text-lg text-[#374151] dark:text-[#94A3B8] leading-relaxed">
            OFIS is Nigeria&apos;s physical-space marketplace connecting software engineers, founders, creators, and corporate teams with vetted workspaces equipped with 100% guaranteed power and enterprise fiber.
          </p>
        </div>
      </section>

      {/* Core Mission & Story */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#047857] dark:text-[#10B981]">Our Genesis</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">The Infrastructure Challenge We Solved</h2>
            <p className="text-sm text-[#374151] dark:text-[#94A3B8] leading-relaxed">
              Across Lagos, Abuja, and Port Harcourt, African tech professionals and remote talent faced a persistent barrier: unpredictable electricity grids, intermittent internet, and long 2-year commercial lease lock-ins with high agency fees.
            </p>
            <p className="text-sm text-[#374151] dark:text-[#94A3B8] leading-relaxed">
              OFIS built an automated marketplace that audits physical space infrastructure, guarantees 0.00ms automated generator/solar switchover, speed-tests enterprise fiber connections, and enables digital turnstile QR mobile passes for instant hourly or daily access.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-lg space-y-6">
            <h3 className="text-lg font-bold">The OFIS Infrastructure Pledge</h3>
            <ul className="space-y-3.5 text-xs text-[#374151] dark:text-[#CBD5E1]">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-[#10B981] shrink-0 mt-0.5" />
                <span><strong>100% Guaranteed Power:</strong> Automated dual-diesel + pure-sine solar backup.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-[#10B981] shrink-0 mt-0.5" />
                <span><strong>50 - 300 Mbps Fiber:</strong> Starlink & enterprise fiber lines verified on site.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-[#10B981] shrink-0 mt-0.5" />
                <span><strong>15s Mobile Turnstile Check-in:</strong> Real-time QR access with instant WiFi credentials.</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-4 h-4 text-[#047857] dark:text-[#10B981] shrink-0 mt-0.5" />
                <span><strong>Vetted Hosts & Safe Spaces:</strong> Strict security audits and verified reviews.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Operating Hubs in Nigeria */}
        <div className="space-y-8 pt-8 border-t border-[#E5E7EB] dark:border-[#1E293B]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#047857] dark:text-[#10B981]">Physical Presence</span>
            <h2 className="text-2xl font-extrabold">Operating Across Major Commercial Corridors</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#047857] dark:text-[#10B981] mx-auto" />
              <h3 className="font-bold text-sm">Lagos State</h3>
              <p className="text-xs text-[#374151] dark:text-[#94A3B8]">VI, Lekki Phase 1, Ikoyi, Ikeja GRA, Yaba Hub</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#047857] dark:text-[#10B981] mx-auto" />
              <h3 className="font-bold text-sm">Abuja (FCT)</h3>
              <p className="text-xs text-[#374151] dark:text-[#94A3B8]">Maitama, CBD, Wuse II, Jabi Lake</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#047857] dark:text-[#10B981] mx-auto" />
              <h3 className="font-bold text-sm">Port Harcourt</h3>
              <p className="text-xs text-[#374151] dark:text-[#94A3B8]">Old GRA, Peter Odili, Trans-Amadi</p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-2">
              <Building2 className="w-8 h-8 text-[#047857] dark:text-[#10B981] mx-auto" />
              <h3 className="font-bold text-sm">Ibadan</h3>
              <p className="text-xs text-[#374151] dark:text-[#94A3B8]">Bodija, Ring Road, Samonda Tech Park</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#172033] border border-[#1E293B] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-xl font-bold">Ready to experience OFIS?</h2>
            <p className="text-xs text-[#94A3B8]">Find focus desks, boardrooms, and creator studios near you today.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentView('explore');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Explore Spaces
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('become_host');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-5 py-3 rounded-2xl bg-[#1F2937] hover:bg-[#374151] text-white text-xs font-bold cursor-pointer transition-all border border-[#374151]"
            >
              Become a Host
            </button>
          </div>
        </div>

      </section>

    </div>
  );
};
