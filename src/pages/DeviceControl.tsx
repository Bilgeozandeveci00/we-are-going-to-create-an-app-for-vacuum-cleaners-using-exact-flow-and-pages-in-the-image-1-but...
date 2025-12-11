import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MoreHorizontal,
  Play,
  Pause,
  Settings2,
  Zap,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import FloorMap from "@/components/FloorMap";

const DeviceControl = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"all" | "room" | "zone">("all");
  const [selectedFloor, setSelectedFloor] = useState(1);
  const [showFloorSelector, setShowFloorSelector] = useState(false);

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
    status: isRunning ? "Temizleniyor" : "Şarj Ediliyor",
    battery: 93,
    area: 34,
    duration: 50,
  };

  const floors = [
    { id: 1, name: "1. Kat" },
    { id: 2, name: "2. Kat" },
  ];

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

        {/* Map */}
        <div className="h-full min-h-[300px] rounded-2xl overflow-hidden">
          <FloorMap isRunning={isRunning} />
        </div>
      </div>

      {/* Floor Selector */}
      <div className="px-4 mb-4">
        <button
          onClick={() => setShowFloorSelector(!showFloorSelector)}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-card/50 text-primary border border-primary/30"
        >
          <span className="font-medium">Kat Seçimi</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showFloorSelector ? "rotate-180" : ""}`} />
        </button>
        
        {showFloorSelector && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 rounded-xl bg-card overflow-hidden"
          >
            {floors.map((floor) => (
              <button
                key={floor.id}
                onClick={() => {
                  setSelectedFloor(floor.id);
                  setShowFloorSelector(false);
                }}
                className={`w-full py-3 px-4 text-left transition-colors ${
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
                // Add floor logic
                setShowFloorSelector(false);
              }}
              className="w-full py-3 px-4 text-left text-primary border-t border-border"
            >
              + Kat Ekle
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom Control Panel */}
      <div className="bg-card rounded-t-3xl px-6 pb-8 pt-4 safe-area-bottom">
        {/* Tabs */}
        <div className="flex items-center justify-center gap-8 mb-6">
          <TabButton
            label="Tüm"
            active={selectedTab === "all"}
            onClick={() => setSelectedTab("all")}
          />
          <TabButton
            label="Oda"
            active={selectedTab === "room"}
            onClick={() => setSelectedTab("room")}
          />
          <TabButton
            label="Bölge"
            active={selectedTab === "zone"}
            onClick={() => setSelectedTab("zone")}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-center gap-6">
          {/* Customize Button */}
          <button className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-card-elevated flex items-center justify-center">
              <Settings2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xs text-muted-foreground">Kişiselleştir</span>
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
            <span className="text-xs text-muted-foreground">Şarj İstasyonu</span>
          </button>
        </div>
      </div>
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
