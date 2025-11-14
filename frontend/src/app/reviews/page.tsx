'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function ReviewsPage() {
  useEffect(() => {
    redirect('/reviews/doctors');
  }, []);

  return null;
}
