"use client";

import { Wallet } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { costCentresDef } from '@/features/admin/defs';

export default function CostCentreManagementPage() {
  return <AdminCrud collection="costCentres" title="Cost Centre Management" singular="Cost centre" icon={Wallet} {...costCentresDef}
    description="Budget and spend per department. A centre turns amber near its budget and red when it goes over." />;
}
