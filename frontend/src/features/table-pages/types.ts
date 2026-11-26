/**
 * Config for a "table screen": title, 3 stat cards, optional status badge and
 * action columns, and a list of rows. One shared component (ConfigTablePage)
 * draws every screen of this kind, so a screen is ~10 lines of config instead
 * of a ~110 line page file.
 */
export interface StatCard {
  label: string;
  /** Tailwind text colour class for the value, e.g. "text-blue-400" */
  color: string;
  value: string;
}

export type BadgeColor = 'emerald' | 'amber' | 'blue' | 'red' | 'gray';

/** Everything the browser needs to draw the screen (plain, serialisable data). */
export interface TablePageData {
  /** Layout class strings: [header row, stat card, toolbar row] */
  ui: [string, string, string];
  title: string;
  description: string;
  stats: StatCard[];
  /** Plain text columns: [header, row field] */
  columns: [string, string][];
  /** Status badge column: [header, row field, colour of each status value] */
  badge?: [string, string, Record<string, BadgeColor>];
  /** Header of the trailing "..." actions column */
  actions?: string;
  rows: Record<string, unknown>[];
}

/** Registry entry: `ui` is an index into UI_PRESETS and rows come from a function. */
export interface TablePageConfig extends Omit<TablePageData, 'rows' | 'ui'> {
  ui: number;
  rows: () => Record<string, unknown>[];
}

export type TablePageRegistry = Record<string, TablePageConfig>;
