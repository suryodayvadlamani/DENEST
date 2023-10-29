import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      queryClient.invalidateQueries(["hostels"]);
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
