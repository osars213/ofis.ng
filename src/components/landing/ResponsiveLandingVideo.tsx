import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  ShieldCheck, 
  Zap, 
  Wifi, 
  Smartphone, 
  Eye, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export interface ResponsiveLandingVideoProps {
  /** Video URL for desktop browsers */
  videoSrc?: string;
  /** High-resolution poster image displayed on mobile or when reduced motion is preferred */
  posterSrc?: string;
  /** Optional secondary WebM or high-def source */
  videoWebmSrc?: string;
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Accessible caption or description of the video content */
  videoDescription?: string;
  /** Callback when user clicks 'Explore Spaces' */
  onExploreClick?: () => void;
  /** Callback when user clicks 'Book a Demo' */
  onBookDemoClick?: () => void;
  /** Custom additional container class names */
  className?: string;
}

export const ResponsiveLandingVideo: React.FC<ResponsiveLandingVideoProps> = ({
  videoSrc = '/media/ofis-workspace-tour.mp4',
  posterSrc = '/media/ofis-workspace-poster.jpg',
  videoWebmSrc,
  title = 'Experience OFIS Workspaces in Action',
  subtitle = 'From executive boardrooms in Abuja to creative soundstages and private suites across Lagos — tour our verified spaces.',
  videoDescription = 'A video tour showcasing verified modern flexible workspaces, private offices, high-speed fiber connectivity, and creative production studios across Nigeria.',
  onExploreClick,
  onBookDemoClick,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sectionId = useId();

  // Motion preference detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);
  
  // Mobile device detection (screen width < 768px or coarse pointer on smaller viewports)
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // User manual override: allows explicit playback on mobile or reduced-motion devices
  const [userRequestedPlay, setUserRequestedPlay] = useState<boolean>(false);

  // Video playback states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [showControlsOverlay, setShowControlsOverlay] = useState<boolean>(false);

  // 1. Detect reduced-motion preference & subscribe to changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
      if (e.matches) {
        setUserRequestedPlay(false);
        if (videoRef.current) {
          videoRef.current.pause();
        }
      }
    };

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
    } else {
      // Compatibility fallback for older browsers
      motionQuery.addListener(handleMotionChange);
    }

    return () => {
      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener('change', handleMotionChange);
      } else {
        motionQuery.removeListener(handleMotionChange);
      }
    };
  }, []);

  // 2. Detect mobile device (viewport width < 768px or pointer coarse)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      const isNarrow = window.innerWidth < 768;
      const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(isNarrow || (isCoarsePointer && window.innerWidth < 1024));
    };

    checkMobile();

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 3. Determine whether to render the video or the high-quality static poster
  // If mobile or reduced-motion is detected, default to high-quality poster image unless user explicitly requested play
  const shouldRenderVideo = (!isMobile && !prefersReducedMotion) || userRequestedPlay;

  // 4. Handle video playback lifecycle
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldRenderVideo) {
      video.muted = isMuted;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            // Autoplay was prevented by browser policy (e.g., user gesture needed or unmuted)
            console.warn('Autoplay prevented by browser:', err);
            setIsPlaying(false);
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [shouldRenderVideo, isMuted]);

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) {
      setUserRequestedPlay(true);
      return;
    }

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      setUserRequestedPlay(true);
      video.play().then(() => setIsPlaying(true)).catch(console.error);
    }
  };

  // Handle Mute/Unmute Toggle
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const newMuted = !isMuted;
    video.muted = newMuted;
    setIsMuted(newMuted);
  };

  // Handle Replay
  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => setIsPlaying(true)).catch(console.error);
  };

  // Handle Fullscreen
  const handleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setPlaybackProgress((video.currentTime / video.duration) * 100);
  };

  return (
    <section 
      aria-labelledby={`video-section-title-${sectionId}`}
      className={`relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 ${className}`}
    >
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[340px] bg-gradient-to-r from-[#0F766E]/15 via-[#14B8A6]/10 to-[#0F766E]/15 blur-[120px] rounded-full pointer-events-none -z-0" />

      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B1F33] border border-[#1E3A4D] text-xs font-semibold text-[#14B8A6] mb-3 shadow-[0_2px_8px_rgba(7,21,33,0.3)]">
          <Sparkles className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>Verified Space Showcase</span>
        </div>

        <h2 
          id={`video-section-title-${sectionId}`}
          className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight"
        >
          {title}
        </h2>

        <p className="text-sm sm:text-base text-[#CBD5E1] mt-3 leading-relaxed">
          {subtitle}
        </p>

        {/* Accessibility & Performance Status Notice (only shown when reduced-motion or mobile optimization is active) */}
        {(prefersReducedMotion || isMobile) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            {prefersReducedMotion ? (
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50"
                role="status"
                aria-live="polite"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Reduced-Motion Preference Detected: Showing High-Quality Poster</span>
              </span>
            ) : (
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#0B1F33] text-[#94A3B8] border border-[#1E3A4D]"
                role="status"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>Mobile Optimized: High-Quality Poster Loaded (Data-Saver Mode)</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Main Video / Poster Presentation Frame */}
      <div 
        ref={containerRef}
        onMouseEnter={() => setShowControlsOverlay(true)}
        onMouseLeave={() => setShowControlsOverlay(false)}
        className="relative z-10 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#071521] border border-[#1E3A4D] shadow-[0_20px_60px_rgba(7,21,33,0.7)] group transition-all duration-300 hover:border-[#14B8A6]/40"
      >
        {/* Aspect Ratio Box (16:9) */}
        <div className="relative w-full aspect-[16/9] bg-[#071521] overflow-hidden">
          
          {/* 1. HIGH-QUALITY POSTER IMAGE (Shown on mobile, reduced-motion, or before video loads) */}
          <img
            src={posterSrc}
            alt="Inspected OFIS flexible workspace in Lagos featuring executive desks, natural lighting, and high-speed fiber setup"
            loading={isMobile ? "eager" : "lazy"}
            fetchPriority={isMobile ? "high" : "auto"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              shouldRenderVideo && isVideoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />

          {/* 2. RESPONSIVE VIDEO (Rendered on desktop when reduced-motion is false, or on user request) */}
          {shouldRenderVideo && (
            <video
              ref={videoRef}
              playsInline
              muted={isMuted}
              loop
              autoPlay={!prefersReducedMotion}
              preload="metadata"
              aria-label={videoDescription}
              onLoadedData={() => setIsVideoLoaded(true)}
              onTimeUpdate={handleTimeUpdate}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                isVideoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {videoWebmSrc && <source src={videoWebmSrc} type="video/webm" />}
              <source src={videoSrc} type="video/mp4" />
              <p className="p-4 text-white text-sm">
                Your browser does not support HTML5 video. Please view the high-resolution workspace photos above.
              </p>
            </video>
          )}

          {/* Top Info HUD Bar */}
          <div className="absolute top-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-b from-[#071521]/90 via-[#071521]/40 to-transparent flex items-center justify-between z-20 pointer-events-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6] shadow-[0_0_8px_#14B8A6]" />
              <span className="text-xs sm:text-sm font-bold tracking-wide text-white uppercase">
                OFIS Lagos & Abuja Hubs
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-xs text-[#CBD5E1]">
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1F33]/80 backdrop-blur-md border border-[#1E3A4D]">
                <Zap className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>24/7 Power</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1F33]/80 backdrop-blur-md border border-[#1E3A4D]">
                <Wifi className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>Fiber + Starlink</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0B1F33]/80 backdrop-blur-md border border-[#1E3A4D]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>Inspected</span>
              </div>
            </div>
          </div>

          {/* Center Play Button Overlay for Mobile / Paused / Reduced Motion States */}
          {(!shouldRenderVideo || !isPlaying) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 backdrop-blur-[2px] z-20 p-4">
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video tour'}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0F766E] hover:bg-[#14B8A6] text-white flex items-center justify-center shadow-[0_0_30px_rgba(15,118,110,0.5)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer group/play focus:outline-none focus:ring-4 focus:ring-[#14B8A6]/50"
              >
                <Play className="w-7 h-7 sm:w-9 h-9 text-white ml-1 transition-transform group-hover/play:scale-105" />
              </button>

              <div className="mt-4 text-center">
                <span className="text-white font-bold text-sm sm:text-base drop-shadow-md">
                  {shouldRenderVideo ? 'Click to Resume Tour' : 'Watch Video Tour'}
                </span>
                <p className="text-xs text-[#CBD5E1] mt-1 max-w-xs drop-shadow">
                  {isMobile ? 'Streams on demand to preserve your mobile data' : '1080p preview with verified workspace amenities'}
                </p>
              </div>
            </div>
          )}

          {/* Bottom Interactive Controls Bar */}
          <div 
            className={`absolute bottom-0 inset-x-0 p-3 sm:p-5 bg-gradient-to-t from-[#071521]/95 via-[#071521]/70 to-transparent z-20 transition-opacity duration-300 ${
              showControlsOverlay || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Progress Bar */}
            <div className="w-full bg-[#1E3A4D]/80 h-1.5 rounded-full overflow-hidden mb-3.5">
              <div 
                className="bg-gradient-to-r from-[#0F766E] to-[#14B8A6] h-full transition-all duration-150"
                style={{ width: `${playbackProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              {/* Left Controls: Play/Pause, Replay, Mute */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause workspace video' : 'Play workspace video'}
                  aria-pressed={isPlaying}
                  className="p-2 sm:p-2.5 rounded-xl bg-[#0B1F33]/90 hover:bg-[#1E3A4D] text-white border border-[#1E3A4D] hover:border-[#14B8A6]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                >
                  {isPlaying ? <Pause className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Play className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                  aria-pressed={!isMuted}
                  className="p-2 sm:p-2.5 rounded-xl bg-[#0B1F33]/90 hover:bg-[#1E3A4D] text-white border border-[#1E3A4D] hover:border-[#14B8A6]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> : <Volume2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />}
                </button>

                <button
                  type="button"
                  onClick={handleReplay}
                  aria-label="Replay video tour from start"
                  className="hidden sm:flex p-2 sm:p-2.5 rounded-xl bg-[#0B1F33]/90 hover:bg-[#1E3A4D] text-white border border-[#1E3A4D] hover:border-[#14B8A6]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                {/* Mobile / Reduced Motion toggle back to poster view */}
                {userRequestedPlay && (
                  <button
                    type="button"
                    onClick={() => {
                      setUserRequestedPlay(false);
                      if (videoRef.current) videoRef.current.pause();
                    }}
                    className="text-xs text-[#CBD5E1] hover:text-white px-2.5 py-1.5 rounded-lg bg-[#0B1F33]/80 border border-[#1E3A4D] transition-colors"
                  >
                    Switch to Poster View
                  </button>
                )}
              </div>

              {/* Right Controls: Explore CTA & Fullscreen */}
              <div className="flex items-center gap-2 sm:gap-3">
                {onExploreClick && (
                  <button
                    type="button"
                    onClick={onExploreClick}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0F766E] hover:bg-[#14B8A6] text-white text-xs font-bold transition-all shadow-[0_2px_10px_rgba(15,118,110,0.3)]"
                  >
                    <span>Explore Spaces</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label="Toggle fullscreen view"
                  className="p-2 sm:p-2.5 rounded-xl bg-[#0B1F33]/90 hover:bg-[#1E3A4D] text-white border border-[#1E3A4D] hover:border-[#14B8A6]/50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#14B8A6]"
                >
                  <Maximize className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust & Location Summary Strip Below Video */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="p-3.5 rounded-xl bg-[#0B1F33]/60 border border-[#1E3A4D]">
          <span className="block text-white font-extrabold text-sm sm:text-base">100+</span>
          <span className="text-xs text-[#94A3B8]">Verified Desks & Suites</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B1F33]/60 border border-[#1E3A4D]">
          <span className="block text-white font-extrabold text-sm sm:text-base">24/7 Power</span>
          <span className="text-xs text-[#94A3B8]">Automatic Generator SLA</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B1F33]/60 border border-[#1E3A4D]">
          <span className="block text-white font-extrabold text-sm sm:text-base">4K Studios</span>
          <span className="text-xs text-[#94A3B8]">Soundproof Pods & Stages</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B1F33]/60 border border-[#1E3A4D]">
          <span className="block text-white font-extrabold text-sm sm:text-base">Zero Leases</span>
          <span className="text-xs text-[#94A3B8]">Book by Hour or Day</span>
        </div>
      </div>
    </section>
  );
};
