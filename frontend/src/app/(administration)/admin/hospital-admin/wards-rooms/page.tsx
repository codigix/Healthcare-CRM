"use client";

import { DoorOpen, Activity } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { wardsDef, roomsDef } from '@/features/admin/defs';
import { PageHeader, Tabs } from '@/features/admin/ui';

export default function WardRoomManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader icon={DoorOpen} step="Step 3 · Room & Bed Configuration" title="Ward & Room Management" description="Wards on each floor and the rooms inside them. The number of beds on a room creates its beds." />
      <Tabs tabs={[
        { id: 'wards', label: 'Wards', node: <AdminCrud embedded collection="wards" title="Wards" singular="Ward" icon={Activity} {...wardsDef} description="Wards, their department, nurse in charge and live bed counts." emptyHint="Add a floor first (Building & Floor Management), then a department if you have not." /> },
        { id: 'rooms', label: 'Rooms', node: <AdminCrud embedded collection="rooms" title="Rooms" singular="Room" icon={DoorOpen} {...roomsDef} description="Rooms of each ward. Changing the number of beds adds or removes free beds." /> },
      ]} />
    </div>
  );
}
