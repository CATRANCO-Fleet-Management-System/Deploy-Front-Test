"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("http://192.168.254.112:3000/login");
    }, 3000);

    // Cleanup timer
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        {/* Logo */}
        <div className="-mt-20">
          <img
            src="/logo.png" // Replace with your logo file path
            alt="Logo"
            className="w-120 h-80 mx-auto"
          />
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center -mt-20 gap-4">
          <div className="w-12 h-12 rounded-full animate-spin border-y border-solid border-cyan-500 border-t-transparent shadow-md"></div>
          <div className="w-12 h-12 rounded-full animate-spin border-y-2 border-solid border-violet-500 border-t-transparent shadow-md"></div>
          <div className="w-12 h-12 rounded-full animate-spin border-y-4 border-solid border-pink-500 border-t-transparent shadow-md"></div>
          <div className="w-12 h-12 rounded-full animate-spin border-y-8 border-solid border-green-500 border-t-transparent shadow-md"></div>
        </div>
      </div>
    </div>
  );
}
