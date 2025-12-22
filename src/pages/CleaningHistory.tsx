import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Zap, Droplets, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CleaningRecord {
  id: string;
  date: string;
  time: string;
  duration: number; // in minutes
  area: number; // in sq meters
  mode: "safe" | "deep" | "custom";
  customMode?: string;
  rooms: string[];
  batteryUsed: number;
  status: "completed" | "interrupted" | "cancelled";
}

const roomNames: Record<string, string> = {
  living: "Living Room",
  dining: "Dining",
  hallway: "Hallway",
  bedroom1: "Master Bed",
  bedroom2: "Bedroom",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  laundry: "Laundry",
};

const mockHistory: CleaningRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    time: "09:00",
    duration: 45,
    area: 68,
    mode: "deep",
    rooms: [],
    batteryUsed: 32,
    status: "completed",
  },
  {
    id: "2",
    date: "2024-01-14",
    time: "14:30",
    duration: 28,
    area: 42,
    mode: "safe",
    rooms: ["kitchen", "bathroom"],
    batteryUsed: 18,
    status: "completed",
  },
  {
    id: "3",
    date: "2024-01-13",
    time: "10:00",
    duration: 15,
    area: 24,
    mode: "custom",
    customMode: "quiet",
    rooms: ["bedroom1"],
    batteryUsed: 12,
    status: "interrupted",
  },
  {
    id: "4",
    date: "2024-01-12",
    time: "09:00",
    duration: 52,
    area: 75,
    mode: "deep",
    rooms: [],
    batteryUsed: 38,
    status: "completed",
  },
  {
    id: "5",
    date: "2024-01-11",
    time: "16:00",
    duration: 0,
    area: 0,
    mode: "safe",
    rooms: ["living"],
    batteryUsed: 0,
    status: "cancelled",
  },
  {
    id: "6",
    date: "2024-01-10",
    time: "09:00",
    duration: 48,
    area: 70,
    mode: "deep",
    rooms: [],
    batteryUsed: 35,
    status: "completed",
  },
];

const CleaningHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 0) return "-";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins} min`;
  };

  const formatRooms = (rooms: string[]) => {
    if (rooms.length === 0) return "All Rooms";
    if (rooms.length === 1) return roomNames[rooms[0]];
    return `${rooms.length} rooms`;
  };

  const getStatusColor = (status: CleaningRecord["status"]) => {
    switch (status) {
      case "completed":
        return "text-emerald-500";
      case "interrupted":
        return "text-amber-500";
      case "cancelled":
        return "text-destructive";
    }
  };

  const getStatusBg = (status: CleaningRecord["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/10";
      case "interrupted":
        return "bg-amber-500/10";
      case "cancelled":
        return "bg-destructive/10";
    }
  };

  const getModeDisplay = (record: CleaningRecord) => {
    if (record.mode === "custom" && record.customMode) {
      return record.customMode.charAt(0).toUpperCase() + record.customMode.slice(1) + " Mode";
    }
    return record.mode.charAt(0).toUpperCase() + record.mode.slice(1) + " Mode";
  };

  // Group records by date
  const groupedRecords = mockHistory.reduce((acc, record) => {
    const dateKey = formatDate(record.date);
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);
    return acc;
  }, {} as Record<string, CleaningRecord[]>);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/device/${id}/robot-settings`)}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Cleaning History</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-4 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-card rounded-2xl p-4 text-center border border-border">
            <p className="text-2xl font-bold text-foreground">
              {mockHistory.filter(r => r.status === "completed").length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Cleanings</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border">
            <p className="text-2xl font-bold text-foreground">
              {mockHistory.reduce((acc, r) => acc + r.area, 0)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">m² cleaned</p>
          </div>
          <div className="bg-card rounded-2xl p-4 text-center border border-border">
            <p className="text-2xl font-bold text-foreground">
              {Math.round(mockHistory.reduce((acc, r) => acc + r.duration, 0) / 60)}h
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total time</p>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {Object.entries(groupedRecords).map(([date, records]) => (
            <div key={date}>
              <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {date}
              </h3>
              <div className="space-y-2">
                {records.map((record) => (
                  <motion.div
                    key={record.id}
                    layout
                    className="bg-card rounded-2xl border border-border overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg font-semibold text-foreground">
                              {record.time}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBg(record.status)} ${getStatusColor(record.status)}`}>
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(record.duration)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {record.area > 0 ? `${record.area} m²` : "-"}
                            </span>
                          </div>
                        </div>
                        {expandedId === record.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {/* Expanded Details */}
                    {expandedId === record.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-4 pb-4 border-t border-border/50"
                      >
                        <div className="pt-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Cleaning Mode</span>
                            <span className={`text-sm font-medium ${
                              record.mode === "safe" ? "text-emerald-500" :
                              record.mode === "deep" ? "text-primary" :
                              "text-amber-500"
                            }`}>
                              {getModeDisplay(record)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Rooms</span>
                            <span className="text-sm text-foreground">
                              {formatRooms(record.rooms)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Zap className="w-3.5 h-3.5" />
                              Battery Used
                            </span>
                            <span className="text-sm text-foreground">
                              {record.batteryUsed > 0 ? `${record.batteryUsed}%` : "-"}
                            </span>
                          </div>
                          {record.status === "interrupted" && (
                            <div className="bg-amber-500/10 rounded-xl p-3 mt-2">
                              <p className="text-xs text-amber-500">
                                Cleaning was interrupted. Robot may have encountered an obstacle or low battery.
                              </p>
                            </div>
                          )}
                          {record.status === "cancelled" && (
                            <div className="bg-destructive/10 rounded-xl p-3 mt-2">
                              <p className="text-xs text-destructive">
                                Cleaning was cancelled by user before starting.
                              </p>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CleaningHistory;