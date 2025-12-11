import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MoreHorizontal,
  Play,
  Pause,
  Settings2,
  Zap,
  ChevronDown,
  ChevronRight,
  Droplets,
  Ban,
  Home,
  ListOrdered,
  CloudUpload,
  RotateCcw,
  Trash2,
  Pencil,
  Upload,
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
  const [selectedTab, setSelectedTab] = useState<"safe" | "normal" | "deep">("normal");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showFloorSelector, setShowFloorSelector] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
  const [showMapEditor, setShowMapEditor] = useState(false);
  const [mapEditorTab, setMapEditorTab] = useState<"edit" | "details">("edit");
  const [vacuumPower, setVacuumPower] = useState(3); // 0-4 scale
  const [waterFlow, setWaterFlow] = useState(2); // 0-4 scale

  // Check if map exists, if not redirect to map creation
  useEffect(() => {
    const hasMap = localStorage.getItem("hasMap");
    if (!hasMap) {
      navigate(`/device/${id}/create-map`);
    }
  }, [id, navigate]);

  const device = {
    id,
    name: "Amphibia",
    status: isRunning ? "Cleaning" : "Charging",
    battery: 93,
    area: 34,
    duration: 50,
  };

  const floors = [
    { id: 1, name: "Floor 1" },
    { id: 2, name: "Floor 2" },
  ];

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
          onClick={() => navigate("/home")}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-foreground">{device.name}</h1>
          <p className="text-xs text-muted-foreground">{device.status}</p>
        </div>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-8 py-4">
        <div className="text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-light text-foreground">{device.area}</span>
            <span className="text-sm text-muted-foreground ml-0.5">m²</span>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-light text-foreground">{device.battery}</span>
            <span className="text-sm text-muted-foreground ml-0.5">%</span>
          </div>
        </div>
        <div className="text-center">
          <div className="flex items-baseline justify-center">
            <span className="text-3xl font-light text-foreground">{device.duration}</span>
            <span className="text-sm text-muted-foreground ml-0.5">min</span>
          </div>
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative mx-4 mb-4">
        {/* Edit Map Button */}
        <button
          onClick={() => setShowMapEditor(true)}
          className="absolute top-2 right-2 z-10 w-11 h-11 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-lg hover:bg-card transition-colors"
        >
          <Pencil className="w-5 h-5 text-foreground" />
        </button>

        {/* Floor Selector Button - On Map */}
        <div className="absolute bottom-2 left-2 z-10">
          <button
            onClick={() => setShowFloorSelector(!showFloorSelector)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card/80 backdrop-blur-sm text-foreground text-sm border border-border/50"
          >
            <span>{floors.find(f => f.id === selectedFloor)?.name}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFloorSelector ? "rotate-180" : ""}`} />
          </button>
          
          <AnimatePresence>
            {showFloorSelector && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute bottom-full left-0 mb-2 rounded-xl bg-card border border-border overflow-hidden min-w-[140px] shadow-lg"
              >
                {floors.map((floor) => (
                  <button
                    key={floor.id}
                    onClick={() => {
                      setSelectedFloor(floor.id);
                      setShowFloorSelector(false);
                    }}
                    className={`w-full py-2.5 px-4 text-left text-sm transition-colors ${
                      selectedFloor === floor.id
                        ? "bg-primary/20 text-primary"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {floor.name}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setShowFloorSelector(false);
                  }}
                  className="w-full py-2.5 px-4 text-left text-sm text-primary border-t border-border"
                >
                  + Add Floor
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map */}
        <div className="h-full min-h-[300px] rounded-2xl overflow-hidden">
          <FloorMap isRunning={isRunning} />
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="bg-card rounded-t-3xl px-6 pb-8 pt-4 safe-area-bottom">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 mb-2">
          <TabButton
            label="Safe"
            active={selectedTab === "safe"}
            onClick={() => setSelectedTab("safe")}
          />
          <TabButton
            label="Normal"
            active={selectedTab === "normal"}
            onClick={() => setSelectedTab("normal")}
          />
          <TabButton
            label="Deep"
            active={selectedTab === "deep"}
            onClick={() => setSelectedTab("deep")}
          />
        </div>
        
        {/* Mode Description */}
        <div className="h-8 mb-4 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-muted-foreground text-center"
            >
              {selectedTab === "safe" && "Cleans carefully without getting stuck on obstacles"}
              {selectedTab === "normal" && "Balanced cleaning while avoiding risky areas"}
              {selectedTab === "deep" && "Thorough cleaning that covers every area"}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Customize Button */}
          <button 
            className="flex flex-col items-center gap-2"
            onClick={() => setShowPersonalize(true)}
          >
            <div className="w-12 h-12 rounded-full bg-card-elevated flex items-center justify-center">
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
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-primary/80 to-primary flex items-center justify-center shadow-lg shadow-primary/30">
              {isRunning ? (
                <Pause className="w-8 h-8 text-primary-foreground" />
              ) : (
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              )}
            </div>
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 -m-1" />
          </motion.button>

          {/* Charging Station Button */}
          <button className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-card-elevated flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Dock</span>
          </button>
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
                  <button className="flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                      <Ban className="w-5 h-5 text-destructive" />
                    </div>
                    <span className="text-foreground font-medium text-sm">No-Go Zones</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
                  </button>
                  <button className="flex items-center gap-3 bg-muted rounded-xl p-4 hover:bg-muted/80 transition-colors">
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
