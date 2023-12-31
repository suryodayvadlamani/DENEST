import { request } from "@lib/axios_util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@UI/use-toast";
import { HOSTELS } from "@lib/Query_Keys";

export const getHostels = (filters) => {
  return request({
    url: `/api/manageHostel?${filters}`,
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

      cancelRef.current.click();
    },
    onError: (e) => {
      console.log(e);
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
export function getHostelsFn(searchData) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const dateFilters = `startDate=${firstDay.toISOString()}`;
  let filters = `${dateFilters}`;
  if (searchData?.floorId) {
    filters += `&&floorId=${searchData?.floorId}`;
  }
  if (searchData?.hostelId) {
    filters += `&&hostelId=${searchData?.hostelId}`;
  }
  if (searchData?.roomType) {
    filters += `&&roomType=${searchData?.roomType}`;
  }
  if (searchData?.sharing) {
    filters += `&&sharing=${searchData?.sharing}`;
  }
  if (searchData?.status) {
    filters += `&&status=${searchData?.status}`;
  }

  return useQuery({
    queryKey: [HOSTELS, filters],
    queryFn: () => getHostels(filters),
  });
}
