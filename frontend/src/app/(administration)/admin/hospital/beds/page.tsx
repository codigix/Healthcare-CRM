"use client";

import { BedDouble } from 'lucide-react';
import CrudPage from '@/features/hospital/CrudPage';
import { bedsDef } from '@/features/hospital/config';

export default function BedManagementPage() {
  return <CrudPage entity="beds" title="Beds" singular="Bed" icon={BedDouble}
    description="Every bed in the hospital with its live status. Occupied beds cannot be deleted." {...bedsDef} />;
}
