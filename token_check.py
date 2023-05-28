import openai

from dotenv import load_dotenv
import os

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")



#python
context = "Write the word 'card' 50 times, each separated by a space"
response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": context
        }
    ],
    max_tokens=250
)

text = response.choices[0].message['content'].strip()
print(text)

"""

#python
context = "Write the word 'word'."
response = openai.ChatCompletion.create(
      model="gpt-3.5-turbo",
      messages=[
          {
              "role": "system",
              "content": context
          }
      ],
      max_tokens=5,
      n=50
  )

  
words = [choice.message['content'].strip() for choice in response.choices]
print(words)

"""