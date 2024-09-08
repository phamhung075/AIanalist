import firebase_admin
from firebase_admin import credentials, db
import openai
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()


# Retrieve OpenAI API key from environment variables
openai.api_key = os.getenv('OPENAI_API_KEY')
if not openai.api_key:
    raise ValueError("OpenAI API Key not found in .env file.")

# Function to retrieve data from Firebase
def get_latest_data_from_firebase():
    ref = db.reference('news')  # Replace 'news' with the actual path in your database
    data = ref.order_by_child('timestamp').limit_to_last(1).get()  # Get the latest entry based on timestamp
    if data:
        for key, value in data.items():
            return key, value  # Return the key and content of the latest news item
    return None, None

# Function to send data to ChatGPT for analysis
def ask_chatgpt(content):
    prompt = f"Is the following news good or bad for the economy of Vietnam?\n\nNews: {content}"
    
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",  # Use the GPT model version you want
            prompt=prompt,
            max_tokens=150
        )
        return response.choices[0].text.strip()
    except Exception as e:
        print(f"Error in OpenAI request: {e}")
        return None

# Main function to get data from Firebase and ask ChatGPT
def main():
    key, data = get_latest_data_from_firebase()
    if data:
        content = data.get('content')
        print(f"Data from Firebase (ID: {key}):")
        print(content)
        
        # Ask ChatGPT for an analysis
        analysis = ask_chatgpt(content)
        
        if analysis:
            print(f"ChatGPT Analysis: {analysis}")
            
            # Optionally, you can save the analysis back to Firebase or log it
            ref = db.reference(f'news/{key}')
            ref.update({'chatgpt_analysis': analysis})
            print(f"ChatGPT analysis saved to Firebase for item ID {key}")
        else:
            print("Failed to get analysis from ChatGPT.")
    else:
        print("No data found in Firebase.")

if __name__ == "__main__":
    main()
