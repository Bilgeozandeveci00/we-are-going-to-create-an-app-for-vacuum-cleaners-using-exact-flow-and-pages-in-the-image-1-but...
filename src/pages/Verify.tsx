import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

const Verify = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location.state?.phone || "***9012";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(59);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every((digit) => digit)) {
      navigate("/agreement");
    }
  };

  const maskedPhone = `***${phone.slice(-4)}`;

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col items-center"
      >
        {/* Logo */}
        <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 shadow-lg shadow-primary/20">
          <Shield className="h-8 w-8 text-primary-foreground" />
        </div>

        {/* Info text */}
        <p className="mb-8 text-center text-sm text-muted-foreground">
          We've sent a 6-digit code to your phone number
          <br />
          ending in {maskedPhone}
        </p>

        {/* OTP Input */}
        <div className="mb-6 flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-14 w-12 rounded-lg border-2 border-border bg-secondary/30 text-center text-xl font-semibold text-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          ))}
        </div>

        {/* Resend */}
        <p className="mb-8 text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          {countdown > 0 ? (
            <span>Resend code in 0:{countdown.toString().padStart(2, "0")}</span>
          ) : (
            <button className="text-primary">Resend code</button>
          )}
        </p>

        {/* Verify Button */}
        <Button
          onClick={handleVerify}
          variant="teal"
          size="xl"
          className="w-full"
          disabled={!otp.every((digit) => digit)}
        >
          Verify
        </Button>

        {/* Support link */}
        <p className="mt-auto pt-8 text-sm text-muted-foreground">
          Having trouble?{" "}
          <button className="text-primary">Contact Support</button>
        </p>
      </motion.div>
    </div>
  );
};

export default Verify;
