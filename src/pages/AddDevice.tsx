import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Wifi, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const deviceTypes = [
  { id: "robot-vacuum", name: "Robot Vacuum", icon: "vacuum" },
  { id: "handheld", name: "Handheld Vacuum", icon: "handheld" },
  { id: "air-purifier", name: "Air Purifier", icon: "purifier" },
];

const AddDevice = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"select" | "search" | "connect">("select");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep("search");
    setIsSearching(true);
    
    // Simulate device search
    setTimeout(() => {
      setIsSearching(false);
      setStep("connect");
    }, 3000);
  };

  const handleConnect = () => {
    // Navigate to home after "connecting"
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center gap-4 px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            if (step === "select") navigate("/home");
            else setStep("select");
          }}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Add Device</h1>
      </header>

      <main className="px-6 py-4">
        {step === "select" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <p className="text-sm text-muted-foreground">
              Select your device type to begin pairing
            </p>
            
            <div className="space-y-3">
              {deviceTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className="flex w-full items-center gap-4 rounded-2xl bg-card p-4 transition-all hover:bg-card-elevated active:scale-[0.98]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                    <DeviceIcon type={type.icon} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-medium text-foreground">{type.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Tap to add this device
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === "search" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-20"
          >
            <div className="relative mb-8">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-card">
                <Wifi className="h-10 w-10 text-primary" />
              </div>
              {isSearching && (
                <>
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-primary/30"
                    animate={{ scale: [1, 1.5, 2], opacity: [0.5, 0.3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </>
              )}
            </div>
            
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Searching for devices...
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              Make sure your device is powered on and in pairing mode
            </p>
            
            <RefreshCw className={`mt-8 h-6 w-6 text-primary ${isSearching ? "animate-spin" : ""}`} />
          </motion.div>
        )}

        {step === "connect" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-12"
          >
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20">
              <Search className="h-10 w-10 text-primary" />
            </div>
            
            <h2 className="mb-2 text-xl font-semibold text-foreground">
              Device Found!
            </h2>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Roborock S7 MaxV is ready to connect
            </p>
            
            <div className="mb-8 w-full rounded-2xl bg-card p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                  <DeviceIcon type="vacuum" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">Roborock S7 MaxV</h3>
                  <p className="text-sm text-muted-foreground">
                    Signal: Strong
                  </p>
                </div>
              </div>
            </div>
            
            <Button
              variant="teal"
              size="xl"
              className="w-full"
              onClick={handleConnect}
            >
              Connect Device
            </Button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

const DeviceIcon = ({ type }: { type: string }) => {
  if (type === "vacuum") {
    return (
      <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    );
  }
  if (type === "handheld") {
    return (
      <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 12h16M8 8l-4 4 4 4M16 8l4 4-4 4" />
      </svg>
    );
  }
  return (
    <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <circle cx="12" cy="9" r="3" />
      <path d="M9 15h6M10 18h4" />
    </svg>
  );
};

export default AddDevice;
