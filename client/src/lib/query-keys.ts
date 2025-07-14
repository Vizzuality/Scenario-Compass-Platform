import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import {
  ScenarioFilter,
  Variable,
  VariableFilter,
  IamcDataFilter,
  MetaIndicatorFilter,
  ModelFilter,
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
  },
  variables: {
    list: (filters?: VariableFilter) => ({
      queryKey: [{ filters }],
      queryFn: async (): Promise<Variable[]> => API.getVariablesList(filters),
    }),
  },
  dataPoints: {
    tabulate: (filters?: IamcDataFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getDataTabulatedPoints(filters),
    }),
  },
  metaIndicators: {
    tabulate: (filters: MetaIndicatorFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getMetaIndicators(filters),
    }),
  },
});

export default queryKeys;
