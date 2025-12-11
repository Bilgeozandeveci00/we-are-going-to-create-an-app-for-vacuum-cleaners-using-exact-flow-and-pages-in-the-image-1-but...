import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, HelpCircle, Plus, X, Check, Move, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Zone {
  id: string;
  type: "wall" | "zone";
  x: number;
  y: number;
  width: number;
  height: number;
}

const NoGoZones = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [zones, setZones] = useState<Zone[]>([
    { id: "wall1", type: "wall", x: 125, y: 30, width: 4, height: 30 },
    { id: "zone1", type: "zone", x: 40, y: 70, width: 60, height: 50 },
  ]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<"wall" | "zone" | null>(null);

  const addZone = (type: "wall" | "zone") => {
    const newZone: Zone = {
      id: `${type}-${Date.now()}`,
      type,
      x: 80,
      y: 80,
      width: type === "wall" ? 4 : 40,
      height: type === "wall" ? 40 : 40,
    };
    setZones([...zones, newZone]);
    setSelectedZone(newZone.id);
    setIsAdding(null);
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
        <svg className="w-full h-full min-h-[400px]" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          {/* Room paths */}
          <path
            d="M20 20 L120 20 L120 100 L90 100 L90 140 L20 140 Z"
            fill="hsl(200, 70%, 55%)"
            fillOpacity="0.7"
            stroke="hsl(var(--background))"
            strokeWidth="2"
          />
          <path
            d="M125 20 L180 20 L180 80 L125 80 Z"
            fill="hsl(45, 80%, 55%)"
            fillOpacity="0.7"
            stroke="hsl(var(--background))"
            strokeWidth="2"
          />
          <path
            d="M125 85 L180 85 L180 180 L95 180 L95 145 L125 145 Z"
            fill="hsl(15, 70%, 60%)"
            fillOpacity="0.7"
            stroke="hsl(var(--background))"
            strokeWidth="2"
          />

          {/* Cleaning paths */}
          <path
            d="M30 30 L100 30 L100 50 L30 50 L30 70 L100 70 L100 90 L30 90"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M135 95 L170 95 L170 110 L135 110 L135 125 L170 125 L170 140 L135 140"
            fill="none"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Dock station */}
          <g>
            <line x1="145" y1="30" x2="145" y2="45" stroke="hsl(0, 70%, 55%)" strokeWidth="2" />
            <circle cx="145" cy="28" r="3" fill="hsl(0, 70%, 55%)" />
            <circle cx="145" cy="47" r="3" fill="hsl(0, 70%, 55%)" />
          </g>

          {/* Zones */}
          {zones.map((zone) => (
            <g key={zone.id} onClick={() => setSelectedZone(zone.id)} className="cursor-pointer">
              {zone.type === "wall" ? (
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill="hsl(0, 70%, 55%)"
                  stroke={selectedZone === zone.id ? "white" : "none"}
                  strokeWidth="2"
                />
              ) : (
                <rect
                  x={zone.x}
                  y={zone.y}
                  width={zone.width}
                  height={zone.height}
                  fill="hsl(0, 70%, 55%)"
                  fillOpacity="0.4"
                  stroke="hsl(0, 70%, 55%)"
                  strokeWidth="2"
                  strokeDasharray={selectedZone === zone.id ? "none" : "4 2"}
                />
              )}

              {/* Zone controls when selected */}
              {selectedZone === zone.id && (
                <>
                  {/* Delete button */}
                  <g onClick={(e) => { e.stopPropagation(); removeZone(zone.id); }}>
                    <circle cx={zone.x - 8} cy={zone.y - 8} r="8" fill="hsl(0, 70%, 55%)" />
                    <path
                      d={`M${zone.x - 11} ${zone.y - 11} L${zone.x - 5} ${zone.y - 5} M${zone.x - 5} ${zone.y - 11} L${zone.x - 11} ${zone.y - 5}`}
                      stroke="white"
                      strokeWidth="2"
                    />
                  </g>

                  {/* Rotate button */}
                  <circle cx={zone.x + zone.width / 2} cy={zone.y - 10} r="8" fill="hsl(210, 80%, 55%)" />
                  <g transform={`translate(${zone.x + zone.width / 2 - 4}, ${zone.y - 14})`}>
                    <path d="M0 4 A4 4 0 1 1 4 0" stroke="white" strokeWidth="1.5" fill="none" />
                    <path d="M4 0 L6 2 L4 4" stroke="white" strokeWidth="1.5" fill="none" />
                  </g>

                  {/* Move button */}
                  <circle cx={zone.x + zone.width + 10} cy={zone.y + zone.height + 10} r="8" fill="hsl(210, 80%, 55%)" />
                  <g transform={`translate(${zone.x + zone.width + 6}, ${zone.y + zone.height + 6})`}>
                    <path d="M4 0 L4 8 M0 4 L8 4" stroke="white" strokeWidth="1.5" />
                    <path d="M2 2 L4 0 L6 2 M2 6 L4 8 L6 6 M0 2 L0 4 L2 4 M6 4 L8 4 L8 6" stroke="white" strokeWidth="1" />
                  </g>

                  {/* Size label */}
                  {zone.type === "zone" && (
                    <text
                      x={zone.x + zone.width / 2}
                      y={zone.y + zone.height + 25}
                      fontSize="8"
                      fill="white"
                      textAnchor="middle"
                    >
                      1.8m x 1.8m
                    </text>
                  )}
                </>
              )}
            </g>
          ))}

          {/* Robot */}
          <circle cx="140" cy="130" r="6" fill="white" stroke="hsl(var(--primary))" strokeWidth="2" />
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
            className="bg-card rounded-t-3xl px-6 py-4 safe-area-bottom"
          >
            <div className="flex items-center justify-between bg-muted rounded-full px-2 py-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedZone(null)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
              <span className="text-foreground font-medium">
                {zones.find((z) => z.id === selectedZone)?.type === "wall"
                  ? "Invisible Wall"
                  : "Restricted Area"}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="rounded-full text-primary"
              >
                <Check className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedZone && (
        <div className="bg-card rounded-t-3xl px-6 py-4 safe-area-bottom">
          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
};

export default NoGoZones;
