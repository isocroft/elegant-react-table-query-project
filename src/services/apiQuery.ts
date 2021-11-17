import config from "../config";
import axios, { AxiosResponse } from "axios";
import { QueryKey } from "react-query";

export interface Vehicle {
  colors?: Array<string>;
  range: { unit: string; distance: string };
  price: string;
  photo: string;
  model: string;
  make: string;
  id: string;
}

export const getAllVehicles = async (param: {
  pageParam?: number;
  queryKey?: QueryKey | string[];
}): Promise<Vehicle[]> => {
  try {
    const response: AxiosResponse<Vehicle[]> = await axios({
      method: "get",
      url: config.mock.url
    });
    return Promise.resolve(response.data);
  } catch (error) {
    return Promise.reject(error);
  }
};
