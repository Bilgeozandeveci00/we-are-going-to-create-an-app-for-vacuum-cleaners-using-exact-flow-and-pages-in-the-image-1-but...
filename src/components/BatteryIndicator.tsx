import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface BatteryIndicatorProps {
  percentage: number;
  isCharging?: boolean;
  size?: "sm" | "md" | "lg";
  estimatedUsage?: number;
}

const BatteryIndicator = ({
  percentage,
  isCharging = false,
  size = "md",
  estimatedUsage,
}: BatteryIndicatorProps) => {
  // Determine battery color based on percentage
  const getBatteryColor = () => {
    if (isCharging) return "hsl(142, 76%, 45%)";
    if (percentage <= 20) return "hsl(0, 84%, 60%)";
    if (percentage <= 50) return "hsl(45, 93%, 47%)";
    return "hsl(142, 76%, 45%)";
  };

  const getUsageColor = () => {
    if (!estimatedUsage) return "transparent";
    const remaining = percentage - estimatedUsage;
    if (remaining < 10) return "hsl(0, 84%, 60%)"; // Red - not enough
    if (remaining < 25) return "hsl(45, 93%, 47%)"; // Yellow - tight
    return "hsl(var(--muted-foreground) / 0.3)"; // Normal
  };

  // Size configurations - made wider to fit text
  const sizes = {
    sm: { width: 36, height: 18, tipWidth: 3, tipHeight: 8, radius: 4, padding: 2, fontSize: 8 },
    md: { width: 44, height: 22, tipWidth: 4, tipHeight: 10, radius: 5, padding: 2.5, fontSize: 10 },
    lg: { width: 56, height: 28, tipWidth: 5, tipHeight: 12, radius: 6, padding: 3, fontSize: 12 },
  };

  const s = sizes[size];
  const fillWidth = Math.max(0, ((percentage / 100) * (s.width - s.padding * 2)));
  const usageWidth = estimatedUsage ? Math.max(0, ((estimatedUsage / 100) * (s.width - s.padding * 2))) : 0;
  const batteryColor = getBatteryColor();
  const usageColor = getUsageColor();

  const isEnough = !estimatedUsage || percentage >= estimatedUsage;

  const remainingAfterClean = estimatedUsage ? Math.max(0, percentage - estimatedUsage) : null;

  return (
    <div className="flex flex-col items-end gap-1">
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
          
          {/* Battery fill - current level */}
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
          
          {/* Estimated usage overlay - striped pattern showing what will be used */}
          {estimatedUsage && !isCharging && (
            <>
              <defs>
                <pattern id="usageStripes" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="4" stroke={usageColor} strokeWidth="2" />
                </pattern>
                <clipPath id="usageClip">
                  <rect
                    x={s.padding}
                    y={s.padding}
                    width={usageWidth}
                    height={s.height - s.padding * 2}
                    rx={s.radius - 1}
                    ry={s.radius - 1}
                  />
                </clipPath>
              </defs>
              <motion.rect
                x={s.padding}
                y={s.padding}
                height={s.height - s.padding * 2}
                rx={s.radius - 1}
                ry={s.radius - 1}
                fill="url(#usageStripes)"
                clipPath="url(#usageClip)"
                initial={{ width: 0 }}
                animate={{ width: usageWidth }}
                transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
              />
            </>
          )}
          
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
      
      {/* Remaining battery indicator below */}
      {estimatedUsage && !isCharging && remainingAfterClean !== null && (
        <motion.div 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5"
        >
          <span className="text-[9px] text-muted-foreground">After:</span>
          <div className="flex items-center gap-1">
            <div 
              className="h-2 rounded-full"
              style={{ 
                width: 24,
                background: `linear-gradient(to right, ${
                  remainingAfterClean < 10 ? 'hsl(0, 84%, 60%)' : 
                  remainingAfterClean < 25 ? 'hsl(45, 93%, 47%)' : 
                  'hsl(142, 76%, 45%)'
                } ${remainingAfterClean}%, hsl(var(--muted)) ${remainingAfterClean}%)`
              }}
            />
            <span 
              className={`text-[10px] font-semibold ${
                remainingAfterClean < 10 ? 'text-destructive' : 
                remainingAfterClean < 25 ? 'text-amber-500' : 
                'text-muted-foreground'
              }`}
            >
              {remainingAfterClean}%
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BatteryIndicator;
