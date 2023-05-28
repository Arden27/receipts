import openai

def count_tokens(text):
    return openai.api_utils.num_tokens(text)

# example usage
print(count_tokens("This is an example sentence."))