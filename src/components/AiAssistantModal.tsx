import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  ArrowRight, 
  Zap, 
  MapPin, 
  Users, 
  Wifi, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  CreditCard,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OfisAiProvider, ChatMessage } from '../services/ofisAiProvider';
import { StructuredSearchIntent } from '../services/ofisIntentParser';
import { WorkspaceCard } from './WorkspaceCard';
import { formatPriceNGN, getSpacePricing } from '../utils/pricing';

export const AiAssistantModal: React.FC = () => {
  const {
    isAiModalOpen,
    setIsAiModalOpen,
    aiInitialQuery,
    setAiInitialQuery,
    allSpaces,
    setSelectedSpaceId,
    setCurrentView,
    openQuickBook,
    setCheckoutSpace,
    setCheckoutPrefillSlot,
    setIsCheckoutOpen,
    openInfoModal,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeIntent, setActiveIntent] = useState<StructuredSearchIntent | undefined>(undefined);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation or react to external prompt
  useEffect(() => {
    if (isAiModalOpen) {
      if (messages.length === 0) {
        setMessages([
          {
            id: 'init-1',
            sender: 'ofis',
            text: "Welcome to OFIS. Tell me what space you need (e.g., 'I need a creative studio in Lekki tomorrow for 6 people under ₦80,000' or 'Find me a boardroom in Victoria Island for 12 people'). You can also ask us anything about how OFIS verifies spaces and guarantees 24/7 power.",
            suggestedFollowUps: [
              'Creative studio in Lekki for 6 people',
              'Boardroom in Victoria Island for 12 people',
              'Quiet place to work in Ikeja today',
              'How does OFIS verify power & internet?'
            ],
            timestamp: new Date().toISOString(),
          }
        ]);
      }

      // If initial query was passed from homepage or template
      if (aiInitialQuery && aiInitialQuery.trim()) {
        const queryToProcess = aiInitialQuery;
        setAiInitialQuery('');
        setTimeout(() => {
          handleSendMessage(queryToProcess);
        }, 150);
      } else {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 150);
      }
    }
  }, [isAiModalOpen, aiInitialQuery]);

  // Auto scroll to latest response
  useEffect(() => {
    if (isAiModalOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isAiModalOpen]);

  if (!isAiModalOpen) return null;

  const handleSendMessage = async (queryToSend?: string) => {
    const text = (queryToSend || inputQuery).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await OfisAiProvider.processMessage(
        text,
        allSpaces,
        messages,
        activeIntent
      );

      if (response.intent) {
        setActiveIntent(response.intent);
      }

      setMessages((prev) => [...prev, response]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ofis',
          text: "I experienced a brief connection hiccup while searching the network. Please browse our directory or try asking again.",
          suggestedFollowUps: ['Show all spaces in Lagos', 'Find a meeting room', 'What is OFIS?'],
          timestamp: new Date().toISOString(),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetConversation = () => {
    setActiveIntent(undefined);
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'ofis',
        text: "Conversation refreshed. Tell OFIS what physical space you are looking for.",
        suggestedFollowUps: [
          'Find a creative studio in Lekki',
          'Private office under ₦300k/month',
          'Boardroom in VI for 12 people',
          'How does OFIS work?'
        ],
        timestamp: new Date().toISOString(),
      }
    ]);
  };

  const handleKnowledgeNavigation = (view: string) => {
    setIsAiModalOpen(false);
    if (view === 'about' || view === 'contact' || view === 'faq' || view === 'terms' || view === 'become_host' || view === 'explore') {
      setCurrentView(view as any);
    } else {
      openInfoModal(view as any);
    }
  };

  const handleBookingHandoff = (handoff: NonNullable<ChatMessage['bookingHandoff']>) => {
    setIsAiModalOpen(false);
    setCheckoutSpace(handoff.space);
    setCheckoutPrefillSlot({
      date: handoff.date === 'tomorrow' ? '2026-09-04' : (handoff.date === 'today' ? '2026-09-03' : handoff.date),
      startTime: handoff.startTime || '10:00'
    });
    setIsCheckoutOpen(true);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      onClick={() => setIsAiModalOpen(false)}
    >
      <div 
        className="relative w-full max-w-4xl h-[92vh] sm:h-[85vh] max-h-[850px] bg-white dark:bg-[#0E1523] rounded-3xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl flex flex-col overflow-hidden transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between bg-white dark:bg-[#0E1523] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">Ofis Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 uppercase">
                  AI Concierge
                </span>
              </div>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                Real Nigerian Physical Space Network • Guaranteed Power & Fiber
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetConversation}
              className="p-2 rounded-xl text-[#6B7280] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsAiModalOpen(false)}
              className="p-2 rounded-xl text-[#6B7280] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-[#F8FAFC] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Active Structured Intent Tags Strip */}
        {activeIntent && (activeIntent.category || activeIntent.location || activeIntent.capacity || activeIntent.maxPrice) && (
          <div className="px-5 py-2.5 bg-[#F8FAFC] dark:bg-[#080D18] border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8] shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] shrink-0">Active Filters:</span>
            {activeIntent.categoryLabel && (
              <span className="px-2.5 py-1 rounded-lg bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 shrink-0">
                {activeIntent.categoryLabel}
              </span>
            )}
            {activeIntent.location && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/30 shrink-0 flex items-center space-x-1">
                <MapPin className="w-3 h-3" />
                <span>{activeIntent.location}</span>
              </span>
            )}
            {activeIntent.capacity && (
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-500 dark:text-purple-400 border border-purple-500/30 shrink-0 flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{activeIntent.capacity}+ Guests</span>
              </span>
            )}
            {activeIntent.maxPrice && (
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/30 shrink-0">
                Max {formatPriceNGN(activeIntent.maxPrice)}
              </span>
            )}
            {activeIntent.needsParking && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                Parking Required
              </span>
            )}
            {activeIntent.needsSoundproofing && (
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/30 shrink-0">
                Acoustic Soundproofing
              </span>
            )}
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-3 max-w-full`}
              >
                {/* Bubble */}
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed max-w-[92%] sm:max-w-[85%] ${
                    isUser
                      ? 'bg-[#10B981] text-white font-medium rounded-tr-xs shadow-md'
                      : 'bg-[#F1F5F9] dark:bg-[#161F32] border border-[#E2E8F0] dark:border-[#1E293B] text-[#1E293B] dark:text-[#F8FAFC] rounded-tl-xs shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {/* Knowledge Action Link if available */}
                  {msg.knowledgeLink && (
                    <div className="mt-3 pt-3 border-t border-[#CBD5E1] dark:border-[#28354E] flex items-center justify-between">
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">Approved OFIS Information</span>
                      <button
                        type="button"
                        onClick={() => handleKnowledgeNavigation(msg.knowledgeLink!.view)}
                        className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#10B981] hover:underline cursor-pointer"
                      >
                        <span>{msg.knowledgeLink.label}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Booking Handoff Card */}
                {msg.bookingHandoff && (
                  <div className="w-full max-w-md p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#10B981] uppercase tracking-wider">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Ready to Book</span>
                      </div>
                      <span className="text-xs font-bold text-[#111827] dark:text-[#F8FAFC]">
                        {formatPriceNGN(msg.bookingHandoff.pricingBreakdown.totalAmount)}
                      </span>
                    </div>
                    <div className="text-xs text-[#475569] dark:text-[#94A3B8] space-y-1">
                      <p><strong className="text-[#111827] dark:text-[#F8FAFC]">{msg.bookingHandoff.space.title}</strong></p>
                      <p>Date: {msg.bookingHandoff.date} • Time: {msg.bookingHandoff.startTime} ({msg.bookingHandoff.durationHours} hrs)</p>
                      <p>Guests: {msg.bookingHandoff.guests} • {msg.bookingHandoff.pricingBreakdown.rateDescription}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleBookingHandoff(msg.bookingHandoff!)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Proceed to Complete Booking</span>
                    </button>
                  </div>
                )}

                {/* Visual Workspace Cards Stream (Visual & Interactive) */}
                {msg.matchingSpaces && msg.matchingSpaces.length > 0 && (
                  <div className="w-full space-y-3 mt-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                        Verified Matching Workspaces ({msg.matchingSpaces.length})
                      </p>
                      <span className="text-[11px] text-[#10B981] font-medium">Real Supabase Inventory</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {msg.matchingSpaces.slice(0, 6).map((space) => {
                        const isRecommended = space.id === msg.recommendedSpaceId;

                        return (
                          <div key={space.id} className="relative">
                            {isRecommended && (
                              <div className="absolute -top-2.5 left-3 z-20 px-2.5 py-0.5 rounded-full bg-[#10B981] text-[#06291C] text-[10px] font-bold shadow-md flex items-center space-x-1">
                                <Sparkles className="w-3 h-3" />
                                <span>AI Top Match</span>
                              </div>
                            )}
                            <WorkspaceCard 
                              space={space} 
                              onBookDirect={(s) => {
                                setIsAiModalOpen(false);
                                openQuickBook(s);
                              }} 
                            />
                          </div>
                        );
                      })}
                    </div>

                    {msg.matchingSpaces.length > 6 && (
                      <div className="text-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setIsAiModalOpen(false);
                            setCurrentView('explore');
                          }}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-[#10B981] bg-[#10B981]/10 hover:bg-[#10B981]/20 border border-[#10B981]/30 transition-all cursor-pointer"
                        >
                          View all {msg.matchingSpaces.length} matching spaces in Explore →
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Follow-Ups / Quick Refinements */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {msg.suggestedFollowUps.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => handleSendMessage(prompt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium text-[#475569] dark:text-[#94A3B8] bg-[#F1F5F9] dark:bg-[#161F32] hover:bg-[#E2E8F0] dark:hover:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#28354E] hover:border-[#10B981]/40 transition-all cursor-pointer flex items-center space-x-1.5"
                      >
                        <Sparkles className="w-3 h-3 text-[#10B981]" />
                        <span>{prompt}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-[#F1F5F9] dark:bg-[#161F32] border border-[#E2E8F0] dark:border-[#1E293B] max-w-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
              <div className="text-xs text-[#10B981] font-mono">
                Searching real OFIS physical inventory & auditing availability...
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0E1523] border-t border-[#E2E8F0] dark:border-[#1E293B] shrink-0">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Tell OFIS what you need (e.g. 'Studio in Lekki tomorrow for 6 people under ₦80k')..."
                className="w-full pl-4 pr-10 py-3 rounded-2xl bg-[#F8FAFC] dark:bg-[#161F32] border border-[#E2E8F0] dark:border-[#1E293B] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] text-sm text-[#111827] dark:text-[#F8FAFC] placeholder:text-[#94A3B8] outline-hidden transition-all"
                disabled={loading}
              />
            </div>
            
            <button
              type="submit"
              disabled={!inputQuery.trim() || loading}
              className="px-5 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] disabled:bg-[#CBD5E1] dark:disabled:bg-[#1E293B] text-white disabled:text-[#94A3B8] text-sm font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer shadow-sm"
            >
              <span>Ask OFIS</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-[#94A3B8] px-1">
            <span>Deterministic Nigerian pricing • Real Supabase inventory only</span>
            <button
              type="button"
              onClick={() => {
                setIsAiModalOpen(false);
                setCurrentView('explore');
              }}
              className="hover:underline text-[#10B981] font-medium"
            >
              Browse all spaces in Explore →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
