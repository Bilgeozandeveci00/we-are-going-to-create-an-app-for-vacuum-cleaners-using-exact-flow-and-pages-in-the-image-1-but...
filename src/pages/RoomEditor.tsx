import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, HelpCircle, RotateCcw, Merge, SplitSquareHorizontal, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Room {
  id: string;
  name: string;
  path: string;
  color: string;
  labelX: number;
  labelY: number;
}

const RoomEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "room1",
      name: "Room",
      path: "M20 20 L120 20 L120 100 L90 100 L90 140 L20 140 Z",
      color: "hsl(200, 70%, 55%)",
      labelX: 60,
      labelY: 70,
    },
    {
      id: "room2",
      name: "Room",
      path: "M125 20 L180 20 L180 80 L125 80 Z",
      color: "hsl(45, 80%, 55%)",
      labelX: 152,
      labelY: 50,
    },
    {
      id: "room3",
      name: "Room",
      path: "M125 85 L180 85 L180 180 L95 180 L95 145 L125 145 Z",
      color: "hsl(15, 70%, 60%)",
      labelX: 140,
      labelY: 135,
    },
  ]);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<"merge" | "split" | "rename" | null>(null);

  const toggleRoomSelection = (roomId: string) => {
    if (selectedRooms.includes(roomId)) {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
    } else {
      setSelectedRooms([...selectedRooms, roomId]);
    }
  };

  const handleMerge = () => {
    if (selectedRooms.length >= 2) {
      setActiveAction("merge");
      // In a real app, this would merge the selected rooms
    }
  };

  const handleSplit = () => {
    if (selectedRooms.length === 1) {
      setActiveAction("split");
      // In a real app, this would split the selected room
    }
  };

  const handleRename = () => {
    if (selectedRooms.length === 1) {
      setActiveAction("rename");
      // In a real app, this would open a rename dialog
    }
  };

  const handleSave = () => {
    navigate(`/device/${id}`);
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
        <h1 className="text-lg font-semibold text-foreground">Edit Rooms</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative mx-4 mt-4">
        <svg className="w-full h-full min-h-[400px]" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet">
          {/* Rooms */}
          {rooms.map((room) => (
            <g
              key={room.id}
              onClick={() => toggleRoomSelection(room.id)}
              className="cursor-pointer"
            >
              <motion.path
                d={room.path}
                fill={room.color}
                fillOpacity={selectedRooms.includes(room.id) ? 0.9 : 0.6}
                stroke={selectedRooms.includes(room.id) ? "white" : "hsl(var(--background))"}
                strokeWidth={selectedRooms.includes(room.id) ? 3 : 2}
                whileHover={{ fillOpacity: 0.85 }}
                transition={{ duration: 0.2 }}
              />

              {/* Room label */}
              <g>
                <circle
                  cx={room.labelX}
                  cy={room.labelY - 8}
                  r="8"
                  fill="hsl(var(--background))"
                  fillOpacity="0.8"
                />
                <g transform={`translate(${room.labelX - 5}, ${room.labelY - 13})`}>
                  <path
                    d="M5 0 L10 4 L10 10 L0 10 L0 4 Z"
                    fill="hsl(var(--primary))"
                    stroke="none"
                  />
                </g>
                <text
                  x={room.labelX}
                  y={room.labelY + 8}
                  fontSize="8"
                  fill="white"
                  textAnchor="middle"
                  fontWeight="500"
                >
                  {room.name}
                </text>
              </g>
            </g>
          ))}

          {/* Room borders for clarity */}
          <path
            d="M120 20 L120 100 M90 100 L90 140 M125 80 L180 80 M125 85 L125 145 M95 145 L95 180"
            fill="none"
            stroke="hsl(var(--background))"
            strokeWidth="3"
            strokeOpacity="0.5"
          />
        </svg>
      </div>

      {/* Action buttons */}
      <div className="px-4 pb-6 pt-4 safe-area-bottom">
        <div className="flex justify-center gap-8 mb-6">
          {/* Merge */}
          <button
            onClick={handleMerge}
            disabled={selectedRooms.length < 2}
            className={`flex flex-col items-center gap-2 ${
              selectedRooms.length >= 2 ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <Merge className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Merge</span>
          </button>

          {/* Split */}
          <button
            onClick={handleSplit}
            disabled={selectedRooms.length !== 1}
            className={`flex flex-col items-center gap-2 ${
              selectedRooms.length === 1 ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <SplitSquareHorizontal className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Split</span>
          </button>

          {/* Rename */}
          <button
            onClick={handleRename}
            disabled={selectedRooms.length !== 1}
            className={`flex flex-col items-center gap-2 ${
              selectedRooms.length === 1 ? "opacity-100" : "opacity-50"
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-card flex items-center justify-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Rename</span>
          </button>
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default RoomEditor;
