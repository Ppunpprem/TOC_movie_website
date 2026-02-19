import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// ============================================================
// DATA
// ============================================================
const HERO_MOVIES = [
  {
    id: 1,
    title: "John Wick 3 : Parabellum",
    year: 2019,
    country: "USA",
    imdb: "86.0 / 100",
    plot: "John Wick is on the run after killing a member of the International assassins' guild, and with a $14 million price tag on his head, he is the target of hit men and women everywhere...",
    backdrop: "https://image.tmdb.org/t/p/original/ziEuG1essDuWuC5lpWUaw1uXY2O.jpg",
  },
  {
    id: 2,
    title: "Dune",
    year: 2021,
    country: "USA",
    imdb: "84.0 / 100",
    plot: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future...",
    backdrop: "https://image.tmdb.org/t/p/original/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
  },
  {
    id: 3,
    title: "Shang-Chi and the Legend of the Ten Rings",
    year: 2021,
    country: "USA",
    imdb: "79.0 / 100",
    plot: "Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization...",
    backdrop: "https://image.tmdb.org/t/p/original/pqUTCleNUiTLAVlelGxUgWn1ELh.jpg",
  },
  {
    id: 4,
    title: "No Time To Die",
    year: 2021,
    country: "USA",
    imdb: "76.0 / 100",
    plot: "James Bond has left active service. His peace is short-lived when Felix Leiter, an old friend from the CIA, turns up asking for help...",
    backdrop: "https://image.tmdb.org/t/p/original/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
  },
];

const TRENDING = [
  { id: 1,  title: "Dune",                                      year: 2021, country: "USA", imdb: "84.0 / 100", poster: "https://image.tmdb.org/t/p/w500/d5NXSklpcuveUsKfepJamp2YoOp.jpg" },
  { id: 2,  title: "No Time To Die",                            year: 2021, country: "USA", imdb: "76.0 / 100", poster: "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg" },
  { id: 3,  title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, country: "USA", imdb: "79.0 / 100", poster: "https://image.tmdb.org/t/p/w500/pqUTCleNUiTLAVlelGxUgWn1ELh.jpg" },
  { id: 4,  title: "Don't Breathe 2",                          year: 2021, country: "USA", imdb: "61.0 / 100", poster: "https://image.tmdb.org/t/p/w500/hRMfgGFRAZIlvwVDqsSRmcGxENu.jpg" },
  { id: 5,  title: "The Suicide Squad",                         year: 2021, country: "USA", imdb: "78.0 / 100", poster: "https://image.tmdb.org/t/p/w500/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg" },
  { id: 6,  title: "Black Widow",                               year: 2021, country: "USA", imdb: "79.0 / 100", poster: "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg" },
  { id: 7,  title: "Jungle Cruise",                             year: 2021, country: "USA", imdb: "67.0 / 100", poster: "https://image.tmdb.org/t/p/w500/9dKCd55IuTT5QRs989m9Ggil5ac.jpg" },
  { id: 8,  title: "Free Guy",                                  year: 2021, country: "USA", imdb: "74.0 / 100", poster: "https://image.tmdb.org/t/p/w500/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg" },
  { id: 9,  title: "Mortal Kombat",                             year: 2021, country: "USA", imdb: "61.0 / 100", poster: "https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg" },
  { id: 10, title: "Godzilla vs. Kong",                         year: 2021, country: "USA", imdb: "66.0 / 100", poster: "https://image.tmdb.org/t/p/w500/pgqgaUx1cJb5oZQQ5v0tNARCeBp.jpg" },
];

const NEW_ARRIVAL = [
  { id: 1,  title: "Dune",                                      year: 2021, country: "USA", imdb: "84.0 / 100", poster: "https://image.tmdb.org/t/p/w500/d5NXSklpcuveUsKfepJamp2YoOp.jpg" },
  { id: 2,  title: "No Time To Die",                            year: 2021, country: "USA", imdb: "76.0 / 100", poster: "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg" },
  { id: 3,  title: "Shang-Chi and the Legend of the Ten Rings", year: 2021, country: "USA", imdb: "79.0 / 100", poster: "https://image.tmdb.org/t/p/w500/pqUTCleNUiTLAVlelGxUgWn1ELh.jpg" },
  { id: 4,  title: "Don't Breathe 2",                          year: 2021, country: "USA", imdb: "61.0 / 100", poster: "https://image.tmdb.org/t/p/w500/hRMfgGFRAZIlvwVDqsSRmcGxENu.jpg" },
  { id: 5,  title: "The Suicide Squad",                         year: 2021, country: "USA", imdb: "78.0 / 100", poster: "https://image.tmdb.org/t/p/w500/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg" },
  { id: 6,  title: "Black Widow",                               year: 2021, country: "USA", imdb: "79.0 / 100", poster: "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg" },
  { id: 7,  title: "Jungle Cruise",                             year: 2021, country: "USA", imdb: "67.0 / 100", poster: "https://image.tmdb.org/t/p/w500/9dKCd55IuTT5QRs989m9Ggil5ac.jpg" },
  { id: 8,  title: "Free Guy",                                  year: 2021, country: "USA", imdb: "74.0 / 100", poster: "https://image.tmdb.org/t/p/w500/xmbU4JTUm8rsdtn7Y3Fcm30GpeT.jpg" },
  { id: 9,  title: "Mortal Kombat",                             year: 2021, country: "USA", imdb: "61.0 / 100", poster: "https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg" },
  { id: 10, title: "Godzilla vs. Kong",                         year: 2021, country: "USA", imdb: "66.0 / 100", poster: "https://image.tmdb.org/t/p/w500/pgqgaUx1cJb5oZQQ5v0tNARCeBp.jpg" },
];

const GENRES = [
  {
    label: "Action",
    color: "bg-red-600",
    posters: [
      "https://image.tmdb.org/t/p/w500/d5NXSklpcuveUsKfepJamp2YoOp.jpg",
      "https://image.tmdb.org/t/p/w500/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg",
      "https://image.tmdb.org/t/p/w500/hRMfgGFRAZIlvwVDqsSRmcGxENu.jpg",
      "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
    ],
  },
  {
    label: "Adventure",
    color: "bg-yellow-500",
    posters: [
      "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
      "https://image.tmdb.org/t/p/w500/pqUTCleNUiTLAVlelGxUgWn1ELh.jpg",
      "https://image.tmdb.org/t/p/w500/d5NXSklpcuveUsKfepJamp2YoOp.jpg",
      "https://image.tmdb.org/t/p/w500/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg",
    ],
  },
  {
    label: "Comedy",
    color: "bg-green-500",
    posters: [
      "https://image.tmdb.org/t/p/w500/pqUTCleNUiTLAVlelGxUgWn1ELh.jpg",
      "https://image.tmdb.org/t/p/w500/qAZ0pzat24kLdO3o8ejmbLxyOac.jpg",
      "https://image.tmdb.org/t/p/w500/hRMfgGFRAZIlvwVDqsSRmcGxENu.jpg",
      "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
    ],
  },
  {
    label: "Drama",
    color: "bg-purple-600",
    posters: [
      "https://image.tmdb.org/t/p/w500/hRMfgGFRAZIlvwVDqsSRmcGxENu.jpg",
      "https://image.tmdb.org/t/p/w500/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
      "https://image.tmdb.org/t/p/w500/d5NXSklpcuveUsKfepJamp2YoOp.jpg",
      "https://image.tmdb.org/t/p/w500/kb4s0ML0iVZlG6wAKbbs9NAm6X.jpg",
    ],
  },
];

// ============================================================
// IMDB BADGE
// ============================================================
function ImdbBadge({ score }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#f5c518] text-black text-[10px] font-black px-1.5 py-0.5 rounded leading-none">
      IMDb <span className="font-bold">{score}</span>
    </span>
  );
}

// ============================================================
// MOVIE CARD
// ============================================================
function MovieCard({ movie, onMovieClick }) {
  return (
    <div onClick={() => onMovieClick && onMovieClick(movie)} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[175px] lg:w-[190px] cursor-pointer group">
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] bg-gray-900">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-2 space-y-0.5">
        <p className="text-[10px] text-gray-500 uppercase tracking-wide">
          {movie.country}, {movie.year}
        </p>
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
          {movie.title}
        </p>
        <div className="flex items-center gap-2 pt-1">
          <ImdbBadge score={movie.imdb} />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SCROLL ROW
// ============================================================
function ScrollRow({ title, items, onMovieClick, onSeeMore }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    if (ref.current) ref.current.scrollBy({ left: dir * 400, behavior: "smooth" });
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-6 md:px-10">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{title}</h2>

        {/* "See more" button — now calls onSeeMore */}
        <button
          onClick={onSeeMore}
          style={{ background: 'none', border: 'none', color: '#e50914' }}
          className="hidden sm:flex items-center gap-1 text-xs sm:text-sm font-bold hover:opacity-75 transition-opacity cursor-pointer"
        >
          See more <span className="text-base">›</span>
        </button>
      </div>

      <div className="relative group/scroller">
        {/* Left arrow */}
        <button
          onClick={() => scroll(-1)}
          className="hidden absolute left-1 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-red-600/80 items-center justify-center text-white text-xl opacity-0 group-hover/scroller:opacity-100 transition-opacity hover:bg-red-600"
        >
          ‹
        </button>

        <div
          ref={ref}
          className="flex gap-3 sm:gap-4 overflow-x-auto px-4 sm:px-6 md:px-10 pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.map((movie, i) => (
            <MovieCard key={i} movie={movie} onMovieClick={onMovieClick} />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll(1)}
          className="hidden absolute right-1 top-[40%] -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-red-600/80 items-center justify-center text-white text-xl opacity-0 group-hover/scroller:opacity-100 transition-opacity hover:bg-red-600"
        >
          ›
        </button>
      </div>
    </section>
  );
}

// ============================================================
// GENRE CARD — 2×2 poster grid
// ============================================================
function GenreCard({ genre, onGenreClick }) {
  return (
    <div
      onClick={() => onGenreClick && onGenreClick(genre.label)}
      className="relative cursor-pointer group overflow-hidden rounded-xl border border-white/5"
    >
      <div className="grid grid-cols-2 grid-rows-2 aspect-[4/3]">
        {genre.posters.slice(0, 4).map((p, i) => (
          <img
            key={i}
            src={p}
            alt=""
            className="w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-300"
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
        <div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded text-white uppercase tracking-wide ${genre.color}`}>
            Top 10 In
          </span>
          <p className="text-white font-bold text-sm sm:text-base mt-1">{genre.label}</p>
        </div>
        <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white text-sm group-hover:bg-white/20 transition-colors">
          →
        </div>
      </div>
    </div>
  );
}

// ============================================================
// HERO — auto-rotates every 6s with smooth fade
// ============================================================
function Hero({ onMovieClick }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((p) => (p + 1) % HERO_MOVIES.length);
        setVisible(true);
      }, 400);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i) => {
    if (i === idx) return;
    setVisible(false);
    setTimeout(() => { setIdx(i); setVisible(true); }, 400);
  };

  const movie = HERO_MOVIES[idx];

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(420px, 70vw, 520px)" }}
    >
      <div
        className="absolute inset-0"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      </div>

      <div
        className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 md:px-10 w-full sm:max-w-md md:max-w-lg"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 0.4s ease" }}
      >
        <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-[46px] font-black text-white leading-tight mb-2 sm:mb-4 drop-shadow-lg">
          {movie.title}
        </h1>

        <div className="flex items-center gap-2 sm:gap-4 mb-2 sm:mb-3 flex-wrap">
          <ImdbBadge score={movie.imdb} />
          <span className="text-[11px] sm:text-sm text-gray-400 font-semibold tracking-wide">
            {movie.country}, {movie.year}
          </span>
        </div>

        <p className="text-gray-200 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-4 max-w-[260px] sm:max-w-xs md:max-w-sm">
          {movie.plot}
        </p>

        <button
          onClick={() => onMovieClick && onMovieClick(movie)}
          style={{ backgroundColor: '#e50914', color: '#fff', border: 'none', cursor: 'pointer' }}
          className="text-white text-xs sm:text-sm font-bold px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-lg w-fit transition-colors duration-200 tracking-wide hover:opacity-90"
        >
          See More
        </button>
      </div>

      <div className="absolute bottom-4 left-4 sm:left-6 md:left-10 flex gap-1 z-10" style={{ alignItems: "center" }}>
        {HERO_MOVIES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              height: "3px",
              width: i === idx ? "14px" : "5px",
              background: i === idx ? "white" : "rgba(255,255,255,0.3)",
              padding: 0, margin: 0, border: "none", outline: "none",
              cursor: "pointer", borderRadius: "999px",
              transition: "all 0.3s ease", display: "block", flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
export default function HomePage() {
  const navigate = useNavigate();
  const handleMovieClick = (movie) => navigate(`/movie/${movie.id}`, { state: { movie } });
  const handleSeeMore = () => navigate("/movies");
  const handleGenreClick = (genre) => navigate(`/movies?sort=imdb_top10&genre=${encodeURIComponent(genre)}`);

  return (
    <div className="w-full min-h-screen text-white font-sans" style={{ background: "#111", overflowX: 'clip' }}>
      <Navbar />

      <Hero onMovieClick={handleMovieClick} />

      <div className="pt-6 sm:pt-8">
        <ScrollRow title="Trending"     items={TRENDING}     onMovieClick={handleMovieClick} onSeeMore={handleSeeMore} />
        <ScrollRow title="New Arrival"  items={NEW_ARRIVAL}  onMovieClick={handleMovieClick} onSeeMore={handleSeeMore} />

        {/* Popular Top 10 In Genres */}
        <section className="px-4 sm:px-6 md:px-10 pb-16">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-5">
            Popular Top 10 In Genres
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {GENRES.map((g) => (
              <GenreCard key={g.label} genre={g} onGenreClick={handleGenreClick} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}