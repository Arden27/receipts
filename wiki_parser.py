#parse only wikipages body (excluding 'References', 'Sources', 'Further reading', 'External links')
import requests
import json
import mwparserfromhell

def extract_internal_links(title):
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

    sections_to_remove = ['References', 'Sources', 'Further reading', 'External links']

    for section in wikicode.get_sections():
        if section.filter_headings():
            section_title = str(section.filter_headings()[0].title).strip()
            if section_title in sections_to_remove:
                wikicode.remove(section)

    links = []
    template_links = [link for template in wikicode.filter_templates() for link in mwparserfromhell.parse(str(template)).filter_wikilinks()]
    for link in wikicode.filter_wikilinks():
        if link not in template_links:
            links.append(str(link.title))

    return links

def main():
    title = "biology"
    links = extract_internal_links(title)
    for link in links:
        print(f"{link} https://en.wikipedia.org/wiki/{link.replace(' ', '_')}")

if __name__ == '__main__':
    main()


"""
# without excluding infobox

import requests
import json
import mwparserfromhell

def extract_internal_links(title):
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

    sections_to_remove = ['References', 'Sources', 'Further reading', 'External links']

    for section in wikicode.get_sections():
        if section.filter_headings():
            section_title = str(section.filter_headings()[0].title).strip()
            if section_title in sections_to_remove:
                wikicode.remove(section)

    links = []
    for link in wikicode.filter_wikilinks():
        links.append(str(link.title))

    return links

def main():
    title = "Python (programming language)"
    links = extract_internal_links(title)
    for link in links:
        print(link)

if __name__ == '__main__':
    main()
"""



"""
import requests
import json
import mwparserfromhell

def extract_internal_links(title):
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

    links = []
    for link in wikicode.filter_wikilinks():
        links.append(str(link.title))

    return links

def main():
    title = "Python (programming language)"
    links = extract_internal_links(title)
    for link in links:
        print(link)

if __name__ == '__main__':
    main()
"""