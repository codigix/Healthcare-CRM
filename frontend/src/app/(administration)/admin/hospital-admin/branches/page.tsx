"use client";

import { GitBranch } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { branchesDef } from '@/features/admin/defs';

export default function BranchConfigurationPage() {
  return <AdminCrud collection="branches" title="Branch Configuration" singular="Branch" icon={GitBranch} {...branchesDef}
    description="Branches and locations of the hospital group. Each branch holds its buildings, and room and bed counts roll up to it." />;
}
