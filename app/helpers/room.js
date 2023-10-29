import { request } from "@lib/axios_util";

import { useToast } from "@UI/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GET_HOSTELS } from "@lib/Query_Keys";
export const getRoomsFn = (roomId) => {
  return request({
    url: `/api/manageRoom/${roomId}`,
  });
};

export const createRoom = (data) => {
  return request({
    url: `/api/manageRoom`,
    method: "post",
    data,
  });
};

export function createRoomFn(cancelRef) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation(createRoom, {
    onSuccess: () => {
      toast({
        title: "Room Added Successfully",
      });
      queryClient.invalidateQueries([GET_HOSTELS]);
      queryClient.invalidateQueries(["rooms"]);
      cancelRef.current.click();
    },
    onError: () => {
      toast({
        title: "Sorry Something went wrong",
      });
    },
  });
}
