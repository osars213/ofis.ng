import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, Sparkles, Send } from 'lucide-react';
import { getSupabaseClient } from '../../services/supabaseClient';

interface EarlyAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultInterest?: 'Early Access' | 'Space Operator' | 'Strategic Partnership' | 'Investment' | 'Other';
  title?: string;
  subtitle?: string;
}

export const EarlyAccessModal: React.FC<EarlyAccessModalProps> = ({
  isOpen,
  onClose,
  defaultInterest = 'Early Access',
  title = 'Join Early Access',
  subtitle = 'Be first to book spaces and get priority access as we launch across Africa.',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [interest, setInterest] = useState(defaultInterest);
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
      const client = getSupabaseClient();
      if (!client) {
        throw new Error('Supabase client unavailable. Please contact hello@ofis.ng directly.');
      }

      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const payload = {
        name: name.trim() || 'Early User',
        email: email.trim().toLowerCase(),
        interest,
        message: message.trim() || 'Early access request',
        source: 'golden_rule_prelaunch',
        landing_path: typeof window !== 'undefined' ? window.location.pathname : '/',
        utm_source: params?.get('utm_source') || null,
        utm_medium: params?.get('utm_medium') || null,
        utm_campaign: params?.get('utm_campaign') || null,
      };

      const { error: insertError } = await client.from('leads').insert([payload]);
      if (insertError) throw new Error(insertError.message);

      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error('Lead capture error:', err);
      setStatus('error');
      setErrorMsg(err?.message || 'Unable to submit right now. Please email hello@ofis.ng.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#111827] border border-[#1F2937] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden text-[#F9FAFB]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-[#10B981]/15 blur-3xl pointer-events-none" />

        {/* Close Button */}
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
            <h3 className="text-xl font-bold mb-2">You&apos;re on the list</h3>
            <p className="text-sm text-[#94A3B8] mb-6">
              Thank you! We&apos;ve reserved your priority spot and will reach out with early access keys.
            </p>
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
                <Sparkles className="w-3 h-3" />
                <span>Priority Access</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">{title}</h3>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">{subtitle}</p>
            </div>

            {status === 'error' && errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
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

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                  I am a...
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030712] border border-[#1F2937] text-sm text-[#F9FAFB] focus:outline-none focus:border-[#10B981]"
                >
                  <option value="Early Access">Remote Professional / Individual</option>
                  <option value="Strategic Partnership">Company / Team Lead</option>
                  <option value="Space Operator">Space Operator / Host</option>
                  <option value="Other">Creator / Producer</option>
                  <option value="Investment">Investor / Partner</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] mb-1">
                  Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="City, space type or inquiry..."
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span>Join Early Access</span>
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
