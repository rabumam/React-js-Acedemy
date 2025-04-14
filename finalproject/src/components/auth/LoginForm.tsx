'use client';

import { useRouter } from 'next/navigation';
import { useTransition, useState } from 'react'; 
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '../../hooks/use-toast';

export const LoginForm = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    startTransition(async () => {
      try {
        await login(email, password);
        router.push('/dashboard');
      } catch (err) {
        setError('Invalid credentials');
        toast({
          title: 'Login failed',
          description: 'Check your email and password',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="sr-only">Email</label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          required
          disabled={isPending}
        />
      </div>

      {/* Password Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            autoComplete="current-password"
            required
            disabled={isPending}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️🗨️'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-destructive" role="alert">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
        aria-disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Authenticating...
          </>
        ) : (
          'Log In'
        )}
      </Button>

      {/* Navigation Links */}
      <div className="text-center space-y-2 text-sm text-muted-foreground">
        <p>
          New user?{' '}
          <Button
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={() => router.push('/register')}
          >
            Create account
          </Button>
        </p>
        <div className="text-xs text-gray-500">
          <p>Demo: test@example.com / any password</p>
        </div>
      </div>
    </form>
  );
};