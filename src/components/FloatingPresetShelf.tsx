import { motion } from "framer-motion";
import { Droplets, Wind, Layers } from "lucide-react";

interface FloatingPresetShelfProps {
  vacuumPower: number;
  waterFlow: number;
  currentFloor: string;
  onCustomizeClick: () => void;
}

const FloatingPresetShelf = ({
  vacuumPower,
  waterFlow,
  currentFloor,
  onCustomizeClick,
}: FloatingPresetShelfProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      onClick={onCustomizeClick}
      className="w-full flex items-center justify-center gap-6 px-5 py-4 rounded-[20px] backdrop-blur-xl bg-white/10 dark:bg-white/[0.08] border border-white/30 dark:border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.05)] active:shadow-[0_4px_16px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(0,0,0,0.1)] transition-all cursor-pointer"
    >
      {/* Fan/Vacuum Power */}
      <div className="flex items-center gap-2">
        <Wind className="w-4 h-4 text-muted-foreground" />
        <div className="flex items-end gap-0.5">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-1.5 rounded-full transition-colors ${
                level <= vacuumPower ? 'bg-primary' : 'bg-muted-foreground/20'
              }`}
              style={{ height: `${5 + level * 2}px` }}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border/50" />

      {/* Water Flow */}
      <div className="flex items-center gap-2">
        <Droplets className="w-4 h-4 text-muted-foreground" />
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                level <= waterFlow ? 'bg-sky-400' : 'bg-muted-foreground/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-5 bg-border/50" />

      {/* Floor */}
      <div className="flex items-center gap-2">
        <Layers className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">{currentFloor}</span>
      </div>
    </motion.button>
  );
};

export default FloatingPresetShelf;
