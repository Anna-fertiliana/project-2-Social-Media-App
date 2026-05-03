"use client";

import { Bookmark } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

type Props = {
  postId: string;
  initialSaved?: boolean;
};

export default function SaveButton({
  postId,
  initialSaved = false,
}: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      if (saved) {
        return axiosInstance.delete(`/api/posts/${postId}/save`);
      } else {
        return axiosInstance.post(`/api/posts/${postId}/save`);
      }
    },

    // ⚡ Optimistic UI
    onMutate: async () => {
      setSaved((prev) => !prev);
    },

    // ❌ rollback
    onError: () => {
      setSaved(initialSaved);
    },

    // 🔄 refresh
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["feed"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
    },
  });

  return (
    <button
      onClick={() => mutation.mutate()}
      className="text-zinc-400 hover:text-white transition"
    >
      <Bookmark
        size={20}
        className={saved ? "fill-white text-white" : ""}
      />
    </button>
  );
}