import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, ChevronDown, Clock, Calendar, Trash2, Plus, Home, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface Schedule {
  id: string;
  time: string;
  days: string[];
  mode: "safe" | "deep" | "custom";
  customMode?: string;
  rooms: string[];
  enabled: boolean;
}

const customModes = [
  { id: "eco", name: "Eco Mode", description: "Energy efficient cleaning" },
  { id: "turbo", name: "Turbo Mode", description: "Maximum suction power" },
  { id: "quiet", name: "Quiet Mode", description: "Low noise operation" },
  { id: "pet", name: "Pet Mode", description: "Optimized for pet hair" },
];

const daysOfWeek = [
  { short: "S", full: "Sun" },
  { short: "M", full: "Mon" },
  { short: "T", full: "Tue" },
  { short: "W", full: "Wed" },
  { short: "T", full: "Thu" },
  { short: "F", full: "Fri" },
  { short: "S", full: "Sat" },
];

const roomNames: Record<string, string> = {
  living: "Living Room",
  dining: "Dining",
  hallway: "Hallway",
  bedroom1: "Master Bed",
  bedroom2: "Bedroom",
  bathroom: "Bathroom",
  kitchen: "Kitchen",
  laundry: "Laundry",
};

const Schedules = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [schedules, setSchedules] = useState<Schedule[]>([
    {
      id: "1",
      time: "09:00",
      days: ["Mon", "Wed", "Fri"],
      mode: "safe",
      rooms: [],
      enabled: true,
    },
    {
      id: "2", 
      time: "14:00",
      days: ["Sat"],
      mode: "deep",
      rooms: ["kitchen", "bathroom"],
      enabled: true,
    },
  ]);
  
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  
  // New schedule form state
  const [newTime, setNewTime] = useState("09:00");
  const [newDays, setNewDays] = useState<string[]>(["Mon", "Wed", "Fri"]);
  const [newMode, setNewMode] = useState<"safe" | "deep" | "custom">("safe");
  const [newCustomMode, setNewCustomMode] = useState<string>("");
  const [newRooms, setNewRooms] = useState<string[]>([]);
  const [showRoomSelector, setShowRoomSelector] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(1);

  // Load floors from localStorage
  const floors = (() => {
    const saved = localStorage.getItem(`floors-${id}`);
    return saved ? JSON.parse(saved) : [{ id: 1, name: "Floor 1" }];
  })();

  const toggleDay = (day: string) => {
    setNewDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const toggleRoom = (roomId: string) => {
    setNewRooms(prev =>
      prev.includes(roomId)
        ? prev.filter(r => r !== roomId)
        : [...prev, roomId]
    );
  };

  const handleSaveSchedule = () => {
    if (editingSchedule) {
      setSchedules(prev => prev.map(s => 
        s.id === editingSchedule.id 
          ? { ...s, time: newTime, days: newDays, mode: newMode, customMode: newCustomMode, rooms: newRooms }
          : s
      ));
    } else {
      const newSchedule: Schedule = {
        id: Date.now().toString(),
        time: newTime,
        days: newDays,
        mode: newMode,
        customMode: newCustomMode,
        rooms: newRooms,
        enabled: true,
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
    resetForm();
    setShowAddSheet(false);
    setEditingSchedule(null);
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setNewTime(schedule.time);
    setNewDays(schedule.days);
    setNewMode(schedule.mode);
    setNewCustomMode(schedule.customMode || "");
    setNewRooms(schedule.rooms);
    setEditingSchedule(schedule);
    setShowAddSheet(true);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(prev => prev.filter(s => s.id !== scheduleId));
  };

  const toggleScheduleEnabled = (scheduleId: string) => {
    setSchedules(prev => prev.map(s =>
      s.id === scheduleId ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const resetForm = () => {
    setNewTime("09:00");
    setNewDays(["Mon", "Wed", "Fri"]);
    setNewMode("safe");
    setNewCustomMode("");
    setNewRooms([]);
    setShowRoomSelector(false);
    setShowModeSelector(false);
  };

  const formatDays = (days: string[]) => {
    if (days.length === 7) return "Every day";
    if (days.length === 5 && !days.includes("Sat") && !days.includes("Sun")) return "Weekdays";
    if (days.length === 2 && days.includes("Sat") && days.includes("Sun")) return "Weekends";
    return days.join(", ");
  };

  const formatRooms = (rooms: string[]) => {
    if (rooms.length === 0) return "All rooms";
    if (rooms.length === 1) return roomNames[rooms[0]];
    return `${rooms.length} rooms`;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(`/device/${id}`)}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Schedules</h1>
        <div className="w-10" /> {/* Spacer for balance */}
      </header>

      <div className="flex-1 px-4 py-4 space-y-4">
        {/* Floor Selector */}
        {floors.length > 1 && (
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2">
              {floors.map((floor: { id: number; name: string }) => (
                <button
                  key={floor.id}
                  onClick={() => setSelectedFloor(floor.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedFloor === floor.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {floor.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Schedules List */}
        {schedules.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">No schedules yet</p>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Add a schedule to automatically start cleaning
            </p>
            <Button onClick={() => setShowAddSheet(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Schedule
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map((schedule) => (
              <motion.div
                key={schedule.id}
                layout
                className={`bg-card rounded-2xl border ${schedule.enabled ? 'border-border' : 'border-border/50'} overflow-hidden`}
              >
                <button 
                  onClick={() => handleEditSchedule(schedule)}
                  className="w-full p-4 text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-2xl font-bold ${schedule.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {schedule.time}
                        </span>
                        <span className={`text-sm ${
                          schedule.mode === "safe" ? "text-emerald-500" :
                          schedule.mode === "deep" ? "text-primary" :
                          schedule.mode === "custom" ? "text-amber-500" :
                          "text-muted-foreground"
                        }`}>
                          {schedule.mode === "custom" && schedule.customMode 
                            ? customModes.find(m => m.id === schedule.customMode)?.name || "Custom"
                            : schedule.mode.charAt(0).toUpperCase() + schedule.mode.slice(1) + " Mode"
                          }
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatDays(schedule.days)}</span>
                        <span>•</span>
                        <span>{formatRooms(schedule.rooms)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleScheduleEnabled(schedule.id);
                        }}
                        className={`w-12 h-7 rounded-full transition-colors relative ${
                          schedule.enabled ? 'bg-primary' : 'bg-muted'
                        }`}
                      >
                        <motion.div
                          animate={{ x: schedule.enabled ? 22 : 2 }}
                          className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
                        />
                      </button>
                    </div>
                  </div>
                </button>
                
                {/* Days indicator */}
                <div className="px-4 pb-4">
                  <div className="flex gap-1">
                    {daysOfWeek.map((day, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                          schedule.days.includes(day.full)
                            ? schedule.enabled 
                              ? 'bg-primary/20 text-primary' 
                              : 'bg-muted text-muted-foreground'
                            : 'bg-muted/50 text-muted-foreground/50'
                        }`}
                      >
                        {day.short}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Add New Schedule Button */}
            <button
              onClick={() => {
                resetForm();
                setEditingSchedule(null);
                setShowAddSheet(true);
              }}
              className="w-full p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-colors flex items-center justify-center gap-2 text-primary font-medium"
            >
              <Plus className="w-5 h-5" />
              Add New Schedule
            </button>
          </div>
        )}
      </div>

      {/* Add/Edit Schedule Sheet */}
      <Sheet open={showAddSheet} onOpenChange={(open) => {
        setShowAddSheet(open);
        if (!open) {
          setEditingSchedule(null);
          resetForm();
        }
      }}>
        <SheetContent side="bottom" className="bg-card rounded-t-3xl border-border h-[85vh] overflow-y-auto [&>button]:hidden">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <button 
                onClick={() => {
                  setShowAddSheet(false);
                  setEditingSchedule(null);
                }}
                className="text-muted-foreground"
              >
                Cancel
              </button>
              <div className="text-center">
                <SheetTitle>{editingSchedule ? "Edit Schedule" : "New Schedule"}</SheetTitle>
                <SheetDescription className="sr-only">Create or edit an automatic cleaning schedule</SheetDescription>
              </div>
              <div className="w-12" /> {/* Spacer for balance */}
            </div>
          </SheetHeader>

          <div className="space-y-6 pb-8">
            {/* Time Picker */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Start Time</label>
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full bg-muted border border-border rounded-xl px-4 py-4 text-2xl font-bold text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Days Selector */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Repeat</label>
              <div className="flex gap-2">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => toggleDay(day.full)}
                    className={`flex-1 h-12 rounded-xl text-sm font-medium transition-colors ${
                      newDays.includes(day.full)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {day.short}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setNewDays(["Mon", "Tue", "Wed", "Thu", "Fri"])}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  Weekdays
                </button>
                <button
                  onClick={() => setNewDays(["Sat", "Sun"])}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  Weekends
                </button>
                <button
                  onClick={() => setNewDays(daysOfWeek.map(d => d.full))}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80"
                >
                  Every day
                </button>
              </div>
            </div>

            {/* Cleaning Mode */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Cleaning Mode</label>
              <button
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="w-full bg-muted rounded-xl p-4 flex items-center justify-between"
              >
                <span className={`text-sm font-medium ${
                  newMode === "safe" ? "text-emerald-500" :
                  newMode === "deep" ? "text-primary" :
                  newMode === "custom" ? "text-amber-500" :
                  "text-foreground"
                }`}>
                  {newMode === "custom" && newCustomMode
                    ? customModes.find(m => m.id === newCustomMode)?.name || "Custom"
                    : newMode === "safe" ? "Safe Mode" 
                    : newMode === "deep" ? "Deep Mode"
                    : "Select Mode"
                  }
                </span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showModeSelector ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showModeSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                  >
                    {/* Safe Mode */}
                    <button
                      onClick={() => {
                        setNewMode("safe");
                        setNewCustomMode("");
                        setShowModeSelector(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        newMode === "safe" 
                          ? 'bg-emerald-500/10 border-emerald-500' 
                          : 'bg-muted border-transparent'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        newMode === "safe" ? 'border-emerald-500 bg-emerald-500' : 'border-muted-foreground'
                      }`}>
                        {newMode === "safe" && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-foreground block">Safe Mode</span>
                        <span className="text-xs text-muted-foreground">Avoids risky areas to prevent getting stuck</span>
                      </div>
                    </button>
                    
                    {/* Deep Mode */}
                    <button
                      onClick={() => {
                        setNewMode("deep");
                        setNewCustomMode("");
                        setShowModeSelector(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        newMode === "deep" 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-muted border-transparent'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        newMode === "deep" ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {newMode === "deep" && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-foreground block">Deep Mode</span>
                        <span className="text-xs text-muted-foreground">Thorough cleaning that covers every corner</span>
                      </div>
                    </button>
                    
                    {/* Custom Modes */}
                    <div className="pt-2 border-t border-border">
                      <span className="text-xs font-medium text-muted-foreground mb-2 block">Custom Modes</span>
                      <div className="space-y-2">
                        {customModes.map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => {
                              setNewMode("custom");
                              setNewCustomMode(mode.id);
                              setShowModeSelector(false);
                            }}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                              newMode === "custom" && newCustomMode === mode.id
                                ? 'bg-amber-500/10 border-amber-500' 
                                : 'bg-muted border-transparent'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              newMode === "custom" && newCustomMode === mode.id 
                                ? 'border-amber-500 bg-amber-500' 
                                : 'border-muted-foreground'
                            }`}>
                              {newMode === "custom" && newCustomMode === mode.id && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                            <div className="text-left">
                              <span className="text-sm font-medium text-foreground block">{mode.name}</span>
                              <span className="text-xs text-muted-foreground">{mode.description}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Room Selection */}
            <div>
              <label className="text-sm font-medium text-foreground mb-3 block">Rooms</label>
              <button
                onClick={() => setShowRoomSelector(!showRoomSelector)}
                className="w-full bg-muted rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">
                    {newRooms.length === 0 
                      ? "All rooms" 
                      : newRooms.length === 1 
                        ? roomNames[newRooms[0]]
                        : `${newRooms.length} rooms selected`
                    }
                  </span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showRoomSelector ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showRoomSelector && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-2 space-y-2"
                  >
                    <button
                      onClick={() => setNewRooms([])}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                        newRooms.length === 0 
                          ? 'bg-primary/10 border-primary' 
                          : 'bg-muted border-transparent'
                      }`}
                    >
                      <Home className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">All Rooms</span>
                      {newRooms.length === 0 && (
                        <Check className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(roomNames).map(([roomId, name]) => (
                        <button
                          key={roomId}
                          onClick={() => toggleRoom(roomId)}
                          className={`flex items-center gap-2 p-3 rounded-xl border transition-colors ${
                            newRooms.includes(roomId)
                              ? 'bg-primary/10 border-primary'
                              : 'bg-muted border-transparent'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            newRooms.includes(roomId)
                              ? 'border-primary bg-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {newRooms.includes(roomId) && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-foreground">{name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save Button */}
            <Button
              onClick={handleSaveSchedule}
              disabled={newDays.length === 0}
              className="w-full h-14 text-base font-semibold"
            >
              {editingSchedule ? "Save Changes" : "Create Schedule"}
            </Button>
            
            {/* Delete Button (for editing) */}
            {editingSchedule && (
              <Button
                variant="outline"
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
                onClick={() => {
                  handleDeleteSchedule(editingSchedule.id);
                  setShowAddSheet(false);
                  setEditingSchedule(null);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Schedule
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Schedules;