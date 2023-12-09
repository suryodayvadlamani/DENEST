import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HOSTELS } from "@lib/Query_Keys";

export const addBed = (data) => {
  return request({
    url: `/api/manageBed`,
    method: "post",
    data,
  });
};
export const updateBed = ({ id }) => {
  return request({
    url: `/api/manageBed/${id}`,
    method: "DELETE",
    data: { id },
  });
};
export function updateBedFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(updateBed, {
    onSuccess: () => {
      toast({
        title: "Bed Removed Successfully",
      });

      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === HOSTELS,
      });
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
export function addBedFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(addBed, {
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === HOSTELS,
      });

      toast({
        title: "Bed added Successfully",
      });
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
