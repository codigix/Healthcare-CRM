"use client";

import { FileText, Send } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { policiesDef } from '@/features/admin/defs';
import { submitPolicyForApproval } from '@/data/actions';
import { DbError } from '@/data/db';
import { PageHeader } from '@/features/admin/ui';

export default function PoliciesSopsPage() {
  return (
    <div className="space-y-4">
      <PageHeader icon={FileText} step="Step 6 · Approval Setup" title="Hospital Policies & SOPs" description="Policies, SOPs, protocols and circulars with their version, owner and review date. A draft is sent for approval and becomes Approved when the approver accepts it." />
      <AdminCrud embedded collection="policies" title="Policies & SOPs" singular="Document" icon={FileText} {...policiesDef}
        description="Use Submit for approval on a draft; the request goes to the approver set in Approval Management."
        rowActions={(r, _db, notify) => (r.status === 'Draft' ? (
          <button title="Submit for approval" onClick={() => {
            try { const q = submitPolicyForApproval(r); notify('ok', `Sent to ${q.approverRole} for approval as ${q.requestNo}`); }
            catch (e) { notify('err', e instanceof DbError ? e.message : 'Could not submit'); }
          }} className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium text-blue-400 hover:bg-blue-500/10"><Send size={13} /> Submit</button>
        ) : null)} />
    </div>
  );
}
