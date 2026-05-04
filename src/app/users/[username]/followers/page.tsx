"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import FollowButton from "@/components/FollowButton";
import Link from "next/link";

export default function FollowersPage() {
  const params = useParams();
  const router = useRouter();

  const username = params.username as string;
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) setMe(JSON.parse(user));
    } catch {}
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["followers", username],
    queryFn: async () => {
      const res = await axiosInstance.get(`/api/users/${username}/followers`);
      return res.data;
    },
    enabled: !!username,
  });

  const followers = data?.data?.users ?? [];

  return (
    <div className="text-white min-h-screen pb-24">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800 sticky top-0 bg-black z-10">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>

        <h1 className="font-semibold text-lg">Followers</h1>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="p-4 space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-zinc-800" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-3 bg-zinc-800 rounded" />
                <div className="w-20 h-2 bg-zinc-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* LIST */}
      {!isLoading && (
        <div className="divide-y divide-zinc-800">

          {followers.length === 0 && (
            <div className="text-center py-16 text-gray-500 text-sm">
              No followers yet
            </div>
          )}

          {followers.map((u: any) => (
            <div
              key={u.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-zinc-900 transition"
            >

              {/* LEFT */}
              <Link
                href={`/users/${u.username}`}
                className="flex items-center gap-3 flex-1"
              >
                <img
                  src={u.avatarUrl || "/avatar.png"}
                  onError={(e) => (e.currentTarget.src = "/avatar.png")}
                  className="w-10 h-10 rounded-full object-cover bg-zinc-800"
                />

                <div>
                  <p className="text-sm font-semibold">{u.username}</p>
                  <p className="text-xs text-gray-400">{u.name}</p>

                  {u.isFollowingMe && (
                    <p className="text-[10px] text-gray-500">
                      Follows you
                    </p>
                  )}
                </div>
              </Link>

              {/* RIGHT */}
              {me?.username !== u.username && (
                <FollowButton
                  username={u.username}
                  initialFollowed={u.isFollowedByMe}
                />
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}