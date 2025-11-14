'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    if (token || storedToken) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [token, router]);

  return null;
}
