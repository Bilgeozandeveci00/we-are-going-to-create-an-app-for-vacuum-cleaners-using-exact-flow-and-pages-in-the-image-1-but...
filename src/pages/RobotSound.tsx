import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Play, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const RobotSound = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [volume, setVolume] = useState([80]);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

  const languages = [
    "Türkçe",
    "中文普通话版",
    "臺灣普通話版",
    "English",
    "Deutsch",
    "Español",
    "Français",
    "Italiano",
    "Українська",
    "Polski",
    "Română",
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
        <h1 className="text-lg font-semibold text-foreground">Robot Sound</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 px-4 py-6 space-y-6">
        {/* Volume */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">Volume</p>
          <div className="bg-card rounded-2xl p-4">
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-3">
              Slide to adjust volume
            </p>
          </div>
        </div>

        {/* Language */}
        <div>
          <p className="text-sm text-muted-foreground mb-4">Language</p>
          <div className="bg-card rounded-2xl divide-y divide-border/50">
            {languages.map((lang) => (
              <div
                key={lang}
                className="flex items-center justify-between p-4"
              >
                <span className="text-foreground">{lang}</span>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors">
                    <Play className="w-4 h-4 text-foreground ml-0.5" />
                  </button>
                  <button
                    onClick={() => setSelectedLanguage(lang)}
                    className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                      selectedLanguage === lang
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {selectedLanguage === lang ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      "Use"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotSound;
