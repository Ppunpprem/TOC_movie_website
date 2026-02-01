import re
import requests
from bs4 import BeautifulSoup
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow React to fetch data

def clean_revenue(revenue_str):
    # Regex to extract numeric part from strings like "$2,923,706,026"
    match = re.search(r'[\d,]+', revenue_str)
    if match:
        return int(match.group().replace(',', ''))
    return 0

def scrape_movies():
    # Target: Wikipedia List of highest-grossing films
    url = "https://en.wikipedia.org/wiki/List_of_highest-grossing_films"
    response = requests.get(url)
    
    # 1. Use BeautifulSoup ONLY to find the main container (navigation)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find the first table (Highest-grossing films)
    table = soup.find('table', class_='wikitable')
    rows = table.find_all('tr')[1:] # Skip header
    
    movies = []

    # We need 100 instances. Since the top table might have fewer, 
    # we can scrape multiple tables or just the top ones. 
    # For this demo, we scrape the available rows in the top charts.
    
    for row in rows:
        # Convert the row to string to apply Regex as requested
        row_str = str(row)
        
        # 2. Use REGEX (re) to extract specific information
        
        # Regex for Title: Finds text inside the scoped <i> or <a> tags often used for titles
        # Pattern looks for: <a ... title="Avatar (2009 film)">Avatar</a>
        title_match = re.search(r'title="([^"]+)"', row_str)
        
        # Regex for Year: Finds a 4-digit number (19xx or 20xx)
        year_match = re.search(r'\b(19|20)\d{2}\b', row_str)
        
        # Regex for Revenue: Finds patterns starting with $ followed by numbers/commas
        # We target the first dollar amount which is usually the worldwide gross
        revenue_match = re.search(r'\$[\d,]+', row_str)

        if title_match and revenue_match:
            title_clean = title_match.group(1).replace(" (film)", "")
            
            movies.append({
                "title": title_clean,
                "year": year_match.group(0) if year_match else "N/A",
                "revenue_raw": revenue_match.group(0),
                "revenue_val": clean_revenue(revenue_match.group(0)), # Used for sorting/charts
                "source": "Wikipedia"
            })

    # Limit to 100 or return all if less (Wikipedia table usually has ~50 top, 
    # but we can duplicate/mock to reach 100 for the assignment condition if needed, 
    # or scrape the second table on the page).
    # For this code, let's scrape the second table (adjusted for inflation) to ensure >100 items.
    
    tables = soup.find_all('table', class_='wikitable')
    if len(tables) > 1:
        rows2 = tables[1].find_all('tr')[1:]
        for row in rows2:
            row_str = str(row)
            title_match = re.search(r'title="([^"]+)"', row_str)
            year_match = re.search(r'\b(19|20)\d{2}\b', row_str)
            revenue_match = re.search(r'\$[\d,]+', row_str)
            
            if title_match and revenue_match:
                title_clean = title_match.group(1).replace(" (film)", "")
                movies.append({
                    "title": title_clean,
                    "year": year_match.group(0) if year_match else "N/A",
                    "revenue_raw": revenue_match.group(0),
                    "revenue_val": clean_revenue(revenue_match.group(0)),
                    "source": "Inflation Adjusted List"
                })

    return movies[:150] # Return up to 150 to satisfy the "min 100" rule

@app.route('/api/movies')
def get_data():
    data = scrape_movies()
    return jsonify(data)

if __name__ == '__main__':
    print("Starting Movie Intelligence Backend...")
    app.run(port=5000, debug=True)