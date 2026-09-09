import React, { useState } from 'react';
import { 
  Zap, 
  Wifi, 
  ShieldCheck, 
  MapPin, 
  Check, 
  ArrowUpRight, 
  Radio, 
  Layers,
  Sparkles
} from 'lucide-react';

interface NetworkNode {
  id: string;
  city: string;
  country: string;
  hubsCount: number;
  status: 'active' | 'deploying';
  x: number; // percentage coordinate on abstract map
  y: number;
  ping: string;
  highlight?: boolean;
}

const networkNodes: NetworkNode[] = [
  { id: 'lagos', city: 'Lagos', country: 'Nigeria', hubsCount: 42, status: 'active', x: 28, y: 52, ping: '8ms', highlight: true },
  { id: 'abuja', city: 'Abuja', country: 'Nigeria', hubsCount: 18, status: 'active', x: 33, y: 46, ping: '12ms', highlight: true },
  { id: 'ph', city: 'Port Harcourt', country: 'Nigeria', hubsCount: 11, status: 'active', x: 31, y: 58, ping: '14ms', highlight: true },
  { id: 'ibadan', city: 'Ibadan', country: 'Nigeria', hubsCount: 7, status: 'active', x: 26, y: 50, ping: '10ms' },
  { id: 'accra', city: 'Accra', country: 'Ghana', hubsCount: 15, status: 'deploying', x: 21, y: 54, ping: '24ms' },
  { id: 'nairobi', city: 'Nairobi', country: 'Kenya', hubsCount: 22, status: 'deploying', x: 62, y: 60, ping: '38ms' },
  { id: 'kigali', city: 'Kigali', country: 'Rwanda', hubsCount: 8, status: 'deploying', x: 54, y: 64, ping: '42ms' },
  { id: 'capetown', city: 'Cape Town', country: 'South Africa', hubsCount: 19, status: 'deploying', x: 44, y: 90, ping: '55ms' },
];

const featuredSpaces = [
  {
    title: 'The Atrium Executive Suite',
    category: 'Workstation & Private Suite',
    location: 'Victoria Island, Lagos',
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&auto=format&fit=crop&q=80',
    specs: ['99.9% Power SLA', 'Dual Starlink', 'Smart Card Access'],
    rate: 'From ₦8,500/day',
    verified: true,
  },
  {
    title: 'Capital Boardroom & Telepresence',
    category: 'Executive Meeting Suite',
    location: 'Maitama, Abuja',
    image: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=800&auto=format&fit=crop&q=80',
    specs: ['4K Video Suite', 'Acoustic Glass', 'Dual Generator Backup'],
    rate: 'From ₦25,000/hr',
    verified: true,
  },
  {
    title: 'Lekki Soundstage & Cyclorama',
    category: 'Production & Creator Hub',
    location: 'Lekki Phase 1, Lagos',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80',
    specs: ['Rodecaster Audio', 'Chroma Green & White', 'Silent Aircon'],
    rate: 'From ₦35,000/hr',
    verified: true,
  },
];

export const NetworkVisuals: React.FC<{ onExploreClick?: () => void }> = ({ onExploreClick }) => {
  const [activeNode, setActiveNode] = useState<NetworkNode>(networkNodes[0]);

  return (
    <div className="w-full max-w-6xl mx-auto my-12 sm:my-16 px-4 sm:px-6 lg:px-8">
      
      {/* Network Infrastructure Dashboard Card */}
      <div className="rounded-3xl bg-[#0B1F33]/90 backdrop-blur-xl border border-[#1E3A4D] p-6 sm:p-8 shadow-[0_20px_50px_rgba(7,21,33,0.6)] relative overflow-hidden">
        
        {/* Subtle radial teal background accent inside card */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-[#0F766E]/15 blur-[120px] rounded-full pointer-events-none" />

        {/* Header Strip of Dashboard */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E3A4D]">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14B8A6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#14B8A6]"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#14B8A6]">
                Live Physical Infrastructure Layer
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Verified Spaces. Zero Operational Friction.
            </h3>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3.5 py-1.5 rounded-[12px] bg-[#071521] border border-[#1E3A4D] text-xs text-[#94A3B8] flex items-center space-x-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#14B8A6]" />
              <span>99.8% Power SLA Verified</span>
            </div>
            <div className="hidden lg:flex px-3.5 py-1.5 rounded-[12px] bg-[#071521] border border-[#1E3A4D] text-xs text-[#94A3B8] items-center space-x-2">
              <Wifi className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Fiber + Starlink</span>
            </div>
          </div>
        </div>

        {/* Split Section: Interactive Node Map + Real Space Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-center">
          
          {/* Left / Top: Interactive African Physical Space Network Map (5 cols) */}
          <div className="lg:col-span-5 bg-[#071521] border border-[#1E3A4D] rounded-2xl p-5 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-semibold text-white flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-[#14B8A6] animate-pulse" />
                <span>Pan-African Network Nodes</span>
              </span>
              <span className="text-[10px] font-mono text-[#14B8A6] bg-[#0F766E]/20 px-2 py-0.5 rounded border border-[#0F766E]/40">
                Live Telemetry
              </span>
            </div>

            {/* Abstract Continental Topology SVG Visual */}
            <div className="relative w-full h-[220px] my-2">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                {/* Subtle map contour outline */}
                <path 
                  d="M15 32 C20 28, 40 24, 60 22 C75 22, 85 30, 80 45 C75 55, 65 65, 55 80 C48 92, 40 95, 38 85 C35 72, 28 65, 20 55 C12 48, 10 38, 15 32 Z" 
                  className="fill-[#0B1F33]/60 stroke-[#1E3A4D] stroke-[0.7] stroke-dasharray-[2,2]"
                />

                {/* Connecting Arcs between active nodes */}
                <path 
                  d="M28 52 Q30 49 33 46" 
                  className="stroke-[#0F766E]/80 stroke-[0.8]" 
                  strokeDasharray="1.5 1.5"
                />
                <path 
                  d="M28 52 Q30 55 31 58" 
                  className="stroke-[#0F766E]/80 stroke-[0.8]" 
                  strokeDasharray="1.5 1.5"
                />
                <path 
                  d="M28 52 Q27 51 26 50" 
                  className="stroke-[#0F766E]/80 stroke-[0.8]" 
                  strokeDasharray="1.5 1.5"
                />
                <path 
                  d="M28 52 Q24 53 21 54" 
                  className="stroke-[#14B8A6]/40 stroke-[0.5]" 
                  strokeDasharray="1 2"
                />
                <path 
                  d="M33 46 Q48 52 62 60" 
                  className="stroke-[#14B8A6]/40 stroke-[0.5]" 
                  strokeDasharray="1 2"
                />
                <path 
                  d="M62 60 Q53 75 44 90" 
                  className="stroke-[#14B8A6]/40 stroke-[0.5]" 
                  strokeDasharray="1 2"
                />

                {/* Node Points */}
                {networkNodes.map((node) => {
                  const isSelected = activeNode.id === node.id;
                  const isActive = node.status === 'active';
                  return (
                    <g 
                      key={node.id} 
                      className="cursor-pointer transition-transform hover:scale-125"
                      onClick={() => setActiveNode(node)}
                    >
                      {/* Pulse circle for primary hubs */}
                      {isActive && (
                        <circle 
                          cx={node.x} 
                          cy={node.y} 
                          r={isSelected ? "4.5" : "3"} 
                          className="fill-[#14B8A6]/20 animate-ping"
                        />
                      )}
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={isSelected ? "2.8" : "1.8"} 
                        className={isActive ? "fill-[#14B8A6] stroke-white stroke-[0.5]" : "fill-[#94A3B8] opacity-60"}
                      />
                      {node.highlight && (
                        <text 
                          x={node.x + 3.5} 
                          y={node.y + 1} 
                          className="text-[3.5px] font-sans font-bold fill-white select-none"
                        >
                          {node.city}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Selected Node Details Card */}
            <div className="p-3 rounded-xl bg-[#0B1F33] border border-[#1E3A4D] flex items-center justify-between text-xs z-10">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#0F766E]/20 border border-[#0F766E]/40 flex items-center justify-center text-[#14B8A6]">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white leading-none mb-0.5">
                    {activeNode.city}, {activeNode.country}
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">
                    {activeNode.hubsCount} verified spaces • Latency {activeNode.ping}
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                activeNode.status === 'active' 
                  ? 'bg-[#0F766E]/20 text-[#14B8A6] border border-[#0F766E]/40' 
                  : 'bg-[#1E3A4D] text-[#94A3B8]'
              }`}>
                {activeNode.status === 'active' ? 'Operational' : 'Deploying'}
              </span>
            </div>
          </div>

          {/* Right / Bottom: 3 Verified Space Cards Showcase (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {featuredSpaces.map((space, idx) => (
              <div 
                key={idx}
                className="group rounded-2xl bg-[#071521] border border-[#1E3A4D] hover:border-[#14B8A6]/50 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(7,21,33,0.5),0_0_20px_rgba(20,184,166,0.08)]"
              >
                {/* Space Image with Overlay & Verified Badge */}
                <div className="relative h-32 w-full overflow-hidden bg-zinc-900">
                  <img 
                    src={space.image} 
                    alt={space.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071521] via-transparent to-black/30" />
                  
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-md bg-[#071521]/80 backdrop-blur-md border border-[#1E3A4D] text-[9px] font-semibold text-[#14B8A6]">
                    <ShieldCheck className="w-3 h-3 text-[#14B8A6]" />
                    <span>Verified Uptime</span>
                  </div>

                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[10px] text-zinc-300">
                    <span className="truncate flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-[#14B8A6] shrink-0" />
                      {space.location}
                    </span>
                  </div>
                </div>

                {/* Space Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] block mb-1">
                      {space.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 group-hover:text-[#14B8A6] transition-colors">
                      {space.title}
                    </h4>

                    {/* Infrastructure Specs */}
                    <div className="mt-2.5 space-y-1">
                      {space.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center space-x-1.5 text-[10px] text-[#94A3B8]">
                          <Check className="w-2.5 h-2.5 text-[#14B8A6] shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#1E3A4D] flex items-center justify-between text-xs">
                    <span className="font-semibold text-white text-[11px]">
                      {space.rate}
                    </span>
                    <span className="text-[10px] font-medium text-[#14B8A6] group-hover:underline flex items-center">
                      Preview <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Live Status Ticker Bar Inside Infrastructure Card */}
        <div className="mt-6 pt-4 border-t border-[#1E3A4D] flex flex-wrap items-center justify-between gap-3 text-xs text-[#94A3B8]">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-white">
              <Zap className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span className="font-medium">Power Guaranteed</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center space-x-1.5 text-white">
              <Wifi className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span className="font-medium">Fiber Redundancy</span>
            </span>
            <span className="text-zinc-600">•</span>
            <span className="hidden sm:inline-flex items-center space-x-1.5 text-white">
              <Layers className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span className="font-medium">Instant Multi-City Booking</span>
            </span>
          </div>

          <button
            onClick={onExploreClick}
            className="text-[11px] font-semibold text-[#14B8A6] hover:text-[#0D655E] flex items-center space-x-1 transition-colors group cursor-pointer"
          >
            <span>Explore all verified spaces in marketplace</span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
