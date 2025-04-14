
import React, { useEffect } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTask } from '../contexts/TaskContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ButtonLink } from '../components/ui/button-link';
import { useToast } from '../hooks/use-toast';
import { CheckSquare, Clock, Star, Plus, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';

const Dashboard = () => {
  const { tasks, filteredTasks, selectTask } = useTask();
  const { toast: shadowToast } = useToast();

  const handleAddTask = () => {
    selectTask({
      id: '',
      title: '',
      description: '',
      status: 'active',
      priority: 'medium',
      userId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      subTasks: []
    });
  };

  // Check for upcoming deadlines
  useEffect(() => {
    const now = new Date();
    
    // Filter tasks with upcoming deadlines (today or tomorrow)
    const upcomingTasks = tasks.filter(task => {
      if (!task.dueDate || task.status === 'completed') return false;
      const dueDate = new Date(task.dueDate);
      
      return isToday(dueDate) || isTomorrow(dueDate);
    });
    
    // Show toast notifications for upcoming deadlines
    upcomingTasks.forEach(task => {
      const dueDate = new Date(task.dueDate!);
      const isToday = differenceInDays(dueDate, now) === 0;
      
      toast(`Task due ${isToday ? 'today' : 'tomorrow'}`, {
        description: task.title,
        action: {
          label: "View",
          onClick: () => selectTask(task)
        },
      });
    });
  }, [tasks]);

  // Stats calculations
  const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) : 0;
  
  const dueTodayCount = filteredTasks.filter(task => {
    if (!task.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return (
      dueDate.getDate() === today.getDate() &&
      dueDate.getMonth() === today.getMonth() &&
      dueDate.getFullYear() === today.getFullYear()
    );
  }).length;

  const highPriorityCount = filteredTasks.filter(task => 
    task.status === 'active' && task.priority === 'high'
  ).length;

  return (
    <AppLayout>
      <TaskForm />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your personal task management space</p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-4">
            <CheckSquare className="text-primary h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Completion Rate</p>
            <p className="text-2xl font-bold">{completionRate}%</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center">
          <div className="bg-amber-500/10 p-3 rounded-full mr-4">
            <Clock className="text-amber-500 h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Due Today</p>
            <p className="text-2xl font-bold">{dueTodayCount}</p>
          </div>
        </Card>
        
        <Card className="p-4 flex items-center">
          <div className="bg-red-500/10 p-3 rounded-full mr-4">
            <Star className="text-red-500 h-6 w-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">High Priority</p>
            <p className="text-2xl font-bold">{highPriorityCount}</p>
          </div>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleAddTask}>
            <Plus size={16} className="mr-2" />
            Add New Task
          </Button>
          <ButtonLink 
            variant="outline"
            to="/analytics"
          >
            <BarChart2 size={16} className="mr-2" />
            View Analytics
          </ButtonLink>
        </div>
      </div>

      {/* Recent tasks */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Tasks</h2>
        <Card className="p-4">
          <TaskList />
        </Card>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
