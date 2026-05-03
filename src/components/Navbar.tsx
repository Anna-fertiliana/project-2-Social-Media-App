"use client";

import { FiSearch } from "react-icons/fi";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://be-social-media-api-production.up.railway.app";

  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);


  // GET USER

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);


  // CLOSE DROPDOWN (PROFILE)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  // 🔍 SEARCH 

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${API_URL}/api/users/search?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        const users =
           data?.data?.users || [];

        setResults(Array.isArray(users) ? users : []);

      } catch (err) {
        console.error("SEARCH ERROR:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);


  // LOGOUT

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="w-full border-b border-zinc-800 bg-black/70 backdrop-blur-md px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.svg" className="w-6 h-6" />
          <span className="text-white font-semibold text-lg">
            Sociality
          </span>
        </Link>

        {/* 🔍 SEARCH */}
        <div className="flex-1 max-w-md relative">

          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-zinc-900 border border-zinc-800 pl-10 pr-3 py-2 rounded-full text-sm text-white outline-none focus:ring-1 focus:ring-purple-500"
          />

          {/* RESULT */}
          {query && (
            <div className="absolute top-12 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg max-h-64 overflow-y-auto z-50">

              {loading && (
                <p className="text-xs text-gray-400 p-3">
                  Searching...
                </p>
              )}

              {!loading && results.length === 0 && (
                <p className="text-xs text-gray-400 p-3">
                  No users found
                </p>
              )}

              {results.map((u) => (
                <div
                  key={u.id}
                  onClick={() => {
                    router.push(`/users/${u.username}`);
                    setQuery("");
                    setResults([]);
                  }}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-zinc-800 cursor-pointer"
                >
                  <img
                    src={u.avatarUrl || "/avatar.png"}
                    onError={(e) =>
                      (e.currentTarget.src = "/avatar.png")
                    }
                    className="w-8 h-8 rounded-full object-cover"
                  />

                  <div>
                    <p className="text-sm text-white">
                      {u.username}
                    </p>
                    <p className="text-xs text-gray-400">
                      {u.name || "User"}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {user ? (
            <div className="relative" ref={dropdownRef}>

              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2"
              >
                <span className="hidden md:block text-sm text-zinc-300">
                  {user.username}
                </span>

                <img
                  src={user.avatarUrl || "/avatar.png"}
                  onError={(e) =>
                    (e.currentTarget.src = "/avatar.png")
                  }
                  className="w-9 h-9 rounded-full object-cover border border-zinc-700"
                />
              </button>

              {/* DROPDOWN */}
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg overflow-hidden">

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-zinc-800"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-zinc-800"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-zinc-300 hover:text-white"
            >
              Login
            </Link>
          )}

        </div>
      </div>
    </nav>
  );
}