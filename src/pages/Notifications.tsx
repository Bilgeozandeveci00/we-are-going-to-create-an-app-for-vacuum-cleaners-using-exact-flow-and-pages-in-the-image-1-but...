import { motion } from "framer-motion";
import { MessageCircle, Bell, Share2 } from "lucide-react";
import { BottomNav } from "./Home";
import { useLocation } from "react-router-dom";

const Notifications = () => {
  const location = useLocation();

  const notificationCards = [
    {
      icon: MessageCircle,
      title: "Promotion Message",
      subtitle: "Coming Soon",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/20",
    },
    {
      icon: Bell,
      title: "System Message",
      subtitle: null,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/20",
    },
    {
      icon: Share2,
      title: "Sharing Message",
      subtitle: null,
      iconColor: "text-primary",
      iconBg: "bg-primary/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold text-foreground"
        >
          Notifications
        </motion.h1>
      </header>

      {/* Content */}
      <main className="px-6 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 gap-4"
        >
          {notificationCards.map((card, index) => (
            <motion.button
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex flex-col items-start p-5 rounded-2xl bg-card border border-border/50 text-left transition-all hover:bg-card/80 ${
                index === 0 ? "row-span-1" : ""
              }`}
            >
              <div className={`p-2.5 rounded-xl ${card.iconBg} mb-4`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <span className="text-base font-medium text-foreground leading-tight">
                {card.title}
              </span>
              {card.subtitle && (
                <span className="text-sm text-muted-foreground mt-auto pt-8">
                  {card.subtitle}
                </span>
              )}
            </motion.button>
          ))}
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPath={location.pathname} />
    </div>
  );
};

export default Notifications;
