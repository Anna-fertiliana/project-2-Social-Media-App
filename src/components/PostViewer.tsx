"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import {
  MessageCircle,
  Send,
  Bookmark,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import LikeButton from "@/components/LikeButton";

type Props = {
  postId: string;
  onClose?: () => void;
  variant?: "modal" | "page";
};

export default function PostViewer({
  postId,
  onClose,
  variant = "modal",
}: Props) {
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  // lock scroll
  useEffect(() => {
  if (variant !== "modal") return;

  const original = document.body.style.overflow;

  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = original;
  };
}, [variant]);

  // ================= FETCH
  const { data, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/posts/${postId}`);
      return res.data;
    },
  });

  const post = data?.data;

  // ================= COMMENT
  const commentMutation = useMutation({
    mutationFn: async () => {
      return axiosInstance.post(`/api/posts/${postId}/comments`, {
        content: commentText,
      });
    },
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  if (isLoading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
  }

  if (!post) return null;

  const content = (
    <div className="
      w-full h-full
      md:w-[900px] md:h-[600px]
      bg-zinc-900 rounded-none md:rounded-2xl
      overflow-hidden
      flex flex-col md:flex-row
    ">

      {/* IMAGE */}
      <div className="w-full md:w-1/2 bg-black">
        <img
          src={post.imageUrl || "/placeholder.png"}
          className="w-full h-[300px] md:h-full object-cover"
        />
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <img
              src={post.author?.avatarUrl || "/avatar.png"}
              className="w-8 h-8 rounded-full"
            />
            <span className="text-white text-sm font-semibold">
              {post.author?.username}
            </span>
          </div>

          {variant === "modal" && (
            <button onClick={onClose}>
              <X className="text-zinc-400 hover:text-white" />
            </button>
          )}
        </div>

        {/* CAPTION */}
        <div className="px-4 py-3 text-sm text-gray-300 border-b border-zinc-800">
          <span className="font-semibold text-white mr-2">
            {post.author?.username}
          </span>
          {post.caption}
        </div>

        {/* COMMENTS */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 text-sm">
          {post.comments?.length === 0 ? (
            <p className="text-gray-500 text-center">No comments yet</p>
          ) : (
            post.comments?.map((c: any) => (
              <div key={c.id} className="flex gap-3">
                <img
                  src={c.user?.avatarUrl || "/avatar.png"}
                  className="w-7 h-7 rounded-full"
                />
                <p className="text-gray-300">
                  <span className="font-semibold text-white mr-2">
                    {c.user?.username}
                  </span>
                  {c.content}
                </p>
              </div>
            ))
          )}
        </div>

        {/* ACTION */}
        <div className="border-t border-zinc-800 px-4 py-3 space-y-2">

          {/* ICONS */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">

              <LikeButton
                postId={postId}
                initialLiked={post.likedByMe}
                initialCount={post.likeCount}
              />

              <div className="flex items-center gap-1 text-zinc-400">
                <MessageCircle size={20} />
                <span className="text-xs text-white">
                  {post.commentCount}
                </span>
              </div>

              <button
                className="text-zinc-400 hover:text-white"
                onClick={() => {
                  const url = `${window.location.origin}/posts/${postId}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                <Send size={20} />
              </button>
            </div>

            <Bookmark className="text-zinc-400 hover:text-white" size={20} />
          </div>

          {/* INPUT */}
          <div className="flex items-center gap-2 border-t border-zinc-800 pt-3">
            <button className="text-zinc-400">😊</button>

            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent outline-none text-sm text-white"
              onKeyDown={(e) =>
                e.key === "Enter" && commentMutation.mutate()
              }
            />

            <button
              onClick={() => commentMutation.mutate()}
              disabled={!commentText.trim()}
              className="text-blue-500 text-sm font-medium disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ================= MODAL
  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-[9999]">
        <div
          className="absolute inset-0 bg-black/80"
          onClick={onClose}
        />

        <div className="relative h-full flex items-center justify-center">
          {content}
        </div>
      </div>
    );
  }

  return <div className="flex justify-center">{content}</div>;
}