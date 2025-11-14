'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RecordsPage() {
  useEffect(() => {
    redirect('/records/birth');
  }, []);

  return null;
}
