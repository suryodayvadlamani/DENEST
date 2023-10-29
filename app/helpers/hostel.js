import { request } from "@lib/axios_util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@UI/use-toast";
import { GET_HOSTELS } from "@lib/Query_Keys";
import { revalidateTag } from "next/cache";
export const getHostels = () => {
  return request({
    url: `/api/manageHostel`,
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
      queryClient.invalidateQueries([GET_HOSTELS]);
      revalidateTag(GET_HOSTELS);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
export function getHostelsFn() {
  return useQuery({
    queryKey: [GET_HOSTELS],
    queryFn: () => getHostels(),
  });
}
