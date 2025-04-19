'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = ({ userLevel = 1, userPoints = 0 }) => {
  const router = useRouter();

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Product Name */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-black">Achievo</span>
            </Link>
          </div>

          {/* Right side - Level and GP */}
          <div className="flex items-center gap-6">
            {/* Level Display */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500">Level</span>
              <span className="ml-2 px-3 py-1 bg-black text-white text-sm font-semibold rounded-full">
                {userLevel}
              </span>
            </div>

            {/* GP (Game Points) Display */}
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-500">GP</span>
              <span className="ml-2 px-3 py-1 bg-black text-white text-sm font-semibold rounded-full">
                {userPoints}
              </span>
            </div>

            {/* Profile Icon Button */}
            <button
              onClick={() => router.push('/profile')}
              className="p-1 bg-black text-white hover:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 cursor-pointer"
              aria-label="Go to Profile"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 