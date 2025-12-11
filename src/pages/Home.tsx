import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Bell, Home as HomeIcon, User, Zap } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header when device exists */}
      {devices.length > 0 && (
        <header className="flex items-center justify-between px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
            <span className="text-lg">🐷</span>
          </div>
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

export const BottomNav = ({ currentPath, onAddDevice, hasDevices = false }: { currentPath: string; onAddDevice?: () => void; hasDevices?: boolean }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: HomeIcon, label: "Device", path: "/home", isMain: true },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-xl">
      <div className="flex items-end justify-around pb-4 pt-2 px-8">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
          
          if (item.isMain) {
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center -mt-6"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-1 ${
                  isActive ? "bg-foreground" : "bg-card border border-border"
                }`}>
                  <Icon className={`h-6 w-6 ${isActive ? "text-background" : "text-muted-foreground"}`} fill={isActive ? "currentColor" : "none"} />
                </div>
                <span className={`text-xs ${isActive ? "text-foreground" : "text-muted-foreground"}`}>{item.label}</span>
              </button>
            );
          }
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-6 w-6" fill={isActive ? "currentColor" : "none"} />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default HomePage;
