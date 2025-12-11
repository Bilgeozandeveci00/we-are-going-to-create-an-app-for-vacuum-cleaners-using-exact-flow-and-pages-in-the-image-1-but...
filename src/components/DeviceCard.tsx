import { Battery, ChevronRight, Zap } from "lucide-react";

interface Device {
  id: string;
  name: string;
  model: string;
  status: string;
  battery: number;
  lastCleaned: string;
}

interface DeviceCardProps {
  device: Device;
  onClick: () => void;
}

const DeviceCard = ({ device, onClick }: DeviceCardProps) => {
  const statusColors = {
    idle: "text-muted-foreground",
    cleaning: "text-primary",
    charging: "text-yellow-500",
    error: "text-destructive",
  };

  const statusLabels = {
    idle: "Idle",
    cleaning: "Cleaning",
    charging: "Charging",
    error: "Error",
  };

  return (
    <button
      onClick={onClick}
      className="group w-full rounded-2xl bg-card p-4 text-left transition-all hover:bg-card-elevated active:scale-[0.98]"
    >
      <div className="flex items-center gap-4">
        {/* Device Image Placeholder */}
        <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
          <svg
            className="h-10 w-10 text-primary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
          </svg>
        </div>

        {/* Device Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{device.name}</h3>
          <p className="text-sm text-muted-foreground">{device.model}</p>
          <div className="mt-2 flex items-center gap-3">
            {/* Status */}
            <span
              className={`flex items-center gap-1 text-xs ${
                statusColors[device.status as keyof typeof statusColors]
              }`}
            >
              {device.status === "charging" && <Zap className="h-3 w-3" />}
              {statusLabels[device.status as keyof typeof statusLabels]}
            </span>
            {/* Battery */}
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Battery className="h-3 w-3" />
              {device.battery}%
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
      </div>
    </button>
  );
};

export default DeviceCard;
