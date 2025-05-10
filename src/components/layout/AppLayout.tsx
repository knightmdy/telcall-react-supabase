
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
      />
      <div 
        className={cn(
          "flex-1 transition-all duration-300 overflow-auto",
          sidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        <div className="container mx-auto py-4 px-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
