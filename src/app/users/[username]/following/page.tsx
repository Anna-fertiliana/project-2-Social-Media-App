"use client";

import { useParams } from "next/navigation";
import FollowListPage from "@/components/FollowListPage";

export default function Page() {
  const params = useParams();
  const username = params.username as string;

  return (
    <FollowListPage
      username={username}
      type="following"
    />
  );
}