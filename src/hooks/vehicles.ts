import { useState } from "react";
import { queryClient } from "../config/queryClient";
import { useQuery, QueryKey } from "react-query";
import { Vehicle, getAllVehicles } from "../services/apiQuery";

export { Vehicle };

export const refetchAllVehicles = (pageNumber: number) => {
  return queryClient.fetchQuery<Vehicle[]>(
    ["get_Vehicles"],
    getAllVehicles,
    {}
  );
};

export const useGetAllVehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { isFetching, isError, isLoading } = useQuery<Vehicle[]>(
    ["get_Vehicles"] as QueryKey | string[],
    getAllVehicles,
    {
      onSuccess: (data) => {
        setVehicles(data);
      }
    }
  );

  return {
    vehicles,
    isFetching,
    isError,
    setVehicles,
    isLoading
  };
};
