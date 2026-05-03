"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreatePostPage() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImage = (file: File) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!image) return alert("Please upload an image");

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", image);
      formData.append("caption", caption);

      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => router.push("/feed"), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">

      {/* SUCCESS */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-600 px-4 py-2 rounded-lg text-sm shadow-lg">
            Success Post
          </div>
        </div>
      )}

      {/* CONTAINER */}
      <div className="
        w-full 
        max-w-md 
        mx-auto 
        px-4 
        pt-4 
        pb-28
        md:max-w-2xl
      ">

        {/* HEADER */}
        <div className="
          flex items-center gap-3 mb-5
          sticky top-0 bg-black z-10 py-2
        ">
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Add Post</h1>
        </div>

        {/* PHOTO */}
        <p className="text-sm text-gray-400 mb-2">Photo</p>

        <div className="mb-6">
          {preview ? (
            <img
              src={preview}
              className="
                w-full 
                h-52 
                md:h-72 
                object-cover 
                rounded-xl
              "
            />
          ) : (
            <label className="
              flex flex-col items-center justify-center 
              h-52 md:h-72
              border border-dashed border-zinc-700 
              rounded-xl cursor-pointer text-center px-4
            ">
              <span className="text-blue-500 text-sm">
                Click to upload
              </span>

              <span className="text-xs text-gray-500 mt-1">
                or drag and drop
              </span>

              <span className="text-xs text-gray-600 mt-2">
                PNG or JPG (max 5mb)
              </span>

              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImage(e.target.files[0])
                }
              />
            </label>
          )}
        </div>

        {/* CAPTION */}
        <p className="text-sm text-gray-400 mb-2">Caption</p>

        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Write your caption..."
          className="
            w-full 
            bg-zinc-900 
            border border-zinc-800 
            rounded-xl 
            p-3 
            text-sm 
            mb-6 
            outline-none 
            focus:border-purple-500
            min-h-[100px]
          "
        />

      </div>

      {/* FLOATING BUTTON (IG STYLE) */}
      <div className="
        fixed bottom-0 left-0 right-0 
        bg-black border-t border-zinc-800
        p-4
      ">
        <div className="max-w-md mx-auto md:max-w-2xl">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
              w-full py-3 rounded-xl font-semibold
              bg-gradient-to-r from-purple-600 to-purple-500
              disabled:opacity-50
            "
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </div>
      </div>

    </main>
  );
}