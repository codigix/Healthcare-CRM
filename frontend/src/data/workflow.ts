/**
 * Hospital Administration workflow:
 * Hospital Setup -> Department Creation -> Room & Bed Configuration -> Staff Assignment ->
 * Service Configuration -> Approval Setup -> Hospital Operations.
 * Each step's progress is worked out from the saved data, so it updates as people add records.
 */
import type { Db } from './db';

export interface StepCheck { label: string; done: boolean; href?: string }
export type StepStatus = 'done' | 'in-progress' | 'not-started' | 'locked';
export interface WorkflowStep {
  number: number; id: string; title: string; purpose: string; href: string; module: string;
  checks: StepCheck[]; status: StepStatus; doneCount: number;
}

const BASE = '/admin/hospital-admin';
const active = (r: any) => String(r.status || 'Active').toLowerCase() !== 'inactive';

export function computeWorkflow(db: Db): { steps: WorkflowStep[]; percent: number; next: WorkflowStep | null } {
  const p = db.hospitalProfile[0];
  const depts = db.departments.filter(active);
  const rooms = db.rooms;
  const roomsWithBeds = rooms.filter((r) => db.beds.some((b) => b.roomId === r.id));
  const roles = new Set(db.staff.filter(active).map((s) => s.role));
  const svcs = db.services.filter(active);

  const defs: Omit<WorkflowStep, 'status' | 'doneCount' | 'number'>[] = [
    {
      id: 'setup', title: 'Hospital Setup', purpose: 'Name the hospital and register its branch.', href: `${BASE}/profile`, module: 'Hospital Profile, Branch Configuration',
      checks: [
        { label: 'Hospital name entered', done: !!p?.name?.trim(), href: `${BASE}/profile` },
        { label: 'Registration number and address entered', done: !!(p?.registrationNo?.trim() && p?.address?.trim()), href: `${BASE}/profile` },
        { label: 'At least one branch created', done: db.branches.length > 0, href: `${BASE}/branches` },
      ],
    },
    {
      id: 'departments', title: 'Department Creation', purpose: 'Create departments, name their heads and give each a cost centre.', href: `${BASE}/departments`, module: 'Department Management, Cost Centre Management',
      checks: [
        { label: 'At least one department created', done: depts.length > 0, href: `${BASE}/departments` },
        { label: 'Every department has a head', done: depts.length > 0 && depts.every((d) => !!d.headId), href: `${BASE}/departments` },
        { label: 'Every department has a cost centre', done: depts.length > 0 && depts.every((d) => db.costCentres.some((c) => c.departmentId === d.id)), href: `${BASE}/cost-centres` },
      ],
    },
    {
      id: 'beds', title: 'Room & Bed Configuration', purpose: 'Build the structure: buildings, floors, wards, rooms and beds.', href: `${BASE}/buildings`, module: 'Building & Floor, Ward & Room, Bed Management',
      checks: [
        { label: 'A building is added', done: db.buildings.length > 0, href: `${BASE}/buildings` },
        { label: 'A floor is added', done: db.floors.length > 0, href: `${BASE}/buildings` },
        { label: 'A ward is added', done: db.wards.length > 0, href: `${BASE}/wards-rooms` },
        { label: 'Rooms are added and every room has beds', done: rooms.length > 0 && roomsWithBeds.length === rooms.length, href: `${BASE}/wards-rooms` },
      ],
    },
    {
      id: 'staff', title: 'Staff Assignment', purpose: 'Add doctors and staff and place each one in a department.', href: `${BASE}/staff`, module: 'Doctor & Staff Master',
      checks: [
        { label: 'Staff members are added', done: db.staff.length > 0, href: `${BASE}/staff` },
        { label: 'Every department has at least one staff member', done: depts.length > 0 && depts.every((d) => db.staff.some((s) => s.departmentId === d.id)), href: `${BASE}/staff` },
        { label: 'A Hospital Administrator and a Hospital Manager are assigned', done: roles.has('Hospital Administrator') && roles.has('Hospital Manager'), href: `${BASE}/staff` },
      ],
    },
    {
      id: 'services', title: 'Service Configuration', purpose: 'List the services the hospital offers and price them.', href: `${BASE}/services`, module: 'Service & Tariff Management',
      checks: [
        { label: 'At least one service created', done: svcs.length > 0, href: `${BASE}/services` },
        { label: 'Every service has an active price', done: svcs.length > 0 && svcs.every((s) => db.tariffs.some((t) => t.serviceId === s.id && active(t))), href: `${BASE}/services` },
      ],
    },
    {
      id: 'approvals', title: 'Approval Setup', purpose: 'Decide who approves what, and publish the hospital policies.', href: `${BASE}/approvals`, module: 'Approval Management, Hospital Policies & SOPs',
      checks: [
        { label: 'At least one approval rule is active', done: db.approvalRules.some(active), href: `${BASE}/approvals` },
        { label: 'At least one policy or SOP is approved', done: db.policies.some((x) => x.status === 'Approved'), href: `${BASE}/policies` },
      ],
    },
  ];

  const steps: WorkflowStep[] = defs.map((d, i) => {
    const doneCount = d.checks.filter((c) => c.done).length;
    const status: StepStatus = doneCount === d.checks.length ? 'done' : doneCount === 0 ? 'not-started' : 'in-progress';
    return { ...d, number: i + 1, doneCount, status };
  });

  const setupDone = steps.every((s) => s.status === 'done');
  const pending = steps.filter((s) => s.status !== 'done');
  steps.push({
    number: 7, id: 'operations', title: 'Hospital Operations', purpose: 'Run the hospital day to day and watch operational reports.', href: `${BASE}/reports`, module: 'Hospital Operational Reports',
    checks: [{ label: setupDone ? 'Setup complete: reports are live' : `Finish steps ${pending.map((s) => s.number).join(', ')} first`, done: setupDone, href: `${BASE}/reports` }],
    status: setupDone ? 'done' : 'locked', doneCount: setupDone ? 1 : 0,
  });

  const allChecks = steps.slice(0, 6).flatMap((s) => s.checks);
  const percent = Math.round((allChecks.filter((c) => c.done).length / allChecks.length) * 100);
  return { steps, percent, next: pending[0] || null };
}
