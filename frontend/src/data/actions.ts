/** Business actions of the Hospital Administration module that touch more than one collection. */
import { create, update, getDb, nextCode, DbError, type Db, type Row } from './db';

export const ADMIN_ROLES = ['Hospital Administrator', 'Hospital Manager', 'Department Head', 'Operations Manager'] as const;
export const STAFF_ROLES = [...ADMIN_ROLES, 'Doctor', 'Nurse', 'Technician', 'Pharmacist', 'Support Staff'];
export const REQUEST_TYPES = ['Purchase', 'Discount / Refund', 'Leave', 'Policy / SOP', 'Equipment / Asset', 'Staff Transfer', 'Other'];

export const money = (n: unknown) => `Rs. ${Number(n || 0).toLocaleString('en-IN')}`;
export const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '');
export const today = () => new Date().toISOString().slice(0, 10);
export const nameOf = (db: Db, col: keyof Db, id?: string, key = 'name') => (id ? db[col].find((r) => r.id === id)?.[key] ?? '' : '');

/** Which rule decides a request: the active rule for its type with the highest "from amount" it reaches. */
export function routeApproval(db: Db, requestType: string, amount: number, departmentId?: string) {
  const rules = db.approvalRules
    .filter((r) => String(r.status || 'Active') !== 'Inactive' && r.requestType === requestType && Number(r.minAmount || 0) <= (Number(amount) || 0) && (!r.departmentId || r.departmentId === departmentId))
    .sort((a, b) => Number(b.minAmount || 0) - Number(a.minAmount || 0));
  const rule = rules[0];
  return rule ? { approverRole: rule.approverRole as string, slaHours: Number(rule.slaHours) || 24, ruleName: rule.name as string } : { approverRole: 'Hospital Administrator', slaHours: 48, ruleName: 'No rule set: sent to the Hospital Administrator' };
}

export function newRequest(input: { title: string; requestType: string; departmentId?: string; requesterId?: string; amount?: number; details?: string; refCollection?: string; refId?: string }): Row {
  const db = getDb();
  const route = routeApproval(db, input.requestType, input.amount || 0, input.departmentId);
  return create('approvalRequests', {
    requestNo: nextCode('approvalRequests', 'requestNo', 'REQ-', 4), title: input.title, requestType: input.requestType, departmentId: input.departmentId || '', requesterId: input.requesterId || '',
    amount: input.amount || 0, details: input.details || '', status: 'Pending', approverRole: route.approverRole, slaHours: route.slaHours,
    decidedBy: '', decidedAt: '', remarks: '', refCollection: input.refCollection || '', refId: input.refId || '',
  });
}

/** Send a policy / SOP for approval: creates the request and marks the document "Under review". */
export function submitPolicyForApproval(policy: Row, requesterId?: string): Row {
  if (policy.status === 'Approved') throw new DbError('This document is already approved.');
  const db = getDb();
  if (db.approvalRequests.some((r) => r.refCollection === 'policies' && r.refId === policy.id && r.status === 'Pending')) throw new DbError('This document is already waiting for approval.');
  const req = newRequest({ title: `${policy.title} v${policy.version}`, requestType: 'Policy / SOP', departmentId: policy.departmentId, requesterId: requesterId || policy.ownerId, details: `${policy.docType} ${policy.code}`, refCollection: 'policies', refId: policy.id });
  update('policies', policy.id, { status: 'Under review' });
  return req;
}

/** Approve or reject. Rejecting needs a reason. An approved policy / SOP becomes "Approved" and effective today. */
export function decideRequest(id: string, decision: 'Approved' | 'Rejected', remarks: string, by: string): Row {
  const db = getDb();
  const req = db.approvalRequests.find((r) => r.id === id);
  if (!req) throw new DbError('This request no longer exists.');
  if (req.status !== 'Pending') throw new DbError(`This request is already ${String(req.status).toLowerCase()}.`);
  if (decision === 'Rejected' && !remarks.trim()) throw new DbError('Please give a reason for rejecting.');
  const saved = update('approvalRequests', id, { status: decision, decidedBy: by, decidedAt: new Date().toISOString(), remarks: remarks.trim() });
  if (req.refCollection === 'policies' && req.refId && db.policies.some((p) => p.id === req.refId)) {
    update('policies', req.refId, decision === 'Approved' ? { status: 'Approved', effectiveDate: today() } : { status: 'Draft' });
  }
  return saved;
}

export const bedsInWard = (db: Db, wardId: string) => { const rooms = db.rooms.filter((r) => r.wardId === wardId).map((r) => r.id); return db.beds.filter((b) => rooms.includes(b.roomId)); };
export const bedsInBuilding = (db: Db, buildingId: string) => {
  const floors = db.floors.filter((f) => f.buildingId === buildingId).map((f) => f.id);
  const wards = db.wards.filter((w) => floors.includes(w.floorId)).map((w) => w.id);
  const rooms = db.rooms.filter((r) => wards.includes(r.wardId)).map((r) => r.id);
  return db.beds.filter((b) => rooms.includes(b.roomId));
};
export const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : '0%');
