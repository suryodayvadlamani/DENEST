import { request } from "@lib/axios_util";
import { useQuery } from "@tanstack/react-query";
export const getHostelsRentById = (hostelId) => {
  return request({
    url: `/api/manageHostel/rent/${hostelId}`,
  });
};

export function getHostelsRentByIdFn(hostelId) {
  return useQuery({
    queryKey: ["rent", hostelId],
    queryFn: () => getHostelsRentById(hostelId),
  });
}
