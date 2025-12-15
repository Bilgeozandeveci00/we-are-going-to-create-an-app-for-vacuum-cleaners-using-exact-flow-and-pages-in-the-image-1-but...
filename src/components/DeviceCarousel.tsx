import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import RobotVacuum3D from "@/components/RobotVacuum3D";

interface Device {
  id: string;
  name: string;
  battery: number;
}

interface DeviceStats {
  speed: number;
  power: number;
  battery: number;
  quiet: number;
}

interface DeviceCarouselProps {
  devices: Device[];
  onRemoveDevice: (id: string) => void;
  onAddDevice: () => void;
  onEnterDevice: (id: string) => void;
}

// Racing game style stat bars - different stats per device
const deviceStatsMap: Record<string, DeviceStats> = {
  'device-1': { speed: 3, power: 4, battery: 4, quiet: 3 },
  'device-2': { speed: 5, power: 3, battery: 5, quiet: 2 },
  'device-3': { speed: 4, power: 5, battery: 3, quiet: 4 },
};

const defaultStats: DeviceStats = { speed: 4, power: 4, battery: 4, quiet: 3 };

// StatBar component - premium style with value display
const StatBar = ({ filled, label, align = 'left' }: { filled: number; label: string; align?: 'left' | 'right' }) => (
  <div className={`flex flex-col gap-1.5 ${align === 'right' ? 'items-end' : 'items-start'}`}>
    <div className={`flex items-center gap-2 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      <span className="text-[11px] text-foreground/70 uppercase tracking-wide font-medium">{label}</span>
      <span className="text-[10px] text-primary font-semibold">{filled}/5</span>
    </div>
    <div className={`flex gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2.5 h-6 rounded-sm transition-all duration-300 ${
            i <= filled 
              ? 'bg-gradient-to-t from-primary to-primary/80 shadow-[0_0_12px_hsl(var(--primary)/0.5)]' 
              : 'bg-foreground/10'
          }`}
        />
      ))}
    </div>
  </div>
);

const DeviceCarousel = ({
  devices,
  onRemoveDevice,
  onAddDevice,
  onEnterDevice,
}: DeviceCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const totalSlides = devices.length + 1;

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;
    const threshold = 50;

    if (diff > threshold && currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    
    isDragging.current = false;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const diff = startX.current - e.clientX;
    const threshold = 50;

    if (diff > threshold && currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (diff < -threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
    
    isDragging.current = false;
  };

  const getDeviceStats = (deviceId: string): DeviceStats => {
    return deviceStatsMap[deviceId] || defaultStats;
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={goToPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/60 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/80 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      
      {currentIndex < totalSlides - 1 && (
        <button
          onClick={goToNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-card/60 border border-border/30 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card/80 transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="w-full flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => (isDragging.current = false)}
      >
        <motion.div
          className="flex h-full"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Device Slides */}
          {devices.map((device) => {
            const stats = getDeviceStats(device.id);
            return (
              <div
                key={device.id}
                className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center px-6"
              >
                {/* Device name - Hero style at top */}
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {device.name}
                  </h2>
                  <div className="flex items-center justify-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Ready</span>
                    <span className="text-muted-foreground/50 mx-1">•</span>
                    <Zap className="w-3.5 h-3.5 text-green-500 fill-current" />
                    <span className="text-sm text-green-500 font-medium">{device.battery}%</span>
                  </div>
                </div>

                {/* Device showcase area */}
                <div className="relative flex items-center justify-center w-full py-4">
                  {/* Stats - Left Side */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-10">
                    <StatBar filled={stats.speed} label="Speed" align="right" />
                    <StatBar filled={stats.power} label="Power" align="right" />
                  </div>

                  {/* Stats - Right Side */}
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-5 z-10">
                    <StatBar filled={stats.battery} label="Battery" align="left" />
                    <StatBar filled={stats.quiet} label="Quiet" align="left" />
                  </div>

                  {/* 3D Model with platform */}
                  <div className="relative flex flex-col items-center">
                    {/* Ambient glow behind model */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/15 rounded-full blur-[60px]" />
                    
                    {/* 3D Robot Vacuum */}
                    <div className="relative z-10">
                      <RobotVacuum3D size="large" />
                    </div>
                    
                    {/* Platform with concentric rings */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
                      {/* Outer glow ring */}
                      <div className="absolute w-56 h-8 rounded-[50%] bg-primary/10 blur-xl" />
                      {/* Middle ring */}
                      <div className="absolute w-48 h-6 rounded-[50%] border border-primary/20" />
                      {/* Inner bright ring */}
                      <div className="absolute w-40 h-4 rounded-[50%] border border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.3)]" />
                      {/* Core ring */}
                      <div className="absolute w-32 h-3 rounded-[50%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Enter Button - Premium CTA */}
                <Button
                  onClick={() => onEnterDevice(device.id)}
                  className="w-full max-w-[280px] h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-[0_8px_32px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_40px_hsl(var(--primary)/0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-4"
                >
                  Enter Device
                </Button>
              </div>
            );
          })}

          {/* Add Device Slide */}
          <div className="flex-shrink-0 w-full h-full flex flex-col items-center justify-center px-6">
            <button
              onClick={onAddDevice}
              className="w-28 h-28 rounded-full border-2 border-dashed border-primary/50 flex items-center justify-center mb-6 active:scale-95 transition-transform hover:border-primary hover:bg-primary/5"
            >
              <Plus className="w-12 h-12 text-primary/70" />
            </button>
            <p className="text-muted-foreground text-lg mb-6">Add Device</p>
            <Button
              onClick={onAddDevice}
              variant="outline"
              className="w-full max-w-xs h-12 rounded-full border-primary/50 text-primary font-medium hover:bg-primary/10"
            >
              Add device
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Page Dots */}
      <div className="flex gap-2 py-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentIndex === index 
                ? "bg-primary w-4" 
                : "bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceCarousel;
