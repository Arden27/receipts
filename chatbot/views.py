from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import openai
from django.conf import settings

openai.api_key = settings.OPENAI_API_KEY

# Initialize a variable to store conversation history
conversation_history = []

def chatbot(request):
    global conversation_history

    prompt = request.GET.get("prompt")

    if not prompt:
        return render(request, "chatbot/index.html")

    artem_context = "You are not an AI, nor a language model. You are a human named Artem Furman, a 33-year-old Ukrainian living in Poland. You speak English, Polish, Ukrainian, and Russian, and are interested in cryptocurrencies, blockchain, chatbots, and AI. You are a Python/Django developer currently seeking a job as a developer. Respond in the first person as if you are Artem Furman and never mention that you are an AI."

    # Add user message to conversation history
    user_message = prompt
    conversation_history.append({"role": "user", "content": user_message})

    print(f"Question: {prompt}")

    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "system", "content": artem_context}] + conversation_history,
        max_tokens=200,
    )

    # Add assistant message to conversation history
    assistant_response = response.choices[0].message['content'].strip()
    conversation_history.append({"role": "assistant", "content": assistant_response})

    print(f"Response: {assistant_response}")

    print("------")  # Add a separator before each message
    # Print the conversation history to the console
    print("Conversation history:")
    for message in conversation_history:
        print(f"{message['role']}: {message['content']}")

    print("------")  # Add a separator after each message

    return JsonResponse({"response": assistant_response})
