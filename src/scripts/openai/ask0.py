import firebase_admin
from firebase_admin import credentials, db
from openai import OpenAI
import os
import re
from dotenv import load_dotenv
import pathlib
from deep_translator import GoogleTranslator

# Load environment variables from the .env file
load_dotenv()

# Get the current script's directory
current_dir = pathlib.Path(__file__).parent.absolute()
key_path = os.path.join(current_dir, "config", "aianalist-firebase-adminsdk-8gwkb-09a794ac72.json")

# Initialize Firebase Admin SDK with the correct path
cred = credentials.Certificate(key_path)
firebase_admin.initialize_app(cred, {
    'databaseURL': os.getenv('FIREBASE_DATABASE_URL')
})

# Initialize OpenAI client
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
    """Fallback analysis when OpenAI API is unavailable"""
    # Count positive and negative indicators
    positive_words = ['surge', 'gain', 'gains', 'increased', 'exceeding', 'boost', 'strong', 'record high']
    negative_words = ['dropped', 'losing', 'losses', 'decline', 'drop', 'uncertainty', 'concerns']
    
    content_lower = content.lower()
    positive_count = sum(content_lower.count(word.lower()) for word in positive_words)
    negative_count = sum(content_lower.count(word.lower()) for word in negative_words)
    
    # Extract percentage changes
    percentages = re.findall(r'([+-]?\d+\.?\d*)%', content)
    percentage_changes = [float(p) for p in percentages]
    
    # Analyze the overall sentiment
    sentiment = "neutral"
    analysis = []
    
    if positive_count > negative_count:
        sentiment = "potentially positive"
    elif negative_count > positive_count:
        sentiment = "potentially negative"
    
    # Create analysis summary
    analysis.append(f"Market sentiment appears {sentiment} for Vietnam's economy.")
    
    if 'AI' in content or 'artificial intelligence' in content_lower:
        analysis.append("Growth in AI sector could present opportunities for Vietnam's technology sector.")
    
    if 'semiconductor' in content_lower:
        analysis.append("Semiconductor industry developments may affect Vietnam's electronics manufacturing sector.")
    
    if 'Federal Reserve' in content:
        analysis.append("US Federal Reserve policies may impact Vietnam's export market and currency exchange rates.")
        
    return " ".join(analysis)
def process_news_by_id(news_id):
    from datetime import datetime

    try:
        # Get news item by ID
        ref = db.reference(f'news/{news_id}')
        news_data = ref.get()
        
        if not news_data:
            return {
                "status": "error",
                "message": f"News with ID {news_id} not found"
            }
            
        # Check if analysis already exists
        if news_data.get('analysis') and news_data['analysis'].get('status') == 'completed':
            return {
                "status": "skip",
                "message": "Analysis already exists",
                "data": news_data['analysis']
            }
            
        # If no analysis exists, process the content
        content = news_data.get('content')
        if not content:
            return {
                "status": "error",
                "message": "News content not found"
            }
            
        # Get analysis in both languages
        analysis = ask_chatgpt(content)
        
        if analysis:
            # Save analysis to Firebase
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
    prompt = f"Is the following news good or bad for the economy of Vietnam? Provide a detailed analysis.\n\nNews: {content}"
    
    try:
        # First try OpenAI
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert economic analyst who evaluates news impact on Vietnam's economy. Provide clear, concise analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=250,
            temperature=0.7
        )
        english_analysis = response.choices[0].message.content.strip()
        vietnamese_analysis = translate_to_vietnamese(english_analysis)
        
        return {
            "english": english_analysis,
            "vietnamese": vietnamese_analysis
        }
    except Exception as e:
        print(f"OpenAI API error: {e}")
        print("Falling back to simple analysis...")
        # Fallback to simple analysis
        english_analysis = simple_market_analysis(content)
        vietnamese_analysis = translate_to_vietnamese(english_analysis)
        return {
            "english": english_analysis,
            "vietnamese": vietnamese_analysis
        }

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