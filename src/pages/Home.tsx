import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Bell, Home as HomeIcon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeviceCard from "@/components/DeviceCard";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [devices] = useState<any[]>([]);

  return (
    <div className="min-h-screen bg-background">
      {/* Content */}
      <main className="flex flex-col items-center justify-center px-6 pb-24 pt-8" style={{ minHeight: 'calc(100vh - 80px)' }}>
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
            className="space-y-4 w-full"
          >
            {devices.map((device, index) => (
              <motion.div
                key={device.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <DeviceCard
                  device={device}
                  onClick={() => navigate(`/device/${device.id}`)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPath={location.pathname} />
    </div>
  );
};

export const BottomNav = ({ currentPath }: { currentPath: string }) => {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: HomeIcon, label: "Device", path: "/home" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-xl">
      <div className="flex items-center justify-around py-4">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;
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
