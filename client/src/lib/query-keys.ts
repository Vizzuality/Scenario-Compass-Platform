import { createQueryKeyStore } from "@lukemorales/query-key-factory";
import { ScenarioFilter } from "@iiasa/ixmp4-ts";
import API from "@/lib/api";

export const queryKeys = createQueryKeyStore({
  scenarios: {
    list: (filters?: ScenarioFilter) => ({
      queryKey: [{ filters }],
      queryFn: async () => API.getScenarios(filters),
    }),
  },
});

export default queryKeys;
