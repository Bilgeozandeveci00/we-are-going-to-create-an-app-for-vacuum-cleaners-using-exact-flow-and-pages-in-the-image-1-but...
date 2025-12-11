import { motion } from "framer-motion";
import { Share2, Sliders, Settings, MessageSquare, Users, Info, ChevronRight } from "lucide-react";
import { BottomNav } from "./Home";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const location = useLocation();

  const menuSections = [
    {
      items: [
        { icon: Share2, label: "Device Sharing", iconColor: "text-blue-400", iconBg: "bg-blue-500/20" },
        { icon: Sliders, label: "Smart Control", iconColor: "text-blue-400", iconBg: "bg-blue-500/20" },
        { icon: Settings, label: "Settings", iconColor: "text-muted-foreground", iconBg: "bg-secondary" },
      ],
    },
    {
      items: [
        { icon: MessageSquare, label: "Feedback", iconColor: "text-amber-400", iconBg: "bg-amber-500/20" },
        { icon: Users, label: "Contact Us", iconColor: "text-blue-400", iconBg: "bg-blue-500/20" },
      ],
    },
    {
      items: [
        { icon: Info, label: "About Us", iconColor: "text-red-400", iconBg: "bg-red-500/20" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header with gradient */}
      <div className="relative">
        <div className="absolute inset-0 h-48 bg-gradient-to-b from-primary/20 to-transparent" />
        
        {/* Profile Section */}
        <header className="relative px-6 pt-16 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="h-20 w-20 rounded-full bg-card border-2 border-border/50 flex items-center justify-center overflow-hidden">
              <div className="h-full w-full bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
                <span className="text-2xl font-semibold text-muted-foreground">U</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">User Name</h1>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </motion.div>
        </header>
      </div>

      {/* Menu Sections */}
      <main className="px-6 pb-24 space-y-4">
        {menuSections.map((section, sectionIndex) => (
          <motion.div
            key={sectionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
            className="rounded-2xl bg-card border border-border/50 overflow-hidden"
          >
            {section.items.map((item, itemIndex) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-secondary/50 ${
                  itemIndex !== section.items.length - 1 ? "border-b border-border/30" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${item.iconBg}`}>
                    <item.icon className={`h-5 w-5 ${item.iconColor}`} />
                  </div>
                  <span className="text-base font-medium text-foreground">{item.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </motion.div>
        ))}
      </main>

      {/* Bottom Navigation */}
      <BottomNav currentPath={location.pathname} />
    </div>
  );
};

export default Profile;
