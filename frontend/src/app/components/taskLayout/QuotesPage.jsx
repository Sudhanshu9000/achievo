'use client';

import { useState, useEffect } from 'react';
import { getRandomQuote } from './quotesData';

const QuotesPage = () => {
  const [quote, setQuote] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setQuote(getRandomQuote());
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!quote) return null;

  return (
    <div 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="bg-white p-8 rounded-lg shadow-sm w-full text-center">
        {/* Celebration Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2 flex items-center justify-center gap-3">
            <span className="animate-bounce">🎉</span>
            Well Done!
            <span className="animate-bounce" style={{ animationDelay: '200ms' }}>🎉</span>
          </h2>
          <p className="text-gray-600 text-lg transition-all duration-700 delay-300"
             style={{ 
               opacity: isVisible ? 1 : 0,
               transform: isVisible ? 'translateY(0)' : 'translateY(10px)'
             }}>
            You've completed all your tasks for today!
          </p>
        </div>
        
        {/* Quote Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl shadow-inner">
            <blockquote 
              className="text-xl text-gray-800 italic mb-4 transition-all duration-700"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'scale(1)' : 'scale(0.95)',
                transitionDelay: '300ms'
              }}
            >
              "{quote.text}"
            </blockquote>
            <p 
              className="text-gray-600 font-medium transition-all duration-700"
              style={{ 
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                transitionDelay: '500ms'
              }}
            >
              - {quote.author}
            </p>
          </div>
        </div>

        {/* Footer Message */}
        <div 
          className="mt-8 text-gray-600 transition-all duration-700"
          style={{ 
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
            transitionDelay: '700ms'
          }}
        >
          <p>Come back tomorrow for new challenges!</p>
        </div>
      </div>
    </div>
  );
};

export default QuotesPage; 