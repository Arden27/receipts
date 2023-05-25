import wikipediaapi
import difflib


"""
#get whole text of the page
def get_wiki_content(language, title):
    "Fetches the content of a Wikipedia page given the language and title."
    wiki_wiki = wikipediaapi.Wikipedia(language)
    page = wiki_wiki.page(title)
    return page.text 
    #page.summary[0:250]  # Retrieve the first 250 characters of the summary for comparison

title = "Python (programming language)"

print(get_wiki_content('en', title))
"""

"""

def compare_wiki_versions(title):
    "Compares the English and French versions of a Wikipedia page."
    english_content = get_wiki_content('en', title)
    french_content = get_wiki_content('fr', title)
    
    diff = difflib.ndiff(english_content, french_content)
    diff_text = '\n'.join(diff)

    print(diff_text)

# Call the function with a title of a Wikipedia page
compare_wiki_versions('Python (programming language)')

"""

"""
#get categories

import wikipediaapi

wiki = wikipediaapi.Wikipedia('en')
page = wiki.page('Python (programming language)')

print("Sections:")
for section in page.sections:
    print(section.title)

print("\nText from the 'History' section:")
for section in page.sections:
    if section.title == "History":
        print(section.text)

"""

# recursive function to get sections and subsections
import wikipediaapi

def print_sections(sections, level=0):
    for section in sections:
        print("  " * level + section.title)
        print_sections(section.sections, level + 1)

wiki = wikipediaapi.Wikipedia('en')
page = wiki.page('Python (programming language)')

print_sections(page.sections)

"""

#get categories

for category in page.categories:
    print(category)

"""