import { request } from "@lib/axios_util";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useToast } from "@UI/use-toast";
import { INCOME } from "@lib/Query_Keys";

export function getIncomeFn() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

  const filters = `startDate=${firstDay.toISOString()}`;

  return useQuery({
    queryKey: [INCOME],
    queryFn: () => getIncome(filters),
  });
}

export const createUserForDayIncome = (data) => {
  return request({
    url: `/api/manageDayIncome`,
    method: "post",
    data,
  });
};

export function createUserForDayIncomeFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createUserForDayIncome, {
    onSuccess: () => {
      toast({
        title: "User Added Successfully",
      });
      queryClient.invalidateQueries([INCOME]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}

export const getUsersDayWise = ({
  isTenant,
  take = 10,
  pageParam,
  isActive,
}) => {
  const url = `/api/manageDayIncome?isActive=${isActive}&&isTenant=${!!isTenant}&&take=${take}${
    pageParam ? `&&lastCursor=${pageParam}` : ""
  }`;
  return request({
    url: url,
  });
};

export function getUsersFnDayWise(isActive) {
  return useInfiniteQuery({
    queryKey: [INCOME, isActive],
    queryFn: ({ pageParam }) => {
      return getUsersDayWise({ pageParam, isActive: isActive });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.meta?.nextId ?? false;
    },
  });
}

export const getUsersMonthWise = ({
  isTenant,

  pageParam,
  isActive,
}) => {
  const url = `/api/manageDayIncome?isActive=${isActive}&&isTenant=${!!isTenant}${
    pageParam ? `&&lastCursor=${pageParam}` : ""
  }`;
  return request({
    url: url,
  });
};
export function getUsersFnMonthWise(isActive) {
  return useInfiniteQuery({
    queryKey: [INCOME, isActive],
    queryFn: ({ pageParam }) => {
      return getUsersMonthWise({ pageParam, isActive: isActive });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.meta?.nextId ?? false;
    },
  });
}
