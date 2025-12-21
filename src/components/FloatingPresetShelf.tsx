import { motion, AnimatePresence } from "framer-motion";
import { Plus, Check, Sparkles, Ban } from "lucide-react";

interface CustomPreset {
  id: string;
  name: string;
  description: string;
  settings: Record<string, unknown>;
}

interface FloatingPresetShelfProps {
  presets: CustomPreset[];
  selectedPreset: string | null;
  onSelectPreset: (id: string) => void;
  onCreateNew: () => void;
  vacuumPower: number;
  waterFlow: number;
  vacuumLevels: string[];
  waterLevels: string[];
}

// Compact vacuum icon for preset pills
const VacuumIconMini = ({ level }: { level: number }) => {
  if (level === 0) return <Ban className="w-3 h-3 opacity-60" />;
  
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
      <circle cx="12" cy="12" r="3" />
      {level >= 1 && <path d="M12 5v-2" />}
      {level >= 2 && <><path d="M17 7l1.5-1.5" /><path d="M7 7L5.5 5.5" /></>}
      {level >= 3 && <><path d="M19 12h2" /><path d="M5 12H3" /></>}
      {level >= 4 && <><path d="M17 17l1.5 1.5" /><path d="M7 17l-1.5 1.5" /></>}
    </svg>
  );
};

// Compact water icon for preset pills
const WaterIconMini = ({ level }: { level: number }) => {
  if (level === 0) return <Ban className="w-3 h-3 opacity-60" />;
  
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-primary">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
      {level >= 2 && <path d="M12 8v4" strokeLinecap="round" />}
      {level >= 3 && <path d="M10 11h4" strokeLinecap="round" />}
    </svg>
  );
};

const FloatingPresetShelf = ({
  presets,
  selectedPreset,
  onSelectPreset,
  onCreateNew,
  vacuumPower,
  waterFlow,
  vacuumLevels,
  waterLevels,
}: FloatingPresetShelfProps) => {
  const hasPresets = presets.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className="absolute bottom-full left-4 right-4 mb-3"
    >
      {/* Main shelf container */}
      <div className="relative bg-card/95 backdrop-blur-lg border border-border/60 rounded-2xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/40">
          <span className="text-xs font-medium text-muted-foreground">Quick Presets</span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
            <VacuumIconMini level={vacuumPower} />
            <span>{vacuumLevels[vacuumPower]}</span>
            <span className="opacity-40">•</span>
            <WaterIconMini level={waterFlow} />
            <span>{waterLevels[waterFlow]}</span>
          </div>
        </div>

        {/* Preset pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-3">
          <AnimatePresence mode="popLayout">
            {hasPresets ? (
              presets.map((preset, index) => (
                <motion.button
                  key={preset.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05, type: "spring", damping: 20 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`
                    relative flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl 
                    transition-all duration-200
                    ${selectedPreset === preset.id 
                      ? "bg-primary/15 border-2 border-primary shadow-sm" 
                      : "bg-muted/50 border border-border/50 hover:bg-muted/80"
                    }
                  `}
                >
                  {/* Selection indicator */}
                  {selectedPreset === preset.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
                    >
                      <Check className="w-2.5 h-2.5 text-primary-foreground" strokeWidth={3} />
                    </motion.div>
                  )}
                  
                  {/* Preset name */}
                  <span className={`text-xs font-medium whitespace-nowrap ${
                    selectedPreset === preset.id ? "text-primary" : "text-foreground"
                  }`}>
                    {preset.name}
                  </span>
                </motion.button>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2 px-3 py-2 text-muted-foreground"
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-xs">No presets yet</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Add new preset button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onCreateNew}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted/30 border border-dashed border-border/60 hover:bg-muted/50 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">New</span>
          </motion.button>
        </div>
      </div>

      {/* Speech bubble tail */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 -ml-12">
        <svg width="20" height="10" viewBox="0 0 20 10" className="drop-shadow-sm">
          <path 
            d="M0 0 L10 10 L20 0" 
            fill="hsl(var(--card))" 
            stroke="hsl(var(--border))" 
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          {/* Cover the top stroke */}
          <path d="M1 0 L19 0" stroke="hsl(var(--card))" strokeWidth="2" />
        </svg>
      </div>
    </motion.div>
  );
};

export default FloatingPresetShelf;
