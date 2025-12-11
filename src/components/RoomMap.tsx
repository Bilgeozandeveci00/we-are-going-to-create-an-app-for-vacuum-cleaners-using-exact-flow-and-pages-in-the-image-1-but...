import { motion } from "framer-motion";

interface RoomMapProps {
  isRunning: boolean;
}

const RoomMap = ({ isRunning }: RoomMapProps) => {
  return (
    <div className="relative h-full w-full p-4">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
        }}
      />

      {/* Room outline */}
      <svg className="h-full w-full" viewBox="0 0 200 150">
        {/* Main room */}
        <path
          d="M20 20 L180 20 L180 80 L140 80 L140 130 L20 130 Z"
          fill="hsl(var(--primary) / 0.1)"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
        
        {/* Cleaned area */}
        <motion.path
          d="M25 25 L100 25 L100 75 L25 75 Z"
          fill="hsl(var(--primary) / 0.3)"
          initial={{ opacity: 0 }}
          animate={{ opacity: isRunning ? [0.3, 0.5, 0.3] : 0.3 }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        
        {/* Furniture obstacles */}
        <rect x="50" y="40" width="20" height="20" rx="2" fill="hsl(var(--muted))" />
        <rect x="110" y="90" width="15" height="25" rx="2" fill="hsl(var(--muted))" />
        <circle cx="160" cy="50" r="10" fill="hsl(var(--muted))" />

        {/* Robot position */}
        <motion.g
          animate={
            isRunning
              ? {
                  x: [0, 30, 30, 60, 60, 0],
                  y: [0, 0, 20, 20, 40, 40],
                }
              : {}
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <circle
            cx="70"
            cy="55"
            r="8"
            fill="hsl(var(--primary))"
            className={isRunning ? "animate-pulse-glow" : ""}
          />
          <circle cx="70" cy="55" r="4" fill="hsl(var(--primary-foreground))" />
          
          {/* Direction indicator */}
          <motion.path
            d="M70 47 L73 52 L67 52 Z"
            fill="hsl(var(--primary-foreground))"
            animate={isRunning ? { rotate: 360 } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "70px 55px" }}
          />
        </motion.g>

        {/* Dock station */}
        <rect x="22" y="115" width="20" height="10" rx="2" fill="hsl(var(--primary))" />
        <text x="32" y="112" fontSize="6" fill="hsl(var(--muted-foreground))" textAnchor="middle">
          Dock
        </text>
      </svg>

      {/* Room labels */}
      <div className="absolute left-6 top-6 text-xs font-medium text-primary">
        Living Room
      </div>
    </div>
  );
};

export default RoomMap;
