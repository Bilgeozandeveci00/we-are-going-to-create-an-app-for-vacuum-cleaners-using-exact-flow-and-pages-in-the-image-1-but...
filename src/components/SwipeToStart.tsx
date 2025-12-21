import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Play, ChevronRight, Sparkles, Zap, Settings2 } from "lucide-react";

interface SwipeToStartProps {
  onTap: () => void;
  onSwipe: () => void;
  disabled?: boolean;
  lastMode?: "safe" | "normal" | "deep";
}

const modeLabels = {
  safe: { name: "Smooth", icon: Sparkles, color: "text-emerald-500" },
  normal: { name: "Custom", icon: Settings2, color: "text-foreground" },
  deep: { name: "Deep", icon: Zap, color: "text-primary" },
};

const SwipeToStart = ({ onTap, onSwipe, disabled = false, lastMode = "deep" }: SwipeToStartProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  const trackWidth = 280;
  const handleWidth = 56;
  const threshold = trackWidth - handleWidth - 16;
  
  const textOpacity = useTransform(x, [0, threshold * 0.5], [1, 0]);
  const arrowOpacity = useTransform(x, [0, threshold * 0.3], [1, 0]);
  const successOpacity = useTransform(x, [threshold * 0.7, threshold], [0, 1]);
  
  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= threshold) {
      setIsComplete(true);
      onSwipe();
      setTimeout(() => {
        animate(x, 0, { duration: 0.3 });
        setIsComplete(false);
      }, 500);
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

  const handleTap = () => {
    // Only trigger tap if not dragging
    if (Math.abs(x.get()) < 5) {
      onTap();
    }
  };

  const ModeIcon = modeLabels[lastMode].icon;

  if (disabled) {
    return (
      <div className="w-[280px] h-14 rounded-full bg-muted/50 border border-border flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Charging...</span>
      </div>
    );
  }

  return (
    <div 
      ref={constraintsRef}
      className="relative w-[280px] h-14 rounded-full bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 overflow-hidden"
    >
      {/* Swipe hint arrows on the right side */}
      <motion.div 
        className="absolute inset-y-0 right-4 flex items-center gap-0.5 pointer-events-none"
        style={{ opacity: arrowOpacity }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.6, 0.2], x: [-2, 2, -2] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut"
            }}
          >
            <ChevronRight className="w-4 h-4 text-primary/40" />
          </motion.div>
        ))}
      </motion.div>

      {/* Center content - tap to choose, shows last mode for swipe */}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none pl-14 pr-16"
        style={{ opacity: textOpacity }}
      >
        <div className="flex flex-col items-center">
          <span className="text-sm font-medium text-foreground">Tap to choose</span>
          <div className="flex items-center gap-1 mt-0.5">
            <ModeIcon className={`w-3 h-3 ${modeLabels[lastMode].color}`} />
            <span className={`text-[10px] ${modeLabels[lastMode].color}`}>
              Swipe for {modeLabels[lastMode].name}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Success indicator */}
      <motion.span 
        className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary pointer-events-none"
        style={{ opacity: successOpacity }}
      >
        Starting {modeLabels[lastMode].name}...
      </motion.span>

      {/* Draggable handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: threshold }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        onTap={handleTap}
        style={{ x }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-1 top-1 bottom-1 w-12 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-lg"
      >
        <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
      </motion.div>
    </div>
  );
};

export default SwipeToStart;
