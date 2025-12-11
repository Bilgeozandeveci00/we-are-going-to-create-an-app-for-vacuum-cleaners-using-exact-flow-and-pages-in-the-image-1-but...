import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const Maintenance = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const parts = [
    { name: "Main Brush", remaining: 85, total: 300, unit: "hours" },
    { name: "Side Brush", remaining: 120, total: 200, unit: "hours" },
    { name: "Filter", remaining: 45, total: 150, unit: "hours" },
    { name: "Sensors", remaining: 28, total: 30, unit: "days" },
    { name: "Mop Cloth", remaining: 12, total: 50, unit: "hours" },
  ];

  const getProgressColor = (percent: number) => {
    if (percent > 50) return "bg-green-500";
    if (percent > 20) return "bg-amber-500";
    return "bg-red-500";
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
        <h1 className="text-lg font-semibold text-foreground">Maintenance</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-6 space-y-4">
        <p className="text-sm text-muted-foreground">
          Monitor the status of consumable parts and replace them when needed for optimal performance.
        </p>

        {parts.map((part, index) => {
          const percent = (part.remaining / part.total) * 100;
          return (
            <div
              key={index}
              className="bg-card rounded-2xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-foreground font-medium">{part.name}</span>
                <button className="flex items-center gap-1 text-primary text-sm">
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              </div>
              
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all ${getProgressColor(percent)}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">
                  {part.remaining} {part.unit} remaining
                </span>
                <span className="text-xs text-muted-foreground">
                  {Math.round(percent)}%
                </span>
              </div>
            </div>
          );
        })}

        <div className="bg-card rounded-2xl p-4">
          <button className="w-full flex items-center justify-between">
            <div>
              <p className="text-foreground font-medium">Order Replacement Parts</p>
              <p className="text-sm text-muted-foreground">Shop for genuine parts</p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
