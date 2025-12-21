import { motion } from "framer-motion";
import { Layers, Ban } from "lucide-react";

interface FloatingPresetShelfProps {
  vacuumPower: number;
  waterFlow: number;
  currentFloor: string;
  onCustomizeClick: () => void;
}

// SVG icon for vacuum power - optimized size for shelf display
const VacuumIcon = ({ level, size = 18 }: { level: number; size?: number }) => {
  if (level === 0) return <Ban style={{ width: size, height: size }} className="text-muted-foreground" />;
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
      <circle cx="12" cy="12" r="3" />
      {level >= 1 && <path d="M12 5v-2" />}
      {level >= 2 && <><path d="M17 7l1.5-1.5" /><path d="M7 7L5.5 5.5" /></>}
      {level >= 3 && <><path d="M19 12h2" /><path d="M5 12H3" /></>}
      {level >= 4 && <><path d="M17 17l1.5 1.5" /><path d="M7 17l-1.5 1.5" /><path d="M12 19v2" /></>}
    </svg>
  );
};

// SVG icon for water flow - optimized size for shelf display
const WaterIcon = ({ level, size = 18 }: { level: number; size?: number }) => {
  if (level === 0) return <Ban style={{ width: size, height: size }} className="text-muted-foreground" />;
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-sky-400">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      {level >= 2 && <path d="M12 8v4" strokeLinecap="round" />}
      {level >= 3 && <path d="M10 11h4" strokeLinecap="round" />}
      {level === 4 && <circle cx="12" cy="14" r="2" fill="currentColor" />}
    </svg>
  );
};

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
      className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-b from-secondary to-secondary/70 border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-shadow cursor-pointer"
    >
      {/* Fan/Vacuum Power */}
      <div className="flex items-center gap-2.5 flex-1 justify-center">
        <VacuumIcon level={vacuumPower} size={18} />
        <div className="flex items-end gap-0.5">
          {[1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className={`w-1.5 rounded-full transition-colors ${
                level <= vacuumPower ? 'bg-primary' : 'bg-muted-foreground/20'
              }`}
              style={{ height: `${4 + level * 2}px` }}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-border/50" />

      {/* Water Flow */}
      <div className="flex items-center gap-2.5 flex-1 justify-center">
        <WaterIcon level={waterFlow} size={18} />
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
      <div className="w-px h-6 bg-border/50" />

      {/* Floor */}
      <div className="flex items-center gap-2 flex-1 justify-center">
        <Layers className="w-4 h-4 text-primary" />
        <span className="text-xs font-medium text-foreground">{currentFloor}</span>
      </div>
    </motion.button>
  );
};

export default FloatingPresetShelf;
