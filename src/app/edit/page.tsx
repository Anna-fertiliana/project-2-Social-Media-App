"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
    avatarUrl: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const getAvatarUrl = (url: string) => {
    if (!url) return "/avatar-placeholder.png";
    if (url.startsWith("http") || url.startsWith("blob")) return url;
    return `${API_URL}${url}`;
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        const user = data.data?.user || data.data;

        setForm({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          bio: user.bio || "",
          avatarUrl: user.avatarUrl || "",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAvatarChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarFile(file);

    const preview = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      avatarUrl: preview,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);

      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("username", form.username);
      formData.append("bio", form.bio);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      const res = await fetch(`${API_URL}/api/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      const updatedUser = data.data?.user || data.data;
      localStorage.setItem("user", JSON.stringify(updatedUser));

      router.replace("/profile?updated=true");
      router.refresh();

    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center py-10">Loading...</div>;
  }

  return (
    <main className="max-w-3xl mx-auto text-white px-4 pb-24">

      {/* HEADER */}
      <div className="flex items-center gap-3 py-5">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>

      {/* ✅ MOBILE FIRST: column */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">

        {/* AVATAR */}
        <div className="flex flex-col items-center md:w-40">

          <img
            src={getAvatarUrl(form.avatarUrl)}
            onError={(e) =>
              (e.currentTarget.src = "/avatar-placeholder.png")
            }
            className="w-24 h-24 rounded-full object-cover border border-zinc-700"
          />

          <label className="mt-4 px-4 py-1.5 text-xs border border-zinc-700 rounded-full cursor-pointer hover:bg-zinc-800 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </label>

        </div>

        {/* FORM */}
        <div className="flex-1 space-y-5">

          {[
            { label: "Name", name: "name" },
            { label: "Username", name: "username" },
            { label: "Email", name: "email" },
            { label: "Number Phone", name: "phone" },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-xs text-zinc-400">
                {field.label}
              </label>

              <input
                name={field.name}
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
          ))}

          <div>
            <label className="text-xs text-zinc-400">Bio</label>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 font-medium hover:opacity-90 transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </div>

      </div>
    </main>
  );
}