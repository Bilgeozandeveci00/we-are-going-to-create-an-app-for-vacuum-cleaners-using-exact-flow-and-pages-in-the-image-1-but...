import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Settings, Bell, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeviceCard from "@/components/DeviceCard";

const Home = () => {
  const navigate = useNavigate();
  const [devices] = useState([
    {
      id: "1",
      name: "Living Room",
      model: "Roborock S7 MaxV",
      status: "idle",
      battery: 85,
      lastCleaned: "2 hours ago",
    },
    {
      id: "2",
      name: "Bedroom",
      model: "Roborock Q7 Max",
      status: "charging",
      battery: 45,
      lastCleaned: "Yesterday",
    },
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold text-foreground">My Devices</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 pb-24">
        {/* Quick Actions */}
        <div className="mb-6 flex gap-3">
          <Button
            onClick={() => navigate("/add-device")}
            variant="glass"
            className="flex-1 justify-start gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
              <Plus className="h-4 w-4 text-primary" />
            </div>
            <span>Add Device</span>
          </Button>
        </div>

        {/* Device List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
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

        {/* Empty state */}
        {devices.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No devices yet</p>
            <Button
              onClick={() => navigate("/add-device")}
              variant="teal"
              className="mt-4"
            >
              Add your first device
            </Button>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/80 backdrop-blur-xl">
        <div className="flex items-center justify-around py-4">
          <NavItem icon="home" label="Home" active />
          <NavItem icon="scenes" label="Scenes" />
          <NavItem icon="store" label="Store" />
          <NavItem icon="profile" label="Profile" />
        </div>
      </nav>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) => {
  const icons = {
    home: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    scenes: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    store: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    profile: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };

  return (
    <button className={`flex flex-col items-center gap-1 ${active ? "text-primary" : "text-muted-foreground"}`}>
      {icons[icon as keyof typeof icons]}
      <span className="text-xs">{label}</span>
    </button>
  );
};

export default Home;
