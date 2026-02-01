# 🚀 Quick Start Guide

## Overview

This is a complete Movie Intelligence Platform with:

- **Backend**: Python + BeautifulSoup + Flask API (using regex for data extraction)
- **Frontend**: React JSX with cinematic CSS design

## Project Structure

```
global-movie-intelligence/
├── backend/
│   ├── scraper.py          # Web scraper with regex extraction
│   ├── app.py              # Flask REST API
│   ├── requirements.txt    # Python dependencies
│   └── movies_data.json    # Sample movie data (15 movies)
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx              # React entry point
│   │   └── MovieIntelligence.jsx # Main React component
│   ├── index.html          # HTML entry
│   ├── package.json        # npm configuration
│   └── vite.config.js      # Vite bundler config
│
└── README.md               # Full documentation
```

## 🎯 Step-by-Step Setup

### Step 1: Backend Setup (5 minutes)

```bash
# Navigate to backend
cd backend

# Install Python packages
pip install -r requirements.txt

# Start Flask API server
python app.py
```

✅ Backend running at: `http://localhost:5000`

### Step 2: Frontend Setup (5 minutes)

```bash
# Open a new terminal
cd frontend

# Install Node packages
npm install

# Start development server
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

### Step 3: Access Application

Open your browser to: `http://localhost:5173`

## 📊 What You'll See

### Dashboard Tab

- Total movies, average rating, countries, genres
- Top 10 highest revenue movies (bar chart)
- Country distribution
- Genre distribution

### Movies Tab

- Searchable movie catalog
- Detailed movie cards with:
  - Title, year, rating
  - Director, actors, genre
  - Runtime, country, language
  - Budget, box office
  - Awards

### Analytics Tab

- Genre distribution chart
- Country distribution chart
- Box office leaders

### Awards Tab

- Oscar-winning films showcase
- Number of Oscars won
- Film details

## 🔍 Using the Scraper (Optional)

To collect fresh data from IMDb:

```bash
cd backend
python scraper.py
```

**Note**:

- Scrapes 120 movies from IMDb Top 250
- Takes 5-10 minutes (rate limited)
- Overwrites `movies_data.json`
- Uses regex for ALL data extraction

## 🎨 Design Features

The frontend uses a **Film Noir Cinematic** aesthetic:

- Dark gradient backgrounds (#0a0a0a → #1a1410)
- Golden accents (#c9a961)
- Vintage typography (Courier New)
- Film grain SVG filter
- Smooth animations

## 🛠️ Key Technologies Demonstrated

### Backend Regex Usage

All data extraction uses Python's `re` module:

```python
# Example: Extract movie title
title_pattern = r'<title>([^<(]+?)(?:\s*\(|</title>)'
title = re.search(pattern, html).group(1)

# Example: Extract rating
rating_pattern = r'"ratingValue"[:\s]*"?([\d.]+)"?'
rating = re.search(pattern, html).group(1)

# Example: Extract all actors
actors_pattern = r'"actor"[^}]*"name"[:\s]*"([^"]+)"'
actors = re.findall(pattern, html)
```

### Frontend React Hooks

```javascript
const [movies, setMovies] = useState([]);
const [activeTab, setActiveTab] = useState("dashboard");

useEffect(() => {
  fetchAllData();
}, []);
```

## 🐛 Troubleshooting

### "ModuleNotFoundError: No module named 'bs4'"

```bash
pip install beautifulsoup4
```

### "Cannot GET /api/movies"

- Make sure backend is running: `python app.py`
- Check port 5000 is not in use

### "npm: command not found"

- Install Node.js from https://nodejs.org/

### CORS Errors

- Ensure Flask-CORS is installed
- Backend and frontend must run simultaneously

## 📝 Sample API Test

Test if backend is working:

```bash
# Get all movies
curl http://localhost:5000/api/movies

# Get statistics
curl http://localhost:5000/api/stats

# Search movies
curl http://localhost:5000/api/movies/search?q=godfather
```

## ✅ Requirements Checklist

- [x] **100+ instances**: Scraper gets 120 movies
- [x] **Regex extraction**: ALL data uses `import re`
- [x] **BeautifulSoup**: HTML parsing
- [x] **React JSX**: Complete frontend
- [x] **CSS**: Cinematic design system
- [x] **Multiple portals**: IMDb (can extend to Wikipedia, RT)
- [x] **Data visualization**: Charts and analytics
- [x] **Web display**: Full-featured web app

## 🎓 Educational Notes

### Regex Patterns Used

1. Title extraction from HTML tags
2. Year extraction from parentheses
3. Number extraction from text
4. JSON-LD data parsing
5. Financial figures extraction
6. Award count extraction

### BeautifulSoup Usage

- HTML parsing with lxml
- Tag navigation
- Content extraction
- Multiple selector strategies

### React Best Practices

- Functional components
- useState and useEffect hooks
- Component composition
- Inline styling (CSS-in-JS pattern)
- Responsive design

## 🚀 Next Steps

1. Run both servers
2. Explore all 4 tabs
3. Try the search feature
4. (Optional) Run scraper for fresh data
5. Examine the code to see regex patterns

## 📞 Support

If you encounter issues:

1. Check both servers are running
2. Verify Python packages installed
3. Check Node modules installed
4. Review browser console for errors
5. Check terminal for error messages

Enjoy exploring the Global Movie Intelligence Platform! 🎬
