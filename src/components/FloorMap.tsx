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
    name: "Living Room",
    path: "M15 25 L85 25 L85 55 L100 55 L100 25 L130 25 L130 95 L100 95 L100 75 L85 75 L85 95 L15 95 Z",
    color: "hsl(200, 70%, 50%)",
    labelX: 55,
    labelY: 60,
  },
  {
    id: "bedroom",
    name: "Bedroom",
    path: "M135 25 L185 25 L185 75 L135 75 Z",
    color: "hsl(45, 75%, 50%)",
    labelX: 160,
    labelY: 50,
  },
  {
    id: "bathroom",
    name: "Bathroom",
    path: "M135 80 L185 80 L185 115 L135 115 Z",
    color: "hsl(280, 55%, 50%)",
    labelX: 160,
    labelY: 97,
  },
  {
    id: "kitchen",
    name: "Kitchen",
    path: "M15 100 L80 100 L80 140 L15 140 Z",
    color: "hsl(15, 70%, 55%)",
    labelX: 47,
    labelY: 120,
  },
  {
    id: "hallway",
    name: "Hallway",
    path: "M85 100 L130 100 L130 140 L85 140 Z",
    color: "hsl(160, 50%, 45%)",
    labelX: 107,
    labelY: 120,
  },
];

const FloorMap = ({ isRunning, selectedRoom, onRoomSelect }: FloorMapProps) => {
  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 200 155" preserveAspectRatio="xMidYMid meet">
        {/* Background grid pattern for depth */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--border))" strokeWidth="0.3" opacity="0.3" />
          </pattern>
          <linearGradient id="roomGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background fill */}
        <rect x="0" y="0" width="200" height="155" fill="hsl(var(--background))" />
        <rect x="10" y="20" width="180" height="130" fill="url(#grid)" opacity="0.5" />
        
        {/* Outer walls shadow */}
        <path
          d="M15 25 L130 25 L130 25 L130 95 L135 95 L135 25 L185 25 L185 115 L135 115 L135 140 L15 140 Z"
          fill="none"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="4"
          strokeOpacity="0.15"
          transform="translate(2, 2)"
        />
        
        {/* Rooms */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            <motion.path
              d={room.path}
              fill={room.color}
              fillOpacity={selectedRoom === room.id ? 0.85 : 0.65}
              stroke="hsl(var(--background))"
              strokeWidth="2.5"
              whileHover={{ fillOpacity: 0.85 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Room highlight effect */}
            <path
              d={room.path}
              fill="url(#roomGlow)"
              pointerEvents="none"
            />
            
            {/* Cleaning path lines inside rooms */}
            <g opacity="0.35" strokeLinecap="round">
              {room.id === "living" && (
                <path 
                  d="M20 32 L78 32 M20 40 L78 40 M20 48 L78 48 M20 56 L78 56 M20 64 L78 64 M20 72 L78 72 M20 80 L78 80 M20 88 L78 88 M105 32 L125 32 M105 40 L125 40 M105 48 L125 48 M105 56 L125 56 M105 64 L125 64 M90 60 L95 60 L95 68 L90 68" 
                  stroke="white" 
                  strokeWidth="0.8" 
                  fill="none"
                />
              )}
              {room.id === "bedroom" && (
                <path 
                  d="M140 32 L180 32 M140 40 L180 40 M140 48 L180 48 M140 56 L180 56 M140 64 L180 64 M140 70 L180 70" 
                  stroke="white" 
                  strokeWidth="0.8" 
                  fill="none"
                />
              )}
              {room.id === "bathroom" && (
                <path 
                  d="M140 87 L180 87 M140 95 L180 95 M140 103 L180 103 M140 110 L180 110" 
                  stroke="white" 
                  strokeWidth="0.8" 
                  fill="none"
                />
              )}
              {room.id === "kitchen" && (
                <path 
                  d="M20 107 L75 107 M20 115 L75 115 M20 123 L75 123 M20 131 L75 131" 
                  stroke="white" 
                  strokeWidth="0.8" 
                  fill="none"
                />
              )}
              {room.id === "hallway" && (
                <path 
                  d="M90 107 L125 107 M90 115 L125 115 M90 123 L125 123 M90 131 L125 131" 
                  stroke="white" 
                  strokeWidth="0.8" 
                  fill="none"
                />
              )}
            </g>
            
            {/* Room label with icon */}
            <g>
              <rect
                x={room.labelX - 22}
                y={room.labelY - 7}
                width="44"
                height="14"
                rx="7"
                fill="hsl(var(--background))"
                fillOpacity="0.9"
              />
              <g transform={`translate(${room.labelX - 18}, ${room.labelY - 4})`}>
                <rect width="8" height="8" rx="2" fill={room.color} />
              </g>
              <text
                x={room.labelX + 5}
                y={room.labelY + 3}
                fontSize="6"
                fill="hsl(var(--foreground))"
                textAnchor="middle"
                fontWeight="500"
              >
                {room.name}
              </text>
            </g>
          </g>
        ))}

        {/* Wall borders for clarity - doors */}
        <g stroke="hsl(var(--background))" strokeWidth="3" opacity="0.8">
          {/* Living room to bedroom doorway */}
          <line x1="130" y1="45" x2="135" y2="45" />
          {/* Living room to hallway doorway */}
          <line x1="100" y1="95" x2="100" y2="100" />
          {/* Kitchen to hallway doorway */}
          <line x1="80" y1="115" x2="85" y2="115" />
          {/* Hallway to bathroom doorway */}
          <line x1="130" y1="100" x2="135" y2="100" />
        </g>

        {/* Furniture hints */}
        <g opacity="0.2" fill="white">
          {/* Living room - sofa */}
          <rect x="22" y="55" width="30" height="12" rx="3" />
          {/* Living room - coffee table */}
          <rect x="30" y="72" width="14" height="10" rx="2" />
          {/* Living room - TV unit */}
          <rect x="105" y="70" width="20" height="4" rx="1" />
          
          {/* Bedroom - bed */}
          <rect x="145" y="35" width="32" height="28" rx="3" />
          {/* Bedroom - nightstand */}
          <rect x="140" y="40" width="4" height="6" rx="1" />
          
          {/* Kitchen - counter */}
          <rect x="17" y="102" width="5" height="35" rx="1" />
          <rect x="17" y="102" width="25" height="5" rx="1" />
          
          {/* Bathroom - fixtures */}
          <rect x="137" y="82" width="10" height="8" rx="2" />
          <circle cx="175" cy="106" r="5" />
        </g>

        {/* Dock station with modern look */}
        <g transform="translate(170, 30)">
          {/* Dock base */}
          <rect x="-8" y="-3" width="16" height="18" rx="3" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
          {/* Charging indicator */}
          <rect x="-4" y="0" width="8" height="3" rx="1" fill="hsl(160, 70%, 45%)" />
          {/* Connection pins */}
          <circle cx="-3" cy="10" r="1.5" fill="hsl(var(--muted-foreground))" />
          <circle cx="3" cy="10" r="1.5" fill="hsl(var(--muted-foreground))" />
        </g>

        {/* Robot position with glow */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, 20, 20, 40, 40, 60, 60, 40, 40, 20, 20, 0],
                  y: [0, 0, 15, 15, 30, 30, 45, 45, 60, 60, 75, 75],
                }
              : {}
          }
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Robot glow effect */}
          <circle
            cx="40"
            cy="45"
            r="8"
            fill="hsl(var(--primary))"
            opacity="0.3"
            filter="url(#glow)"
          />
          {/* Robot body */}
          <circle
            cx="40"
            cy="45"
            r="6"
            fill="hsl(var(--card))"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          {/* Robot direction indicator */}
          <circle
            cx="43"
            cy="43"
            r="1.5"
            fill="hsl(var(--primary))"
          />
          {/* Robot sensor line */}
          <path
            d="M37 43 L43 43"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            opacity="0.6"
          />
        </motion.g>

        {/* Cleaning progress indicator when running */}
        {isRunning && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <rect
              x="15"
              y="145"
              width="170"
              height="3"
              rx="1.5"
              fill="hsl(var(--muted))"
            />
            <motion.rect
              x="15"
              y="145"
              height="3"
              rx="1.5"
              fill="hsl(var(--primary))"
              initial={{ width: 0 }}
              animate={{ width: 170 }}
              transition={{ duration: 18, repeat: Infinity }}
            />
          </motion.g>
        )}
      </svg>
    </div>
  );
};

export default FloorMap;
