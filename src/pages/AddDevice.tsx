import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Scan, Volume2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const vacuumModels = [
  { id: "saros-z70", name: "Saros Z70" },
  { id: "qrevo-edge", name: "Roborock Qrevo Edge Series" },
  { id: "qrevo-curvx", name: "Roborock Qrevo CurvX" },
  { id: "qrevo-c", name: "Roborock Qrevo C" },
  { id: "qrevo-l", name: "Roborock Qrevo L" },
  { id: "qrevo-curv-series", name: "Roborock Qrevo Curv Series" },
  { id: "saros-10", name: "Saros 10" },
  { id: "saros-10r", name: "Saros 10R" },
  { id: "qrevo-curv", name: "Roborock Qrevo Curv" },
];

type Tab = "robot" | "wet-dry";
type Step = "list" | "qr-scan";

const AddDevice = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("list");
  const [activeTab, setActiveTab] = useState<Tab>("robot");
  const [isSearching, setIsSearching] = useState(true);

  const handleBack = () => {
    if (step === "qr-scan") {
      setStep("list");
    } else {
      navigate("/home");
    }
  };

  const handleModelSelect = (modelId: string) => {
    // Simulate adding device
    localStorage.setItem("hasDevice", "true");
    navigate("/home");
  };

  const handleManualAdd = () => {
    setStep("list");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Add Device</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setStep("qr-scan")}
          className="text-foreground"
        >
          <Scan className="h-5 w-5" />
        </Button>
      </header>

      <AnimatePresence mode="wait">
        {step === "list" && (
          <motion.main
            key="list"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="px-4 py-2"
          >
            {/* Nearby Devices */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base font-medium text-foreground">Nearby Devices</h2>
                {isSearching && (
                  <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">Searching for nearby devices</p>
            </div>

            {/* Category Tabs */}
            <div className="flex gap-8 mb-6 border-b border-border">
              <button
                onClick={() => setActiveTab("robot")}
                className={`pb-3 text-sm font-medium relative ${
                  activeTab === "robot" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Robot Vacuum
                {activeTab === "robot" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("wet-dry")}
                className={`pb-3 text-sm font-medium relative ${
                  activeTab === "wet-dry" ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                Wet & Dry Vacuum
                {activeTab === "wet-dry" && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                  />
                )}
              </button>
            </div>

            {/* Device Grid */}
            <div className="grid grid-cols-3 gap-4">
              {vacuumModels.map((model) => (
                <button
                  key={model.id}
                  onClick={() => handleModelSelect(model.id)}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-full aspect-square rounded-xl bg-card border border-border/50 mb-2 flex items-center justify-center overflow-hidden">
                    {/* Vacuum placeholder */}
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-300" />
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground leading-tight">{model.name}</span>
                </button>
              ))}
            </div>
          </motion.main>
        )}

        {step === "qr-scan" && (
          <motion.main
            key="qr-scan"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="px-4 py-2 flex flex-col"
          >
            {/* Instructions */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-foreground mb-2">Scan QR Code</h2>
              <p className="text-sm text-muted-foreground mb-1">
                Point your phone camera at the QR code to automatically scan.
              </p>
              <button className="text-sm text-muted-foreground flex items-center gap-1">
                Where is QR code? <span className="text-primary">›</span>
              </button>
            </div>

            {/* Camera View Placeholder */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-card/50 border border-border/30 overflow-hidden mb-4">
              {/* Simulated camera view */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-gray-800/90" />
              
              {/* Scan frame */}
              <div className="absolute inset-8 border-2 border-primary/50 rounded-xl">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-lg" />
              </div>

              {/* Camera controls */}
              <div className="absolute bottom-4 left-4 flex gap-3">
                <button className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm flex items-center justify-center">
                  <Volume2 className="w-5 h-5 text-foreground" />
                </button>
                <button className="w-10 h-10 rounded-full bg-card/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full border-2 border-foreground" />
                </button>
              </div>
            </div>

            {/* Delete/Cancel button */}
            <div className="flex justify-center mb-6">
              <button className="w-12 h-12 rounded-full bg-card/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Manual Add Option */}
            <button
              onClick={handleManualAdd}
              className="flex items-center gap-3 w-full p-4 rounded-2xl bg-card/50 border border-border/30"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-foreground font-medium">Add Manually</p>
                <p className="text-sm text-muted-foreground">Search or select a model to add</p>
              </div>
            </button>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddDevice;
