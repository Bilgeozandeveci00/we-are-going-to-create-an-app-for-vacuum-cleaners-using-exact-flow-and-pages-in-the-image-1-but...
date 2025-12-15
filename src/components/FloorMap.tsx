import { motion } from "framer-motion";

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  borderColor: string;
}

interface FloorMapProps {
  isRunning: boolean;
  selectedRoom?: string;
  onRoomSelect?: (roomId: string) => void;
  showLabels?: boolean;
}

const rooms: Room[] = [
  // Main living area - light blue
  {
    id: "living1",
    name: "Living Room",
    x: 10,
    y: 10,
    width: 75,
    height: 65,
    color: "hsl(205, 70%, 65%)",
    borderColor: "hsl(210, 30%, 35%)",
  },
  // Connected living area - light blue
  {
    id: "living2",
    name: "Dining",
    x: 10,
    y: 75,
    width: 60,
    height: 50,
    color: "hsl(205, 70%, 65%)",
    borderColor: "hsl(210, 30%, 35%)",
  },
  // Hallway connector - light blue
  {
    id: "hallway",
    name: "Hallway",
    x: 85,
    y: 35,
    width: 30,
    height: 55,
    color: "hsl(205, 70%, 65%)",
    borderColor: "hsl(210, 30%, 35%)",
  },
  // Bedroom 1 - yellow/gold
  {
    id: "bedroom1",
    name: "Bedroom 1",
    x: 115,
    y: 10,
    width: 55,
    height: 40,
    color: "hsl(42, 70%, 60%)",
    borderColor: "hsl(42, 40%, 35%)",
  },
  // Bedroom 2 - yellow/gold
  {
    id: "bedroom2",
    name: "Bedroom 2",
    x: 115,
    y: 50,
    width: 55,
    height: 40,
    color: "hsl(42, 70%, 60%)",
    borderColor: "hsl(42, 40%, 35%)",
  },
  // Bathroom - coral/salmon
  {
    id: "bathroom",
    name: "Bathroom",
    x: 115,
    y: 90,
    width: 55,
    height: 35,
    color: "hsl(15, 60%, 60%)",
    borderColor: "hsl(15, 40%, 35%)",
  },
  // Kitchen - coral/salmon
  {
    id: "kitchen",
    name: "Kitchen",
    x: 70,
    y: 90,
    width: 45,
    height: 35,
    color: "hsl(15, 60%, 60%)",
    borderColor: "hsl(15, 40%, 35%)",
  },
];

// Generate cleaning path lines for a room
const getCleaningPaths = (room: Room) => {
  const paths: string[] = [];
  const spacing = 8;
  const padding = 5;
  
  for (let y = room.y + padding; y < room.y + room.height - padding; y += spacing) {
    paths.push(`M${room.x + padding} ${y} L${room.x + room.width - padding} ${y}`);
  }
  
  return paths.join(" ");
};

const FloorMap = ({ isRunning, selectedRoom, onRoomSelect, showLabels = false }: FloorMapProps) => {
  // Robot position
  const robotX = 130;
  const robotY = 75;

  return (
    <div className="relative w-full h-full bg-[hsl(220,20%,12%)]">
      {/* Map SVG */}
      <svg 
        className="w-full h-full" 
        viewBox="0 0 180 135" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            {/* Room shape with pixelated border effect */}
            <motion.rect
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              fill={room.color}
              stroke={room.borderColor}
              strokeWidth="2"
              whileHover={{ opacity: 0.95 }}
              opacity={selectedRoom === room.id ? 1 : 0.9}
            />
            
            {/* Cleaning path lines */}
            <path
              d={getCleaningPaths(room)}
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />

            {/* Room label */}
            {showLabels && (
              <g transform={`translate(${room.x + room.width / 2}, ${room.y + room.height / 2})`}>
                {/* Label background */}
                <rect
                  x={-28}
                  y="-8"
                  width="56"
                  height="16"
                  rx="4"
                  fill="hsl(220, 20%, 15%)"
                  opacity="0.85"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  fill="white"
                  fontSize="6"
                  fontWeight="500"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  {room.name}
                </text>
              </g>
            )}
          </g>
        ))}

        {/* Charging dock */}
        <g transform="translate(140, 15)">
          <rect 
            x="-5" 
            y="-3" 
            width="10" 
            height="6" 
            rx="1" 
            fill="hsl(0, 70%, 50%)" 
          />
          <line 
            x1="0" 
            y1="3" 
            x2="0" 
            y2="12" 
            stroke="hsl(0, 70%, 50%)" 
            strokeWidth="2"
          />
          <circle cx="0" cy="12" r="3" fill="white" stroke="hsl(0, 70%, 50%)" strokeWidth="1.5" />
        </g>

        {/* Robot vacuum - white circle */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, -20, -20, -40, -40, -20, -20, 0],
                  y: [0, 0, 15, 15, 30, 30, 45, 45],
                }
              : {}
          }
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Robot body - white circle like in reference */}
          <circle
            cx={robotX}
            cy={robotY}
            r="5"
            fill="white"
            stroke="hsl(220, 20%, 40%)"
            strokeWidth="1"
          />
          
          {/* Cleaning trail when running */}
          {isRunning && (
            <motion.line
              x1={robotX}
              y1={robotY}
              x2={robotX}
              y2={robotY + 8}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="2,2"
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
};

export default FloorMap;
