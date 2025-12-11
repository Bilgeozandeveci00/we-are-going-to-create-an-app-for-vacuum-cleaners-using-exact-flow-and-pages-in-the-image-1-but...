import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/30 relative overflow-hidden">
            {/* Abstract robot vacuum design */}
            <svg viewBox="0 0 48 48" className="h-12 w-12 text-primary-foreground">
              {/* Main circular body */}
              <circle cx="24" cy="24" r="18" fill="currentColor" opacity="0.2" />
              <circle cx="24" cy="24" r="14" fill="currentColor" opacity="0.4" />
              <circle cx="24" cy="24" r="10" fill="currentColor" />
              {/* Center sensor/camera */}
              <circle cx="24" cy="24" r="4" fill="hsl(var(--primary))" />
              {/* Motion lines */}
              <path d="M8 24 Q12 20 16 24" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
              <path d="M32 24 Q36 28 40 24" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
              {/* Cleaning path hint */}
              <path d="M24 6 Q30 12 24 18" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" strokeDasharray="2 2" />
            </svg>
          </div>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2 -z-10 rounded-3xl bg-primary/20 blur-xl"
          />
        </motion.div>

        {/* Brand Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Amphibia
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Smart Home Control</p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <div className="h-1 w-24 overflow-hidden rounded-full bg-secondary">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="h-full w-1/2 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Splash;
