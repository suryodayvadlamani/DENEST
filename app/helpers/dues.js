import { request } from "@lib/axios_util";
import { DUES } from "@lib/Query_Keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const createDues = (data) => {
  return request({
    url: `/api/manageDues`,
    method: "post",
    data,
  });
};

export const getDues = () => {
  return request({
    url: `/api/manageDues`,
  });
};
export function getDuesFn() {
  return useQuery({
    queryKey: [DUES],
    queryFn: () => getDues(),
  });
}

export function createDuesFn() {
  const queryClient = useQueryClient();
  return useMutation(createDues, {
    onSuccess: () => {
      queryClient.invalidateQueries([DUES]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
