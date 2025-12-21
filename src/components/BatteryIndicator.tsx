import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface BatteryIndicatorProps {
  percentage: number;
  isCharging?: boolean;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
}

const BatteryIndicator = ({
  percentage,
  isCharging = false,
  size = "md",
  showPercentage = true,
}: BatteryIndicatorProps) => {
  // Determine battery color based on percentage
  const getBatteryColor = () => {
    if (isCharging) return "hsl(142, 76%, 45%)"; // Green when charging
    if (percentage <= 20) return "hsl(0, 84%, 60%)"; // Red
    if (percentage <= 50) return "hsl(45, 93%, 47%)"; // Yellow/Orange
    return "hsl(142, 76%, 45%)"; // Green
  };

  // Determine text/badge color
  const getTextColor = () => {
    if (isCharging) return "text-emerald-500";
    if (percentage <= 20) return "text-red-500";
    if (percentage <= 50) return "text-amber-500";
    return "text-emerald-500";
  };

  // Determine badge bg
  const getBadgeBg = () => {
    if (isCharging) return "bg-emerald-500/15";
    if (percentage <= 20) return "bg-red-500/15";
    if (percentage <= 50) return "bg-amber-500/15";
    return "bg-emerald-500/15";
  };

  // Size configurations
  const sizes = {
    sm: { width: 28, height: 14, tipWidth: 3, tipHeight: 6, radius: 3, padding: 2 },
    md: { width: 36, height: 18, tipWidth: 4, tipHeight: 8, radius: 4, padding: 2.5 },
    lg: { width: 48, height: 24, tipWidth: 5, tipHeight: 10, radius: 5, padding: 3 },
  };

  const s = sizes[size];
  const fillWidth = Math.max(0, ((percentage / 100) * (s.width - s.padding * 2)));
  const batteryColor = getBatteryColor();

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center">
        {/* Battery Body */}
        <svg width={s.width + s.tipWidth} height={s.height} viewBox={`0 0 ${s.width + s.tipWidth} ${s.height}`}>
          {/* Battery outline */}
          <rect
            x={0.5}
            y={0.5}
            width={s.width - 1}
            height={s.height - 1}
            rx={s.radius}
            ry={s.radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="text-muted-foreground/40"
          />
          
          {/* Battery tip */}
          <rect
            x={s.width}
            y={(s.height - s.tipHeight) / 2}
            width={s.tipWidth - 1}
            height={s.tipHeight}
            rx={1}
            ry={1}
            fill="currentColor"
            className="text-muted-foreground/40"
          />
          
          {/* Battery fill */}
          <motion.rect
            x={s.padding}
            y={s.padding}
            height={s.height - s.padding * 2}
            rx={s.radius - 1}
            ry={s.radius - 1}
            fill={batteryColor}
            initial={{ width: 0 }}
            animate={{ width: fillWidth }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          
          {/* Charging bolt icon overlay */}
          {isCharging && (
            <motion.g
              animate={{ opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              <Zap
                x={s.width / 2 - 6}
                y={s.height / 2 - 6}
                width={12}
                height={12}
                className="text-white"
                fill="white"
                stroke="white"
                strokeWidth={1}
              />
            </motion.g>
          )}
        </svg>
      </div>
      
      {/* Percentage badge */}
      {showPercentage && (
        <motion.div 
          className={`px-2 py-0.5 rounded-md ${getBadgeBg()} flex items-center gap-0.5`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {isCharging && (
            <motion.div
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Zap className={`w-3 h-3 ${getTextColor()}`} fill="currentColor" />
            </motion.div>
          )}
          <span className={`text-xs font-bold ${getTextColor()}`}>
            {Math.round(percentage)}
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default BatteryIndicator;
