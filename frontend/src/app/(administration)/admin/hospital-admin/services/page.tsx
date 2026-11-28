"use client";

import { Receipt, Stethoscope } from 'lucide-react';
import AdminCrud from '@/features/admin/AdminCrud';
import { servicesDef, tariffsDef } from '@/features/admin/defs';
import { PageHeader, Tabs } from '@/features/admin/ui';

export default function ServiceTariffManagementPage() {
  return (
    <div className="space-y-4">
      <PageHeader icon={Receipt} step="Step 5 · Service Configuration" title="Service & Tariff Management" description="The services the hospital offers and what each one costs for each kind of payer." />
      <Tabs tabs={[
        { id: 'services', label: 'Services', node: <AdminCrud embedded collection="services" title="Services" singular="Service" icon={Stethoscope} {...servicesDef} description="The service catalogue: consultations, tests, procedures and room charges." /> },
        { id: 'tariffs', label: 'Tariffs', node: <AdminCrud embedded collection="tariffs" title="Tariffs" singular="Tariff" icon={Receipt} {...tariffsDef} addLabel="Add price" description="Price of a service for each payer type, from a start date." emptyHint="Add a service first, then give it a price here." /> },
      ]} />
    </div>
  );
}
