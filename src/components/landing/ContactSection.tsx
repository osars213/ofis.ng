import React, { useState } from 'react';
import { 
  Mail, 
  MapPin, 
  Copy, 
  Check, 
  Send, 
  CheckCircle2, 
  Loader2, 
  Building2,
  Share2
} from 'lucide-react';
import { getSupabaseClient } from '../../services/supabaseClient';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCopy = (address: string) => {
    navigator.clipboard?.writeText(address);
    setCopiedEmail(address);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    setStatus('idle');

    try {
      const client = getSupabaseClient();
      if (client) {
        await client.from('leads').insert([
          {
            name: name.trim() || 'Inquiry Contact',
            email: email.trim().toLowerCase(),
            interest: `Inquiry: ${inquiryType}`,
            message: message.trim() || 'Contact form inquiry',
            source: 'contact_section',
            landing_path: typeof window !== 'undefined' ? window.location.pathname : '/contact',
          }
        ]);
      }
      setStatus('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err) {
      console.error('Contact inquiry error:', err);
      setStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-18">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FAF8F5] tracking-tight mb-4">
          Contact Us
        </h2>
        <p className="text-base sm:text-lg text-[#A8A29E] leading-relaxed">
          We&apos;re here to answer questions about bookings, venue listings, team accounts, and investor relations.
        </p>
      </div>

      {/* Prominent 3-Card Email Directory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mb-12">
        
        {/* 1. General Card */}
        <div className="p-7 rounded-2xl bg-[#171615] border border-[#292724] hover:border-[#10B981]/50 transition-all flex flex-col justify-between group shadow-md">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#34D399] block mb-2">
              General Inquiries
            </span>
            <h4 className="text-xl font-bold text-[#FAF8F5] mb-2">Support & Help</h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed mb-6">
              For help with bookings, receipts, account questions, or general feedback.
            </p>
          </div>
          
          <div className="pt-4 border-t border-[#292724] flex items-center justify-between">
            <a 
              href="mailto:hello@ofis.ng" 
              className="text-base font-extrabold text-[#FAF8F5] group-hover:text-[#34D399] transition-colors"
            >
              hello@ofis.ng
            </a>
            <button
              type="button"
              onClick={() => handleCopy('hello@ofis.ng')}
              className="p-2.5 rounded-xl bg-[#0C0B0A] hover:bg-[#201E1C] text-[#A8A29E] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              title="Copy email address"
            >
              {copiedEmail === 'hello@ofis.ng' ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 2. Partnerships Card */}
        <div className="p-7 rounded-2xl bg-[#171615] border border-[#292724] hover:border-[#10B981]/50 transition-all flex flex-col justify-between group shadow-md">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#34D399] block mb-2">
              Partnerships
            </span>
            <h4 className="text-xl font-bold text-[#FAF8F5] mb-2">Venues & Team Accounts</h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed mb-6">
              For workspace owners, hotels, commercial landlords, and corporate team accounts.
            </p>
          </div>
          
          <div className="pt-4 border-t border-[#292724] flex items-center justify-between">
            <a 
              href="mailto:partners@ofis.ng" 
              className="text-base font-extrabold text-[#FAF8F5] group-hover:text-[#34D399] transition-colors"
            >
              partners@ofis.ng
            </a>
            <button
              type="button"
              onClick={() => handleCopy('partners@ofis.ng')}
              className="p-2.5 rounded-xl bg-[#0C0B0A] hover:bg-[#201E1C] text-[#A8A29E] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              title="Copy email address"
            >
              {copiedEmail === 'partners@ofis.ng' ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* 3. Investors Card */}
        <div className="p-7 rounded-2xl bg-[#171615] border border-[#292724] hover:border-[#10B981]/50 transition-all flex flex-col justify-between group shadow-md">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#34D399] block mb-2">
              Investors
            </span>
            <h4 className="text-xl font-bold text-[#FAF8F5] mb-2">Investment & Expansion</h4>
            <p className="text-xs text-[#A8A29E] leading-relaxed mb-6">
              For venture capital funds, angel investors, and confidential data room access.
            </p>
          </div>
          
          <div className="pt-4 border-t border-[#292724] flex items-center justify-between">
            <a 
              href="mailto:investors@ofis.ng" 
              className="text-base font-extrabold text-[#FAF8F5] group-hover:text-[#34D399] transition-colors"
            >
              investors@ofis.ng
            </a>
            <button
              type="button"
              onClick={() => handleCopy('investors@ofis.ng')}
              className="p-2.5 rounded-xl bg-[#0C0B0A] hover:bg-[#201E1C] text-[#A8A29E] hover:text-[#FAF8F5] transition-colors cursor-pointer"
              title="Copy email address"
            >
              {copiedEmail === 'investors@ofis.ng' ? <Check className="w-4 h-4 text-[#10B981]" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

      {/* Social Media & Fast Message Section */}
      <div className="rounded-2xl bg-[#171615] border border-[#292724] p-6 sm:p-10 shadow-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Location & Social Media Links */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center space-x-2 text-xs text-[#10B981] font-semibold">
              <Building2 className="w-4 h-4" />
              <span>Headquarters</span>
            </div>
            
            <h3 className="text-2xl font-bold text-[#FAF8F5]">Victoria Island, Lagos</h3>
            
            <div className="flex items-start space-x-3 text-sm text-[#A8A29E]">
              <MapPin className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
              <span>Victoria Island, Lagos State, Nigeria</span>
            </div>

            <p className="text-xs text-[#A8A29E] leading-relaxed">
              Operating hours: Mon – Sat, 7:00 AM – 9:00 PM WAT (GMT+1). Typical email response time is under 2 hours.
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#A8A29E] mb-3 flex items-center space-x-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Connect on Social</span>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* X / Twitter */}
                <a
                  href="https://x.com/ofis_ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OFIS on X (Twitter)"
                  className="w-10 h-10 rounded-xl bg-[#0C0B0A] border border-[#292724] hover:border-[#10B981] flex items-center justify-center text-[#A8A29E] hover:text-[#34D399] transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com/company/ofis-ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OFIS on LinkedIn"
                  className="w-10 h-10 rounded-xl bg-[#0C0B0A] border border-[#292724] hover:border-[#10B981] flex items-center justify-center text-[#A8A29E] hover:text-[#34D399] transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/ofis.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="OFIS on Instagram"
                  className="w-10 h-10 rounded-xl bg-[#0C0B0A] border border-[#292724] hover:border-[#10B981] flex items-center justify-center text-[#A8A29E] hover:text-[#34D399] transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Direct Message Form */}
          <div className="lg:col-span-7">
            {status === 'success' ? (
              <div className="p-6 rounded-2xl bg-[#0C0B0A] border border-[#10B981]/40 text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#10B981] mx-auto" />
                <h4 className="text-base font-bold text-[#FAF8F5]">Message Received</h4>
                <p className="text-xs text-[#A8A29E]">
                  Thank you. A member of our team will follow up via email shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-4 py-2 rounded-xl bg-[#201E1C] text-xs font-semibold text-[#FAF8F5] cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C0B0A] border border-[#292724] text-xs text-[#FAF8F5] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#10B981]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Work Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#0C0B0A] border border-[#292724] text-xs text-[#FAF8F5] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'general', label: 'General / Support' },
                    { id: 'partnerships', label: 'Host / Corporate Team' },
                    { id: 'investors', label: 'Investor Relations' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setInquiryType(item.id)}
                      className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors cursor-pointer text-center ${
                        inquiryType === item.id
                          ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399] font-bold'
                          : 'bg-[#0C0B0A] border-[#292724] text-[#A8A29E] hover:text-[#FAF8F5]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  required
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0C0B0A] border border-[#292724] text-xs text-[#FAF8F5] placeholder-[#A8A29E]/50 focus:outline-none focus:border-[#10B981]"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-gradient-to-b from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-[#0C0B0A] font-bold text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </section>
  );
};
