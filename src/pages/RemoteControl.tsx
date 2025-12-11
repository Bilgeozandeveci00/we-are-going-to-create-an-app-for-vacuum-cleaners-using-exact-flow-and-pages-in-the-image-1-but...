import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const RemoteControl = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const joystickRef = useRef<HTMLDivElement>(null);

  const handleJoystickMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging || !joystickRef.current) return;

    const rect = joystickRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX - rect.left;
      clientY = e.touches[0].clientY - rect.top;
    } else {
      clientX = e.clientX - rect.left;
      clientY = e.clientY - rect.top;
    }

    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const maxDistance = 50;

    if (distance <= maxDistance) {
      setJoystickPos({ x: deltaX, y: deltaY });
    } else {
      const angle = Math.atan2(deltaY, deltaX);
      setJoystickPos({
        x: Math.cos(angle) * maxDistance,
        y: Math.sin(angle) * maxDistance,
      });
    }
  };

  const handleJoystickEnd = () => {
    setIsDragging(false);
    setJoystickPos({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/device/${id}`)}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Remote Control</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Joystick Area */}
        <div
          ref={joystickRef}
          className="relative w-48 h-48 rounded-full bg-card border-4 border-border"
          onMouseDown={() => setIsDragging(true)}
          onMouseMove={handleJoystickMove}
          onMouseUp={handleJoystickEnd}
          onMouseLeave={handleJoystickEnd}
          onTouchStart={() => setIsDragging(true)}
          onTouchMove={handleJoystickMove}
          onTouchEnd={handleJoystickEnd}
        >
          {/* Direction indicators */}
          <ChevronUp className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 text-muted-foreground" />
          <ChevronDown className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 text-muted-foreground" />
          <ChevronLeft className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
          <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />

          {/* Joystick knob */}
          <motion.div
            className="absolute w-16 h-16 rounded-full bg-primary shadow-lg cursor-grab active:cursor-grabbing"
            style={{
              left: "50%",
              top: "50%",
              x: joystickPos.x - 32,
              y: joystickPos.y - 32,
            }}
            animate={{
              x: joystickPos.x - 32,
              y: joystickPos.y - 32,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>

        <p className="text-muted-foreground text-sm mt-6">
          Drag to control robot movement
        </p>

        {/* Rotation buttons */}
        <div className="flex items-center gap-8 mt-8">
          <button className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <RotateCcw className="w-6 h-6 text-foreground" />
          </button>
          <button className="w-16 h-16 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
            <RotateCw className="w-6 h-6 text-foreground" />
          </button>
        </div>
        <p className="text-muted-foreground text-xs mt-2">
          Rotate Left / Right
        </p>

        {/* Control tips */}
        <div className="mt-12 bg-card rounded-2xl p-4 w-full max-w-sm">
          <h3 className="text-foreground font-medium mb-2">Control Tips</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Drag joystick to move the robot</li>
            <li>• Use rotation buttons to turn in place</li>
            <li>• Release joystick to stop movement</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RemoteControl;
