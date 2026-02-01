import React, { useState, useEffect } from "react";

// API Configuration
const API_BASE = "http://localhost:5000/api";

export default function MovieIntelligence() {
  const [movies, setMovies] = useState([]);
  const [setTopRevenueMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    genre: "all",
    country: "all",
    year: "all",
    language: "all",
    minRating: 0,
  });

  const [availableFilters, setAvailableFilters] = useState({
    genres: [],
    countries: [],
    years: [],
    languages: [],
  });

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      const [moviesRes, revenueRes] = await Promise.all([
        fetch(`${API_BASE}/movies`),
        fetch(`${API_BASE}/movies/top-revenue?limit=10`),
      ]);

      const moviesData = await moviesRes.json();
      const revenueData = await revenueRes.json();

      setMovies(moviesData.movies || []);
      setTopRevenueMovies(revenueData.movies || []);
      setFilteredMovies(revenueData.movies || []);

      // Extract unique filter options
      extractFilterOptions(moviesData.movies || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (movieList) => {
    const genres = new Set();
    const countries = new Set();
    const years = new Set();
    const languages = new Set();

    movieList.forEach((movie) => {
      if (movie.genre && movie.genre !== "N/A") {
        movie.genre.split(",").forEach((g) => genres.add(g.trim()));
      }
      if (movie.country && movie.country !== "N/A")
        countries.add(movie.country);
      if (movie.year && movie.year !== "N/A") years.add(movie.year);
      if (movie.language && movie.language !== "N/A")
        languages.add(movie.language);
    });

    setAvailableFilters({
      genres: Array.from(genres).sort(),
      countries: Array.from(countries).sort(),
      years: Array.from(years).sort((a, b) => b - a),
      languages: Array.from(languages).sort(),
    });
  };

  const applyFilters = () => {
    let filtered = [...movies];

    // Apply genre filter
    if (filters.genre !== "all") {
      filtered = filtered.filter(
        (movie) => movie.genre && movie.genre.includes(filters.genre),
      );
    }

    // Apply country filter
    if (filters.country !== "all") {
      filtered = filtered.filter((movie) => movie.country === filters.country);
    }

    // Apply year filter
    if (filters.year !== "all") {
      filtered = filtered.filter((movie) => movie.year === filters.year);
    }

    // Apply language filter
    if (filters.language !== "all") {
      filtered = filtered.filter(
        (movie) => movie.language === filters.language,
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(
        (movie) => parseFloat(movie.imdb_rating) >= filters.minRating,
      );
    }

    setFilteredMovies(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      genre: "all",
      country: "all",
      year: "all",
      language: "all",
      minRating: 0,
    });
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading Movies...</p>
      </div>
    );
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>🎬 GLOBAL MOVIE INTELLIGENCE</h1>
          <p style={styles.subtitle}>Top 10 Highest Revenue Movies</p>
        </div>
      </header>

      {/* Filter Panel */}
      <div style={styles.filterPanel}>
        <h3 style={styles.filterTitle}>Filter Movies</h3>

        <div style={styles.filterGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Genre</label>
            <select
              value={filters.genre}
              onChange={(e) => handleFilterChange("genre", e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Genres</option>
              {availableFilters.genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Countries</option>
              {availableFilters.countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Year</label>
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Years</option>
              {availableFilters.years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
              style={styles.filterSelect}
            >
              <option value="all">All Languages</option>
              {availableFilters.languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label style={styles.filterLabel}>Min IMDb Rating</label>
            <select
              value={filters.minRating}
              onChange={(e) =>
                handleFilterChange("minRating", parseFloat(e.target.value))
              }
              style={styles.filterSelect}
            >
              <option value={0}>Any Rating</option>
              <option value={7.0}>7.0+</option>
              <option value={8.0}>8.0+</option>
              <option value={8.5}>8.5+</option>
              <option value={9.0}>9.0+</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <button onClick={resetFilters} style={styles.resetButton}>
              Reset Filters
            </button>
          </div>
        </div>

        <div style={styles.resultCount}>
          Showing {filteredMovies.length} of {movies.length} movies
        </div>
      </div>

      {/* Movie Grid */}
      <main style={styles.main}>
        <div style={styles.movieGrid}>
          {filteredMovies.map((movie, idx) => (
            <div
              key={idx}
              style={styles.movieBox}
              onClick={() => setSelectedMovie(movie)}
            >
              <div style={styles.movieThumbnail}>
                {movie.thumbnail && movie.thumbnail !== "N/A" ? (
                  <img
                    src={movie.thumbnail}
                    alt={movie.title}
                    style={styles.thumbnailImage}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div style={styles.thumbnailPlaceholder}>
                  <span style={styles.placeholderIcon}>🎬</span>
                </div>
              </div>

              <div style={styles.movieInfo}>
                <h3 style={styles.movieTitle}>{movie.title}</h3>

                <div style={styles.movieBasicInfo}>
                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Year:</span>
                    <span style={styles.infoValue}>{movie.year}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Genre:</span>
                    <span style={styles.infoValue}>{movie.genre}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Runtime:</span>
                    <span style={styles.infoValue}>{movie.runtime}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Language:</span>
                    <span style={styles.infoValue}>{movie.language}</span>
                  </div>

                  <div style={styles.infoRow}>
                    <span style={styles.infoLabel}>Country:</span>
                    <span style={styles.infoValue}>{movie.country}</span>
                  </div>
                </div>

                <button style={styles.viewDetailsButton}>View Details →</button>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <div style={styles.noResults}>
            <p>No movies match your filters. Try adjusting your criteria.</p>
          </div>
        )}
      </main>

      {/* Movie Detail Modal */}
      {selectedMovie && (
        <div style={styles.modalOverlay} onClick={() => setSelectedMovie(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeButton}
              onClick={() => setSelectedMovie(null)}
            >
              ✕
            </button>

            <div style={styles.modalContent}>
              <div style={styles.modalLeft}>
                {selectedMovie.thumbnail &&
                selectedMovie.thumbnail !== "N/A" ? (
                  <img
                    src={selectedMovie.thumbnail}
                    alt={selectedMovie.title}
                    style={styles.modalThumbnail}
                  />
                ) : (
                  <div style={styles.modalThumbnailPlaceholder}>
                    <span style={styles.modalPlaceholderIcon}>🎬</span>
                  </div>
                )}
              </div>

              <div style={styles.modalRight}>
                <h2 style={styles.modalTitle}>{selectedMovie.title}</h2>
                <p style={styles.modalYear}>({selectedMovie.year})</p>

                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Basic Information</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <strong>Genre:</strong> {selectedMovie.genre}
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Runtime:</strong> {selectedMovie.runtime}
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Language:</strong> {selectedMovie.language}
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Country:</strong> {selectedMovie.country}
                    </div>
                  </div>
                </div>

                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Ratings & Scores</h3>
                  <div style={styles.ratingGrid}>
                    <div style={styles.ratingBox}>
                      <div style={styles.ratingLabel}>IMDb</div>
                      <div style={styles.ratingValue}>
                        {selectedMovie.imdb_rating}/10
                      </div>
                    </div>
                    <div style={styles.ratingBox}>
                      <div style={styles.ratingLabel}>Rotten Tomatoes</div>
                      <div style={styles.ratingValue}>
                        {selectedMovie.rotten_tomatoes_score}
                      </div>
                    </div>
                    <div style={styles.ratingBox}>
                      <div style={styles.ratingLabel}>Metacritic</div>
                      <div style={styles.ratingValue}>
                        {selectedMovie.metacritic_score}/100
                      </div>
                    </div>
                  </div>
                </div>

                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Financial Performance</h3>
                  <div style={styles.detailGrid}>
                    <div style={styles.detailItem}>
                      <strong>Budget:</strong> {selectedMovie.budget}
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Box Office:</strong> {selectedMovie.boxoffice}
                    </div>
                    <div style={styles.detailItem}>
                      <strong>Production:</strong>{" "}
                      {selectedMovie.production_company}
                    </div>
                  </div>
                </div>

                <div style={styles.modalSection}>
                  <h3 style={styles.sectionTitle}>Cast & Crew</h3>
                  <div style={styles.detailItem}>
                    <strong>Director:</strong> {selectedMovie.director}
                  </div>
                  <div style={styles.detailItem}>
                    <strong>Main Actors:</strong> {selectedMovie.actors}
                  </div>
                </div>

                {selectedMovie.awards !== "N/A" && (
                  <div style={styles.modalSection}>
                    <h3 style={styles.sectionTitle}>Awards</h3>
                    <div style={styles.awardsBox}>
                      🏆 {selectedMovie.awards}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  app: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    color: "#e8e8e8",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },

  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    background: "#1a1a2e",
  },

  loadingSpinner: {
    width: "50px",
    height: "50px",
    border: "4px solid rgba(233, 69, 96, 0.1)",
    borderTop: "4px solid #e94560",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: "20px",
    color: "#e94560",
    fontSize: "16px",
  },

  header: {
    background: "rgba(26, 26, 46, 0.95)",
    borderBottom: "3px solid #e94560",
    padding: "30px 40px",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
  },

  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
  },

  title: {
    fontSize: "32px",
    margin: 0,
    color: "#e94560",
    fontWeight: "bold",
    letterSpacing: "1px",
  },

  subtitle: {
    margin: "8px 0 0 0",
    fontSize: "16px",
    color: "#a8a8a8",
    letterSpacing: "0.5px",
  },

  filterPanel: {
    background: "rgba(22, 33, 62, 0.9)",
    padding: "25px 40px",
    borderBottom: "1px solid rgba(233, 69, 96, 0.3)",
  },

  filterTitle: {
    fontSize: "18px",
    color: "#e94560",
    marginBottom: "20px",
    fontWeight: "600",
  },

  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  filterLabel: {
    fontSize: "13px",
    color: "#a8a8a8",
    fontWeight: "500",
  },

  filterSelect: {
    padding: "10px",
    background: "rgba(15, 52, 96, 0.6)",
    border: "1px solid rgba(233, 69, 96, 0.3)",
    color: "#e8e8e8",
    fontSize: "14px",
    borderRadius: "4px",
    outline: "none",
    cursor: "pointer",
  },

  resetButton: {
    padding: "10px 20px",
    background: "#e94560",
    border: "none",
    color: "#fff",
    fontSize: "14px",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "600",
    marginTop: "21px",
  },

  resultCount: {
    textAlign: "center",
    marginTop: "20px",
    color: "#a8a8a8",
    fontSize: "14px",
  },

  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px",
  },

  movieGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px",
  },

  movieBox: {
    background:
      "linear-gradient(135deg, rgba(22, 33, 62, 0.9) 0%, rgba(15, 52, 96, 0.8) 100%)",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid rgba(233, 69, 96, 0.2)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
  },

  movieThumbnail: {
    width: "100%",
    height: "400px",
    position: "relative",
    overflow: "hidden",
    background: "rgba(15, 52, 96, 0.3)",
  },

  thumbnailImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  thumbnailPlaceholder: {
    width: "100%",
    height: "100%",
    display: "none",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(15, 52, 96, 0.5)",
  },

  placeholderIcon: {
    fontSize: "80px",
    opacity: 0.3,
  },

  movieInfo: {
    padding: "20px",
  },

  movieTitle: {
    fontSize: "20px",
    color: "#e94560",
    margin: "0 0 15px 0",
    fontWeight: "600",
    lineHeight: "1.3",
  },

  movieBasicInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "15px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    padding: "5px 0",
    borderBottom: "1px solid rgba(233, 69, 96, 0.1)",
  },

  infoLabel: {
    color: "#a8a8a8",
    fontWeight: "500",
  },

  infoValue: {
    color: "#e8e8e8",
    textAlign: "right",
  },

  viewDetailsButton: {
    width: "100%",
    padding: "12px",
    background: "rgba(233, 69, 96, 0.2)",
    border: "1px solid #e94560",
    color: "#e94560",
    fontSize: "14px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s",
  },

  noResults: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#a8a8a8",
    fontSize: "18px",
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },

  modal: {
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    borderRadius: "16px",
    maxWidth: "1000px",
    width: "100%",
    maxHeight: "90vh",
    overflow: "auto",
    border: "2px solid #e94560",
    position: "relative",
    boxShadow: "0 10px 50px rgba(233, 69, 96, 0.3)",
  },

  closeButton: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#e94560",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },

  modalContent: {
    display: "grid",
    gridTemplateColumns: "300px 1fr",
    gap: "30px",
    padding: "40px",
  },

  modalLeft: {
    display: "flex",
    alignItems: "flex-start",
  },

  modalThumbnail: {
    width: "100%",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.5)",
  },

  modalThumbnailPlaceholder: {
    width: "100%",
    height: "450px",
    background: "rgba(15, 52, 96, 0.3)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modalPlaceholderIcon: {
    fontSize: "100px",
    opacity: 0.3,
  },

  modalRight: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
  },

  modalTitle: {
    fontSize: "32px",
    color: "#e94560",
    margin: 0,
    fontWeight: "bold",
  },

  modalYear: {
    fontSize: "18px",
    color: "#a8a8a8",
    margin: "-15px 0 0 0",
  },

  modalSection: {
    borderTop: "1px solid rgba(233, 69, 96, 0.2)",
    paddingTop: "15px",
  },

  sectionTitle: {
    fontSize: "18px",
    color: "#e94560",
    marginBottom: "15px",
    fontWeight: "600",
  },

  detailGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "15px",
  },

  detailItem: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#e8e8e8",
  },

  ratingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "15px",
  },

  ratingBox: {
    background: "rgba(15, 52, 96, 0.4)",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    border: "1px solid rgba(233, 69, 96, 0.2)",
  },

  ratingLabel: {
    fontSize: "12px",
    color: "#a8a8a8",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },

  ratingValue: {
    fontSize: "24px",
    color: "#e94560",
    fontWeight: "bold",
  },

  awardsBox: {
    background: "rgba(233, 69, 96, 0.1)",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid rgba(233, 69, 96, 0.3)",
    fontSize: "16px",
    color: "#e8e8e8",
    textAlign: "center",
  },
};

// Add keyframe animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    overflow-x: hidden;
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 10px;
  }
  
  ::-webkit-scrollbar-track {
    background: #1a1a2e;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #e94560;
    border-radius: 5px;
  }
  
  /* Hover effects */
  [style*="movieBox"]:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(233, 69, 96, 0.4) !important;
    border-color: #e94560 !important;
  }
  
  [style*="viewDetailsButton"]:hover {
    background: #e94560 !important;
    color: #fff !important;
  }
  
  [style*="resetButton"]:hover {
    background: #ff5a75 !important;
  }
  
  [style*="closeButton"]:hover {
    background: #ff5a75 !important;
    transform: rotate(90deg);
    transition: all 0.3s;
  }
  
  select:hover {
    border-color: #e94560 !important;
  }
  
  @media (max-width: 900px) {
    [style*="modalContent"] {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);
