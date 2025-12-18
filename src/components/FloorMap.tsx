import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Room {
  id: string;
  name: string;
  path: string;
  color: string;
  labelX: number;
  labelY: number;
}

interface Furniture {
  type: "sofa" | "bed" | "table" | "counter" | "toilet" | "sink" | "washer" | "tv";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
}

interface SkippedArea {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FloorMapProps {
  isRunning: boolean;
  isStuck?: boolean;
  isCompleted?: boolean;
  selectedRooms?: string[];
  onRoomSelect?: (roomId: string) => void;
  showLabels?: boolean;
  currentCleaningRoom?: string;
  cleanedRooms?: string[];
  skippedAreas?: SkippedArea[];
  showSkippedAreas?: boolean;
  dangerZones?: {id: string; x: number; y: number}[];
}

const rooms: Room[] = [
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

const furniture: Furniture[] = [
  // Living Room
  { type: "sofa", x: 28, y: 35, width: 25, height: 10 },
  { type: "tv", x: 28, y: 70, width: 20, height: 3 },
  { type: "table", x: 75, y: 35, width: 18, height: 12 },
  // Dining
  { type: "table", x: 32, y: 105, width: 20, height: 16 },
  // Master Bedroom
  { type: "bed", x: 115, y: 28, width: 28, height: 22 },
  // Bedroom 2
  { type: "bed", x: 105, y: 78, width: 24, height: 18 },
  // Bathroom
  { type: "toilet", x: 100, y: 145, width: 8, height: 10 },
  { type: "sink", x: 118, y: 125, width: 8, height: 6 },
  // Kitchen
  { type: "counter", x: 22, y: 180, width: 55, height: 8 },
  { type: "counter", x: 22, y: 148, width: 8, height: 35 },
  // Laundry
  { type: "washer", x: 140, y: 135, width: 10, height: 12 },
];

const defaultSkippedAreas: SkippedArea[] = [
  { id: "skip1", name: "Under sofa", x: 28, y: 42, width: 25, height: 5 },
  { id: "skip2", name: "Behind TV", x: 28, y: 68, width: 20, height: 4 },
  { id: "skip3", name: "Kitchen corner", x: 22, y: 148, width: 10, height: 10 },
];

// Generate zigzag cleaning path for a room
const getCleaningPaths = (room: Room) => {
  const matches = room.path.match(/[ML]\s*(\d+)\s+(\d+)/g);
  if (!matches) return "";
  
  const coords = matches.map(m => {
    const nums = m.match(/(\d+)/g);
    return nums ? { x: parseInt(nums[0]), y: parseInt(nums[1]) } : { x: 0, y: 0 };
  });
  
  const minX = Math.min(...coords.map(c => c.x)) + 4;
  const maxX = Math.max(...coords.map(c => c.x)) - 4;
  const minY = Math.min(...coords.map(c => c.y)) + 4;
  const maxY = Math.max(...coords.map(c => c.y)) - 4;
  
  const paths: string[] = [];
  const spacing = 5;
  let direction = 1;
  
  for (let y = minY; y < maxY; y += spacing) {
    if (direction === 1) {
      paths.push(`M${minX} ${y} L${maxX} ${y}`);
    } else {
      paths.push(`M${maxX} ${y} L${minX} ${y}`);
    }
    direction *= -1;
  }
  
  return paths.join(" ");
};

const getRoomCenter = (roomId: string) => {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return { x: 80, y: 100 };
  return { x: room.labelX, y: room.labelY };
};

const FloorMap = ({ 
  isRunning, 
  isStuck = false, 
  isCompleted = false, 
  selectedRooms = [], 
  onRoomSelect, 
  showLabels = false,
  currentCleaningRoom,
  cleanedRooms = [],
  skippedAreas = [],
  showSkippedAreas = false,
  dangerZones = [],
}: FloorMapProps) => {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (selectedRooms.length > 0) {
      setShowHint(false);
    }
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, [selectedRooms.length]);

  const robotPosition = isCompleted 
    ? { x: 148, y: 42 }
    : currentCleaningRoom 
      ? getRoomCenter(currentCleaningRoom)
      : { x: 80, y: 100 };

  const isRoomSelected = (roomId: string) => selectedRooms.includes(roomId);
  const isRoomCleaned = (roomId: string) => cleanedRooms.includes(roomId);
  const isRoomBeingCleaned = (roomId: string) => currentCleaningRoom === roomId;

  const displaySkippedAreas = showSkippedAreas ? (skippedAreas.length > 0 ? skippedAreas : defaultSkippedAreas) : [];

  return (
    <div className="relative w-full h-full bg-background">
      {/* Tap to select hint */}
      <AnimatePresence>
        {showHint && !isRunning && selectedRooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm flex items-center gap-2"
          >
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              👆
            </motion.span>
            Tap rooms to select
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      {(showSkippedAreas && displaySkippedAreas.length > 0) || dangerZones.length > 0 ? (
        <div className="absolute bottom-3 left-3 z-20 bg-card/90 backdrop-blur-sm rounded-lg p-2 border border-border space-y-1">
          {showSkippedAreas && displaySkippedAreas.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-amber-500/60 border border-amber-500 rounded-sm" />
              <span className="text-muted-foreground">Skipped areas</span>
            </div>
          )}
          {dangerZones.length > 0 && (
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-red-500/60 border border-red-500 rounded-full" />
              <span className="text-muted-foreground">Danger zone</span>
            </div>
          )}
        </div>
      ) : null}

      <svg 
        className="w-full h-full" 
        viewBox="0 0 175 210" 
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset dx="1" dy="1"/>
            <feGaussianBlur stdDeviation="1" result="offset-blur"/>
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse"/>
            <feFlood floodColor="black" floodOpacity="0.3" result="color"/>
            <feComposite operator="in" in="color" in2="inverse" result="shadow"/>
            <feComposite operator="over" in="shadow" in2="SourceGraphic"/>
          </filter>
          <linearGradient id="cleanedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(158, 64%, 45%)" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="hsl(158, 64%, 55%)" stopOpacity="0.6"/>
          </linearGradient>
          <linearGradient id="cleaningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4">
              <animate attributeName="stopOpacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6">
              <animate attributeName="stopOpacity" values="0.4;0.7;0.4" dur="1.5s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
          <pattern id="gridPattern" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.3"/>
          </pattern>
        </defs>

        {/* Background grid */}
        <rect x="0" y="0" width="175" height="210" fill="url(#gridPattern)" />

        {/* Outer walls - removed border, just for structure */}

        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            <motion.path
              d={room.path}
              fill={
                isRoomCleaned(room.id) 
                  ? "url(#cleanedGradient)" 
                  : isRoomBeingCleaned(room.id) 
                    ? "url(#cleaningGradient)" 
                    : room.color
              }
              stroke={isRoomSelected(room.id) ? "hsl(var(--primary))" : "hsl(210, 30%, 45%)"}
              strokeWidth={isRoomSelected(room.id) ? "3" : "1"}
              whileHover={{ opacity: 1 }}
              opacity={1}
            />

            {/* Cleaned room glow */}
            {isRoomCleaned(room.id) && (
              <motion.path
                d={room.path}
                fill="none"
                stroke="hsl(158, 64%, 52%)"
                strokeWidth="1.5"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Room being cleaned pulse */}
            {isRoomBeingCleaned(room.id) && (
              <motion.path
                d={room.path}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Hint pulsing border */}
            {!isRunning && selectedRooms.length === 0 && showHint && (
              <motion.path
                d={room.path}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: rooms.indexOf(room) * 0.1 }}
              />
            )}
            
            {/* Cleaning path lines */}
            <path
              d={getCleaningPaths(room)}
              stroke={isRoomCleaned(room.id) ? "rgba(52, 211, 153, 0.4)" : "rgba(255,255,255,0.18)"}
              strokeWidth="0.6"
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />

            {/* Room label */}
            {showLabels && (
              <text
                x={room.labelX}
                y={room.labelY}
                textAnchor="middle"
                fill="white"
                fontSize="5"
                fontWeight="500"
                opacity="0.85"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                {room.name}
              </text>
            )}

            {/* Cleaned checkmark */}
            {isRoomCleaned(room.id) && (
              <motion.g
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <circle
                  cx={room.labelX}
                  cy={room.labelY + 10}
                  r="6"
                  fill="hsl(158, 64%, 52%)"
                />
                <path
                  d={`M${room.labelX - 3} ${room.labelY + 10} l2.5 2.5 l4 -5`}
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.g>
            )}
          </g>
        ))}

        {/* Furniture outlines */}
        {furniture.map((item, i) => (
          <rect
            key={i}
            x={item.x}
            y={item.y}
            width={item.width}
            height={item.height}
            rx="1"
            fill="rgba(0,0,0,0.15)"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.5"
            transform={item.rotation ? `rotate(${item.rotation} ${item.x + item.width/2} ${item.y + item.height/2})` : undefined}
          />
        ))}

        {/* Interior walls */}
        <g stroke="hsl(210, 30%, 50%)" strokeWidth="2" strokeLinecap="round">
          {/* Living/Dining divider */}
          <line x1="20" y1="85" x2="60" y2="85" />
          <line x1="70" y1="85" x2="70" y2="60" />
          {/* Living/Hallway */}
          <line x1="70" y1="65" x2="90" y2="65" />
          {/* Hallway walls */}
          <line x1="90" y1="65" x2="90" y2="140" />
          <line x1="70" y1="90" x2="70" y2="140" />
          {/* Bedroom 1 */}
          <line x1="100" y1="20" x2="100" y2="55" />
          <line x1="105" y1="65" x2="155" y2="65" />
          {/* Bedroom 2 */}
          <line x1="95" y1="70" x2="95" y2="115" />
          <line x1="95" y1="115" x2="155" y2="115" />
          {/* Bathroom */}
          <line x1="95" y1="120" x2="95" y2="160" />
          <line x1="130" y1="120" x2="130" y2="160" />
          {/* Kitchen */}
          <line x1="20" y1="145" x2="60" y2="145" />
          <line x1="65" y1="145" x2="65" y2="165" />
          <line x1="85" y1="165" x2="85" y2="195" />
          {/* Laundry */}
          <line x1="135" y1="120" x2="155" y2="120" />
        </g>

        {/* Doorways */}
        <g>
          {/* Living to Hallway */}
          <rect x="68" y="72" width="4" height="10" fill="hsl(210, 50%, 50%)" />
          {/* Dining to Hallway */}
          <rect x="65" y="100" width="7" height="4" fill="hsl(210, 50%, 50%)" />
          {/* Living to Bedroom 1 */}
          <rect x="100" y="35" width="5" height="8" fill="hsl(210, 55%, 58%)" />
          {/* Hallway to Bedroom 2 */}
          <rect x="90" y="85" width="7" height="4" fill="hsl(210, 50%, 50%)" />
          {/* Hallway to Bathroom */}
          <rect x="90" y="130" width="7" height="4" fill="hsl(210, 50%, 50%)" />
          {/* Dining to Kitchen */}
          <rect x="35" y="140" width="8" height="7" fill="hsl(210, 55%, 55%)" />
          {/* Bathroom to Laundry */}
          <rect x="130" y="135" width="7" height="4" fill="hsl(180, 50%, 55%)" />
        </g>

        {/* Selected room borders - rendered on top of walls */}
        {rooms.filter(room => isRoomSelected(room.id)).map((room) => (
          <motion.path
            key={`selection-${room.id}`}
            d={room.path}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ filter: 'drop-shadow(0 0 4px hsl(var(--primary)))' }}
          />
        ))}

        {/* Skipped areas - yellow boxes */}
        {displaySkippedAreas.map((area) => (
          <g key={area.id}>
            <motion.rect
              x={area.x}
              y={area.y}
              width={area.width}
              height={area.height}
              rx="1"
              fill="hsl(45, 90%, 50%)"
              fillOpacity="0.4"
              stroke="hsl(45, 90%, 55%)"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text
              x={area.x + area.width / 2}
              y={area.y + area.height / 2 + 1.5}
              textAnchor="middle"
              fill="hsl(45, 90%, 20%)"
              fontSize="3"
              fontWeight="600"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              ⚠
            </text>
          </g>
        ))}

        {/* Danger zones - where robot got stuck */}
        {dangerZones.map((zone) => (
          <g key={zone.id}>
            <motion.circle
              cx={zone.x}
              cy={zone.y}
              r="8"
              fill="hsl(0, 70%, 50%)"
              fillOpacity="0.3"
              stroke="hsl(0, 70%, 55%)"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <text
              x={zone.x}
              y={zone.y + 1.5}
              textAnchor="middle"
              fill="hsl(0, 70%, 90%)"
              fontSize="6"
              fontWeight="bold"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              ⚠
            </text>
          </g>
        ))}

        <g transform="translate(148, 42)">
          <rect 
            x="-6" 
            y="-3" 
            width="12" 
            height="8" 
            rx="2" 
            fill="hsl(160, 70%, 35%)" 
            stroke="hsl(160, 50%, 25%)"
            strokeWidth="0.8"
          />
          <path
            d="M0 -1.5 L2.5 -1.5 L0.5 1.5 L3 1.5 L-1.5 5 L0 2 L-2.5 2 Z"
            fill="white"
            opacity="0.9"
          />
        </g>

        {/* Completion sparkles */}
        {isCompleted && (
          <>
            {[...Array(15)].map((_, i) => (
              <motion.circle
                key={i}
                cx={30 + (i % 5) * 30}
                cy={40 + Math.floor(i / 5) * 55}
                r="2"
                fill="hsl(158, 64%, 52%)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.12,
                }}
              />
            ))}
          </>
        )}

        {/* Robot vacuum */}
        <motion.g
          animate={
            isRunning && !isStuck
              ? {
                  x: [0, 4, -4, 4, -4, 0],
                  y: [0, 2, -2, -2, 2, 0],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Robot shadow */}
          <ellipse
            cx={robotPosition.x + 1}
            cy={robotPosition.y + 3}
            rx="5"
            ry="2"
            fill="rgba(0,0,0,0.3)"
          />
          
          {/* Robot body */}
          <motion.circle
            cx={robotPosition.x}
            cy={robotPosition.y}
            r="5"
            fill={isStuck ? "hsl(0, 70%, 50%)" : isCompleted ? "hsl(158, 64%, 52%)" : "white"}
            stroke={isStuck ? "hsl(0, 70%, 40%)" : isCompleted ? "hsl(158, 64%, 42%)" : "hsl(210, 20%, 60%)"}
            strokeWidth="1.2"
            filter={isCompleted ? "url(#glow)" : undefined}
            animate={isRunning && !isStuck ? {
              scale: [1, 1.08, 1],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          />

          {/* Robot front indicator */}
          <circle
            cx={robotPosition.x}
            cy={robotPosition.y - 2.5}
            r="1.2"
            fill={isStuck ? "hsl(0, 70%, 70%)" : isCompleted ? "hsl(158, 64%, 70%)" : "hsl(210, 60%, 60%)"}
          />

          {/* Cleaning wave */}
          {isRunning && !isStuck && (
            <motion.circle
              cx={robotPosition.x}
              cy={robotPosition.y}
              r="5"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 1,
                repeat: Infinity,
              }}
            />
          )}
          
          {/* Stuck speech bubble */}
          {isStuck && (
            <g>
              <path
                d={`M${robotPosition.x - 20} ${robotPosition.y - 25} 
                    L${robotPosition.x + 20} ${robotPosition.y - 25} 
                    Q${robotPosition.x + 22} ${robotPosition.y - 25} ${robotPosition.x + 22} ${robotPosition.y - 23}
                    L${robotPosition.x + 22} ${robotPosition.y - 14}
                    Q${robotPosition.x + 22} ${robotPosition.y - 12} ${robotPosition.x + 20} ${robotPosition.y - 12}
                    L${robotPosition.x + 5} ${robotPosition.y - 12}
                    L${robotPosition.x} ${robotPosition.y - 7}
                    L${robotPosition.x - 5} ${robotPosition.y - 12}
                    L${robotPosition.x - 20} ${robotPosition.y - 12}
                    Q${robotPosition.x - 22} ${robotPosition.y - 12} ${robotPosition.x - 22} ${robotPosition.y - 14}
                    L${robotPosition.x - 22} ${robotPosition.y - 23}
                    Q${robotPosition.x - 22} ${robotPosition.y - 25} ${robotPosition.x - 20} ${robotPosition.y - 25}
                    Z`}
                fill="hsl(0, 70%, 50%)"
                stroke="hsl(0, 70%, 40%)"
                strokeWidth="0.5"
              />
              <text
                x={robotPosition.x}
                y={robotPosition.y - 16}
                textAnchor="middle"
                fill="white"
                fontSize="5.5"
                fontWeight="600"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Need help!
              </text>
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
};

export default FloorMap;
