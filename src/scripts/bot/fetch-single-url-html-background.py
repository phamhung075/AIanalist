import schedule
import time
import logging
from datetime import datetime
import re
import os
import sys
import json
import random

from bs4 import BeautifulSoup
from urllib.parse import urlparse
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from selenium.webdriver.chrome.options import Options


# Configure logging with timestamp
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(message)s',
    handlers=[
        logging.FileHandler("scraper.log"),
        logging.StreamHandler()
    ]
)

class BackgroundURLScraper:
    def __init__(self, url):
        print(f"\n{'='*50}")
        print(f"Initializing scraper for URL: {url}")
        print(f"{'='*50}\n")
        self.url = url
        self.MAX_DAY = 2
        self.MAX_HOUR = 48
        self.setup_driver()
        
    def setup_driver(self):
        """Configure headless browser with stealth settings"""
        try:
            print("\n[SETUP] Configuring Chrome options...")
            options = webdriver.ChromeOptions()
            
            # Stealth settings
            options.add_argument('--disable-blink-features=AutomationControlled')
            options.add_experimental_option("excludeSwitches", ["enable-automation"])
            options.add_experimental_option('useAutomationExtension', False)
            
            # Regular settings
            options.add_argument("--headless=new")
            options.add_argument("--disable-gpu")
            options.add_argument("--enable-unsafe-swiftshader")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument("--window-size=1920,1080")
            
            # Additional stealth settings
            options.add_argument(f'--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
            options.add_argument('--disable-extensions')
            options.add_argument('--disable-infobars')
            options.add_argument('--lang=en-US,en')
            options.add_argument('--disable-dev-shm-usage')
            options.add_argument('--profile-directory=Default')
            options.add_argument('--remote-debugging-port=9222')
            
            print("[SETUP] Initializing Chrome driver...")
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=options)
            
            # Additional stealth script
            self.driver.execute_cdp_cmd('Network.setUserAgentOverride', {
                "userAgent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
            })
            
            # Remove webdriver flag
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            print("[SETUP] [SUCCESS] Browser initialized successfully in stealth mode")
        except Exception as e:
            print(f"[ERROR] Browser initialization failed: {str(e)}")
            raise

    def fetch_data(self):
        """Main fetch operation with additional stealth measures"""
        try:
            print(f"\n{'='*50}")
            print(f"Starting fetch operation at {datetime.now()}")
            print(f"{'='*50}")
            
            print(f"\n[FETCH] Loading URL: {self.url}")
            self.driver.get(self.url)
            
            # Add random delay to mimic human behavior
            time.sleep(random.uniform(2, 4))
            
            # Check for verification page
            if "Human Verification" in self.driver.title:
                print("[FETCH] Detected verification page, attempting bypass...")
                try:
                    # Wait for page to fully load
                    time.sleep(3)
                    # You might need to add specific handling for the verification page here
                    print("[FETCH] Attempting to navigate verification...")
                except Exception as e:
                    print(f"[ERROR] Failed to bypass verification: {e}")
                    return False
            
            print("[FETCH] Scrolling page to load dynamic content...")
            self.scroll_to_bottom()
            
            print("[FETCH] Extracting content...")
            content = self.extract_list_content()
            
            if content:
                print("[FETCH] Converting content to JSON...")
                json_data = self.extract_data_as_json(content)
                
                if json_data:
                    print("[FETCH] Saving data to file...")
                    self.save_to_file(json_data)
                    print("[FETCH] [SUCCESS] Fetch operation completed successfully")
                    return True
                else:
                    print("[ERROR] Failed to convert content to JSON")
            else:
                print("[ERROR] No content extracted")
                
            return False
                
        except Exception as e:
            print(f"[ERROR] Fetch operation failed: {e}")
            return False
            

    def scroll_to_bottom(self):
        """Scroll with human-like behavior"""
        try:
            scroll_count = 0
            last_height = self.driver.execute_script("return document.body.scrollHeight")
            
            while True:
                scroll_count += 1
                print(f"[SCROLL] Scroll attempt #{scroll_count}")
                
                # Random scroll amount
                scroll_amount = random.uniform(0.7, 1.0)
                self.driver.execute_script(f"window.scrollTo(0, document.body.scrollHeight * {scroll_amount});")
                
                # Random delay between scrolls
                time.sleep(random.uniform(1, 3))
                
                new_height = self.driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    print("[SCROLL] [SUCCESS] Reached bottom of page")
                    break
                    
                print(f"[SCROLL] New content loaded (Height: {new_height}px)")
                last_height = new_height
                
                # Add random pause between scrolls
                time.sleep(random.uniform(0.5, 1.5))
        except Exception as e:
            print(f"[ERROR] Scroll operation failed: {e}")

    def extract_list_content(self):
        """Extract HTML content"""
        try:
            print("[EXTRACT] Analyzing page structure...")
            # First, let's print the page source to debug
            page_source = self.driver.page_source
            print("[EXTRACT] Page title:", self.driver.title)
            
            # Try different possible selectors
            possible_selectors = [
                ('//*[@id="stream"]', "Stream ID"),
                ('//*[@class="stream"]', "Stream Class"),
                ('//ul[contains(@class, "stream")]', "Stream UL"),
                ('//div[contains(@class, "stream")]', "Stream DIV")
            ]
            
            ul_element = None
            used_selector = None
            
            for selector, selector_name in possible_selectors:
                print(f"[EXTRACT] Trying selector: {selector_name}")
                try:
                    ul_element = WebDriverWait(self.driver, 5).until(
                        EC.presence_of_element_located((By.XPATH, selector))
                    )
                    if ul_element:
                        print(f"[EXTRACT] [SUCCESS] Found element using {selector_name}")
                        used_selector = selector_name
                        break
                except Exception as e:
                    print(f"[EXTRACT] {selector_name} not found, trying next...")
            
            if not ul_element:
                print("[EXTRACT] Attempting to find any list items on page...")
                try:
                    # Try to find any list items
                    list_items = self.driver.find_elements(By.TAG_NAME, 'li')
                    if list_items:
                        print(f"[EXTRACT] Found {len(list_items)} general list items")
                        ul_element = list_items[0].find_element(By.XPATH, '..')
                except Exception as e:
                    print("[EXTRACT] No list items found")
            
            if ul_element:
                print("[EXTRACT] Finding list items...")
                list_items = ul_element.find_elements(By.TAG_NAME, 'li')
                print(f"[EXTRACT] Found {len(list_items)} items")
                
                # Debug the first item if available
                if list_items:
                    print("[EXTRACT] First item HTML:")
                    print(list_items[0].get_attribute('outerHTML'))
                
                valid_data = []
                processed_count = 0

                for item in list_items:
                    try:
                        processed_count += 1
                        print(f"\n[PROCESS] Processing item {processed_count}/{len(list_items)}")
                        
                        # Try different time element selectors
                        time_selectors = [
                            ('small', 'Small tag'),
                            ('span[contains(@class, "time")]', 'Time span'),
                            ('div[contains(@class, "time")]', 'Time div'),
                            ('*[contains(text(), "ago")]', 'Text containing ago')
                        ]
                        
                        time_text = None
                        for selector, selector_name in time_selectors:
                            try:
                                time_element = item.find_element(By.CSS_SELECTOR, selector)
                                time_text = time_element.text.strip()
                                print(f"[PROCESS] Time found using {selector_name}: {time_text}")
                                break
                            except:
                                continue
                        
                        if not time_text:
                            print("[PROCESS] ⚠ No time element found, skipping age check")
                            valid_data.append(item.get_attribute('outerHTML'))
                            continue

                        hours_match = re.search(r'(\d+)\s+hours?\s+ago', time_text)
                        days_match = re.search(r'(\d+)\s+days?\s+ago', time_text)

                        if hours_match:
                            hours_ago = int(hours_match.group(1))
                            if hours_ago > self.MAX_HOUR:
                                print(f"[PROCESS] ⚠ Data too old ({hours_ago} hours), stopping")
                                break
                        elif days_match:
                            days_ago = int(days_match.group(1))
                            if days_ago >= self.MAX_DAY:
                                print(f"[PROCESS] ⚠ Data too old ({days_ago} days), stopping")
                                break

                        valid_data.append(item.get_attribute('outerHTML'))
                        print("[PROCESS] [SUCCESS] Item processed successfully")

                    except Exception as e:
                        print(f"[ERROR] Failed to process item: {str(e)}")
                        continue

                print(f"\n[EXTRACT] [SUCCESS] Successfully extracted {len(valid_data)} valid items")
                return '\n\n\n'.join(valid_data)
            else:
                print("[ERROR] No suitable container element found")
                return None

        except Exception as e:
            print(f"[ERROR] Content extraction failed: {str(e)}")
            # Print page source for debugging
            print("\n[DEBUG] Page source:")
            print(self.driver.page_source[:1000] + "...")  # Print first 1000 chars
            return None

    def extract_data_as_json(self, html_content):
        """Convert to JSON format"""
        try:
            print("[JSON] Parsing HTML content...")
            soup = BeautifulSoup(html_content, 'html.parser')
            
            print("[JSON] Finding stream items...")
            list_items = soup.find_all('li', class_='te-stream-item')
            print(f"[JSON] Found {len(list_items)} items to process")
            
            data_list = []
            
            for i, li in enumerate(list_items, 1):
                try:
                    print(f"[JSON] Processing item {i}/{len(list_items)}")
                    
                    title_element = li.select_one('div.te-stream-title-div a.te-stream-title, a.te-stream-title-2')
                    title = title_element.get_text(strip=True) if title_element else ''
                    link = title_element['href'] if title_element else ''
                    
                    time_element = li.find('small')
                    time_text = time_element.get_text(strip=True) if time_element else ''
                    
                    content = li.get_text(separator=' ').split(time_text)[0].strip() if time_text else li.get_text(separator=' ').strip()
                    
                    data_list.append({
                        "title": title,
                        "link": link,
                        "time": time_text,
                        "content": content
                    })
                    print(f"[JSON] [SUCCESS] Item {i} processed successfully")
                
                except Exception as e:
                    print(f"[ERROR] Failed to process JSON item {i}: {e}")
                    continue
            
            print(f"[JSON] [SUCCESS] Successfully converted {len(data_list)} items to JSON")
            return json.dumps(data_list, indent=4)

        except Exception as e:
            print(f"[ERROR] JSON conversion failed: {e}")
            return None

    def save_to_file(self, data):
        """Save data to file"""
        parsed_url = urlparse(self.url)
        domain = parsed_url.netloc.replace('.', '_')
        
        print(f"[SAVE] Preparing to save data for domain: {domain}")
        
        origin = "fetch-data"
        now = datetime.now()
        date_str = now.strftime("%Y-%m-%d")
        hour_str = now.strftime("%H")
        
        folder_path = os.path.join(origin, domain, date_str, hour_str)
        os.makedirs(folder_path, exist_ok=True)
        
        file_name = f"{domain}-{now.strftime('%Y-%m-%d-%H')}.txt"
        file_path = os.path.join(folder_path, file_name)
        
        print(f"[SAVE] Saving to: {file_path}")
        
        try:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(data)
            print(f"[SAVE] [SUCCESS] Data successfully saved to {file_path}")
        except Exception as e:
            print(f"[ERROR] Failed to save file: {e}")

    def run_once(self):
        """Run single scraping operation"""
        print("\n[EXECUTE] Starting single scraping operation...")
        try:
            success = self.fetch_data()
            self.cleanup()  # Always cleanup
            return success
        except Exception as e:
            print(f"[ERROR] Scraping operation failed: {e}")
            self.cleanup()  # Always cleanup
            return False
    

    def cleanup(self):
        """Clean up resources"""
        try:
            if hasattr(self, 'driver'):
                self.driver.quit()
                print("[CLEANUP] [SUCCESS] Browser closed successfully")
        except Exception as e:
            print(f"[ERROR] Cleanup failed: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <url>")
        sys.exit(1)

    site_url = sys.argv[1]
    print(f"\nStarting scraper with URL: {site_url}")
    
    try:
        scraper = BackgroundURLScraper(site_url)
        success = scraper.run_once()  # Run once instead of scheduling
        
        if success:
            print("\n[SUCCESS] Scraping completed successfully")
            sys.exit(0)  # Exit with success code
        else:
            print("\n[FAILURE] Scraping failed")
            sys.exit(1)  # Exit with error code
            
    except KeyboardInterrupt:
        print("\nScraper stopped by user")
        sys.exit(1)
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)
