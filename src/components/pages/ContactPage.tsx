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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150">
      
      {/* Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] dark:border-[#1E293B] text-center bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold font-mono uppercase tracking-widest text-[#10B981]">
            We&apos;re Here to Help
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact OFIS Support</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
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
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] leading-relaxed">
                Connect with our concierge operations desk for instant assistance with check-in turnstile passes, host onboarding, or group corporate billing.
              </p>
            </div>

            <div className="space-y-6 text-xs">
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm">
                <Mail className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Email Support</h4>
                  <p className="text-[#6B7280] dark:text-[#94A3B8]">support@ofis.ng • hello@ofis.ng</p>
                  <p className="text-[11px] text-[#10B981] font-medium">Average response time: &lt; 2 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm">
                <Phone className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Phone & WhatsApp Hotline</h4>
                  <p className="text-[#6B7280] dark:text-[#94A3B8]">+234 (0) 802 345 6789</p>
                  <p className="text-[#6B7280] dark:text-[#94A3B8]">+234 (0) 1 456 7890</p>
                  <p className="text-[11px] text-[#10B981] font-medium">Monday – Saturday: 7:00 AM – 9:00 PM WAT</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-sm">
                <MapPin className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC]">Headquarters & Hubs</h4>
                  <p className="text-[#6B7280] dark:text-[#94A3B8]">
                    <strong>Lagos:</strong> 14B Bishop Anyogu Street, Victoria Island, Lagos, Nigeria
                  </p>
                  <p className="text-[#6B7280] dark:text-[#94A3B8]">
                    <strong>Abuja:</strong> 22 Aguiyi Ironsi Way, Maitama, Abuja (FCT)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Form (7 cols) */}
          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] shadow-xl space-y-6">
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold">Send us a Message</h3>
                <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">Fill in your details below and our team will get back to you promptly.</p>
              </div>

              {isSent ? (
                <div className="p-8 rounded-2xl bg-[#D1FAE5] dark:bg-[#10B981]/15 border border-[#10B981]/30 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">Message Sent!</h4>
                    <p className="text-xs text-[#4B5563] dark:text-[#94A3B8]">
                      Thank you for reaching out. We have logged your request and an OFIS specialist will reply via email shortly.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                    }}
                    className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] block">Your Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Babatunde Adeyemi"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] text-xs focus:outline-none focus:border-[#10B981]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] block">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. tunde@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] text-xs focus:outline-none focus:border-[#10B981]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] block">Phone Number (Optional)</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+234 802 000 0000"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] text-xs focus:outline-none focus:border-[#10B981]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] block">Topic / Department</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] text-xs focus:outline-none focus:border-[#10B981] cursor-pointer"
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
                    <label className="text-xs font-bold text-[#4B5563] dark:text-[#94A3B8] block">Your Message</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Describe how we can assist you..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#101827] border border-[#E5E7EB] dark:border-[#1E293B] text-xs focus:outline-none focus:border-[#10B981] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-50"
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
