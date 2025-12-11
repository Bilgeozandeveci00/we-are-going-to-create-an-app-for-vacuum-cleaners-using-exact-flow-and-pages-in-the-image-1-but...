import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [agreed, setAgreed] = useState(false);

  const isPhoneValid = phoneNumber.replace(/\D/g, '').length === 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPhoneValid && agreed) {
      navigate("/verify", { state: { phone: phoneNumber } });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-1 flex-col"
      >
        {/* Header */}
        <div className="mb-12">
          <p className="text-sm text-muted-foreground">Welcome to</p>
          <h1 className="mt-1 text-4xl font-bold text-foreground">Amphibia</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-foreground">
                log in with phone number
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/30 px-4 py-3 transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50">
                <span className="text-sm font-medium text-muted-foreground">90</span>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  className="flex-1 border-0 bg-transparent p-0 text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
            </div>

            {/* Agreement checkbox */}
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreement"
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                className="mt-0.5 h-5 w-5 rounded-full border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <label htmlFor="agreement" className="text-sm text-foreground">
                I have read and agree to{" "}
                <span className="text-primary">User Agreement</span>.{" "}
                <span className="text-primary">Privacy Policy</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              type="submit"
              variant={isPhoneValid && agreed ? "teal" : "dark"}
              size="xl"
              className="w-full"
              disabled={!isPhoneValid || !agreed}
            >
              Get verification code
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
