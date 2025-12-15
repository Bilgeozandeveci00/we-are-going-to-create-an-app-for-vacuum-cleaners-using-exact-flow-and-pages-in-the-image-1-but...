import { motion } from "framer-motion";

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
  selectedRoom?: string;
  onRoomSelect?: (roomId: string) => void;
  showLabels?: boolean;
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

const FloorMap = ({ isRunning, selectedRoom, onRoomSelect, showLabels = false }: FloorMapProps) => {
  // Robot position in hallway
  const robotX = 65;
  const robotY = 100;

  return (
    <div className="relative w-full h-full bg-background">
      {/* Map SVG - Vertical layout */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 145 185" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            {/* Room shape */}
            <motion.path
              d={room.path}
              fill={room.color}
              stroke={room.borderColor}
              strokeWidth="2"
              whileHover={{ opacity: 0.95 }}
              opacity={selectedRoom === room.id ? 1 : 0.9}
            />
            
            {/* Cleaning path lines */}
            <path
              d={getCleaningPaths(room)}
              stroke="rgba(255,255,255,0.2)"
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

        {/* Robot vacuum - white circle */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, -15, -15, 0, 0, 15, 15, 0],
                  y: [0, 0, -20, -20, -40, -40, -20, -20],
                }
              : {}
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Robot body */}
          <circle
            cx={robotX}
            cy={robotY}
            r="4"
            fill="white"
            stroke="hsl(220, 20%, 50%)"
            strokeWidth="1"
          />
          
          {/* Cleaning trail when running */}
          {isRunning && (
            <motion.line
              x1={robotX}
              y1={robotY}
              x2={robotX}
              y2={robotY + 6}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="1,1"
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
};

export default FloorMap;
