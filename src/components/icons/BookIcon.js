import React from 'react';

const BookIcon = ({ className = "h-6 w-6", color = "currentColor" }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Book cover */}
      <path 
        d="M4 19.5C4 18.1193 5.11929 17 6.5 17H20" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M6.5 2H20V22H6.5C5.11929 22 4 20.8807 4 19.5V2.5C4 1.11929 5.11929 0 6.5 0Z" 
        fill={color} 
        fillOpacity="0.1"
        stroke={color} 
        strokeWidth="2"
      />
      
      {/* Book pages */}
      <path 
        d="M8 6H16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 10H16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 14H14" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      
      {/* Bookmark */}
      <path 
        d="M19 2V8L16.5 6L14 8V2" 
        fill={color} 
        fillOpacity="0.8"
        stroke={color} 
        strokeWidth="1"
      />
    </svg>
  );
};

export default BookIcon;
