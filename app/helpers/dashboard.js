import { DASHBOARD } from "@lib/Query_Keys";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { request } from "@lib/axios_util";
export const getDashboard = (filters) => {
  return request({
    url: `api/manageDashboard?startDate=${filters.startDate}&&endDate=${filters.endDate}`,
  });
};

export function getDashboardsFn(filters) {
  return useQuery({
    queryKey: [DASHBOARD, filters],
    queryFn: () => getDashboard(filters),
  });
}
