/**
 * Base interface for scenario dashboard URL parameter names.
 * This represents the structure without any prefix.
 */
export interface ScenarioDashboardURLParams {
  readonly year: string;
  readonly startYear: string;
  readonly endYear: string;
  readonly geography: string;
  readonly climate: string;
  readonly energy: string;
  readonly land: string;
}

/**
 * Type for prefixed parameter names (left/right comparison).
 * Generates types like "leftClimate", "rightEnergy", etc.
 */
export type ScenarioDashboardURLParamsWithPrefix = {
  [K in keyof ScenarioDashboardURLParams as
    | `left${Capitalize<K>}`
    | `right${Capitalize<K>}`]: string;
};

/**
 * Union type of all possible parameter keys (base + prefixed).
 */
export type ScenarioDashboardURLParamsKey =
  | keyof ScenarioDashboardURLParams
  | keyof ScenarioDashboardURLParamsWithPrefix;

/**
 * Type for filter values returned by the hooks.
 * Now climate, energy, and land are arrays instead of strings.
 */
export interface ScenarioFilterValues {
  readonly year: string | null;
  readonly startYear: string | null;
  readonly endYear: string | null;
  readonly geography: string | null;
  readonly climate: string[] | null;
  readonly energy: string[] | null;
  readonly land: string[] | null;
}

/**
 * Type for filter setters - functions that update individual filters.
 * Now climate, energy, and land setters accept arrays.
 */
export interface ScenarioFilterSetters {
  readonly setYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setStartYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setEndYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setGeography: (value: string | null) => Promise<URLSearchParams>;
  readonly setClimate: (value: string[] | null) => Promise<URLSearchParams>;
  readonly setEnergy: (value: string[] | null) => Promise<URLSearchParams>;
  readonly setLand: (value: string[] | null) => Promise<URLSearchParams>;
}

/**
 * Type for clear operations.
 */
export interface ScenarioClearOperations {
  readonly clearAll: () => Promise<URLSearchParams>;
  readonly clearYearFilters: () => Promise<URLSearchParams>;
  readonly clearScenarioFilters: () => Promise<URLSearchParams>;
}

/**
 * Type for helper functions.
 */
export interface ScenarioHelpers {
  readonly getActiveScenarioParams: () => ScenarioDashboardURLParamsKey[];
}

/**
 * Type for the core URL state hook return value.
 */
export interface ScenarioUrlState {
  readonly params: ScenarioDashboardURLParams;
  readonly filters: Record<string, string | number | string[] | null>;
  readonly setFilters: (
    updates: Record<string, string | number | string[] | null>,
  ) => Promise<URLSearchParams>;
}
