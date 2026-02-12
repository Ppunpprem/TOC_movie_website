from bs4 import BeautifulSoup
import requests
import re

url = "https://www.imdb.com/chart/top/"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
}

page = requests.get(url, headers=HEADERS)

print(page.status_code)  # Should be 200 if successful

soup = BeautifulSoup(page.text, "html.parser")
# print(soup.prettify())
print(soup.title)