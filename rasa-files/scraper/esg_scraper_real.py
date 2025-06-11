import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import logging
import os
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException

# Configuration du logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

class ESGScraper:
    def __init__(self, output_dir="esg_data"):
        """
        Initialise le scraper ESG
        
        Args:
            output_dir (str): Répertoire où sauvegarder les données
        """
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9",
        }
        self.output_dir = output_dir
        
        # Créer le répertoire de sortie s'il n'existe pas
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Initialiser le pilote Selenium (pour les sites qui nécessitent JavaScript)
        self.driver = None
    
    def _init_selenium(self):
        """Initialise le navigateur Selenium si nécessaire"""
        if self.driver is None:
            options = Options()
            options.add_argument("--headless")  # Mode sans interface graphique
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            options.add_argument(f"user-agent={self.headers['User-Agent']}")
            self.driver = webdriver.Chrome(options=options)
    
    def close(self):
        """Ferme le navigateur Selenium"""
        if self.driver:
            self.driver.quit()
            self.driver = None
    
    def scrape_msci_esg_ratings(self, company_symbol):
        """
        Extrait les données ESG de MSCI pour une entreprise spécifique
        
        Args:
            company_symbol (str): Le symbole boursier de l'entreprise
            
        Returns:
            dict: Les données ESG extraites
        """
        logger.info(f"Extraction des données MSCI ESG pour {company_symbol}")
        
        # URL exemple pour MSCI (à adapter selon la structure réelle du site)
        url = f"https://www.msci.com/our-solutions/esg-investing/esg-ratings/esg-ratings-corporate-search-tool/issuer/{company_symbol}"
        
        try:
            self._init_selenium()
            self.driver.get(url)
            
            # Attendre que les éléments ESG soient chargés
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".esg-rating"))
            )
            
            # Extraire les données ESG
            soup = BeautifulSoup(self.driver.page_source, "html.parser")
            
            # Ces sélecteurs CSS sont hypothétiques et doivent être adaptés à la structure réelle
            esg_rating = soup.select_one(".esg-rating").text.strip() if soup.select_one(".esg-rating") else "N/A"
            environmental_score = soup.select_one(".env-score").text.strip() if soup.select_one(".env-score") else "N/A"
            social_score = soup.select_one(".social-score").text.strip() if soup.select_one(".social-score") else "N/A"
            governance_score = soup.select_one(".gov-score").text.strip() if soup.select_one(".gov-score") else "N/A"
            
            data = {
                "source": "MSCI",
                "company": company_symbol,
                "esg_rating": esg_rating,
                "environmental_score": environmental_score,
                "social_score": social_score,
                "governance_score": governance_score,
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
            
            return data
            
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des données MSCI ESG pour {company_symbol}: {str(e)}")
            return {
                "source": "MSCI",
                "company": company_symbol,
                "error": str(e),
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
    
    def scrape_refinitiv_esg(self, company_symbol):
        """
        Extrait les données ESG de Refinitiv pour une entreprise spécifique
        
        Args:
            company_symbol (str): Le symbole boursier de l'entreprise
            
        Returns:
            dict: Les données ESG extraites
        """
        logger.info(f"Extraction des données Refinitiv ESG pour {company_symbol}")
        
        # URL exemple pour Refinitiv (à adapter)
        url = f"https://www.refinitiv.com/esg-scores/{company_symbol}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, "html.parser")
            
            # Adapater ces sélecteurs à la structure réelle de la page
            esg_score = soup.select_one(".esg-score").text.strip() if soup.select_one(".esg-score") else "N/A"
            environmental_score = soup.select_one(".env-pillar").text.strip() if soup.select_one(".env-pillar") else "N/A"
            social_score = soup.select_one(".social-pillar").text.strip() if soup.select_one(".social-pillar") else "N/A"
            governance_score = soup.select_one(".gov-pillar").text.strip() if soup.select_one(".gov-pillar") else "N/A"
            
            data = {
                "source": "Refinitiv",
                "company": company_symbol,
                "esg_score": esg_score,
                "environmental_score": environmental_score,
                "social_score": social_score,
                "governance_score": governance_score,
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
            
            return data
            
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des données Refinitiv ESG pour {company_symbol}: {str(e)}")
            return {
                "source": "Refinitiv",
                "company": company_symbol,
                "error": str(e),
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
    
    def scrape_sustainalytics_esg(self, company_symbol):
        """
        Extrait les données ESG de Sustainalytics pour une entreprise spécifique
        
        Args:
            company_symbol (str): Le symbole boursier de l'entreprise
            
        Returns:
            dict: Les données ESG extraites
        """
        logger.info(f"Extraction des données Sustainalytics ESG pour {company_symbol}")
        
        # URL exemple pour Sustainalytics (à adapter)
        url = f"https://www.sustainalytics.com/esg-rating/company/{company_symbol}"
        
        try:
            self._init_selenium()
            self.driver.get(url)
            
            # Attendre que les éléments ESG soient chargés
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".esg-risk-rating"))
            )
            
            # Extraire les données ESG
            soup = BeautifulSoup(self.driver.page_source, "html.parser")
            
            # Ces sélecteurs CSS sont hypothétiques et doivent être adaptés à la structure réelle
            esg_risk_rating = soup.select_one(".esg-risk-rating").text.strip() if soup.select_one(".esg-risk-rating") else "N/A"
            environmental_risk = soup.select_one(".env-risk").text.strip() if soup.select_one(".env-risk") else "N/A"
            social_risk = soup.select_one(".social-risk").text.strip() if soup.select_one(".social-risk") else "N/A"
            governance_risk = soup.select_one(".gov-risk").text.strip() if soup.select_one(".gov-risk") else "N/A"
            
            data = {
                "source": "Sustainalytics",
                "company": company_symbol,
                "esg_risk_rating": esg_risk_rating,
                "environmental_risk": environmental_risk,
                "social_risk": social_risk,
                "governance_risk": governance_risk,
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
            
            return data
            
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des données Sustainalytics ESG pour {company_symbol}: {str(e)}")
            return {
                "source": "Sustainalytics",
                "company": company_symbol,
                "error": str(e),
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
    
    def scrape_bloomberg_esg(self, company_symbol):
        """
        Extrait les données ESG de Bloomberg pour une entreprise spécifique
        
        Args:
            company_symbol (str): Le symbole boursier de l'entreprise
            
        Returns:
            dict: Les données ESG extraites
        """
        logger.info(f"Extraction des données Bloomberg ESG pour {company_symbol}")
        
        # URL exemple pour Bloomberg (à adapter)
        url = f"https://www.bloomberg.com/quote/{company_symbol}:US/sustainability"
        
        try:
            self._init_selenium()
            self.driver.get(url)
            
            # Attendre que les éléments ESG soient chargés
            WebDriverWait(self.driver, 15).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".esg-disclosure-score"))
            )
            
            # Extraire les données ESG
            soup = BeautifulSoup(self.driver.page_source, "html.parser")
            
            # Ces sélecteurs CSS sont hypothétiques et doivent être adaptés à la structure réelle
            esg_disclosure_score = soup.select_one(".esg-disclosure-score").text.strip() if soup.select_one(".esg-disclosure-score") else "N/A"
            environmental_disclosure = soup.select_one(".env-disclosure").text.strip() if soup.select_one(".env-disclosure") else "N/A"
            social_disclosure = soup.select_one(".social-disclosure").text.strip() if soup.select_one(".social-disclosure") else "N/A"
            governance_disclosure = soup.select_one(".gov-disclosure").text.strip() if soup.select_one(".gov-disclosure") else "N/A"
            
            data = {
                "source": "Bloomberg",
                "company": company_symbol,
                "esg_disclosure_score": esg_disclosure_score,
                "environmental_disclosure": environmental_disclosure,
                "social_disclosure": social_disclosure,
                "governance_disclosure": governance_disclosure,
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
            
            return data
            
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des données Bloomberg ESG pour {company_symbol}: {str(e)}")
            return {
                "source": "Bloomberg",
                "company": company_symbol,
                "error": str(e),
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }

    def scrape_cdp_climate_ratings(self, company_name):
        """
        Extrait les données climatiques de CDP pour une entreprise spécifique
        
        Args:
            company_name (str): Le nom de l'entreprise
            
        Returns:
            dict: Les données climatiques extraites
        """
        logger.info(f"Extraction des données CDP pour {company_name}")
        
        # URL exemple pour CDP (à adapter)
        url = "https://www.cdp.net/en/companies/companies-scores"
        
        try:
            self._init_selenium()
            self.driver.get(url)
            
            # Rechercher l'entreprise
            search_input = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.ID, "company-search"))
            )
            search_input.send_keys(company_name)
            search_button = self.driver.find_element(By.CSS_SELECTOR, ".search-button")
            search_button.click()
            
            # Attendre les résultats
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, ".company-result"))
            )
            
            # Extraire les données climatiques
            soup = BeautifulSoup(self.driver.page_source, "html.parser")
            
            # Ces sélecteurs CSS sont hypothétiques et doivent être adaptés à la structure réelle
            climate_rating = soup.select_one(".climate-score").text.strip() if soup.select_one(".climate-score") else "N/A"
            water_rating = soup.select_one(".water-score").text.strip() if soup.select_one(".water-score") else "N/A"
            forest_rating = soup.select_one(".forest-score").text.strip() if soup.select_one(".forest-score") else "N/A"
            
            data = {
                "source": "CDP",
                "company": company_name,
                "climate_rating": climate_rating,
                "water_rating": water_rating,
                "forest_rating": forest_rating,
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }
            
            return data
            
        except Exception as e:
            logger.error(f"Erreur lors de l'extraction des données CDP pour {company_name}: {str(e)}")
            return {
                "source": "CDP",
                "company": company_name,
                "error": str(e),
                "date_extracted": datetime.now().strftime("%Y-%m-%d")
            }

    def scrape_company_esg_data(self, company_symbol, company_name=None):
        """
        Extrait les données ESG de toutes les sources pour une entreprise
        
        Args:
            company_symbol (str): Le symbole boursier de l'entreprise
            company_name (str, optional): Le nom complet de l'entreprise (pour CDP)
            
        Returns:
            dict: Toutes les données ESG extraites
        """
        if company_name is None:
            company_name = company_symbol
            
        all_data = {}
        
        # Extraction depuis différentes sources
        all_data["msci"] = self.scrape_msci_esg_ratings(company_symbol)
        all_data["refinitiv"] = self.scrape_refinitiv_esg(company_symbol)
        all_data["sustainalytics"] = self.scrape_sustainalytics_esg(company_symbol)
        all_data["bloomberg"] = self.scrape_bloomberg_esg(company_symbol)
        all_data["cdp"] = self.scrape_cdp_climate_ratings(company_name)
        
        # Sauvegarder les données
        self._save_data(all_data, company_symbol)
        
        return all_data
    
    def scrape_multiple_companies(self, companies_list):
        """
        Extrait les données ESG pour plusieurs entreprises
        
        Args:
            companies_list (list): Liste de tuples (symbole, nom) des entreprises
            
        Returns:
            dict: Données ESG pour toutes les entreprises
        """
        all_companies_data = {}
        
        for company_info in companies_list:
            if isinstance(company_info, tuple) and len(company_info) >= 2:
                symbol, name = company_info[0], company_info[1]
            else:
                symbol = company_info
                name = company_info
                
            logger.info(f"Traitement de l'entreprise: {name} ({symbol})")
            
            # Ajouter un délai entre les requêtes pour éviter le blocage
            time.sleep(2)
            
            try:
                company_data = self.scrape_company_esg_data(symbol, name)
                all_companies_data[symbol] = company_data
            except Exception as e:
                logger.error(f"Erreur lors du traitement de {name}: {str(e)}")
                all_companies_data[symbol] = {"error": str(e)}
        
        # Consolider les données en un seul DataFrame
        self._consolidate_data(all_companies_data)
        
        return all_companies_data
    
    def _save_data(self, data, company_symbol):
        """
        Sauvegarde les données ESG pour une entreprise
        
        Args:
            data (dict): Les données à sauvegarder
            company_symbol (str): Le symbole de l'entreprise
        """
        # Créer un DataFrame pour chaque source
        for source, source_data in data.items():
            df = pd.DataFrame([source_data])
            
            # Sauvegarder en CSV
            filename = f"{self.output_dir}/{company_symbol}_{source}_esg_data.csv"
            df.to_csv(filename, index=False)
            logger.info(f"Données sauvegardées dans {filename}")
    
    def _consolidate_data(self, all_companies_data):
        """
        Consolide les données de toutes les entreprises en un seul fichier
        
        Args:
            all_companies_data (dict): Les données de toutes les entreprises
        """
        # Créer des DataFrames consolidés par source
        sources = ["msci", "refinitiv", "sustainalytics", "bloomberg", "cdp"]
        
        for source in sources:
            source_data_list = []
            
            for company, data in all_companies_data.items():
                if source in data and "error" not in data[source]:
                    source_data_list.append(data[source])
            
            if source_data_list:
                df = pd.DataFrame(source_data_list)
                filename = f"{self.output_dir}/consolidated_{source}_esg_data.csv"
                df.to_csv(filename, index=False)
                logger.info(f"Données consolidées sauvegardées dans {filename}")
        
        # Créer un fichier consolidé avec toutes les données
        combined_data = []
        
        for company, data in all_companies_data.items():
            company_combined = {"company_symbol": company}
            
            for source in sources:
                if source in data and "error" not in data[source]:
                    # Ajouter un préfixe source_ à chaque clé pour éviter les conflits
                    for key, value in data[source].items():
                        if key not in ["company", "date_extracted", "source"]:
                            company_combined[f"{source}_{key}"] = value
            
            combined_data.append(company_combined)
        
        if combined_data:
            df = pd.DataFrame(combined_data)
            filename = f"{self.output_dir}/all_esg_data_combined.csv"
            df.to_csv(filename, index=False)
            logger.info(f"Toutes les données combinées sauvegardées dans {filename}")

# Exemple d'utilisation
if __name__ == "__main__":
    # Liste d'entreprises à scraper: (symbole, nom)
    companies = [
        ("AAPL", "Apple Inc."),
        ("MSFT", "Microsoft Corporation"),
        ("AMZN", "Amazon.com, Inc."),
        ("GOOGL", "Alphabet Inc."),
        ("TSLA", "Tesla, Inc.")
    ]
    
    # Initialiser le scraper
    scraper = ESGScraper(output_dir="esg_data")
    
    try:
        # Scraper toutes les entreprises
        all_data = scraper.scrape_multiple_companies(companies)
        
        print("Extraction terminée. Les données sont sauvegardées dans le dossier 'esg_data'.")
        
    finally:
        # Fermer le navigateur Selenium
        scraper.close()
