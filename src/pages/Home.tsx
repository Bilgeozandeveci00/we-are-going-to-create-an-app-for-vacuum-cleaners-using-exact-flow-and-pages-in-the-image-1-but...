import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Bell, Home as HomeIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import RobotIllustration from "@/components/RobotIllustration";
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
    <div className="min-h-screen bg-background">
      {/* Content */}
      <main className="flex flex-col items-center justify-center px-0 pb-32" style={{ minHeight: 'calc(100vh - 100px)' }}>
        {devices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center flex-1 w-full px-6"
          >
            {/* Flat Teal Illustration for empty state */}
            <div className="relative mb-8">
              <RobotIllustration />
            </div>

            <Button
              onClick={() => navigate("/add-device")}
              variant="outline"
              className="w-full max-w-sm h-14 rounded-2xl border-border/50 bg-card/30 text-foreground text-lg font-medium"
            >
              Add Device
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center w-full flex-1 justify-center"
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