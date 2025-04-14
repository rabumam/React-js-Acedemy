'use client';

import { useEffect, useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Moon, 
  Sun, 
  X, 
  Undo2 
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { format, isToday, isTomorrow, addDays } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useTask } from '@/contexts/TaskContext';

interface TopBarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const TopBar = ({ sidebarOpen, setSidebarOpen }: TopBarProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const { searchQuery, setSearchQuery, tasks, actionHistory, undoLastAction } = useTask();
  const [showSearch, setShowSearch] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const isMobile = useIsMobile();

  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false;
    const dueDate = new Date(task.dueDate);
    const threeDaysFromNow = addDays(new Date(), 3);
    return dueDate <= threeDaysFromNow;
  });

  const hasNotifications = upcomingTasks.length > 0;
  const hasUndoActions = actionHistory.length > 0;

  useEffect(() => {
    if (hasUndoActions) {
      setShowUndo(true);
      const timer = setTimeout(() => setShowUndo(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionHistory.length]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleUndo = () => {
    undoLastAction();
    setShowUndo(false);
  };

  return (
    <div className="sticky top-0 z-30 flex items-center h-16 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
        >
          <Menu size={20} />
        </Button>
        
        {!showSearch && (
          <h1 className="text-xl font-semibold hidden md:block">Task Haven</h1>
        )}
      </div>

      <div className={cn(
        "ml-4 flex-1 transition-all duration-200",
        showSearch ? "flex" : "hidden md:flex"
      )}>
        <div className="w-full max-w-md relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="w-full pl-8 bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {showSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 md:hidden"
            onClick={() => setShowSearch(false)}
          >
            <X size={18} />
          </Button>
        )}
      </div>

      <div className="ml-auto flex items-center space-x-2">
        <div className={cn(
          "transition-all duration-300 overflow-hidden",
          showUndo && hasUndoActions ? "w-auto opacity-100" : "w-0 opacity-0"
        )}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUndo}
            className="bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/50"
          >
            <Undo2 size={14} className="mr-1.5" />
            <span className="text-xs">Undo</span>
          </Button>
        </div>
        
        {!showSearch && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setShowSearch(true)}
          >
            <Search size={20} />
          </Button>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {hasNotifications && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="p-2 font-medium border-b">
              <h3>Notifications</h3>
            </div>
            {upcomingTasks.length > 0 ? (
              <ScrollArea className="h-[300px]">
                <div className="p-4 space-y-3">
                  {upcomingTasks.map(task => {
                    const dueDate = new Date(task.dueDate!);
                    let dateLabel = '';
                    let badgeVariant: 'default' | 'destructive' | 'outline' = 'outline';
                    
                    if (isToday(dueDate)) {
                      dateLabel = 'Due today';
                      badgeVariant = 'destructive';
                    } else if (isTomorrow(dueDate)) {
                      dateLabel = 'Due tomorrow';
                      badgeVariant = 'default';
                    } else {
                      dateLabel = `Due ${format(dueDate, 'MMM dd')}`;
                      badgeVariant = 'outline';
                    }
                    
                    return (
                      <div key={task.id} className="flex items-start space-x-2 rounded-lg p-2 hover:bg-muted">
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{task.title}</p>
                          <Badge variant={badgeVariant} className="mt-1">
                            {dateLabel}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <p>No upcoming due dates</p>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {resolvedTheme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
        </Button>
      </div>
    </div>
  );
};