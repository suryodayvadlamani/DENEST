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

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === INCOME,
      });

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
  date,
}) => {
  let url = `/api/manageDayIncome?isActive=${isActive}&&isTenant=${!!isTenant}&&take=${take}${
    pageParam ? `&&lastCursor=${pageParam}` : ""
  }`;
  if (date.startDate) url = url + `&&startDate=${date.startDate}`;
  if (date.endDate) url = url + `&&endDate=${date.endDate}`;
  return request({
    url: url,
  });
};

export function getUsersFnDayWise(isActive, date) {
  return useInfiniteQuery({
    queryKey: [INCOME, { ...date }],
    queryFn: ({ pageParam }) => {
      return getUsersDayWise({ pageParam, isActive: isActive, date });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.meta?.nextId ?? false;
    },
  });
}
