"use client";

import Navbar from "@/components/Navbar";
import Feed from "@/components/Feed";
import BottomNav from "@/components/BottomNav";

export default function FeedPage() {
  return (
    <div className="min-h-screen flex flex-col bg-black">

      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main
        className="
          flex-1 w-full 
          max-w-xl mx-auto 
          px-4 
          pb-28   /* ✅ space buat bottom nav (mobile default) */
          md:max-w-2xl md:pb-24 /* ✅ desktop adjustment */
        "
      >
        <Feed />
      </main>

      <BottomNav />

    </div>
  );
}