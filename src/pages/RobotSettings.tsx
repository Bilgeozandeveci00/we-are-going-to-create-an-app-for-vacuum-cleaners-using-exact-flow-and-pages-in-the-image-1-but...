import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronRight, Palette, MessageCircle, Globe, Download, Wifi, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RobotSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const settingsGroups = [
    {
      items: [
        { icon: Palette, label: "Theme", value: "" },
        { icon: MessageCircle, label: "Notification Settings", value: "" },
        { icon: Globe, label: "Language Settings", value: "" },
        { icon: Download, label: "Firmware Update", value: "" },
      ],
    },
    {
      items: [
        { icon: Wifi, label: "Network Settings", value: "" },
        { icon: Trash2, label: "Clear Cache", value: "117.1 MB" },
      ],
    },
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
        <h1 className="text-lg font-semibold text-foreground">More Settings</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-6 space-y-4">
        {settingsGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="bg-card rounded-2xl divide-y divide-border/50">
            {group.items.map((item, index) => (
              <button
                key={index}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-foreground flex-1 text-left">{item.label}</span>
                {item.value && (
                  <span className="text-muted-foreground text-sm">{item.value}</span>
                )}
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RobotSettings;
