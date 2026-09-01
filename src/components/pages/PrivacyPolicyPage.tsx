import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-[#E5E7EB] dark:border-[#1E293B]">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D1FAE5] dark:bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#10B981]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NDPR & International Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • OFIS Technologies Ltd.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">1. Introduction & Scope</h2>
            <p>
              OFIS Technologies Ltd (&ldquo;OFIS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates a physical space discovery and booking platform accessible via web and mobile interfaces. We are committed to protecting the privacy of our guests, hosts, and platform visitors in full compliance with the Nigeria Data Protection Act (NDPA), Nigeria Data Protection Regulation (NDPR), and applicable global data privacy frameworks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Identification Data:</strong> Full name, verified email address, phone number, company name, and optional avatar image.</li>
              <li><strong>Reservation & Digital Pass Data:</strong> Booking dates, timestamps, space categories, guest seat numbers, and entrance turnstile QR scan logs.</li>
              <li><strong>Financial & Transactional Records:</strong> Payment gateway tokens, transaction references via Paystack and Flutterwave, invoice line items, and host payout bank account numbers (NUBAN).</li>
              <li><strong>Geolocation & Telemetry Data:</strong> General IP location (to calculate estimated travel distance and local currency display) and IoT power telemetry logs provided by partner venues.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">3. How We Use Your Information</h2>
            <p>
              We process personal information solely for legitimate operational purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Facilitating workspace reservations and issuing instantaneous turnstile QR passes.</li>
              <li>Validating host identities, power infrastructure compliance, and processing weekly host payouts.</li>
              <li>Sending transactional booking confirmations, 30-minute check-in reminders, and receipts.</li>
              <li>Maintaining platform security, fraud prevention, and regulatory compliance.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">4. Data Protection & Security</h2>
            <p>
              All user communications and database transactions are encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We never store raw debit card numbers or bank authorization PINs; all payment processing is handled by PCI-DSS Level 1 certified partners (Paystack & Flutterwave).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">5. Your Rights Under NDPA / NDPR</h2>
            <p>
              As a user of OFIS, you retain the right to request access to your personal data, request correction of inaccurate records, object to marketing communications, or request complete account erasure by contacting our Data Protection Officer at <strong>privacy@ofis.ng</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
