import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { VENDORS } from "@lib/Query_Keys";
export const getVendors = ({
  isActive = false,
  isVendor,
  take = 10,
  pageParam,
}) => {
  const url = `/api/manageVendor?isActive=${isActive}&&isVendor=${!!isVendor}&&take=${take}${
    pageParam ? `&&lastCursor=${pageParam}` : ""
  }`;
  return request({
    url: url,
  });
};
export function getVendorsFn() {
  return useInfiniteQuery({
    queryKey: [VENDORS],
    queryFn: ({ pageParam }) => {
      if (pageParam === null) return;
      return getVendors({ pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.meta?.nextId ?? false;
    },
  });
}

export const getVendorById = (id) => {
  return request({
    url: `/api/manageVendor/${id}`,
  });
};
export function getVendorByIdFn(vendorId) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [VENDORS, vendorId],
    queryFn: () => getVendorByIdFn(vendorId),
  });
}

export const updateVendorById = ({ id, data }) => {
  return request({
    url: `/api/manageVendor/${id}`,
    method: "put",
    data: { id, ...data },
  });
};
export function updateVendorByIdFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(updateVendorById, {
    onSuccess: () => {
      toast({
        title: "Vendor Updated Successfully",
      });
      queryClient.invalidateQueries([VENDORS]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
export const createVendor = (data) => {
  return request({
    url: `/api/manageVendor`,
    method: "post",
    data,
  });
};
export function createVendorFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createVendor, {
    onSuccess: () => {
      toast({
        title: "Vendor Added Successfully",
      });
      queryClient.invalidateQueries([VENDORS]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
