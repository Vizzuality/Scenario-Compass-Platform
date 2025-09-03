import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import {
  ScenarioFilter,
  Variable,
  VariableFilter,
  IamcDataFilter,
  MetaIndicatorFilter,
  ModelFilter,
  RunFilter,
} from "@iiasa/ixmp4-ts";
import API from "@/lib/api";

export const queryKeys = createQueryKeyStore({
  scenarios: {
    list: (filters?: ScenarioFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getScenariosList(filters),
    }),
    tabulate: (filters?: ScenarioFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getScenariosTabulate(filters),
    }),
    count: () => ({
      queryKey: ["scenariosCount"],
      queryFn: async () => API.platform?.scenarios.count(),
    }),
  },
  models: {
    tabulate: (filters?: ModelFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getModelsTabulate(filters),
    }),
    list: (filters?: ModelFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getModelsList(filters),
    }),
    count: () => ({
      queryKey: ["modelsCount"],
      queryFn: async () => API.platform?.models.count(),
    }),
  },
  variables: {
    list: (filters?: VariableFilter) => ({
      queryKey: [{ filters }],
      queryFn: async (): Promise<Variable[]> => API.getVariablesList(filters),
    }),
    tabulate: (filters?: VariableFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getVariablesTabulate(filters),
    }),
  },
  dataPoints: {
    tabulate: (filters?: IamcDataFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getDataTabulatedPoints(filters),
    }),
    getForRun: ({
      runId,
      variable,
      geography = "",
    }: {
      runId: number;
      variable?: string;
      geography?: string;
    }) => ({
      queryKey: [{ runId, variable, geography }],
      queryFn: async () => API.getDataPointsForRun({ runId, variable, geography }),
    }),
  },
  metaIndicators: {
    tabulate: (filters: MetaIndicatorFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getMetaIndicators(filters),
    }),
  },
  runs: {
    tabulate: (filters?: RunFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getTabulatedRuns(filters),
    }),
    list: (filters?: RunFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getRuns(filters),
    }),
    details: (id: number) => ({
      queryKey: [{ id }],
      queryFn: async () => API.getRunDetails(id),
    }),
  },
});

export default queryKeys;
