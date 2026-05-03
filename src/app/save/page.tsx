"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import Link from "next/link";

export default function SavedPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["saved-posts"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/me/saved");
      return res.data;
    },
  });

  const posts = data?.data || [];

  if (isLoading) {
    return (
      <div className="text-white text-center py-10">
        Loading saved posts...
      </div>
    );
  }

  return (
    <main className="text-white pb-24">

      {/* HEADER */}
      <div className="px-4 py-5 border-b border-zinc-800">
        <h1 className="text-lg font-semibold">
          Saved Posts
        </h1>
      </div>

      {/* EMPTY */}
      {posts.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No saved posts yet
        </p>
      )}

      {/* GRID */}
      {posts.length > 0 && (
        <div className="grid grid-cols-3 gap-[2px] mt-[2px]">

          {posts.map((post: any) => (
            <Link key={post.id} href={`/posts/${post.id}`}>
              <img
                src={post.imageUrl}
                onError={(e) =>
                  (e.currentTarget.src = "/placeholder.png")
                }
                className="aspect-square object-cover"
              />
            </Link>
          ))}

        </div>
      )}

    </main>
  );
}