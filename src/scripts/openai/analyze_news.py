import sys
import json
from ask0 import process_news_by_id  # Import your existing functions

def main():
    if len(sys.argv) < 2:
        json.dump({
            "status": "error",
            "message": "News ID is required"
        }, sys.__stdout__)
        return

    news_id = sys.argv[1]
    result = process_news_by_id(news_id)
    
    # Print only the JSON result to stdout
    json.dump(result, sys.__stdout__)

if __name__ == "__main__":
    main()