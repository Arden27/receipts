# implementing the idea of six degree of separation

import requests
import json
import mwparserfromhell
from collections import deque

def get_internal_links(title):
    S = requests.Session()

    URL = "https://en.wikipedia.org/w/api.php"

    SEARCHPAGE = title

    PARAMS = {
        "action": "query",
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "titles": SEARCHPAGE,
        "format": "json",
        "formatversion": "2",
    }

    R = S.get(url=URL, params=PARAMS)
    DATA = R.json()

    wikitext = DATA["query"]["pages"][0]["revisions"][0]["slots"]["main"]["content"]
    wikicode = mwparserfromhell.parse(wikitext)

    links = [str(link.title) for link in wikicode.filter_wikilinks()]

    return links

def wikipedia_game(start, end):
    # Initialize the queue with the start page
    queue = deque([(start, [start])])
    visited = set()

    while queue:
        # Dequeue a page and its path
        current_page, path = queue.popleft()

        print(f"Checking {current_page}...")

        if current_page == end:
            # If we've found the end page, return the path
            return path

        if current_page not in visited:
            visited.add(current_page)

            try:
                # Enqueue all linked pages and their paths
                for link in get_internal_links(current_page):
                    new_path = path + [link]
                    queue.append((link, new_path))
            except:
                continue

    # If no path is found, return an error message
    return "No path found"

def main():
    start_page = "Biology"
    end_page = "Star"
    path = wikipedia_game(start_page, end_page)
    print(" -> ".join(path))

if __name__ == '__main__':
    main()
