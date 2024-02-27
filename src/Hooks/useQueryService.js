import { useQuery } from "@tanstack/react-query";

const DataFormatter = (res) => {
  return /* res.data?.data ||  */ res.data || res;
};

/** @param {{key:string, fetcher:import("@tanstack/react-query").QueryFunction} & Omit<import("@tanstack/react-query").UseQueryOptions,"queryKey"|"queryFn">} */
const useQueryService = ({ key, fetcher, ...options }) => {
  const formattedKey = Array.isArray(key) ? key : [key];
  const {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
    isStale,
    refetch,
    remove,
    status,
    fetchStatus,
  } = useQuery({
    queryKey: formattedKey,
    queryFn: fetcher,
    select: DataFormatter,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
    isStale,
    refetch,
    remove,
    status,
    fetchStatus,
  };
};

export default useQueryService;
