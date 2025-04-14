
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CheckSquare } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from '../components/ui/button';
import { Moon, Sun } from 'lucide-react';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (isAuthenticated) {
    // Redirect to dashboard if already authenticated
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 md:p-8 bg-gradient-to-br from-background to-accent">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        >
          {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
      </div>

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mb-2 flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <CheckSquare size={36} className="text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">Task Haven</h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks, boost your productivity
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </CardTitle>
            <CardDescription>
              {authMode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your details to create a new account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {authMode === 'login' ? (
              <LoginForm 
                onRegisterClick={() => setAuthMode('register')} 
              />
            ) : (
              <RegisterForm 
                onLoginClick={() => setAuthMode('login')} 
              />
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Task Haven. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
