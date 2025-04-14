'use client';

import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  
  return (
    <div className="max-w-md w-full">
      <RegisterForm 
        onSuccess={() => router.push('/dashboard')}
        onLoginClick={() => router.push('/login')}
      />
    </div>
  );
}