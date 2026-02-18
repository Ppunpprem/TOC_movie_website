import { useState, useEffect, useRef } from 'react';

const API_BASE = 'http://localhost:5000/api';

// ── Fallback data if backend is offline ─────────────────────────────────────
const FALLBACK_MOVIES = [
  { id: 'tt0111161', title: "The Shawshank Redemption", year: "1994", rating: 9.3, poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg", plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
  { id: 'tt0068646', title: "The Godfather", year: "1972", rating: 9.2, poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", plot: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son." },
  { id: 'tt0468569', title: "The Dark Knight", year: "2008", rating: 9.0, poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg", plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice." },
  { id: 'tt0108052', title: "Schindler's List", year: "1993", rating: 9.0, poster: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTk3ODMtZjcxNzE3Y2I0OGQ1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg", plot: "In German-occupied Poland during World War II, industrialist Oskar Schindler becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis." },
  { id: 'tt0110912', title: "Pulp Fiction", year: "1994", rating: 8.9, poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", plot: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption." },
  { id: 'tt0109830', title: "Forrest Gump", year: "1994", rating: 8.8, poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg", plot: "Historical events unfold from the perspective of an Alabama man with an IQ of 75 who finds himself at the centre of several defining moments." },
  { id: 'tt1375666', title: "Inception", year: "2010", rating: 8.8, poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg", plot: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
  { id: 'tt0133093', title: "The Matrix", year: "1999", rating: 8.7, poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVlLTM5YTctZjEwM2QxZjhmZmFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg", plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth about the life he knows." },
];

const FALLBACK_GENRES = [
  { name: "Action",    color: "#e50914", img: FALLBACK_MOVIES[2].poster },
  { name: "Adventure", color: "#f5a623", img: FALLBACK_MOVIES[6].poster },
  { name: "Comedy",    color: "#4a90d9", img: FALLBACK_MOVIES[5].poster },
  { name: "Drama",     color: "#7b68ee", img: FALLBACK_MOVIES[3].poster },
];

// ── Components ───────────────────────────────────────────────────────────────

function IMDbBadge({ rating }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="bg-yellow-400 text-black font-bold text-[11px] px-1.5 py-0.5 rounded">
        IMDb
      </span>
      <span className="text-yellow-400 font-bold text-base">{rating}</span>
      <span className="text-gray-400 text-sm">/10</span>
    </div>
  );
}

function MovieCard({ movie }) {
  return (
    <div className="flex-shrink-0 w-44 cursor-pointer group">
      <div className="overflow-hidden rounded-lg">
        <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          className="w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ aspectRatio: '2/3' }}
          onError={(e) => { e.target.src = 'https://placehold.co/180x270/1a1a1a/555?text=No+Image'; }}
        />
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-white text-sm font-medium truncate">{movie.title}</p>
        <IMDbBadge rating={movie.rating} />
        <p className="text-gray-500 text-xs mt-0.5">{movie.year}</p>
      </div>
    </div>
  );
}

function GenreCard({ genre }) {
  return (
    <div className="relative rounded-xl overflow-hidden h-40 cursor-pointer group">
      <img
        src={genre.img}
        alt={genre.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded text-white"
          style={{ backgroundColor: genre.color }}
        >
          Top 10 In
        </span>
        <p className="text-white font-bold text-sm mt-1">{genre.name} →</p>
      </div>
    </div>
  );
}

function ScrollRow({ movies }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {movies.map((movie) => (
        <MovieCard key={movie.id || movie.title} movie={movie} />
      ))}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-3xl font-bold tracking-wide" style={{ fontFamily: "'Bebas Neue', cursive" }}>
        {title}
      </h2>
      <a href="#" className="flex items-center gap-1 text-red-500 text-sm hover:text-red-400 transition-colors">
        See more
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [trending,    setTrending]    = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [genres,      setGenres]      = useState([]);
  const [heroIndex,   setHeroIndex]   = useState(0);
  const [heroFade,    setHeroFade]    = useState(true);   // true = visible
  const [progress,    setProgress]    = useState(0);
  const [loading,     setLoading]     = useState(true);

  const HERO_DURATION = 8000;
  const progressRef   = useRef(null);

  // ── Fetch from Flask backend ─────────────────────────────────────────────
  useEffect(() => {
    async function fetchAll() {
      try {
        const [trendRes, newRes, genreRes] = await Promise.all([
          fetch(`${API_BASE}/movies/trending`),
          fetch(`${API_BASE}/movies/new`),
          fetch(`${API_BASE}/genres`),
        ]);

        if (!trendRes.ok || !newRes.ok || !genreRes.ok) throw new Error('API error');

        const [trendData, newData, genreData] = await Promise.all([
          trendRes.json(),
          newRes.json(),
          genreRes.json(),
        ]);

        setTrending(trendData.movies?.length    ? trendData.movies    : FALLBACK_MOVIES);
        setNewArrivals(newData.movies?.length   ? newData.movies      : [...FALLBACK_MOVIES].reverse());
        setGenres(genreData.genres?.length      ? genreData.genres    : FALLBACK_GENRES);
      } catch {
        // Backend offline — use fallback data silently
        setTrending(FALLBACK_MOVIES);
        setNewArrivals([...FALLBACK_MOVIES].reverse());
        setGenres(FALLBACK_GENRES);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ── Hero auto-rotate ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!trending.length) return;

    // Reset progress
    setProgress(0);
    clearInterval(progressRef.current);

    // Animate progress bar
    const step = 100 / (HERO_DURATION / 100);
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return p + step;
      });
    }, 100);

    // Switch hero after duration
    const heroTimer = setTimeout(() => {
      setHeroFade(false);
      setTimeout(() => {
        setHeroIndex((i) => (i + 1) % trending.length);
        setHeroFade(true);
      }, 500);
    }, HERO_DURATION);

    return () => {
      clearTimeout(heroTimer);
      clearInterval(progressRef.current);
    };
  }, [heroIndex, trending]);

  const hero = trending[heroIndex] || {};

  // ── Loading screen ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-red-600 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm tracking-widest uppercase">Loading movies...</p>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="bg-black text-white min-h-screen" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4
                      bg-gradient-to-b from-black/90 to-transparent">
        <div className="flex items-center gap-10">
          {/* Logo */}
          <a href="#">
            <img
              src="assets/TOCFLIX.png"
              alt="TOCFLIX"
              className="h-8"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span
              className="text-red-600 font-bold text-2xl tracking-widest hidden"
              style={{ fontFamily: "'Bebas Neue', cursive", display: 'none' }}
            >
              TOCFLIX
            </span>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#" className="text-white hover:text-red-500 transition-colors">Home</a>
            <a href="#" className="font-bold text-white hover:text-red-500 transition-colors">Movies</a>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search icon */}
          <button className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>

          {/* GitHub button */}
          <a
            href="https://github.com/Ppunpprem/TOC_movie_website"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700
                       text-white text-sm font-medium px-4 py-2 rounded-lg
                       hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
                0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755
                -1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236
                1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466
                -1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176
                0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405
                2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23
                1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22
                0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295
                24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub Repo
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="relative w-full overflow-hidden" style={{ height: '90vh', minHeight: '520px' }}>
        {/* Background poster */}
        <img
          src={hero.poster || ''}
          alt={hero.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: heroFade ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Content */}
        <div
          className="absolute bottom-24 left-14 max-w-lg z-10"
          style={{ opacity: heroFade ? 1 : 0, transition: 'opacity 0.5s ease' }}
        >
          <IMDbBadge rating={hero.rating} />
          <h1
            className="text-6xl font-bold mt-3 mb-2 leading-tight"
            style={{ fontFamily: "'Bebas Neue', cursive", letterSpacing: '1px' }}
          >
            {hero.title}
          </h1>
          <p className="text-gray-400 text-sm mb-3">{hero.year} • IMDb Top 250</p>
          <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">{hero.plot}</p>
          <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white
                             px-6 py-3 rounded-lg font-semibold transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            PLAY
          </button>
        </div>

        {/* Hero indicators */}
        <div className="absolute bottom-8 left-14 flex items-center gap-2 z-10">
          {trending.map((_, i) => (
            <button
              key={i}
              onClick={() => { setHeroFade(false); setTimeout(() => { setHeroIndex(i); setHeroFade(true); }, 300); }}
              className={`rounded-full transition-all duration-300 ${
                i === heroIndex ? 'w-6 h-2 bg-red-600' : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
          <div
            className="h-full bg-red-600 transition-none"
            style={{ width: `${progress}%`, transition: progress === 0 ? 'none' : 'width 0.1s linear' }}
          />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-10 py-10 max-w-screen-xl mx-auto space-y-12">

        {/* Trending */}
        <section>
          <SectionHeader title="Trending" />
          <ScrollRow movies={trending} />
        </section>

        {/* New Arrival */}
        <section>
          <SectionHeader title="New Arrival" />
          <ScrollRow movies={newArrivals} />
        </section>

        {/* Genres */}
        <section>
          <h2
            className="text-3xl font-bold tracking-wide mb-5"
            style={{ fontFamily: "'Bebas Neue', cursive" }}
          >
            Popular Top 10 In Genres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {genres.map((g, i) => <GenreCard key={i} genre={g} />)}
          </div>
        </section>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-zinc-900 py-8 text-center text-gray-600 text-sm">
        © 2026 TOCFLIX — Data from IMDb Top 250
      </footer>
    </div>
  );
}