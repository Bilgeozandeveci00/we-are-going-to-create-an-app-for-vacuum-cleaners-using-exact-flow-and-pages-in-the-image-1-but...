import { motion } from "framer-motion";

interface BatteryUsageBarProps {
  currentBattery: number;
  estimatedUsage: number;
}

const BatteryUsageBar = ({
  currentBattery,
  estimatedUsage,
}: BatteryUsageBarProps) => {
  const remainingAfter = Math.max(0, currentBattery - estimatedUsage);
  
  // Determine if there's enough battery
  const isLow = remainingAfter < 20;
  const willDepletePartway = currentBattery < estimatedUsage;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {/* Label */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Battery usage</span>
        <span className={`text-xs font-medium ${isLow ? 'text-amber-500' : 'text-muted-foreground'}`}>
          -{estimatedUsage}% → {remainingAfter}%
        </span>
      </div>
      
      {/* Visual bar */}
      <div className="relative h-2 w-full bg-muted-foreground/10 rounded-full overflow-hidden">
        {/* Current battery level */}
        <motion.div
          className="absolute inset-y-0 left-0 bg-emerald-500/30 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${currentBattery}%` }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Remaining after cleaning */}
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
            className="absolute inset-y-0 w-0.5 bg-foreground/50"
            style={{ left: `${remainingAfter}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
        )}
      </div>
      
      {/* Warning if low */}
      {willDepletePartway && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-amber-500"
        >
          May need to recharge during cleaning
        </motion.p>
      )}
    </div>
  );
};

export default BatteryUsageBar;
