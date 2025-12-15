import { motion } from "framer-motion";

interface Room {
  id: string;
  name: string;
  path: string;
  color: string;
  labelX: number;
  labelY: number;
  cleaningPaths: string;
}

interface FloorMapProps {
  isRunning: boolean;
  selectedRoom?: string;
  onRoomSelect?: (roomId: string) => void;
  showLabels?: boolean;
}

const rooms: Room[] = [
  {
    id: "living",
    name: "Living Room",
    path: "M20 60 L20 30 Q25 25 35 25 L90 25 L90 30 L95 30 L95 25 L145 25 Q155 25 155 35 L155 55 L140 55 L140 70 Q140 75 135 75 L115 75 L115 90 L100 90 L100 95 L85 95 L85 90 L75 90 Q70 90 70 85 L70 75 L55 75 L55 90 Q55 95 50 95 L30 95 Q25 95 25 90 L25 75 L20 75 Z",
    color: "hsl(210, 60%, 45%)",
    labelX: 85,
    labelY: 55,
    cleaningPaths: "M30 35 L85 35 M30 42 L85 42 M30 49 L85 49 M30 56 L85 56 M30 63 L70 63 M30 70 L65 70 M30 77 L50 77 M30 84 L45 84 M100 35 L145 35 M100 42 L145 42 M100 49 L145 49 M115 56 L135 56 M115 63 L135 63 M115 70 L130 70",
  },
  {
    id: "bedroom",
    name: "Bedroom",
    path: "M160 25 L195 25 Q200 25 200 30 L200 75 Q200 80 195 80 L180 80 L180 95 L175 95 L175 80 L160 80 Q155 80 155 75 L155 55 L160 55 L160 30 Q160 25 165 25 Z",
    color: "hsl(35, 70%, 55%)",
    labelX: 178,
    labelY: 50,
    cleaningPaths: "M165 32 L193 32 M165 40 L193 40 M165 48 L193 48 M165 56 L193 56 M165 64 L193 64 M165 72 L193 72 M177 82 L177 92",
  },
  {
    id: "bathroom",
    name: "Bathroom",
    path: "M160 85 L195 85 Q200 85 200 90 L200 130 Q200 135 195 135 L165 135 Q160 135 160 130 L160 90 Q160 85 165 85 Z",
    color: "hsl(200, 50%, 55%)",
    labelX: 180,
    labelY: 110,
    cleaningPaths: "M167 92 L193 92 M167 100 L193 100 M167 108 L193 108 M167 116 L193 116 M167 124 L193 124",
  },
  {
    id: "kitchen",
    name: "Kitchen",
    path: "M20 100 L70 100 L70 105 L75 105 L75 100 L100 100 L100 105 L105 105 L105 100 L115 100 L115 110 L105 110 L105 140 Q105 145 100 145 L25 145 Q20 145 20 140 Z",
    color: "hsl(210, 55%, 50%)",
    labelX: 62,
    labelY: 125,
    cleaningPaths: "M28 108 L98 108 M28 116 L98 116 M28 124 L98 124 M28 132 L98 132 M28 139 L98 139",
  },
  {
    id: "hallway",
    name: "Hallway",
    path: "M110 100 L155 100 L155 145 L110 145 Z",
    color: "hsl(220, 45%, 40%)",
    labelX: 132,
    labelY: 125,
    cleaningPaths: "M115 108 L150 108 M115 116 L150 116 M115 124 L150 124 M115 132 L150 132 M115 140 L150 140",
  },
];

// Furniture and obstacles
const furniture = [
  // Living room - L-shaped sofa
  { type: "sofa", path: "M28 40 L28 60 L32 60 L32 48 L55 48 L55 44 L28 44 Z", room: "living" },
  // Living room - coffee table
  { type: "table", path: "M38 52 L52 52 L52 58 L38 58 Z", room: "living" },
  // Living room - TV stand
  { type: "tv", path: "M125 30 L140 30 L140 35 L125 35 Z", room: "living" },
  // Living room - armchair
  { type: "chair", path: "M60 55 Q60 50 65 50 Q70 50 70 55 L70 62 L60 62 Z", room: "living" },
  // Bedroom - bed
  { type: "bed", path: "M168 35 L195 35 L195 70 L168 70 Z", room: "bedroom" },
  // Bedroom - nightstand
  { type: "nightstand", path: "M163 45 L168 45 L168 55 L163 55 Z", room: "bedroom" },
  // Bathroom - toilet
  { type: "toilet", path: "M188 92 Q193 92 193 97 L193 103 Q193 108 188 108 Q183 108 183 103 L183 97 Q183 92 188 92 Z", room: "bathroom" },
  // Bathroom - sink
  { type: "sink", path: "M167 92 Q172 92 172 97 L172 103 Q172 108 167 108 Q162 108 162 103 L162 97 Q162 92 167 92 Z", room: "bathroom" },
  // Bathroom - shower
  { type: "shower", path: "M175 118 L193 118 L193 133 L175 133 Z", room: "bathroom" },
  // Kitchen - counter L-shape
  { type: "counter", path: "M23 103 L23 142 L28 142 L28 108 L50 108 L50 103 Z", room: "kitchen" },
  // Kitchen - island
  { type: "island", path: "M55 118 L80 118 L80 128 L55 128 Z", room: "kitchen" },
  // Kitchen - fridge
  { type: "fridge", path: "M92 103 L100 103 L100 118 L92 118 Z", room: "kitchen" },
];

// No-go zones / obstacles
const obstacles = [
  { cx: 45, cy: 82, r: 4 }, // Plant in living room
  { cx: 178, cy: 88, r: 3 }, // Item near bathroom door
];

const FloorMap = ({ isRunning, selectedRoom, onRoomSelect, showLabels = false }: FloorMapProps) => {
  return (
    <div className="relative w-full h-full">
      <svg className="w-full h-full" viewBox="0 0 220 160" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Subtle texture pattern */}
          <pattern id="floorTexture" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill="transparent" />
            <circle cx="2" cy="2" r="0.3" fill="white" opacity="0.05" />
          </pattern>
          
          {/* Cleaning path pattern */}
          <pattern id="cleaningPattern" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M0 4 L8 4" stroke="white" strokeWidth="0.5" opacity="0.15" />
          </pattern>
          
          {/* Glow filter for robot */}
          <filter id="robotGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dark background */}
        <rect x="0" y="0" width="220" height="160" fill="hsl(220, 25%, 12%)" />

        {/* Outer walls / floor area */}
        <path
          d="M15 20 L205 20 L205 150 L15 150 Z"
          fill="hsl(220, 20%, 18%)"
          stroke="hsl(220, 30%, 25%)"
          strokeWidth="1"
        />

        {/* Rooms with organic shapes */}
        {rooms.map((room) => (
          <g key={room.id} onClick={() => onRoomSelect?.(room.id)} className="cursor-pointer">
            {/* Room fill */}
            <motion.path
              d={room.path}
              fill={room.color}
              fillOpacity={selectedRoom === room.id ? 0.95 : 0.85}
              stroke="hsl(220, 25%, 8%)"
              strokeWidth="1.5"
              whileHover={{ fillOpacity: 0.95 }}
              transition={{ duration: 0.2 }}
            />
            
            {/* Floor texture overlay */}
            <path
              d={room.path}
              fill="url(#floorTexture)"
              pointerEvents="none"
            />

            {/* Cleaning path lines */}
            <path
              d={room.cleaningPaths}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
              pointerEvents="none"
            />

            {/* Room label */}
            {showLabels && (
              <g transform={`translate(${room.labelX}, ${room.labelY})`}>
                {/* Label background pill */}
                <rect
                  x={-room.name.length * 2.5 - 4}
                  y="-6"
                  width={room.name.length * 5 + 8}
                  height="12"
                  rx="3"
                  fill="hsl(220, 20%, 18%)"
                  opacity="0.85"
                />
                <text
                  x="0"
                  y="3"
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

        {/* Furniture and obstacles */}
        <g>
          {furniture.map((item, index) => (
            <path
              key={index}
              d={item.path}
              fill="hsl(220, 20%, 25%)"
              stroke="hsl(220, 20%, 30%)"
              strokeWidth="0.5"
              opacity="0.7"
            />
          ))}
          
          {/* Circular obstacles */}
          {obstacles.map((obs, index) => (
            <circle
              key={index}
              cx={obs.cx}
              cy={obs.cy}
              r={obs.r}
              fill="hsl(220, 20%, 25%)"
              stroke="hsl(220, 20%, 30%)"
              strokeWidth="0.5"
              opacity="0.7"
            />
          ))}
        </g>

        {/* Door/connection indicators - clear openings between rooms */}
        <g>
          {/* Living to kitchen - door opening */}
          <line x1="70" y1="95" x2="85" y2="95" stroke="hsl(210, 58%, 47%)" strokeWidth="4" />
          <rect x="72" y="93" width="10" height="4" rx="1" fill="hsl(220, 25%, 12%)" />
          
          {/* Living to hallway */}
          <line x1="115" y1="90" x2="115" y2="100" stroke="hsl(215, 52%, 42%)" strokeWidth="4" />
          <rect x="113" y="92" width="4" height="6" rx="1" fill="hsl(220, 25%, 12%)" />
          
          {/* Hallway to bathroom */}
          <line x1="155" y1="105" x2="160" y2="105" stroke="hsl(200, 50%, 55%)" strokeWidth="4" />
          <rect x="155" y="103" width="5" height="4" rx="1" fill="hsl(220, 25%, 12%)" />
          
          {/* Living to bedroom - connection */}
          <line x1="155" y1="40" x2="160" y2="40" stroke="hsl(35, 70%, 55%)" strokeWidth="4" />
          <rect x="155" y="38" width="5" height="4" rx="1" fill="hsl(220, 25%, 12%)" />
          
          {/* Hallway to kitchen */}
          <line x1="105" y1="115" x2="115" y2="115" stroke="hsl(215, 50%, 45%)" strokeWidth="4" />
          <rect x="106" y="113" width="7" height="4" rx="1" fill="hsl(220, 25%, 12%)" />
        </g>

        {/* Charging dock */}
        <g transform="translate(190, 140)">
          <rect x="-6" y="-4" width="12" height="8" rx="2" fill="hsl(220, 30%, 20%)" stroke="hsl(160, 70%, 45%)" strokeWidth="1" />
          <rect x="-4" y="-2" width="8" height="2" rx="1" fill="hsl(160, 70%, 45%)" />
        </g>

        {/* Robot vacuum */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, 25, 25, 50, 50, 75, 75, 50, 50, 25, 25, 0],
                  y: [0, 0, 12, 12, 24, 24, 36, 36, 48, 48, 60, 60],
                }
              : {}
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Robot glow */}
          <circle
            cx="45"
            cy="55"
            r="7"
            fill="hsl(var(--primary))"
            opacity={isRunning ? 0.4 : 0.2}
            filter="url(#robotGlow)"
          />
          {/* Robot body */}
          <circle
            cx="45"
            cy="55"
            r="5"
            fill="hsl(220, 20%, 90%)"
            stroke="hsl(var(--primary))"
            strokeWidth="1.5"
          />
          {/* Robot direction indicator */}
          <circle cx="47" cy="53" r="1.2" fill="hsl(var(--primary))" />
          {/* Sensor arc */}
          <path
            d="M42 52 Q45 50 48 52"
            stroke="hsl(var(--primary))"
            strokeWidth="0.8"
            fill="none"
            opacity="0.6"
          />
          
          {/* Cleaning trail when running */}
          {isRunning && (
            <motion.path
              d="M45 55 L45 65"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </motion.g>

        {/* Status indicator when running */}
        {isRunning && (
          <g>
            <rect x="15" y="152" width="190" height="4" rx="2" fill="hsl(220, 20%, 20%)" />
            <motion.rect
              x="15"
              y="152"
              height="4"
              rx="2"
              fill="hsl(var(--primary))"
              initial={{ width: 0 }}
              animate={{ width: 190 }}
              transition={{ duration: 20, repeat: Infinity }}
            />
          </g>
        )}
      </svg>
    </div>
  );
};

export default FloorMap;
