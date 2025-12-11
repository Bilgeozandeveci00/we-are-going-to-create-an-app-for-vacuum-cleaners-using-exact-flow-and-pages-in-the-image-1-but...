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
    id: "living",
    name: "Room",
    path: "M10 30 L75 30 L75 45 L95 45 L95 30 L110 30 L110 90 L95 90 L95 110 L75 110 L75 130 L55 130 L55 150 L10 150 Z",
    color: "hsl(200, 70%, 55%)",
    labelX: 50,
    labelY: 85,
  },
  {
    id: "bedroom1",
    name: "Room",
    path: "M115 30 L155 30 L155 75 L115 75 Z",
    color: "hsl(45, 80%, 55%)",
    labelX: 135,
    labelY: 52,
  },
  {
    id: "bedroom2",
    name: "Room",
    path: "M115 80 L155 80 L155 130 L100 130 L100 115 L115 115 Z",
    color: "hsl(15, 70%, 60%)",
    labelX: 130,
    labelY: 105,
  },
  {
    id: "kitchen",
    name: "Room",
    path: "M60 155 L100 155 L100 135 L115 135 L115 170 L60 170 Z",
    color: "hsl(280, 50%, 55%)",
    labelX: 87,
    labelY: 155,
  },
  {
    id: "bathroom",
    name: "Room",
    path: "M120 135 L155 135 L155 170 L120 170 Z",
    color: "hsl(160, 50%, 50%)",
    labelX: 137,
    labelY: 152,
  },
];

const FloorMap = ({ isRunning, selectedRoom, onRoomSelect }: FloorMapProps) => {
  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 170 185" preserveAspectRatio="xMidYMid meet">
        {/* Background walls/structure */}
        <rect x="5" y="25" width="155" height="155" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" strokeOpacity="0.3" />
        
        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            <motion.path
              d={room.path}
              fill={room.color}
              fillOpacity={selectedRoom === room.id ? 0.9 : 0.7}
              stroke="hsl(var(--background))"
              strokeWidth="3"
              whileHover={{ fillOpacity: 0.9 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Cleaning path lines inside rooms */}
            <g opacity="0.25">
              {room.id === "living" && (
                <>
                  <path d="M15 40 L70 40 M15 50 L70 50 M15 60 L70 60 M15 70 L100 70 M15 80 L100 80 M15 90 L90 90 M15 100 L70 100 M15 110 L70 110 M15 120 L70 120 M15 130 L50 130 M15 140 L50 140" stroke="white" strokeWidth="0.8" />
                </>
              )}
              {room.id === "bedroom1" && (
                <path d="M120 38 L150 38 M120 48 L150 48 M120 58 L150 58 M120 68 L150 68" stroke="white" strokeWidth="0.8" />
              )}
              {room.id === "bedroom2" && (
                <path d="M105 122 L150 122 M120 90 L150 90 M120 100 L150 100 M120 110 L150 110" stroke="white" strokeWidth="0.8" />
              )}
              {room.id === "kitchen" && (
                <path d="M65 160 L110 160 M75 165 L110 165" stroke="white" strokeWidth="0.8" />
              )}
              {room.id === "bathroom" && (
                <path d="M125 145 L150 145 M125 155 L150 155 M125 165 L150 165" stroke="white" strokeWidth="0.8" />
              )}
            </g>
            
            {/* Room label */}
            <g>
              <circle cx={room.labelX} cy={room.labelY - 6} r="5" fill="hsl(var(--background))" fillOpacity="0.85" />
              <g transform={`translate(${room.labelX - 3}, ${room.labelY - 9})`}>
                <path
                  d="M3 0 L6 2.5 L6 6 L0 6 L0 2.5 Z"
                  fill={room.color}
                  stroke="none"
                />
              </g>
              <text
                x={room.labelX}
                y={room.labelY + 6}
                fontSize="6"
                fill="white"
                textAnchor="middle"
                fontWeight="500"
              >
                {room.name}
              </text>
            </g>
          </g>
        ))}

        {/* Wall details / doorways */}
        <g stroke="hsl(var(--background))" strokeWidth="2" opacity="0.6">
          {/* Door openings */}
          <line x1="85" y1="45" x2="85" y2="30" />
          <line x1="115" y1="52" x2="110" y2="52" />
          <line x1="115" y1="100" x2="110" y2="100" />
          <line x1="100" y1="145" x2="100" y2="135" />
        </g>

        {/* Furniture hints */}
        <g opacity="0.15">
          {/* Living room furniture */}
          <rect x="20" y="45" width="25" height="15" fill="white" rx="2" />
          <rect x="25" y="100" width="20" height="25" fill="white" rx="2" />
          
          {/* Bedroom furniture */}
          <rect x="125" y="40" width="20" height="25" fill="white" rx="2" />
          <rect x="125" y="90" width="20" height="30" fill="white" rx="2" />
        </g>

        {/* Dock station marker */}
        <g>
          <line x1="148" y1="35" x2="148" y2="48" stroke="hsl(0, 70%, 55%)" strokeWidth="2.5" />
          <circle cx="148" cy="33" r="3" fill="hsl(0, 70%, 55%)" />
          <circle cx="148" cy="50" r="3" fill="hsl(0, 70%, 55%)" />
        </g>

        {/* Robot position */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, 15, 15, 30, 30, 45, 45, 30, 30, 0],
                  y: [0, 0, 10, 10, 20, 20, 30, 30, 40, 40],
                }
              : {}
          }
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <circle
            cx="125"
            cy="105"
            r="5"
            fill="white"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          {/* Robot direction indicator */}
          <circle
            cx="127"
            cy="103"
            r="1.5"
            fill="hsl(var(--primary))"
          />
        </motion.g>
      </svg>
    </div>
  );
};

export default FloorMap;
