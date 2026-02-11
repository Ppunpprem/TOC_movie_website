import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full p-4 text-white bg-black">
      {/* Logo */}
      <div className="text-4xl font-bold text-red-600">
        <Link to="/">TOCFLIX</Link>
      </div>
      
      {/* Navigation Links */}
      <div className="flex space-x-8 text-lg">
        <Link to="/" className="hover:text-gray-400">Home</Link>
        <Link to="/movies" className="hover:text-gray-400">Movies</Link>
      </div>
      
      {/* GitHub Repo Button */}
      <div className="flex items-center">
        <a 
          href="https://github.com/your-repo" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center px-4 py-2 space-x-2 text-lg text-white bg-gray-700 rounded-lg hover:bg-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M8 0a8 8 0 0 0-2.528 15.592c.4.073.528-.174.528-.389 0-.19-.007-.693-.01-1.284-2.153.468-2.604-.937-2.604-.937-.351-.894-.858-1.134-.858-1.134-.702-.48 0-.47.4-.47h.314c.25 0 .426-.214.426-.43 0-.34-.204-.523-.408-.6-1.136-.72-2.03-.596-2.437-.84-.358-.235-.02-.544.149-.617a5.01 5.01 0 0 1 .857-.112c.452 0 .825-.27.967-.702.221-.607-.339-1.13-.946-.975-1.647.66-2.748 1.578-3.148 2.5a8 8 0 1 0 12.464-7.99z"/>
          </svg>
          <span>GitHub Repo</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;