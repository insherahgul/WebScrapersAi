// src/hooks/useAuth.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<User, Error>(
    {
      queryKey: ["auth", "me"],
      queryFn: async () => {
        const res = await api.get("/auth/me");
        return res.data.user;
      },
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    }
  );

  function invalidate() {
    // ✅ Type-safe invalidation
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
  }

  return {
    user: data,
    isLoading,
    error,
    refetch,
    invalidate,
  };
}
