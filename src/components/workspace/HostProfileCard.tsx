import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Star, 
  Clock, 
  MessageSquare, 
  Award, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { Space, HostProfile } from '../../types';
import { HostProfileModal } from './HostProfileModal';

interface HostProfileCardProps {
  host: HostProfile;
  space: Space;
  allSpaces: Space[];
  onContactHost: () => void;
  onSelectSpace?: (spaceId: string) => void;
}

export const HostProfileCard: React.FC<HostProfileCardProps> = ({
  host,
  space,
  allSpaces,
  onContactHost,
  onSelectSpace,
}) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Host spaces count
  const hostSpaces = allSpaces.filter((s) => s.host.id === host.id);
  const yearsHosting = host.yearsHosting || 3;
  const rating = host.rating || 4.95;
  const responseMinutes = host.responseTimeMinutes || 10;
  const responseRate = host.responseRatePercent || 98;

  return (
    <>
      <div className="p-6 rounded-3xl bg-[#07383D] border border-[#1E2522] space-y-5">
        
        {/* Top Host Intro */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={host.avatar}
                alt={host.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#14BEB8] shadow-lg"
              />
              <div className="absolute -bottom-1.5 -right-1.5 p-1 rounded-full bg-[#14BEB8] text-[#0D0D0D] shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-[#F2F2F2]">{host.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-[#14BEB8]/15 border border-[#14BEB8]/30 text-[10px] font-mono font-bold text-[#14BEB8]">
                  Verified Host
                </span>
              </div>
              <p className="text-xs text-[#9EABA3] font-medium">{host.companyName}</p>
              <div className="flex items-center space-x-2 mt-1 text-[11px] text-[#718079]">
                <span>Hosting for {yearsHosting} years</span>
                <span>•</span>
                <span>{hostSpaces.length || 1} Workspaces</span>
              </div>
            </div>
          </div>

          {/* Contact & View Profile Buttons */}
          <div className="flex items-center space-x-2 sm:self-center">
            <button
              type="button"
              onClick={onContactHost}
              className="px-4 py-2.5 rounded-xl bg-[#14BEB8] hover:bg-[#28D2CB] text-[#0D0D0D] text-xs font-bold flex items-center space-x-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-[#0D0D0D]" />
              <span>Message Host</span>
            </button>

            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl bg-[#0B4A50] hover:bg-[#166D74] border border-[#166D74] text-xs font-semibold text-[#9EABA3] hover:text-[#F2F2F2] transition-colors cursor-pointer"
            >
              Profile
            </button>
          </div>
        </div>

        {/* Host Credentials Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-[#1E2522]">
          
          <div className="p-3 rounded-2xl bg-[#0B4A50] border border-[#166D74]">
            <div className="flex items-center space-x-1.5 text-xs text-[#718079] mb-1">
              <Star className="w-3.5 h-3.5 text-[#14BEB8] fill-[#14BEB8]" />
              <span>Host Rating</span>
            </div>
            <div className="text-sm font-bold text-[#F2F2F2] font-mono">
              {rating} / 5.0
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B4A50] border border-[#166D74]">
            <div className="flex items-center space-x-1.5 text-xs text-[#718079] mb-1">
              <Clock className="w-3.5 h-3.5 text-[#14BEB8]" />
              <span>Response Time</span>
            </div>
            <div className="text-sm font-bold text-[#F2F2F2] font-mono">
              ~{responseMinutes} mins
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B4A50] border border-[#166D74]">
            <div className="flex items-center space-x-1.5 text-xs text-[#718079] mb-1">
              <Award className="w-3.5 h-3.5 text-[#14BEB8]" />
              <span>Response Rate</span>
            </div>
            <div className="text-sm font-bold text-[#14BEB8] font-mono">
              {responseRate}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B4A50] border border-[#166D74]">
            <div className="flex items-center space-x-1.5 text-xs text-[#718079] mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#14BEB8]" />
              <span>Identity Audit</span>
            </div>
            <div className="text-xs font-bold text-[#F2F2F2]">
              Verified 100%
            </div>
          </div>

        </div>

        {/* Verification Guarantee Reassurance Note */}
        <div className="flex items-center space-x-2 text-xs text-[#9EABA3] p-3 rounded-2xl bg-[#0B4A50]/50 border border-[#166D74]">
          <CheckCircle2 className="w-4 h-4 text-[#14BEB8] shrink-0" />
          <span>
            This host is an OFIS Certified Workspace Partner. Instant digital access pass guaranteed.
          </span>
        </div>

      </div>

      {/* Host Full Profile Modal */}
      {isProfileModalOpen && (
        <HostProfileModal
          host={host}
          hostSpaces={hostSpaces}
          onClose={() => setIsProfileModalOpen(false)}
          onContact={() => {
            setIsProfileModalOpen(false);
            onContactHost();
          }}
          onSelectSpace={(spaceId) => {
            setIsProfileModalOpen(false);
            if (onSelectSpace) onSelectSpace(spaceId);
          }}
        />
      )}
    </>
  );
};
