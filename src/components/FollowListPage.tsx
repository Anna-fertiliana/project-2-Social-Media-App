"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import FollowButton from "@/components/FollowButton";

type Props = {
  username: string;
  type: "followers" | "following";
};

export default function FollowListPage({ username, type }: Props) {
  const router = useRouter();
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    try {
      const user = localStorage.getItem("user");
      if (user) setMe(JSON.parse(user));
    } catch {}
  }, []);

  // 🔥 endpoint dinamis
  const endpoint =
    type === "followers"
      ? `/api/users/${username}/followers`
      : `/api/users/${username}/following`;

  const { data, isLoading } = useQuery({
    queryKey: [type, username],
    queryFn: async () => {
      const res = await axiosInstance.get(endpoint);
      return res.data;
    },
    enabled: !!username,
  });

  const users = data?.data || [];

  if (isLoading) {
    return (
      <div className="text-white text-center py-20">
        Loading {type}...
      </div>
    );
  }

  return (
    <div className="text-white min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-zinc-800">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>

        <h1 className="font-semibold text-lg capitalize">
          {type}
        </h1>
      </div>

      {/* LIST */}
      <div className="divide-y divide-zinc-800">

        {users.length === 0 && (
          <p className="text-center text-gray-500 py-10">
            No {type} yet
          </p>
        )}

        {users.map((u: any) => (
          <div
            key={u.id}
            className="flex items-center justify-between px-4 py-3"
          >

            {/* LEFT */}
            <div
              onClick={() => router.push(`/users/${u.username}`)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src={u.avatarUrl || "/avatar.png"}
                onError={(e) =>
                  (e.currentTarget.src = "/avatar.png")
                }
                className="w-10 h-10 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-semibold">
                  {u.username}
                </p>
                <p className="text-xs text-gray-400">
                  {u.name}
                </p>
              </div>
            </div>

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

    </div>
  );
}