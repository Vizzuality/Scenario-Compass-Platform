import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import { ScenarioFilter, Variable, VariableFilter, IamcDataFilter } from "@iiasa/ixmp4-ts";
import API from "@/lib/api";

export const queryKeys = createQueryKeyStore({
  scenarios: {
    list: (filters?: ScenarioFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getScenarios(filters),
    }),
  },
  variables: {
    list: (filters?: VariableFilter) => ({
      queryKey: [{ filters }],
      queryFn: async (): Promise<Variable[]> => API.getVariables(filters),
    }),
  },
  dataPoints: {
    tabulate: (filters?: IamcDataFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getDataTabulatedPoints(filters),
    }),
  },
});

export default queryKeys;
