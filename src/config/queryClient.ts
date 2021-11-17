import { QueryClient } from "react-query";

const queryClientSettings = {
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      cacheTime: 7.776e9 /* @HINT: 90 days */,
      refetchInterval: 10000000,
      refetchIntervalInBackground: true,
      suspense: false,
      staleTime: 30000
    },
    mutations: {
      retry: 2
    }
  }
};

export const queryClient = new QueryClient(queryClientSettings);
