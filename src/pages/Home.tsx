import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Bell, Home as HomeIcon, User, Zap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import RobotVacuum3D from "@/components/RobotVacuum3D";

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

  const removeDevice = () => {
    localStorage.removeItem("hasDevice");
    setDevices([]);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Content */}
      <main className="flex flex-col items-center justify-center px-6 pb-32" style={{ minHeight: devices.length > 0 ? 'calc(100vh - 140px)' : 'calc(100vh - 100px)' }}>
        {devices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center flex-1 w-full"
          >
            {/* 3D Vacuum Illustration */}
            <div className="relative mb-8">
              <RobotVacuum3D />
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
            {/* Device Card */}
            <div className="relative mb-8">
              {/* Trash button - top left of robot */}
              <button 
                onClick={removeDevice}
                className="absolute -top-2 -left-2 z-10 w-10 h-10 rounded-full bg-card/80 border border-border/50 flex items-center justify-center text-red-500 active:scale-95 transition-transform"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              
              {/* 3D Robot Vacuum */}
              <RobotVacuum3D />
            </div>

            {/* Device Info */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <h2 className="text-xl font-semibold text-foreground">{devices[0].name}</h2>
                <span className="text-muted-foreground">∠</span>
              </div>
              <div className="flex items-center justify-center gap-1 text-green-500">
                <Zap className="w-4 h-4 fill-current" />
                <span className="text-sm">{devices[0].battery}%</span>
              </div>
            </div>

            {/* Enter Button */}
            <Button
              onClick={() => navigate(`/device/${devices[0].id}`)}
              variant="outline"
              className="w-full max-w-sm h-12 rounded-full border-border/50 bg-card/50 text-foreground font-medium"
            >
              Enter
            </Button>

            {/* Page Dots */}
            <div className="flex gap-2 mt-6">
              <div className="w-2 h-2 rounded-full bg-foreground" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/40" />
            </div>
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
