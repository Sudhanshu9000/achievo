'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "../common/LoadingAnimation";

export default function Hero(){
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = () => {
    setIsLoading(true);
    router.push('/goals');
  };

  return (
    <div className="w-full">
      {isLoading && <LoadingAnimation />}
      
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-screen pt-24">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
          Turn Goals Into Games. 
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
          Set goals. Complete tasks. Level up your life. Win Every Day. AI-powered productivity game designed to keep you motivated, focused, and rewarded every step of the way.
          </p>
          <button 
            onClick={handleNavigation}
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors cursor-pointer"
          >
            Get Started Free →
          </button>
        </div>
      </section>
    </div>
  );
};
