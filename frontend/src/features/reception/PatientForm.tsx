"use client";

import React, { useEffect, useState } from 'react';
import { ageOf } from '@/data/receptionActions';
import { todayStr } from '@/data/slots';
import { BLOOD_GROUPS, GENDERS, ID_PROOFS, INSURERS, LANGUAGES, MARITAL_STATUS, PATIENT_TYPES, REGISTRATION_TYPES, RELATIONS, RELIGIONS, STATES, TITLES } from '@/data/lists';
import { Panel } from '@/features/admin/ui';
import { Alert, Field, btnGhost, btnPrimary, inputCls } from './parts';

export const emptyPatient = () => ({
  title: 'Mr.', firstName: '', middleName: '', lastName: '', gender: '', dob: '', bloodGroup: '', maritalStatus: '', religion: '', language: 'Marathi',
  phone: '', altPhone: '', email: '', address: '', city: '', state: 'Maharashtra', pincode: '', idProofType: '', idProofNumber: '',
  emergencyName: '', emergencyRelation: '', emergencyPhone: '', patientType: 'OPD', registrationType: 'Self', referredBy: '', occupation: '',
  hasInsurance: 'No', insuranceProvider: '', policyNumber: '', policyValidTill: '', isVip: 'No', notes: '',
});

/** Full patient form used for registration and for editing a profile. The page decides what happens on submit. */
export default function PatientForm({ initial, submitLabel, onSubmit, onValues, onCancel, extra }: {
  initial?: Record<string, any>; submitLabel: string; onSubmit: (values: Record<string, any>) => string | void; onValues?: (v: Record<string, any>) => void; onCancel?: () => void; extra?: React.ReactNode;
}) {
  const [v, setV] = useState<Record<string, any>>({ ...emptyPatient(), ...(initial || {}) });
  const [error, setError] = useState('');
  useEffect(() => { onValues?.(v); }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV((x) => ({ ...x, [k]: e.target.value }));
  const sel = (k: string, list: string[], blankLabel = 'Select') => (
    <select value={v[k] ?? ''} onChange={set(k)} className={inputCls}><option value="">{blankLabel}</option>{list.map((o) => <option key={o} value={o}>{o}</option>)}</select>
  );
  const text = (k: string, type = 'text', placeholder = '', extraProps: Record<string, any> = {}) => <input type={type} value={v[k] ?? ''} onChange={set(k)} placeholder={placeholder} className={inputCls} {...extraProps} />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const required: [string, string][] = [['firstName', 'First name'], ['lastName', 'Last name'], ['gender', 'Gender'], ['dob', 'Date of birth'], ['phone', 'Mobile number']];
    const missing = required.find(([k]) => String(v[k] ?? '').trim() === '');
    if (missing) { setError(`${missing[1]} is required`); return; }
    setError(onSubmit(v) || '');
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-6" data-testid="patient-form">
      <Panel title="1. Personal information">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Title">{sel('title', TITLES, 'None')}</Field>
          <Field label="First name" required>{text('firstName')}</Field>
          <Field label="Middle name">{text('middleName')}</Field>
          <Field label="Last name" required>{text('lastName')}</Field>
          <Field label="Gender" required>{sel('gender', GENDERS)}</Field>
          <Field label="Date of birth" required help={v.dob ? `Age: ${ageOf(v.dob)}` : undefined}>{text('dob', 'date', '', { max: todayStr() })}</Field>
          <Field label="Blood group">{sel('bloodGroup', BLOOD_GROUPS)}</Field>
          <Field label="Marital status">{sel('maritalStatus', MARITAL_STATUS)}</Field>
          <Field label="Religion">{sel('religion', RELIGIONS)}</Field>
          <Field label="Language">{sel('language', LANGUAGES)}</Field>
          <Field label="Occupation">{text('occupation')}</Field>
          <Field label="VIP patient">{sel('isVip', ['No', 'Yes'], 'No')}</Field>
        </div>
      </Panel>

      <Panel title="2. Contact and address">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mobile number" required help="10 digits">{text('phone', 'tel', '98XXXXXXXX')}</Field>
          <Field label="Alternate mobile">{text('altPhone', 'tel')}</Field>
          <Field label="Email">{text('email', 'email')}</Field>
          <Field label="Address" half={false}>{text('address')}</Field>
          <Field label="City">{text('city')}</Field>
          <Field label="State">{sel('state', STATES)}</Field>
          <Field label="PIN code">{text('pincode', 'text', '6 digits')}</Field>
        </div>
      </Panel>

      <Panel title="3. Identification and emergency contact">
        <div className="grid grid-cols-2 gap-4">
          <Field label="ID proof">{sel('idProofType', ID_PROOFS, 'None')}</Field>
          <Field label="ID proof number" help={v.idProofType === 'Aadhaar Card' ? '12 digits' : undefined}>{text('idProofNumber')}</Field>
          <Field label="Emergency contact name">{text('emergencyName')}</Field>
          <Field label="Relation">{sel('emergencyRelation', RELATIONS)}</Field>
          <Field label="Emergency contact mobile">{text('emergencyPhone', 'tel')}</Field>
        </div>
      </Panel>

      <Panel title="4. Visit details and insurance">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Patient type">{sel('patientType', PATIENT_TYPES)}</Field>
          <Field label="Registration type">{sel('registrationType', REGISTRATION_TYPES)}</Field>
          <Field label="Referred by"><input type="text" value={v.referredBy ?? ''} onChange={set('referredBy')} placeholder="Doctor, hospital or camp" className={inputCls} /></Field>
          <Field label="Has insurance">{sel('hasInsurance', ['No', 'Yes'], 'No')}</Field>
          {v.hasInsurance === 'Yes' && (<>
            <Field label="Insurance provider" required>{sel('insuranceProvider', INSURERS)}</Field>
            <Field label="Policy number" required>{text('policyNumber')}</Field>
            <Field label="Policy valid till">{text('policyValidTill', 'date')}</Field>
          </>)}
          <Field label="Notes" half={false}><textarea rows={2} value={v.notes ?? ''} onChange={set('notes')} className={inputCls} /></Field>
        </div>
      </Panel>

      {extra}
      {error && <Alert kind="err">{error}</Alert>}
      <div className="flex justify-end gap-3">
        {onCancel && <button type="button" onClick={onCancel} className={btnGhost}>Cancel</button>}
        <button type="submit" className={btnPrimary}>{submitLabel}</button>
      </div>
    </form>
  );
}
