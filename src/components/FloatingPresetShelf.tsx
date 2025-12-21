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
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.01 }}
      onClick={onCustomizeClick}
      className="w-full flex items-center justify-center gap-6 px-5 py-3.5 rounded-2xl bg-gradient-to-b from-secondary to-secondary/70 border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-shadow cursor-pointer"
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
