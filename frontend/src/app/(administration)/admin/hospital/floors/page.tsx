"use client";

import { Layers } from 'lucide-react';
import CrudPage from '@/features/hospital/CrudPage';
import { floorsDef } from '@/features/hospital/config';

export default function FloorManagementPage() {
  return <CrudPage entity="floors" title="Floors" singular="Floor" icon={Layers}
    description="Floors in each building. Wards are created on a floor." {...floorsDef} />;
}
