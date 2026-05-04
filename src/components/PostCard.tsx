"use client";

import { MessageCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import LikeButton from "@/components/LikeButton";
import SaveButton from "@/components/SaveButton";
import { useRef } from "react";

type PostCardProps = {
  postId: string;
  image?: string;
  caption: string;
  username: string;
  avatar?: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
  isSaved?: boolean; // 🔥 tambahan
  onOpen?: () => void;
};

export default function PostCard({
  postId,
  image,
  caption,
  username,
  avatar,
  likes,
  comments,
  isLiked = false,
  isSaved = false,
  onOpen,
}: PostCardProps) {
  const router = useRouter();
  const lastTap = useRef(0);

  // 👉 ke profile
  const goToProfile = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/users/${username}`);
  };

  // 👉 DOUBLE TAP LIKE (trigger LikeButton)
  const likeRef = useRef<HTMLButtonElement | null>(null);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // trigger click ke LikeButton
      likeRef.current?.click();
    }

    lastTap.current = now;
  };

  return (
    <article className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2">
        <img
          onClick={goToProfile}
          src={avatar || "/avatar.png"}
          onError={(e) => (e.currentTarget.src = "/avatar.png")}
          className="w-9 h-9 rounded-full object-cover cursor-pointer"
        />

        <span
          onClick={goToProfile}
          className="text-white font-semibold text-sm cursor-pointer hover:underline"
        >
          {username}
        </span>
      </div>

      {/* IMAGE */}
      <div
        onClick={onOpen}
        onDoubleClick={handleDoubleTap}
        className="cursor-pointer"
      >
        <img
          src={image || "/placeholder.png"}
          onError={(e) => (e.currentTarget.src = "/placeholder.png")}
          className="w-full h-[320px] object-cover hover:opacity-95 transition"
        />
      </div>

      {/* CONTENT */}
      <div className="px-4 pb-4 pt-2 space-y-2">

        {/* ACTION */}
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* LIKE */}
            <div ref={likeRef as any}>
              <LikeButton
                postId={postId}
                initialLiked={isLiked}
                initialCount={likes}
              />
            </div>

            {/* COMMENT */}
            <button
              onClick={onOpen}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition"
            >
              <MessageCircle size={20} />
              <span className="text-xs">{comments}</span>
            </button>

            {/* SHARE */}
            <button
              onClick={() => {
                const url = `${window.location.origin}/posts/${postId}`;

                if (navigator.share) {
                  navigator.share({ url });
                } else {
                  navigator.clipboard.writeText(url);
                  alert("Link copied!");
                }
              }}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition"
            >
              <Send size={20} />
            </button>

          </div>

          {/* SAVE (API CONNECTED) */}
          <SaveButton
            postId={postId}
            initialSaved={isSaved}
          />

        </div>

        {/* CAPTION */}
        <p className="text-sm text-gray-300 leading-relaxed">
          <span
            onClick={goToProfile}
            className="font-semibold text-white mr-1 cursor-pointer hover:underline"
          >
            {username}
          </span>
          {caption}
        </p>

      </div>
    </article>
  );
}