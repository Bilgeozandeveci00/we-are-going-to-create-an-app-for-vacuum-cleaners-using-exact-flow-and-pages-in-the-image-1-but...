import { motion } from "framer-motion";
import { Droplets, Wind, Layers, ChevronRight, SlidersHorizontal } from "lucide-react";

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
      whileTap={{ scale: 0.98 }}
      onClick={onCustomizeClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-border/30 transition-all hover:bg-secondary hover:border-primary/20 group"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <SlidersHorizontal className="w-5 h-5 text-primary" />
      </div>

      {/* Settings preview */}
      <div className="flex-1 flex items-center gap-4">
        {/* Fan/Vacuum Power */}
        <div className="flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="flex items-end gap-0.5">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-1 rounded-full transition-colors ${
                  level <= vacuumPower ? 'bg-primary' : 'bg-muted-foreground/20'
                }`}
                style={{ height: `${4 + level * 2}px` }}
              />
            ))}
          </div>
        </div>

        {/* Water Flow */}
        <div className="flex items-center gap-1.5">
          <Droplets className="w-3.5 h-3.5 text-muted-foreground" />
          <div className="flex gap-0.5">
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

        {/* Floor */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{currentFloor}</span>
        </div>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
        <span className="text-xs font-medium">Tap to adjust</span>
        <ChevronRight className="w-4 h-4" />
      </div>
    </motion.button>
  );
};

export default FloatingPresetShelf;
