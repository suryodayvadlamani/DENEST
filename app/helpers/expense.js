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
export const getExpenses = (expenseType, date) => {
  return request({
    url: `/api/manageExpense?expenseType=${expenseType}&&startDate=${date.startDate}&&endDate=${date.endDate}`,
  });
};

export function getExpensesFn(expenseType, date) {
  return useQuery({
    queryKey: [EXPENSES, date],
    queryFn: () => getExpenses(expenseType, date),
  });
}
export function getExpensesTypeFn(expenseType, date) {
  return useInfiniteQuery({
    queryKey: [EXPENSES, expenseType],
    queryFn: () => getExpenses(expenseType, date),
    enabled: expenseType != "" && expenseType != "All",
  });
}

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
