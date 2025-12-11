import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Zap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RobotVacuum3D from "@/components/RobotVacuum3D";

interface Device {
  id: string;
  name: string;
  battery: number;
}

interface DeviceCarouselProps {
  devices: Device[];
  onRemoveDevice: (id: string) => void;
  onAddDevice: () => void;
  onEnterDevice: (id: string) => void;
}

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

  const totalSlides = devices.length + 1; // devices + add device slide

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

  return (
    <div className="flex flex-col items-center w-full">
      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="w-full max-w-sm overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => (isDragging.current = false)}
      >
        <motion.div
          className="flex"
          animate={{ x: `-${currentIndex * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Device Slides */}
          {devices.map((device) => (
            <div
              key={device.id}
              className="flex-shrink-0 w-full flex flex-col items-center px-6"
            >
              {/* Device Card */}
              <div className="relative mb-8">
                {/* Trash button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDevice(device.id);
                  }}
                  className="absolute -top-2 -left-2 z-10 w-10 h-10 rounded-full bg-card/80 border border-border/50 flex items-center justify-center text-red-500 active:scale-95 transition-transform"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                {/* 3D Robot Vacuum */}
                <RobotVacuum3D />
              </div>

              {/* Device Info */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h2 className="text-xl font-semibold text-foreground">
                    {device.name}
                  </h2>
                  <span className="text-muted-foreground">∠</span>
                </div>
                <div className="flex items-center justify-center gap-1 text-green-500">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-sm">{device.battery}%</span>
                </div>
              </div>

              {/* Enter Button */}
              <Button
                onClick={() => onEnterDevice(device.id)}
                variant="outline"
                className="w-full max-w-sm h-12 rounded-full border-border/50 bg-card/50 text-foreground font-medium"
              >
                Enter
              </Button>
            </div>
          ))}

          {/* Add Device Slide */}
          <div className="flex-shrink-0 w-full flex flex-col items-center justify-center px-6 min-h-[400px]">
            <button
              onClick={onAddDevice}
              className="w-24 h-24 rounded-full border-2 border-dashed border-border/50 flex items-center justify-center mb-6 active:scale-95 transition-transform"
            >
              <Plus className="w-10 h-10 text-muted-foreground" />
            </button>
            <p className="text-muted-foreground text-lg">Add Device</p>
          </div>
        </motion.div>
      </div>

      {/* Page Dots */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentIndex === index ? "bg-foreground" : "bg-muted-foreground/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DeviceCarousel;
