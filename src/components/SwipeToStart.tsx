import { useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Play, Sparkles, Zap, Settings2 } from "lucide-react";

interface SwipeToStartProps {
  onTap: () => void;
  onSwipe: () => void;
  disabled?: boolean;
  lastMode?: "safe" | "normal" | "deep";
}

const modeConfig = {
  safe: { 
    name: "Smooth", 
    icon: Sparkles, 
    bg: "bg-emerald-500",
    glow: "shadow-emerald-500/50"
  },
  normal: { 
    name: "Custom", 
    icon: Settings2, 
    bg: "bg-muted",
    glow: "shadow-muted/50"
  },
  deep: { 
    name: "Deep", 
    icon: Zap, 
    bg: "bg-primary",
    glow: "shadow-primary/50"
  },
};

const SwipeToStart = ({ onTap, onSwipe, disabled = false, lastMode = "deep" }: SwipeToStartProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const x = useMotionValue(0);
  
  const trackWidth = 260;
  const handleSize = 48;
  const destinationSize = 40;
  const threshold = trackWidth - handleSize - 8;
  
  // Visual feedback transforms
  const handleScale = useTransform(x, [0, threshold], [1, 0.9]);
  const destinationScale = useTransform(x, [threshold * 0.5, threshold], [1, 1.15]);
  const destinationGlow = useTransform(x, [threshold * 0.5, threshold], [0, 1]);
  const trackFill = useTransform(x, [0, threshold], ["0%", "100%"]);
  
  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= threshold * 0.85) {
      setIsComplete(true);
      // Snap to end
      animate(x, threshold, { duration: 0.15 });
      onSwipe();
      setTimeout(() => {
        animate(x, 0, { duration: 0.4, ease: "easeOut" });
        setIsComplete(false);
      }, 600);
    } else {
      animate(x, 0, { type: "spring", stiffness: 400, damping: 25 });
    }
  };

  const handleTap = () => {
    if (Math.abs(x.get()) < 8) {
      onTap();
    }
  };

  const ModeIcon = modeConfig[lastMode].icon;

  if (disabled) {
    return (
      <div className="w-[260px] h-14 rounded-full bg-muted/30 border border-border/50 flex items-center justify-center">
        <span className="text-sm text-muted-foreground/70">Charging...</span>
      </div>
    );
  }

  return (
    <div className="relative w-[260px] h-14 rounded-full bg-card border border-border overflow-hidden">
      {/* Track fill - shows progress */}
      <motion.div 
        className={`absolute inset-y-0 left-0 ${modeConfig[lastMode].bg} opacity-20`}
        style={{ width: trackFill }}
      />
      
      {/* Subtle track line connecting handle to destination */}
      <div className="absolute inset-y-0 left-14 right-14 flex items-center">
        <div className="w-full h-[2px] bg-border/50 rounded-full" />
      </div>

      {/* Destination indicator (right side) - the mode icon */}
      <motion.div 
        className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center justify-center"
        style={{ scale: destinationScale }}
      >
        <motion.div 
          className={`w-10 h-10 rounded-full ${modeConfig[lastMode].bg} flex items-center justify-center`}
          style={{ 
            boxShadow: useTransform(
              destinationGlow, 
              [0, 1], 
              ["0 0 0 0 transparent", `0 0 20px 4px var(--${lastMode === 'safe' ? 'emerald' : lastMode === 'deep' ? 'primary' : 'muted'})`]
            )
          }}
        >
          <ModeIcon className={`w-5 h-5 ${lastMode === 'normal' ? 'text-foreground' : 'text-white'}`} />
        </motion.div>
      </motion.div>

      {/* Draggable play handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: threshold }}
        dragElastic={0.05}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        style={{ x, scale: handleScale }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-1 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg shadow-primary/30 z-10"
      >
        <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
      </motion.div>

      {/* Center hint text - very subtle */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: useTransform(x, [0, 40], [1, 0]) }}
      >
        <span className="text-xs text-muted-foreground/60 tracking-wide">
          {isComplete ? "" : ""}
        </span>
      </motion.div>
    </div>
  );
};

export default SwipeToStart;
