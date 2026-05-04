"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bookmark, Send } from "lucide-react";

export const dynamic = "force-dynamic"; // 🔥 biar aman dari prerender error

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"gallery" | "saved">("gallery");

  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);

  // 🔥 HELPER (biar ga ulang2)
  const getToken = () => localStorage.getItem("token");

  const fetcher = async (url: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}${url}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Fetch error");

    return data;
  };

  // 🔹 FETCH ALL
  useEffect(() => {
    const load = async () => {
      try {
        const [profile, myPosts, saved] = await Promise.all([
          fetcher("/api/me"),
          fetcher("/api/me/posts"),
          fetcher("/api/me/saved"),
        ]);

        setUser(profile.data.profile);
        setStats(profile.data.stats);
        setPosts(myPosts.data?.items || []);
        setSavedPosts(saved.data?.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingPosts(false);
      }
    };

    load();
  }, []);

  // 🔹 TOAST
  useEffect(() => {
    if (searchParams.get("updated") === "true") {
      setShowToast(true);
      const t = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  // 🔹 SHARE
  const handleShare = async () => {
    const url = `${window.location.origin}/users/${user.username}`;

    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      }
    } catch {
      alert("Failed to share");
    }
  };

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  if (!user) {
    return <div className="text-white text-center py-10">Failed to load profile</div>;
  }

  const currentPosts = activeTab === "gallery" ? posts : savedPosts;

  return (
    <main className="text-white pb-24">

      {/* TOAST */}
      {showToast && (
        <div className="fixed top-20 right-4 bg-green-600 px-4 py-2 rounded-lg text-sm z-50">
          Profile updated
        </div>
      )}

      <div className="max-w-2xl mx-auto">

        {/* HEADER */}
        <div className="px-4 pt-6">
          <div className="flex items-start justify-between">

            {/* LEFT */}
            <div className="flex items-center gap-4">
              <img
                src={user.avatarUrl || "/avatar-placeholder.png"}
                className="w-14 h-14 rounded-full object-cover border border-zinc-700"
              />

              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-gray-400">@{user.username}</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-2">
              <Link href="/me/edit">
                <button className="px-3 py-1 text-xs rounded-full border border-zinc-700 hover:bg-zinc-800">
                  Edit Profile
                </button>
              </Link>

              <button
                onClick={handleShare}
                className="text-zinc-400 hover:text-white transition"
              >
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* BIO */}
          <p className="text-xs text-gray-300 mt-3 max-w-lg">
            {user.bio || "No bio yet"}
          </p>
        </div>

        {/* STATS */}
        <div className="mt-6 flex justify-between text-center px-4">

          <div className="flex-1">
            <p className="font-semibold text-sm">{stats?.posts ?? posts.length}</p>
            <p className="text-xs text-gray-400">Post</p>
          </div>

          <div className="w-px bg-zinc-800" />

          <div className="flex-1">
            <p className="font-semibold text-sm">{stats?.followers ?? 0}</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>

          <div className="w-px bg-zinc-800" />

          <div className="flex-1">
            <p className="font-semibold text-sm">{stats?.following ?? 0}</p>
            <p className="text-xs text-gray-400">Following</p>
          </div>

          <div className="w-px bg-zinc-800" />

          <div className="flex-1">
            <p className="font-semibold text-sm">{stats?.likes ?? 0}</p>
            <p className="text-xs text-gray-400">Likes</p>
          </div>

        </div>

        {/* TABS */}
        <div className="mt-6 border-b border-zinc-800 flex justify-center gap-12 text-xs">

          <button
            onClick={() => setActiveTab("gallery")}
            className={`pb-3 flex items-center gap-2 ${
              activeTab === "gallery"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"
            }`}
          >
            ▦ Gallery
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 flex items-center gap-2 ${
              activeTab === "saved"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"
            }`}
          >
            <Bookmark size={14} /> Saved
          </button>

        </div>

        {/* POSTS */}
        <div className="mt-2">

          {loadingPosts && (
            <p className="text-center text-gray-400 py-10">Loading...</p>
          )}

          {!loadingPosts && currentPosts.length === 0 && (
            <p className="text-center text-gray-400 py-10">
              {activeTab === "gallery" ? "No posts" : "No saved posts"}
            </p>
          )}

          {!loadingPosts && currentPosts.length > 0 && (
            <div className="grid grid-cols-3 gap-[2px]">
              {currentPosts.map((post) => (
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

      </div>

    </main>
  );
}