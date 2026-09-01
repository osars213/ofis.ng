import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  Users, 
  ShieldCheck, 
  Zap, 
  CreditCard,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_SECTIONS: { id: string; title: string; icon: any; faqs: FaqItem[] }[] = [
  {
    id: 'guests',
    title: 'For Guests & Remote Workers',
    icon: Users,
    faqs: [
      {
        question: 'Do I need a monthly contract to work at an OFIS partner space?',
        answer: 'No! OFIS is designed for complete flexibility. You can book a hot desk or meeting room for 1 hour, a full day, or purchase multi-day pass bundles without any security deposit or long-term lease.'
      },
      {
        question: 'How do I access the workspace on the day of my reservation?',
        answer: 'Once your reservation is confirmed, a digital pass with a real-time QR code is generated in your Bookings tab. When you arrive at the venue, present your QR code to the entrance turnstile or front desk receptionist for instant verification.'
      },
      {
        question: 'What amenities are included with a standard hot desk booking?',
        answer: 'Every hot desk booking includes ergonomic seating, 100% guaranteed uninterrupted power, high-speed enterprise fiber Wi-Fi, air conditioning, access to clean restrooms, and complimentary specialty coffee/tea water dispensers.'
      },
      {
        question: 'Can I bring a guest or colleague with me?',
        answer: 'Hot desk passes are single-person admissions. If you are meeting a client or colleague, you can book a dedicated meeting room or add extra guests during checkout.'
      }
    ]
  },
  {
    id: 'hosts',
    title: 'For Space Hosts & Real Estate Owners',
    icon: Building2,
    faqs: [
      {
        question: 'How does OFIS vet and onboard commercial spaces?',
        answer: 'We conduct a physical and virtual audit assessing power infrastructure (generator automatic changeover switches and inverter backups), fiber optic bandwidth tests, sound insulation, physical security, and clean facilities.'
      },
      {
        question: 'What are the platform commission fees for space hosts?',
        answer: 'Listing your space on OFIS is completely free. We charge a modest 10% platform commission on completed bookings to cover digital marketing, customer support, Paystack payment processing, and turnstile pass security.'
      },
      {
        question: 'How quickly do hosts receive their booking earnings?',
        answer: 'Payouts are automated and distributed weekly on Fridays directly to your Nigerian commercial bank account in NGN via Paystack/NIBSS transfer.'
      }
    ]
  },
  {
    id: 'power',
    title: 'Power Uptime & Internet Reliability',
    icon: Zap,
    faqs: [
      {
        question: 'How does OFIS guarantee 100% power uptime?',
        answer: 'All OFIS hubs must maintain dual heavy-duty diesel generators combined with pure sine wave solar/inverter battery banks. In the event of a public grid blackout, the automated transfer switch (ATS) engages instantly with zero dropped connections.'
      },
      {
        question: 'What internet speeds can I expect at an OFIS hub?',
        answer: 'Workspaces are audited for 50Mbps to 300Mbps dedicated fiber connections from premier ISPs (Starlink, MainOne, ipNX) with wired CAT6 Ethernet availability in private offices and meeting rooms.'
      }
    ]
  },
  {
    id: 'payments',
    title: 'Payments & Currencies',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods are supported on OFIS?',
        answer: 'We accept all Nigerian debit cards (Mastercard, Visa, Verve), direct NIBSS bank transfers, USSD codes, Apple Pay, and international cards via Paystack and Flutterwave.'
      },
      {
        question: 'Can foreign remote workers pay in USD, GBP, or EUR?',
        answer: 'Yes! International visitors and diaspora teams can select their local currency in the top navbar or footer, and pay securely with foreign credit cards.'
      },
      {
        question: 'What is the booking cancellation and refund policy?',
        answer: 'You can cancel up to 2 hours before your scheduled check-in time for an instant 100% refund credited back to your OFIS wallet or original payment method.'
      }
    ]
  }
];

export const FaqPage: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-150">
      
      {/* Header */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5E7EB] dark:border-[#1E293B] text-center bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] dark:from-[#0B1220] dark:via-[#0F172A] dark:to-[#0B1220]">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#D1FAE5] dark:bg-[#10B981]/15 border border-[#10B981]/30 text-xs font-bold text-[#10B981]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions? We&apos;ve Got Answers</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#94A3B8]">
            Everything you need to know about booking workspaces, power guarantees, payments, and hosting on OFIS.
          </p>
        </div>
      </section>

      {/* Accordions */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        {FAQ_SECTIONS.map((section) => {
          const Icon = section.icon;

          return (
            <div key={section.id} className="space-y-4">
              <div className="flex items-center space-x-3 pb-2 border-b border-[#E5E7EB] dark:border-[#1E293B]">
                <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] dark:bg-[#10B981]/15 text-[#10B981] flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold">{section.title}</h2>
              </div>

              <div className="space-y-3">
                {section.faqs.map((faq, idx) => {
                  const itemKey = `${section.id}-${idx}`;
                  const isOpen = !!openItems[itemKey];

                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-white dark:bg-[#172033] border border-[#E5E7EB] dark:border-[#1E293B] overflow-hidden shadow-2xs"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(itemKey)}
                        className="w-full p-4 sm:p-5 text-left flex items-center justify-between text-xs sm:text-sm font-bold cursor-pointer hover:text-[#10B981] transition-colors"
                      >
                        <span className="pr-4">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-[#94A3B8] shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#10B981]' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-[#4B5563] dark:text-[#CBD5E1] border-t border-[#E5E7EB] dark:border-[#1E293B] leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

    </div>
  );
};
