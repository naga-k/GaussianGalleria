// app/page.tsx
"use client";
import React from "react";
import MasonryGrid from "./components/MasonryGrid";
import { useRouter } from "next/navigation";
import AuthContainer from "./(views)/admin/components/AuthContainer";

export default function Home() {
  const router = useRouter();
  return (
    <div className="overflow-y-auto scrollbar-hide">
      <header className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold text-center text-white 
                  hover:text-teal-400 
                  transition-colors duration-300 
                  shadow-lg 
                  transform hover:scale-105 
                  transition-transform duration-500"
          >
            Gaussian.Gallery
          </h1>
        </div>
        <AuthContainer fallback={null}>
          <div className="mt-4 flex flex-row justify-center">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="w-fit px-4 py-2 bg-teal-800 hover:bg-teal-600 font-bold rounded"
            >
              Admin
            </button>
          </div>
        </AuthContainer>
      </header>
      <div className="mx-auto max-w-7xl min-h-screen">
        <MasonryGrid />
      </div>
    </div>
  );
}
