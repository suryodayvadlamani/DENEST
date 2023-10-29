import { DASHBOARD } from "@lib/Query_Keys";
import { useQuery } from "@tanstack/react-query";
import { request } from "@lib/axios_util";
export const getDashboard = () => {
  return request({
    url: `/api/manageDashboard`,
  });
};

export function getDashboardsFn() {
  return useQuery({
    queryKey: [DASHBOARD],
    queryFn: () => getDashboard(),
  });
}
