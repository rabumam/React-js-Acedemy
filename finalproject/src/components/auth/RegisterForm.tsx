'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RegisterForm = () => {
  const { register } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter');
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number');
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setError('Password must contain at least one special character');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    startTransition(async () => {
      try {
        await register(name, email, password);
        toast({
          title: 'Account created!',
          description: 'Your account has been successfully registered',
        });
        router.push('/dashboard');
      } catch (err: any) {
        const errorMessage = err.message || 'Registration failed. Please try again.';
        setError(errorMessage);
        toast({
          title: 'Registration failed',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Input */}
      <div className="space-y-2">
        <label htmlFor="name" className="sr-only">Full Name</label>
        <Input
          id="name"
          name="name"
          type="text"
          placeholder="Full Name"
          autoComplete="name"
          required
          disabled={isPending}
        />
      </div>

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
            autoComplete="new-password"
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

      {/* Confirm Password Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            autoComplete="new-password"
            required
            disabled={isPending}
            className="flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? '👁️' : '👁️🗨️'}
          </Button>
        </div>
      </div>

      {/* Password Requirements */}
      <div className="text-sm text-muted-foreground">
        <p className="font-medium">Password must contain:</p>
        <ul className="list-disc list-inside">
          <li>At least 8 characters</li>
          <li>One uppercase letter</li>
          <li>One number</li>
          <li>One special character</li>
        </ul>
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
            Creating Account...
          </>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Navigation Links */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Already have an account?{' '}
          <Button
            variant="link"
            className="p-0 h-auto text-primary"
            onClick={() => router.push('/login')}
          >
            Log in here
          </Button>
        </p>
      </div>
    </form>
  );
};