"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
          Leadlift
        </h1>
        <p className="text-zinc-300 text-lg md:text-xl">
          Your AI-powered client finder 🔍. Discover leads with ease.
        </p>

        <Link href="/search">
          <div className="relative inline-block group cursor-pointer">
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-500 animate-gradient-x" />
            <span className="relative inline-block px-6 py-3 text-lg font-semibold text-white bg-zinc-900 rounded-lg border border-white/10 backdrop-blur-md hover:bg-zinc-800 transition-colors">
              Start Searching
            </span>
          </div>
        </Link>
      </div>
    </main>
  );
}