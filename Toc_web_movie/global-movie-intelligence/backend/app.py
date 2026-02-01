"""
Flask API Backend for Movie Intelligence Platform
Serves scraped movie data with analysis endpoints
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from collections import Counter
import re

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

def load_movies_data():
    """Load movies data from JSON file"""
    if os.path.exists('movies_data.json'):
        with open('movies_data.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

@app.route('/api/movies', methods=['GET'])
def get_movies():
    """Get all movies"""
    movies = load_movies_data()
    return jsonify({
        'success': True,
        'total': len(movies),
        'movies': movies
    })

@app.route('/api/movies/search', methods=['GET'])
def search_movies():
    """Search movies by title"""
    query = request.args.get('q', '').lower()
    movies = load_movies_data()
    
    if query:
        filtered = [m for m in movies if query in m.get('title', '').lower()]
    else:
        filtered = movies
    
    return jsonify({
        'success': True,
        'total': len(filtered),
        'movies': filtered
    })

@app.route('/api/movies/top-revenue', methods=['GET'])
def top_revenue():
    """Get top 10 movies by box office revenue"""
    movies = load_movies_data()
    limit = int(request.args.get('limit', 10))
    
    # Extract revenue numbers using regex and sort
    movies_with_revenue = []
    for movie in movies:
        boxoffice = movie.get('boxoffice', 'N/A')
        if boxoffice != 'N/A':
            # Extract numbers using regex
            numbers = re.findall(r'[\d,]+', boxoffice.replace('$', ''))
            if numbers:
                revenue = int(numbers[0].replace(',', ''))
                movies_with_revenue.append({
                    **movie,
                    'revenue_num': revenue
                })
    
    # Sort by revenue
    sorted_movies = sorted(movies_with_revenue, key=lambda x: x['revenue_num'], reverse=True)
    
    return jsonify({
        'success': True,
        'total': len(sorted_movies[:limit]),
        'movies': sorted_movies[:limit]
    })

@app.route('/api/movies/by-country', methods=['GET'])
def movies_by_country():
    """Get movie distribution by country"""
    movies = load_movies_data()
    
    countries = []
    for movie in movies:
        country = movie.get('country', 'N/A')
        if country != 'N/A':
            countries.append(country)
    
    country_counts = Counter(countries)
    
    distribution = [
        {'country': country, 'count': count}
        for country, count in country_counts.most_common()
    ]
    
    return jsonify({
        'success': True,
        'total': len(distribution),
        'distribution': distribution
    })

@app.route('/api/movies/by-genre', methods=['GET'])
def movies_by_genre():
    """Get movie distribution by genre"""
    movies = load_movies_data()
    
    genres = []
    for movie in movies:
        genre = movie.get('genre', 'N/A')
        if genre != 'N/A':
            # Split multiple genres
            genre_list = re.split(r',\s*', genre)
            genres.extend(genre_list)
    
    genre_counts = Counter(genres)
    
    distribution = [
        {'genre': genre, 'count': count}
        for genre, count in genre_counts.most_common()
    ]
    
    return jsonify({
        'success': True,
        'total': len(distribution),
        'distribution': distribution
    })

@app.route('/api/movies/oscar-winners', methods=['GET'])
def oscar_winners():
    """Get movies with Oscar wins"""
    movies = load_movies_data()
    
    winners = []
    for movie in movies:
        awards = movie.get('awards', 'N/A')
        if awards != 'N/A' and 'Oscar' in awards:
            # Extract number of Oscars using regex
            oscar_match = re.search(r'(\d+)\s+Oscar', awards)
            if oscar_match:
                oscar_count = int(oscar_match.group(1))
                winners.append({
                    **movie,
                    'oscar_count': oscar_count
                })
    
    # Sort by Oscar count
    winners = sorted(winners, key=lambda x: x['oscar_count'], reverse=True)
    
    return jsonify({
        'success': True,
        'total': len(winners),
        'movies': winners
    })

@app.route('/api/movies/top-rated', methods=['GET'])
def top_rated():
    """Get top rated movies"""
    movies = load_movies_data()
    limit = int(request.args.get('limit', 10))
    
    # Filter movies with valid ratings
    movies_with_ratings = []
    for movie in movies:
        rating = movie.get('rating', 'N/A')
        if rating != 'N/A':
            try:
                rating_num = float(rating)
                movies_with_ratings.append({
                    **movie,
                    'rating_num': rating_num
                })
            except ValueError:
                continue
    
    # Sort by rating
    sorted_movies = sorted(movies_with_ratings, key=lambda x: x['rating_num'], reverse=True)
    
    return jsonify({
        'success': True,
        'total': len(sorted_movies[:limit]),
        'movies': sorted_movies[:limit]
    })

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall statistics"""
    movies = load_movies_data()
    
    total_movies = len(movies)
    
    # Count movies with ratings
    rated_movies = [m for m in movies if m.get('rating', 'N/A') != 'N/A']
    
    # Calculate average rating
    if rated_movies:
        ratings = [float(m['rating']) for m in rated_movies if m.get('rating', 'N/A') != 'N/A']
        avg_rating = sum(ratings) / len(ratings) if ratings else 0
    else:
        avg_rating = 0
    
    # Count unique countries
    countries = set(m.get('country', 'N/A') for m in movies if m.get('country', 'N/A') != 'N/A')
    
    # Count unique genres
    genres = set()
    for movie in movies:
        genre = movie.get('genre', 'N/A')
        if genre != 'N/A':
            genre_list = re.split(r',\s*', genre)
            genres.update(genre_list)
    
    return jsonify({
        'success': True,
        'stats': {
            'total_movies': total_movies,
            'average_rating': round(avg_rating, 2),
            'total_countries': len(countries),
            'total_genres': len(genres),
            'rated_movies': len(rated_movies)
        }
    })

if __name__ == '__main__':
    # Check if data file exists
    if not os.path.exists('movies_data.json'):
        print("Warning: movies_data.json not found. Run scraper.py first.")
        # Create empty data file
        with open('movies_data.json', 'w') as f:
            json.dump([], f)
    
    print("Starting Flask server on http://localhost:5000")
    app.run(debug=True, port=5000)