import { useState } from 'react'
import tocflixLogo from './assets/TOCFLIX.png'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav
        className="w-full bg-[#141414] px-6 md:px-10 flex items-center justify-between sticky top-0 z-50 border-b border-gray-800/50"
        style={{ height: '68px' }}
      >
        {/* LEFT — Logo + Links (desktop) */}
        <div className="flex items-center gap-8">
          <img src={tocflixLogo} alt="TOCFLIX" className="h-12 object-contain" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="/" style={{ color: 'inherit' }} className="text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <a href="/movies" style={{ color: 'white' }} className="text-white font-bold hover:text-gray-200 transition-colors">
              Movies
            </a>
          </div>
        </div>

        {/* RIGHT — Search + GitHub (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search */}
          <button aria-label="Search" style={{ background: 'none', border: 'none', padding: '4px', color: 'white' }} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* GitHub */}
          <a
            href="https://github.com/Ppunpprem/TOC_movie_website"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-xs font-medium rounded-lg transition-colors "
            style={{ textDecoration: 'none', color: 'white', width: '161px', height: '42px', justifyContent: 'center' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub Repo
          </a>
        </div>

        {/* RIGHT — Search + Hamburger (mobile) */}
        <div className="flex md:hidden items-center gap-4">
          <button aria-label="Search" style={{ background: 'none', border: 'none', padding: '4px', color: 'white' }} className="text-gray-300 hover:text-white transition-colors cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{ background: 'none', border: 'none', padding: '4px', color: 'white' }}
            className="text-white cursor-pointer"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-b border-gray-800 px-6 py-4 flex flex-col gap-4 sticky top-[68px] z-40 items-center">
          <a href="/" style={{ color: 'inherit' }} className="text-gray-300 hover:text-white text-sm transition-colors">
            Home
          </a>
          <a href="/movies" style={{ color: 'white' }} className="text-white font-bold text-sm hover:text-gray-200 transition-colors">
            Movies
          </a>
          <a
            href="https://github.com/Ppunpprem/TOC_movie_website"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] text-xs font-medium rounded-lg transition-colors w-fit px-4 py-2"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub Repo
          </a>
        </div>
      )}
    </>
  )
}