// app/analytics/page.tsx
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { useTask } from "@/context/tasks";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { startOfWeek, eachDayOfInterval, format, addDays, isWithinInterval, subWeeks } from "date-fns";
import { BarChart2, PieChart as PieChartIcon, LineChart as LineChartIcon } from "lucide-react";

export default function AnalyticsPage() {
  const { tasks, categories } = useTask();
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const activeTasks = tasks.filter(task => task.status === 'active').length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const priorityData = [
    { name: 'High', value: tasks.filter(task => task.priority === 'high').length },
    { name: 'Medium', value: tasks.filter(task => task.priority === 'medium').length },
    { name: 'Low', value: tasks.filter(task => task.priority === 'low').length },
  ];

  const categoryData = categories.map(category => ({
    name: category.name,
    value: tasks.filter(task => task.categoryId === category.id).length,
    color: category.color
  }));

  const today = new Date();
  const weekStart = startOfWeek(today);
  
  const weeklyData = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6)
  }).map(day => {
    const tasksCompletedOnDay = tasks.filter(task => 
      task.status === 'completed' && 
      task.updatedAt && 
      format(new Date(task.updatedAt), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ).length;
    
    return {
      day: format(day, 'EEE'),
      completed: tasksCompletedOnDay
    };
  });

  const historicalData = Array.from({ length: 4 }).map((_, i) => {
    const weekEnd = subWeeks(today, i);
    const weekStart = subWeeks(weekEnd, 1);
    
    const tasksCompletedInWeek = tasks.filter(task => 
      task.status === 'completed' && 
      task.updatedAt && 
      isWithinInterval(new Date(task.updatedAt), {
        start: weekStart,
        end: weekEnd
      })
    ).length;
    
    return {
      week: `Week ${4-i}`,
      completed: tasksCompletedInWeek
    };
  }).reverse();

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe'];
  const PRIORITY_COLORS = {
    high: '#ef4444',
    medium: '#f97316',
    low: '#22c55e'
  };
  
  const priorityChartColors = [
    PRIORITY_COLORS.high, 
    PRIORITY_COLORS.medium, 
    PRIORITY_COLORS.low
  ];

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-muted-foreground">View insights and trends for your tasks</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">Total Tasks</h3>
          <p className="text-2xl font-bold">{totalTasks}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">Completed</h3>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">Active</h3>
          <p className="text-2xl font-bold">{activeTasks}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-muted-foreground text-sm">Completion Rate</h3>
          <p className="text-2xl font-bold">{completionRate.toFixed(0)}%</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <PieChartIcon className="mr-2 text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Task Priority Distribution</h2>
          </div>
          <div className="h-64">
            <ChartContainer 
              config={{ 
                high: { label: 'High', color: PRIORITY_COLORS.high },
                medium: { label: 'Medium', color: PRIORITY_COLORS.medium },
                low: { label: 'Low', color: PRIORITY_COLORS.low }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {priorityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={priorityChartColors[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <BarChart2 className="mr-2 text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Tasks by Category</h2>
          </div>
          <div className="h-64">
            <ChartContainer 
              config={Object.fromEntries(
                categoryData.map(cat => [
                  cat.name, 
                  { label: cat.name, color: cat.color }
                ])
              }
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="value">
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <LineChartIcon className="mr-2 text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">This Week's Completion</h2>
          </div>
          <div className="h-64">
            <ChartContainer 
              config={{ 
                completed: { label: 'Tasks Completed', color: '#3b82f6' }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#3b82f6" 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center mb-4">
            <BarChart2 className="mr-2 text-primary h-5 w-5" />
            <h2 className="text-lg font-semibold">Last 4 Weeks Trend</h2>
          </div>
          <div className="h-64">
            <ChartContainer 
              config={{ 
                completed: { label: 'Tasks Completed', color: '#10b981' }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}