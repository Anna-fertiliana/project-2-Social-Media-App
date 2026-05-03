"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Heart, MessageCircle, Bookmark, X, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(true);
  const [showEmoji, setShowEmoji] = useState(false);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchComments();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`
      );
      const data = await res.json();
      if (res.ok) setPost(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comments`
      );
      const data = await res.json();

      let list: any[] = [];
      if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.data?.comments)) list = data.data.comments;
      else if (Array.isArray(data.comments)) list = data.comments;

      setComments(list);
    } catch (error) {
      console.error(error);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleAddComment = async (e: any) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: commentText }),
        }
      );

      if (res.ok) {
        setCommentText("");
        fetchComments();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50">

      {/* CONTAINER */}
      <div
        className="
          w-full h-full flex flex-col
          md:items-center md:justify-center
        "
      >

        {/* MODAL */}
        <div
          className="
            bg-zinc-900 w-full h-full flex flex-col
            md:w-[900px] md:h-[600px] md:grid md:grid-cols-2 md:rounded-xl md:overflow-hidden
          "
        >

          {/* CLOSE */}
          <button
            onClick={() => router.back()}
            className="absolute top-4 right-4 text-white z-10"
          >
            <X size={22} />
          </button>

          {/* IMAGE */}
          <div className="bg-black h-[300px] md:h-full">
            <img
              src={post.imageUrl}
              className="w-full h-full object-cover"
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col h-full">

            {/* HEADER */}
            <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
              <img
                src={post.author?.avatarUrl || "/avatar.png"}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white font-semibold">
                {post.author?.username}
              </span>
            </div>

            {/* CAPTION */}
            <div className="p-4 border-b border-zinc-800 text-sm text-gray-300">
              <span className="font-semibold text-white mr-2">
                {post.author?.username}
              </span>
              {post.caption}
            </div>

            {/* COMMENTS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <img
                    src={c.user?.avatarUrl || "/avatar.png"}
                    className="w-7 h-7 rounded-full"
                  />
                  <p className="text-sm">
                    <span className="font-semibold text-white mr-1">
                      {c.user?.username}
                    </span>
                    <span className="text-gray-300">
                      {c.content}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* ACTION */}
            <div className="border-t border-zinc-800 p-4 space-y-3">

              <div className="flex justify-between">
                <div className="flex gap-4 text-white">
                  <Heart size={22} />
                  <MessageCircle size={22} />
                  <Smile
                    size={22}
                    onClick={() => setShowEmoji(!showEmoji)}
                  />
                </div>
                <Bookmark size={22} />
              </div>

              <p className="text-sm text-gray-400">
                ❤️ {post.likesCount || 0} likes
              </p>

              {showEmoji && (
                <div className="absolute bottom-24 right-4">
                  <EmojiPicker
                    onEmojiClick={(e) =>
                      setCommentText(commentText + e.emoji)
                    }
                  />
                </div>
              )}

              <form
                onSubmit={handleAddComment}
                className="flex gap-2"
              >
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add comment..."
                  className="flex-1 bg-zinc-800 px-3 py-2 rounded-md text-sm outline-none"
                />

                <button className="text-blue-500 font-semibold text-sm">
                  Post
                </button>
              </form>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}