"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import PostCard from "./PostCard";
import { useState } from "react";
import PostViewer from "./PostViewer";

export default function Feed() {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["feed"],
    queryFn: async () => {
      const res = await axiosInstance.get("/api/posts");
      return res.data;
    },
  });

  const posts = data?.data?.posts || [];

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 mt-10">
        Loading feed...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-400 mt-10">
        Failed to load feed
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10">
        No posts available
      </div>
    );
  }

  return (
    <>
      <section className="flex justify-center px-4 mt-6">
        <div className="w-full max-w-xl space-y-6">
          {posts.map((post: any) => (
            <PostCard
              key={post.id}
              postId={post.id}
              image={post.imageUrl}
              caption={post.caption}
              username={post.author?.username}
              avatar={post.author?.avatarUrl}
              likes={post.likeCount}
              comments={post.commentCount}
              isLiked={post.likedByMe}
              onOpen={() => setSelectedPostId(post.id)} // 🔥
            />
          ))}
        </div>
      </section>

      {/*  MODAL */}
      {selectedPostId && (
        <PostViewer
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </>
  );
}