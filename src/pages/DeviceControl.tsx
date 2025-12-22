import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import FloatingPresetShelf from "@/components/FloatingPresetShelf";
import BatteryIndicator from "@/components/BatteryIndicator";
// BatteryUsageBar removed - integrated into BatteryIndicator
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
  Smartphone,
  Battery,
  Info,
  X,
  Check,
  AlertTriangle,
  Sparkles,
  Route,
  Plus,
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
  const [isPaused, setIsPaused] = useState(false);
  const [isDocking, setIsDocking] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [isStuck, setIsStuck] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSkippedPopup, setShowSkippedPopup] = useState(false);
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
  const [showModeInfo, setShowModeInfo] = useState(false);
  const [showCustomMode, setShowCustomMode] = useState(false);
  const [skippedAreas, setSkippedAreas] = useState<{id: string; name: string; x: number; y: number; width: number; height: number}[]>([]);
  const [showSkippedOnMap, setShowSkippedOnMap] = useState(false);
  const [hasBeenStuckOnce, setHasBeenStuckOnce] = useState(false);
  const [stuckPosition, setStuckPosition] = useState<{x: number; y: number} | null>(null);
  const [dangerZones, setDangerZones] = useState<{id: string; x: number; y: number}[]>([]);
  const [isResumedFromStuck, setIsResumedFromStuck] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [roomCustomSettings, setRoomCustomSettings] = useState<Record<string, RoomCustomSettings>>({});
  const [carpetBoost, setCarpetBoost] = useState(true);
  const [mopWhileVacuum, setMopWhileVacuum] = useState(true);
  const [showRoomNameEditor, setShowRoomNameEditor] = useState(false);
  const [editableRoomNames, setEditableRoomNames] = useState<Record<string, string>>({});
  const [selectedPreset, setSelectedPreset] = useState<string | null>("preset-1");
  const [editingPreset, setEditingPreset] = useState<string | null>(null);
  const [showNewPresetModal, setShowNewPresetModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState("");
  const [customPresets, setCustomPresets] = useState([
    { id: "preset-1", name: "Quick Clean", description: "Smooth mode everywhere, 1 pass", settings: {} as Record<string, RoomCustomSettings> },
    { id: "preset-2", name: "Deep Kitchen", description: "Deep clean kitchen, smooth elsewhere", settings: {} as Record<string, RoomCustomSettings> },
    { id: "preset-3", name: "Bedroom Focus", description: "Deep clean bedrooms only", settings: {} as Record<string, RoomCustomSettings> },
  ]);

  // Deep mode stuck simulation - robot gets stuck after 3 seconds, but only once
  useEffect(() => {
    if (isRunning && selectedTab === "deep" && !hasBeenStuckOnce) {
      const timer = setTimeout(() => {
        setIsStuck(true);
        setIsRunning(false);
        setCurrentCleaningRoom(undefined);
        setHasBeenStuckOnce(true);
        // Save stuck position (bathroom area for example)
        setStuckPosition({ x: 112, y: 140 });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, selectedTab, hasBeenStuckOnce]);

  // Deep mode completion after resuming from stuck - 6 seconds
  useEffect(() => {
    if (isRunning && selectedTab === "deep" && isResumedFromStuck) {
      const timer = setTimeout(() => {
        setIsCompleted(true);
        setIsRunning(false);
        setCleanedRooms(selectedRooms.length > 0 ? selectedRooms : Object.keys(roomNames));
        setCurrentCleaningRoom(undefined);
        setIsResumedFromStuck(false);
        // Mark stuck position as danger zone
        if (stuckPosition) {
          setDangerZones(prev => [...prev, { id: `danger-${Date.now()}`, x: stuckPosition.x, y: stuckPosition.y }]);
        }
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, selectedTab, isResumedFromStuck, stuckPosition, selectedRooms]);

  // Safe mode completion simulation - cleaning completes after 10 seconds
  // Also simulates skipping risky areas
  useEffect(() => {
    if (isRunning && selectedTab === "safe") {
      const timer = setTimeout(() => {
        setIsCompleted(true);
        setIsRunning(false);
        setIsPaused(false);
        setCleanedRooms(selectedRooms.length > 0 ? selectedRooms : Object.keys(roomNames));
        setCurrentCleaningRoom(undefined);
        // Simulate skipped areas in safe mode - shown on map
        setSkippedAreas([
          { id: "skip1", name: "Under sofa", x: 28, y: 42, width: 25, height: 5 },
          { id: "skip2", name: "Behind TV", x: 28, y: 68, width: 20, height: 4 },
          { id: "skip3", name: "Kitchen corner", x: 22, y: 178, width: 10, height: 10 },
        ]);
        setShowSkippedOnMap(true);
        // Show popup for 4 seconds
        setShowSkippedPopup(true);
        setTimeout(() => setShowSkippedPopup(false), 4000);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, selectedTab, selectedRooms]);

  // Custom mode completion - 8 seconds
  useEffect(() => {
    if (isRunning && selectedTab === "normal") {
      const timer = setTimeout(() => {
        setIsCompleted(true);
        setIsRunning(false);
        setCleanedRooms(selectedRooms.length > 0 ? selectedRooms : Object.keys(roomNames));
        setCurrentCleaningRoom(undefined);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, selectedTab, selectedRooms]);

  // Post-completion: Start docking then charging sequence
  const handleCompletionTap = () => {
    setIsCompleted(false);
    setIsDocking(true);
    
    // After 2 seconds of docking, start charging
    setTimeout(() => {
      setIsDocking(false);
      setIsCharging(true);
      // Note: charging animation handled by useEffect - will fill to 100% in 4 seconds
    }, 2000);
  };

  // After charging completes, reset selection state
  useEffect(() => {
    if (!isCharging && battery >= 100) {
      // Clean up after charging complete
      setCleanedRooms([]);
      setSelectedRooms([]);
      setSkippedAreas([]);
      setShowSkippedOnMap(false);
      setHasBeenStuckOnce(false);
      setIsResumedFromStuck(false);
      setStuckPosition(null);
    }
  }, [isCharging, battery]);

  // Reset to default state (full reset including danger zones)
  const resetToDefault = () => {
    setIsCompleted(false);
    setIsCharging(false);
    setIsDocking(false);
    setIsStuck(false);
    setCleanedRooms([]);
    setSelectedRooms([]);
    setSkippedAreas([]);
    setShowSkippedOnMap(false);
    setHasBeenStuckOnce(false);
    setIsResumedFromStuck(false);
    setStuckPosition(null);
    setDangerZones([]);
    setBattery(93);
  };
  
  // Dismiss mode info tooltip (can be reopened via ? button)
  const dismissModeInfo = () => {
    setShowModeInfo(false);
  };

  // Initialize room custom settings
  useEffect(() => {
    const defaultSettings: Record<string, RoomCustomSettings> = {};
    Object.keys(roomNames).forEach(roomId => {
      defaultSettings[roomId] = { mode: "smooth", passes: 1, edgeCleaning: true };
    });
    setRoomCustomSettings(defaultSettings);
  }, []);

  // Room data definitions
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

  // Start custom cleaning
  const startCustomCleaning = () => {
    const cleaningTime = selectedRooms.length > 0 
      ? selectedRooms.reduce((acc, roomId) => acc + (roomTimes[roomId] || 0), 0)
      : totalRoomTime;
    
    setShowCustomMode(false);
    setShowModeSelector(false);
    setIsStuck(false);
    setIsCompleted(false);
    setIsPaused(false);
    setCleanedRooms([]);
    setSkippedAreas([]);
    setShowSkippedOnMap(false);
    setHasBeenStuckOnce(false);
    setCurrentCleaningRoom(undefined);
    setSelectedTab("normal");
    setRemainingTime(cleaningTime * 60); // Convert to seconds
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

  // Countdown remaining time while cleaning
  useEffect(() => {
    if (isRunning && !isStuck && remainingTime > 0) {
      const timer = setInterval(() => {
        setRemainingTime(prev => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, isStuck, remainingTime]);

  // Reset stuck/completed state when starting new cleaning session
  const startCleaning = (mode: "safe" | "normal" | "deep") => {
    const cleaningTime = selectedRooms.length > 0 
      ? selectedRooms.reduce((acc, roomId) => acc + (roomTimes[roomId] || 0), 0)
      : totalRoomTime;
    
    setSelectedTab(mode);
    setShowModeSelector(false);
    setIsStuck(false);
    setIsCompleted(false);
    setIsPaused(false);
    setCleanedRooms([]);
    setCurrentCleaningRoom(undefined);
    setRemainingTime(cleaningTime * 60); // Convert to seconds
    setIsRunning(true);
  };

  const handleStartStop = () => {
    if (isRunning) {
      // Pause cleaning
      setIsRunning(false);
      setIsPaused(true);
      setCurrentCleaningRoom(undefined);
    } else if (isPaused) {
      // Resume from paused state
      setIsPaused(false);
      setIsRunning(true);
    } else if (isStuck) {
      // Continue from stuck state - don't show mode selector
      setIsStuck(false);
      setIsRunning(true);
      setIsResumedFromStuck(true);
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
    setIsPaused(false);
    setIsDocking(true);
    // Simulate docking process
    setTimeout(() => {
      setIsDocking(false);
      setIsCharging(true);
    }, 5000);
  };

  // Charging animation - battery fills up over 4 seconds to 100%
  useEffect(() => {
    if (isCharging && battery < 100) {
      const remainingPercent = 100 - Math.floor(battery);
      const intervalMs = 4000 / remainingPercent; // 4 seconds total
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

  // Battery drain when running - 5% per second
  useEffect(() => {
    if (isRunning && !isStuck) {
      const timer = setInterval(() => {
        setBattery(prev => {
          const next = prev - 5;
          if (next <= 10) {
            // Low battery - stop and dock
            setIsRunning(false);
            setIsDocking(true);
            setTimeout(() => {
              setIsDocking(false);
              setIsCharging(true);
            }, 3000);
            return 10;
          }
          return next;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isRunning, isStuck]);

  // Check if map exists, if not redirect to map creation
  useEffect(() => {
    const hasMap = localStorage.getItem("hasMap");
    if (!hasMap) {
      navigate(`/device/${id}/create-map`);
    }
  }, [id, navigate]);

  const getDeviceStatus = () => {
    if (isStuck) return "Need help - Robot stuck";
    if (isCompleted) return "Cleaning completed";
    if (isDocking) return "Returning to dock...";
    if (isRunning) return "Cleaning in progress";
    if (isCharging) return `Charging ${battery}%`;
    return "Ready";
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

  const vacuumLevels = ["Off", "Low", "Balanced", "Turbo", "Max"];
  const waterLevels = ["Off", "Low", "Medium", "High", "Max"];

  // SVG icons for vacuum power levels
  const VacuumIcon = ({ level, active, size = 20 }: { level: number; active: boolean; size?: number }) => {
    const opacity = active ? 1 : 0.5;
    const iconSize = size === 20 ? "w-5 h-5" : "w-3.5 h-3.5";
    
    if (level === 0) return <Ban className={iconSize} style={{ opacity }} />;
    
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity }} className="text-primary">
        <circle cx="12" cy="12" r="3" />
        {level >= 1 && <path d="M12 5v-2" />}
        {level >= 2 && <><path d="M17 7l1.5-1.5" /><path d="M7 7L5.5 5.5" /></>}
        {level >= 3 && <><path d="M19 12h2" /><path d="M5 12H3" /></>}
        {level >= 4 && <><path d="M17 17l1.5 1.5" /><path d="M7 17l-1.5 1.5" /><path d="M12 19v2" /></>}
      </svg>
    );
  };

  // SVG icons for water flow levels
  const WaterIcon = ({ level, active, size = 20 }: { level: number; active: boolean; size?: number }) => {
    const opacity = active ? 1 : 0.5;
    const iconSize = size === 20 ? "w-5 h-5" : "w-3.5 h-3.5";
    
    if (level === 0) return <Ban className={iconSize} style={{ opacity }} />;
    
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity }} className="text-primary">
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
        <button 
          className="w-10 h-10 rounded-lg bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-md hover:bg-card transition-colors"
          onClick={() => setShowSettings(true)}
        >
          <MoreHorizontal className="w-4 h-4 text-foreground" />
        </button>
      </header>

      {/* Status Bar - Hero Focus */}
      <div className="mx-4 mb-3">
        <motion.div 
          className={`rounded-2xl p-5 ${
            isStuck 
              ? "bg-destructive/10 border border-destructive/20" 
              : isCompleted 
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : isCharging
                  ? "bg-emerald-500/5 border border-emerald-500/20"
                  : isPaused
                    ? "bg-amber-500/10 border border-amber-500/20"
                    : isRunning
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-card/80 border border-border/30"
          }`}
          animate={isRunning || isCharging ? { opacity: [0.95, 1, 0.95] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {/* Main Content Row */}
          <div className="flex items-center justify-between gap-4">
            {/* Left - Hero Statement */}
            <div className="flex-1">
              {/* Primary Statement - Large and Clear */}
              <div className="flex items-center gap-2.5 mb-1">
                <motion.div 
                  className={`w-2.5 h-2.5 rounded-full ${
                    isStuck ? "bg-destructive" : isCompleted ? "bg-emerald-500" : isCharging ? "bg-emerald-500" : isPaused ? "bg-amber-500" : isRunning ? "bg-primary" : "bg-primary"
                  }`}
                  animate={isRunning || isCharging ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] } : {}}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                <h2 className={`text-lg font-semibold ${
                  isStuck ? "text-destructive" : isCompleted ? "text-emerald-500" : isCharging ? "text-emerald-500" : isPaused ? "text-amber-500" : "text-foreground"
                }`}>
                  {isStuck
                    ? "Amphibia needs help"
                    : isCompleted
                      ? "Cleaning complete"
                      : isCharging
                        ? "Charging"
                        : isDocking 
                          ? "Returning to dock"
                          : isPaused
                            ? "Paused"
                            : isRunning 
                              ? "Cleaning in progress"
                              : selectedRooms.length > 0
                                ? `${selectedRooms.length} room${selectedRooms.length !== 1 ? 's' : ''} selected`
                                : "Amphibia is ready"
                  }
                </h2>
              </div>
              
              {/* Secondary Info - Contextual */}
              <p className="text-sm text-muted-foreground">
                {isStuck
                  ? "Please move me to continue"
                  : isCompleted
                    ? `${cleanedRooms.length} room${cleanedRooms.length !== 1 ? 's' : ''} cleaned`
                    : isCharging
                      ? `Full in ~25 min`
                      : isDocking 
                        ? "Heading home"
                        : isPaused
                          ? "Press Start to continue"
                          : isRunning 
                            ? `${currentCleaningRoom ? roomNames[currentCleaningRoom] || currentCleaningRoom : 'Working'} • ${Math.floor(remainingTime / 60)}:${String(remainingTime % 60).padStart(2, '0')} left`
                            : selectedRooms.length > 0
                              ? `Ready to clean • ${selectedTime} min`
                              : `All ${Object.keys(roomNames).length} rooms • ${selectedTime} min`
                }
              </p>
            </div>
            
            {/* Right - Battery Visual with integrated usage */}
            <BatteryIndicator 
              percentage={battery} 
              isCharging={isCharging}
              size="md"
              estimatedUsage={!isRunning && !isCompleted && !isStuck && !isCharging && !isDocking ? Math.round(selectedTime * 0.65) : undefined}
            />
          </div>
          
          {/* Progress when running */}
          {isRunning && (
            <div className="mt-3 pt-3 border-t border-border/20">
              <div className="h-1.5 bg-muted-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${(cleanedRooms.length / (selectedRooms.length > 0 ? selectedRooms.length : Object.keys(roomNames).length)) * 100}%` 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative flex flex-col min-h-0">
        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden">
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
              skippedAreas={skippedAreas}
              showSkippedAreas={showSkippedOnMap}
              dangerZones={dangerZones}
              onDangerZoneRemove={(zoneId) => setDangerZones(prev => prev.filter(z => z.id !== zoneId))}
            />
          </div>

          {/* Tap to dismiss overlay when completed */}
          <AnimatePresence>
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCompletionTap}
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

          {/* Docking overlay */}
          <AnimatePresence>
            {isDocking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-card/95 backdrop-blur-sm px-6 py-4 rounded-xl border border-border/50 shadow-xl flex flex-col items-center gap-2"
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <Home className="w-8 h-8 text-primary" />
                  </motion.div>
                  <span className="text-sm font-medium">Returning to dock...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Charging overlay - only show when battery < 50% */}
          <AnimatePresence>
            {isCharging && !isRunning && battery < 50 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-card/95 backdrop-blur-sm px-6 py-4 rounded-xl border border-border/50 shadow-xl flex flex-col items-center gap-2"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <Battery className="w-8 h-8 text-green-500" />
                  </motion.div>
                  <span className="text-sm font-medium">Charging...</span>
                  <span className="text-xs text-muted-foreground">{battery}%</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skipped Areas Popup - Shows after smooth mode completion */}
          <AnimatePresence>
            {showSkippedPopup && skippedAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-4 left-4 right-4 z-30"
              >
                <div className="bg-amber-500/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-amber-400/50 shadow-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-white">
                      {skippedAreas.length} area{skippedAreas.length > 1 ? 's' : ''} skipped
                    </span>
                  </div>
                  <p className="text-xs text-white/90">
                    {skippedAreas.map(a => a.name).join(', ')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="mx-4 mb-4 space-y-3">
        {/* Main Control - Now above customize bar for hierarchy */}
        <div className="flex items-center justify-center">
          {isRunning ? (
            /* Running state - Stop and Return buttons side by side */
            <div className="flex items-center gap-3 w-full">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleStartStop}
                className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-b from-destructive to-destructive/80 border border-destructive/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                <Pause className="w-5 h-5 text-destructive-foreground" />
                <span className="text-sm font-medium text-destructive-foreground">Stop</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleDock}
                disabled={isDocking}
                className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-b from-muted to-muted/80 border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <Home className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium text-foreground">Return</span>
              </motion.button>
            </div>
          ) : isPaused ? (
            /* Paused state - Start and Return buttons side by side */
            <div className="flex items-center gap-3 w-full">
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleStartStop}
                className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-b from-primary to-primary/80 border border-primary/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]"
              >
                <Play className="w-5 h-5 text-primary-foreground" fill="currentColor" />
                <span className="text-sm font-medium text-primary-foreground">Start</span>
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                onClick={handleDock}
                disabled={isDocking}
                className="flex-1 flex items-center justify-center gap-3 py-3.5 rounded-2xl bg-gradient-to-b from-muted to-muted/80 border border-border/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)]"
              >
                <Home className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium text-foreground">Return</span>
              </motion.button>
            </div>
          ) : (isCharging && battery < 50) ? (
            /* Charging state - disabled */
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground">{Math.ceil((100 - battery) / 10)}m</span>
              </div>
            </div>
          ) : isStuck ? (
            /* Stuck state - Continue Cleaning button */
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={handleStartStop}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-amber-500 to-amber-600 border border-amber-400/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-shadow"
            >
              <Play className="w-5 h-5 text-white" fill="currentColor" />
              <span className="text-sm font-medium text-white">Continue Cleaning</span>
            </motion.button>
          ) : (
            /* Idle state - Start button matching preset shelf design */
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowModeSelector(true)}
              className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-b from-primary to-primary/80 border border-primary/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] transition-shadow"
            >
              <Play className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              <span className="text-sm font-medium text-primary-foreground">Start Clean</span>
            </motion.button>
          )}
        </div>

        {/* Settings Bar - Below buttons */}
        <AnimatePresence>
          {!isDocking && !isCharging && !isCompleted && !isStuck && (
            <FloatingPresetShelf
              vacuumPower={vacuumPower}
              waterFlow={waterFlow}
              currentFloor={floors[selectedFloor - 1]?.name || `Floor ${selectedFloor}`}
              onCustomizeClick={() => setShowPersonalize(true)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mode Selector Sheet - Compact */}
      <Sheet open={showModeSelector} onOpenChange={setShowModeSelector}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border [&>button]:hidden">
          <SheetHeader className="pb-3">
            <h2 className="text-lg font-bold text-foreground text-center">Choose Cleaning Mode</h2>
          </SheetHeader>
          
          {/* Info Panel - Full expanded guide */}
          <AnimatePresence>
            {showModeInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mb-4 space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Cleaning Modes Explained</span>
                    <button 
                      onClick={dismissModeInfo}
                      className="p-1.5 rounded-full hover:bg-muted"
                    >
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Smooth Mode Card */}
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-emerald-500 mb-1">Smooth Mode</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          Safe and reliable cleaning that avoids tight spaces and obstacles. The robot stays on open paths to prevent getting stuck.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-[10px] font-medium text-emerald-600">Best when away</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-[10px] font-medium text-emerald-600">No supervision</span>
                          <span className="px-2 py-0.5 bg-emerald-500/20 rounded-full text-[10px] font-medium text-emerald-600">May skip areas</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Deep Mode Card */}
                  <div className="bg-blue-700/10 border border-blue-500/30 rounded-2xl p-4 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-700 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.6)]">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-blue-400 mb-1">Deep Mode</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          Thorough cleaning that reaches every corner, under furniture, and along edges. Maximizes coverage for the cleanest results.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-blue-500/20 rounded-full text-[10px] font-medium text-blue-400">Full coverage</span>
                          <span className="px-2 py-0.5 bg-blue-500/20 rounded-full text-[10px] font-medium text-blue-400">Under furniture</span>
                          <span className="px-2 py-0.5 bg-blue-500/20 rounded-full text-[10px] font-medium text-blue-400">May need help</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Mode Card */}
                  <div className="bg-muted/50 border border-border rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted-foreground/20 flex items-center justify-center flex-shrink-0">
                        <Settings2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-foreground mb-1">Custom Mode</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                          Create personalized cleaning presets with different settings for each room. Set suction power, water flow, and passes individually.
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">Per-room settings</span>
                          <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">Save presets</span>
                          <span className="px-2 py-0.5 bg-muted rounded-full text-[10px] font-medium text-muted-foreground">Full control</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mode Buttons */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => startCleaning("safe")}
                className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 rounded-xl py-3.5"
              >
                <Play className="w-4 h-4 text-white" fill="white" />
                <span className="text-white font-semibold text-sm">Smooth</span>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => startCleaning("deep")}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-700 rounded-xl py-3.5 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <Play className="w-4 h-4 text-white" fill="white" />
                <span className="text-white font-semibold text-sm">Deep</span>
              </motion.button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowModeSelector(false);
                setShowCustomMode(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-muted border border-border rounded-xl py-3.5"
            >
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-foreground font-medium text-sm">Custom</span>
            </motion.button>

            {/* Show info toggle when hidden */}
            {!showModeInfo && (
              <button 
                onClick={() => setShowModeInfo(true)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground py-1"
              >
                <Info className="w-3 h-3" />
                What do these modes do?
              </button>
            )}
          </div>
          
          {/* Cancel */}
          <Button 
            variant="ghost" 
            onClick={() => setShowModeSelector(false)}
            className="w-full text-muted-foreground h-10"
          >
            Cancel
          </Button>
        </SheetContent>
      </Sheet>

      {/* Custom Mode Sheet */}
      <Sheet open={showCustomMode} onOpenChange={setShowCustomMode}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-[85vh] overflow-y-auto [&>button]:hidden">
          <SheetHeader className="pb-2">
            <h2 className="text-lg font-semibold text-foreground text-center">Custom Cleaning</h2>
          </SheetHeader>
          
          {/* Start Button - Same size as other start buttons */}
          <div className="py-4">
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={startCustomCleaning}
              disabled={!selectedPreset}
              className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl transition-all ${
                selectedPreset 
                  ? "bg-gradient-to-b from-primary to-primary/80 border border-primary/40 shadow-[0_2px_8px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.1)]" 
                  : "bg-muted cursor-not-allowed"
              }`}
            >
              <Play className={`w-5 h-5 ${selectedPreset ? "text-primary-foreground" : "text-muted-foreground"}`} fill="currentColor" />
              <span className={`font-medium text-sm ${selectedPreset ? "text-primary-foreground" : "text-muted-foreground"}`}>
                {selectedPreset ? "Start Custom Clean" : "Select a Preset"}
              </span>
            </motion.button>
          </div>

          {/* Presets Section */}
          <div className="space-y-4 pb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Your Presets</h3>
              <button 
                onClick={() => setShowNewPresetModal(true)}
                className="text-xs text-primary font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                New Preset
              </button>
            </div>

            <div className="space-y-2">
              {customPresets.map((preset) => (
                <motion.div
                  key={preset.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPreset(preset.id)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedPreset === preset.id 
                      ? "bg-primary/10 border-primary" 
                      : "bg-muted/50 border-transparent hover:border-border"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPreset === preset.id 
                          ? "border-primary bg-primary" 
                          : "border-muted-foreground"
                      }`}>
                        {selectedPreset === preset.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{preset.name}</p>
                        <p className="text-xs text-muted-foreground">{preset.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingPreset(preset.id);
                        }}
                        className="p-2 rounded-lg hover:bg-muted"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setCustomPresets(prev => prev.filter(p => p.id !== preset.id));
                          if (selectedPreset === preset.id) {
                            setSelectedPreset(null);
                          }
                        }}
                        className="p-2 rounded-lg hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

            {customPresets.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No presets yet</p>
                  <p className="text-xs mt-1">Create one to get started</p>
                </div>
              )}

              {/* Add Preset Option */}
              <motion.div
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewPresetModal(true)}
                className="p-4 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Add Preset</p>
                    <p className="text-xs text-muted-foreground">Create a custom cleaning configuration</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Settings (shown when preset selected) */}
            {selectedPreset && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-muted/30 rounded-xl p-4 space-y-3"
              >
                <p className="text-xs font-medium text-muted-foreground">Quick toggles for this clean:</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCarpetBoost(!carpetBoost)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      carpetBoost ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Carpet Boost {carpetBoost ? "ON" : "OFF"}
                  </button>
                  <button 
                    onClick={() => setMopWhileVacuum(!mopWhileVacuum)}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                      mopWhileVacuum ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Mop {mopWhileVacuum ? "ON" : "OFF"}
                  </button>
                </div>
              </motion.div>
            )}

            {/* No-Go Zones */}
            <button 
              onClick={() => {
                setShowCustomMode(false);
                navigate(`/device/${id}/no-go-zones`);
              }}
              className="w-full flex items-center gap-3 bg-muted/50 border border-border rounded-xl p-3"
            >
              <Ban className="w-4 h-4 text-destructive" />
              <span className="text-sm text-foreground">Manage No-Go Zones</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>

            {/* Schedule */}
            <button 
              onClick={() => {
                setShowCustomMode(false);
                navigate(`/device/${id}/schedules`);
              }}
              className="w-full flex items-center gap-3 bg-muted/50 border border-border rounded-xl p-3"
            >
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Go to Schedule</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
            </button>
          </div>

          {/* Cancel */}
          <Button 
            variant="ghost" 
            onClick={() => setShowCustomMode(false)}
            className="w-full text-muted-foreground"
          >
            Cancel
          </Button>
        </SheetContent>
      </Sheet>

      {/* Preset Editor Sheet */}
      <Sheet open={!!editingPreset} onOpenChange={() => setEditingPreset(null)}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-[80vh] overflow-y-auto [&>button]:hidden">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setEditingPreset(null)} className="text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-lg font-semibold text-foreground">Edit Preset</h2>
              <button onClick={() => setEditingPreset(null)} className="text-primary font-medium text-sm">
                Save
              </button>
            </div>
          </SheetHeader>
          
          <div className="space-y-6 pb-8">
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
          </div>
        </SheetContent>
      </Sheet>

      {/* New Preset Modal */}
      <Sheet open={showNewPresetModal} onOpenChange={setShowNewPresetModal}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border [&>button]:hidden">
          <SheetHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-center">Create New Preset</h2>
          </SheetHeader>
          
          <div className="space-y-4 pb-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Preset Name</label>
              <input
                type="text"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                placeholder="e.g., Weekend Deep Clean"
                className="w-full bg-muted border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={30}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              After creating, you can customize room settings by tapping the edit button.
            </p>

            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => {
                  setShowNewPresetModal(false);
                  setNewPresetName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (newPresetName.trim()) {
                    const newId = `preset-${Date.now()}`;
                    setCustomPresets(prev => [...prev, {
                      id: newId,
                      name: newPresetName.trim(),
                      description: "Custom configuration",
                      settings: { ...roomCustomSettings }
                    }]);
                    setSelectedPreset(newId);
                    setShowNewPresetModal(false);
                    setNewPresetName("");
                  }
                }}
                disabled={!newPresetName.trim()}
                className="flex-1"
              >
                Create Preset
              </Button>
            </div>
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
                {/* Edit Names Button */}
                <button 
                  onClick={() => {
                    setShowMapEditor(false);
                    setEditableRoomNames({...roomNames});
                    setShowRoomNameEditor(true);
                  }}
                  className="flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium text-sm">Edit Room Names</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                </button>

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
              <div className="space-y-4">
                {/* Map Statistics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{Object.keys(roomNames).length}</div>
                    <div className="text-xs text-muted-foreground mt-1">Rooms</div>
                  </div>
                  <div className="bg-muted rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">78</div>
                    <div className="text-xs text-muted-foreground mt-1">Total m²</div>
                  </div>
                </div>

                {/* Room List with Areas */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-muted-foreground px-1">Room Areas</h4>
                  <div className="space-y-2">
                    {[
                      { id: "living", name: "Living Room", area: 18 },
                      { id: "kitchen", name: "Kitchen", area: 12 },
                      { id: "bedroom1", name: "Master Bed", area: 14 },
                      { id: "bedroom2", name: "Bedroom", area: 12 },
                      { id: "dining", name: "Dining", area: 10 },
                      { id: "bathroom", name: "Bath", area: 6 },
                      { id: "hallway", name: "Hall", area: 4 },
                      { id: "laundry", name: "Laundry", area: 2 },
                    ].map((room) => (
                      <div key={room.id} className="flex items-center justify-between bg-muted/50 rounded-lg px-4 py-3">
                        <span className="text-sm text-foreground">{room.name}</span>
                        <span className="text-sm font-medium text-primary">{room.area} m²</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Actions */}
                <div className="space-y-2 pt-2">
                  <button className="flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <CloudUpload className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">Backup Map</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                  <button className="flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors w-full">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium text-sm">Restore Map</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                  <button className="flex items-center gap-3 bg-destructive/10 rounded-xl p-4 hover:bg-destructive/20 transition-colors w-full">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </div>
                    <span className="text-destructive font-medium text-sm">Delete Map</span>
                    <ChevronRight className="w-4 h-4 text-destructive/50 ml-auto" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Room Name Editor - Full Screen with Map */}
      <AnimatePresence>
        {showRoomNameEditor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <button 
                onClick={() => setShowRoomNameEditor(false)}
                className="text-muted-foreground"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-base font-semibold text-foreground">Edit Room Names</h2>
              <div className="w-5" /> {/* Spacer for alignment */}
            </div>
            
            {/* Map with Room Name Labels */}
            <div className="flex-1 relative h-[60vh]">
              <FloorMap 
                isRunning={false} 
                isStuck={false}
                isCompleted={false}
                showLabels={false}
                selectedRooms={[]}
                onRoomSelect={() => {}}
                currentCleaningRoom={undefined}
                cleanedRooms={[]}
              />
              
              {/* Editable Room Name Overlays */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Living Room */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="absolute pointer-events-auto"
                  style={{ top: '28%', left: '12%' }}
                >
                  <input
                    value={editableRoomNames.living || "Living Room"}
                    onChange={(e) => setEditableRoomNames(prev => ({ ...prev, living: e.target.value }))}
                    className="bg-card/95 backdrop-blur-md text-foreground text-base font-semibold px-4 py-3 rounded-xl border-2 border-primary shadow-xl text-center w-36 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </motion.div>

                {/* Kitchen */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                  className="absolute pointer-events-auto"
                  style={{ top: '42%', left: '55%' }}
                >
                  <input
                    value={editableRoomNames.kitchen || "Kitchen"}
                    onChange={(e) => setEditableRoomNames(prev => ({ ...prev, kitchen: e.target.value }))}
                    className="bg-card/95 backdrop-blur-md text-foreground text-base font-semibold px-4 py-3 rounded-xl border-2 border-primary shadow-xl text-center w-32 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </motion.div>

                {/* Bedroom 1 */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute pointer-events-auto"
                  style={{ top: '62%', left: '8%' }}
                >
                  <input
                    value={editableRoomNames.bedroom1 || "Bedroom 1"}
                    onChange={(e) => setEditableRoomNames(prev => ({ ...prev, bedroom1: e.target.value }))}
                    className="bg-card/95 backdrop-blur-md text-foreground text-base font-semibold px-4 py-3 rounded-xl border-2 border-primary shadow-xl text-center w-32 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </motion.div>

                {/* Bedroom 2 */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="absolute pointer-events-auto"
                  style={{ top: '62%', left: '50%' }}
                >
                  <input
                    value={editableRoomNames.bedroom2 || "Bedroom 2"}
                    onChange={(e) => setEditableRoomNames(prev => ({ ...prev, bedroom2: e.target.value }))}
                    className="bg-card/95 backdrop-blur-md text-foreground text-base font-semibold px-4 py-3 rounded-xl border-2 border-primary shadow-xl text-center w-32 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </motion.div>

                {/* Bathroom */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute pointer-events-auto"
                  style={{ top: '18%', left: '60%' }}
                >
                  <input
                    value={editableRoomNames.bathroom || "Bathroom"}
                    onChange={(e) => setEditableRoomNames(prev => ({ ...prev, bathroom: e.target.value }))}
                    className="bg-card/95 backdrop-blur-md text-foreground text-base font-semibold px-4 py-3 rounded-xl border-2 border-primary shadow-xl text-center w-32 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                  />
                </motion.div>
              </div>
            </div>
            
            {/* Save Button CTA */}
            <div className="p-4 pb-8">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Tap on a room name to edit it
              </p>
              <Button 
                onClick={() => {
                  console.log("Saved room names:", editableRoomNames);
                  setShowRoomNameEditor(false);
                }}
                className="w-full h-14 text-lg font-semibold rounded-2xl"
              >
                <Check className="w-5 h-5 mr-2" />
                Save Changes
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personalize Sheet */}
      <Sheet open={showPersonalize} onOpenChange={setShowPersonalize}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border">
          <SheetHeader className="pb-5">
            <h2 className="text-lg font-semibold text-foreground text-left">Customize</h2>
          </SheetHeader>
          
          <div className="space-y-6">
            {/* Vacuum Power */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground font-medium">Vacuum Power</span>
                <span className="text-primary text-sm font-medium">{vacuumLevels[vacuumPower]}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => setVacuumPower(level)}
                    className={`py-3 rounded-xl flex items-center justify-center transition-all ${
                      vacuumPower === level 
                        ? "bg-primary/15 border-2 border-primary shadow-sm" 
                        : "bg-muted border-2 border-transparent hover:bg-muted/80"
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
                <span className="text-sky-400 text-sm font-medium">{waterLevels[waterFlow]}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4].map((level) => (
                  <button
                    key={level}
                    onClick={() => setWaterFlow(level)}
                    className={`py-3 rounded-xl flex items-center justify-center transition-all ${
                      waterFlow === level 
                        ? "bg-sky-400/15 border-2 border-sky-400 shadow-sm" 
                        : "bg-muted border-2 border-transparent hover:bg-muted/80"
                    }`}
                  >
                    <WaterIcon level={level} active={waterFlow === level} />
                  </button>
                ))}
              </div>
            </div>

            {/* Floor Management */}
            <div className="border-t border-border/50 pt-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground font-medium">Floors</span>
              </div>
              <div className="space-y-2">
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => {
                      setSelectedFloor(floor.id);
                      setShowPersonalize(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl transition-all ${
                      selectedFloor === floor.id 
                        ? "bg-primary/15 border-2 border-primary" 
                        : "bg-muted border-2 border-transparent hover:bg-muted/80"
                    }`}
                  >
                    <Layers className={`w-5 h-5 ${selectedFloor === floor.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-foreground text-sm font-medium flex-1 text-left">{floor.name}</span>
                    {selectedFloor === floor.id && (
                      <span className="text-xs text-primary font-medium px-2 py-0.5 bg-primary/10 rounded-md">Active</span>
                    )}
                  </button>
                ))}
                
                {/* Add Floor Button */}
                <button 
                  onClick={handleAddFloor}
                  className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <span className="text-muted-foreground group-hover:text-primary transition-colors text-lg font-light">+</span>
                  <span className="text-muted-foreground group-hover:text-primary transition-colors text-sm font-medium">Add Floor</span>
                </button>
              </div>
            </div>

          </div>
        </SheetContent>
      </Sheet>

      {/* Settings Sheet */}
      <Sheet open={showSettings} onOpenChange={setShowSettings}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-auto max-h-[85vh] overflow-y-auto">
          <SheetHeader className="pb-4">
            <h2 className="text-lg font-semibold text-foreground text-center">Settings</h2>
          </SheetHeader>
          
          <div className="space-y-4 pb-8">

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

            {/* Maintenance */}
            <button 
              className="w-full flex items-center gap-3 bg-muted rounded-2xl p-4 hover:bg-muted/80 transition-colors"
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

            {/* Remote Control */}
            <button 
              className="w-full flex items-center gap-3 bg-muted rounded-2xl p-4 hover:bg-muted/80 transition-colors"
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

            {/* Reset App Data - For Testing */}
            <div className="mt-4 pt-3 border-t border-destructive/10">
              <button 
                onClick={resetAllAppData}
                className="w-full flex items-center justify-center gap-1.5 text-destructive/60 hover:text-destructive transition-colors py-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-xs">Reset App (Testing)</span>
              </button>
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
