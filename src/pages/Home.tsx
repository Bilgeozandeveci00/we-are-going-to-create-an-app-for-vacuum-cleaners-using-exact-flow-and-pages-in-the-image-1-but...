import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Bell, Home as HomeIcon, User, Zap, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      setDevices([{ id: "1", name: "S5 Max", battery: 93 }]);
    }
  }, []);

  const removeDevice = () => {
    localStorage.removeItem("hasDevice");
    setDevices([]);
  };

  return (
    <div className="min-h-screen bg-background">
      {devices.length > 0 && (
        <header className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={removeDevice}
            className="text-red-500 p-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button 
            onClick={() => navigate("/add-device")}
            className="text-foreground p-2"
          >
            <Plus className="h-6 w-6" />
          </button>
        </header>
      )}

      {/* Content */}
      <main className="flex flex-col items-center justify-center px-6 pb-32" style={{ minHeight: devices.length > 0 ? 'calc(100vh - 140px)' : 'calc(100vh - 100px)' }}>
        {devices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center flex-1 w-full"
          >
            {/* 3D Vacuum Illustration Placeholder */}
            <div className="relative mb-8">
              <div className="w-64 h-64 rounded-full bg-gradient-to-b from-primary/20 to-transparent flex items-center justify-center">
                <div className="w-48 h-48 rounded-full bg-card/50 border border-border/30 flex items-center justify-center backdrop-blur-sm">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-card border border-primary/30 shadow-lg shadow-primary/20" />
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-4 right-8 w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="absolute bottom-12 left-4 w-1.5 h-1.5 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
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
              {/* Vacuum cleaner image placeholder */}
              <div className="w-64 h-64 flex items-center justify-center">
                <div className="relative">
                  {/* Main body */}
                  <div className="w-52 h-52 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-2xl flex items-center justify-center">
                    <div className="w-44 h-44 rounded-full bg-gradient-to-br from-white to-gray-200 flex items-center justify-center shadow-inner">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 border-4 border-gray-200 shadow-md">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-300 to-orange-500 opacity-60" />
                      </div>
                    </div>
                  </div>
                  {/* LIDAR bump */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 shadow-md" />
                  {/* Front sensor */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-2 rounded-full bg-gray-800" />
                </div>
              </div>
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
