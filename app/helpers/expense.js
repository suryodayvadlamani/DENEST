import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { EXPENSES } from "@lib/Query_Keys";
export const createExpense = (data) => {
  return request({
    url: `/api/manageExpense`,
    method: "post",
    data,
  });
};
export function getExpensesFn(expenseType) {
  return useQuery({
    queryKey: [EXPENSES, expenseType],
    queryFn: () => getExpenses(expenseType),
  });
}
export function getExpensesTypeFn(expenseType) {
  return useInfiniteQuery({
    queryKey: [EXPENSES, expenseType],
    queryFn: () => getExpenses(expenseType),
    enabled: expenseType != "",
  });
}

export const getExpenses = (expenseType) => {
  return request({
    url: `/api/manageExpense?expenseType=${expenseType}`,
  });
};

export function createExpenseFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createExpense, {
    onSuccess: () => {
      toast({
        title: "Expense Added Successfully",
      });
      queryClient.invalidateQueries([EXPENSES]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}

export const deleteExpense = ({ id }) => {
  return request({
    url: `/api/manageExpense/${id}`,
    method: "DELETE",
    data: { id },
  });
};
export function deleteExpenseFn(expenseType) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(deleteExpense, {
    onSuccess: () => {
      toast({
        title: "Expense Deleted Successfully",
      });
      queryClient.invalidateQueries([EXPENSES, "All"]);
      queryClient.invalidateQueries([EXPENSES, expenseType]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
