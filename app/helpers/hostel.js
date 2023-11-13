import { request } from "@lib/axios_util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@UI/use-toast";
import { HOSTELS } from "@lib/Query_Keys";
import { revalidateTag } from "next/cache";
export const getHostels = (filters) => {
  return request({
    url: `/api/manageHostel?startDate='2023-10-31T18:30:00.000Z'&&endDate='2023-11-13T17:40:47.266Z'`,
  });
};

export const createHostel = (data) => {
  return request({
    url: `/api/manageHostel`,
    method: "post",
    data,
  });
};
export function createHostelFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createHostel, {
    onSuccess: () => {
      toast({
        title: "Hostel Added Successfully",
      });
      queryClient.invalidateQueries([HOSTELS]);
      revalidateTag(HOSTELS);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
export function getHostelsFn(filters) {
  return useQuery({
    queryKey: [HOSTELS],
    queryFn: () => getHostels(filters),
    enabled: false,
  });
}
