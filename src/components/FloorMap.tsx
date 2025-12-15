import { motion } from "framer-motion";

interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface FloorMapProps {
  isRunning: boolean;
  selectedRoom?: string;
  onRoomSelect?: (roomId: string) => void;
  showLabels?: boolean;
}

const rooms: Room[] = [
  {
    id: "room1",
    name: "Room 1",
    x: 20,
    y: 15,
    width: 80,
    height: 55,
    color: "hsl(0, 0%, 45%)",
  },
  {
    id: "room2",
    name: "Room 2",
    x: 100,
    y: 40,
    width: 70,
    height: 60,
    color: "hsl(0, 0%, 50%)",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    x: 20,
    y: 70,
    width: 60,
    height: 50,
    color: "hsl(0, 0%, 42%)",
  },
];

const FloorMap = ({ isRunning, selectedRoom, onRoomSelect, showLabels = false }: FloorMapProps) => {
  // Robot position in kitchen area
  const robotX = 55;
  const robotY = 105;

  return (
    <div className="relative w-full h-full bg-muted">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-30">
        <svg className="w-full h-full">
          <pattern id="mapGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#mapGrid)" />
        </svg>
      </div>

      {/* Map SVG */}
      <svg 
        className="w-full h-full relative z-10" 
        viewBox="0 0 190 140" 
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            {/* Room shape */}
            <motion.rect
              x={room.x}
              y={room.y}
              width={room.width}
              height={room.height}
              fill={room.color}
              stroke="hsl(0, 0%, 25%)"
              strokeWidth="2"
              rx="2"
              whileHover={{ opacity: 0.9 }}
              opacity={selectedRoom === room.id ? 1 : 0.85}
            />

            {/* Room label */}
            {showLabels && (
              <g transform={`translate(${room.x + room.width / 2}, ${room.y + 18})`}>
                {/* Label background */}
                <rect
                  x={-30}
                  y="-8"
                  width="60"
                  height="14"
                  rx="3"
                  fill="hsl(0, 0%, 30%)"
                  opacity="0.9"
                />
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill="white"
                  fontSize="7"
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
        <g transform={`translate(${robotX}, ${robotY + 12})`}>
          <rect 
            x="-8" 
            y="-3" 
            width="16" 
            height="8" 
            rx="2" 
            fill="hsl(160, 70%, 40%)" 
            stroke="hsl(160, 70%, 50%)"
            strokeWidth="1"
          />
          <circle cx="0" cy="1" r="2" fill="white" opacity="0.8" />
        </g>

        {/* Robot vacuum - green dot */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, 15, 15, 30, 30, 15, 15, 0],
                  y: [0, 0, -10, -10, -20, -20, -30, -30],
                }
              : {}
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Robot body - green circle */}
          <circle
            cx={robotX}
            cy={robotY}
            r="6"
            fill="hsl(140, 60%, 45%)"
            stroke="hsl(140, 60%, 55%)"
            strokeWidth="1.5"
          />
          
          {/* Cleaning trail when running */}
          {isRunning && (
            <motion.line
              x1={robotX}
              y1={robotY}
              x2={robotX}
              y2={robotY + 10}
              stroke="hsl(140, 60%, 45%)"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.4"
              strokeDasharray="2,2"
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
};

export default FloorMap;
