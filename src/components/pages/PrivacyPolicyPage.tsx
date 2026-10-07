import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F4] dark:bg-[#07383D] text-[#12383B] dark:text-[#FFFFFF] transition-colors duration-150 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-[#E2ECEB] dark:border-[#166D74]">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#006B70]/15 dark:bg-[#006B70]/15 border border-[#006B70]/30 text-xs font-bold text-[#006B70] dark:text-[#28D2CB]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NDPR & International Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#12383B] dark:text-[#FFFFFF]">Privacy Policy</h1>
          <p className="text-xs text-[#5D7A7D] dark:text-[#B8D1D0]">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • OFIS
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-[#2D4A4D] dark:text-[#D1E5E4] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#12383B] dark:text-[#FFFFFF]">1. Introduction & Scope</h2>
            <p>
              OFIS (&ldquo;OFIS&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates a physical space discovery and booking platform accessible via web and mobile interfaces. We are committed to protecting the privacy of our guests, hosts, and platform visitors in full compliance with the Nigeria Data Protection Act (NDPA), Nigeria Data Protection Regulation (NDPR), and applicable global data privacy frameworks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#12383B] dark:text-[#FFFFFF]">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Account Identification Data:</strong> Full name, verified email address, phone number, company name, and optional avatar image.</li>
              <li><strong>Reservation & Digital Pass Data:</strong> Booking dates, timestamps, space categories, guest seat numbers, and entrance turnstile QR scan logs.</li>
              <li><strong>Financial & Transactional Records:</strong> Payment gateway tokens, transaction references via Paystack and Flutterwave, invoice line items, and host payout bank account numbers (NUBAN).</li>
              <li><strong>Geolocation & Telemetry Data:</strong> General IP location (to calculate estimated travel distance and local currency display) and IoT power telemetry logs provided by partner venues.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#12383B] dark:text-[#FFFFFF]">3. How We Use Your Information</h2>
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
            <h2 className="text-lg font-bold text-[#12383B] dark:text-[#FFFFFF]">4. Data Protection & Security</h2>
            <p>
              All user communications and database transactions are encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We never store raw debit card numbers or bank authorization PINs; all payment processing is handled by PCI-DSS Level 1 certified partners (Paystack & Flutterwave).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#12383B] dark:text-[#FFFFFF]">5. Your Rights Under NDPA / NDPR</h2>
            <p>
              As a user of OFIS, you retain the right to request access to your personal data, request correction of inaccurate records, object to marketing communications, or request complete account erasure by contacting our Data Protection Officer at <strong>privacy@ofis.ng</strong>.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
