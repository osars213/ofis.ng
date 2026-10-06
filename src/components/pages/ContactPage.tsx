import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  MessageSquare,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ContactPage: React.FC = () => {
  const { addNotification } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.message) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
      addNotification({
        title: 'Message Sent Successfully 📩',
        message: 'Our support team in Lagos will respond to your inquiry within 2 hours.',
        type: 'system',
        read: false,
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] transition-colors duration-150">
      
      {/* Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E2ECEB] dark:border-[#166D74] text-center bg-gradient-to-b from-white via-[#FFF9F4] to-[#F1F6F5] dark:from-[#07383D] dark:via-[#0B4A50] dark:to-[#07383D]">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#006B70] dark:text-[#28D2CB]">
            We&apos;re Here to Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact OFIS Support</h1>
          <p className="text-sm text-[#5D7A7D] dark:text-[#B8D1D0]">
            Have a question about a booking, enterprise team passes, or hosting your workspace? Reach our dedicated operations team.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Direct Channels</h3>
              <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0] leading-relaxed">
                Connect with our team for assistance with reservations, turnstile entry passes, space host onboarding, or group corporate billing.
              </p>
            </div>

            <div className="space-y-6 text-xs">
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm">
                <Mail className="w-5 h-5 text-[#006B70] dark:text-[#28D2CB] shrink-0 mt-0.5" />
                <div className="space-y-1.5">
                  <h4 className="font-bold text-sm text-[#12383B] dark:text-[#FFFFFF]">Contact Channels</h4>
                  <p className="text-[#5D7A7D] dark:text-[#B8D1D0]">
                    <span className="font-semibold text-[#12383B] dark:text-white">General Inquiries: </span>
                    <a href="mailto:hello@ofis.ng" className="text-[#006B70] dark:text-[#28D2CB] hover:underline font-bold">
                      hello@ofis.ng
                    </a>
                  </p>
                  <p className="text-[#5D7A7D] dark:text-[#B8D1D0]">
                    <span className="font-semibold text-[#12383B] dark:text-white">Customer Support: </span>
                    <a href="mailto:support@ofis.ng" className="text-[#006B70] dark:text-[#28D2CB] hover:underline font-bold">
                      support@ofis.ng
                    </a>
                  </p>
                  <p className="text-[11px] text-[#006B70] dark:text-[#28D2CB] font-medium pt-1">Average response time: &lt; 2 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-sm">
                <Phone className="w-5 h-5 text-[#006B70] dark:text-[#28D2CB] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#12383B] dark:text-[#FFFFFF]">Support Hours</h4>
                  <p className="text-[#5D7A7D] dark:text-[#B8D1D0]">Monday – Sunday: 7:00 AM – 9:00 PM WAT</p>
                  <p className="text-[11px] text-[#006B70] dark:text-[#28D2CB] font-medium">Real-time turnstile verification & booking support</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#0B4A50] border border-[#E2ECEB] dark:border-[#166D74] shadow-xl space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Send us a Message</h3>
                <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">Fill in your details below and our team will get back to you promptly.</p>
              </div>

              {isSent ? (
                <div className="p-8 rounded-2xl bg-[#006B70]/15 dark:bg-[#006B70]/20 border border-[#006B70]/30 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#006B70] dark:text-[#28D2CB] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#12383B] dark:text-[#FFFFFF]">Message Sent!</h4>
                    <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">
                      Thank you for reaching out. We have logged your request and an OFIS specialist will reply via email shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#006B70] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#12383B] dark:text-[#B8D1D0] block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Babatunde Adeyemi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-xs text-[#12383B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#006B70]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#12383B] dark:text-[#B8D1D0] block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. tunde@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-xs text-[#12383B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#006B70]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#12383B] dark:text-[#B8D1D0] block">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 802 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-xs text-[#12383B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#006B70]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#12383B] dark:text-[#B8D1D0] block">Topic / Department</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-xs text-[#12383B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#006B70] cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Booking Support">Booking & QR Pass Support</option>
                        <option value="Host Listing">Host & Space Listing</option>
                        <option value="Corporate Passes">Corporate / Team Passes</option>
                        <option value="Payment & Refunds">Payment & Invoices</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#12383B] dark:text-[#B8D1D0] block">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe how we can assist you..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F1F6F5] dark:bg-[#07383D] border border-[#E2ECEB] dark:border-[#166D74] text-xs text-[#12383B] dark:text-[#FFFFFF] focus:outline-none focus:border-[#006B70] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#006B70] hover:bg-[#0EA8A2] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Message'}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
