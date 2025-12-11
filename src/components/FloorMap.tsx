import { motion } from "framer-motion";

interface Room {
  id: string;
  name: string;
  path: string;
  color: string;
  labelX: number;
  labelY: number;
}

interface FloorMapProps {
  isRunning: boolean;
  selectedRoom?: string;
  onRoomSelect?: (roomId: string) => void;
}

const rooms: Room[] = [
  {
    id: "room1",
    name: "Oda",
    path: "M20 20 L120 20 L120 100 L90 100 L90 140 L20 140 Z",
    color: "hsl(200, 70%, 55%)",
    labelX: 60,
    labelY: 70,
  },
  {
    id: "room2",
    name: "Oda",
    path: "M125 20 L180 20 L180 80 L125 80 Z",
    color: "hsl(45, 80%, 55%)",
    labelX: 152,
    labelY: 50,
  },
  {
    id: "room3",
    name: "Oda",
    path: "M125 85 L180 85 L180 180 L95 180 L95 145 L125 145 Z",
    color: "hsl(15, 70%, 60%)",
    labelX: 140,
    labelY: 135,
  },
];

const FloorMap = ({ isRunning, selectedRoom, onRoomSelect }: FloorMapProps) => {
  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            <motion.path
              d={room.path}
              fill={room.color}
              fillOpacity={selectedRoom === room.id ? 0.9 : 0.7}
              stroke="hsl(var(--background))"
              strokeWidth="2"
              whileHover={{ fillOpacity: 0.9 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Cleaning path lines */}
            <path
              d={room.path}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              strokeDasharray="3 3"
              style={{
                clipPath: `path('${room.path}')`,
              }}
            />
            
            {/* Room label */}
            <g>
              <circle cx={room.labelX} cy={room.labelY - 8} r="6" fill="hsl(var(--background))" fillOpacity="0.8" />
              <text
                x={room.labelX}
                y={room.labelY - 5}
                fontSize="5"
                fill="hsl(var(--primary))"
                textAnchor="middle"
              >
                🏠
              </text>
              <text
                x={room.labelX}
                y={room.labelY + 5}
                fontSize="7"
                fill="white"
                textAnchor="middle"
                fontWeight="500"
              >
                {room.name}
              </text>
            </g>
          </g>
        ))}

        {/* Cleaning path overlay */}
        <path
          d="M30 30 L100 30 L100 50 L30 50 L30 70 L100 70 L100 90 L30 90"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Dock station marker */}
        <g>
          <line x1="145" y1="30" x2="145" y2="45" stroke="hsl(0, 70%, 55%)" strokeWidth="2" />
          <circle cx="145" cy="28" r="3" fill="hsl(0, 70%, 55%)" />
          <circle cx="145" cy="47" r="3" fill="hsl(0, 70%, 55%)" />
        </g>

        {/* Robot position */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, 20, 20, 40, 40, 0],
                  y: [0, 0, 15, 15, 30, 30],
                }
              : {}
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <circle
            cx="140"
            cy="130"
            r="6"
            fill="white"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </motion.g>
      </svg>
    </div>
  );
};

export default FloorMap;
