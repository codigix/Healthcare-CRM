"use client";

import { DoorOpen } from 'lucide-react';
import CrudPage from '@/features/hospital/CrudPage';
import { roomsDef } from '@/features/hospital/config';

export default function RoomManagementPage() {
  return <CrudPage entity="rooms" title="Rooms" singular="Room" icon={DoorOpen}
    description="Rooms in each ward. Beds are created automatically from the number of beds; the same rooms are used by Room Allotment and Bed Status." {...roomsDef} />;
}
