import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TimeEstimateRingProps {
  totalMinutes: number;
  remainingMinutes?: number;
  isRunning?: boolean;
  size?: number;
}

const TimeEstimateRing = ({
  totalMinutes,
  remainingMinutes,
  isRunning = false,
  size = 48,
}: TimeEstimateRingProps) => {
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate progress
  const progress = isRunning && remainingMinutes !== undefined
    ? (totalMinutes - remainingMinutes) / totalMinutes
    : 0;
  
  const progressOffset = circumference - (progress * circumference);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted-foreground/20"
          />
          
          {/* Progress circle */}
          {isRunning && (
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={progressOffset}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progressOffset }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}
        </svg>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={isRunning ? { rotate: 360 } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Clock className="w-5 h-5 text-primary" />
          </motion.div>
        </div>
      </div>
      
      {/* Time display */}
      <div className="text-center">
        <span className="text-sm font-bold text-foreground">
          {isRunning && remainingMinutes !== undefined
            ? `${Math.floor(remainingMinutes)}:${String(Math.round((remainingMinutes % 1) * 60)).padStart(2, '0')}`
            : `${totalMinutes}m`
          }
        </span>
      </div>
    </div>
  );
};

export default TimeEstimateRing;
