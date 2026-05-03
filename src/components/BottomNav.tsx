"use client";

import Link from "next/link";
import { Home, User, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">

      <div className="
        flex items-center justify-between
        bg-zinc-900/80 backdrop-blur-xl
        border border-zinc-800
        rounded-full
        px-8 py-3
        shadow-[0_8px_30px_rgba(0,0,0,0.6)]
      ">

        {/* HOME */}
        <Link
          href="/feed"
          className={`flex flex-col items-center text-[11px] ${
            isActive("/feed") ? "text-purple-500" : "text-zinc-400"
          }`}
        >
          <Home size={20} />
          <span className="mt-1">Home</span>
        </Link>

        {/* CREATE */}
        <Link
          href="/create"
          className="
            w-12 h-12
            rounded-full
            bg-gradient-to-br from-purple-600 to-indigo-600
            flex items-center justify-center
            shadow-md
            active:scale-95 transition
          "
        >
          <Plus size={22} className="text-white" />
        </Link>

        {/* PROFILE */}
        <Link
          href="/profile"
          className={`flex flex-col items-center text-[11px] ${
            isActive("/profile") ? "text-purple-500" : "text-zinc-400"
          }`}
        >
          <User size={20} />
          <span className="mt-1">Profile</span>
        </Link>

      </div>
    </div>
  );
}