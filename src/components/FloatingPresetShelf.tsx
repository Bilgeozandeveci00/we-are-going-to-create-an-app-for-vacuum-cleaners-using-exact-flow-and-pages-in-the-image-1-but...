import { motion } from "framer-motion";
import { Droplets, Wind, Layers, ChevronRight } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="w-full px-4 pb-3"
    >
      <button
        onClick={onCustomizeClick}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-secondary/80 backdrop-blur-sm border border-border/30 transition-all active:scale-[0.98] hover:bg-secondary"
      >
        {/* Settings indicators */}
        <div className="flex items-center gap-4">
          {/* Fan/Vacuum Power */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
              <Wind className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-end gap-0.5">
              {[1, 2, 3, 4].map((level) => (
                <motion.div
                  key={level}
                  initial={false}
                  animate={{ 
                    opacity: level <= vacuumPower ? 1 : 0.25,
                    scale: level <= vacuumPower ? 1 : 0.9
                  }}
                  className={`w-1.5 rounded-full transition-colors ${
                    level <= vacuumPower ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  style={{ height: `${6 + level * 3}px` }}
                />
              ))}
            </div>
          </div>

          {/* Water Flow */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <motion.div
                  key={level}
                  initial={false}
                  animate={{ 
                    opacity: level <= waterFlow ? 1 : 0.25,
                    scale: level <= waterFlow ? 1 : 0.8
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    level <= waterFlow ? 'bg-sky-400' : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Floor */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-muted/50 flex items-center justify-center">
              <Layers className="w-4 h-4 text-muted-foreground" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {currentFloor}
            </span>
          </div>
        </div>

        {/* Customize action */}
        <div className="flex items-center gap-1 text-muted-foreground">
          <span className="text-xs font-medium">Customize</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </button>
    </motion.div>
  );
};

export default FloatingPresetShelf;
