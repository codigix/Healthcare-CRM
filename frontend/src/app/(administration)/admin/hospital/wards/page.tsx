"use client";

import { Activity } from 'lucide-react';
import CrudPage from '@/features/hospital/CrudPage';
import { wardsDef } from '@/features/hospital/config';

export default function WardManagementPage() {
  return <CrudPage entity="wards" title="Wards" singular="Ward" icon={Activity}
    description="Inpatient wards and nursing stations, with live room and bed occupancy." {...wardsDef} />;
}
