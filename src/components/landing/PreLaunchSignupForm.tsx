import React, { useState } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, Loader2, ShieldCheck, Mail, User, Phone, MessageSquare } from 'lucide-react';
import { submitPrelaunchLead, PrelaunchLeadInput } from '../../services/leadService';
import { SUPABASE_URL } from '../../services/supabaseClient';

interface PreLaunchSignupFormProps {
  variant?: 'card' | 'inline' | 'hero';
  onSuccess?: () => void;
  className?: string;
}

export const PreLaunchSignupForm: React.FC<PreLaunchSignupFormProps> = ({
  variant = 'card',
  onSuccess,
  className = '',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interest, setInterest] = useState('Remote Professional');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorHint, setErrorHint] = useState<string | null>(null);
  const [submittedPayload, setSubmittedPayload] = useState<{ name: string; email: string; interest: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setErrorHint(null);

    if (!name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!message.trim()) {
      setErrorMessage('Please let us know what you are looking for.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    const leadInput: PrelaunchLeadInput = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      interest,
      message: message.trim(),
    };

    try {
      const result = await submitPrelaunchLead(leadInput);

      if (!result.success) {
        setStatus('error');
        setErrorMessage(result.error || 'Failed to submit prelaunch signup.');
        setErrorHint(result.hint || null);
        return;
      }

      setSubmittedPayload({
        name: leadInput.name,
        email: leadInput.email,
        interest: leadInput.interest || '',
        message: leadInput.message || '',
      });
      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('[PreLaunchSignupForm] Submission exception:', err);
      setStatus('error');
      setErrorMessage(err?.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="prelaunch-signup"
      className={`relative rounded-3xl bg-[#141210]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.08)] overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Decorative Emerald Glow */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#10B981]/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#34D399]/10 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#34D399] uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-Launch Signup • Phase 1</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FAF8F5] tracking-tight">
            Reserve Your Priority Access
          </h2>
          <p className="text-sm text-[#A8A29E] mt-2 leading-relaxed max-w-xl">
            Join founders, creators, and teams across Lagos, Abuja, and Port Harcourt getting early bookings and launch credits on OFIS.
          </p>
        </div>

        {/* Success State */}
        {status === 'success' ? (
          <div className="py-8 text-center sm:text-left">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] mb-5">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-[#FAF8F5] mb-2">
              You&apos;re On The Priority List!
            </h3>
            <p className="text-sm text-[#A8A29E] leading-relaxed mb-6 max-w-lg">
              Your details were recorded in the OFIS Supabase database. We will notify you the moment your preferred location goes live.
            </p>

            {/* Submitted Payload Confirmation Inspector */}
            {submittedPayload && (
              <div className="mb-6 p-4 rounded-2xl bg-[#0C0B0A] border border-white/10 text-left">
                <div className="flex items-center justify-between text-xs text-[#A8A29E] mb-2 pb-2 border-b border-white/5 font-mono">
                  <span>Supabase Table: <strong className="text-[#34D399]">public.leads</strong></span>
                  <span className="text-emerald-400 font-semibold">Row Inserted (Anon Role)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[#A8A29E] block mb-0.5">name:</span>
                    <span className="text-[#FAF8F5]">{submittedPayload.name}</span>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block mb-0.5">email:</span>
                    <span className="text-[#FAF8F5]">{submittedPayload.email}</span>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block mb-0.5">interest:</span>
                    <span className="text-[#FAF8F5]">{submittedPayload.interest}</span>
                  </div>
                  <div>
                    <span className="text-[#A8A29E] block mb-0.5">source:</span>
                    <span className="text-emerald-400">prelaunch</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[#A8A29E] block mb-0.5">message:</span>
                    <span className="text-[#FAF8F5] break-words">{submittedPayload.message}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                setStatus('idle');
                setSubmittedPayload(null);
              }}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-[#FAF8F5] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Submit Another Response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Error banner */}
            {status === 'error' && errorMessage && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-xs sm:text-sm space-y-1">
                <div className="flex items-center space-x-2 font-semibold">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                {errorHint && (
                  <p className="text-xs text-red-300/90 pl-6 font-mono leading-relaxed">
                    {errorHint}
                  </p>
                )}
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Full Name <span className="text-[#10B981]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Babatunde Adeyemi"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0C0B0A] border border-[#292724] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm text-[#FAF8F5] placeholder-[#78716C] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Email Address <span className="text-[#10B981]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="babatunde@company.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0C0B0A] border border-[#292724] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm text-[#FAF8F5] placeholder-[#78716C] outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone / WhatsApp */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Phone / WhatsApp <span className="text-[#78716C] font-normal lowercase">(optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#78716C]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+234 802 345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0C0B0A] border border-[#292724] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm text-[#FAF8F5] placeholder-[#78716C] outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Primary Workspace Need */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1.5">
                  Primary Workspace Need
                </label>
                <select
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl bg-[#0C0B0A] border border-[#292724] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm text-[#FAF8F5] outline-none transition-colors cursor-pointer"
                >
                  <option value="Hot Desk & Coworking">Hot Desk &amp; Coworking</option>
                  <option value="Private Office / Team Suite">Private Office / Team Suite</option>
                  <option value="Boardroom & Meeting Space">Boardroom &amp; Meeting Space</option>
                  <option value="Podcast & Production Studio">Podcast &amp; Production Studio</option>
                  <option value="Space Operator / Venue Host">Space Operator / Venue Host</option>
                  <option value="Strategic Partnership / Investor">Strategic Partnership / Investor</option>
                </select>
              </div>
            </div>

            {/* Message / Requirements */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-1.5">
                What are you looking for? <span className="text-[#10B981]">*</span>
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 pointer-events-none text-[#78716C]">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Need a 10-person private suite in Victoria Island with high-speed fiber from November."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl bg-[#0C0B0A] border border-[#292724] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm text-[#FAF8F5] placeholder-[#78716C] outline-none transition-colors resize-none"
                />
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center space-x-2 text-xs text-[#78716C] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Submits directly to <strong>public.leads</strong> (anon role)</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-b from-[#34D399] via-[#10B981] to-[#059669] hover:from-[#10B981] hover:to-[#047857] text-[#0C0B0A] font-extrabold text-sm sm:text-base shadow-[0_4px_25px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting to Supabase...</span>
                </>
              ) : (
                <>
                  <span>Join Pre-Launch &amp; Claim Priority Access</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
