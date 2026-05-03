"use client";

import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { X } from "lucide-react";
import { axiosInstance } from "@/lib/axios";

interface Props {
  postId: string;
  onClose: () => void;
}

export default function CommentMobile({ postId, onClose }: Props) {
  const queryClient = useQueryClient();
  const [text, setText] = useState("");

  // ✅ FETCH COMMENTS
  const { data, isLoading } = useQuery({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/posts/${postId}/comments`);
      return res.data;
    },
  });

  const comments = data?.data?.comments || [];

  // ✅ MUTATION (OPTIMISTIC)
  const mutation = useMutation({
    mutationFn: async (content: string) => {
      return axiosInstance.post(`/api/posts/${postId}/comments`, {
        content,
      });
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["comments", postId] });

      const previous = queryClient.getQueryData<any>([
        "comments",
        postId,
      ]);

      const fakeComment = {
        id: Date.now(),
        content,
        user: {
          username: "You",
          avatarUrl: "/avatar.png",
        },
      };

      queryClient.setQueryData(["comments", postId], (old: any) => {
        const oldComments = old?.data?.comments || [];
        return {
          ...old,
          data: {
            ...old?.data,
            comments: [...oldComments, fakeComment],
          },
        };
      });

      setText("");

      return { previous };
    },

    // ❌ rollback
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ["comments", postId],
          context.previous
        );
      }
    },

    // 🔄 sync ulang
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  const handlePost = () => {
    if (!text.trim()) return;
    mutation.mutate(text);
  };

  return (
    <div className="w-full h-full flex items-end">

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 25 }}
        className="w-full h-[88%] bg-zinc-900 rounded-t-2xl flex flex-col"
      >

        {/* HANDLE */}
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto my-3" />

        {/* HEADER */}
        <div className="flex justify-between items-center px-4 pb-3">
          <h2 className="text-white text-sm font-semibold">
            Comments
          </h2>
          <button onClick={onClose}>
            <X className="text-zinc-400" />
          </button>
        </div>

        {/* COMMENTS */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
          {isLoading ? (
            <p className="text-gray-400 text-center text-sm">
              Loading...
            </p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-center text-sm">
              No comments yet
            </p>
          ) : (
            comments.map((c: any) => (
              <div key={c.id} className="flex gap-3">

                <img
                  src={c.user?.avatarUrl || "/avatar.png"} // ✅ FIXED
                  className="w-8 h-8 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm text-white font-medium">
                    {c.user?.username}
                  </p>

                  <p className="text-sm text-gray-300">
                    {c.content}
                  </p>

                  <span className="text-xs text-gray-500">
                    just now
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* INPUT */}
        <div className="border-t border-zinc-800 px-4 py-3 flex items-center gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-zinc-800 text-white text-sm px-4 py-2 rounded-full outline-none"
          />

          <button
            onClick={handlePost}
            disabled={!text.trim() || mutation.isPending}
            className="text-blue-500 text-sm font-medium disabled:opacity-40"
          >
            Post
          </button>
        </div>

      </motion.div>
    </div>
  );
}