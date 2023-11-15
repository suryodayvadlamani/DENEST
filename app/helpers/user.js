import { request } from "@lib/axios_util";
import { useToast } from "@UI/use-toast";
import { USERS } from "@lib/Query_Keys";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const getUsers = ({ isTenant, take = 10, pageParam }) => {
  const url = `/api/manageTenant?isTenant=${!!isTenant}&&take=${take}${
    pageParam ? `&&lastCursor=${pageParam}` : ""
  }`;
  return request({
    url: url,
  });
};
export function getUsersFn() {
  return useInfiniteQuery({
    queryKey: [USERS],
    queryFn: ({ pageParam }) => {
      if (pageParam === null) return;
      return getUsers({ pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      return lastPage.data.meta.nextId ?? false;
    },
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
    queryKey: [USERS, userId],
    queryFn: () => getUserById(userId),
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
