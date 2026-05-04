"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Share2, Bookmark, Send } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"gallery" | "saved">("gallery");

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const searchParams = useSearchParams();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchMyPosts();
    fetchSavedPosts();
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.data.profile);
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchMyPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me/posts`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setPosts(data.data?.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const fetchSavedPosts = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me/saved`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        setSavedPosts(data.data?.items || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/users/${user.username}`;

    try {
      await navigator.clipboard.writeText(profileUrl);
      alert("Profile link copied!");
    } catch {
      alert("Failed to copy link");
    }
  };

  if (loadingProfile) {
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

      {/* CONTAINER */}
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

            {/* RIGHT ACTION */}
            <div className="flex items-center gap-2">

              <Link href="/me/edit">
                <button className="px-3 py-1 text-xs rounded-full border border-zinc-700 hover:bg-zinc-800">
                  Edit Profile
                </button>
              </Link>

              {/* SHARE BUTTON (FIGMA STYLE) */}
              <button
                onClick={() => {
                const url = `${window.location.origin}/users/${user.username}`;

                if (navigator.share) {
                  navigator.share({ url });
                } else {
                  navigator.clipboard.writeText(url);
                  alert("Link copied!");
                }
              }}
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
            <span>▦</span>
            Gallery
          </button>

          <button
            onClick={() => setActiveTab("saved")}
            className={`pb-3 flex items-center gap-2 ${
              activeTab === "saved"
                ? "border-b-2 border-white text-white"
                : "text-gray-400"
            }`}
          >
            <Bookmark size={14} />
            Saved
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