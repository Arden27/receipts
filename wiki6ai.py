import openai
import re
import requests
import json
import mwparserfromhell
from colorama import Fore

from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")

redirected_to = None

def extract_internal_links(title):
    global redirected_to
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
        "redirects": 1,  # Resolve redirects
    }
    R = S.get(url=URL, params=PARAMS)
    DATA = R.json()

    # Check if the requested page got redirected
    if 'redirects' in DATA['query']:
        redirect = DATA['query']['redirects'][0]
        print(f"'{title}' REDIRECTED to '{redirect['to']}'. Using '{redirect['to']}' for link extraction.")
        title = redirect['to']
        redirected_to = title  # Update the redirected_to variable

    wikitext = DATA["query"]["pages"][0]["revisions"][0]["slots"]["main"]["content"]
    wikicode = mwparserfromhell.parse(wikitext)
    sections_to_remove = ['references', 'sources', 'further reading', 'external links']
    for section in wikicode.get_sections():
        if section.filter_headings():
            section_title = str(section.filter_headings()[0].title).strip().lower()
            if section_title in sections_to_remove:
                wikicode.remove(section)
    links = [str(link.title).lower().strip() for link in wikicode.filter_wikilinks()]
    print(f"Extracted {Fore.BLUE}{len(links)}{Fore.RESET} links from '{title}' page.")
    return links


def get_potential_path(start, end, excluded=None):
    print(f"Requesting a potential path from '{start}' to '{end}'...")
    if excluded is None:
        excluded = []
    if excluded:
        prompt_exclusion = f"IMPORTANT: Do not include these links: {', '.join(excluded)}."
    else:
        prompt_exclusion = ""

    response = None
    while True:
        try:
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Given your knowledge up to 2021, suggest a potential path of Wikipedia links leading from '{start}' to '{end}' in the format 'Page 1 -> Page 2 -> Page 3'. {prompt_exclusion}",
                temperature=0.5,
                max_tokens=100
            )
            break  # If the request is successful, break the loop
        except openai.error.Timeout as e:
            print(f"Request to OpenAI timed out: {e}")
            input("Press enter to retry...")
    
    text = response.choices[0].text.strip().lower()
    print()
    print(f"AI response: {text}")
    path = re.split(' -> ', re.sub(r'\d+\. ?', '', text.strip()))
    path = [p.strip() for p in path if p.strip()]
    print(f"Extracted path from AI response: {' -> '.join(path)}")
    print()
    return path


def main():
    global redirected_to
    start_page = "Biology"
    end_page = "Star"
    excluded_links = []
    excluded_links_per_page = {}
    current_page = start_page
    while True:
        excluded_links = excluded_links_per_page.get(current_page.lower(), [])
        path = get_potential_path(current_page.lower(), end_page.lower(), [e.lower() for e in excluded_links])
        for i, page in enumerate(path[:-1]):
            print(f"{Fore.CYAN}AI proposed next page:{Fore.RESET}", path[i+1])
            print(f"Checking if '{path[i+1]}' is in '{page}' page...")
            links = extract_internal_links(page)
            if redirected_to is not None:
                current_page = redirected_to
                redirected_to = None  # Reset the redirected_to variable for the next iteration
            for link in links:
                stripped_link = re.sub(r' \(.*?\)', '', link)
                if path[i+1] in (link, stripped_link):
                    print(f"{Fore.GREEN}Found{Fore.RESET} link to '{path[i+1]}' in '{page}' page.")
                    current_page = link
                    excluded_links = []
                    break
            else:
                print(f"{Fore.RED}Did not find{Fore.RESET} link to '{path[i+1]}' in '{page}' page. Adding to the excluded list...")
                clean_proposed_page = re.sub(r' \(.*?\)', '', path[i+1])  # Remove anything in parentheses
                excluded_links.append(clean_proposed_page)
                excluded_links_per_page[current_page.lower()] = excluded_links
                print(f"Current list of excluded words: {excluded_links}")
                break
        else:
            # No break, so we made it all the way through the path
            return
        input("Press enter to request a new path...")

if __name__ == '__main__':
    main()
