import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const getUsers = (isTenant) => {
  return request({
    url: `/api/manageTenant?isTenant=${!!isTenant}`,
  });
};
export function getUsersFn() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(),
  });
}
export const getUserById = (id) => {
  return request({
    url: `/api/manageTenant/${id}`,
  });
};
export function getUserByIdFn(userId) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    initialData: () => {
      return {
        data: queryClient
          .getQueryData(["users"])
          ?.data.find((d) => d.id === userId),
      };
    },
  });
}
export const updateUserById = ({ id, data }) => {
  return request({
    url: `/api/manageTenant/${id}`,
    method: "put",
    data: { id, ...data },
  });
};
export function updateUserByIdFn() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(updateUserById, {
    onSuccess: () => {
      toast({
        title: "Tenant Updated Successfully",
      });
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
export const createUser = (data) => {
  return request({
    url: `/api/manageTenant`,
    method: "post",
    data,
  });
};
export function createUserFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createUser, {
    onSuccess: () => {
      toast({
        title: "User Added Successfully",
      });
      queryClient.invalidateQueries(["users"]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
