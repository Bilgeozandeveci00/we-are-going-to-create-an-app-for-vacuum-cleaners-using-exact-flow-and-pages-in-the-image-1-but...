import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const FloorSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [carpetBoost, setCarpetBoost] = useState(true);

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
        <h1 className="text-lg font-semibold text-foreground">Floor Cleaning Settings</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-6">
        <div className="bg-card rounded-2xl p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-foreground font-medium mb-2">Carpet Boost</h3>
              <p className="text-sm text-muted-foreground">
                Robot automatically detects carpets and maximizes suction power for deeper cleaning. When returning to hard floors, the previous mode will resume.
              </p>
            </div>
            <Switch
              checked={carpetBoost}
              onCheckedChange={setCarpetBoost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorSettings;
