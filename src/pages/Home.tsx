import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Home as HomeIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeviceCarousel from "@/components/DeviceCarousel";

interface Device {
  id: string;
  name: string;
  battery: number;
  image?: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [devices, setDevices] = useState<Device[]>([]);

  // Check if we just added a device
  useEffect(() => {
    const hasDevice = localStorage.getItem("hasDevice");
    if (hasDevice === "true") {
      setDevices([{ id: "1", name: "Amphibia", battery: 93 }]);
    }
  }, []);

  const removeDevice = (deviceId: string) => {
    const newDevices = devices.filter((d) => d.id !== deviceId);
    if (newDevices.length === 0) {
      localStorage.removeItem("hasDevice");
    }
    setDevices(newDevices);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-0 pb-24 overflow-hidden">
        {devices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center flex-1 w-full px-6 gap-10"
          >
            {/* Simple crosshair + button */}
            <button
              onClick={() => navigate("/add-device")}
              className="relative w-40 h-40 flex items-center justify-center group"
            >
              {/* Circle outline */}
              <div className="absolute w-full h-full rounded-full border-2 border-muted-foreground/50 group-hover:border-primary transition-colors" />
              
              {/* Crosshair lines */}
              <div className="absolute w-full h-0.5 bg-muted-foreground/50 group-hover:bg-primary transition-colors" />
              <div className="absolute h-full w-0.5 bg-muted-foreground/50 group-hover:bg-primary transition-colors" />
              
              {/* Plus icon in center */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-background flex items-center justify-center">
                <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>

            <Button
              onClick={() => navigate("/add-device")}
              variant="outline"
              className="w-full max-w-sm h-14 rounded-full border-2 border-muted-foreground/60 bg-transparent text-foreground text-lg font-medium hover:border-primary hover:text-primary transition-colors"
            >
              Add device
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full h-full"
          >
            <DeviceCarousel
              devices={devices}
              onRemoveDevice={removeDevice}
              onAddDevice={() => navigate("/add-device")}
              onEnterDevice={(id) => navigate(`/device/${id}`)}
            />
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPath={location.pathname} onAddDevice={() => navigate("/add-device")} hasDevices={devices.length > 0} />
    </div>
  );
};

export const BottomNav = ({ currentPath }: { currentPath: string; onAddDevice?: () => void; hasDevices?: boolean }) => {
  const navigate = useNavigate();
  
  const isDeviceActive = currentPath === "/home";
  const isNotificationsActive = currentPath === "/notifications";
  const isProfileActive = currentPath === "/profile";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/90 backdrop-blur-xl safe-area-bottom">
      <div className="flex items-center justify-around py-3 px-6 max-w-md mx-auto">
        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="flex items-center justify-center w-12 h-12 rounded-full transition-colors"
        >
          <Bell 
            className={`h-6 w-6 ${isNotificationsActive ? "text-primary" : "text-muted-foreground"}`} 
            fill={isNotificationsActive ? "currentColor" : "none"} 
          />
        </button>

        {/* Device - Main button as pill */}
        <button
          onClick={() => navigate("/home")}
          className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all ${
            isDeviceActive 
              ? "bg-primary text-primary-foreground" 
              : "bg-card border border-border text-muted-foreground"
          }`}
        >
          <HomeIcon className="h-5 w-5" fill={isDeviceActive ? "currentColor" : "none"} />
          <span className="text-sm font-medium">Device</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="flex items-center justify-center w-12 h-12 rounded-full transition-colors"
        >
          <User 
            className={`h-6 w-6 ${isProfileActive ? "text-primary" : "text-muted-foreground"}`} 
            fill={isProfileActive ? "currentColor" : "none"} 
          />
        </button>
      </div>
    </nav>
  );
};

export default HomePage;