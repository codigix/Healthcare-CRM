"use client";

import React, { useRef, useState } from 'react';
import { ClipboardCheck, Check, X } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import Modal from '@/components/UI/Modal';
import { approvalRequestsDef, approvalRulesDef } from '@/features/admin/defs';
import { decideRequest } from '@/data/actions';
import { DbError, type Row } from '@/data/db';
import { useAuthStore } from '@/lib/store';
import { PageHeader, Tabs } from '@/features/admin/ui';

export default function ApprovalManagementPage() {
  const user = useAuthStore((s) => s.user);
  const notifyRef = useRef<(t: 'ok' | 'err', text: string) => void>(() => {});
  const [deciding, setDeciding] = useState<{ req: Row; decision: 'Approved' | 'Rejected' } | null>(null);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  const open = (req: Row, decision: 'Approved' | 'Rejected', notify: (t: 'ok' | 'err', text: string) => void) => { notifyRef.current = notify; setRemarks(''); setError(''); setDeciding({ req, decision }); };
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deciding) return;
    try {
      decideRequest(deciding.req.id, deciding.decision, remarks, user?.name || 'Administrator');
      notifyRef.current('ok', `${deciding.req.requestNo} ${deciding.decision.toLowerCase()}`);
      setDeciding(null);
    } catch (err) { setError(err instanceof DbError ? err.message : 'Could not save the decision'); }
  };

  return (
    <div className="space-y-4">
      <PageHeader icon={ClipboardCheck} step="Step 6 · Approval Setup" title="Approval Management" description="Rules decide who approves each kind of request. Requests are routed to the approver automatically." />
      <Tabs tabs={[
        { id: 'requests', label: 'Requests', node: (
          <>
            <AdminCrud embedded collection="approvalRequests" title="Approval requests" singular="Request" icon={ClipboardCheck} {...approvalRequestsDef} addLabel="New request"
              description="Pending requests can be approved or rejected here. The approver is chosen from the rules."
              rowActions={(r, _db, notify) => (r.status === 'Pending' ? (
                <>
                  <button title="Approve" onClick={() => open(r, 'Approved', notify)} className="p-1.5 rounded text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10"><Check size={16} /></button>
                  <button title="Reject" onClick={() => open(r, 'Rejected', notify)} className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10"><X size={16} /></button>
                </>
              ) : null)} />
            <Modal isOpen={!!deciding} onClose={() => setDeciding(null)} title={deciding ? `${deciding.decision === 'Approved' ? 'Approve' : 'Reject'} ${deciding.req.requestNo}` : ''} size="lg">
              {deciding && (
                <form onSubmit={submit} className="space-y-4" noValidate>
                  <p className="text-sm text-gray-300">{deciding.req.title}</p>
                  <label className="block">
                    <span className="block text-sm font-medium text-gray-300 mb-1">Remarks{deciding.decision === 'Rejected' && <span className="text-red-500"> *</span>}</span>
                    <textarea rows={3} value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder={deciding.decision === 'Rejected' ? 'Why is it rejected?' : 'Optional'}
                      className="w-full px-3 py-2 bg-dark-tertiary border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500" />
                  </label>
                  {error && <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2" role="alert">{error}</p>}
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setDeciding(null)} className="px-4 py-2 border border-gray-700 rounded-lg text-sm text-gray-300">Cancel</button>
                    <button type="submit" className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${deciding.decision === 'Approved' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>{deciding.decision === 'Approved' ? 'Approve' : 'Reject'}</button>
                  </div>
                </form>
              )}
            </Modal>
          </>
        ) },
        { id: 'rules', label: 'Approval rules', node: <AdminCrud embedded collection="approvalRules" title="Approval rules" singular="Rule" icon={ClipboardCheck} {...approvalRulesDef} description="Who approves what: by request type, department and amount." /> },
      ]} />
    </div>
  );
}
