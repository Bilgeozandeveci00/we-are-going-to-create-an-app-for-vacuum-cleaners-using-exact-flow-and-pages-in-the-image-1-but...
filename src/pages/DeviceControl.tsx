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
  Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FloorMap from "@/components/FloorMap";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const DeviceControl = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"safe" | "normal" | "deep">("normal");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showFloorSelector, setShowFloorSelector] = useState(false);
  const [showPersonalize, setShowPersonalize] = useState(false);
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
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-card/50 backdrop-blur-sm"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </Button>

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
                    <Wind className={`w-5 h-5 ${vacuumPower === level ? "text-foreground" : "text-muted-foreground"}`} />
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
                    <Droplets className={`w-5 h-5 ${waterFlow === level ? "text-foreground" : "text-muted-foreground"}`} />
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
