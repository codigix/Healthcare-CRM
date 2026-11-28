"use client";

import { BedDouble } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { bedsDef } from '@/features/admin/defs';

export default function BedManagementPage() {
  return <AdminCrud collection="beds" title="Bed Management" singular="Bed" icon={BedDouble} {...bedsDef}
    description="Every bed with its live status. Occupied beds cannot be deleted, and a bed cannot be added beyond its room's number of beds." />;
}
