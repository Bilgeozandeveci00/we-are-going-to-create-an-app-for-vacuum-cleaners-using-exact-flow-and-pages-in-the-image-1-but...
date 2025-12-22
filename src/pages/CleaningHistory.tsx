import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Clock, MapPin, Zap, Calendar, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, XCircle, Play, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CleaningRecord {
  id: string;
  date: string;
  time: string;
  duration: number;
  area: number;
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

  // Calculate insights
  const completedCleanings = mockHistory.filter(r => r.status === "completed");
  const successRate = Math.round((completedCleanings.length / mockHistory.length) * 100);
  const totalArea = mockHistory.reduce((acc, r) => acc + r.area, 0);
  const totalTime = mockHistory.reduce((acc, r) => acc + r.duration, 0);
  const avgArea = Math.round(totalArea / completedCleanings.length);
  const lastCleaning = mockHistory[0];
  const issueCount = mockHistory.filter(r => r.status !== "completed").length;

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
    return `${mins}m`;
  };

  const formatRooms = (rooms: string[]) => {
    if (rooms.length === 0) return "Whole home";
    if (rooms.length === 1) return roomNames[rooms[0]];
    return `${rooms.length} rooms`;
  };

  const getStatusIcon = (status: CleaningRecord["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "interrupted":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-destructive" />;
    }
  };

  const getModeDisplay = (record: CleaningRecord) => {
    if (record.mode === "custom" && record.customMode) {
      return record.customMode.charAt(0).toUpperCase() + record.customMode.slice(1);
    }
    return record.mode.charAt(0).toUpperCase() + record.mode.slice(1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/device/${id}`)}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Cleaning History</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-2 space-y-6 pb-8">
        
        {/* Hero Insight Card - The most important thing */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-primary uppercase tracking-wide">This Week</span>
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                {totalArea} m²
              </p>
              <p className="text-sm text-muted-foreground">
                cleaned across {completedCleanings.length} sessions
              </p>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${successRate >= 80 ? 'text-emerald-500' : successRate >= 60 ? 'text-amber-500' : 'text-destructive'}`}>
                {successRate}%
              </div>
              <p className="text-xs text-muted-foreground">success rate</p>
            </div>
          </div>
          
          {/* Trend indicator */}
          <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-sm text-muted-foreground">
              Avg. <span className="text-foreground font-medium">{avgArea} m²</span> per clean • <span className="text-foreground font-medium">{formatDuration(Math.round(totalTime / completedCleanings.length))}</span> avg time
            </span>
          </div>
        </motion.div>

        {/* Quick Stats Row */}
        <div className="flex gap-3">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-1 bg-card rounded-2xl p-4 border border-border"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Total Time</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {Math.floor(totalTime / 60)}h {totalTime % 60}m
            </p>
          </motion.div>
          
          {issueCount > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="flex-1 bg-amber-500/10 rounded-2xl p-4 border border-amber-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-amber-500">Issues</span>
              </div>
              <p className="text-xl font-bold text-amber-500">
                {issueCount}
              </p>
            </motion.div>
          )}
        </div>

        {/* Last Cleaning - Prominent recent activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">Last Cleaning</h2>
            <span className="text-xs text-muted-foreground">{formatDate(lastCleaning.date)}</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl border border-border p-4"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                lastCleaning.status === "completed" ? "bg-emerald-500/15" :
                lastCleaning.status === "interrupted" ? "bg-amber-500/15" :
                "bg-destructive/15"
              }`}>
                {getStatusIcon(lastCleaning.status)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">{formatRooms(lastCleaning.rooms)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {getModeDisplay(lastCleaning)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{formatDuration(lastCleaning.duration)}</span>
                  <span>•</span>
                  <span>{lastCleaning.area} m²</span>
                  <span>•</span>
                  <span>{lastCleaning.time}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary"
                onClick={() => navigate(`/device/${id}`)}
              >
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        {/* History Timeline - Simplified */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">All Sessions</h2>
          <div className="space-y-2">
            {mockHistory.map((record, index) => (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.03 }}
                className="bg-card rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                  className="w-full p-3 text-left flex items-center gap-3"
                >
                  {/* Status indicator dot */}
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    record.status === "completed" ? "bg-emerald-500" :
                    record.status === "interrupted" ? "bg-amber-500" :
                    "bg-destructive"
                  }`} />
                  
                  {/* Date & Time */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {formatDate(record.date)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {record.time}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {formatRooms(record.rooms)} • {getModeDisplay(record)}
                    </div>
                  </div>
                  
                  {/* Quick stats */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-medium text-foreground">
                      {record.area > 0 ? `${record.area} m²` : "-"}
                    </span>
                    <div className="text-xs text-muted-foreground">
                      {formatDuration(record.duration)}
                    </div>
                  </div>
                  
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform flex-shrink-0 ${
                    expandedId === record.id ? "rotate-180" : ""
                  }`} />
                </button>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === record.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 pt-1 border-t border-border/50">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Status</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {getStatusIcon(record.status)}
                              <span className={`font-medium capitalize ${
                                record.status === "completed" ? "text-emerald-500" :
                                record.status === "interrupted" ? "text-amber-500" :
                                "text-destructive"
                              }`}>
                                {record.status}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Battery Used</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Zap className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">
                                {record.batteryUsed > 0 ? `${record.batteryUsed}%` : "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {record.status === "interrupted" && (
                          <div className="mt-3 bg-amber-500/10 rounded-lg p-2.5">
                            <p className="text-xs text-amber-600 dark:text-amber-400">
                              Cleaning was interrupted — robot may have encountered an obstacle.
                            </p>
                          </div>
                        )}
                        
                        {record.status === "cancelled" && (
                          <div className="mt-3 bg-destructive/10 rounded-lg p-2.5">
                            <p className="text-xs text-destructive">
                              Cleaning was cancelled before it could start.
                            </p>
                          </div>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3"
                          onClick={() => navigate(`/device/${id}`)}
                        >
                          <Play className="w-3.5 h-3.5 mr-1.5" />
                          Run Again
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningHistory;