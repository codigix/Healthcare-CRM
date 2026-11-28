"use client";

import React from 'react';
import { BarChart3, Download, Printer } from 'lucide-react';
import { useDb, type Db, type Row } from '@/data/db';
import { bedsInWard, fmtDate, money, nameOf, pct } from '@/data/actions';
import { downloadCsv } from '@/features/admin/AdminCrud';
import { Meter, PageHeader, Panel, Tabs, Tile, useMounted } from '@/features/admin/ui';

type Cell = string | number | { text: string; node: React.ReactNode };
const text = (c: Cell) => (typeof c === 'object' ? c.text : String(c));

function ReportTable({ name, columns, rows, empty = 'No data yet' }: { name: string; columns: string[]; rows: Cell[][]; empty?: string }) {
  return (
    <Panel title={name} actions={rows.length ? <button onClick={() => downloadCsv(name, columns, rows.map((r) => r.map(text)))} className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 print:hidden"><Download size={14} /> Export CSV</button> : undefined}>
      {rows.length === 0 ? <p className="text-sm text-gray-400">{empty}</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs uppercase text-gray-500 border-b border-gray-800">{columns.map((c) => <th key={c} className="py-2 pr-4 font-medium">{c}</th>)}</tr></thead>
            <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-gray-800/60 last:border-0">{r.map((c, j) => <td key={j} className="py-2 pr-4 text-gray-200">{typeof c === 'object' ? c.node : c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

const meter = (n: number, warn?: number): Cell => ({ text: `${n}%`, node: <Meter value={n} warn={warn} /> });
const active = (r: Row) => String(r.status || 'Active') !== 'Inactive';
const countBy = (rows: Row[], key: string) => { const m = new Map<string, number>(); rows.forEach((r) => m.set(String(r[key] || 'Not set'), (m.get(String(r[key] || 'Not set')) || 0) + 1)); return [...m.entries()].sort((a, b) => b[1] - a[1]); };
const overdueBy = (r: Row, now: number) => r.status === 'Pending' && r.slaHours && new Date(r.createdAt).getTime() + Number(r.slaHours) * 3600000 < now;

export default function OperationalReportsPage() {
  const db = useDb();
  const mounted = useMounted();
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const now = Date.now();
  const bedsTotal = db.beds.length, occupied = db.beds.filter((b) => b.status === 'Occupied').length, available = db.beds.filter((b) => b.status === 'Available').length;
  const occ = bedsTotal ? Math.round((occupied / bedsTotal) * 100) : 0;
  const pending = db.approvalRequests.filter((r) => r.status === 'Pending');
  const overdue = pending.filter((r) => overdueBy(r, now));
  const budget = db.costCentres.reduce((a, c) => a + Number(c.monthlyBudget || 0), 0), spent = db.costCentres.reduce((a, c) => a + Number(c.mtdSpend || 0), 0);
  const overBudget = db.costCentres.filter((c) => Number(c.mtdSpend) > Number(c.monthlyBudget)).length;
  const reviewOverdue = db.policies.filter((p) => p.status === 'Approved' && p.reviewDate && new Date(p.reviewDate).getTime() < now);

  const overview = (
    <div className="space-y-6" data-testid="report-overview">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Tile label="Beds" value={bedsTotal} color="text-blue-400" note={`${available} available`} />
        <Tile label="Occupied beds" value={occupied} color="text-amber-400" />
        <Tile label="Bed occupancy" value={`${occ}%`} color="text-emerald-400" />
        <Tile label="Wards / rooms" value={`${db.wards.length} / ${db.rooms.length}`} color="text-indigo-400" />
        <Tile label="Active staff" value={db.staff.filter(active).length} color="text-blue-400" note={`${db.staff.filter((s) => s.staffType === 'Doctor').length} doctors`} />
        <Tile label="Departments" value={db.departments.filter(active).length} color="text-emerald-400" />
        <Tile label="Services priced" value={`${db.services.filter((s) => db.tariffs.some((t) => t.serviceId === s.id)).length} / ${db.services.length}`} color="text-indigo-400" />
        <Tile label="Budget used" value={pct(spent, budget)} color={overBudget ? 'text-red-400' : 'text-amber-400'} note={`${money(spent)} of ${money(budget)}`} />
        <Tile label="Pending approvals" value={pending.length} color="text-amber-400" />
        <Tile label="Approvals overdue" value={overdue.length} color={overdue.length ? 'text-red-400' : 'text-emerald-400'} />
        <Tile label="Policies approved" value={db.policies.filter((p) => p.status === 'Approved').length} color="text-emerald-400" note={`${db.policies.filter((p) => p.status === 'Under review').length} under review`} />
        <Tile label="Reviews overdue" value={reviewOverdue.length} color={reviewOverdue.length ? 'text-red-400' : 'text-emerald-400'} />
      </div>
      {overdue.length > 0 && <ReportTable name="Approvals past their deadline" columns={['Request', 'Title', 'Approver', 'Raised']} rows={overdue.map((r) => [r.requestNo, r.title, r.approverRole, fmtDate(r.createdAt)])} />}
    </div>
  );

  const wardRows: Cell[][] = db.wards.map((w) => { const b = bedsInWard(db, w.id); const o = b.filter((x) => x.status === 'Occupied').length; return [w.name, nameOf(db, 'departments', w.departmentId), w.wardType, db.rooms.filter((r) => r.wardId === w.id).length, b.length, o, b.length - o, meter(b.length ? Math.round((o / b.length) * 100) : 0)]; });
  const beds = (
    <div className="space-y-6">
      <ReportTable name="Bed occupancy by ward" columns={['Ward', 'Department', 'Type', 'Rooms', 'Beds', 'Occupied', 'Free', 'Occupancy']} rows={wardRows} />
      <ReportTable name="Beds by status" columns={['Status', 'Beds']} rows={countBy(db.beds, 'status')} />
      <ReportTable name="Rooms by type" columns={['Room type', 'Rooms', 'Beds']} rows={countBy(db.rooms, 'roomType').map(([t, n]) => [t, n, db.beds.filter((b) => db.rooms.find((r) => r.id === b.roomId)?.roomType === t).length])} />
    </div>
  );

  const deptRows: Cell[][] = db.departments.map((d) => {
    const cc = db.costCentres.filter((c) => c.departmentId === d.id); const bud = cc.reduce((a, c) => a + Number(c.monthlyBudget || 0), 0), sp = cc.reduce((a, c) => a + Number(c.mtdSpend || 0), 0);
    return [d.name, d.type, nameOf(db, 'staff', d.headId) || 'Not assigned', db.staff.filter((s) => s.departmentId === d.id).length, db.wards.filter((w) => w.departmentId === d.id).reduce((a, w) => a + bedsInWard(db, w.id).length, 0), money(bud), money(sp), meter(bud ? Math.round((sp / bud) * 100) : 0)];
  });
  const people = (
    <div className="space-y-6">
      <ReportTable name="Department summary" columns={['Department', 'Type', 'Head', 'Staff', 'Beds', 'Monthly budget', 'Spent', 'Budget used']} rows={deptRows} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportTable name="Staff by type" columns={['Type', 'Staff']} rows={countBy(db.staff, 'staffType')} />
        <ReportTable name="Staff by role" columns={['Role', 'Staff']} rows={countBy(db.staff, 'role')} />
      </div>
    </div>
  );

  const generalPrice = (sid: string) => db.tariffs.find((t) => t.serviceId === sid && t.payerType === 'General');
  const catRows: Cell[][] = countBy(db.services, 'category').map(([c, n]) => { const list = db.services.filter((s) => s.category === c); const prices = list.map((s) => Number(generalPrice(s.id)?.price)).filter((x) => x > 0); return [c, n, prices.length ? money(Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)) : '-', list.filter((s) => !db.tariffs.some((t) => t.serviceId === s.id)).length]; });
  const services = (
    <div className="space-y-6">
      <ReportTable name="Service catalogue by category" columns={['Category', 'Services', 'Average general price', 'Without a price']} rows={catRows} />
      <ReportTable name="Services without a price" columns={['Code', 'Service', 'Department']} rows={db.services.filter((s) => !db.tariffs.some((t) => t.serviceId === s.id)).map((s) => [s.code, s.name, nameOf(db, 'departments', s.departmentId)])} empty="Every service has a price." />
      <ReportTable name="Tariffs by payer type" columns={['Payer type', 'Prices']} rows={countBy(db.tariffs, 'payerType')} />
    </div>
  );

  const approvals = (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportTable name="Requests by status" columns={['Status', 'Requests']} rows={countBy(db.approvalRequests, 'status')} />
        <ReportTable name="Requests by type" columns={['Type', 'Requests']} rows={countBy(db.approvalRequests, 'requestType')} />
      </div>
      <ReportTable name="Pending requests" columns={['Request', 'Title', 'Type', 'Amount', 'Approver', 'Deadline']} rows={pending.map((r) => [r.requestNo, r.title, r.requestType, Number(r.amount) ? money(r.amount) : '-', r.approverRole, overdueBy(r, now) ? 'Overdue' : fmtDate(new Date(new Date(r.createdAt).getTime() + Number(r.slaHours || 24) * 3600000).toISOString())])} empty="No requests are waiting." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportTable name="Policies and SOPs by status" columns={['Status', 'Documents']} rows={countBy(db.policies, 'status')} />
        <ReportTable name="Reviews overdue" columns={['Code', 'Title', 'Review was due']} rows={reviewOverdue.map((p) => [p.code, p.title, fmtDate(p.reviewDate)])} empty="No document is overdue for review." />
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <PageHeader icon={BarChart3} step="Step 7 · Hospital Operations" title="Hospital Operational Reports" description="Live figures from the data entered in the other submodules. They change the moment a record changes." />
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 mt-3 bg-dark-secondary border border-gray-700 rounded-lg text-sm text-white hover:bg-dark-tertiary print:hidden"><Printer size={16} /> Print</button>
      </div>
      <Tabs tabs={[
        { id: 'overview', label: 'Overview', node: overview }, { id: 'beds', label: 'Beds & wards', node: beds }, { id: 'people', label: 'Departments & staff', node: people },
        { id: 'services', label: 'Services & tariffs', node: services }, { id: 'approvals', label: 'Approvals & policies', node: approvals },
      ]} />
    </div>
  );
}
