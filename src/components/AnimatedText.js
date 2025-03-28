import React, { useState, useEffect } from 'react';

const AnimatedText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const words = ["Answers", "Bookings", "Payments", "Deadlines", "Solutions"];

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWordIndex(prevIndex => (prevIndex + 1) % words.length);
    }, 1000);

    return () => clearInterval(wordInterval);
  }, [words.length]);

  return (
    <div className="relative mt-24 sm:mt-28 lg:mt-32 mb-8 text-center">
      <div className="flex items-center justify-center space-x-3 text-2xl sm:text-3xl">
        <span className="font-bold text-gray-900 min-w-[120px] sm:min-w-[140px] transition-opacity duration-300">
          {words[currentWordIndex]}
        </span>
        
        <span className="font-semibold text-gray-800">
        
        </span>
      </div>
      
      <div className="text-lg sm:text-xl text-gray-700 mt-4 max-w-xl sm:max-w-2xl mx-auto opacity-90">
        Zero training for customers. Easiest workflow yet.
      </div>
    </div>
  );
};

export default AnimatedText;
