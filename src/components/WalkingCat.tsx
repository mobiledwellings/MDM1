import { useState, useEffect } from "react";

export function WalkingCat() {
  const [position, setPosition] = useState(-150);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev > screenWidth + 150) {
          // Reset to start from left again
          return -150;
        }
        return prev + 3; // Speed of the cat
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-0 z-50 pointer-events-none"
      style={{
        left: `${position}px`,
        transition: "none",
      }}
    >
      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center pointer-events-auto cursor-pointer shadow-md"
        aria-label="Close walking cat"
      >
        ×
      </button>
      
      {/* Walking cat gif - using a popular transparent walking cat gif */}
      <img
        src="https://media.tenor.com/LopfomOaL5oAAAAi/cat-walking.gif"
        alt="Walking cat"
        className="h-20 w-auto"
        style={{
          imageRendering: "auto",
        }}
      />
    </div>
  );
}
