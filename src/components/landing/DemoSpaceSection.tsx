import React, { useState } from 'react';
import { 
  MapPin, 
  Star, 
  ShieldCheck, 
  Wifi, 
  Zap, 
  Calendar, 
  Clock, 
  QrCode, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  RefreshCw,
  Sliders,
  Copy,
  Check
} from 'lucide-react';

interface DemoSpaceSectionProps {
  onExploreDemoSpace: () => void;
}

export const DemoSpaceSection: React.FC<DemoSpaceSectionProps> = ({ onExploreDemoSpace }) => {
  const [selectedPass, setSelectedPass] = useState<'day' | 'hourly'>('day');
  const [selectedDate, setSelectedDate] = useState('Today');
  const [guestCount, setGuestCount] = useState(1);
  const [showQrPreview, setShowQrPreview] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const price = selectedPass === 'day' ? 8500 * guestCount : 3500 * 2 * guestCount;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText('OFIS-DEMO-88219');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="demo-space" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative">
      
      {/* Ambient Radial Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#0F766E]/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#0F766E]/15 border border-[#0F766E]/30 text-xs font-bold text-[#14B8A6] uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#F4A261]" />
          <span>Interactive Prototype (POC)</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Try OFIS
        </h2>
        <p className="text-base sm:text-xl text-[#94A3B8] leading-relaxed">
          Experience a live booking from our demonstration workspace. Test the booking calculation, instant verification, and digital QR check-in.
        </p>
      </div>

      {/* Main Demo Workspace Container */}
      <div className="rounded-3xl bg-[#0B1F33]/90 border border-[#1E3A4D] overflow-hidden shadow-[0_25px_60px_rgba(7,21,33,0.8)] backdrop-blur-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left: Interactive Listing Visuals & Verified Badges (5 cols) */}
          <div className="lg:col-span-5 relative flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-b from-[#071521]/90 to-[#0B1F33] border-b lg:border-b-0 lg:border-r border-[#1E3A4D]">
            <div>
              {/* Space Photo with Badges */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-6 border border-[#1E3A4D] shadow-inner">
                <img 
                  src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop&q=80" 
                  alt="The Atrium Executive Suite"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071521]/80 via-[#071521]/20 to-transparent" />
                
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#071521]/90 border border-[#0F766E]/40 text-[11px] font-bold text-[#14B8A6]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>99.9% Power SLA</span>
                  </span>
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#071521]/90 border border-white/10 text-[11px] font-bold text-white">
                    <Wifi className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>320 Mbps Starlink</span>
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md font-mono text-[11px] text-[#14B8A6]">
                    ID: OFIS-LOS-001
                  </span>
                  <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[#F4A261] font-bold">
                    <Star className="w-3.5 h-3.5 fill-[#F4A261]" />
                    <span>4.98 (124 reviews)</span>
                  </div>
                </div>
              </div>

              {/* Title and Specs */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#14B8A6]">
                  Demo Workspace Listing
                </span>
                <h3 className="text-2xl font-extrabold text-white mt-1 mb-2">
                  The Atrium Penthouse Hub
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] flex items-center mb-4">
                  <MapPin className="w-4 h-4 mr-1 text-[#14B8A6] shrink-0" />
                  <span>Victoria Island, Lagos • 4 Adeyemo Alakija St</span>
                </p>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Dual hybrid solar grid backup, acoustic phone booths, Herman Miller ergonomic seating, and specialty pour-over espresso bar.
                </p>
              </div>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-[#1E3A4D] text-xs">
              <div className="p-3 rounded-xl bg-[#071521] border border-[#1E3A4D]">
                <span className="text-[#94A3B8] block text-[10px] uppercase font-semibold">Access Type</span>
                <span className="font-bold text-white">Smart QR Turnstile</span>
              </div>
              <div className="p-3 rounded-xl bg-[#071521] border border-[#1E3A4D]">
                <span className="text-[#94A3B8] block text-[10px] uppercase font-semibold">Instant Policy</span>
                <span className="font-bold text-[#14B8A6]">No Approval Delay</span>
              </div>
            </div>

          </div>

          {/* Right: Live Interactive Booking & QR Check-in Simulator (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#071521]/60">
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#1E3A4D] mb-6">
                <div>
                  <h4 className="text-lg font-bold text-white">Live Booking Simulator</h4>
                  <p className="text-xs text-[#94A3B8]">Test checkout calculation and live pass generation in real-time.</p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-[#14B8A6] font-semibold bg-[#0F766E]/15 px-3 py-1 rounded-full border border-[#0F766E]/30">
                  <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-ping" />
                  <span>Real-time POC</span>
                </div>
              </div>

              {/* Pass Type Selector */}
              <div className="space-y-4 mb-6">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Select Access Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => { setSelectedPass('day'); setShowQrPreview(false); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPass === 'day'
                        ? 'bg-[#0B1F33] border-[#14B8A6] text-white shadow-[0_0_20px_rgba(20,184,166,0.15)]'
                        : 'bg-[#071521] border-[#1E3A4D] text-[#94A3B8] hover:border-[#14B8A6]/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">Full Day Pass</span>
                      <span className="text-xs font-mono font-bold text-[#14B8A6]">₦8,500</span>
                    </div>
                    <span className="text-[11px] text-[#94A3B8] block">8:00 AM – 8:00 PM • Hot Desk</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setSelectedPass('hourly'); setShowQrPreview(false); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedPass === 'hourly'
                        ? 'bg-[#0B1F33] border-[#14B8A6] text-white shadow-[0_0_20px_rgba(20,184,166,0.15)]'
                        : 'bg-[#071521] border-[#1E3A4D] text-[#94A3B8] hover:border-[#14B8A6]/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">2-Hour Pod Pass</span>
                      <span className="text-xs font-mono font-bold text-[#14B8A6]">₦7,000</span>
                    </div>
                    <span className="text-[11px] text-[#94A3B8] block">Flexible Sprint Session</span>
                  </button>
                </div>
              </div>

              {/* Date & Guest Pickers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                    Live Calendar
                  </label>
                  <div className="flex items-center space-x-2">
                    {['Today', 'Tomorrow', 'This Friday'].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setSelectedDate(d)}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                          selectedDate === d
                            ? 'bg-[#0F766E] text-white border-[#0F766E] font-bold'
                            : 'bg-[#071521] border-[#1E3A4D] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1.5">
                    Number of Seats
                  </label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 4].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setGuestCount(cnt)}
                        className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                          guestCount === cnt
                            ? 'bg-[#0F766E] text-white border-[#0F766E] font-bold'
                            : 'bg-[#071521] border-[#1E3A4D] text-[#94A3B8] hover:text-white'
                        }`}
                      >
                        {cnt} {cnt === 1 ? 'Desk' : 'Desks'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Calculation Display */}
              <div className="p-4 rounded-2xl bg-[#071521] border border-[#1E3A4D] mb-6 space-y-2 text-xs">
                <div className="flex justify-between text-[#94A3B8]">
                  <span>Subtotal ({guestCount} {guestCount === 1 ? 'pass' : 'passes'} • {selectedDate})</span>
                  <span className="text-white font-mono">₦{price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#94A3B8]">
                  <span>OFIS Verified SLA Guarantee</span>
                  <span className="text-[#14B8A6]">Included (₦0)</span>
                </div>
                <div className="pt-2 border-t border-[#1E3A4D] flex justify-between items-baseline">
                  <span className="font-bold text-sm text-white">Total Payable</span>
                  <span className="font-extrabold text-lg text-[#14B8A6] font-mono">
                    ₦{price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* QR Code Check-in Simulator Preview */}
              {showQrPreview ? (
                <div className="p-4 rounded-2xl bg-[#0B1F33] border border-[#14B8A6]/50 mb-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Simulated High-Res QR */}
                    <div className="w-24 h-24 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                      <QrCode className="w-full h-full text-black" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <div className="flex items-center justify-center sm:justify-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-[#14B8A6]" />
                        <span className="text-xs font-bold text-white">Access Pass Validated</span>
                      </div>
                      <p className="text-xs text-[#94A3B8]">
                        Scan at turnstile scanner: <span className="font-mono text-white font-semibold">OFIS-DEMO-88219</span>
                      </p>
                      <div className="pt-2 flex items-center justify-center sm:justify-start space-x-3">
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="inline-flex items-center space-x-1 text-[11px] font-semibold text-[#14B8A6] hover:underline"
                        >
                          {copiedCode ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedCode ? 'Copied code!' : 'Copy pass code'}</span>
                        </button>
                        <span className="text-zinc-600">•</span>
                        <span className="text-[11px] text-[#94A3B8]">Valid for {selectedDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#1E3A4D] flex flex-col sm:flex-row items-center gap-3">
              {!showQrPreview ? (
                <button
                  type="button"
                  onClick={() => setShowQrPreview(true)}
                  className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-[#0B1F33] hover:bg-[#071521] border border-[#1E3A4D] hover:border-[#14B8A6]/50 text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <QrCode className="w-4 h-4 text-[#14B8A6]" />
                  <span>Preview QR Check-in</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowQrPreview(false)}
                  className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl bg-[#0B1F33] border border-[#1E3A4D] text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                >
                  Reset Simulator
                </button>
              )}

              <button
                type="button"
                onClick={onExploreDemoSpace}
                className="w-full sm:w-1/2 py-3.5 px-6 rounded-xl bg-[#0F766E] hover:bg-[#0D655E] text-white font-extrabold text-xs shadow-[0_4px_16px_rgba(15,118,110,0.35)] transition-all cursor-pointer flex items-center justify-center space-x-2 group"
              >
                <span>Explore Demo Space</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
