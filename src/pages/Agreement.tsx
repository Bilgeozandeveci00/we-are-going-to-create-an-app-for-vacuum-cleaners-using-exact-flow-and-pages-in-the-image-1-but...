import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Agreement = () => {
  const navigate = useNavigate();

  const handleAgree = () => {
    navigate("/home");
  };

  const handleDisagree = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm rounded-2xl bg-card p-6"
      >
        {/* Title */}
        <h2 className="mb-2 text-xl font-semibold text-primary">
          Thanks for using amphibia
        </h2>

        {/* Legal text */}
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            Legal advices, Lorem impsum
          </p>
          <div className="mt-4 max-h-48 overflow-y-auto text-xs text-muted-foreground">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
            <p className="mt-3">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <p className="mt-3">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleDisagree}
            variant="dark"
            size="lg"
            className="flex-1"
          >
            Disagree
          </Button>
          <Button
            onClick={handleAgree}
            variant="teal"
            size="lg"
            className="flex-1"
          >
            Agree
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Agreement;
