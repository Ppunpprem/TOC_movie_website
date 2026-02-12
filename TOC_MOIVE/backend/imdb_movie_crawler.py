import re
import requests
from bs4 import BeautifulSoup
import json

class IMDbMovieCrawler:
    def __init__(self):
        self.url = "https://www.imdb.com/chart/top/"
        self.movies = []
        
    def fetch_page(self):
        """Fetch IMDb Top 250 page"""
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            }
            print("Fetching IMDb Top 250 movies...")
            response = requests.get(self.url, headers=headers, timeout=15)
            response.raise_for_status()
            print("✓ Page fetched successfully!\n")
            return response.text
        except requests.RequestException as e:
            print(f"✗ Error fetching page: {e}")
            return None
    
    def extract_movies(self, html):
        """Extract movie information from IMDb Top 250"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # Try to find script tag with JSON data first (more reliable)
        script_tags = soup.find_all('script', type='application/ld+json')
        for script in script_tags:
            try:
                data = json.loads(script.string)
                if isinstance(data, dict) and 'itemListElement' in data:
                    return self._extract_from_json(data)
            except:
                continue
        
        # Fallback to HTML parsing
        print("Using HTML parsing method...")
        return self._extract_from_html(soup)
    
    def _extract_from_json(self, data):
        """Extract movies from JSON-LD structured data"""
        print("Found JSON-LD data. Extracting...")
        
        items = data.get('itemListElement', [])
        print(f"Found {len(items)} movies in JSON data.\n")
        
        for item in items:
            try:
                movie_data = {}
                movie_item = item.get('item', {})
                
                # Rank
                movie_data['rank'] = item.get('position', 0)
                
                # Title
                movie_data['title'] = movie_item.get('name', 'N/A')
                
                # URL
                url = movie_item.get('url', '')
                if url:
                    movie_data['url'] = f"https://www.imdb.com{url}" if url.startswith('/') else url
                
                # Image
                image = movie_item.get('image', '')
                if image:
                    movie_data['image'] = image
                
                # Rating
                rating_data = movie_item.get('aggregateRating', {})
                if rating_data:
                    rating_value = rating_data.get('ratingValue')
                    if rating_value:
                        movie_data['rating'] = float(rating_value)
                    
                    rating_count = rating_data.get('ratingCount')
                    if rating_count:
                        movie_data['rating_count'] = int(rating_count)
                
                # Get additional info from description or URL
                description = movie_item.get('description', '')
                if description:
                    # Extract year from description
                    year_match = re.search(r'\b(19|20)\d{2}\b', description)
                    if year_match:
                        movie_data['year'] = int(year_match.group(0))
                
                self.movies.append(movie_data)
                
            except Exception as e:
                print(f"Error parsing movie at position {item.get('position', '?')}: {e}")
                continue
        
        print(f"✓ Successfully extracted {len(self.movies)} movies\n")
        return self.movies
    
    def _extract_from_html(self, soup):
        """Fallback HTML extraction method"""
        # Find all list items
        movie_items = soup.find_all('li', class_=re.compile(r'ipc-metadata-list-summary-item'))
        
        print(f"Found {len(movie_items)} movie items. Extracting details...\n")
        
        for idx, item in enumerate(movie_items, 1):
            try:
                movie_data = {}
                movie_data['rank'] = idx
                
                # Extract title - try multiple selectors
                title_elem = (
                    item.find('h3', class_=re.compile(r'ipc-title')) or
                    item.find('a', href=re.compile(r'/title/tt\d+/'))
                )
                
                if title_elem:
                    title_text = title_elem.get_text(strip=True)
                    # Remove rank number if present (e.g., "1. The Shawshank Redemption")
                    title_match = re.search(r'^\d+\.\s*(.+)', title_text)
                    movie_data['title'] = title_match.group(1) if title_match else title_text
                
                # Extract URL
                link = item.find('a', href=re.compile(r'/title/tt\d+/'))
                if link and link.get('href'):
                    movie_data['url'] = f"https://www.imdb.com{link['href']}"
                
                # Extract metadata (year, duration, rating)
                metadata_items = item.find_all('span', class_=re.compile(r'cli-title-metadata-item'))
                
                for meta in metadata_items:
                    text = meta.get_text(strip=True)
                    
                    # Check for year
                    if re.match(r'^\d{4}$', text):
                        movie_data['year'] = int(text)
                    
                    # Check for duration
                    elif re.search(r'\d+h|\d+m', text):
                        movie_data['duration'] = text
                
                # Extract rating
                rating_elem = item.find('span', class_=re.compile(r'ipc-rating-star'))
                if rating_elem:
                    rating_text = rating_elem.get_text(strip=True)
                    rating_match = re.search(r'(\d+\.?\d*)', rating_text)
                    if rating_match:
                        movie_data['rating'] = float(rating_match.group(1))
                
                # Add if we have at least title
                if 'title' in movie_data:
                    self.movies.append(movie_data)
                    
            except Exception as e:
                print(f"Error parsing movie {idx}: {e}")
                continue
        
        print(f"✓ Successfully extracted {len(self.movies)} movies\n")
        return self.movies
    
    def filter_movies(self, filters):
        """Filter movies based on user criteria"""
        filtered = self.movies.copy()
        
        # Filter by title keyword
        if filters.get('title_keyword'):
            keyword = filters['title_keyword']
            pattern = re.compile(keyword, re.IGNORECASE)
            filtered = [m for m in filtered if 'title' in m and pattern.search(m['title'])]
        
        # Filter by year range
        if filters.get('year_start') or filters.get('year_end'):
            year_start = filters.get('year_start', 0)
            year_end = filters.get('year_end', 9999)
            filtered = [m for m in filtered if 'year' in m and 
                       year_start <= m['year'] <= year_end]
        
        # Filter by minimum rating
        if filters.get('min_rating'):
            min_rating = filters['min_rating']
            filtered = [m for m in filtered if 'rating' in m and 
                       m['rating'] >= min_rating]
        
        # Filter by maximum rating
        if filters.get('max_rating'):
            max_rating = filters['max_rating']
            filtered = [m for m in filtered if 'rating' in m and 
                       m['rating'] <= max_rating]
        
        # Filter by rank range
        if filters.get('rank_start') or filters.get('rank_end'):
            rank_start = filters.get('rank_start', 1)
            rank_end = filters.get('rank_end', 250)
            filtered = [m for m in filtered if 'rank' in m and 
                       rank_start <= m['rank'] <= rank_end]
        
        return filtered
    
    def display_movies(self, movies, limit=None):
        """Display movies in a formatted way"""
        if not movies:
            print("No movies found matching your criteria.\n")
            return
        
        display_list = movies[:limit] if limit else movies
        
        print(f"\n{'='*90}")
        print(f"Found {len(movies)} movie(s) matching your criteria")
        print(f"{'='*90}\n")
        
        for movie in display_list:
            print(f"🏆 Rank: #{movie.get('rank', 'N/A')}")
            print(f"🎬 Title: {movie.get('title', 'N/A')}")
            
            if 'year' in movie:
                print(f"📅 Year: {movie['year']}")
            
            if 'rating' in movie:
                stars = '⭐' * int(movie['rating'])
                print(f"⭐ Rating: {movie['rating']}/10 {stars}")
            
            if 'rating_count' in movie:
                print(f"👥 Votes: {movie['rating_count']:,}")
            
            if 'duration' in movie:
                print(f"⏱️  Duration: {movie['duration']}")
            
            if 'url' in movie:
                print(f"🔗 URL: {movie['url']}")
            
            print("-" * 90)
        
        if limit and len(movies) > limit:
            print(f"\n(Showing {limit} of {len(movies)} results)\n")
    
    def get_user_filters(self):
        """Get filter criteria from user input"""
        print("\n" + "="*90)
        print(" " * 30 + "IMDb TOP 250 MOVIE FILTER")
        print("="*90)
        print("\nEnter your filter criteria (press Enter to skip any filter):\n")
        
        filters = {}
        
        # Title keyword
        title_input = input("🎬 Search in movie title (keyword): ").strip()
        if title_input:
            filters['title_keyword'] = title_input
        
        # Year range
        year_start = input("📅 Year from (e.g., 1990): ").strip()
        if year_start and year_start.isdigit():
            filters['year_start'] = int(year_start)
        
        year_end = input("📅 Year to (e.g., 2024): ").strip()
        if year_end and year_end.isdigit():
            filters['year_end'] = int(year_end)
        
        # Rating range
        min_rating = input("⭐ Minimum rating (e.g., 8.5): ").strip()
        if min_rating:
            try:
                filters['min_rating'] = float(min_rating)
            except ValueError:
                print("Invalid rating, skipping...")
        
        max_rating = input("⭐ Maximum rating (e.g., 9.0): ").strip()
        if max_rating:
            try:
                filters['max_rating'] = float(max_rating)
            except ValueError:
                print("Invalid rating, skipping...")
        
        # Rank range
        rank_start = input("🏆 Rank from (1-250): ").strip()
        if rank_start and rank_start.isdigit():
            filters['rank_start'] = int(rank_start)
        
        rank_end = input("🏆 Rank to (1-250): ").strip()
        if rank_end and rank_end.isdigit():
            filters['rank_end'] = int(rank_end)
        
        return filters
    
    def run(self):
        """Main execution method"""
        # Fetch and extract movies
        html = self.fetch_page()
        if not html:
            print("Failed to fetch data. Please try again later.")
            return
        
        self.extract_movies(html)
        
        if not self.movies:
            print("No movies extracted. Please check your internet connection or try again later.")
            return
        
        # Interactive filter loop
        while True:
            filters = self.get_user_filters()
            
            # Apply filters
            filtered_movies = self.filter_movies(filters)
            
            # Display results
            self.display_movies(filtered_movies, limit=20)
            
            # Ask if user wants to filter again
            print("\n")
            again = input("Would you like to apply different filters? (y/n): ").strip().lower()
            if again != 'y':
                print("\n✓ Thank you for using IMDb Movie Crawler!\n")
                break


if __name__ == "__main__":
    try:
        crawler = IMDbMovieCrawler()
        crawler.run()
    except KeyboardInterrupt:
        print("\n\n✓ Program terminated by user.\n")
    except Exception as e:
        print(f"\n✗ An error occurred: {e}\n")
        import traceback
        traceback.print_exc()