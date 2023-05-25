import openai
import re
import requests
import json
import mwparserfromhell

from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

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
    """This uses a regular expression (re.sub(r'\(.*\)', '', str(link.title))) 
    to remove anything in parentheses (including the parentheses themselves) from each link. 
    It also uses .strip() to remove any leading or trailing whitespace that might be left over after removing the parentheses."""
    links = [re.sub(r'\(.*\)', '', str(link.title)).lower().strip() for link in wikicode.filter_wikilinks()]
    print(f"Extracted {len(links)} links from '{title}' page.")
    return links

def main():
    start_page = "Biology"
    path = ["Biology", "Cell"]

    for i in range(len(path)-1):
        print("Proposed next page:", path[i+1])
        print(f"Checking if '{path[i+1]}' is in '{path[i]}' page...")
        links = extract_internal_links(path[i])
        if path[i+1].lower() in links:
            print(f"Found link to '{path[i+1]}' in '{path[i]}' page.")
        else:
            print(f"Did not find link to '{path[i+1]}' in '{path[i]}' page.")
            print(f"Here are all the links found in the '{path[i]}' page:")
            for link in links:
                print(f"  - {link}")

if __name__ == '__main__':
    main()


