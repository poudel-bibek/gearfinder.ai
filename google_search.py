import os
import json
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

def google_search(query, api_key=None, cx=None):
    """
    Perform a Google Custom Search using the provided API key.
    
    Args:
        query (str): The search query
        api_key (str): Your Google Custom Search API key (optional if set in .env)
        cx (str): Custom Search Engine ID (optional if set in .env)
    
    Returns:
        dict: Search results from Google
    """
    base_url = "https://www.googleapis.com/customsearch/v1"
    
    # Use environment variables if no keys are provided
    api_key = api_key or os.getenv('GOOGLE_API_KEY')
    cx = cx or os.getenv('GOOGLE_CX')
    
    if not api_key:
        raise ValueError("Google API key is required. Set it in .env file or pass it as an argument.")
    
    # Parameters for the API request
    params = {
        'q': query,
        'key': api_key,
    }
    
    if cx:
        params['cx'] = cx
    
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def main():
    # Example search
    query = "How do you do?"
    results = google_search(query)
    
    if results:
        # Print raw JSON response from Google API
        print(json.dumps(results, indent=2))
    
if __name__ == "__main__":
    main() 