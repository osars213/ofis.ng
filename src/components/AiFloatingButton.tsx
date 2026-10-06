import React from 'react';
import { useApp } from '../context/AppContext';

export const AiFloatingButton: React.FC = () => {
  const { setIsAiModalOpen, currentView } = useApp();

  if (currentView === 'payment_result') return null;

  return (
    <button
      type="button"
      id="ofis-floating-assistant-btn"
      onClick={() => setIsAiModalOpen(true)}
      className="hidden md:flex items-center px-4 py-2.5 rounded-full bg-gradient-to-r from-[#006B70] via-[#087E85] to-[#FFA987] hover:from-[#087E85] hover:to-[#FF8A65] text-white font-bold text-xs shadow-xl shadow-[#FFA987]/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FFA987]/50 fixed bottom-6 right-6 z-30 group"
      title="Ofis Assistant"
    >
      <span className="tracking-wide font-extrabold">Ofis Assistant</span>
    </button>
  );
};
