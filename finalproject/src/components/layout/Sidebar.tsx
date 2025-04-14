'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Settings, 
  CheckSquare, 
  ChevronsLeft, 
  ChevronsRight,
  FolderKanban,
  LayoutDashboard,
  Tag,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const isActiveRoute = (path: string) => pathname === path;
  const toggleSidebar = () => setOpen(!open);

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border transition-all duration-300 bg-background",
      open ? "w-60" : "w-20",
      isMobile && open ? "translate-x-0 w-80 shadow-xl" : isMobile && !open ? "-translate-x-full" : "",
      !isMobile && !open && "w-20"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <div className={cn(
          "flex items-center overflow-hidden",
          open ? "justify-start" : "justify-center w-full"
        )}>
          <div className="flex-shrink-0 flex items-center">
            <CheckSquare size={24} className="text-primary" />
            {open && <span className="ml-2 text-lg font-semibold">Task Haven</span>}
          </div>
        </div>
        
        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="flex"
          >
            <X size={18} />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className={cn("hidden lg:flex", !open && "mx-auto")}
          >
            {open ? <ChevronsLeft size={18} /> : <ChevronsRight size={18} />}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className={cn("py-4", !open && "px-2")}>
          <nav className={cn("space-y-1 px-3", !open && "px-2")}>
            <SidebarLink
              href="/"
              icon={<Home size={20} />}
              label="Dashboard"
              active={isActiveRoute('/')}
              collapsed={!open}
            />
            <SidebarLink
              href="/tasks"
              icon={<LayoutDashboard size={20} />}
              label="My Tasks"
              active={isActiveRoute('/tasks')}
              collapsed={!open}
            />
            <SidebarLink
              href="/calendar"
              icon={<Calendar size={20} />}
              label="Calendar"
              active={isActiveRoute('/calendar')}
              collapsed={!open}
            />
            <SidebarLink
              href="/analytics"
              icon={<FolderKanban size={20} />}
              label="Analytics"
              active={isActiveRoute('/analytics')}
              collapsed={!open}
            />
          </nav>

          {open && (
            <>
              <Separator className="my-4 mx-2" />
              <div className="px-3 mb-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                  <Link href="/categories">
                    <Button variant="ghost" size="icon" className="h-5 w-5">
                      <Tag size={14} />
                    </Button>
                  </Link>
                </div>
              </div>
              <nav className="space-y-1 px-3">
                {/* Example categories - replace with your data */}
                {['Personal', 'Work', 'Shopping'].map((category) => (
                  <Link 
                    key={category}
                    href={`/category/${category.toLowerCase()}`}
                    className={cn(
                      "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                      isActiveRoute(`/category/${category.toLowerCase()}`)
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <span 
                      className="h-2 w-2 rounded-full mr-2 bg-primary"
                    ></span>
                    <span className="truncate">{category}</span>
                  </Link>
                ))}
              </nav>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4">
        <div className={cn(
          "flex items-center",
          open ? "justify-between" : "justify-center"
        )}>
          <div className={cn(
            "flex items-center min-w-0",
            !open && "hidden"
          )}>
            {user?.avatar && (
              <Image 
                src={user.avatar} 
                alt={user.name || 'User avatar'}
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
            )}
            <div className="ml-3 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
            </div>
          </div>
          
          <Link href="/settings">
            <Button variant="ghost" size="icon">
              <Settings size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({
  href,
  icon,
  label,
  active,
  collapsed
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
      active ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground",
      collapsed ? "justify-center" : "justify-start"
    )}
    prefetch={false}
  >
    {icon}
    {!collapsed && <span className="ml-3">{label}</span>}
  </Link>
);