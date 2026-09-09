import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Download, 
  QrCode, 
  CheckCircle2, 
  Send, 
  Zap, 
  Wifi, 
  ShieldCheck, 
  Copy, 
  Check, 
  Apple, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DownloadAppModal: React.FC = () => {
  const { isDownloadAppModalOpen, setIsDownloadAppModalOpen, addNotification } = useApp();
  const [phoneNumberOrEmail, setPhoneNumberOrEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isDownloadAppModalOpen) return null;

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumberOrEmail.trim()) return;

    setIsSent(true);
    addNotification({
      title: 'Download Link Dispatched! 📲',
      message: `We've sent the OFIS Mobile download link to ${phoneNumberOrEmail}. Tap the link on your device to install.`,
      type: 'system',
      read: false
    });

    setTimeout(() => {
      setIsSent(false);
      setPhoneNumberOrEmail('');
    }, 4000);
  };

  const handleCopyInstallLink = () => {
    navigator.clipboard.writeText('https://ofis.ng/download');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-[#101827] rounded-3xl border border-[#E5E7EB] dark:border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E5E7EB] dark:border-[#1E293B] bg-gradient-to-r from-white to-[#F8FAFC] dark:from-[#101827] dark:to-[#172033]">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#0F766E]/15 dark:bg-[#0F766E]/15 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center border border-[#0F766E]/30 shadow-2xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">
                Download the OFIS App
              </h2>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                Get offline QR passes, real-time power alerts, and 1-tap bookings on the go
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDownloadAppModalOpen(false)}
            className="p-2 rounded-xl text-[#6B7280] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Main Grid: QR Scan + Download Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* Left Col: QR Code Card */}
            <div className="sm:col-span-5 p-5 rounded-2xl bg-[#F8FAFC] dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl inline-block shadow-sm border border-[#E5E7EB]">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://ofis.ng/download&bgcolor=ffffff&color=10B981" 
                  alt="Scan to download OFIS app"
                  className="w-36 h-36 mx-auto rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center justify-center space-x-1">
                  <QrCode className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                  <span>Scan with Phone Camera</span>
                </p>
                <p className="text-[11px] text-[#6B7280] dark:text-[#94A3B8]">
                  Point your iOS or Android camera at the QR code to open instant install
                </p>
              </div>
            </div>

            {/* Right Col: Store Badges & Direct Links */}
            <div className="sm:col-span-7 space-y-3">
              
              {/* Apple App Store */}
              <a
                href="#download-ios"
                onClick={(e) => {
                  e.preventDefault();
                  addNotification({
                    title: 'Redirecting to Apple App Store',
                    message: 'OFIS iOS build is available on TestFlight and App Store Preview.',
                    type: 'system',
                    read: false
                  });
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111827] dark:bg-[#1E293B] hover:bg-black dark:hover:bg-[#253348] text-white border border-[#374151] transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <Apple className="w-6 h-6 fill-white" />
                  <div className="text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">Download on the</p>
                    <p className="text-sm font-bold text-white leading-tight">Apple App Store</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>

              {/* Google Play Store */}
              <a
                href="#download-android"
                onClick={(e) => {
                  e.preventDefault();
                  addNotification({
                    title: 'Redirecting to Google Play Store',
                    message: 'OFIS Android build is available on Google Play and Early Access.',
                    type: 'system',
                    read: false
                  });
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#111827] dark:bg-[#1E293B] hover:bg-black dark:hover:bg-[#253348] text-white border border-[#374151] transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center text-teal-500 font-black text-sm">
                    ▶
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400">GET IT ON</p>
                    <p className="text-sm font-bold text-white leading-tight">Google Play</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>

              {/* Direct APK & PWA */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    addNotification({
                      title: 'Downloading APK package',
                      message: 'OFIS_v2.4.0_Production.apk has started downloading.',
                      type: 'system',
                      read: false
                    });
                  }}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] hover:border-[#0F766E] text-[#111827] dark:text-[#F8FAFC] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />
                  <span>Direct APK</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyInstallLink}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] hover:border-[#0F766E] text-[#111827] dark:text-[#F8FAFC] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" /> : <Copy className="w-3.5 h-3.5 text-[#0F766E] dark:text-[#14B8A6]" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* SMS / Email Download Dispatcher */}
          <div className="p-4 rounded-2xl bg-[#F1F5F9] dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] space-y-3">
            <h3 className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">
              Send Download Link to Your Mobile Phone
            </h3>
            <form onSubmit={handleSendLink} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter your phone (+234...) or email address"
                value={phoneNumberOrEmail}
                onChange={(e) => setPhoneNumberOrEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0B1220] border border-[#CBD5E1] dark:border-[#334155] text-xs text-[#111827] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] focus:border-[#0F766E] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#14B8A6] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
              >
                {isSent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isSent ? 'Link Dispatched!' : 'Send Link'}</span>
              </button>
            </form>
          </div>

          {/* Mobile Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-[#0F766E]/15 dark:bg-[#0F766E]/15 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center mx-auto text-xs">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#111827] dark:text-[#F8FAFC]">Offline QR Pass</h4>
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">Scan turnstiles even without internet reception</p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-[#0F766E]/15 dark:bg-[#0F766E]/15 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center mx-auto text-xs">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#111827] dark:text-[#F8FAFC]">Power Telemetry</h4>
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">Get push notifications when solar/gens switch</p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-[#0F766E]/15 dark:bg-[#0F766E]/15 text-[#0F766E] dark:text-[#14B8A6] flex items-center justify-center mx-auto text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#111827] dark:text-[#F8FAFC]">Instant Desk Hold</h4>
              <p className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">Reserve seats nearby within 3 taps on mobile</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
