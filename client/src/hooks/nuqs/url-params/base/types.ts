export interface BaseURLParams {
  readonly year: string;
  readonly startYear: string;
  readonly endYear: string;
  readonly geography: string;
  readonly model: string;
  readonly scenario: string;
}

export interface BaseValues {
  readonly year: string | null;
  readonly startYear: string | null;
  readonly endYear: string | null;
  readonly geography: string | null;
  readonly model: string | null;
  readonly scenario: string | null;
}

export interface BaseSetters {
  readonly setYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setStartYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setEndYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setGeography: (value: string | null) => Promise<URLSearchParams>;
  readonly setModel: (value: string | null) => Promise<URLSearchParams>;
  readonly setScenario: (value: string | null) => Promise<URLSearchParams>;
}
