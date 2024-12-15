import sys
import json
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db
from openai import OpenAI
import os
import re
from dotenv import load_dotenv
import pathlib
from deep_translator import GoogleTranslator
import spacy #library for NER, which is well-suited for extracting geographical entities.

# Suppress print statements or redirect them to stderr for debugging
import sys
import logging

nlp = spacy.load("en_core_web_sm")
# List of all countries (you can extend this list)
COUNTRIES = {
    "vietnam", "brazil", "usa", "united states", "china", "japan", "germany",
    "france", "india", "russia", "canada", "australia", "uk", "united kingdom",
    "south korea", "italy", "mexico", "indonesia", "saudi arabia", "south africa",
    "argentina", "turkey", "spain", "netherlands", "switzerland"
}


def detect_country(content):
    """
    Detect the relevant country from the content.
    Returns the detected country or 'global' if no country is identified.
    """
    # Run NER to identify geopolitical entities
    doc = nlp(content)
    
    detected_countries = set()
    
    # Extract geopolitical entities (GPE)
    for ent in doc.ents:
        if ent.label_ == "GPE" and ent.text.lower() in COUNTRIES:
            detected_countries.add(ent.text.lower())
    
    if detected_countries:
        # If multiple countries are detected, return the first one (or customize as needed)
        return list(detected_countries)[0]
    
    # Fallback to 'global' if no country is identified
    return "global"

class Logger:
    def __init__(self, filename="debug.log"):
        self.terminal = sys.stderr
        self.log = open(filename, "a")

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)

    def flush(self):
        pass

sys.stdout = Logger()

# Your existing initialization code
load_dotenv()
current_dir = pathlib.Path(__file__).parent.absolute()
key_path = os.path.join(current_dir, "config", "aianalist-firebase-adminsdk-8gwkb-09a794ac72.json")

# Initialize Firebase
if not firebase_admin._apps:
    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred, {
        'databaseURL': os.getenv('FIREBASE_DATABASE_URL')
    })

client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
if not os.getenv('OPENAI_API_KEY'):
    raise ValueError("OpenAI API Key not found in .env file.")

def translate_to_vietnamese(text):
    """Translate English text to Vietnamese"""
    try:
        translator = GoogleTranslator(source='en', target='vi')
        return translator.translate(text)
    except Exception as e:
        print(f"Translation error: {e}")
        return text

def get_latest_data_from_firebase():
    ref = db.reference('news')
    data = ref.order_by_child('timestamp').limit_to_last(1).get()
    if data:
        for key, value in data.items():
            return key, value
    return None, None

def simple_market_analysis(content):
    """Fallback analysis for Vietnam's market impact when OpenAI API fails."""
    # Define positive and negative keywords for Vietnam's market
    positive_words = [
        'growth', 'expansion', 'surge', 'increase', 'boost', 'record high', 'recovery', 'resilient', 'strong'
    ]
    negative_words = [
        'decline', 'drop', 'losses', 'downturn', 'uncertainty', 'inflation', 'depreciation', 'concerns', 'weak'
    ]
    
    # Define Vietnam-specific sectors and messages
    keywords_actions = [
        {
            "keywords": ["vn-index", "ho chi minh stock exchange", "hnx", "upcom"],
            "message": "Movements in Vietnam's stock market indices reflect investor sentiment and overall economic conditions."
        },
        {
            "keywords": ["manufacturing", "exports", "supply chain", "industrial output"],
            "message": "The manufacturing sector is a key driver of Vietnam's economic performance and reflects global trade trends."
        },
        {
            "keywords": ["agriculture", "rice exports", "coffee exports", "fisheries"],
            "message": "Agricultural exports, including rice and coffee, play a crucial role in Vietnam's trade balance."
        },
        {
            "keywords": ["foreign investment", "fdi", "inward investment", "foreign capital"],
            "message": "Foreign direct investment strengthens Vietnam's industrial base and economic growth."
        },
        {
            "keywords": ["tourism", "hospitality", "travel sector", "tourist arrivals"],
            "message": "Growth in tourism supports Vietnam's service sector and benefits local businesses."
        },
        {
            "keywords": ["vietnamese dong", "vnd", "currency exchange", "forex", "exchange rate"],
            "message": "Fluctuations in the Vietnamese Dong impact trade dynamics and investor confidence."
        },
        {
            "keywords": ["renewable energy", "solar", "wind", "hydropower"],
            "message": "Vietnam's push for renewable energy projects aligns with sustainability and energy independence goals."
        },
        {
            "keywords": ["cptpp", "rcep", "trade agreement", "fta"],
            "message": "Participation in trade agreements like CPTPP and RCEP boosts Vietnam's export opportunities."
        },
        {
            "keywords": ["inflation", "interest rates", "monetary policy"],
            "message": "Changes in inflation and interest rates affect consumer spending and investment in Vietnam."
        },
        {
            "keywords": ["real estate", "property market", "housing"],
            "message": "Vietnam's growing property market indicates robust urban development and domestic demand."
        }
    ]
    
    content_lower = content.lower()
    positive_count = sum(content_lower.count(word) for word in positive_words)
    negative_count = sum(content_lower.count(word) for word in negative_words)
    
    sentiment = "neutral"
    if positive_count > negative_count:
        sentiment = "potentially positive"
    elif negative_count > positive_count:
        sentiment = "potentially negative"
    
    analysis = [f"Market sentiment appears {sentiment} for Vietnam's economy."]
    
    for entry in keywords_actions:
        matched_keywords = [kw for kw in entry["keywords"] if kw in content_lower]
        if matched_keywords:
            logging.info(f"Matched keywords: {matched_keywords}")
            analysis.append(entry["message"])
    
    vietnamese_analysis = translate_to_vietnamese(" ".join(analysis))
    return {
        "english": " ".join(analysis),
        "vietnamese": vietnamese_analysis
    }

def process_news_by_id(news_id):
    try:
        ref = db.reference(f'news/{news_id}')
        news_data = ref.get()
        
        if not news_data:
            return {
                "status": "error",
                "message": f"News with ID {news_id} not found"
            }
            
        if news_data.get('analysis') and news_data['analysis'].get('status') == 'completed':
            return {
                "status": "skip",
                "message": "Analysis already exists",
                "data": news_data['analysis']
            }
            
        content = news_data.get('content')
        if not content:
            return {
                "status": "error",
                "message": "News content not found"
            }
            
        analysis = ask_chatgpt(content)
        
        if analysis:
            update_data = {
                'analysis': {
                    'en': analysis["english"],
                    'vi': analysis["vietnamese"],
                    'timestamp': datetime.now().timestamp(),
                    'status': 'completed'
                }
            }
            ref.update(update_data)
            
            return {
                "status": "success",
                "message": "Analysis completed and saved",
                "data": update_data['analysis']
            }
        else:
            return {
                "status": "error",
                "message": "Failed to generate analysis"
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"Error processing news: {str(e)}"
        }
        
def ask_chatgpt(content):
    
    """Use OpenAI API to analyze the impact on the Vietnamese market."""
    prompt = f"""
    Analyze the following news and determine its impact on Vietnam's economy or not. Provide a detailed analysis.\n\nNews: {content}
    """
    try:
        # First try OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert economic analyst who evaluates news impact on Vietnam's economy."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=500,
            temperature=0.7
        )
        english_analysis = response.choices[0].message.content.strip()
        vietnamese_analysis = translate_to_vietnamese(english_analysis)
        
        logging.info("OpenAI API call successful.")
        return {
            "english": english_analysis,
            "vietnamese": vietnamese_analysis
        }
    except Exception as e:
        logging.error(f"OpenAI API error: {e}")
        logging.info("Falling back to simple analysis...")
        # Fallback to simple analysis
        return simple_market_analysis(content)

def main():
    from datetime import datetime
    
    key, data = get_latest_data_from_firebase()
    if data:
        content = data.get('content')
        print(f"Data from Firebase (ID: {key}):")
        print(content)
        print("\n" + "="*50 + "\n")
        
        # Get analysis in both languages
        analysis = ask_chatgpt(content)
        
        if analysis:
            print("English Analysis:")
            print(analysis["english"])
            print("\n" + "="*50 + "\n")
            print("Vietnamese Analysis:")
            print(analysis["vietnamese"])
            
            try:
                # Save both analyses back to Firebase
                ref = db.reference(f'news/{key}')
                update_data = {
                    'analysis': {
                        'en': analysis["english"],
                        'vi': analysis["vietnamese"],
                        'timestamp': datetime.now().timestamp(),
                        'status': 'completed'
                    }
                }
                
                ref.update(update_data)
                print(f"\n✓ Analysis saved to Firebase successfully for item ID: {key}")
                
                # Verify the save
                saved_data = db.reference(f'news/{key}/analysis').get()
                if saved_data:
                    print("\nSaved data verification:")
                    print(f"English saved: {len(saved_data.get('en', ''))} characters")
                    print(f"Vietnamese saved: {len(saved_data.get('vi', ''))} characters")
                
            except Exception as e:
                print(f"\n [Error] saving to Firebase: {e}")
        else:
            print("Failed to get analysis from ChatGPT.")
    else:
        print("No data found in Firebase.")

if __name__ == "__main__":
    main()