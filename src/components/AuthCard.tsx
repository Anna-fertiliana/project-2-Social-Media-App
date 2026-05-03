"use client";

import Link from "next/link";
import { useState } from "react";

interface AuthCardProps {
  title: string;
  buttonText: string;
  footerText: string;
  footerLink: string;
  footerLinkText: string;
}

export default function AuthCard({
  title,
  buttonText,
  footerText,
  footerLink,
  footerLinkText,
}: AuthCardProps) {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      window.location.href = "/feed";

    } catch (error) {
      alert("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">

      {/* CARD */}
      <div className="
        w-full 
        max-w-sm 
        rounded-2xl 
        border border-gray-800 
        bg-[#0B0F19]/80 
        backdrop-blur 
        p-5 
        sm:p-6 
        shadow-xl 
        text-white
      ">

        {/* HEADER */}
        <div className="text-center mb-6">

          <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/logo.svg" alt="logo" className="w-6 h-6 sm:w-7 sm:h-7" />
            <h1 className="text-base sm:text-lg font-semibold">Sociality</h1>
          </div>

          <h2 className="text-lg sm:text-xl font-bold">
            {title}
          </h2>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* EMAIL */}
          <div>
            <label className="text-xs sm:text-sm text-gray-300">
              Email
            </label>

            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              onChange={handleChange}
              className="
                w-full 
                mt-1 
                rounded-lg 
                bg-[#111827] 
                border border-gray-700 
                px-3 py-2.5 
                text-sm 
                outline-none 
                focus:border-purple-500
              "
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="text-xs sm:text-sm text-gray-300">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              onChange={handleChange}
              className="
                w-full 
                mt-1 
                rounded-lg 
                bg-[#111827] 
                border border-gray-700 
                px-3 py-2.5 
                text-sm 
                outline-none 
                focus:border-purple-500
              "
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full 
              py-2.5 
              rounded-lg 
              bg-gradient-to-r 
              from-purple-600 
              to-indigo-600 
              font-medium 
              active:scale-[0.98]
              hover:opacity-90 
              transition
              disabled:opacity-50
            "
          >
            {loading ? "Loading..." : buttonText}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-xs sm:text-sm mt-5 text-gray-400">
          {footerText}{" "}
          <Link
            href={footerLink}
            className="text-purple-400 hover:underline"
          >
            {footerLinkText}
          </Link>
        </p>

      </div>
    </div>
  );
}