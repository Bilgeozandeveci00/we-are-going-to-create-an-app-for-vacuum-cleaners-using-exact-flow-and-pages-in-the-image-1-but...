import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HelpCircle, Plus, X, Check, Move, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Zone {
  id: string;
  type: "wall" | "zone";
  x: number;
  y: number;
  width: number;
  height: number;
}

// Room data matching FloorMap.tsx
const rooms = [
  {
    id: "living",
    name: "Living Room",
    path: "M20 20 L20 85 L70 85 L70 60 L100 60 L100 20 Z",
    color: "hsl(210, 55%, 58%)",
    labelX: 55,
    labelY: 50,
  },
  {
    id: "dining",
    name: "Dining",
    path: "M20 90 L20 140 L65 140 L65 90 Z",
    color: "hsl(210, 55%, 55%)",
    labelX: 42,
    labelY: 115,
  },
  {
    id: "hallway",
    name: "Hall",
    path: "M70 65 L70 140 L90 140 L90 65 Z",
    color: "hsl(210, 50%, 50%)",
    labelX: 80,
    labelY: 100,
  },
  {
    id: "bedroom1",
    name: "Master Bed",
    path: "M105 20 L105 65 L155 65 L155 20 Z",
    color: "hsl(45, 60%, 62%)",
    labelX: 130,
    labelY: 42,
  },
  {
    id: "bedroom2",
    name: "Bedroom",
    path: "M95 70 L95 115 L155 115 L155 70 Z",
    color: "hsl(45, 55%, 58%)",
    labelX: 125,
    labelY: 92,
  },
  {
    id: "bathroom",
    name: "Bath",
    path: "M95 120 L95 160 L130 160 L130 120 Z",
    color: "hsl(180, 50%, 55%)",
    labelX: 112,
    labelY: 140,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    path: "M20 145 L20 195 L85 195 L85 165 L65 165 L65 145 Z",
    color: "hsl(15, 55%, 58%)",
    labelX: 50,
    labelY: 175,
  },
  {
    id: "laundry",
    name: "Laundry",
    path: "M135 120 L135 160 L155 160 L155 120 Z",
    color: "hsl(270, 45%, 58%)",
    labelX: 145,
    labelY: 140,
  },
];

// Furniture matching FloorMap.tsx
const furniture = [
  { type: "sofa", x: 28, y: 35, width: 25, height: 10 },
  { type: "tv", x: 28, y: 70, width: 20, height: 3 },
  { type: "table", x: 75, y: 35, width: 18, height: 12 },
  { type: "table", x: 32, y: 105, width: 20, height: 16 },
  { type: "bed", x: 115, y: 28, width: 28, height: 22 },
  { type: "bed", x: 105, y: 78, width: 24, height: 18 },
  { type: "toilet", x: 100, y: 145, width: 8, height: 10 },
  { type: "sink", x: 118, y: 125, width: 8, height: 6 },
  { type: "counter", x: 22, y: 180, width: 55, height: 8 },
  { type: "counter", x: 22, y: 148, width: 8, height: 35 },
  { type: "washer", x: 140, y: 135, width: 10, height: 12 },
];

const NoGoZones = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [zones, setZones] = useState<Zone[]>([
    // Default no-go zone near furniture
    { id: "zone1", type: "zone", x: 28, y: 35, width: 30, height: 15 },
    // Default invisible wall in hallway
    { id: "wall1", type: "wall", x: 70, y: 100, width: 4, height: 25 },
  ]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const addZone = (type: "wall" | "zone") => {
    const newZone: Zone = {
      id: `${type}-${Date.now()}`,
      type,
      x: 80,
      y: 80,
      width: type === "wall" ? 4 : 30,
      height: type === "wall" ? 30 : 25,
    };
    setZones([...zones, newZone]);
    setSelectedZone(newZone.id);
  };

  const removeZone = (zoneId: string) => {
    setZones(zones.filter((z) => z.id !== zoneId));
    setSelectedZone(null);
  };

  const handleSave = () => {
    navigate(`/device/${id}`);
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
        <h1 className="text-lg font-semibold text-foreground">No-Go Zones</h1>
        <Button variant="ghost" size="icon" className="text-muted-foreground">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </header>

      {/* Warning */}
      <div className="px-4 pb-4">
        <p className="text-sm text-amber-500 text-center">
          No-Go Zones or Invisible Walls should not block the robot or charging station
        </p>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative mx-4">
        <svg className="w-full h-full min-h-[400px]" viewBox="0 0 175 210" preserveAspectRatio="xMidYMid meet">
          {/* Background */}
          <rect x="0" y="0" width="175" height="210" fill="hsl(var(--background))" />
          
          {/* Rooms */}
          {rooms.map((room) => (
            <path
              key={room.id}
              d={room.path}
              fill={room.color}
              fillOpacity="0.6"
              stroke="hsl(var(--background))"
              strokeWidth="1.5"
            />
          ))}

          {/* Room Labels */}
          {rooms.map((room) => (
            <text
              key={`label-${room.id}`}
              x={room.labelX}
              y={room.labelY}
              fontSize="6"
              fill="white"
              textAnchor="middle"
              fontWeight="500"
              opacity="0.9"
            >
              {room.name}
            </text>
          ))}

          {/* Furniture (simplified) */}
          {furniture.map((item, index) => (
            <rect
              key={index}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              fill="hsl(var(--foreground))"
              fillOpacity="0.15"
              rx="1"
            />
          ))}

          {/* Dock Station */}
          <g>
            {/* Base platform */}
            <rect
              x="140"
              y="28"
              width="12"
              height="8"
              fill="hsl(220, 15%, 25%)"
              rx="1"
            />
            {/* Back panel */}
            <rect
              x="142"
              y="26"
              width="8"
              height="3"
              fill="hsl(220, 15%, 30%)"
              rx="0.5"
            />
            {/* Status LED */}
            <circle cx="146" cy="27" r="1" fill="hsl(160, 70%, 50%)">
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* No-Go Zones */}
          {zones.map((zone) => (
            <g 
              key={zone.id} 
              onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)} 
              className="cursor-pointer"
            >
              {zone.type === "wall" ? (
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill="hsl(0, 70%, 50%)"
                  stroke={selectedZone === zone.id ? "white" : "hsl(0, 70%, 40%)"}
                  strokeWidth={selectedZone === zone.id ? "2" : "1"}
                  rx="1"
                />
              ) : (
                <>
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.width}
                    height={zone.height}
                    fill="hsl(0, 70%, 50%)"
                    fillOpacity="0.3"
                    stroke="hsl(0, 70%, 50%)"
                    strokeWidth={selectedZone === zone.id ? "2" : "1.5"}
                    strokeDasharray={selectedZone === zone.id ? "none" : "4 2"}
                    rx="2"
                  />
                  {/* Zone label */}
                  <text
                    x={zone.x + zone.width / 2}
                    y={zone.y + zone.height / 2 + 2}
                    fontSize="5"
                    fill="hsl(0, 70%, 50%)"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    NO-GO
                  </text>
                </>
              )}

              {/* Selection handles */}
              {selectedZone === zone.id && (
                <>
                  {/* Corner handles */}
                  <circle cx={zone.x} cy={zone.y} r="3" fill="white" stroke="hsl(0, 70%, 50%)" strokeWidth="1" />
                  <circle cx={zone.x + zone.width} cy={zone.y} r="3" fill="white" stroke="hsl(0, 70%, 50%)" strokeWidth="1" />
                  <circle cx={zone.x} cy={zone.y + zone.height} r="3" fill="white" stroke="hsl(0, 70%, 50%)" strokeWidth="1" />
                  <circle cx={zone.x + zone.width} cy={zone.y + zone.height} r="3" fill="white" stroke="hsl(0, 70%, 50%)" strokeWidth="1" />
                </>
              )}
            </g>
          ))}

          {/* Robot */}
          <motion.g
            animate={{ 
              x: 0,
              y: 0 
            }}
          >
            <circle cx="146" cy="40" r="5" fill="white" stroke="hsl(var(--primary))" strokeWidth="1.5" />
            <circle cx="146" cy="38" r="1" fill="hsl(var(--primary))" />
          </motion.g>
        </svg>
      </div>

      {/* Add buttons */}
      <div className="px-4 py-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-card border-border text-foreground"
            onClick={() => addZone("wall")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Invisible Wall
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-card border-border text-foreground"
            onClick={() => addZone("zone")}
          >
            <Plus className="w-4 h-4 mr-2" />
            No-Go Zone
          </Button>
        </div>
      </div>

      {/* Bottom action bar */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-card rounded-t-3xl px-6 py-4 safe-area-bottom border-t border-border"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  zones.find((z) => z.id === selectedZone)?.type === "wall" 
                    ? "bg-destructive/20" 
                    : "bg-destructive/10"
                }`}>
                  {zones.find((z) => z.id === selectedZone)?.type === "wall" ? (
                    <div className="w-1 h-6 bg-destructive rounded-full" />
                  ) : (
                    <div className="w-6 h-6 border-2 border-destructive border-dashed rounded" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {zones.find((z) => z.id === selectedZone)?.type === "wall"
                      ? "Invisible Wall"
                      : "No-Go Zone"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Drag corners to resize
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeZone(selectedZone)}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedZone(null)}
                  className="text-primary"
                >
                  <Check className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedZone && (
        <div className="bg-card rounded-t-3xl px-6 py-4 safe-area-bottom border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-muted-foreground">
              {zones.length} zone{zones.length !== 1 ? 's' : ''} configured
            </p>
            {zones.length > 0 && (
              <button 
                onClick={() => setZones([])}
                className="text-xs text-destructive"
              >
                Clear All
              </button>
            )}
          </div>
          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default NoGoZones;