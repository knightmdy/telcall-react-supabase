
import { cn } from "@/lib/utils";
import { 
  Home, 
  Phone, 
  PhoneCall, 
  User, 
  Users
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const location = useLocation();
  
  const navigationItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: Home
    },
    {
      name: "Phones",
      path: "/phones",
      icon: Phone
    },
    {
      name: "Employees",
      path: "/employees",
      icon: Users
    },
    {
      name: "Allocations",
      path: "/allocations",
      icon: PhoneCall
    }
  ];

  return (
    <div 
      className={cn(
        "bg-sidebar h-full fixed left-0 top-0 transition-all duration-300 z-40 shadow-md flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border bg-sidebar-accent">
        <div className={cn(
          "flex items-center text-sidebar-foreground font-bold text-xl transition-all",
          collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
        )}>
          电话系统
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground p-2 rounded-md hover:bg-sidebar-accent hover:bg-opacity-50 transition-all"
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
          )}
        </button>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto py-4">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                isActive && "bg-sidebar-accent font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className={cn(
                "ml-3 transition-all",
                collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
