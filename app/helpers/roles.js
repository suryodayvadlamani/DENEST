import { request } from "@lib/axios_util";
import { useQuery } from "@tanstack/react-query";
export const getRoles = () => {
  return request({
    url: `/api/manageRole`,
  });
};
export function getRolesFn() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
    staleTime: 100000,
  });
}
