"use client";

import { Users } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { staffDef } from '@/features/admin/defs';

export default function DoctorStaffMasterPage() {
  return <AdminCrud collection="staff" title="Doctor & Staff Master" singular="Staff member" icon={Users} {...staffDef}
    description="Doctors, nurses and staff, the department each one belongs to, and the role they hold in the hospital." />;
}
