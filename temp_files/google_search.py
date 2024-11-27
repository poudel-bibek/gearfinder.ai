import os
import json
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

def google_search(query, api_key=None, cx=None):
    """
    Perform a Google Custom Search using the provided API key, optimized for product searches.
    
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
    if not cx:
        raise ValueError("Custom Search Engine ID (CX) is required. Set it in .env file or pass it as an argument.")
        
    # Validate the keys
    if not isinstance(api_key, str) or len(api_key) < 10:
        raise ValueError("Invalid Google API key format")
    if not isinstance(cx, str) or len(cx) < 10:
        raise ValueError("Invalid Custom Search Engine ID format")
    
    # Parameters for the API request
    params = {
        'q': query,  # Keep the query simple
        'key': api_key,
        'cx': cx,
        'num': 10,  # Number of search results to return
    }
    
    try:
        print(f"Sending request to Google Custom Search API...")
        response = requests.get(base_url, params=params)
        
        # Handle different types of errors
        if response.status_code == 400:
            error_data = response.json()
            error_message = error_data.get('error', {}).get('message', 'Unknown error')
            print(f"API Error: {error_message}")
            print("Please check your Custom Search Engine configuration at: https://programmablesearchengine.google.com/")
            return None
        elif response.status_code == 403:
            print("Authentication error. Please check your API key.")
            return None
        
        response.raise_for_status()
        results = response.json()
        
        if 'items' not in results:
            print("No search results found.")
            return None
            
        processed_results = []
        for item in results['items']:
            product_info = {
                'title': item.get('title'),
                'link': item.get('link'),
                'snippet': item.get('snippet'),
                'price': None,
                'merchant': None
            }
            
            # Try to extract price from the snippet or title using basic pattern matching
            import re
            price_pattern = r'\$\d+(?:\.\d{2})?'
            price_matches = re.findall(price_pattern, product_info['snippet'] or '')
            if not price_matches:
                price_matches = re.findall(price_pattern, product_info['title'] or '')
            
            if price_matches:
                product_info['price'] = price_matches[0]
            
            # Try to extract merchant from the display link
            display_link = item.get('displayLink', '').lower()
            if 'amazon' in display_link:
                product_info['merchant'] = 'Amazon'
            elif 'walmart' in display_link:
                product_info['merchant'] = 'Walmart'
            elif 'target' in display_link:
                product_info['merchant'] = 'Target'
            
            processed_results.append(product_info)
        
        results['processed_items'] = processed_results
        return results
        
    except requests.exceptions.RequestException as e:
        print(f"Network error occurred: {e}")
        return None
    except json.JSONDecodeError as e:
        print(f"Error parsing API response: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

def save_results_to_json(results, filename='search_results.json'):
    """
    Save the search results to a JSON file.
    
    Args:
        results (dict): The processed search results
        filename (str): Name of the JSON file to save results to
    """
    if results and 'processed_items' in results:
        # Extract only the processed items for cleaner output
        output = {
            'query': results.get('queries', {}).get('request', [{}])[0].get('searchTerms', ''),
            'items': results['processed_items']
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(output, f, indent=2, ensure_ascii=False)
            print(f"\nResults saved to {filename}")
        except Exception as e:
            print(f"Error saving results to file: {e}")
    else:
        print("No results to save")

def main():
    # Load environment variables
    load_dotenv()
    
    # Example search specifically for products
    query = "Fishing rod starter kit"  # Simplified query
    print(f"Searching for: {query}")
    
    results = google_search(query)
    
    if results and 'processed_items' in results:
        print("\nProduct Search Results:")
        for item in results['processed_items']:
            print(f"\nTitle: {item['title']}")
            print(f"Link: {item['link']}")
            if item['price']:
                print(f"Price: {item['price']}")
            if item['merchant']:
                print(f"Merchant: {item['merchant']}")
            print(f"Description: {item['snippet']}")
        
        # Save results to JSON file
        save_results_to_json(results)
    else:
        print("No product results found or an error occurred.")

if __name__ == "__main__":
    main() 