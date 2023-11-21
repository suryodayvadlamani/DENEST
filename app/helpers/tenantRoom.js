import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HOSTELS } from "@lib/Query_Keys";
export const updateTenantRoom = (data) => {
  return request({
    url: `/api/manageTenantRoom`,
    method: "post",
    data,
  });
};

export function updateTenantRoomFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(updateTenantRoom, {
    onSuccess: () => {
      toast({
        title: "Tenant Room added Successfully",
      });
      queryClient.invalidateQueries([HOSTELS]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
