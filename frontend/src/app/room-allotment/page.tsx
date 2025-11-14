'use client';

import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function RoomAllotmentPage() {
  useEffect(() => {
    redirect('/room-allotment/alloted');
  }, []);

  return null;
}
