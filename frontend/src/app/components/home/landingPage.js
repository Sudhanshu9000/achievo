'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import "remixicon/fonts/remixicon.css";
import LoadingAnimation from "../common/LoadingAnimation";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleNavigation = () => {
    setIsLoading(true);
    router.push('/goals');
  };

  return (
    <div className="w-full bg-white text-black">
      {isLoading && <LoadingAnimation />}
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <i className="ri-supabase-fill"></i>
          <a href="#" className="font-bold">
            Achievo
          </a>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleNavigation}
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Get Started Free →
          </button>
        </div>
      </nav>
    </div>
  );
}
