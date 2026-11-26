import type { TablePageRegistry } from './types';

export const registryLoaders: Record<string, () => Promise<{ default: TablePageRegistry }>> = {
  "administration": () => import('./registry/administration'),
  "clinical-services": () => import('./registry/clinical-services'),
  "diagnostics": () => import('./registry/diagnostics'),
  "facilities-support": () => import('./registry/facilities-support'),
  "finance-accounts": () => import('./registry/finance-accounts'),
  "human-resources": () => import('./registry/human-resources'),
  "inventory-procurement": () => import('./registry/inventory-procurement'),
  "it-system": () => import('./registry/it-system'),
  "medical-records-quality": () => import('./registry/medical-records-quality'),
  "nursing-patient-care": () => import('./registry/nursing-patient-care'),
  "ot-critical-care": () => import('./registry/ot-critical-care'),
  "patient-relationship-crm": () => import('./registry/patient-relationship-crm'),
  "pharmacy": () => import('./registry/pharmacy'),
  "reception-front-office": () => import('./registry/reception-front-office'),
};
