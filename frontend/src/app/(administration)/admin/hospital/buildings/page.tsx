"use client";

import { Building } from 'lucide-react';
import CrudPage from '@/features/hospital/CrudPage';
import { buildingsDef } from '@/features/hospital/config';

export default function BuildingManagementPage() {
  return <CrudPage entity="buildings" title="Buildings" singular="Building" icon={Building}
    description="Buildings and blocks in each branch." {...buildingsDef} />;
}
