import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MoreHorizontal, Pause, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "./Home";

const MappingSimulation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [progress, setProgress] = useState(0);
  const [battery, setBattery] = useState(93);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Progress simulation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsComplete(true);
          localStorage.setItem("hasMap", "true");
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    // Time simulation
    const timeInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    // Battery drain simulation
    const batteryInterval = setInterval(() => {
      setBattery((prev) => Math.max(prev - 1, 10));
    }, 3000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(timeInterval);
      clearInterval(batteryInterval);
    };
  }, []);

  useEffect(() => {
    if (isComplete) {
      const timer = setTimeout(() => {
        navigate(`/device/${id}`);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, navigate, id]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}min`;
  };

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
          <p className="text-xs text-primary">
            {isComplete ? "Mapping Complete" : `${progress}% completed`}
          </p>
        </div>
        <Button variant="ghost" size="icon" className="text-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </header>

      {/* Stats Row */}
      <div className="flex items-center justify-center gap-8 py-2">
        <div className="flex items-center gap-1">
          <Battery className="w-4 h-4 text-muted-foreground" />
          <span className="text-lg font-light text-foreground">{battery}%</span>
        </div>
        <div className="text-lg font-light text-foreground">
          {formatTime(elapsedTime)}
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
