import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const CleaningHistory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const historyItems = [
    { date: "12/11", time: "10:58", mode: "All", duration: 50, area: 34, success: true },
    { date: "12/06", time: "12:05", mode: "All", duration: 29, area: 25, success: true },
    { date: "12/05", time: "11:51", mode: "All", duration: 33, area: 33, success: true },
    { date: "12/04", time: "14:56", mode: "All", duration: 35, area: 33, success: false },
    { date: "12/03", time: "11:57", mode: "All", duration: 39, area: 34, success: true },
    { date: "12/01", time: "14:14", mode: "All", duration: 16, area: 20, success: true },
  ];

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

      {/* Stats Header */}
      <div className="px-4 py-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-light text-foreground">23k</span>
              <span className="text-lg text-muted-foreground">m²</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">Total Area</p>
            
            <div className="mt-4">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-foreground">508</span>
                <span className="text-sm text-muted-foreground">h</span>
              </div>
              <p className="text-xs text-muted-foreground">Total Time</p>
            </div>
            
            <div className="mt-3">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-light text-foreground">1183</span>
                <span className="text-sm text-muted-foreground">times</span>
              </div>
              <p className="text-xs text-muted-foreground">Cleaning Sessions</p>
            </div>
          </div>
          
          <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-14 h-14 text-primary" />
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 px-4 space-y-3 pb-8">
        {historyItems.map((item, index) => (
          <button
            key={index}
            className="w-full bg-card rounded-2xl p-4 flex items-center gap-4 hover:bg-card/80 transition-colors"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.success ? "bg-green-500/20" : "bg-amber-500/20"
            }`}>
              {item.success ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-foreground font-medium">
                {item.date} {item.time}
              </p>
              <p className="text-sm text-muted-foreground">
                {item.mode} | <span className="font-medium text-foreground">{item.duration} min</span> | <span className="font-medium text-foreground">{item.area} m²</span>
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CleaningHistory;
