import { QueryClient } from "@tanstack/react-query";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes cache
        gcTime: 10 * 60 * 1000,   // 10 minutes garbage collection
        refetchOnWindowFocus: false, // Prevent disruptive flashes during active chat
        retry: (failureCount, error) => {
          // Do not retry on 401 or 403
          const status = (error as { response?: { status?: number } })?.response?.status;
          if (status === 401 || status === 403) return false;
          return failureCount < 1;
        },
      },
      mutations: {
        retry: false,
      },
    },
  });
}
