import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const createExpense = (data) => {
  return request({
    url: `/api/manageExpense`,
    method: "post",
    data,
  });
};
export function getExpensesFn() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(),
  });
}

export const getExpenses = () => {
  return request({
    url: `/api/manageExpense`,
  });
};

export function createExpenseFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createExpense, {
    onSuccess: () => {
      toast({
        title: "Expense Added Successfully",
      });
      queryClient.invalidateQueries(["expenses"]);
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
export function deleteExpenseFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(deleteExpense, {
    onSuccess: () => {
      toast({
        title: "Expense Deleted Successfully",
      });
      queryClient.invalidateQueries(["expenses"]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
