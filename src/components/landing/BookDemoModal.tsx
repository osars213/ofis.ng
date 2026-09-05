import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Calendar, Sparkles, Send } from 'lucide-react';
import { submitPrelaunchLead } from '../../services/leadService';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTrack?: 'enterprise' | 'operator' | 'investor' | 'partner';
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  defaultTrack = 'enterprise',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [track, setTrack] = useState(defaultTrack);
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      await submitPrelaunchLead({
        name: name.trim() || 'Demo Lead',
        email: email.trim().toLowerCase(),
        interest: `Demo: ${track.toUpperCase()} (${organization.trim() || 'Independent'})`,
        message: `Preferred Time: ${preferredTime.trim() || 'Flexible'} | Notes: ${message.trim() || 'Requested live platform demonstration'}`,
        format: 'json',
      });

      setStatus('success');
      setName('');
      setEmail('');
      setOrganization('');
      setPreferredTime('');
      setMessage('');
    } catch (err: any) {
      console.error('Demo booking error:', err);
      setStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-lg bg-[#111827] border border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden text-[#F9FAFB]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-[#10B981]/15 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#1F2937]/80 hover:bg-[#1F2937] flex items-center justify-center text-[#94A3B8] hover:text-[#F9FAFB] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Demo Request Received</h3>
            <p className="text-sm text-[#94A3B8] mb-6 leading-relaxed">
              Thank you! Our founding team will reach out within 2 hours to confirm your preferred time and provide direct access keys.
            </p>
            <div className="p-3.5 rounded-xl bg-[#030712] border border-[#1F2937] text-xs text-[#94A3B8] mb-6">
              Need immediate assistance? Email us directly at <a href="mailto:partners@ofis.ng" className="text-[#34D399] font-medium hover:underline">partners@ofis.ng</a>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-[#10B981] text-[#030712] font-semibold text-sm hover:bg-[#34D399] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[11px] font-bold text-[#34D399] uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Live 1-on-1 Walkthrough</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">Book a Demo</h3>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                See how OFIS powers decentralized teams, workspace yields, and seamless instant booking.
              </p>
            </div>

            {status === 'error' && errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Full Name <span className="text-[#10B981]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Adeyemi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#1F2937] text-sm text-[#F9FAFB] placeholder-[#94A3B8]/40 focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Work Email <span className="text-[#10B981]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#1F2937] text-sm text-[#F9FAFB] placeholder-[#94A3B8]/40 focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Tech, Ventures Hub"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#1F2937] text-sm text-[#F9FAFB] placeholder-[#94A3B8]/40 focus:outline-none focus:border-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                    I am representing...
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#1F2937] text-sm text-[#F9FAFB] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="enterprise">Enterprise / Team Lead</option>
                    <option value="operator">Workspace Operator / Host</option>
                    <option value="investor">Institutional / Angel Investor</option>
                    <option value="partner">Strategic Real Estate Partner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Preferred Time / Timezone
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tomorrow afternoon (WAT / GMT+1)"
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#1F2937] text-sm text-[#F9FAFB] placeholder-[#94A3B8]/40 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Specific Requirements or Questions (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15-person desk package in Lagos or listing 3 locations"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#1F2937] text-sm text-[#F9FAFB] placeholder-[#94A3B8]/40 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#030712] font-bold text-sm shadow-[0_4px_16px_rgba(16,185,129,0.3)] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm Demo Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
