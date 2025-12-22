import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Verify from "./pages/Verify";
import Agreement from "./pages/Agreement";
import Home from "./pages/Home";
import DeviceControl from "./pages/DeviceControl";
import MapCreation from "./pages/MapCreation";
import MappingSimulation from "./pages/MappingSimulation";
import AddDevice from "./pages/AddDevice";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import NoGoZones from "./pages/NoGoZones";
import RoomEditor from "./pages/RoomEditor";

import Schedules from "./pages/Schedules";
import Maintenance from "./pages/Maintenance";
import RobotSound from "./pages/RobotSound";
import FloorSettings from "./pages/FloorSettings";
import RobotSettings from "./pages/RobotSettings";
import CleaningHistory from "./pages/CleaningHistory";
import RemoteControl from "./pages/RemoteControl";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="mx-auto max-w-md min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/splash" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/agreement" element={<Agreement />} />
            <Route path="/home" element={<Home />} />
            <Route path="/device/:id" element={<DeviceControl />} />
            <Route path="/device/:id/create-map" element={<MapCreation />} />
            <Route path="/device/:id/mapping" element={<MappingSimulation />} />
            <Route path="/device/:id/no-go-zones" element={<NoGoZones />} />
            <Route path="/device/:id/room-editor" element={<RoomEditor />} />
            
            <Route path="/device/:id/schedules" element={<Schedules />} />
            <Route path="/device/:id/maintenance" element={<Maintenance />} />
            <Route path="/device/:id/robot-sound" element={<RobotSound />} />
            <Route path="/device/:id/floor-settings" element={<FloorSettings />} />
            <Route path="/device/:id/robot-settings" element={<RobotSettings />} />
            <Route path="/device/:id/cleaning-history" element={<CleaningHistory />} />
            <Route path="/device/:id/remote-control" element={<RemoteControl />} />
            <Route path="/add-device" element={<AddDevice />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
