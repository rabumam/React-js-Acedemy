'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useAuth } from '../../contexts/AuthContext';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';
import { usePathname } from 'next/navigation';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();

  useEffect(() => {
    isMobile ? setSidebarOpen(false) : setSidebarOpen(true);
  }, [isMobile]);

  if (!isAuthenticated) return <>{children}</>;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className={cn(
        "flex flex-col flex-1 w-0 overflow-hidden transition-all duration-300",
        isMobile ? "ml-0" : sidebarOpen ? "lg:ml-72" : "lg:ml-20"
      )}>
        <TopBar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};