<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>TOCFLIX</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: #0a0a0a; color: #fff; margin: 0; }

    /* Hero */
    .hero-bg {
      position: relative;
      width: 100%;
      height: 90vh;
      min-height: 520px;
      overflow: hidden;
      transition: background 0.6s ease;
    }
    .hero-img {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      object-fit: cover;
      transition: opacity 0.8s ease;
    }
    .hero-img.fade-out { opacity: 0; }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to right, rgba(0,0,0,0.85) 40%, transparent 80%),
                  linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
    }
    .hero-content {
      position: absolute; bottom: 80px; left: 60px; max-width: 520px;
    }

    /* Navbar */
    .navbar {
      position: fixed; top: 0; left: 0; right: 0; z-index: 50;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 40px;
      background: linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, transparent 100%);
    }

    /* Cards */
    .movie-card {
      flex: 0 0 auto;
      width: 180px;
      cursor: pointer;
      transition: transform 0.25s ease;
    }
    .movie-card:hover { transform: scale(1.06); }
    .movie-card img {
      width: 100%; border-radius: 8px;
      aspect-ratio: 2/3; object-fit: cover;
      display: block;
    }
    .scroll-row {
      display: flex; gap: 16px;
      overflow-x: auto; padding-bottom: 8px;
      scrollbar-width: none;
    }
    .scroll-row::-webkit-scrollbar { display: none; }

    /* IMDb badge */
    .imdb-badge {
      background: #F5C518; color: #000;
      font-weight: 700; font-size: 11px;
      padding: 2px 6px; border-radius: 3px;
      display: inline-flex; align-items: center; gap: 3px;
    }

    /* Genre card */
    .genre-card {
      position: relative; border-radius: 10px; overflow: hidden;
      height: 160px; cursor: pointer;
      transition: transform 0.25s;
    }
    .genre-card:hover { transform: scale(1.04); }
    .genre-card img { width: 100%; height: 100%; object-fit: cover; }
    .genre-card-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
      display: flex; align-items: flex-end; padding: 12px;
    }

    /* Progress bar */
    .hero-progress {
      position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
      background: rgba(255,255,255,0.15);
    }
    .hero-progress-bar {
      height: 100%; background: #E50914;
      width: 0%;
      transition: width linear;
    }

    /* Logo text fallback */
    .logo-text {
      font-family: 'Bebas Neue', cursive;
      font-size: 28px; color: #E50914; letter-spacing: 2px;
    }

    .github-btn {
      display: inline-flex; align-items: center; gap-7px;
      background: #1f1f1f; border: 1px solid #333;
      color: #fff; padding: 8px 16px; border-radius: 8px;
      font-size: 13px; font-weight: 500; text-decoration: none;
      transition: background 0.2s;
    }
    .github-btn:hover { background: #2a2a2a; }

    .section-title {
      font-family: 'Bebas Neue', cursive;
      font-size: 26px; letter-spacing: 1px;
    }
  </style>
</head>
<body>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="flex items-center gap-10">
    <!-- Try logo image, fallback to text -->
    <a href="#">
      <img src="assets/TOCFLIX.png" alt="TOCFLIX" class="h-8"
           onerror="this.style.display='none'; document.getElementById('logo-fallback').style.display='block'"/>
      <span id="logo-fallback" class="logo-text" style="display:none;">TOCFLIX</span>
    </a>
    <div class="hidden md:flex items-center gap-8 text-sm text-gray-300">
      <a href="#" class="text-white font-medium hover:text-red-500 transition-colors">Home</a>
      <a href="#" class="font-bold text-white hover:text-red-500 transition-colors">Movies</a>
    </div>
  </div>

  <div class="flex items-center gap-5">
    <button class="text-gray-300 hover:text-white transition-colors">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
      </svg>
    </button>
    <a href="https://github.com/Ppunpprem/TOC_movie_website" target="_blank" class="github-btn">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577
          0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755
          -1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236
          1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466
          -1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176
          0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405
          2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84
          1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81
          2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795
          24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
      GitHub Repo
    </a>
  </div>
</nav>

<!-- HERO SECTION -->
<div class="hero-bg" id="hero">
  <img id="hero-img" class="hero-img" src="" alt=""/>
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <div class="flex items-center gap-2 mb-3">
      <span class="imdb-badge">IMDb</span>
      <span id="hero-rating" class="text-yellow-400 font-bold text-lg"></span>
      <span class="text-gray-400 text-sm">/10</span>
    </div>
    <h1 id="hero-title" class="text-5xl font-bold mb-3 leading-tight" style="font-family:'Bebas Neue',cursive; letter-spacing:1px;"></h1>
    <p id="hero-year" class="text-gray-400 text-sm mb-3"></p>
    <p id="hero-plot" class="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3"></p>
    <button class="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      PLAY
    </button>
  </div>
  <div class="hero-progress">
    <div class="hero-progress-bar" id="progress-bar"></div>
  </div>
</div>

<!-- MAIN CONTENT -->
<div class="px-10 py-10 max-w-screen-xl mx-auto">

  <!-- TRENDING -->
  <div class="mb-10">
    <div class="flex items-center justify-between mb-4">
      <h2 class="section-title">Trending</h2>
      <a href="#" class="text-red-500 text-sm hover:text-red-400 transition-colors flex items-center gap-1">
        See more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>
    </div>
    <div class="scroll-row" id="trending-row"></div>
  </div>

  <!-- NEW ARRIVAL -->
  <div class="mb-10">
    <div class="flex items-center justify-between mb-4">
      <h2 class="section-title">New Arrival</h2>
      <a href="#" class="text-red-500 text-sm hover:text-red-400 transition-colors flex items-center gap-1">
        See more <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
      </a>
    </div>
    <div class="scroll-row" id="arrival-row"></div>
  </div>

  <!-- POPULAR TOP 10 IN GENRES -->
  <div class="mb-10">
    <h2 class="section-title mb-5">Popular Top 10 In Genres</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4" id="genre-grid"></div>
  </div>

</div>

<script>
  // ── DATA ────────────────────────────────────────────────────────────────────
  // Using OMDB API free tier (no key needed for poster URLs via IMDB)
  // We'll use The Movie DB open data or hardcode popular movies with poster links

  const movies = [
    { title: "The Shawshank Redemption", year: "1994", rating: 9.3, poster: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg", plot: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
    { title: "The Godfather", year: "1972", rating: 9.2, poster: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", plot: "The aging patriarch of an organized crime dynasty in postwar New York City transfers control of his clandestine empire to his reluctant youngest son." },
    { title: "The Dark Knight", year: "2008", rating: 9.0, poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg", plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." },
    { title: "Schindler's List", year: "1993", rating: 9.0, poster: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTk3ODMtZjcxNzE3Y2I0OGQ1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg", plot: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis." },
    { title: "Pulp Fiction", year: "1994", rating: 8.9, poster: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", plot: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." },
    { title: "Forrest Gump", year: "1994", rating: 8.8, poster: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg", plot: "The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold from the perspective of an Alabama man with an IQ of 75." },
    { title: "Inception", year: "2010", rating: 8.8, poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg", plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O." },
    { title: "The Matrix", year: "1999", rating: 8.7, poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVlLTM5YTctZjEwM2QxZjhmZmFhXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg", plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth — the life he knows is the elaborate deception of an evil cyber-intelligence." },
    { title: "Goodfellas", year: "1990", rating: 8.7, poster: "https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDItZTVmMi00YzE3LWI1YjAtNjY1ZTVjYTAxZjAzXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", plot: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito in the Italian-American crime syndicate." },
    { title: "Interstellar", year: "2014", rating: 8.7, poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg", plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival." },
    { title: "Fight Club", year: "1999", rating: 8.8, poster: "https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg", plot: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more." },
    { title: "The Silence of the Lambs", year: "1991", rating: 8.6, poster: "https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg", plot: "A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer, a madman who skins his victims." },
    { title: "Parasite", year: "2019", rating: 8.5, poster: "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg", plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan." },
    { title: "Avengers: Endgame", year: "2019", rating: 8.4, poster: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg", plot: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe." },
    { title: "Joker", year: "2019", rating: 8.4, poster: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg", plot: "In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime." },
    { title: "Dune", year: "2021", rating: 8.0, poster: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg", plot: "A noble family becomes embroiled in a war for control over the galaxy's most valuable asset while its heir becomes troubled by visions of a dark future." },
  ];

  const genres = [
    { name: "Action", color: "#e50914", img: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg" },
    { name: "Adventure", color: "#f5a623", img: "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg" },
    { name: "Comedy", color: "#4a90d9", img: "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg" },
    { name: "Drama", color: "#7b68ee", img: "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTk3ODMtZjcxNzE3Y2I0OGQ1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg" },
  ];

  // ── HERO SLIDESHOW ──────────────────────────────────────────────────────────
  let heroIndex = 0;
  let progressInterval = null;
  const heroMovies = [...movies].sort(() => Math.random() - 0.5).slice(0, 6);
  const HERO_DURATION = 8000; // 8 seconds

  function setHero(movie) {
    const img = document.getElementById('hero-img');
    img.classList.add('fade-out');
    setTimeout(() => {
      img.src = movie.poster;
      document.getElementById('hero-title').textContent = movie.title;
      document.getElementById('hero-rating').textContent = movie.rating;
      document.getElementById('hero-year').textContent = movie.year + ' • IMDb Top 250';
      document.getElementById('hero-plot').textContent = movie.plot;
      img.classList.remove('fade-out');
    }, 400);
  }

  function startProgress() {
    clearInterval(progressInterval);
    const bar = document.getElementById('progress-bar');
    bar.style.transition = 'none';
    bar.style.width = '0%';
    setTimeout(() => {
      bar.style.transition = `width ${HERO_DURATION}ms linear`;
      bar.style.width = '100%';
    }, 50);
  }

  function nextHero() {
    heroIndex = (heroIndex + 1) % heroMovies.length;
    setHero(heroMovies[heroIndex]);
    startProgress();
  }

  setHero(heroMovies[0]);
  startProgress();
  setInterval(nextHero, HERO_DURATION);

  // ── MOVIE CARD ──────────────────────────────────────────────────────────────
  function createCard(movie) {
    const div = document.createElement('div');
    div.className = 'movie-card';
    div.innerHTML = `
      <img src="${movie.poster}" alt="${movie.title}" loading="lazy"
           onerror="this.src='https://via.placeholder.com/180x270/1a1a1a/666?text=No+Image'"/>
      <div class="mt-2">
        <p class="text-white text-sm font-medium truncate">${movie.title}</p>
        <div class="flex items-center gap-1 mt-1">
          <span class="imdb-badge">IMDb</span>
          <span class="text-yellow-400 text-xs font-bold">${movie.rating}</span>
          <span class="text-gray-500 text-xs">/10</span>
        </div>
        <p class="text-gray-500 text-xs mt-0.5">${movie.year}</p>
      </div>
    `;
    return div;
  }

  // ── POPULATE ROWS ───────────────────────────────────────────────────────────
  function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

  const trendingRow = document.getElementById('trending-row');
  shuffle(movies).slice(0, 8).forEach(m => trendingRow.appendChild(createCard(m)));

  const arrivalRow = document.getElementById('arrival-row');
  shuffle(movies).slice(0, 8).forEach(m => arrivalRow.appendChild(createCard(m)));

  // ── GENRE GRID ──────────────────────────────────────────────────────────────
  const genreGrid = document.getElementById('genre-grid');
  genres.forEach(g => {
    const div = document.createElement('div');
    div.className = 'genre-card';
    div.innerHTML = `
      <img src="${g.img}" alt="${g.name}"/>
      <div class="genre-card-overlay">
        <div>
          <span class="text-xs font-semibold px-2 py-0.5 rounded text-white mb-1 inline-block"
                style="background:${g.color}">Top 10 In</span>
          <p class="text-white font-bold text-sm mt-1">${g.name} →</p>
        </div>
      </div>
    `;
    genreGrid.appendChild(div);
  });
</script>
</body>
</html>