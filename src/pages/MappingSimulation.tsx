import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoreHorizontal, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "./Home";

type ScanStatus = "exploring" | "mapping_rooms" | "finalizing" | "complete";

const statusMessages: Record<ScanStatus, string> = {
  exploring: "Exploring your home...",
  mapping_rooms: "Mapping rooms...",
  finalizing: "Finalizing map...",
  complete: "Mapping Complete"
};

const MappingSimulation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [battery, setBattery] = useState(93);
  const [scanStatus, setScanStatus] = useState<ScanStatus>("exploring");
  const [discoveredRooms, setDiscoveredRooms] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const allRooms = ["Living Room", "Kitchen", "Bedroom 1", "Bedroom 2", "Bathroom", "Hallway", "Dining", "Laundry"];

  useEffect(() => {
    // Progress simulation - discover rooms at certain points
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        // Update status based on progress
        if (prev >= 80) setScanStatus("finalizing");
        else if (prev >= 30) setScanStatus("mapping_rooms");
        
        // Discover rooms progressively
        const roomIndex = Math.floor((prev / 100) * allRooms.length);
        if (roomIndex > discoveredRooms.length && roomIndex <= allRooms.length) {
          setDiscoveredRooms(allRooms.slice(0, roomIndex));
        }

        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          setScanStatus("complete");
          setDiscoveredRooms(allRooms);
          localStorage.setItem("hasMap", "true");
          
          // Check if we're adding a new floor
          const pendingFloor = localStorage.getItem(`pending-floor-${id}`);
          if (pendingFloor) {
            const newFloor = JSON.parse(pendingFloor);
            const existingFloors = localStorage.getItem(`floors-${id}`);
            const floors = existingFloors ? JSON.parse(existingFloors) : [{ id: 1, name: "Floor 1" }];
            floors.push(newFloor);
            localStorage.setItem(`floors-${id}`, JSON.stringify(floors));
            localStorage.removeItem(`pending-floor-${id}`);
          } else {
            // First floor creation - ensure floors exist
            const existingFloors = localStorage.getItem(`floors-${id}`);
            if (!existingFloors) {
              localStorage.setItem(`floors-${id}`, JSON.stringify([{ id: 1, name: "Floor 1" }]));
            }
          }
          
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    // Battery drain simulation
    const batteryInterval = setInterval(() => {
      setBattery((prev) => Math.max(prev - 1, 10));
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(batteryInterval);
    };
  }, [discoveredRooms.length, id]);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        navigate(`/device/${id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, navigate, id]);

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
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
          <h1 className="text-lg font-semibold text-foreground">Amphibia</h1>
        </div>
        <Button variant="ghost" size="icon" className="text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Status Bar - Prominent */}
      <div className="mx-4 mb-4">
        <motion.div 
          className={`rounded-2xl p-4 ${isComplete ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-primary/10 border border-primary/20"}`}
          animate={{ opacity: [0.9, 1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <motion.div 
                className={`w-2 h-2 rounded-full ${isComplete ? "bg-emerald-500" : "bg-primary"}`}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <span className={`text-sm font-medium ${isComplete ? "text-emerald-500" : "text-primary"}`}>
                {statusMessages[scanStatus]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Battery className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{battery}%</span>
            </div>
          </div>
          
          {/* Progress bar visual (no percentage) */}
          <div className="h-1.5 bg-background/50 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full rounded-full ${isComplete ? "bg-emerald-500" : "bg-primary"}`}
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>

      {/* Discovered Rooms List */}
      <div className="mx-4 mb-4">
        <p className="text-xs text-muted-foreground mb-2">Discovered Rooms ({discoveredRooms.length})</p>
        <div className="flex flex-wrap gap-2">
          <AnimatePresence>
            {discoveredRooms.map((room, index) => (
              <motion.div
                key={room}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-1.5 bg-card/80 border border-border/50 rounded-full text-xs text-foreground"
              >
                {room}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Map Visualization */}
      <main className="flex-1 flex items-center justify-center px-4 pb-24">
        <div className="relative w-full max-w-sm aspect-square">
          {/* Grid background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Pixelated Map */}
          <svg className="w-full h-full relative z-10" viewBox="0 0 200 200">
            <defs>
              <clipPath id="mapClip">
                <motion.rect
                  x="0"
                  y="0"
                  width="200"
                  height="200"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: progress / 100 }}
                  style={{ transformOrigin: "bottom" }}
                />
              </clipPath>
            </defs>

            {/* Pixelated rooms that reveal progressively */}
            <g clipPath="url(#mapClip)">
              {/* Main area - Living room (blue) */}
              <motion.path
                d="M50 80 L50 60 L60 60 L60 50 L80 50 L80 40 L100 40 L100 50 L120 50 L120 60 L140 60 L140 80 L150 80 L150 120 L140 120 L140 140 L120 140 L120 150 L80 150 L80 140 L60 140 L60 120 L50 120 Z"
                fill="hsl(200, 80%, 70%)"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: progress > 10 ? 1 : 0 }}
              />

              {/* Kitchen (different blue shade when rooms separate) */}
              {progress > 60 && (
                <motion.path
                  d="M50 80 L50 60 L60 60 L60 50 L70 50 L70 80 Z"
                  fill="hsl(170, 60%, 60%)"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}

              {/* Bedroom (green when rooms separate) */}
              {progress > 70 && (
                <motion.path
                  d="M120 50 L120 60 L140 60 L140 80 L150 80 L150 120 L120 120 L120 80 L110 80 L110 50 Z"
                  fill="hsl(140, 50%, 60%)"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}

              {/* Bathroom (purple when rooms separate) */}
              {progress > 80 && (
                <motion.path
                  d="M60 120 L60 140 L80 140 L80 150 L50 150 L50 120 Z"
                  fill="hsl(280, 50%, 65%)"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}

              {/* Hallway (orange when rooms separate) */}
              {progress > 90 && (
                <motion.path
                  d="M100 140 L100 150 L120 150 L120 140 L140 140 L140 120 L120 120 L120 130 L100 130 Z"
                  fill="hsl(30, 70%, 65%)"
                  stroke="hsl(var(--border))"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                />
              )}

              {/* Border outline */}
              <path
                d="M50 80 L50 60 L60 60 L60 50 L80 50 L80 40 L100 40 L100 50 L120 50 L120 60 L140 60 L140 80 L150 80 L150 120 L140 120 L140 140 L120 140 L120 150 L80 150 L80 140 L60 140 L60 120 L50 120 Z"
                fill="none"
                stroke="hsl(var(--foreground))"
                strokeWidth="2"
              />
            </g>

            {/* Charging Dock */}
            <g transform="translate(95, 130)">
              <rect x="0" y="0" width="16" height="20" rx="2" fill="hsl(var(--primary))" />
              <circle cx="8" cy="10" r="4" fill="hsl(var(--primary-foreground))" />
            </g>

            {/* Robot indicator */}
            <motion.g
              animate={{
                x: [0, 20, 40, 20, 0, -20, -40, -20, 0],
                y: [0, -15, 0, 15, 30, 15, 0, -15, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <circle cx="100" cy="95" r="8" fill="hsl(var(--background))" stroke="hsl(var(--foreground))" strokeWidth="2" />
              {/* Direction line */}
              <motion.line
                x1="100"
                y1="95"
                x2="100"
                y2="85"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1"
                strokeDasharray="2,2"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "100px 95px" }}
              />
            </motion.g>

            {/* Pause button overlay */}
            <g transform="translate(90, 70)" opacity="0.3">
              <circle cx="10" cy="10" r="12" fill="hsl(var(--muted))" />
              <rect x="6" y="5" width="3" height="10" rx="1" fill="hsl(var(--foreground))" />
              <rect x="11" y="5" width="3" height="10" rx="1" fill="hsl(var(--foreground))" />
            </g>
          </svg>

          {/* Completion overlay */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4"
                >
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <p className="text-lg font-semibold text-foreground">Mapping Complete!</p>
                <p className="text-sm text-muted-foreground">Redirecting to controls...</p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPath="/home" />
    </div>
  );
};

export default MappingSimulation;
