import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, Zap, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
};

const defaultStats: DeviceStats = { speed: 4, power: 4, battery: 4, quiet: 3 };

// StatBar component - renders 5 boxes like racing game stats
const StatBar = ({ filled, label, align = 'left' }: { filled: number; label: string; align?: 'left' | 'right' }) => (
  <div className={`flex flex-col gap-1 ${align === 'right' ? 'items-end' : 'items-start'}`}>
    <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</span>
    <div className={`flex gap-0.5 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-3 h-5 rounded-sm transition-all duration-300 ${
            i <= filled 
              ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary)/0.6)]' 
              : 'bg-muted/30'
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
                {/* Device Card with Platform */}
                <div className="relative flex flex-col items-center">
                  {/* Trash button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveDevice(device.id);
                    }}
                    className="absolute -top-2 left-4 z-10 w-9 h-9 rounded-full bg-card/80 border border-border/50 flex items-center justify-center text-red-500 active:scale-95 transition-transform"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  {/* Stats - Left Side (Racing Game Style) - positioned above model */}
                  <div className="absolute -left-2 top-0 flex flex-col gap-4">
                    <StatBar filled={stats.speed} label="Speed" align="right" />
                    <StatBar filled={stats.power} label="Power" align="right" />
                  </div>

                  {/* Stats - Right Side (Racing Game Style) - positioned above model */}
                  <div className="absolute -right-2 top-0 flex flex-col gap-4">
                    <StatBar filled={stats.battery} label="Battery" align="left" />
                    <StatBar filled={stats.quiet} label="Quiet" align="left" />
                  </div>

                {/* 3D Robot Vacuum - larger size */}
                <RobotVacuum3D size="large" />
                
                {/* Circular Platform Glow */}
                <div className="absolute bottom-8 w-64 h-8">
                  <div className="w-full h-full rounded-[50%] bg-primary/20 blur-xl" />
                  <div className="absolute inset-0 w-full h-full rounded-[50%] border border-primary/30" />
                </div>
              </div>

              {/* Device Info */}
              <div className="text-center mt-4 mb-4">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {device.name}
                  </h2>
                </div>
                <div className="flex items-center justify-center gap-1 text-green-500">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-sm">{device.battery}%</span>
                </div>
              </div>

              {/* Enter Button - Main CTA */}
              <Button
                onClick={() => onEnterDevice(device.id)}
                className="w-full max-w-xs h-14 rounded-full bg-primary text-primary-foreground font-semibold text-lg shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] hover:scale-105 active:scale-95 transition-all duration-200"
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
