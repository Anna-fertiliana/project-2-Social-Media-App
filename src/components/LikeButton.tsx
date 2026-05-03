"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

interface LikeButtonProps {
  postId: string;
  initialLiked?: boolean;
  initialCount?: number;
}

export default function LikeButton({
  postId,
  initialLiked = false,
  initialCount = 0,
}: LikeButtonProps) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://be-social-media-api-production.up.railway.app";

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  const mutation = useMutation({
    mutationFn: async (nextLiked: boolean) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      const res = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method: nextLiked ? "POST" : "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update like");
      }

      return res.json();
    },

    // ✅ OPTIMISTIC UPDATE (BENAR)
    onMutate: async (nextLiked) => {
      const prevLiked = liked;
      const prevCount = count;

      setLiked(nextLiked);
      setCount((prev) =>
        nextLiked ? prev + 1 : Math.max(0, prev - 1)
      );

      return { prevLiked, prevCount };
    },

    // ❌ ERROR → rollback
    onError: (_err, _vars, context) => {
      if (context) {
        setLiked(context.prevLiked);
        setCount(context.prevCount);
      }
    },
  });

  const handleLike = () => {
    if (mutation.isPending) return;

    const nextLiked = !liked;
    mutation.mutate(nextLiked);
  };

  return (
    <button
      onClick={handleLike}
      className="flex items-center gap-1 group"
    >
      {/* ICON */}
      <motion.div
        key={liked ? "liked" : "unliked"}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Heart
          size={20}
          className={`
            transition
            ${liked ? "text-red-500 fill-red-500" : "text-zinc-400"}
            group-hover:text-white
          `}
        />
      </motion.div>

      {/* COUNT */}
      <span className="text-sm text-zinc-300">
        {count}
      </span>
    </button>
  );
}