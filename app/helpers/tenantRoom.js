import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const updateTenantRoom = (data) => {
  return request({
    url: `/api/manageTenantRoom`,
    method: "post",
    data,
  });
};

export function updateTenantRoomFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(updateTenantRoom, {
    onSuccess: () => {
      toast({
        title: "Tenant Room added Successfully",
      });
      queryClient.invalidateQueries(["hostels"]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
