import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Sparkles, Battery } from "lucide-react";

interface RadialCleaningMenuProps {
  isRunning: boolean;
  isCharging: boolean;
  battery: number;
  selectedTime: number;
  onStart: (mode: "safe" | "deep") => void;
  onStop: () => void;
  onCustom: () => void;
}

const RadialCleaningMenu = ({
  isRunning,
  isCharging,
  battery,
  selectedTime,
  onStart,
  onStop,
  onCustom,
}: RadialCleaningMenuProps) => {
  const [showRadial, setShowRadial] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"smooth" | "deep" | "custom" | null>(null);
  const holdTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isDisabled = isCharging && battery < 50;

  // Get last used mode from localStorage
  const getLastMode = (): "safe" | "deep" => {
    const saved = localStorage.getItem("lastCleaningMode");
    return saved === "deep" ? "deep" : "safe";
  };

  const saveLastMode = (mode: "safe" | "deep") => {
    localStorage.setItem("lastCleaningMode", mode);
  };

  // Calculate which option is being hovered based on angle
  const getOptionFromPosition = (clientX: number, clientY: number): "smooth" | "deep" | "custom" | null => {
    if (!buttonRef.current) return null;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Must be outside center button area
    if (distance < 40) return null;
    
    // Calculate angle (0 = right, going counter-clockwise)
    const angle = Math.atan2(-dy, dx) * (180 / Math.PI);
    
    // Map angles to options (positioned at top-left, top-right, top)
    // Smooth: top-left (~135°)
    // Deep: top-right (~45°)
    // Custom: top (~90°)
    
    if (angle > 60 && angle <= 120) return "custom"; // Top
    if (angle > 120 || angle <= -150) return "smooth"; // Top-left
    if (angle > 0 && angle <= 60) return "deep"; // Top-right
    
    return null;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isDisabled) return;
    
    if (isRunning) {
      // If running, just stop
      onStop();
      return;
    }

    // Start hold timer
    holdTimeoutRef.current = setTimeout(() => {
      setShowRadial(true);
      // Capture pointer for tracking outside button
      buttonRef.current?.setPointerCapture(e.pointerId);
    }, 300); // 300ms hold to show radial
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!showRadial) return;
    
    const option = getOptionFromPosition(e.clientX, e.clientY);
    setSelectedOption(option);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }

    if (showRadial) {
      // Release on an option
      if (selectedOption === "smooth") {
        saveLastMode("safe");
        onStart("safe");
      } else if (selectedOption === "deep") {
        saveLastMode("deep");
        onStart("deep");
      } else if (selectedOption === "custom") {
        onCustom();
      }
      
      setShowRadial(false);
      setSelectedOption(null);
      buttonRef.current?.releasePointerCapture(e.pointerId);
    } else if (!isRunning && !isDisabled) {
      // Quick tap - use last mode
      const lastMode = getLastMode();
      onStart(lastMode);
    }
  };

  const handlePointerCancel = (e: React.PointerEvent) => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    setShowRadial(false);
    setSelectedOption(null);
    buttonRef.current?.releasePointerCapture(e.pointerId);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current) {
        clearTimeout(holdTimeoutRef.current);
      }
    };
  }, []);

  // Radial menu option positions (relative to center)
  const radialOptions = [
    { 
      id: "smooth" as const, 
      label: "Smooth",
      sublabel: `${Math.round(selectedTime * 0.7)} min`,
      x: -70, 
      y: -50,
      color: "bg-emerald-500",
      textColor: "text-white"
    },
    { 
      id: "deep" as const, 
      label: "Deep",
      sublabel: `${selectedTime} min`,
      x: 70, 
      y: -50,
      color: "bg-primary",
      textColor: "text-primary-foreground"
    },
    { 
      id: "custom" as const, 
      label: "Custom",
      sublabel: "",
      x: 0, 
      y: -90,
      color: "bg-muted",
      textColor: "text-foreground"
    },
  ];

  const lastMode = getLastMode();

  return (
    <div className="relative flex flex-col items-center">
      {/* Radial Menu Overlay */}
      <AnimatePresence>
        {showRadial && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
              style={{ touchAction: "none" }}
            />
            
            {/* Radial Options */}
            <div className="absolute z-50" style={{ touchAction: "none" }}>
              {radialOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  animate={{ 
                    opacity: 1, 
                    x: option.x, 
                    y: option.y, 
                    scale: selectedOption === option.id ? 1.15 : 1 
                  }}
                  exit={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    delay: index * 0.03 
                  }}
                  className={`absolute flex flex-col items-center justify-center rounded-full transition-all pointer-events-none ${
                    selectedOption === option.id 
                      ? `${option.color} shadow-lg shadow-${option.id === "smooth" ? "emerald-500" : option.id === "deep" ? "primary" : "muted"}/30`
                      : "bg-card border border-border"
                  }`}
                  style={{
                    width: option.id === "custom" ? 56 : 72,
                    height: option.id === "custom" ? 56 : 72,
                    transform: `translate(-50%, -50%) translate(${option.x}px, ${option.y}px)`,
                    left: "50%",
                    top: "50%",
                  }}
                >
                  {option.id === "custom" ? (
                    <Sparkles className={`w-5 h-5 ${selectedOption === option.id ? option.textColor : "text-muted-foreground"}`} />
                  ) : (
                    <>
                      <Play 
                        className={`w-5 h-5 ${selectedOption === option.id ? option.textColor : "text-foreground"}`} 
                        fill={selectedOption === option.id ? "currentColor" : "none"}
                      />
                      <span className={`text-[10px] font-semibold mt-0.5 ${selectedOption === option.id ? option.textColor : "text-foreground"}`}>
                        {option.label}
                      </span>
                      <span className={`text-[9px] ${selectedOption === option.id ? `${option.textColor}/70` : "text-muted-foreground"}`}>
                        {option.sublabel}
                      </span>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Main Play Button */}
      <motion.button
        ref={buttonRef}
        whileTap={{ scale: isDisabled ? 1 : showRadial ? 1 : 0.95 }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        className={`relative flex flex-col items-center z-50 touch-none select-none ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        style={{ touchAction: "none" }}
      >
        <motion.div 
          animate={{ 
            scale: showRadial ? 0.9 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
            isDisabled
              ? "bg-muted border-muted-foreground/30" 
              : showRadial
                ? "bg-primary/20 border-primary"
                : "bg-gradient-to-b from-primary/30 to-primary/50 border-primary/40"
          }`}
        >
          {isDisabled ? (
            <span className="text-xs font-medium text-muted-foreground">{Math.ceil((100 - battery) / 10)} min</span>
          ) : isRunning ? (
            <Pause className="w-7 h-7 text-primary" />
          ) : (
            <Play className="w-7 h-7 text-primary ml-1" />
          )}
        </motion.div>
      </motion.button>

      {/* Mode indicator (when not running) */}
      {!isRunning && !isDisabled && !showRadial && (
        <motion.div 
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 flex items-center gap-1"
        >
          <span className={`text-[10px] font-medium ${lastMode === "safe" ? "text-emerald-500" : "text-primary"}`}>
            {lastMode === "safe" ? "Smooth" : "Deep"}
          </span>
          <span className="text-[9px] text-muted-foreground">• hold for options</span>
        </motion.div>
      )}
    </div>
  );
};

export default RadialCleaningMenu;
