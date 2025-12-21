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
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-10"
    >
      {/* Settings bubble */}
      <button
        onClick={onCustomizeClick}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-card/95 backdrop-blur-md border border-border/50 shadow-lg hover:bg-card transition-colors"
      >
        {/* Fan/Vacuum Power - Bar levels */}
        <div className="flex items-center gap-1.5">
          <Wind className="w-4 h-4 text-muted-foreground" />
          <div className="flex items-end gap-0.5">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-1 rounded-sm transition-all ${
                  level <= vacuumPower
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30'
                }`}
                style={{ height: `${4 + level * 3}px` }}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border/50" />

        {/* Water Flow - Dots */}
        <div className="flex items-center gap-1.5">
          <Droplets className="w-4 h-4 text-muted-foreground" />
          <div className="flex gap-1">
            {[1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  level <= waterFlow
                    ? 'bg-sky-400'
                    : 'bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-border/50" />

        {/* Floor */}
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {currentFloor}
          </span>
        </div>
      </button>

      {/* Speech bubble tail */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
        <svg width="16" height="8" viewBox="0 0 16 8" className="drop-shadow-sm">
          <path
            d="M0 0 L8 8 L16 0"
            fill="hsl(var(--card))"
            fillOpacity="0.95"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            strokeOpacity="0.5"
          />
          <path d="M1 0 L15 0" stroke="hsl(var(--card))" strokeWidth="2" strokeOpacity="0.95" />
        </svg>
      </div>
    </motion.div>
  );
};

export default FloatingPresetShelf;
