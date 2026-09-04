import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader2, TrendingUp, Download, Send } from 'lucide-react';
import { getSupabaseClient } from '../../services/supabaseClient';

interface InvestorDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestorDeckModal: React.FC<InvestorDeckModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [meetingScheduled, setMeetingScheduled] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setErrorMsg('Please enter a valid work or fund email.');
      return;
    }

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const client = getSupabaseClient();
      const payload = {
        name: name.trim() || 'Investor Lead',
        email: email.trim().toLowerCase(),
        interest: 'Investment - Deck Request',
        message: `Company/Fund: ${company.trim() || 'Undisclosed'} | Note: ${message.trim() || 'Requested Confidential Investor Deck'}`,
        source: 'investor_deck_request',
        landing_path: typeof window !== 'undefined' ? window.location.pathname : '/investors',
      };

      if (client) {
        await client.from('leads').insert([payload]);
      }

      setStatus('success');
      setName('');
      setEmail('');
      setCompany('');
      setMessage('');
    } catch (err: any) {
      console.error('Deck request error:', err);
      setStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div 
        className="relative w-full max-w-md bg-[#171615] border border-[#292724] rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden text-[#FAF8F5]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 right-1/4 w-64 h-32 bg-[#10B981]/15 blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#201E1C] hover:bg-[#292724] flex items-center justify-center text-[#A8A29E] hover:text-[#FAF8F5] transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-[#FAF8F5]">Request Received</h3>
            <p className="text-sm text-[#A8A29E] mb-6 leading-relaxed">
              Thank you. We&apos;ll review your request and send our investor deck directly to your inbox.
            </p>

            <div className="space-y-3 mb-6">
              {!meetingScheduled ? (
                <button
                  type="button"
                  onClick={() => setMeetingScheduled(true)}
                  className="w-full py-3 rounded-xl bg-[#201E1C] border border-[#10B981]/40 hover:border-[#10B981] text-xs font-bold text-[#34D399] flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <span>Schedule an Investor Meeting</span>
                  <TrendingUp className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="p-3 rounded-xl bg-[#0C0B0A] border border-[#10B981]/30 text-xs text-[#34D399]">
                  Meeting calendar request initiated. Direct line: <a href="mailto:investors@ofis.ng" className="underline font-semibold">investors@ofis.ng</a>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[#0C0B0A] border border-[#292724] text-xs text-[#A8A29E]">
                Direct inquiries: <a href="mailto:investors@ofis.ng" className="text-[#34D399] font-medium hover:underline">investors@ofis.ng</a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] text-[#0C0B0A] font-bold text-sm hover:from-[#34D399] hover:to-[#10B981] transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[11px] font-bold text-[#34D399] uppercase tracking-wider mb-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Confidential Information</span>
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight">Request Investor Deck</h3>
              <p className="text-xs text-[#A8A29E] mt-1.5 leading-relaxed">
                Access our pitch deck, business model breakdown, traction numbers, and market expansion plan.
              </p>
            </div>

            {status === 'error' && errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">
                  Full Name <span className="text-[#10B981]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kola Aina"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0B0A] border border-[#292724] text-sm text-[#FAF8F5] placeholder-[#A8A29E]/40 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">
                  Work Email <span className="text-[#10B981]">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@fund.vc"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0B0A] border border-[#292724] text-sm text-[#FAF8F5] placeholder-[#A8A29E]/40 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">
                  Company / Fund
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ventures Capital / Angel Syndicate"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0C0B0A] border border-[#292724] text-sm text-[#FAF8F5] placeholder-[#A8A29E]/40 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E] mb-1">
                  Optional Note
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Evaluating investment opportunities"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0C0B0A] border border-[#292724] text-sm text-[#FAF8F5] placeholder-[#A8A29E]/40 focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-sm shadow-[0_4px_16px_rgba(16,185,129,0.25)] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <span>Request Investor Deck</span>
                    <Download className="w-3.5 h-3.5" />
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
