import { motion } from "framer-motion";
import { Zap, AlertTriangle } from "lucide-react";

interface BatteryUsageBarProps {
  currentBattery: number;
  estimatedUsage: number;
  estimatedTime: number;
}

const BatteryUsageBar = ({
  currentBattery,
  estimatedUsage,
  estimatedTime,
}: BatteryUsageBarProps) => {
  const remainingAfter = Math.max(0, currentBattery - estimatedUsage);
  
  // Determine if there's enough battery
  const isLow = remainingAfter < 20;
  const willDepletePartway = currentBattery < estimatedUsage;

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Explanatory header */}
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">Estimated battery after cleaning</span>
      </div>
      
      {/* Visual bar with labels */}
      <div className="relative">
        <div className="relative h-3 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
          {/* Current battery level (faded) */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-emerald-500/20 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${currentBattery}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Remaining after cleaning (solid) */}
          <motion.div
            className={`absolute inset-y-0 left-0 rounded-full ${
              isLow ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${remainingAfter}%` }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          
          {/* Usage indicator line */}
          {!willDepletePartway && (
            <motion.div
              className="absolute inset-y-0 w-0.5 bg-foreground/60"
              style={{ left: `${remainingAfter}%` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />
          )}
        </div>
        
        {/* Labels below bar */}
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">After: <span className={`font-semibold ${isLow ? 'text-amber-500' : 'text-foreground'}`}>{remainingAfter}%</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
            <span className="text-xs text-muted-foreground">Uses: <span className="font-medium text-foreground">{estimatedUsage}%</span></span>
          </div>
        </div>
      </div>
      
      {/* Warning if low */}
      {willDepletePartway && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 text-xs text-amber-500"
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Robot may need to recharge mid-clean</span>
        </motion.div>
      )}
    </div>
  );
};

export default BatteryUsageBar;
