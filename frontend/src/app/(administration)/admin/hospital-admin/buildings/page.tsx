"use client";

import { Layers, Building } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { buildingsDef, floorsDef } from '@/features/admin/defs';
import { PageHeader, Tabs } from '@/features/admin/ui';

export default function BuildingFloorManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader icon={Layers} step="Step 3 · Room & Bed Configuration" title="Building & Floor Management" description="Buildings of each branch and the floors inside them. Wards are created on a floor." />
      <Tabs tabs={[
        { id: 'buildings', label: 'Buildings', node: <AdminCrud embedded collection="buildings" title="Buildings" singular="Building" icon={Building} {...buildingsDef} description="Buildings and blocks of each branch." /> },
        { id: 'floors', label: 'Floors', node: <AdminCrud embedded collection="floors" title="Floors" singular="Floor" icon={Layers} {...floorsDef} description="Floors of each building." emptyHint="Add a building first, then its floors." /> },
      ]} />
    </div>
  );
}
