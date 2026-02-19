import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

// ── Sample movie data ──────────────────────────────────────────────
const MOVIES = [
  { id: 1,  title: 'Orion and the Dark',   year: 2024, imdb: 6.4,  genres: ['Comedy','Animation'], language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/da2svJoRxJDrSdqSXIOlNXwqsAE.jpg',  recentlyAdded: true  },
  { id: 2,  title: 'Players',              year: 2024, imdb: 6.1,  genres: ['Comedy','Romance'],   language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/6zp8IfVJMi2FpxkOAi4NM87Bla2.jpg',  recentlyAdded: true  },
  { id: 3,  title: 'Horrible Bosses 2',    year: 2014, imdb: 6.5,  genres: ['Comedy','Crime'],     language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/4nY7HiAFhJLMpJdRTBbDFz6I2vZ.jpg',  recentlyAdded: false },
  { id: 4,  title: 'American Assassin',    year: 2017, imdb: 6.2,  genres: ['Action','Thriller'],  language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/rdAFhxZFBmKfQr8sCBHoqH6ckYC.jpg',  recentlyAdded: false },
  { id: 5,  title: 'The Super Mario Bros.',year: 2023, imdb: 7.0,  genres: ['Animation','Comedy'], language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',  recentlyAdded: false },
  { id: 6,  title: 'Dune',                 year: 2021, imdb: 8.0,  genres: ['Sci-Fi','Drama'],     language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/d5NXSklpcvweasQiam4y4nlLqYN.jpg',  recentlyAdded: false },
  { id: 7,  title: 'Inception',            year: 2010, imdb: 8.8,  genres: ['Sci-Fi','Thriller'],  language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',  recentlyAdded: false },
  { id: 8,  title: 'The Dark Knight',      year: 2008, imdb: 9.0,  genres: ['Action','Drama'],     language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',  recentlyAdded: false },
  { id: 9,  title: 'Interstellar',         year: 2014, imdb: 8.7,  genres: ['Sci-Fi','Drama'],     language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIe.jpg',  recentlyAdded: true  },
  { id: 10, title: 'Parasite',             year: 2019, imdb: 8.5,  genres: ['Drama','Thriller'],   language: 'Korean',   poster: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',  recentlyAdded: true  },
  { id: 11, title: 'The Matrix',           year: 1999, imdb: 8.7,  genres: ['Sci-Fi','Action'],    language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',  recentlyAdded: false },
  { id: 12, title: 'Pulp Fiction',         year: 1994, imdb: 8.9,  genres: ['Crime','Drama'],      language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',  recentlyAdded: false },
  { id: 13, title: 'Your Name',            year: 2016, imdb: 8.4,  genres: ['Animation','Romance'],'language': 'Japanese',poster: 'https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg',  recentlyAdded: true  },
  { id: 14, title: 'Avengers: Endgame',    year: 2019, imdb: 8.4,  genres: ['Action','Sci-Fi'],    language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',  recentlyAdded: false },
  { id: 15, title: 'Joker',               year: 2019, imdb: 8.5,  genres: ['Drama','Thriller'],   language: 'English',  poster: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',  recentlyAdded: false },
]

const ALL_GENRES = ['Action','Animation','Comedy','Crime','Drama','Romance','Sci-Fi','Thriller']


// ── IMDb star icon ─────────────────────────────────────────────────
function ImdbBadge({ score }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '4px',
    }}>
      <span style={{
        background: '#f5c518', color: '#000', fontWeight: 900,
        fontSize: '9px', padding: '1px 4px', borderRadius: '2px',
        letterSpacing: '0.3px', lineHeight: 1.4,
      }}>
        IMDb
      </span>
      <span style={{ color: '#f5c518', fontSize: '11px', fontWeight: 700 }}>
        {score.toFixed(1)}
      </span>
    </span>
  )
}

// ── Movie Card ─────────────────────────────────────────────────────
function MovieCard({ movie }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [imgError, setImgError] = useState(false)

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        transform: hovered ? 'scale(1.04)' : 'scale(1)',
        transition: 'transform 0.2s ease',
      }}
    >
      {/* Poster */}
      <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', aspectRatio: '2/3', background: '#1c1c1c' }}>
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#2a2a2a', color: '#666', fontSize: '12px', padding: '8px', textAlign: 'center' }}>
            {movie.title}
          </div>
        )}


      </div>

      {/* Info below poster */}
      <div style={{ marginTop: '8px' }}>
        <div style={{ color: '#fff', fontWeight: 600, fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {movie.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
          <span style={{ color: '#999', fontSize: '12px' }}>{movie.year}</span>
          <ImdbBadge score={movie.imdb} />
        </div>
      </div>
    </div>
  )
}

// ── Main MoviesPage ────────────────────────────────────────────────
export default function MoviesPage() {
  const [selectedGenres, setSelectedGenres] = useState([])
  const [yearInput, setYearInput] = useState('')
  const [languageInput, setLanguageInput] = useState('')

  const toggleGenre = (g) =>
    setSelectedGenres(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])

  const filtered = useMemo(() => {
    return MOVIES.filter(m => {
      if (selectedGenres.length && !selectedGenres.some(g => m.genres.includes(g))) return false
      if (yearInput.trim() && String(m.year) !== yearInput.trim()) return false
      if (languageInput.trim() && !m.language.toLowerCase().includes(languageInput.trim().toLowerCase())) return false
      return true
    })
  }, [selectedGenres, yearInput, languageInput])

  return (
    <div style={{ minHeight: '100vh', background: '#141414', color: '#fff', fontFamily: 'sans-serif' }}>
      <Navbar />

      <div style={{ display: 'flex', alignItems: 'flex-start' }}>

        {/* ── Sidebar Filter (sticky) ─────────────────────── */}
        <aside style={{
          width: '240px', minWidth: '240px',
          background: '#1a1a1a', borderRight: '1px solid #2a2a2a',
          position: 'sticky', top: '68px',
          height: 'calc(100vh - 68px)', overflowY: 'auto',
          padding: '24px 20px',
          boxSizing: 'border-box',
          flexShrink: 0,
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', margin: '0 0 20px' }}>Filter By</h2>

          {/* Genres */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Genres</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto', paddingRight: '4px' }}>
              {ALL_GENRES.map(g => (
                <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: selectedGenres.includes(g) ? '#fff' : '#aaa' }}>
                  <input
                    type="checkbox"
                    checked={selectedGenres.includes(g)}
                    onChange={() => toggleGenre(g)}
                    style={{ accentColor: '#e50914', cursor: 'pointer' }}
                  />
                  {g}
                </label>
              ))}
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '20px 0' }} />

          {/* Release Year */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Release Year</h3>
            <input
              type="text"
              placeholder="Type Year Here"
              value={yearInput}
              onChange={e => setYearInput(e.target.value)}
              style={{
                width: '100%', background: '#2a2a2a', border: '1px solid #3a3a3a',
                borderRadius: '6px', padding: '8px 10px', color: '#fff',
                fontSize: '13px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '20px 0' }} />

          {/* Languages */}
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Languages</h3>
            <input
              type="text"
              placeholder="e.g. English, Korean..."
              value={languageInput}
              onChange={e => setLanguageInput(e.target.value)}
              style={{
                width: '100%', background: '#2a2a2a', border: '1px solid #3a3a3a',
                borderRadius: '6px', padding: '8px 10px', color: '#fff',
                fontSize: '13px', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Reset */}
          {(selectedGenres.length > 0 || yearInput || languageInput) && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid #333', margin: '20px 0' }} />
              <button
                onClick={() => { setSelectedGenres([]); setYearInput(''); setLanguageInput('') }}
                style={{
                  width: '100%', background: '#e50914', color: '#fff', border: 'none',
                  borderRadius: '6px', padding: '8px', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Clear Filters
              </button>
            </>
          )}
        </aside>

        {/* ── Main content ───────────────────────────────── */}
        <main style={{ flex: 1, padding: '32px 32px', overflowY: 'auto' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '28px', margin: '0 0 28px' }}>
            Browse All Movies
          </h1>

          {filtered.length === 0 ? (
            <div style={{ color: '#666', fontSize: '16px', marginTop: '60px', textAlign: 'center' }}>
              No movies match your filters.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '20px 16px',
            }}>
              {filtered.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}