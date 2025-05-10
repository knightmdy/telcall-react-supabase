
import { ReactNode, useState } from "react";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div 
        className={cn(
          "flex-1 transition-all duration-300 overflow-auto",
          sidebarCollapsed ? "ml-16" : "ml-64"
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
