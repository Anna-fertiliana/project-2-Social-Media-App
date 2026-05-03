"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Share2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
  }, []);

  useEffect(() => {
    if (searchParams.get("updated") === "true") {
      setShowToast(true);
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setUser(data.data.profile);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/me/posts`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setPosts(data.data?.items || data.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPosts(false);
    }
  };

  if (loadingProfile) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-white text-center py-10">Failed</div>;
  }

  return (
    <main className="text-white pb-24">

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-green-600 px-4 py-2 rounded-lg text-sm z-50">
          Profile updated
        </div>
      )}

      {/* HEADER */}
      <div className="px-4 pt-6">

        {/* MOBILE STACK */}
        <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-start sm:gap-6">

          {/* AVATAR */}
          <img
            src={user.avatarUrl || "/avatar-placeholder.png"}
            onError={(e) =>
              (e.currentTarget.src = "/avatar-placeholder.png")
            }
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-zinc-700"
          />

          {/* INFO */}
          <div className="mt-4 sm:mt-0">

            <h1 className="font-semibold text-lg">
              {user.username}
            </h1>

            <p className="text-sm text-gray-400">
              {user.name}
            </p>

            <p className="text-sm text-gray-300 mt-1 max-w-xs">
              {user.bio || "No bio yet"}
            </p>

            {/* BUTTONS */}
            <div className="flex gap-2 justify-center sm:justify-start mt-3">

              <Link href="/me/edit">
                <button className="px-4 py-1.5 text-sm border border-zinc-700 rounded-full hover:bg-zinc-800">
                  Edit Profile
                </button>
              </Link>

              <button
                onClick={() =>
                  navigator.share?.({
                    title: "My Profile",
                    url: window.location.href,
                  })
                }
                className="p-2 border border-zinc-700 rounded-full hover:bg-zinc-800"
              >
                <Share2 size={18} />
              </button>

            </div>

          </div>
        </div>

      </div>

      {/* STATS */}
      <div className="flex justify-around text-center border-y border-zinc-800 mt-6 py-3">

        <div>
          <p className="font-semibold">
            {stats?.posts ?? posts.length}
          </p>
          <p className="text-xs text-gray-400">Posts</p>
        </div>

        <div>
          <p className="font-semibold">
            {stats?.followers ?? 0}
          </p>
          <p className="text-xs text-gray-400">Followers</p>
        </div>

        <div>
          <p className="font-semibold">
            {stats?.following ?? 0}
          </p>
          <p className="text-xs text-gray-400">Following</p>
        </div>

      </div>

      {/* TABS */}
      <div className="flex justify-center gap-10 text-sm border-b border-zinc-800 py-3">
        <button className="border-b-2 border-white pb-1">
          Gallery
        </button>
        <button className="text-gray-400">Saved</button>
      </div>

      {/* POSTS */}
      <div className="mt-1">

        {loadingPosts && (
          <p className="text-center text-gray-400 py-10">
            Loading...
          </p>
        )}

        {!loadingPosts && posts.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No posts
          </p>
        )}

        {!loadingPosts && posts.length > 0 && (
          <div className="grid grid-cols-3 gap-[2px]">

            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <img
                  src={post.imageUrl}
                  className="aspect-square object-cover"
                />
              </Link>
            ))}

          </div>
        )}

      </div>

    </main>
  );
}