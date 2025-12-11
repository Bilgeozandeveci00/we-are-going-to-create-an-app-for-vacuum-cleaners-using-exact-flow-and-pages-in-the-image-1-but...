import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  Play,
  Pause,
  Home,
  MapPin,
  Settings,
  Droplets,
  Wind,
  Battery,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomMap from "@/components/RoomMap";

const DeviceControl = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMode, setSelectedMode] = useState("vacuum");

  const device = {
    id,
    name: "Living Room",
    model: "Roborock S7 MaxV",
    status: isRunning ? "cleaning" : "idle",
    battery: 85,
    area: 45,
    duration: "32 min",
  };

  return (
    <div className="min-h-screen bg-background">
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
        <h1 className="text-lg font-semibold text-foreground">{device.name}</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>

      {/* Map Area */}
      <div className="relative mx-4 h-72 overflow-hidden rounded-2xl bg-card">
        <RoomMap isRunning={isRunning} />
        
        {/* Device Status Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl bg-background/80 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <Battery className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{device.battery}%</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{device.area} m²</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{device.duration}</span>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="mx-4 mt-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Cleaning Mode</h2>
        <div className="flex gap-3">
          <ModeButton
            icon={<Wind className="h-5 w-5" />}
            label="Vacuum"
            active={selectedMode === "vacuum"}
            onClick={() => setSelectedMode("vacuum")}
          />
          <ModeButton
            icon={<Droplets className="h-5 w-5" />}
            label="Mop"
            active={selectedMode === "mop"}
            onClick={() => setSelectedMode("mop")}
          />
          <ModeButton
            icon={
              <>
                <Wind className="h-4 w-4" />
                <Droplets className="h-4 w-4" />
              </>
            }
            label="Both"
            active={selectedMode === "both"}
            onClick={() => setSelectedMode("both")}
          />
        </div>
      </div>

      {/* Quick Settings */}
      <div className="mx-4 mt-6">
        <h2 className="mb-3 text-sm font-medium text-muted-foreground">Quick Settings</h2>
        <div className="grid grid-cols-2 gap-3">
          <SettingCard label="Suction Power" value="Balanced" />
          <SettingCard label="Water Flow" value="Medium" />
          <SettingCard label="Repeat Clean" value="Off" />
          <SettingCard label="Edge Clean" value="On" />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-8 pt-4">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="dark"
            size="icon-lg"
            onClick={() => navigate("/home")}
            className="rounded-full"
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant="teal"
              size="xl"
              onClick={() => setIsRunning(!isRunning)}
              className="h-16 w-16 rounded-full p-0"
            >
              {isRunning ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-1" />
              )}
            </Button>
          </motion.div>
          
          <Button
            variant="dark"
            size="icon-lg"
            onClick={() => navigate(`/device/${id}/settings`)}
            className="rounded-full"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ModeButton = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex flex-1 flex-col items-center gap-2 rounded-xl p-4 transition-all ${
      active
        ? "bg-primary/20 text-primary ring-1 ring-primary/30"
        : "bg-card text-muted-foreground hover:bg-card-elevated"
    }`}
  >
    <div className="flex items-center gap-1">{icon}</div>
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const SettingCard = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-card p-4">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="mt-1 font-medium text-foreground">{value}</p>
  </div>
);

export default DeviceControl;
