
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Phone,
  UserRound,
  Share2,
  LayoutDashboard,
  LogOut,
  Settings
} from 'lucide-react';

interface SidebarProps {
  isMobile: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isMobile, toggleSidebar }: SidebarProps) => {
  const location = useLocation();
  const { user, signOut } = useAuth();

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={cn(
        'h-full bg-primary-foreground border-r flex flex-col justify-between transition-all duration-300 ease-in-out',
        isMobile ? 'w-64' : 'w-64'
      )}
    >
      <div>
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">办公电话调配系统</h1>
        </div>
        <nav className="space-y-1 p-2">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            to="/dashboard"
            label="仪表盘"
            active={isActive('/dashboard')}
            onClick={closeSidebarOnMobile}
          />
          <NavItem
            icon={<Phone size={18} />}
            to="/phones"
            label="手机管理"
            active={isActive('/phones')}
            onClick={closeSidebarOnMobile}
          />
          <NavItem
            icon={<UserRound size={18} />}
            to="/employees"
            label="员工管理"
            active={isActive('/employees')}
            onClick={closeSidebarOnMobile}
          />
          <NavItem
            icon={<Share2 size={18} />}
            to="/allocations"
            label="分配管理"
            active={isActive('/allocations')}
            onClick={closeSidebarOnMobile}
          />
          <NavItem
            icon={<Settings size={18} />}
            to="/settings"
            label="系统设置"
            active={isActive('/settings')}
            onClick={closeSidebarOnMobile}
          />
        </nav>
      </div>

      <div className="p-4 border-t">
        <div className="flex flex-col space-y-2">
          {user && (
            <>
              <div className="px-3 py-2 text-sm">
                <div className="font-medium">{user.email}</div>
                <div className="text-muted-foreground text-xs">已登录</div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={signOut}
              >
                <LogOut size={16} className="mr-2" />
                退出登录
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  to: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, to, label, active, onClick }: NavItemProps) => {
  return (
    <Link to={to} onClick={onClick}>
      <Button
        variant={active ? 'secondary' : 'ghost'}
        className={cn(
          'w-full justify-start',
          active ? 'bg-secondary' : 'hover:bg-secondary/50'
        )}
      >
        {icon}
        <span className="ml-2">{label}</span>
      </Button>
    </Link>
  );
};

export default Sidebar;
