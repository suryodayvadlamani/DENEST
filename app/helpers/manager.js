import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const createManager = (data) => {
  return request({
    url: `/api/manageManager`,
    method: "post",
    data,
  });
};
export function createManagerFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createManager, {
    onSuccess: () => {
      toast({
        title: "Manager Added Successfully",
      });
      queryClient.invalidateQueries(["managers"]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
