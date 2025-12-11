import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const AddDevice = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/home");
  };

  const handleDeviceSelect = () => {
    localStorage.setItem("hasDevice", "true");
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground ml-2">Add Device</h1>
      </header>

      <main className="flex-1 px-4 py-2 flex flex-col">
        {/* QR Scanner Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <p className="text-sm text-muted-foreground mb-3 text-center">
            Scan QR code on device to connect
          </p>
          
          {/* Camera View */}
          <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-3xl bg-card/30 border border-border/30 overflow-hidden">
            {/* Simulated camera view */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 to-gray-800/95" />
            
            {/* Scan frame */}
            <div className="absolute inset-10">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-3 border-l-3 border-primary rounded-tl-xl" style={{ borderWidth: '3px' }} />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-3 border-r-3 border-primary rounded-tr-xl" style={{ borderWidth: '3px' }} />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-3 border-l-3 border-primary rounded-bl-xl" style={{ borderWidth: '3px' }} />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-3 border-r-3 border-primary rounded-br-xl" style={{ borderWidth: '3px' }} />
              
              {/* Scanning line animation */}
              <motion.div
                className="absolute left-2 right-2 h-0.5 bg-primary/80"
                initial={{ top: "10%" }}
                animate={{ top: "90%" }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Nearby Devices Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-base font-medium text-foreground">Nearby Devices</h2>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>

          {/* Nearby Device Card */}
          <button
            onClick={handleDeviceSelect}
            className="w-full flex items-center gap-4 p-4 rounded-2xl bg-card/50 border border-border/30 active:scale-[0.98] transition-transform"
          >
            {/* Device Icon */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-white to-gray-300" />
              </div>
            </div>
            
            {/* Device Info */}
            <div className="flex-1 text-left">
              <p className="text-foreground font-medium">Amphibia Robot Cleaner</p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Wifi className="w-3 h-3" />
                <span>Ready to connect</span>
              </div>
            </div>

            {/* Connect indicator */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-primary" />
            </div>
          </button>
        </motion.div>
      </main>
    </div>
  );
};

export default AddDevice;
