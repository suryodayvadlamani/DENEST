import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { TENANT_PAY } from "@lib/Query_Keys";

export const createTenantPay = (data) => {
  return request({
    url: `/api/manageTenantPay`,
    method: "post",
    data,
  });
};

export const getTenantPay = ({ take = 10, pageParam }) => {
  const url = `/api/manageTenantPay?&&take=${take}${
    pageParam ? `&&lastCursor=${pageParam}` : ""
  }`;
  return request({
    url: url,
  });
};
export function getTenantPayFn() {
  return useInfiniteQuery({
    queryKey: [TENANT_PAY],
    queryFn: ({ pageParam }) => {
      return getTenantPay({ pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage?.data?.meta?.nextId ?? false;
    },
  });
}

export const getTenantPayById = (id) => {
  return request({
    url: `/api/manageTenantPay/${id}`,
  });
};

export function getTenantPayByIdFn(tenantPayId) {
  return useQuery({
    queryKey: [TENANT_PAY, tenantPayId],
    queryFn: () => getTenantPayById(tenantPayId),
  });
}
export function createTenantPayFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createTenantPay, {
    onSuccess: () => {
      toast({
        title: "TenantPayment Added Successfully",
      });
      queryClient.invalidateQueries([TENANT_PAY]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}

export const deleteTenantPay = ({ id }) => {
  return request({
    url: `/api/manageTenantPay/${id}`,
    method: "DELETE",
    data: { id },
  });
};
export function deleteTenantPayFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(deleteTenantPay, {
    onSuccess: () => {
      toast({
        title: "Tenant Payment Deleted Successfully",
      });
      queryClient.invalidateQueries([TENANT_PAY]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
export const updateTenantPayById = ({ id, data }) => {
  return request({
    url: `/api/manageTenantPay/${id}`,
    method: "put",
    data: { id, ...data },
  });
};
export function updateTenantPayIdFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(updateTenantPayById, {
    onSuccess: () => {
      toast({
        title: "Tenant Pay Updated Successfully",
      });
      queryClient.invalidateQueries([TENANT_PAY]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
