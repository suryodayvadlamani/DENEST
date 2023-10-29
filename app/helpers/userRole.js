import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const createUserRole = (data) => {
  return request({
    url: `/api/manageUserRole`,
    method: "post",
    data,
  });
};
export function createUserRoleFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createUserRole, {
    onSuccess: () => {
      toast({
        title: "User Role Added Successfully",
      });
      queryClient.invalidateQueries(["userRole"]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
