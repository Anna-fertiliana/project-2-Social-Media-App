"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { useParams } from "next/navigation";
import { Heart, Send } from "lucide-react";

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;

  const { data: userData } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/users/${username}`);
      return res.data;
    },
    enabled: !!username,
  });

  const { data: postData } = useQuery({
    queryKey: ["user-posts", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/users/${username}/posts`);
      return res.data;
    },
    enabled: !!username,
  });

  const user = userData?.data;
  const posts = postData?.data?.posts || [];

  return (
    <div className="text-white pb-24">

      {/* HEADER */}
      <div className="px-4 pt-6">

        {/* MOBILE FIRST */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-6">

          {/* AVATAR */}
          <img
            src={user?.avatarUrl || "/avatar.png"}
            onError={(e) => (e.currentTarget.src = "/avatar.png")}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-zinc-700"
          />

          {/* INFO */}
          <div className="mt-4 sm:mt-0">

            <h2 className="text-lg font-semibold">
              {user?.name || user?.username}
            </h2>

            <p className="text-gray-400 text-sm">
              @{user?.username}
            </p>

            <p className="text-gray-300 text-sm mt-2 max-w-xs">
              {user?.bio || "No bio"}
            </p>

            {/* BUTTON */}
            <div className="flex justify-center sm:justify-start gap-2 mt-3">
              <button className="px-4 py-1.5 rounded-full border border-zinc-700 text-sm hover:bg-zinc-800">
                Following
              </button>

              <button className="w-9 h-9 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800">
                <Send size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="flex justify-around text-center border-y border-zinc-800 mt-6 py-3 text-sm">

        <div>
          <p className="font-semibold">{posts.length}</p>
          <p className="text-gray-400">Posts</p>
        </div>

        <div>
          <p className="font-semibold">100</p>
          <p className="text-gray-400">Followers</p>
        </div>

        <div>
          <p className="font-semibold">43</p>
          <p className="text-gray-400">Following</p>
        </div>

        <div className="hidden sm:block">
          <p className="font-semibold">567</p>
          <p className="text-gray-400">Likes</p>
        </div>

      </div>

      {/* TABS */}
      <div className="flex justify-center gap-10 border-b border-zinc-800 py-3 text-sm">
        <button className="border-b-2 border-white pb-1">
          Gallery
        </button>

        <button className="text-gray-400 flex items-center gap-1">
          <Heart size={14} /> Liked
        </button>
      </div>

      {/* GRID */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">
          No posts yet
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-[2px] mt-[2px]">

          {posts.map((post: any) => (
            <div key={post.id} className="relative group">

              <img
                src={post.imageUrl}
                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                className="aspect-square object-cover"
              />

              {/* DESKTOP HOVER */}
              <div className="hidden sm:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 items-center justify-center text-white text-sm">
                ❤️ {post.likeCount || 0}
              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}