import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { VENDORS } from "@lib/Query_Keys";
export const getVendors = (isActive) => {
  return request({
    url: `/api/manageVendor?isActive=${isActive}`,
  });
};
export function getVendorsFn(isActive = false) {
  return useQuery({
    queryKey: [VENDORS],
    queryFn: () => getVendorsFn(isActive),
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
    initialData: () => {
      return {
        data: queryClient
          .getQueryData([VENDORS])
          ?.data.find((d) => d.id === vendorId),
      };
    },
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
