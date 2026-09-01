import React from 'react';
import { FileText, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const TermsOfServicePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-[#E5E7EB] dark:border-[#1E293B]">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#D1FAE5] dark:bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#10B981]">
            <FileText className="w-3.5 h-3.5" />
            <span>Marketplace Operating Terms</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Terms of Service</h1>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
            Effective Date: January 1, 2024 • OFIS Technologies Ltd.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-xs sm:text-sm text-[#4B5563] dark:text-[#CBD5E1] leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">1. Acceptance of Terms</h2>
            <p>
              By accessing, browsing, or creating an account on OFIS, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue using our services immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">2. Guest Code of Conduct & Space Usage</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Physical Decorum:</strong> Guests must maintain respectful workplace conduct, observe designated quiet zones, and follow all host venue safety regulations.</li>
              <li><strong>Digital Pass Access:</strong> Turnstile QR passes are personal and non-transferable unless booked specifically under an enterprise team multi-seat license.</li>
              <li><strong>Prohibited Activities:</strong> Utilizing workspace network bandwidth for unlawful cyber activities, network sniffing, torrenting, or commercial broadcasting without prior written venue authorization is strictly prohibited.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">3. Host Obligations & Infrastructure Standards</h2>
            <p>
              Hosts listing workspaces on OFIS agree to uphold our high-performance infrastructure standards:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Maintaining uninterrupted electricity through dual generator and solar inverter automatic changeover systems.</li>
              <li>Providing clean, air-conditioned facilities and high-speed fiber internet matching the listing specifications.</li>
              <li>Honoring confirmed reservations without unexpected cancellations or price surcharges.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">4. Cancellations, Rescheduling & Refunds</h2>
            <p>
              Guests may cancel reservations up to two (2) hours prior to the scheduled reservation start time for a 100% full refund credited immediately to their OFIS wallet or original payment source. Cancellations made within two hours of scheduled start time are subject to a 50% late-cancellation fee to compensate the host for reserved inventory.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">5. Limitation of Liability</h2>
            <p>
              OFIS serves as a marketplace facilitator connecting guests and commercial space providers. While we rigorously audit partner venues, OFIS Technologies Ltd shall not be liable for incidental property loss, personal injury, or external third-party telecommunication disruptions beyond reasonable commercial control.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
