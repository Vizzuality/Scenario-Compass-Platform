export interface BaseURLParams {
  readonly year: string;
  readonly startYear: string;
  readonly endYear: string;
  readonly geography: string;
}

export interface BaseValues {
  readonly year: string | null;
  readonly startYear: string | null;
  readonly endYear: string | null;
  readonly geography: string | null;
}

export interface BaseSetters {
  readonly setYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setStartYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setEndYear: (value: string | number | null) => Promise<URLSearchParams>;
  readonly setGeography: (value: string | null) => Promise<URLSearchParams>;
}
