export interface DataPointsFilterParams {
  geography: string | null;
  year?: string | null;
  startYear: string | null;
  endYear: string | null;
  variable: string;
  scenario?: string | null;
  model?: string | null;
}
