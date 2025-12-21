import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface BatteryIndicatorProps {
  percentage: number;
  isCharging?: boolean;
  size?: "sm" | "md" | "lg";
}

const BatteryIndicator = ({
  percentage,
  isCharging = false,
  size = "md",
}: BatteryIndicatorProps) => {
  // Determine battery color based on percentage
  const getBatteryColor = () => {
    if (isCharging) return "hsl(142, 76%, 45%)";
    if (percentage <= 20) return "hsl(0, 84%, 60%)";
    if (percentage <= 50) return "hsl(45, 93%, 47%)";
    return "hsl(142, 76%, 45%)";
  };

  // Size configurations - made wider to fit text
  const sizes = {
    sm: { width: 36, height: 18, tipWidth: 3, tipHeight: 8, radius: 4, padding: 2, fontSize: 8 },
    md: { width: 44, height: 22, tipWidth: 4, tipHeight: 10, radius: 5, padding: 2.5, fontSize: 10 },
    lg: { width: 56, height: 28, tipWidth: 5, tipHeight: 12, radius: 6, padding: 3, fontSize: 12 },
  };

  const s = sizes[size];
  const fillWidth = Math.max(0, ((percentage / 100) * (s.width - s.padding * 2)));
  const batteryColor = getBatteryColor();

  return (
    <div className="relative flex items-center">
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
        
        {/* Percentage text inside battery */}
        {isCharging ? (
          <motion.g
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            <Zap
              x={s.width / 2 - 6}
              y={s.height / 2 - 6}
              width={12}
              height={12}
              fill="white"
              stroke="white"
              strokeWidth={0.5}
            />
          </motion.g>
        ) : (
          <text
            x={s.width / 2}
            y={s.height / 2 + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={s.fontSize}
            fontWeight="700"
            fill={percentage > 50 ? "white" : "currentColor"}
            className={percentage > 50 ? "" : "text-foreground"}
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            {Math.round(percentage)}
          </text>
        )}
      </svg>
    </div>
  );
};

export default BatteryIndicator;
