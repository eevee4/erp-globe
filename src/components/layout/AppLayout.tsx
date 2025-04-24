
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer mb-1 transition-all",
        active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
};

interface SidebarProps {
  activeModule: string;
  setActiveModule: (module: string) => void;
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule, collapsed }) => {
  return (
    <div 
      className={cn(
        "bg-sidebar h-full min-h-screen bg-sidebar-background flex flex-col transition-all border-r border-sidebar-border",
        collapsed ? "w-[60px]" : "w-[240px]"
      )}
    >
      <div className="py-6 px-3">
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-start")}>
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">G</div>
          {!collapsed && <span className="ml-3 text-sidebar-foreground font-bold text-lg">Globe ERP</span>}
        </div>
      </div>
      
      <div className="px-2 flex-1">
        {!collapsed ? (
          <>
            <SidebarItem
              icon={<span className="material-icons text-lg">inventory_2</span>}
              label="Pre-production"
              active={activeModule === 'pre-production'}
              onClick={() => setActiveModule('pre-production')}
            />
            <SidebarItem
              icon={<span className="material-icons text-lg">precision_manufacturing</span>}
              label="Post-production"
              active={activeModule === 'post-production'}
              onClick={() => setActiveModule('post-production')}
            />
            <SidebarItem
              icon={<span className="material-icons text-lg">receipt_long</span>}
              label="Billing"
              active={activeModule === 'billing'}
              onClick={() => setActiveModule('billing')}
            />
            <SidebarItem
              icon={<span className="material-icons text-lg">storage</span>}
              label="Database"
              active={activeModule === 'database'}
              onClick={() => setActiveModule('database')}
            />
          </>
        ) : (
          <>
            <div 
              className={cn(
                "flex items-center justify-center p-3 rounded-md cursor-pointer mb-1",
                activeModule === 'pre-production' ? "bg-sidebar-primary" : "hover:bg-sidebar-accent"
              )}
              onClick={() => setActiveModule('pre-production')}
            >
              <span className="material-icons text-sidebar-foreground text-lg">inventory_2</span>
            </div>
            <div 
              className={cn(
                "flex items-center justify-center p-3 rounded-md cursor-pointer mb-1",
                activeModule === 'post-production' ? "bg-sidebar-primary" : "hover:bg-sidebar-accent"
              )}
              onClick={() => setActiveModule('post-production')}
            >
              <span className="material-icons text-sidebar-foreground text-lg">precision_manufacturing</span>
            </div>
            <div 
              className={cn(
                "flex items-center justify-center p-3 rounded-md cursor-pointer mb-1",
                activeModule === 'billing' ? "bg-sidebar-primary" : "hover:bg-sidebar-accent"
              )}
              onClick={() => setActiveModule('billing')}
            >
              <span className="material-icons text-sidebar-foreground text-lg">receipt_long</span>
            </div>
            <div 
              className={cn(
                "flex items-center justify-center p-3 rounded-md cursor-pointer mb-1",
                activeModule === 'database' ? "bg-sidebar-primary" : "hover:bg-sidebar-accent"
              )}
              onClick={() => setActiveModule('database')}
            >
              <span className="material-icons text-sidebar-foreground text-lg">storage</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<string>('pre-production');
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar 
        activeModule={activeModule} 
        setActiveModule={setActiveModule}
        collapsed={collapsed}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b flex items-center px-4 justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              className="mr-2"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </Button>
            <h1 className="font-semibold text-lg">
              {activeModule === 'pre-production' && 'Pre-production'}
              {activeModule === 'post-production' && 'Post-production'}
              {activeModule === 'billing' && 'Billing'}
              {activeModule === 'database' && 'Database'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <span className="material-icons">notifications</span>
            </Button>
            <Button variant="ghost" size="icon">
              <span className="material-icons">settings</span>
            </Button>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="material-icons text-blue-500">person</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
