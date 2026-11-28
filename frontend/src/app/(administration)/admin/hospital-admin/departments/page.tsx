"use client";

import { Network } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { departmentsDef } from '@/features/admin/defs';

export default function DepartmentManagementPage() {
  return <AdminCrud collection="departments" title="Department Management" singular="Department" icon={Network} {...departmentsDef}
    description="Departments of the hospital, their heads, and how many staff, beds and cost centres each one has." />;
}
