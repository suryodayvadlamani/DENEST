import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useStore } from "@/app/store/store";
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
export const getExpenseById = (id) => {
  return request({
    url: `/api/manageExpense/${id}`,
  });
};

export function getExpenseByIdFn(expenseId) {
  return useQuery({
    queryKey: [EXPENSES, expenseId],
    queryFn: () => getExpenseById(expenseId),
  });
}

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
  const { to, from } = useStore.getState().filter;
  const startDate = to && new Date(from).toISOString();
  const endDate = from && new Date(to).toISOString();
  return request({
    url: `/api/manageExpense?expenseType=${expenseType}&&startDate=${startDate}&&endDate=${endDate}`,
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

export const updateExpenseById = ({ id, data }) => {
  return request({
    url: `/api/manageExpense/${id}`,
    method: "put",
    data: { id, ...data },
  });
};

export function updateExpenseIdFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(updateExpenseById, {
    onSuccess: () => {
      toast({
        title: "Expense Updated Successfully",
      });
      queryClient.invalidateQueries([EXPENSES]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
