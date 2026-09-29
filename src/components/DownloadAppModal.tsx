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
        className="relative w-full max-w-2xl bg-white dark:bg-[#07383D] rounded-3xl border border-[#E2ECEB] dark:border-[#166D74] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2ECEB] dark:border-[#166D74] bg-gradient-to-r from-white to-[#F1F6F5] dark:from-[#07383D] dark:to-[#0B4A50]">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center border border-[#006B70]/30 shadow-2xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#12383B] dark:text-[#FFFFFF]">
                Download the OFIS App
              </h2>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">
                Get offline QR passes, real-time power alerts, and 1-tap bookings on the go
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDownloadAppModalOpen(false)}
            className="p-2 rounded-xl text-[#5D7A7D] dark:text-[#B8D1D0] hover:text-[#12383B] dark:hover:text-[#FFFFFF] hover:bg-[#E2ECEB] dark:hover:bg-[#166D74] transition-colors cursor-pointer"
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
            <div className="sm:col-span-5 p-5 rounded-2xl bg-[#F1F6F5] dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] text-center space-y-3">
              <div className="p-3 bg-white rounded-2xl inline-block shadow-sm border border-[#E2ECEB]">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://ofis.ng/download&bgcolor=ffffff&color=006B70" 
                  alt="Scan to download OFIS app"
                  className="w-36 h-36 mx-auto rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-[#12383B] dark:text-[#FFFFFF] flex items-center justify-center space-x-1">
                  <QrCode className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                  <span>Scan with Phone Camera</span>
                </p>
                <p className="text-[11px] text-[#5D7A7D] dark:text-[#B8D1D0]">
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
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#07383D] dark:bg-[#0B4A50] hover:bg-[#006B70] dark:hover:bg-[#105A60] text-white border border-[#166D74] transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <Apple className="w-6 h-6 fill-white" />
                  <div className="text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#B8D1D0]">Download on the</p>
                    <p className="text-sm font-bold text-white leading-tight">Apple App Store</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#B8D1D0] group-hover:text-white transition-colors" />
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
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#07383D] dark:bg-[#0B4A50] hover:bg-[#006B70] dark:hover:bg-[#105A60] text-white border border-[#166D74] transition-all group cursor-pointer shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 flex items-center justify-center text-[#28D2CB] font-black text-sm">
                    ▶
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-[#B8D1D0]">GET IT ON</p>
                    <p className="text-sm font-bold text-white leading-tight">Google Play</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#B8D1D0] group-hover:text-white transition-colors" />
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
                  className="p-2.5 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] hover:border-[#006B70] text-[#12383B] dark:text-[#FFFFFF] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />
                  <span>Direct APK</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyInstallLink}
                  className="p-2.5 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] hover:border-[#006B70] text-[#12383B] dark:text-[#FFFFFF] text-xs font-bold flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" /> : <Copy className="w-3.5 h-3.5 text-[#006B70] dark:text-[#28D2CB]" />}
                  <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
                </button>
              </div>

            </div>

          </div>

          {/* SMS / Email Download Dispatcher */}
          <div className="p-4 rounded-2xl bg-[#F1F6F5] dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-3">
            <h3 className="text-xs font-bold text-[#12383B] dark:text-[#FFFFFF]">
              Send Download Link to Your Mobile Phone
            </h3>
            <form onSubmit={handleSendLink} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Enter your phone (+234...) or email address"
                value={phoneNumberOrEmail}
                onChange={(e) => setPhoneNumberOrEmail(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-xs text-[#12383B] dark:text-[#FFFFFF] placeholder:text-[#5D7A7D] dark:placeholder:text-[#B8D1D0] focus:border-[#006B70] focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#006B70] hover:bg-[#0EA8A2] text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
              >
                {isSent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isSent ? 'Link Dispatched!' : 'Send Link'}</span>
              </button>
            </form>
          </div>

          {/* Mobile Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center mx-auto text-xs">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#12383B] dark:text-[#FFFFFF]">Offline QR Pass</h4>
              <p className="text-[10px] text-[#5D7A7D] dark:text-[#B8D1D0]">Scan turnstiles even without internet reception</p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center mx-auto text-xs">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#12383B] dark:text-[#FFFFFF]">Power Telemetry</h4>
              <p className="text-[10px] text-[#5D7A7D] dark:text-[#B8D1D0]">Get push notifications when solar/gens switch</p>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] space-y-1 text-center">
              <div className="w-7 h-7 rounded-lg bg-[#006B70]/15 dark:bg-[#006B70]/20 text-[#006B70] dark:text-[#28D2CB] flex items-center justify-center mx-auto text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-[11px] font-bold text-[#12383B] dark:text-[#FFFFFF]">Instant Desk Hold</h4>
              <p className="text-[10px] text-[#5D7A7D] dark:text-[#B8D1D0]">Reserve seats nearby within 3 taps on mobile</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
