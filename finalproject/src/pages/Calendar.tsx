// app/calendar/page.tsx
"use client";

import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useTask } from "@/context/tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { TaskForm } from "@/components/tasks/task-form";
import { TaskItem } from "@/components/tasks/task-item";
import { Separator } from "@/components/ui/separator";
import type { PriorityLevel, Task } from "@/types";

export default function CalendarPage() {
  const { tasks, selectTask } = useTask();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleAddTask = () => {
    selectTask({
      id: '',
      title: '',
      description: '',
      dueDate: selectedDate,
      status: 'active',
      priority: 'medium',
      userId: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      subTasks: []
    });
  };

  const tasksForCalendar = tasks.filter(task => task.dueDate && task.status === 'active');
  const taskCounts = tasksForCalendar.reduce<Record<string, number>>((acc, task) => {
    const dateKey = format(task.dueDate!, 'yyyy-MM-dd');
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {});

  const priorityCounts: Record<PriorityLevel, number> = { high: 0, medium: 0, low: 0 };
  const tasksForSelectedDate = selectedDate 
    ? tasks.filter(task => task.dueDate && isSameDay(task.dueDate, selectedDate))
        .sort((a, b) => a.status === 'active' ? -1 : 1)
    : [];

  tasksForSelectedDate.forEach(task => {
    if (task.status === 'active') priorityCounts[task.priority]++;
  });

  return (
    <AppLayout>
      <TaskForm />
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Calendar</h1>
        <p className="text-muted-foreground">View and manage your tasks by date</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="w-full"
                modifiersStyles={{
                  selected: {
                    backgroundColor: 'hsl(var(--primary))',
                    color: 'hsl(var(--primary-foreground))'
                  }
                }}
                components={{
                  DayContent: (props) => {
                    const dateKey = format(props.date, 'yyyy-MM-dd');
                    const count = taskCounts[dateKey] || 0;
                    return (
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div>{props.date.getDate()}</div>
                        {count > 0 && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                        )}
                      </div>
                    );
                  }
                }}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
              </CardTitle>
              <Button size="sm" onClick={handleAddTask}>
                <Plus size={16} className="mr-2" />
                Add Task
              </Button>
            </CardHeader>
            <CardContent>
              {tasksForSelectedDate.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3">
                  {Object.entries(priorityCounts).map(([priority, count]) => {
                    if (count === 0) return null;
                    const colors = {
                      high: { bg: 'bg-priority-high/10', text: 'text-priority-high' },
                      medium: { bg: 'bg-priority-medium/10', text: 'text-priority-medium' },
                      low: { bg: 'bg-priority-low/10', text: 'text-priority-low' }
                    };
                    return (
                      <div 
                        key={priority}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${colors[priority as PriorityLevel].bg} ${colors[priority as PriorityLevel].text}`}
                      >
                        {count} {priority} priority
                      </div>
                    );
                  })}
                </div>
              )}
            
              {tasksForSelectedDate.length > 0 ? (
                <div className="space-y-1">
                  {tasksForSelectedDate.map((task) => (
                    <React.Fragment key={task.id}>
                      <TaskItem task={task} />
                      <Separator />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No tasks for this date</p>
                  <Button variant="outline" className="mt-4" onClick={handleAddTask}>
                    <Plus size={16} className="mr-2" />
                    Add Task
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}