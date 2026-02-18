from flask import Flask, jsonify, request
from flask_cors import CORS
from imdb_movie_crawler import IMDbMovieCrawler
import json

app = Flask(__name__)
CORS(app)

# Initialize the crawler
crawler = None
movies_cache = []

def init_crawler():
    global crawler, movies_cache
    if crawler is None:
        crawler = IMDbMovieCrawler()
        # Fetch and cache movies on startup
        if crawler.fetch_top_movies():
            movies_cache = crawler.movies[:50]  # Cache top 50 movies
    return crawler, movies_cache

@app.route('/api/movies', methods=['GET'])
def get_movies():
    """Get all movies or filtered by category"""
    init_crawler()
    
    category = request.args.get('category', 'all')
    limit = request.args.get('limit', 50, type=int)
    
    # Prepare movie data with normalized fields
    movies_data = []
    for movie in movies_cache[:limit]:
        movie_dict = {
            'id': movie.get('id', ''),
            'rank': movie.get('rank', 0),
            'title': movie.get('title', 'Unknown'),
            'year': movie.get('year', 0),
            'rating': movie.get('rating', 0),
            'poster': movie.get('poster', ''),
            'plot': movie.get('plot', 'No description available'),
            'url': movie.get('url', '')
        }
        movies_data.append(movie_dict)
    
    return jsonify({
        'success': True,
        'count': len(movies_data),
        'movies': movies_data
    })

@app.route('/api/movies/trending', methods=['GET'])
def get_trending():
    """Get trending movies (top rated)"""
    init_crawler()
    
    limit = request.args.get('limit', 8, type=int)
    trending = sorted(movies_cache, key=lambda x: x.get('rating', 0), reverse=True)[:limit]
    
    movies_data = []
    for movie in trending:
        movie_dict = {
            'id': movie.get('id', ''),
            'rank': movie.get('rank', 0),
            'title': movie.get('title', 'Unknown'),
            'year': movie.get('year', 0),
            'rating': movie.get('rating', 0),
            'poster': movie.get('poster', ''),
            'plot': movie.get('plot', ''),
        }
        movies_data.append(movie_dict)
    
    return jsonify({
        'success': True,
        'count': len(movies_data),
        'movies': movies_data
    })

@app.route('/api/movies/new', methods=['GET'])
def get_new_arrival():
    """Get newest movies (by year)"""
    init_crawler()
    
    limit = request.args.get('limit', 8, type=int)
    new_movies = sorted(movies_cache, key=lambda x: x.get('year', 0), reverse=True)[:limit]
    
    movies_data = []
    for movie in new_movies:
        movie_dict = {
            'id': movie.get('id', ''),
            'rank': movie.get('rank', 0),
            'title': movie.get('title', 'Unknown'),
            'year': movie.get('year', 0),
            'rating': movie.get('rating', 0),
            'poster': movie.get('poster', ''),
            'plot': movie.get('plot', ''),
        }
        movies_data.append(movie_dict)
    
    return jsonify({
        'success': True,
        'count': len(movies_data),
        'movies': movies_data
    })

@app.route('/api/movies/<movie_id>', methods=['GET'])
def get_movie_detail(movie_id):
    """Get detailed information about a specific movie"""
    init_crawler()
    
    movie = crawler.get_movie_by_id(movie_id) if crawler else None
    
    if not movie:
        # Fallback search in cache
        for m in movies_cache:
            if m.get('id') == movie_id:
                movie = m
                break
    
    if not movie:
        return jsonify({
            'success': False,
            'message': 'Movie not found'
        }), 404
    
    movie_dict = {
        'id': movie.get('id', ''),
        'rank': movie.get('rank', 0),
        'title': movie.get('title', 'Unknown'),
        'year': movie.get('year', 0),
        'rating': movie.get('rating', 0),
        'poster': movie.get('poster', ''),
        'plot': movie.get('plot', ''),
        'genres': movie.get('genres', []),
        'director': movie.get('director', []),
        'cast': movie.get('cast', []),
        'runtime': movie.get('runtime', ''),
        'url': movie.get('url', '')
    }
    
    return jsonify({
        'success': True,
        'movie': movie_dict
    })

@app.route('/api/search', methods=['GET'])
def search_movies():
    """Search movies by title"""
    init_crawler()
    
    query = request.args.get('q', '').strip()
    
    if not query:
        return jsonify({
            'success': False,
            'message': 'Search query required'
        }), 400
    
    results = crawler.search_by_name(query) if crawler else []
    
    movies_data = []
    for movie in results:
        movie_dict = {
            'id': movie.get('id', ''),
            'rank': movie.get('rank', 0),
            'title': movie.get('title', 'Unknown'),
            'year': movie.get('year', 0),
            'rating': movie.get('rating', 0),
            'poster': movie.get('poster', ''),
            'plot': movie.get('plot', ''),
        }
        movies_data.append(movie_dict)
    
    return jsonify({
        'success': True,
        'count': len(movies_data),
        'query': query,
        'movies': movies_data
    })

@app.route('/api/genres', methods=['GET'])
def get_genres():
    """Get popular genres with sample movies"""
    genres = [
        {
            "name": "Action",
            "color": "#e50914",
            "img": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg"
        },
        {
            "name": "Adventure",
            "color": "#f5a623",
            "img": "https://m.media-amazon.com/images/M/MV5BN2FjNmEyNWMtYzM0ZS00NjIyLTg5YzYtYThlMGVjNzE1OGViXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg"
        },
        {
            "name": "Comedy",
            "color": "#4a90d9",
            "img": "https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg"
        },
        {
            "name": "Drama",
            "color": "#7b68ee",
            "img": "https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTk3ODMtZjcxNzE3Y2I0OGQ1XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_SX300.jpg"
        }
    ]
    
    return jsonify({
        'success': True,
        'genres': genres
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Movie API is running'
    })

if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)
