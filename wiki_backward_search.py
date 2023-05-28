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
    #print(f"Extracting internal links from '{title}' page...")
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

    if "revisions" not in DATA["query"]["pages"][0]:
        print(f"No revisions available for '{title}' page. Skipping...")
        return []
    
    wikitext = DATA["query"]["pages"][0]["revisions"][0]["slots"]["main"]["content"]
    wikicode = mwparserfromhell.parse(wikitext)
    sections_to_remove = ['references', 'sources', 'further reading', 'external links']
    for section in wikicode.get_sections():
        if section.filter_headings():
            section_title = str(section.filter_headings()[0].title).strip().lower()
            if section_title in sections_to_remove:
                wikicode.remove(section)
    links = [str(link.title).lower().strip() for link in wikicode.filter_wikilinks()]
    #print(f"Extracted {Fore.BLUE}{len(links)}{Fore.RESET} links from '{title}' page.")
    return links


def get_potential_pages_with_link_to_end_page(end):
    #print(f"Requesting potential pages that could have a link to '{end}'...")
    context = f"Given your knowledge up to 2021, suggest 50 Wikipedia pages related as much as possible to the term Biology that might have a link leading to '{end}' in the format 'Page 1, Page 2, Page 3' (do not numerate)."
    response = None
    while True:
        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {
                        "role": "system",
                        "content": context
                    }
                ],
                max_tokens=300
            )
            break  # If the request is successful, break the loop
        except openai.error.Timeout as e:
            print(f"Request to OpenAI timed out: {e}")
            input("Press enter to retry...")

    text = response.choices[0].message['content'].strip()
    #print()
    #print(f"AI response:")
    #print(f"{text}")
    #print()
    pages = text.split(', ')
    pages = [p.strip() for p in pages if p.strip()]
    #print(f"Extracted {len(pages)} pages from AI response:")
    #print(f"{', '.join(pages)}")
    #print()
    return pages

def main():
    global redirected_to
    end_page = "star"
    pages_with_link = []
    pages_without_link = []
    pages = get_potential_pages_with_link_to_end_page(end_page.lower())
    for page in pages:
        #print(f"Checking if '{end_page}' is in '{page}' page...")
        links = extract_internal_links(page)
        if redirected_to is not None:
            page = redirected_to
            redirected_to = None  # Reset the redirected_to variable for the next iteration
        for link in links:
            stripped_link = re.sub(r' \(.*?\)', '', link)
            if end_page.lower() in (link, stripped_link):
                #print(f"{Fore.GREEN}Found{Fore.RESET} link to '{end_page}' in '{page}' page.")
                pages_with_link.append(page)
                break
        else:
            #print(f"{Fore.RED}Did not find{Fore.RESET} link to '{end_page}' in '{page}' page.")
            pages_without_link.append(page)
        #input("Press enter to check next potential page...")

    print(f"\nSummary:")
    print(f"Found link to '{end_page}' in {len(pages_with_link)} pages:")
    for page in pages_with_link:
        print(page)
    print(f"\nDid not find link to '{end_page}' in {len(pages_without_link)} pages:")
    for page in pages_without_link:
        print(page)

if __name__ == '__main__':
    main()

