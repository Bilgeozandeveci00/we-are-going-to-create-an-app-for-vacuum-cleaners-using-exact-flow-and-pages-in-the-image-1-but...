import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Map, Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapCreation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isCreating, setIsCreating] = useState(false);
  const [progress, setProgress] = useState(0);

  const startMapping = () => {
    setIsCreating(true);
    
    // Simulate mapping progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Save map created state and navigate
          localStorage.setItem("hasMap", "true");
          setTimeout(() => navigate(`/device/${id}`), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/home")}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Create Map</h1>
        <div className="w-10" />
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6">
        {!isCreating ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center"
          >
            {/* Map Icon */}
            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center mb-8">
              <Map className="w-16 h-16 text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              Start Mapping
            </h2>

            <p className="text-muted-foreground mb-8 max-w-sm">
              Your device will scan your home to create a map. Please make sure the device is on the charging station and there are no obstacles in front of it.
            </p>

            {/* Instructions */}
            <div className="w-full max-w-sm space-y-4 mb-8">
              <InstructionItem number={1} text="Make sure the device is on the charging station" />
              <InstructionItem number={2} text="Keep doors open and remove obstacles" />
              <InstructionItem number={3} text="Do not touch the device during scanning" />
            </div>

            <Button
              onClick={startMapping}
              variant="teal"
              size="lg"
              className="w-full max-w-sm h-14 rounded-2xl text-lg font-semibold"
            >
              <Play className="w-5 h-5 mr-2" />
              Start Scanning
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            {/* Progress Circle */}
            <div className="relative w-40 h-40 mb-8">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="none"
                />
                <motion.circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * progress) / 100}
                  transition={{ duration: 0.1 }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-foreground">{progress}%</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <h2 className="text-xl font-semibold text-foreground">
                Creating Map...
              </h2>
            </div>

            <p className="text-muted-foreground max-w-sm">
              Your device is scanning your home. This may take a few minutes.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

const InstructionItem = ({ number, text }: { number: number; text: string }) => (
  <div className="flex items-center gap-4 text-left">
    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
      <span className="text-sm font-bold text-primary">{number}</span>
    </div>
    <span className="text-muted-foreground text-sm">{text}</span>
  </div>
);

export default MapCreation;
