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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FloorMap from "@/components/FloorMap";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

const DeviceControl = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [isDocking, setIsDocking] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
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
      // Simulate charging complete after 25 seconds (for demo)
      setTimeout(() => {
        setIsCharging(false);
        setBattery(93);
      }, 25000);
    }, 5000);
  };

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
          onClick={() => navigate("/")}
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

      {/* Status Text */}
      <div className="text-center px-4 py-2">
        <h2 className="text-xl font-light text-foreground">
          {isCharging
            ? "Amphibia will be ready in 25 min"
            : isDocking 
              ? "Returning to dock" 
              : isRunning 
                ? selectedRooms.length > 0
                  ? `Cleaning ${selectedRooms.map(id => roomNames[id]).join(", ")}`
                  : "Cleaning will be finished in 47 min"
                : selectedRooms.length > 0
                  ? `${selectedRooms.length} room${selectedRooms.length > 1 ? "s" : ""} selected`
                  : "Amphibia is ready for cleaning"
          }
        </h2>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-8 py-2">
        <div className="flex items-center gap-1.5">
          <Battery className="w-5 h-5 text-primary" />
          <span className="text-lg text-foreground">{battery}%</span>
        </div>
        <div className="text-center">
          <span className="text-lg text-foreground">Total, {selectedTime}min</span>
        </div>
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

          {/* Floor Selector - Compact bar */}
          <div className="absolute bottom-3 left-3 z-20">
            <div className="flex items-center gap-1 rounded-lg overflow-hidden bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg">
              {floors.map((floor) => (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloor(floor.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                    selectedFloor === floor.id 
                      ? "text-foreground" 
                      : "text-muted-foreground"
                  }`}
                >
                  <span>{floor.name}</span>
                  <Pencil className="w-3 h-3 opacity-60" />
                </button>
              ))}
              <button
                onClick={handleAddFloor}
                className="px-3 py-2 text-sm font-medium text-primary bg-primary/10 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="absolute inset-0">
            <FloorMap 
              isRunning={isRunning} 
              showLabels 
              selectedRooms={selectedRooms}
              onRoomSelect={handleRoomSelect}
            />
          </div>
        </div>
      </div>

      {/* Bottom Control Panel - Card style */}
      <div className="mx-4 mb-4 rounded-2xl bg-card border border-border p-4 safe-area-bottom">
        {/* Mode Buttons */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <button
            onClick={() => setSelectedTab("safe")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTab === "safe"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Safe
          </button>
          <button
            onClick={() => setSelectedTab("normal")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTab === "normal"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Regular
          </button>
          <button
            onClick={() => setSelectedTab("deep")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTab === "deep"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            Deep
          </button>
        </div>

        {/* Mode Description */}
        <p className="text-xs text-muted-foreground text-center mb-4">
          {selectedTab === "safe" && "Avoids obstacles to prevent getting stuck"}
          {selectedTab === "normal" && "Skips risky zones for balanced cleaning"}
          {selectedTab === "deep" && "Cleans every corner of your home"}
        </p>

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
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRunning(!isRunning)}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-primary/30 to-primary/50 flex items-center justify-center border-2 border-primary/40">
              {isRunning ? (
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
              <div className={`w-12 h-12 rounded-full border border-border flex items-center justify-center ${isDocking ? "animate-pulse border-primary" : ""}`}>
                <Home className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="text-xs text-muted-foreground">Return</span>
            </button>
          ) : (
            <div className="w-12" />
          )}
        </div>
      </div>

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
                {/* Map Card */}
                <div className="bg-muted rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-foreground font-medium">Map 1</span>
                    <Upload className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <CloudUpload className="w-4 h-4" />
                      Backup
                    </button>
                    <span className="text-border">|</span>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <RotateCcw className="w-4 h-4" />
                      Restore
                    </button>
                    <span className="text-border">|</span>
                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
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

                {/* Cleaning Order */}
                <button className="w-full flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <ListOrdered className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="text-foreground font-medium text-sm">Cleaning Order</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
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
            <div className="flex items-center gap-4">
              <button 
                className={`text-lg font-semibold flex items-center gap-2`}
              >
                General
                <span className="w-2 h-2 rounded-full bg-primary" />
              </button>
              <button className="text-lg text-muted-foreground">
                Customize
              </button>
            </div>
            <p className="text-sm text-muted-foreground text-left">
              Vacuum and Mop for daily cleaning
            </p>
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

            {/* Cleaning Order */}
            <button className="w-full flex items-center justify-between py-4 border-t border-border">
              <div className="text-left">
                <p className="text-foreground font-medium">Cleaning Order</p>
                <p className="text-sm text-muted-foreground">Set cleaning sequence for maximum efficiency</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
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
