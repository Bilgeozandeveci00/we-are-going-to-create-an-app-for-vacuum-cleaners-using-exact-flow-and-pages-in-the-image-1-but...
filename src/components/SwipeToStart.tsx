import { useState, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Play, ChevronRight } from "lucide-react";

interface SwipeToStartProps {
  onSwipe: () => void;
  disabled?: boolean;
  label?: string;
}

const SwipeToStart = ({ onSwipe, disabled = false, label = "Quick Start" }: SwipeToStartProps) => {
  const [isComplete, setIsComplete] = useState(false);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  
  // Track width for threshold calculation
  const trackWidth = 280;
  const handleWidth = 56;
  const threshold = trackWidth - handleWidth - 16; // Leave some padding
  
  // Transform x position to opacity for the text fade
  const textOpacity = useTransform(x, [0, threshold * 0.5], [1, 0]);
  const arrowOpacity = useTransform(x, [0, threshold * 0.3], [1, 0]);
  const successOpacity = useTransform(x, [threshold * 0.7, threshold], [0, 1]);
  
  const handleDragEnd = () => {
    const currentX = x.get();
    if (currentX >= threshold) {
      setIsComplete(true);
      onSwipe();
      // Reset after a moment
      setTimeout(() => {
        animate(x, 0, { duration: 0.3 });
        setIsComplete(false);
      }, 500);
    } else {
      animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
    }
  };

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
      {/* Animated arrows background hint */}
      <motion.div 
        className="absolute inset-y-0 left-16 right-4 flex items-center justify-center gap-1 pointer-events-none"
        style={{ opacity: arrowOpacity }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0.3, x: -4 }}
            animate={{ opacity: [0.3, 0.7, 0.3], x: [-4, 4, -4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          >
            <ChevronRight className="w-5 h-5 text-primary/50" />
          </motion.div>
        ))}
      </motion.div>

      {/* Label */}
      <motion.span 
        className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary pointer-events-none pl-12"
        style={{ opacity: textOpacity }}
      >
        {label}
      </motion.span>

      {/* Success indicator */}
      <motion.span 
        className="absolute inset-0 flex items-center justify-center text-sm font-medium text-primary pointer-events-none"
        style={{ opacity: successOpacity }}
      >
        Starting...
      </motion.span>

      {/* Draggable handle */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: threshold }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        whileTap={{ scale: 0.95 }}
        className="absolute left-1 top-1 bottom-1 w-12 rounded-full bg-primary flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg"
      >
        <Play className="w-5 h-5 text-primary-foreground ml-0.5" fill="currentColor" />
      </motion.div>
    </div>
  );
};

export default SwipeToStart;
