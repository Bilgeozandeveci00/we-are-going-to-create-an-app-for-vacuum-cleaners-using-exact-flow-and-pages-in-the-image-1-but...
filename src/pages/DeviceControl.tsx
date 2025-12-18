import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Play,
  Pause,
  Settings2,
  Zap,
  ChevronDown,
  ChevronRight,
  Ban,
  Home,
  ListOrdered,
  CloudUpload,
  RotateCcw,
  Trash2,
  Pencil,
  Upload,
  Clock,
  Layers,
  Wrench,
  Map,
  Volume2,
  Settings,
  MapPin,
  Smartphone,
  Battery,
  Info,
  X,
  Check,
  AlertTriangle,
  Sparkles,
  Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FloorMap from "@/components/FloorMap";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

// Room settings for custom mode
interface RoomCustomSettings {
  mode: "smooth" | "deep" | "skip";
  passes: 1 | 2 | 3;
  edgeCleaning: boolean;
}

const DeviceControl = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [isDocking, setIsDocking] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [battery, setBattery] = useState(93);
  const [selectedTab, setSelectedTab] = useState<"safe" | "normal" | "deep">("normal");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [showFloorSelector, setShowFloorSelector] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [showMapEditor, setShowMapEditor] = useState(false);
  const [mapEditorTab, setMapEditorTab] = useState<"edit" | "details">("edit");
  const [vacuumPower, setVacuumPower] = useState(3); // 0-4 scale
  const [waterFlow, setWaterFlow] = useState(2); // 0-4 scale
  const [showSettings, setShowSettings] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [currentCleaningRoom, setCurrentCleaningRoom] = useState<string | undefined>();
  const [cleanedRooms, setCleanedRooms] = useState<string[]>([]);
  
  // New states for enhancements
  const [showModeInfo, setShowModeInfo] = useState(() => {
    return !localStorage.getItem("mode-info-dismissed");
  });
  const [showCustomMode, setShowCustomMode] = useState(false);
  const [skippedAreas, setSkippedAreas] = useState<string[]>([]);
  const [showSkippedFeedback, setShowSkippedFeedback] = useState(false);
  const [roomCustomSettings, setRoomCustomSettings] = useState<Record<string, RoomCustomSettings>>({});
  const [carpetBoost, setCarpetBoost] = useState(true);
  const [mopWhileVacuum, setMopWhileVacuum] = useState(true);

  // Deep mode stuck simulation - robot gets stuck after 3 seconds
  useEffect(() => {
    if (isRunning && selectedTab === "deep") {
      const timer = setTimeout(() => {
        setIsStuck(true);
        setIsRunning(false);
        setCurrentCleaningRoom(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, selectedTab]);

  // Safe mode completion simulation - cleaning completes after 10 seconds
  // Also simulates skipping risky areas
  useEffect(() => {
    if (isRunning && selectedTab === "safe") {
      const timer = setTimeout(() => {
        setIsCompleted(true);
        setIsRunning(false);
        setCleanedRooms(selectedRooms.length > 0 ? selectedRooms : Object.keys(roomNames));
        setCurrentCleaningRoom(undefined);
        // Simulate skipped areas in safe mode
        setSkippedAreas(["Under sofa edge", "Behind TV stand", "Tight corner in Kitchen"]);
        setShowSkippedFeedback(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, selectedTab, selectedRooms]);

  // Reset to default state
  const resetToDefault = () => {
    setIsCompleted(false);
    setIsCharging(false);
    setIsDocking(false);
    setIsStuck(false);
    setCleanedRooms([]);
    setSelectedRooms([]);
    setSkippedAreas([]);
    setShowSkippedFeedback(false);
    setBattery(93);
  };
  
  // Dismiss mode info tooltip
  const dismissModeInfo = () => {
    setShowModeInfo(false);
    localStorage.setItem("mode-info-dismissed", "true");
  };

  // Initialize room custom settings
  useEffect(() => {
    const defaultSettings: Record<string, RoomCustomSettings> = {};
    Object.keys(roomNames).forEach(roomId => {
      defaultSettings[roomId] = { mode: "smooth", passes: 1, edgeCleaning: true };
    });
    setRoomCustomSettings(defaultSettings);
  }, []);

  // Start custom cleaning
  const startCustomCleaning = () => {
    setShowCustomMode(false);
    setShowModeSelector(false);
    setIsStuck(false);
    setIsCompleted(false);
    setCleanedRooms([]);
    setSkippedAreas([]);
    setShowSkippedFeedback(false);
    setCurrentCleaningRoom(undefined);
    setSelectedTab("normal"); // Use normal behavior for custom
    setIsRunning(true);
  };

  // Simulate room-by-room cleaning progress
  useEffect(() => {
    if (isRunning && !isStuck) {
      const roomsToClean = selectedRooms.length > 0 ? selectedRooms : Object.keys(roomNames);
      let roomIndex = 0;
      
      const cleanNextRoom = () => {
        if (roomIndex < roomsToClean.length && isRunning) {
          setCurrentCleaningRoom(roomsToClean[roomIndex]);
          roomIndex++;
        }
      };
      
      cleanNextRoom();
      const interval = setInterval(() => {
        if (roomIndex < roomsToClean.length) {
          setCleanedRooms(prev => [...prev, roomsToClean[roomIndex - 1]]);
          cleanNextRoom();
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning, isStuck, selectedRooms]);

  // Reset stuck/completed state when starting new cleaning session
  const startCleaning = (mode: "safe" | "normal" | "deep") => {
    setSelectedTab(mode);
    setShowModeSelector(false);
    setIsStuck(false);
    setIsCompleted(false);
    setCleanedRooms([]);
    setCurrentCleaningRoom(undefined);
    setIsRunning(true);
  };

  const handleStartStop = () => {
    if (isRunning) {
      setIsRunning(false);
      setCurrentCleaningRoom(undefined);
    } else if (isStuck) {
      // Continue from stuck state - don't show mode selector
      setIsStuck(false);
      setIsRunning(true);
    } else {
      // Show mode selector for fresh start
      setShowModeSelector(true);
    }
  };

  // Reset all app data for testing
  const resetAllAppData = () => {
    localStorage.removeItem("hasDevice");
    localStorage.removeItem("hasMap");
    localStorage.removeItem(`floors-${id}`);
    localStorage.removeItem("mode-info-dismissed");
    localStorage.removeItem(`pending-floor-${id}`);
    // Navigate to splash screen
    navigate("/");
  };

  const roomNames: Record<string, string> = {
    living: "Living Room",
    dining: "Dining",
    hallway: "Hallway",
    bedroom1: "Bedroom 1",
    bedroom2: "Bedroom 2",
    bathroom: "Bathroom",
    kitchen: "Kitchen",
    laundry: "Laundry",
  };

  // Estimated cleaning time per room (in minutes)
  const roomTimes: Record<string, number> = {
    living: 12,
    dining: 8,
    hallway: 5,
    bedroom1: 10,
    bedroom2: 9,
    bathroom: 6,
    kitchen: 8,
    laundry: 4,
  };

  const totalRoomTime = 50; // Total time for all rooms
  const selectedTime = selectedRooms.length > 0 
    ? selectedRooms.reduce((acc, roomId) => acc + (roomTimes[roomId] || 0), 0)
    : totalRoomTime;

  const handleRoomSelect = (roomId: string) => {
    if (isRunning) return; // Can't select while running
    setSelectedRooms(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  const handleDock = () => {
    setIsRunning(false);
    setIsDocking(true);
    // Simulate docking process
    setTimeout(() => {
      setIsDocking(false);
      setIsCharging(true);
    }, 5000);
  };

  // Charging animation - battery fills up over 3 seconds with whole numbers
  useEffect(() => {
    if (isCharging && battery < 100) {
      const remainingPercent = 100 - Math.floor(battery);
      const intervalMs = 3000 / remainingPercent; // Distribute time evenly
      const timer = setInterval(() => {
        setBattery(prev => {
          const next = Math.floor(prev) + 1;
          if (next >= 100) {
            clearInterval(timer);
            setIsCharging(false);
            return 100;
          }
          return next;
        });
      }, intervalMs);
      return () => clearInterval(timer);
    }
  }, [isCharging]);

  // Battery drain when running
  useEffect(() => {
    if (isRunning) {
      const timer = setTimeout(() => {
        setBattery(15);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isRunning]);

  // Check if map exists, if not redirect to map creation
  useEffect(() => {
    const hasMap = localStorage.getItem("hasMap");
    if (!hasMap) {
      navigate(`/device/${id}/create-map`);
    }
  }, [id, navigate]);

  const getDeviceStatus = () => {
    if (isDocking) return "Returning to dock...";
    if (isRunning) return "Cleaning";
    return "Charging";
  };

  const device = {
    id,
    name: "Amphibia",
    status: getDeviceStatus(),
    area: 34,
    duration: 50,
  };

  // Load floors from localStorage
  const [floors, setFloors] = useState<{ id: number; name: string }[]>(() => {
    const saved = localStorage.getItem(`floors-${id}`);
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Floor 1" }];
  });

  // Sync floors from localStorage when returning from map creation
  useEffect(() => {
    const saved = localStorage.getItem(`floors-${id}`);
    if (saved) {
      setFloors(JSON.parse(saved));
    }
  }, [id]);

  const handleAddFloor = () => {
    const newFloorId = floors.length + 1;
    // Store pending floor info so mapping simulation knows it's adding a new floor
    localStorage.setItem(`pending-floor-${id}`, JSON.stringify({ id: newFloorId, name: `Floor ${newFloorId}` }));
    navigate(`/device/${id}/create-map`);
  };

  const vacuumLevels = ["Off", "Quiet", "Balanced", "Turbo", "Max"];
  const waterLevels = ["Off", "Low", "Medium", "High", "Custom"];

  // SVG icons for vacuum power levels
  const VacuumIcon = ({ level, active }: { level: number; active: boolean }) => {
    const color = active ? "currentColor" : "currentColor";
    const opacity = active ? 1 : 0.5;
    
    if (level === 0) return <Ban className="w-5 h-5" style={{ opacity }} />;
    
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ opacity }}>
        <circle cx="12" cy="12" r="3" />
        {level >= 1 && <path d="M12 5v-2" />}
        {level >= 2 && <><path d="M17 7l1.5-1.5" /><path d="M7 7L5.5 5.5" /></>}
        {level >= 3 && <><path d="M19 12h2" /><path d="M5 12H3" /></>}
        {level >= 4 && <><path d="M17 17l1.5 1.5" /><path d="M7 17l-1.5 1.5" /><path d="M12 19v2" /></>}
      </svg>
    );
  };

  // SVG icons for water flow levels
  const WaterIcon = ({ level, active }: { level: number; active: boolean }) => {
    const opacity = active ? 1 : 0.5;
    
    if (level === 0) return <Ban className="w-5 h-5" style={{ opacity }} />;
    
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity }}>
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
        {level >= 2 && <path d="M12 8v4" strokeLinecap="round" />}
        {level >= 3 && <path d="M10 11h4" strokeLinecap="round" />}
        {level === 4 && <circle cx="12" cy="14" r="2" fill="currentColor" />}
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-foreground"
          onClick={() => navigate("/home")}
        >
          <ChevronDown className="h-5 w-5 rotate-90" />
        </Button>
        <h1 className="text-base font-medium text-foreground">{device.name}</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-foreground"
          onClick={() => setShowSettings(true)}
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Status Bar - More Prominent */}
      <div className="mx-4 mb-2">
        <motion.div 
          className={`rounded-2xl p-4 ${
            isStuck 
              ? "bg-destructive/20 border border-destructive/30" 
              : isCompleted 
                ? "bg-emerald-500/20 border border-emerald-500/30"
                : isCharging
                  ? "bg-amber-500/20 border border-amber-500/30"
                  : isRunning
                    ? "bg-primary/15 border border-primary/30"
                    : "bg-card border border-border/50"
          }`}
          animate={isRunning || isCharging ? { opacity: [0.9, 1, 0.9] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className={`w-3 h-3 rounded-full ${
                  isStuck ? "bg-destructive" : isCompleted ? "bg-emerald-500" : isCharging ? "bg-amber-500" : isRunning ? "bg-primary" : "bg-muted-foreground"
                }`}
                animate={isRunning || isCharging ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <h2 className={`text-lg font-semibold ${
                isStuck ? "text-destructive" : isCompleted ? "text-emerald-500" : isCharging ? "text-amber-500" : "text-foreground"
              }`}>
                {isStuck
                  ? "Robot got stuck"
                  : isCompleted
                    ? "Cleaning completed"
                    : isCharging
                      ? "Charging - 25 min"
                      : isDocking 
                        ? "Returning to dock" 
                        : isRunning 
                          ? selectedRooms.length > 0
                            ? `Cleaning ${selectedRooms.length} room${selectedRooms.length > 1 ? "s" : ""}`
                            : "Cleaning in progress"
                          : selectedRooms.length > 0
                            ? `${selectedRooms.length} room${selectedRooms.length > 1 ? "s" : ""} selected`
                            : "Ready for cleaning"
                }
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Battery className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">{battery}%</span>
              </div>
            </div>
          </div>
          
          {/* Estimated time - contextual with selection */}
          {!isCompleted && !isStuck && !isCharging && (
            <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Estimated time for {selectedRooms.length > 0 ? "selected rooms" : "all rooms"}</span>
              <span className="text-sm font-medium text-primary">{selectedTime} min</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative mx-4 flex flex-col min-h-0">
        {/* Map Container */}
        <div className="flex-1 relative rounded-2xl overflow-hidden bg-background">
          {/* Edit Map Button */}
          <button
            onClick={() => setShowMapEditor(true)}
            className="absolute top-3 right-3 z-10 w-10 h-10 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-md hover:bg-card transition-colors"
          >
            <Pencil className="w-4 h-4 text-foreground" />
          </button>

          {/* Map */}
          <div className="absolute inset-0">
            <FloorMap 
              isRunning={isRunning} 
              isStuck={isStuck}
              isCompleted={isCompleted}
              showLabels 
              selectedRooms={selectedRooms}
              onRoomSelect={handleRoomSelect}
              currentCleaningRoom={currentCleaningRoom}
              cleanedRooms={cleanedRooms}
            />
          </div>

          {/* Tap to dismiss overlay when completed */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetToDefault}
                className="absolute inset-0 z-20 flex items-end justify-center pb-4 cursor-pointer"
              >
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-card/90 backdrop-blur-sm px-4 py-2 rounded-full border border-border/50 shadow-lg"
                >
                  <span className="text-sm text-muted-foreground">Tap anywhere to continue</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Control Panel - Simplified */}
      <div className="mx-4 mb-4 rounded-2xl bg-card border border-border p-4 safe-area-bottom">

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Settings Button */}
          <button 
            className="flex flex-col items-center gap-1"
            onClick={() => setShowPersonalize(true)}
          >
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Customize</span>
          </button>

          {/* Play/Pause Button */}
          <motion.button
            whileTap={{ scale: isCharging ? 1 : 0.95 }}
            onClick={isCharging ? undefined : handleStartStop}
            className="relative flex flex-col items-center"
            disabled={isCharging}
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 ${
              isCharging 
                ? "bg-muted border-muted-foreground/30" 
                : "bg-gradient-to-b from-primary/30 to-primary/50 border-primary/40"
            }`}>
              {isCharging ? (
                <span className="text-xs font-medium text-muted-foreground">25 min</span>
              ) : isRunning ? (
                <Pause className="w-7 h-7 text-primary" />
              ) : (
                <Play className="w-7 h-7 text-primary ml-1" />
              )}
            </div>
          </motion.button>

          {/* Return Button - Only visible when running */}
          {isRunning ? (
            <button 
              className="flex flex-col items-center gap-1"
              onClick={handleDock}
              disabled={isDocking}
            >
              <div className={`w-12 h-12 rounded-full border border-border flex items-center justify-center ${isDocking ? "animate-pulse border-primary bg-primary/10" : "bg-muted/50"}`}>
                <span className="text-xs font-semibold text-muted-foreground">Return</span>
              </div>
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>
      </div>

      {/* Mode Selector Sheet - Full height vertical layout */}
      <Sheet open={showModeSelector} onOpenChange={setShowModeSelector}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-[75vh]">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Start Cleaning</h2>
              <button 
                onClick={() => setShowModeSelector(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground text-left">Choose how Amphibia should clean</p>
          </SheetHeader>
          
          {/* Info Tooltip - shows once */}
          <AnimatePresence>
            {showModeInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-3"
              >
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Select a mode to start cleaning immediately. Each mode has different behaviors.
                  </p>
                </div>
                <button 
                  onClick={dismissModeInfo}
                  className="text-xs text-primary mt-2 font-medium"
                >
                  Got it
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-3 flex-1">
            {/* Smooth Mode */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => startCleaning("safe")}
              className="w-full flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 hover:bg-emerald-500/20 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8" stroke="hsl(158, 64%, 52%)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M12 12l4-4" stroke="hsl(158, 64%, 52%)" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="2" fill="hsl(158, 64%, 52%)"/>
                  <path d="M16 16l2 2" stroke="hsl(158, 64%, 52%)" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-foreground font-bold text-lg">Smooth</h3>
                <p className="text-muted-foreground text-sm">Avoids risky areas, won&apos;t get stuck</p>
                <p className="text-emerald-500 text-xs mt-1 font-medium">Best when you&apos;re away</p>
              </div>
              <div className="text-right">
                <div className="text-emerald-500 font-bold text-lg">~35</div>
                <div className="text-muted-foreground text-xs">min</div>
              </div>
            </motion.button>

            {/* Deep Mode - Highlighted */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => startCleaning("deep")}
              className="w-full flex items-center gap-4 bg-primary/15 border-2 border-primary/50 rounded-2xl p-5 hover:bg-primary/25 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary/20 rounded-full">
                <span className="text-[10px] text-primary font-semibold">THOROUGH</span>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="2" stroke="hsl(var(--primary))" strokeWidth="2"/>
                  <path d="M8 8h8M8 12h8M8 16h8" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="18" cy="6" r="3" fill="hsl(var(--primary))" fillOpacity="0.3" stroke="hsl(var(--primary))" strokeWidth="1"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-foreground font-bold text-lg">Deep</h3>
                <p className="text-muted-foreground text-sm">Cleans every corner thoroughly</p>
                <p className="text-primary text-xs mt-1 font-medium">May need assistance if stuck</p>
              </div>
              <div className="text-right">
                <div className="text-primary font-bold text-lg">~75</div>
                <div className="text-muted-foreground text-xs">min</div>
              </div>
            </motion.button>

            {/* Custom Mode */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowModeSelector(false);
                setShowCustomMode(true);
              }}
              className="w-full flex items-center gap-4 bg-violet-500/10 border border-violet-500/30 rounded-2xl p-5 hover:bg-violet-500/20 transition-all group"
            >
              <div className="w-16 h-16 rounded-2xl bg-violet-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6h4M12 6h8" stroke="hsl(258, 90%, 66%)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 12h8M16 12h4" stroke="hsl(258, 90%, 66%)" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M4 18h2M10 18h10" stroke="hsl(258, 90%, 66%)" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="10" cy="6" r="2" fill="hsl(258, 90%, 66%)"/>
                  <circle cx="14" cy="12" r="2" fill="hsl(258, 90%, 66%)"/>
                  <circle cx="8" cy="18" r="2" fill="hsl(258, 90%, 66%)"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-foreground font-bold text-lg">Custom</h3>
                <p className="text-muted-foreground text-sm">Different settings per room</p>
                <p className="text-violet-500 text-xs mt-1 font-medium">Configure before starting</p>
              </div>
              <div className="flex items-center gap-1 text-violet-500">
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Custom Mode Sheet */}
      <Sheet open={showCustomMode} onOpenChange={setShowCustomMode}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-[85vh] overflow-y-auto">
          <SheetHeader className="pb-4 sticky top-0 bg-card z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Custom Cleaning</h2>
              <button onClick={() => setShowCustomMode(false)}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </SheetHeader>
          
          <div className="space-y-6 pb-24">
            {/* Global Settings */}
            <div className="bg-muted/50 rounded-2xl p-4 space-y-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-primary" />
                Global Settings
              </h3>
              
              {/* Carpet Boost */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Carpet Boost</p>
                  <p className="text-xs text-muted-foreground">Auto-increase suction on carpets</p>
                </div>
                <button 
                  onClick={() => setCarpetBoost(!carpetBoost)}
                  className={`w-12 h-6 rounded-full transition-colors ${carpetBoost ? "bg-primary" : "bg-muted"}`}
                >
                  <motion.div 
                    className="w-5 h-5 bg-white rounded-full shadow"
                    animate={{ x: carpetBoost ? 26 : 2 }}
                  />
                </button>
              </div>
              
              {/* Mop While Vacuum */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Mop While Vacuuming</p>
                  <p className="text-xs text-muted-foreground">Clean and mop in one pass</p>
                </div>
                <button 
                  onClick={() => setMopWhileVacuum(!mopWhileVacuum)}
                  className={`w-12 h-6 rounded-full transition-colors ${mopWhileVacuum ? "bg-primary" : "bg-muted"}`}
                >
                  <motion.div 
                    className="w-5 h-5 bg-white rounded-full shadow"
                    animate={{ x: mopWhileVacuum ? 26 : 2 }}
                  />
                </button>
              </div>
            </div>

            {/* Room-by-Room Settings */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Home className="w-4 h-4 text-primary" />
                Room Settings
              </h3>
              <div className="space-y-3">
                {Object.entries(roomNames).map(([roomId, name]) => {
                  const settings = roomCustomSettings[roomId] || { mode: "smooth", passes: 1, edgeCleaning: true };
                  return (
                    <div key={roomId} className="bg-muted/50 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-foreground">{name}</span>
                        <div className="flex gap-1">
                          {(["smooth", "deep", "skip"] as const).map((mode) => (
                            <button
                              key={mode}
                              onClick={() => setRoomCustomSettings(prev => ({
                                ...prev,
                                [roomId]: { ...settings, mode }
                              }))}
                              className={`px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                                settings.mode === mode 
                                  ? mode === "smooth" ? "bg-emerald-500/20 text-emerald-500"
                                    : mode === "deep" ? "bg-primary/20 text-primary"
                                    : "bg-muted-foreground/20 text-muted-foreground"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {mode === "smooth" ? "Smooth" : mode === "deep" ? "Deep" : "Skip"}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      {settings.mode !== "skip" && (
                        <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                          {/* Passes */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Passes:</span>
                            <div className="flex gap-1">
                              {([1, 2, 3] as const).map((pass) => (
                                <button
                                  key={pass}
                                  onClick={() => setRoomCustomSettings(prev => ({
                                    ...prev,
                                    [roomId]: { ...settings, passes: pass }
                                  }))}
                                  className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                                    settings.passes === pass 
                                      ? "bg-primary text-primary-foreground" 
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {pass}x
                                </button>
                              ))}
                            </div>
                          </div>
                          
                          {/* Edge Cleaning */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Edges:</span>
                            <button
                              onClick={() => setRoomCustomSettings(prev => ({
                                ...prev,
                                [roomId]: { ...settings, edgeCleaning: !settings.edgeCleaning }
                              }))}
                              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                                settings.edgeCleaning 
                                  ? "bg-primary text-primary-foreground" 
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {settings.edgeCleaning ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* No-Go Zones Quick Access */}
            <button 
              onClick={() => {
                setShowCustomMode(false);
                navigate(`/device/${id}/no-go-zones`);
              }}
              className="w-full flex items-center gap-3 bg-destructive/10 border border-destructive/20 rounded-xl p-4"
            >
              <Ban className="w-5 h-5 text-destructive" />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">No-Go Zones</p>
                <p className="text-xs text-muted-foreground">Set areas to avoid</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Start Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-card via-card to-transparent">
            <Button 
              onClick={startCustomCleaning}
              className="w-full h-12 rounded-2xl bg-violet-500 hover:bg-violet-600 text-white font-semibold"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Custom Cleaning
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Skipped Areas Feedback Sheet */}
      <Sheet open={showSkippedFeedback && skippedAreas.length > 0} onOpenChange={setShowSkippedFeedback}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold text-foreground">Cleaning Report</h2>
            </div>
          </SheetHeader>
          
          <div className="space-y-4 pb-6">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-500">Cleaned Successfully</span>
              </div>
              <p className="text-xs text-muted-foreground">{cleanedRooms.length} rooms cleaned thoroughly</p>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-500">Areas Skipped (Risky)</span>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                In Smooth mode, the robot avoided these areas to prevent getting stuck:
              </p>
              <div className="space-y-2">
                {skippedAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {area}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-2">
                <strong className="text-foreground">Tip:</strong> To clean these areas, use Deep mode when you&apos;re home to help if the robot gets stuck.
              </p>
            </div>
            
            <Button 
              onClick={() => setShowSkippedFeedback(false)}
              variant="outline"
              className="w-full"
            >
              Got it
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Map Editor Sheet */}
      <Sheet open={showMapEditor} onOpenChange={setShowMapEditor}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-auto max-h-[70vh]">
          <SheetHeader className="pb-4">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setMapEditorTab("edit")}
                className={`text-lg font-semibold relative ${mapEditorTab === "edit" ? "text-foreground" : "text-muted-foreground"}`}
              >
                Edit Map
                {mapEditorTab === "edit" && (
                  <motion.div layoutId="map-tab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setMapEditorTab("details")}
                className={`text-lg font-semibold relative ${mapEditorTab === "details" ? "text-foreground" : "text-muted-foreground"}`}
              >
                Map Details
                {mapEditorTab === "details" && (
                  <motion.div layoutId="map-tab" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            </div>
          </SheetHeader>
          
          <div className="space-y-4 pb-4">
            {mapEditorTab === "edit" ? (
              <>
                {/* Room Names Section */}
                <div>
                  <p className="text-sm font-medium text-foreground mb-3">Room Names</p>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                    {Object.entries(roomNames).map(([roomId, name]) => (
                      <div key={roomId} className="flex items-center gap-2 bg-muted rounded-xl p-3">
                        <input
                          type="text"
                          defaultValue={name}
                          className="flex-1 bg-transparent text-sm text-foreground outline-none border-b border-transparent focus:border-primary transition-colors"
                          onBlur={(e) => {
                            // In a real app, this would update the room name
                            console.log(`Rename ${roomId} to ${e.target.value}`);
                          }}
                        />
                        <Pencil className="w-3 h-3 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors"
                    onClick={() => {
                      setShowMapEditor(false);
                      navigate(`/device/${id}/no-go-zones`);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <Ban className="w-5 h-5 text-destructive" />
                    </div>
                    <span className="text-foreground font-medium text-sm">No-Go Zones</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                  <button 
                    className="flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors"
                    onClick={() => {
                      setShowMapEditor(false);
                      navigate(`/device/${id}/room-editor`);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Home className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">Edit Rooms</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Map details and statistics</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Personalize Sheet */}
      <Sheet open={showPersonalize} onOpenChange={setShowPersonalize}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border">
          <SheetHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-left">General</h2>
          </SheetHeader>
          
          <div className="space-y-6">
            {/* Vacuum Power */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground font-medium">Vacuum Power</span>
                <span className="text-primary text-sm">{vacuumLevels[vacuumPower]}</span>
              </div>
              <div className="flex items-center bg-muted rounded-full p-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => setVacuumPower(level)}
                    className={`flex-1 py-2.5 rounded-full flex items-center justify-center transition-colors ${
                      vacuumPower === level ? "bg-card shadow" : ""
                    }`}
                  >
                    <VacuumIcon level={level} active={vacuumPower === level} />
                  </button>
                ))}
              </div>
            </div>

            {/* Water Flow */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground font-medium">Water Flow</span>
                <span className="text-primary text-sm">{waterLevels[waterFlow]}</span>
              </div>
              <div className="flex items-center bg-muted rounded-full p-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => setWaterFlow(level)}
                    className={`flex-1 py-2.5 rounded-full flex items-center justify-center transition-colors ${
                      waterFlow === level ? "bg-card shadow" : ""
                    }`}
                  >
                    <WaterIcon level={level} active={waterFlow === level} />
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Management */}
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground font-medium">Floors</span>
                <button 
                  onClick={handleAddFloor}
                  className="text-primary text-sm font-medium"
                >
                  + Add Floor
                </button>
              </div>
              <div className="space-y-2">
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => {
                      setSelectedFloor(floor.id);
                      setShowPersonalize(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                      selectedFloor === floor.id ? "bg-primary/20 border border-primary/30" : "bg-muted"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="text-foreground text-sm flex-1 text-left">{floor.name}</span>
                    {selectedFloor === floor.id && (
                      <span className="text-xs text-primary">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </SheetContent>
      </Sheet>

      {/* Settings Sheet */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-[85vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-center">Settings</h2>
          </SheetHeader>
          
          <div className="space-y-4 pb-8">
            {/* Cleaning History Card */}
            <div className="bg-muted rounded-2xl p-4">
              <button 
                className="w-full flex items-center gap-3 mb-4"
                onClick={() => {
                  setShowSettings(false);
                  navigate(`/device/${id}/cleaning-history`);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Cleaning History</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-xl p-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-light text-foreground">{device.duration}</span>
                    <span className="text-sm text-muted-foreground ml-1">min</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Last cleaning time</p>
                </div>
                <div className="bg-card rounded-xl p-4">
                  <div className="flex items-baseline">
                    <span className="text-3xl font-light text-foreground">{device.area}</span>
                    <span className="text-sm text-muted-foreground ml-1">m²</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Last cleaning area</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <span className="text-sm text-muted-foreground">Total cleaning time and area</span>
                <span className="text-sm text-foreground font-medium">508h | 23Km²</span>
              </div>
            </div>

            {/* Schedules */}
            <button 
              className="w-full flex items-center gap-3 bg-muted rounded-2xl p-4 hover:bg-muted/80 transition-colors"
              onClick={() => {
                setShowSettings(false);
                navigate(`/device/${id}/schedules`);
              }}
            >
              <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="text-foreground font-medium flex-1 text-left">Schedules</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            {/* Floor Cleaning Settings & Maintenance */}
            <div className="bg-muted rounded-2xl divide-y divide-border/50">
              <button 
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setShowSettings(false);
                  navigate(`/device/${id}/floor-settings`);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Floor Cleaning Settings</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setShowSettings(false);
                  navigate(`/device/${id}/maintenance`);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Maintenance</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Manage Maps, Robot Sound, Robot Settings */}
            <div className="bg-muted rounded-2xl divide-y divide-border/50">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/80 transition-colors">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Map className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Manage Maps</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setShowSettings(false);
                  navigate(`/device/${id}/robot-sound`);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Robot Sound</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setShowSettings(false);
                  navigate(`/device/${id}/robot-settings`);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Robot Settings</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Pin n Go & Remote Control */}
            <div className="bg-muted rounded-2xl divide-y divide-border/50">
              <button className="w-full flex items-center gap-3 p-4 hover:bg-muted/80 transition-colors">
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Pin n Go</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
              <button 
                className="w-full flex items-center gap-3 p-4 hover:bg-muted/80 transition-colors"
                onClick={() => {
                  setShowSettings(false);
                  navigate(`/device/${id}/remote-control`);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-primary" />
                </div>
                <span className="text-foreground font-medium flex-1 text-left">Remote Control</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Reset App Data - For Testing */}
            <div className="mt-8 pt-4 border-t border-destructive/20">
              <p className="text-xs text-destructive mb-3 text-center font-medium">FOR TESTING ONLY</p>
              <button 
                onClick={resetAllAppData}
                className="w-full flex items-center justify-center gap-2 bg-destructive/10 border border-destructive/30 rounded-2xl p-4 hover:bg-destructive/20 transition-colors"
              >
                <Trash2 className="w-5 h-5 text-destructive" />
                <span className="text-destructive font-medium">Reset All App Data</span>
              </button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Removes device, map, and all settings to restart from scratch
              </p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

const TabButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`relative px-4 py-2 text-sm font-medium transition-colors ${
      active ? "text-foreground" : "text-muted-foreground"
    }`}
  >
    {label}
    {active && (
      <motion.div
        layoutId="tab-indicator"
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
      />
    )}
  </button>
);

export default DeviceControl;
