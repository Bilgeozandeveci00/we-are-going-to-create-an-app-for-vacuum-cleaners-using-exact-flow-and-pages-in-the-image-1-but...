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

  // Check if we just added a device - add 3 example devices for testing
  useEffect(() => {
    const hasDevice = localStorage.getItem("hasDevice");
    if (hasDevice === "true") {
      setDevices([
        { id: "device-1", name: "Amphibia", battery: 93 },
        { id: "device-2", name: "RoboMax Pro", battery: 78 },
        { id: "device-3", name: "CleanBot X1", battery: 45 },
      ]);
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
            className="relative flex flex-col items-center justify-center flex-1 w-full px-6"
          >
            {/* Ambient background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-[80px]" />
            </div>

            {/* Hero illustration area */}
            <div className="relative z-10 flex flex-col items-center gap-8">
              {/* Glowing platform with robot silhouette */}
              <button
                onClick={() => navigate("/add-device")}
                className="relative group"
              >
                {/* Outer ring glow */}
                <div className="absolute -inset-8 rounded-full bg-gradient-to-b from-primary/20 to-transparent blur-2xl group-hover:from-primary/30 transition-all duration-500" />
                
                {/* Platform rings */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  {/* Outermost ring */}
                  <div className="absolute w-full h-full rounded-full border border-primary/20" />
                  {/* Middle ring */}
                  <div className="absolute w-40 h-40 rounded-full border border-primary/30" />
                  {/* Inner ring with glow */}
                  <div className="absolute w-32 h-32 rounded-full border-2 border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.3)]" />
                  
                  {/* Center icon */}
                  <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-b from-card to-card/80 border border-primary/30 flex items-center justify-center shadow-[0_0_40px_hsl(var(--primary)/0.2)] group-hover:shadow-[0_0_60px_hsl(var(--primary)/0.4)] transition-all duration-300">
                    <Plus className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                </div>
              </button>

              {/* Text content */}
              <div className="flex flex-col items-center gap-3 text-center">
                <h2 className="text-2xl font-semibold text-foreground">
                  Welcome Home
                </h2>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Add your first robot vacuum to start automating your cleaning
                </p>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => navigate("/add-device")}
                className="w-full max-w-xs h-14 rounded-2xl bg-primary text-primary-foreground font-semibold text-base shadow-[0_8px_32px_hsl(var(--primary)/0.4)] hover:shadow-[0_12px_40px_hsl(var(--primary)/0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Add Your Device
              </Button>
            </div>
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