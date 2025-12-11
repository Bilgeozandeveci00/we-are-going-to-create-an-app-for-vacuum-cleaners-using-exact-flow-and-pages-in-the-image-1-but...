import { motion } from "framer-motion";

const RobotIllustration = () => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Main outer ring */}
      <motion.div 
        className="absolute w-52 h-52 rounded-full bg-[#1a5c5c]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Dark groove outer */}
        <div className="absolute inset-2 rounded-full border-4 border-[#0a3333]" />
        
        {/* Inner teal section */}
        <div className="absolute inset-4 rounded-full bg-[#1a5c5c]">
          {/* Dark groove inner */}
          <div className="absolute inset-6 rounded-full border-4 border-[#0a3333]" />
          
          {/* Bright center ring */}
          <div className="absolute inset-10 rounded-full bg-[#3dbfbf] flex items-center justify-center">
            {/* Dark center core */}
            <div className="w-10 h-10 rounded-full bg-[#0a2626]" />
          </div>
        </div>
      </motion.div>

      {/* Side extensions - left */}
      <motion.div 
        className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-1 bg-[#1a5c5c] rounded-full"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Side extensions - right */}
      <motion.div 
        className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-1 bg-[#1a5c5c] rounded-full"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />

      {/* Decorative dot - top right */}
      <motion.div 
        className="absolute top-4 right-4 w-3 h-3 rounded-full bg-[#3dbfbf]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />

      {/* Decorative dot - bottom left */}
      <motion.div 
        className="absolute bottom-8 left-6 w-2 h-2 rounded-full bg-[#3dbfbf]"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      />

      {/* Pulse animation ring */}
      <motion.div 
        className="absolute w-56 h-56 rounded-full border border-[#3dbfbf]/30"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default RobotIllustration;
