import requests
import json
import mwparserfromhell
import re

def extract_internal_links(title):
    print(f"Extracting internal links from '{title}' page...")
    S = requests.Session()
    URL = "https://en.wikipedia.org/w/api.php"
    PARAMS = {
        "action": "query",
        "prop": "revisions",
        "rvprop": "content",
        "rvslots": "main",
        "titles": title,
        "format": "json",
        "formatversion": "2",
    }
    R = S.get(url=URL, params=PARAMS)
    DATA = R.json()
    wikitext = DATA["query"]["pages"][0]["revisions"][0]["slots"]["main"]["content"]
    wikicode = mwparserfromhell.parse(wikitext)
    sections_to_remove = ['references', 'sources', 'further reading', 'external links']
    for section in wikicode.get_sections():
        if section.filter_headings():
            section_title = str(section.filter_headings()[0].title).strip().lower()
            if section_title in sections_to_remove:
                wikicode.remove(section)
    links = [re.sub(r'\(.*\)', '', str(link.title)).lower() for link in wikicode.filter_wikilinks()]
    print(f"Extracted {len(links)} links from '{title}' page.")
    return links

links = extract_internal_links('Biology')

for link in links:
    print(link)