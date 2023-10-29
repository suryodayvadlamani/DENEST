import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TENANT_PAY } from "@lib/Query_Keys";

export const createTenantPay = (data) => {
  return request({
    url: `/api/manageTenantPay`,
    method: "post",
    data,
  });
};

export const getTenantPay = () => {
  return request({
    url: `/api/manageTenantPay`,
  });
};
export function getTenantPayFn() {
  return useQuery({
    queryKey: [TENANT_PAY],
    queryFn: () => getTenantPay(),
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
      queryClient.invalidateQueries([Tenant_Pay]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
