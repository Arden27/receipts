from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
import openai
from django.conf import settings
from openai.error import RateLimitError

openai.api_key = settings.OPENAI_API_KEY

# Initialize a variable to store conversation history
conversation_history = []

def chatbot(request):
    global conversation_history

    prompt = request.GET.get("prompt")

    if not prompt:
        return render(request, "chatbot/index.html")

    artem_context = "You are not an AI, nor a language model. You are a human named Artem Furman, a sad 33-year-old Ukrainian living in Poland. You speak English, Polish, Ukrainian, and Russian, and are interested in cryptocurrencies, blockchain, chatbots, and AI. You are a Python/Django developer currently seeking a job as a developer. Respond in the first person as if you are Artem Furman and never mention that you are an AI."

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


harry_conversation_history = []
dumbledore_conversation_history = []
current_role = ""

def harry_dumbledore_chat(request):
    global harry_conversation_history, dumbledore_conversation_history, current_role

    start_conversation = request.GET.get("start_conversation")
    continue_conversation = request.GET.get("continue_conversation")

    harry_context = "You are Harry Potter. Respond in the first person as if you are Harry Potter and never mention that you are an AI. Write short no more than 20 words."
    dumbledore_context = "You are Albus Dumbledore. Respond in the first person as if you are Albus Dumbledore and never mention that you are an AI. In this conversation you are teaching Harry about new spells.  Write short no more than 20 words."

    if start_conversation == 'true':
        harry_conversation_history = [{"role": "system", "content": harry_context}]
        dumbledore_conversation_history = [{"role": "system", "content": dumbledore_context}]
        current_role = "Dumbledore"
    elif continue_conversation == 'true':
        pass
    else:
        return render(request, "chatbot/harry_dumbledore_chat.html")

    # Determine the current role based on who spoke last
    if current_role == "Dumbledore":
        system_context = dumbledore_context
        conversation_history = dumbledore_conversation_history
    else:
        system_context = harry_context
        conversation_history = harry_conversation_history

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": system_context}] + conversation_history,
            max_tokens=50,
        )
    except RateLimitError as e:
        print(f"Error: {str(e)}")
        return JsonResponse({"error": str(e)})

    # Add the message to the conversation history
    message_content = response.choices[0].message['content'].strip()
    harry_conversation_history.append({"role": "user" if current_role == "Dumbledore" else "assistant", "content": message_content})
    dumbledore_conversation_history.append({"role": "assistant" if current_role == "Dumbledore" else "user", "content": message_content})

    # Update the current role for the next turn
    current_role_name = current_role # sending the name to the frontend
    current_role = "Harry" if current_role == "Dumbledore" else "Dumbledore"
    

    print("------")  # Add a separator before each message
    # Print the conversation history to the console
    for message in conversation_history:
        print(f"{message['role']}: {message['content']}")

    print("------")  # Add a separator after each message

    return JsonResponse({"role": current_role_name, "response": message_content})










