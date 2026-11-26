import { notFound } from 'next/navigation';
import ConfigTablePage from '@/features/table-pages/ConfigTablePage';
import { tablePageModule } from '@/features/table-pages/manifest';
import { registryLoaders } from '@/features/table-pages/loaders';
import { UI_PRESETS } from '@/features/table-pages/ui-presets';

/**
 * Serves every "table screen" from config (src/features/table-pages/registry/*).
 * Real page.tsx files always win over this catch-all, so screens with their own
 * code (forms, API-backed lists, [id] pages) are untouched.
 */
export default async function TableScreen({ params }: { params: { slug: string[] } }) {
  const route = '/' + params.slug.map(decodeURIComponent).join('/');
  const group = Object.prototype.hasOwnProperty.call(tablePageModule, route) ? tablePageModule[route] : undefined;
  if (!group) notFound();

  const registry = (await registryLoaders[group]()).default;
  const config = registry[route];
  if (!config) notFound();

  const { ui, rows, ...rest } = config;
  return <ConfigTablePage {...rest} ui={UI_PRESETS[ui]} rows={rows()} />;
}
