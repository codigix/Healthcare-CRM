"use client";

import { GitBranch } from 'lucide-react';
import CrudPage from '@/features/hospital/CrudPage';
import { branchesDef } from '@/features/hospital/config';

export default function BranchManagementPage() {
  return <CrudPage entity="branches" title="Branches" singular="Branch" icon={GitBranch}
    description="Hospital branches and locations. Each branch holds its buildings." {...branchesDef} />;
}
