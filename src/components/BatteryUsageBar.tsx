import { motion } from "framer-motion";
import { Zap } from "lucide-react";

interface BatteryUsageBarProps {
  currentBattery: number;
  estimatedUsage: number;
}

const BatteryUsageBar = ({
  currentBattery,
  estimatedUsage,
}: BatteryUsageBarProps) => {
  const isEnough = currentBattery >= estimatedUsage;

  return (
    <div className="flex items-center gap-3 w-full">
      <Zap className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
      <div className="flex-1">
        <div className="h-2 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${isEnough ? 'bg-primary/60' : 'bg-amber-500/60'}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(estimatedUsage, 100)}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        Uses <span className="font-semibold text-foreground">{estimatedUsage}%</span> battery
      </span>
    </div>
  );
};

export default BatteryUsageBar;
