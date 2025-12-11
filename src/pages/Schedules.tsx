import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Schedules = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [startTime, setStartTime] = useState<string | null>(null);
  const [repeatMode, setRepeatMode] = useState("Once");
  const [taskMode, setTaskMode] = useState<"all" | "room">("all");

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
        <h1 className="text-lg font-semibold text-foreground">Schedule</h1>
        <Button variant="ghost" size="icon" className="text-primary">
          <Check className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Time Settings */}
        <div className="bg-card rounded-2xl divide-y divide-border/50">
          <button className="w-full flex items-center justify-between p-4">
            <span className="text-foreground font-medium">Start Time</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {startTime || "Not Set"}
              </span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4">
            <span className="text-foreground font-medium">Repeat</span>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{repeatMode}</span>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </button>
        </div>

        {/* Task Section */}
        <div>
          <p className="text-sm text-muted-foreground mb-3 px-1">Task</p>
          <div className="bg-card rounded-2xl p-4 space-y-4">
            {/* Mode Toggle */}
            <div className="bg-muted rounded-full p-1 flex">
              <button
                onClick={() => setTaskMode("all")}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  taskMode === "all"
                    ? "bg-card text-foreground shadow"
                    : "text-muted-foreground"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTaskMode("room")}
                className={`flex-1 py-2.5 rounded-full text-sm font-medium transition-colors ${
                  taskMode === "room"
                    ? "bg-card text-foreground shadow"
                    : "text-muted-foreground"
                }`}
              >
                Room
              </button>
            </div>

            {/* Cleaning Mode */}
            <button className="w-full flex items-center justify-between py-2">
              <span className="text-foreground">Cleaning Mode</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 5v-2" />
                    <path d="M17 7l1.5-1.5" />
                    <path d="M7 7L5.5 5.5" />
                  </svg>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                  </svg>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedules;
