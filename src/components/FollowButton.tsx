"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

type Props = {
  username: string;
  initialFollowed: boolean;
};

export default function FollowButton({
  username,
  initialFollowed,
}: Props) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const user = queryClient.getQueryData<any>([
        "user",
        username,
      ])?.data;

      if (user?.isFollowedByMe) {
        return axiosInstance.delete(`/api/follow/${username}`);
      } else {
        return axiosInstance.post(`/api/follow/${username}`);
      }
    },

    // ================= OPTIMISTIC UPDATE
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["user", username],
      });

      const previous = queryClient.getQueryData([
        "user",
        username,
      ]);

      queryClient.setQueryData(["user", username], (old: any) => {
        if (!old) return old;

        const current = old.data;

        return {
          ...old,
          data: {
            ...current,
            isFollowedByMe: !current.isFollowedByMe,
            followersCount: current.isFollowedByMe
              ? (current.followersCount || 1) - 1
              : (current.followersCount || 0) + 1,
          },
        };
      });

      return { previous };
    },

    // ================= ROLLBACK
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["user", username],
          context.previous
        );
      }
    },

    // ================= SYNC
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", username],
      });
    },
  });

  const user = queryClient.getQueryData<any>([
    "user",
    username,
  ])?.data;

  const isFollowed = user?.isFollowedByMe ?? initialFollowed;

  return (
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className={`
        px-4 py-1.5 rounded-full text-sm font-medium transition
        ${
          isFollowed
            ? "bg-zinc-800 border border-zinc-700 text-white"
            : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
        }
        ${mutation.isPending && "opacity-50"}
      `}
    >
      {mutation.isPending
        ? "Loading..."
        : isFollowed
        ? "Following"
        : "Follow"}
    </button>
  );
}