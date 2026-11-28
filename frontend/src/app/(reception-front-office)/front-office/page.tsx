"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ClipboardList, DoorOpen, FileText, Footprints, HeartHandshake, Fingerprint, ListOrdered, Search, Stethoscope, Ticket, UserPlus, CalendarCheck, MessageSquare, Users } from 'lucide-react';
import { useDb } from '@/data/db';
import { followUps, minutesSince, previewUhid, todaySummary, tokenLabel, fullName, staffName, doctorsOf, timeOf, queueOrder } from '@/data/receptionActions';
import { computeSlots, leaveOn, sessionsOn, todayStr } from '@/data/slots';
import { RECEPTION_ROLES } from '@/data/lists';
import { fmtDate } from '@/data/actions';
import { PageHeader, Panel, Tile, useMounted } from '@/features/admin/ui';
import { Pill, Table, Td, Tr } from '@/features/reception/parts';

const B = '/front-office';

export default function ReceptionDashboard() {
  const db = useDb();
  const mounted = useMounted();
  if (!mounted) return <div className="py-16 text-center text-sm text-gray-400">Loading...</div>;
  const s = todaySummary(db);
  const t = todayStr();
  const fu = followUps(db);
  const onDuty = doctorsOf(db).map((d) => {
    const sessions = sessionsOn(db, d.id, t); const leave = leaveOn(db, d.id, t); const slots = computeSlots(db, d.id, t);
    const waiting = db.appointments.filter((a) => a.doctorId === d.id && a.date === t && a.status === 'Checked-in').length;
    return { d, sessions, leave, free: slots.filter((x) => x.state === 'free').length, total: slots.length, waiting };
  }).filter((x) => x.sessions.length || x.leave);
  const waitingNow = db.appointments.filter((a) => a.date === t && a.status === 'Checked-in').sort(queueOrder).slice(0, 6);
  const recent = [...db.patients].sort((a, b) => String(b.registeredAt).localeCompare(String(a.registeredAt))).slice(0, 5);

  // The ten steps of the patient flow, each with today's number and where to do it.
  const steps = [
    { n: 1, icon: MessageSquare, title: 'Patient Enquiry', metric: `${s.enquiriesOpen} open`, note: `${s.enquiriesToday} today`, href: `${B}/enquiries` },
    { n: 2, icon: Search, title: 'Check existing / new patient', metric: `${s.patients} patients`, note: 'Search before registering', href: `${B}/search` },
    { n: 3, icon: UserPlus, title: 'Patient Registration', metric: `${s.registeredToday} today`, note: 'New registrations', href: `${B}/registration` },
    { n: 4, icon: Fingerprint, title: 'Generate unique UHID', metric: previewUhid(db), note: 'Next UHID', href: `${B}/uhid` },
    { n: 5, icon: FileText, title: 'Create patient profile', metric: `${s.patients} profiles`, note: 'Profile, documents, history', href: `${B}/profile` },
    { n: 6, icon: Stethoscope, title: 'Select department & doctor', metric: `${onDuty.filter((x) => !x.leave).length} on duty`, note: 'Doctor scheduling', href: `${B}/scheduling` },
    { n: 7, icon: CalendarCheck, title: 'Book appointment', metric: `${s.appointments} today`, note: `${s.expected} still to arrive`, href: `${B}/appointments` },
    { n: 8, icon: Ticket, title: 'Generate token', metric: `${s.tokens} issued`, note: 'Token management', href: `${B}/tokens` },
    { n: 9, icon: ListOrdered, title: 'Send patient to OPD', metric: `${s.waiting} waiting`, note: `${s.inConsultation} with doctor`, href: `${B}/queue` },
    { n: 10, icon: HeartHandshake, title: 'Follow-up / feedback', metric: `${s.followUpsDue} due`, note: `Rating ${s.feedbackAvg}`, href: `${B}/follow-up` },
  ];
  const quick = [
    { label: 'New enquiry', href: `${B}/enquiries`, icon: MessageSquare }, { label: 'Register patient', href: `${B}/registration`, icon: UserPlus }, { label: 'Book appointment', href: `${B}/appointments`, icon: CalendarCheck },
    { label: 'Walk-in patient', href: `${B}/walk-in`, icon: Footprints }, { label: 'OPD queue', href: `${B}/queue`, icon: ListOrdered }, { label: 'Admit / transfer', href: `${B}/transfers`, icon: DoorOpen },
  ];

  return (
    <div className="space-y-6">
      <PageHeader icon={Users} title="Reception Dashboard" description="Patient entry point: handle patient enquiries, registration and appointments." />
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
        <span>Users:</span>{RECEPTION_ROLES.map((r) => <span key={r} className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{r}</span>)}
      </div>

      <div className="flex flex-wrap gap-3">
        {quick.map((q) => <Link key={q.label} href={q.href} className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-gray-700 rounded-lg text-sm text-white hover:border-blue-500/60 hover:bg-blue-500/5"><q.icon size={16} className="text-blue-400" />{q.label}</Link>)}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4" data-testid="today-tiles">
        <Tile label="Appointments today" value={s.appointments} color="text-blue-400" note={`${s.walkIns} walk-ins`} />
        <Tile label="Waiting in OPD" value={s.waiting} color="text-amber-400" note={`${s.inConsultation} with doctor`} />
        <Tile label="Completed" value={s.completed} color="text-emerald-400" />
        <Tile label="Still to arrive" value={s.expected} color="text-indigo-400" note={`${s.noShow} no-show`} />
        <Tile label="Registered today" value={s.registeredToday} color="text-blue-400" note={`${s.patients} in total`} />
        <Tile label="Admitted now" value={s.admitted} color="text-amber-400" note={`${s.bedsFree} beds free`} />
      </div>

      <Panel title="Patient flow: from enquiry to follow-up">
        <ol className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3" data-testid="flow-steps">
          {steps.map((x) => (
            <li key={x.n}>
              <Link href={x.href} data-step={x.n} className="block h-full p-3 rounded-lg border border-gray-800 hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors">
                <div className="flex items-center gap-2 mb-2"><span className="w-6 h-6 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold flex items-center justify-center">{x.n}</span><x.icon size={15} className="text-gray-400" /></div>
                <p className="text-sm font-medium text-white leading-tight">{x.title}</p>
                <p className="text-lg font-bold text-blue-400 mt-1">{x.metric}</p>
                <p className="text-xs text-gray-500">{x.note}</p>
              </Link>
            </li>
          ))}
        </ol>
        <p className="text-xs text-gray-500 mt-3">Example: a new patient arrives, the receptionist registers them, the system issues a UHID, an appointment and token are booked, and the patient goes to the doctor's department.</p>
      </Panel>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Panel title="Doctors on duty today" actions={<Link href={`${B}/scheduling`} className="text-xs text-blue-400 flex items-center gap-1">Scheduling <ArrowRight size={12} /></Link>}>
          <Table head={['Doctor', 'Department', 'OPD', 'Free slots', 'Waiting']} empty="No doctor has OPD today.">
            {onDuty.map((x) => (
              <Tr key={x.d.id}>
                <Td>{x.d.name}</Td><Td>{db.departments.find((d) => d.id === x.d.departmentId)?.name}</Td>
                <Td>{x.leave ? <Pill value="Overdue" label="On leave" /> : x.sessions.map((s) => `${s.startTime}-${s.endTime}`).join(', ')}</Td>
                <Td>{x.leave ? '-' : `${x.free} / ${x.total}`}</Td><Td>{x.waiting}</Td>
              </Tr>
            ))}
          </Table>
        </Panel>
        <Panel title="Waiting for the doctor now" actions={<Link href={`${B}/queue`} className="text-xs text-blue-400 flex items-center gap-1">OPD queue <ArrowRight size={12} /></Link>}>
          <Table head={['Token', 'Patient', 'Doctor', 'Waiting']} empty="Nobody is waiting.">
            {waitingNow.map((a) => <Tr key={a.id}><Td><b>{tokenLabel(a.tokenNo)}</b></Td><Td>{fullName(db.patients.find((p) => p.id === a.patientId))}</Td><Td>{staffName(db, a.doctorId)}</Td><Td>{minutesSince(a.checkedInAt)} min</Td></Tr>)}
          </Table>
        </Panel>
        <Panel title="Recently registered" actions={<Link href={`${B}/registration`} className="text-xs text-blue-400 flex items-center gap-1">Register <ArrowRight size={12} /></Link>}>
          <Table head={['UHID', 'Patient', 'Registered', '']} empty="No patients yet.">
            {recent.map((p) => <Tr key={p.id}><Td>{p.uhid}</Td><Td>{fullName(p)}</Td><Td>{fmtDate(p.registeredAt)}</Td><Td><Link className="text-blue-400 text-xs" href={`${B}/profile/${p.id}`}>Open profile</Link></Td></Tr>)}
          </Table>
        </Panel>
        <Panel title="Needs attention">
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-gray-300">Open enquiries</span><Link href={`${B}/enquiries`} className="text-blue-400">{s.enquiriesOpen}</Link></li>
            <li className="flex justify-between"><span className="text-gray-300">Follow-ups due or overdue</span><Link href={`${B}/follow-up`} className="text-blue-400">{fu.filter((f) => f.state === 'Overdue' || f.state === 'Due today').length}</Link></li>
            <li className="flex justify-between"><span className="text-gray-300">Beds waiting to be cleaned</span><Link href={`${B}/discharge`} className="text-blue-400">{s.bedsCleaning}</Link></li>
            <li className="flex justify-between"><span className="text-gray-300">Booked patients who have not arrived</span><Link href={`${B}/queue`} className="text-blue-400">{s.expected}</Link></li>
            <li className="flex justify-between"><span className="text-gray-300">Average wait today</span><span className="text-white">{s.avgWait} min</span></li>
            <li className="flex justify-between"><span className="text-gray-300">Latest appointment checked in at</span><span className="text-white">{timeOf([...db.appointments].filter((a) => a.checkedInAt).sort((a, b) => String(b.checkedInAt).localeCompare(String(a.checkedInAt)))[0]?.checkedInAt) || '-'}</span></li>
          </ul>
        </Panel>
      </div>
      <p className="text-xs text-gray-500 flex items-center gap-1.5"><ClipboardList size={13} /> Reception data is stored as JSON in this browser. Use Hospital Administration, Saved data, to download a backup.</p>
    </div>
  );
}
