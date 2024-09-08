import os
import sys
import time
from urllib.parse import urlparse
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait  # Import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC  # Import Expected Conditions
from selenium.webdriver.common.action_chains import ActionChains

# Check if the URL is provided as a command-line argument
if len(sys.argv) < 2:
    print("Usage: python fetch-html.py <url>")
    sys.exit(1)

# Get the URL from the command-line argument
site_url = sys.argv[1]

def scroll_to_bottom(driver):
    """
    Scroll to the bottom of the page to load dynamic content.
    """
    last_height = driver.execute_script("return document.body.scrollHeight")
    
    while True:
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(3)
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

def fetch_html_with_selenium(site_url):
    """
    Fetch the HTML content using Selenium for JavaScript-rendered content.
    """
    options = webdriver.ChromeOptions()
    
    # Add the argument to disable the search engine choice popup
    options.add_argument("--disable-search-engine-choice-screen")

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # Load the website
    driver.get(site_url)

    # Scroll to the bottom to ensure all content is loaded
    scroll_to_bottom(driver)

    # Wait for the specific element that signals the content is loaded
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "stream"))  # Adjust as per the page structure
    )

    return driver



def extract_list_content_selenium(driver):
    """
    Extract content from the specific element using Selenium.
    """
    try:
        # Wait until the element with the specified XPath is present (up to 10 seconds)
        ul_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//*[@id="stream"]'))
        )
        return ul_element.text
    except Exception as e:
        print(f"Could not find the element: {e}")
        return None

def export_to_file(data, site_url, file_name):
    """
    Export the extracted data to a file, saving it in a folder structure.
    """
    # Parse the site URL to use as part of the folder structure
    parsed_url = urlparse(site_url)
    domain = parsed_url.netloc.replace('.', '_')  # Replace dots with underscores for folder name

    # Get the current date and time
    origin = "fetch-data"
    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    hour_str = now.strftime("%H")

    # Create the folder structure: [domain]/[date]/[hour]
    folder_path = os.path.join(origin, domain, date_str, hour_str)
    os.makedirs(folder_path, exist_ok=True)  # Create directories if they don't exist

    # Define the file path
    file_path = os.path.join(folder_path, file_name)

    try:
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(data)
        print(f"Data exported successfully to {file_path}")
    except IOError as e:
        print(f"Error writing to file {file_path}: {e}")

if __name__ == "__main__":
    driver = fetch_html_with_selenium(site_url)

    # Extract content from the specific list element
    list_content = extract_list_content_selenium(driver)
    
    if list_content:
        # Save the extracted content to a file
        now = datetime.now()
        date_hour_str = now.strftime("%Y-%m-%d-%H")
        text_file_name = f"{urlparse(site_url).netloc.replace('.', '_')}-{date_hour_str}.txt"
        export_to_file(list_content, site_url, text_file_name)

    # Close the browser
    driver.quit()
