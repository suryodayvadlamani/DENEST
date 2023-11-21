import { request } from "@lib/axios_util";
import { DUES } from "@lib/Query_Keys";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const createDues = (data) => {
  return request({
    url: `/api/manageDues`,
    method: "post",
    data,
  });
};

export const getDues = ({ take = 10, pageParam }) => {
  const url = `/api/manageDues?&&take=${take}${
    pageParam ? `&&lastCursor=${pageParam}` : ""
  }`;
  return request({
    url: url,
  });
};
export const getDuesFn = () => {
  return useInfiniteQuery({
    queryKey: [DUES],
    queryFn: ({ pageParam }) => {
      return getDues({ pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.meta?.nextId ?? false;
    },
  });
};

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
