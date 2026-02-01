"""
Global Movie Intelligence Platform - Web Scraper
Scrapes movie data from IMDb using BeautifulSoup and regex
ALL data extraction uses Python's re module (regular expressions)
"""

import requests
from bs4 import BeautifulSoup
import re
import json
import time
from typing import List, Dict
import random

class MovieScraper:
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        self.base_url = 'https://www.imdb.com'
        
    def extract_with_regex(self, html_content: str, pattern: str, group: int = 1) -> str:
        """Extract data using regular expressions"""
        match = re.search(pattern, html_content, re.DOTALL | re.IGNORECASE)
        return match.group(group).strip() if match else 'N/A'
    
    def extract_all_with_regex(self, html_content: str, pattern: str) -> List[str]:
        """Extract all matches using regular expressions"""
        matches = re.findall(pattern, html_content, re.DOTALL | re.IGNORECASE)
        return [m.strip() for m in matches] if matches else []
    
    def clean_text(self, text: str) -> str:
        """Clean extracted text using regex"""
        if not text or text == 'N/A':
            return text
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove HTML entities
        text = re.sub(r'&[a-z]+;', '', text)
        # Clean up
        text = re.sub(r'^\s+|\s+$', '', text)
        return text.strip()
    
    def extract_number(self, text: str) -> str:
        """Extract numbers from text using regex"""
        match = re.search(r'[\d,]+\.?\d*', text)
        return match.group(0) if match else 'N/A'
    
    def extract_thumbnail(self, html_content: str) -> str:
        """Extract movie poster/thumbnail URL using regex"""
        # Try to find poster image in various formats
        patterns = [
            r'<img[^>]*class="[^"]*ipc-image[^"]*"[^>]*src="([^"]+)"',
            r'<img[^>]*src="(https://m\.media-amazon\.com/images/M/[^"]+\.jpg)"',
            r'"image":\s*"(https://m\.media-amazon\.com/images/M/[^"]+)"',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, html_content, re.IGNORECASE)
            if match:
                url = match.group(1)
                # Clean up thumbnail URL (remove size parameters for better quality)
                url = re.sub(r'_V1_.*?\.jpg', '_V1_FMjpg_UX1000_.jpg', url)
                return url
        
        return 'N/A'
    
    def scrape_top_movies(self, limit: int = 150) -> List[Dict]:
        """Scrape top rated movies from IMDb"""
        print(f"Scraping top {limit} movies from IMDb...")
        movies = []
        
        try:
            # Get top 250 movies list
            url = f"{self.base_url}/chart/top/"
            response = requests.get(url, headers=self.headers)
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extract movie links using regex on HTML
            html_content = str(soup)
            # Pattern to find movie title links
            movie_links = re.findall(r'href="(/title/tt\d+/)[^"]*"', html_content)
            # Remove duplicates and limit
            movie_links = list(dict.fromkeys(movie_links))[:limit]
            
            print(f"Found {len(movie_links)} movie links")
            
            for idx, movie_path in enumerate(movie_links):
                try:
                    print(f"Scraping movie {idx + 1}/{len(movie_links)}")
                    movie_data = self.scrape_movie_details(movie_path)
                    if movie_data:
                        movies.append(movie_data)
                    
                    # Rate limiting
                    time.sleep(random.uniform(1, 2))
                    
                except Exception as e:
                    print(f"Error scraping {movie_path}: {e}")
                    continue
                    
        except Exception as e:
            print(f"Error scraping top movies: {e}")
        
        return movies
    
    def scrape_movie_details(self, movie_path: str) -> Dict:
        """Scrape detailed information for a single movie using regex"""
        try:
            url = f"{self.base_url}{movie_path}"
            response = requests.get(url, headers=self.headers)
            html = str(response.content.decode('utf-8'))
            
            movie_data = {}
            
            # Thumbnail - using regex to extract poster image
            movie_data['thumbnail'] = self.extract_thumbnail(html)
            
            # Title - using regex to extract from <title> tag
            title_pattern = r'<title>([^<(]+?)(?:\s*\(|</title>)'
            movie_data['title'] = self.clean_text(self.extract_with_regex(html, title_pattern))
            
            # Release Date (Year) - using regex to find year in parentheses
            year_pattern = r'<title>[^<]*\((\d{4})\)'
            movie_data['year'] = self.extract_with_regex(html, year_pattern)
            
            # IMDb Rating - using regex to find rating value
            rating_pattern = r'"ratingValue"[:\s]*"?([\d.]+)"?'
            movie_data['imdb_rating'] = self.extract_with_regex(html, rating_pattern)
            
            # Metacritic Score - using regex
            metacritic_pattern = r'"metacriticScore"[:\s]*(\d+)'
            metacritic = self.extract_with_regex(html, metacritic_pattern)
            movie_data['metacritic_score'] = metacritic if metacritic != 'N/A' else 'N/A'
            
            # Rotten Tomatoes - Often not on IMDb, set as N/A
            movie_data['rotten_tomatoes_score'] = 'N/A'
            
            # Runtime - using regex
            runtime_pattern = r'"duration"[:\s]*"PT(\d+)M"'
            runtime = self.extract_with_regex(html, runtime_pattern)
            movie_data['runtime'] = f"{runtime} min" if runtime != 'N/A' else 'N/A'
            
            # Genre - using regex to find genre in JSON-LD
            genre_pattern = r'"genre"[:\s]*\[([^\]]+)\]'
            genres_text = self.extract_with_regex(html, genre_pattern)
            if genres_text != 'N/A':
                # Extract individual genres using regex
                genre_list = re.findall(r'"([^"]+)"', genres_text)
                movie_data['genre'] = ', '.join(genre_list[:3])
            else:
                # Alternative pattern for genre
                alt_genre_pattern = r'"genre"[:\s]*"([^"]+)"'
                genres = self.extract_all_with_regex(html, alt_genre_pattern)
                movie_data['genre'] = ', '.join(genres[:3]) if genres else 'N/A'
            
            # Director - using regex
            director_pattern = r'"director"[^}]*"name"[:\s]*"([^"]+)"'
            directors = self.extract_all_with_regex(html, director_pattern)
            movie_data['director'] = directors[0] if directors else 'N/A'
            
            # Main Actors - using regex
            actors_pattern = r'"actor"[^}]*"name"[:\s]*"([^"]+)"'
            actors = self.extract_all_with_regex(html, actors_pattern)
            movie_data['actors'] = ', '.join(actors[:5]) if actors else 'N/A'
            
            # Country - using regex
            country_pattern = r'"countryOfOrigin"[^}]*"name"[:\s]*"([^"]+)"'
            countries = self.extract_all_with_regex(html, country_pattern)
            movie_data['country'] = countries[0] if countries else 'N/A'
            
            # Language - using regex
            language_pattern = r'"inLanguage"[:\s]*"([^"]+)"'
            languages = self.extract_all_with_regex(html, language_pattern)
            movie_data['language'] = languages[0] if languages else 'N/A'
            
            # Production Company - using regex
            prod_pattern = r'"productionCompany"[^}]*"name"[:\s]*"([^"]+)"'
            prod_companies = self.extract_all_with_regex(html, prod_pattern)
            movie_data['production_company'] = ', '.join(prod_companies[:2]) if prod_companies else 'N/A'
            
            # Budget - using regex to find budget in the page
            budget_patterns = [
                r'Budget[^$€£]*[$€£]\s*([\d,]+(?:\.\d+)?(?:\s*(?:million|billion))?)',
                r'"budget"[^$€£]*[$€£]\s*([\d,]+)'
            ]
            budget = 'N/A'
            for pattern in budget_patterns:
                budget = self.extract_with_regex(html, pattern)
                if budget != 'N/A':
                    break
            movie_data['budget'] = f"${budget}" if budget != 'N/A' else 'N/A'
            
            # Box Office - using regex to find worldwide gross
            boxoffice_patterns = [
                r'(?:Gross worldwide|Cumulative Worldwide Gross)[^$€£]*[$€£]\s*([\d,]+(?:\.\d+)?)',
                r'"boxOffice"[^}]*"gross"[^$€£]*[$€£]\s*([\d,]+)'
            ]
            boxoffice = 'N/A'
            for pattern in boxoffice_patterns:
                boxoffice = self.extract_with_regex(html, pattern)
                if boxoffice != 'N/A':
                    break
            movie_data['boxoffice'] = f"${boxoffice}" if boxoffice != 'N/A' else 'N/A'
            
            # Awards - using regex to find Oscar/Golden Globe mentions
            awards_list = []
            
            # Oscar wins
            oscar_patterns = [
                r'Won\s+(\d+)\s+Oscar',
                r'(\d+)\s+Oscar[s]?\s+(?:win|won)',
                r'Academy Award[s]?.*?(\d+)\s+win'
            ]
            for pattern in oscar_patterns:
                oscar_wins = self.extract_with_regex(html, pattern)
                if oscar_wins != 'N/A':
                    awards_list.append(f"{oscar_wins} Oscar{'s' if int(oscar_wins) > 1 else ''}")
                    break
            
            # Golden Globe wins
            gg_patterns = [
                r'Won\s+(\d+)\s+Golden Globe',
                r'(\d+)\s+Golden Globe[s]?\s+(?:win|won)'
            ]
            for pattern in gg_patterns:
                gg_wins = self.extract_with_regex(html, pattern)
                if gg_wins != 'N/A':
                    awards_list.append(f"{gg_wins} Golden Globe{'s' if int(gg_wins) > 1 else ''}")
                    break
            
            # Total wins and nominations (alternative if specific awards not found)
            if not awards_list:
                total_wins_pattern = r'(\d+)\s+win[s]?'
                total_wins = self.extract_with_regex(html, total_wins_pattern)
                if total_wins != 'N/A':
                    awards_list.append(f"{total_wins} wins")
            
            movie_data['awards'] = ', '.join(awards_list) if awards_list else 'N/A'
            
            # Clean all text fields
            for key in movie_data:
                if isinstance(movie_data[key], str) and key != 'thumbnail':
                    movie_data[key] = self.clean_text(movie_data[key])
            
            return movie_data
            
        except Exception as e:
            print(f"Error scraping movie details: {e}")
            return None

def main():
    """Main function to scrape movies and save to JSON"""
    scraper = MovieScraper()
    
    # Scrape 100+ movies
    movies = scraper.scrape_top_movies(limit=120)
    
    print(f"\nScraped {len(movies)} movies successfully!")
    
    # Save to JSON file
    with open('movies_data.json', 'w', encoding='utf-8') as f:
        json.dump(movies, f, indent=2, ensure_ascii=False)
    
    print(f"Data saved to movies_data.json")
    
    # Print sample data
    if movies:
        print("\nSample movie data:")
        print(json.dumps(movies[0], indent=2))

if __name__ == "__main__":
    main()