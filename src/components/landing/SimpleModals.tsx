import React from 'react';
import { X, Mail, MapPin, Sparkles, Building2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreClick?: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onExploreClick }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-[#0B1F33] border border-[#1E3A4D] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(7,21,33,0.9)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#071521] border border-[#1E3A4D] hover:border-[#14B8A6] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#0F766E]/20 border border-[#0F766E]/50 text-[11px] font-bold text-[#14B8A6] uppercase tracking-wider mb-3">
          <Sparkles className="w-3 h-3 text-[#F4A261]" />
          <span>About OFIS</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4 text-white">
          Nigeria&apos;s Physical Space Network
        </h3>

        <div className="space-y-3 text-sm sm:text-base text-[#94A3B8] leading-relaxed">
          <p>
            OFIS unifies fragmented workspaces, meeting suites, executive offices, and creative studios into one trusted, instant booking network.
          </p>
          <p>
            Every space in our network is audited for guaranteed power uptime, high-speed fiber internet, and seamless access—so you can focus entirely on doing your best work.
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-[#1E3A4D] flex items-center justify-between">
          <span className="text-xs text-[#94A3B8]">Headquartered in Lagos, Nigeria</span>
          <button
            onClick={() => {
              onClose();
              if (onExploreClick) onExploreClick();
            }}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#14B8A6] hover:text-[#0D655E] transition-colors"
          >
            <span>Explore Spaces</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-md bg-[#0B1F33] border border-[#1E3A4D] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(7,21,33,0.9)] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#071521] border border-[#1E3A4D] hover:border-[#14B8A6] flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#0F766E]/20 border border-[#0F766E]/50 text-[11px] font-bold text-[#14B8A6] uppercase tracking-wider mb-3">
          <Mail className="w-3 h-3 text-[#F4A261]" />
          <span>Get in Touch</span>
        </div>

        <h3 className="text-2xl font-extrabold tracking-tight mb-2 text-white">
          Contact Us
        </h3>

        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-6">
          Have questions, partner inquiries, or need enterprise space allocation? Reach our team directly.
        </p>

        <div className="space-y-3 mb-6">
          <a
            href="mailto:hello@ofis.ng"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-[#071521] border border-[#1E3A4D] hover:border-[#14B8A6]/50 text-sm font-semibold transition-all group text-white"
          >
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-[#14B8A6]" />
              <span>hello@ofis.ng</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#14B8A6] group-hover:translate-x-1 transition-all" />
          </a>

          <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-[#071521] border border-[#1E3A4D] text-sm text-[#94A3B8]">
            <MapPin className="w-4 h-4 text-[#14B8A6] shrink-0" />
            <span>Victoria Island, Lagos, Nigeria</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-[#071521] hover:bg-[#1E3A4D] text-white font-semibold text-xs border border-[#1E3A4D] transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
