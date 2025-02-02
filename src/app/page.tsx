// app/page.tsx
"use client";
import React from "react";
import MasonryGrid from "./components/MasonryGrid";
import Header from "./components/Header";

export default function Home() {
  return (
    <div className="overflow-y-auto scrollbar-hide">
      <Header title="Gaussian.Gallery" subtitle={null} />
      <div className="mx-auto max-w-7xl min-h-screen">
        <MasonryGrid />
      </div>
    </div>
  );
}
