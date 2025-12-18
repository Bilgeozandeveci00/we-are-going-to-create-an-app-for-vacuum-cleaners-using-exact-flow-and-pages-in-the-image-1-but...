import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface Room {
  id: string;
  name: string;
  path: string;
  color: string;
  borderColor: string;
  labelX: number;
  labelY: number;
}

interface Door {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
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
}

const rooms: Room[] = [
  // Living Room - large L-shaped blue area at top
  {
    id: "living",
    name: "Living Room",
    path: "M15 15 L15 70 L55 70 L55 50 L85 50 L85 15 Z",
    color: "hsl(205, 70%, 65%)",
    borderColor: "hsl(210, 30%, 30%)",
    labelX: 45,
    labelY: 38,
  },
  // Dining - blue area connected to living
  {
    id: "dining",
    name: "Dining",
    path: "M15 75 L15 120 L50 120 L50 75 Z",
    color: "hsl(205, 70%, 65%)",
    borderColor: "hsl(210, 30%, 30%)",
    labelX: 32,
    labelY: 98,
  },
  // Hallway - blue connector
  {
    id: "hallway",
    name: "Hallway",
    path: "M55 55 L55 120 L75 120 L75 55 Z",
    color: "hsl(205, 70%, 65%)",
    borderColor: "hsl(210, 30%, 30%)",
    labelX: 65,
    labelY: 88,
  },
  // Bedroom 1 - yellow room top right
  {
    id: "bedroom1",
    name: "Bedroom 1",
    path: "M90 15 L90 55 L130 55 L130 25 L120 25 L120 15 Z",
    color: "hsl(42, 70%, 60%)",
    borderColor: "hsl(42, 40%, 30%)",
    labelX: 108,
    labelY: 38,
  },
  // Bedroom 2 - yellow room middle right
  {
    id: "bedroom2",
    name: "Bedroom 2",
    path: "M80 60 L80 95 L130 95 L130 60 Z",
    color: "hsl(42, 70%, 60%)",
    borderColor: "hsl(42, 40%, 30%)",
    labelX: 105,
    labelY: 78,
  },
  // Bathroom - coral room
  {
    id: "bathroom",
    name: "Bathroom",
    path: "M80 100 L80 135 L110 135 L110 100 Z",
    color: "hsl(15, 60%, 60%)",
    borderColor: "hsl(15, 40%, 30%)",
    labelX: 95,
    labelY: 118,
  },
  // Kitchen - coral L-shaped room bottom
  {
    id: "kitchen",
    name: "Kitchen",
    path: "M15 125 L15 170 L70 170 L70 145 L50 145 L50 125 Z",
    color: "hsl(15, 60%, 60%)",
    borderColor: "hsl(15, 40%, 30%)",
    labelX: 40,
    labelY: 155,
  },
  // Laundry - coral small room
  {
    id: "laundry",
    name: "Laundry",
    path: "M115 100 L115 135 L130 135 L130 100 Z",
    color: "hsl(15, 60%, 60%)",
    borderColor: "hsl(15, 40%, 30%)",
    labelX: 122,
    labelY: 118,
  },
];

const doors: Door[] = [
  // Living to Hallway
  { x1: 55, y1: 58, x2: 55, y2: 68 },
  // Dining to Hallway
  { x1: 50, y1: 85, x2: 55, y2: 85 },
  // Living to Bedroom 1
  { x1: 85, y1: 30, x2: 90, y2: 30 },
  // Hallway to Bedroom 2
  { x1: 75, y1: 75, x2: 80, y2: 75 },
  // Hallway to Bathroom
  { x1: 75, y1: 110, x2: 80, y2: 110 },
  // Dining to Kitchen
  { x1: 30, y1: 120, x2: 30, y2: 125 },
  // Bathroom to Laundry
  { x1: 110, y1: 115, x2: 115, y2: 115 },
];

// Generate cleaning path lines for a room based on its bounding area
const getCleaningPaths = (room: Room) => {
  // Parse path to get approximate bounding box
  const matches = room.path.match(/[ML]\s*(\d+)\s+(\d+)/g);
  if (!matches) return "";
  
  const coords = matches.map(m => {
    const nums = m.match(/(\d+)/g);
    return nums ? { x: parseInt(nums[0]), y: parseInt(nums[1]) } : { x: 0, y: 0 };
  });
  
  const minX = Math.min(...coords.map(c => c.x)) + 5;
  const maxX = Math.max(...coords.map(c => c.x)) - 5;
  const minY = Math.min(...coords.map(c => c.y)) + 5;
  const maxY = Math.max(...coords.map(c => c.y)) - 5;
  
  const paths: string[] = [];
  const spacing = 6;
  
  for (let y = minY; y < maxY; y += spacing) {
    paths.push(`M${minX} ${y} L${maxX} ${y}`);
  }
  
  return paths.join(" ");
};

// Get room center for robot position
const getRoomCenter = (roomId: string) => {
  const room = rooms.find(r => r.id === roomId);
  if (!room) return { x: 65, y: 100 };
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
  cleanedRooms = []
}: FloorMapProps) => {
  const [showHint, setShowHint] = useState(true);

  // Hide hint after user selects a room or after 5 seconds
  useEffect(() => {
    if (selectedRooms.length > 0) {
      setShowHint(false);
    }
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, [selectedRooms.length]);

  // Robot position - at dock when completed, in current room when cleaning, hallway otherwise
  const robotPosition = isCompleted 
    ? { x: 120, y: 38 }
    : currentCleaningRoom 
      ? getRoomCenter(currentCleaningRoom)
      : { x: 65, y: 100 };

  const isRoomSelected = (roomId: string) => selectedRooms.includes(roomId);
  const isRoomCleaned = (roomId: string) => cleanedRooms.includes(roomId);
  const isRoomBeingCleaned = (roomId: string) => currentCleaningRoom === roomId;

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

      {/* Map SVG - Vertical layout */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 145 185" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Sparkle filter for completion */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="cleanedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(158, 64%, 52%)" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="hsl(158, 64%, 62%)" stopOpacity="0.5"/>
          </linearGradient>
          <linearGradient id="cleaningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4">
              <animate attributeName="stopOpacity" values="0.2;0.5;0.2" dur="1.5s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6">
              <animate attributeName="stopOpacity" values="0.4;0.7;0.4" dur="1.5s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>

        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            {/* Room shape */}
            <motion.path
              d={room.path}
              fill={
                isRoomCleaned(room.id) 
                  ? "url(#cleanedGradient)" 
                  : isRoomBeingCleaned(room.id) 
                    ? "url(#cleaningGradient)" 
                    : room.color
              }
              stroke={isRoomSelected(room.id) ? "hsl(var(--primary))" : room.borderColor}
              strokeWidth={isRoomSelected(room.id) ? "3" : "2"}
              whileHover={{ opacity: 0.95 }}
              opacity={isRoomSelected(room.id) ? 1 : 0.75}
              animate={{
                opacity: isRoomSelected(room.id) || isRoomBeingCleaned(room.id) ? 1 : 0.75,
              }}
            />

            {/* Cleaned room sparkle overlay */}
            {isRoomCleaned(room.id) && (
              <motion.path
                d={room.path}
                fill="none"
                stroke="hsl(158, 64%, 52%)"
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* Room being cleaned - pulsing overlay */}
            {isRoomBeingCleaned(room.id) && (
              <motion.path
                d={room.path}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}

            {/* Pulsing border hint for unselected rooms */}
            {!isRunning && selectedRooms.length === 0 && showHint && (
              <motion.path
                d={room.path}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeDasharray="4,4"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.2, 0.6, 0.2] }}
                transition={{ duration: 2, repeat: Infinity, delay: rooms.indexOf(room) * 0.1 }}
              />
            )}
            
            {/* Cleaning path lines */}
            <path
              d={getCleaningPaths(room)}
              stroke={isRoomCleaned(room.id) ? "rgba(52, 211, 153, 0.4)" : "rgba(255,255,255,0.2)"}
              strokeWidth="0.8"
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />

            {/* Room label - small text, no background */}
            {showLabels && (
              <text
                x={room.labelX}
                y={room.labelY}
                textAnchor="middle"
                fill="white"
                fontSize="4"
                fontWeight="400"
                opacity="0.9"
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
                  cy={room.labelY + 8}
                  r="5"
                  fill="hsl(158, 64%, 52%)"
                />
                <path
                  d={`M${room.labelX - 2.5} ${room.labelY + 8} l2 2 l3 -4`}
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

        {/* Door connections */}
        {doors.map((door, index) => (
          <g key={index}>
            {/* Door opening - darker gap */}
            <line
              x1={door.x1}
              y1={door.y1}
              x2={door.x2}
              y2={door.y2}
              stroke="hsl(220, 20%, 10%)"
              strokeWidth="4"
            />
            {/* Door frame */}
            <line
              x1={door.x1}
              y1={door.y1}
              x2={door.x2}
              y2={door.y2}
              stroke="hsl(220, 20%, 25%)"
              strokeWidth="1"
              strokeDasharray="2,1"
            />
          </g>
        ))}

        {/* Charging dock icon in Bedroom 1 */}
        <g transform="translate(120, 38)">
          {/* Dock base */}
          <rect 
            x="-5" 
            y="-2" 
            width="10" 
            height="6" 
            rx="1.5" 
            fill="hsl(160, 70%, 40%)" 
            stroke="hsl(160, 50%, 30%)"
            strokeWidth="0.5"
          />
          {/* Lightning bolt icon */}
          <path
            d="M0 -1 L2 -1 L0.5 1 L2.5 1 L-1 4 L0 1.5 L-2 1.5 Z"
            fill="white"
            opacity="0.95"
          />
        </g>

        {/* Completion sparkles */}
        {isCompleted && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.circle
                key={i}
                cx={30 + (i % 4) * 35}
                cy={40 + Math.floor(i / 4) * 50}
                r="1.5"
                fill="hsl(158, 64%, 52%)"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </>
        )}

        {/* Robot vacuum - white circle (red when stuck, green when completed) */}
        <motion.g
          animate={
            isRunning && !isStuck
              ? {
                  x: [0, 5, -5, 5, -5, 0],
                  y: [0, 3, -3, -3, 3, 0],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Robot body */}
          <motion.circle
            cx={robotPosition.x}
            cy={robotPosition.y}
            r="4"
            fill={isStuck ? "hsl(0, 70%, 50%)" : isCompleted ? "hsl(158, 64%, 52%)" : "white"}
            stroke={isStuck ? "hsl(0, 70%, 40%)" : isCompleted ? "hsl(158, 64%, 42%)" : "hsl(220, 20%, 50%)"}
            strokeWidth="1"
            filter={isCompleted ? "url(#glow)" : undefined}
            animate={isRunning && !isStuck ? {
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              duration: 0.5,
              repeat: Infinity,
            }}
          />

          {/* Cleaning wave effect when running */}
          {isRunning && !isStuck && (
            <motion.circle
              cx={robotPosition.x}
              cy={robotPosition.y}
              r="4"
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
          
          {/* Need help speech bubble when stuck */}
          {isStuck && (
            <g>
              {/* Bubble background */}
              <path
                d={`M${robotPosition.x - 18} ${robotPosition.y - 22} 
                    L${robotPosition.x + 18} ${robotPosition.y - 22} 
                    Q${robotPosition.x + 20} ${robotPosition.y - 22} ${robotPosition.x + 20} ${robotPosition.y - 20}
                    L${robotPosition.x + 20} ${robotPosition.y - 12}
                    Q${robotPosition.x + 20} ${robotPosition.y - 10} ${robotPosition.x + 18} ${robotPosition.y - 10}
                    L${robotPosition.x + 4} ${robotPosition.y - 10}
                    L${robotPosition.x} ${robotPosition.y - 6}
                    L${robotPosition.x - 4} ${robotPosition.y - 10}
                    L${robotPosition.x - 18} ${robotPosition.y - 10}
                    Q${robotPosition.x - 20} ${robotPosition.y - 10} ${robotPosition.x - 20} ${robotPosition.y - 12}
                    L${robotPosition.x - 20} ${robotPosition.y - 20}
                    Q${robotPosition.x - 20} ${robotPosition.y - 22} ${robotPosition.x - 18} ${robotPosition.y - 22}
                    Z`}
                fill="hsl(0, 70%, 50%)"
              />
              {/* Text */}
              <text
                x={robotPosition.x}
                y={robotPosition.y - 14}
                textAnchor="middle"
                fill="white"
                fontSize="5"
                fontWeight="600"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Need help
              </text>
            </g>
          )}
        </motion.g>
      </svg>
    </div>
  );
};

export default FloorMap;
