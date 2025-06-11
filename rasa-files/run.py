import os
import sys
import logging
import subprocess
from scraper.esg_scraper import ESGScraper

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setup_environment():
    """Vérifie et configure l'environnement pour Rasa"""
    logger.info("Configuration de l'environnement...")
    
    # Vérifier si Rasa est installé
    try:
        import rasa
        logger.info(f"Rasa version {rasa.__version__} trouvée")
    except ImportError:
        logger.error("Rasa n'est pas installé. Installation en cours...")
        subprocess.run([sys.executable, "-m", "pip", "install", "rasa"])
    
    # Vérifier si les dépendances sont installées
    try:
        import requests
        import bs4
        import pandas
        logger.info("Toutes les dépendances sont installées")
    except ImportError as e:
        logger.error(f"Dépendance manquante: {e}")
        logger.info("Installation des dépendances...")
        subprocess.run([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4", "pandas"])

def scrape_initial_data():
    """Récupère les données initiales via web scraping"""
    logger.info("Récupération des données initiales...")
    scraper = ESGScraper()
    data = scraper.run_all_scrapers()
    logger.info(f"Données récupérées avec succès: {len(data)} catégories")
    return data

def train_model():
    """Entraîne le modèle Rasa"""
    logger.info("Entraînement du modèle Rasa...")
    subprocess.run(["rasa", "train"])
    logger.info("Entraînement terminé")

def run_actions():
    """Lance le serveur d'actions Rasa"""
    logger.info("Démarrage du serveur d'actions...")
    subprocess.Popen(["rasa", "run", "actions"])

def run_rasa():
    """Lance le serveur Rasa"""
    logger.info("Démarrage du serveur Rasa...")
    subprocess.run(["rasa", "run", "--enable-api", "--cors", "*"])

def main():
    """Fonction principale pour lancer le chatbot ESG"""
    logger.info("Démarrage de l'assistant conversationnel ESG...")
    
    # Configuration de l'environnement
    setup_environment()
    
    # Récupération des données initiales
    data = scrape_initial_data()
    
    # Entraînement du modèle
    train_model()
    
    # Lancement du serveur d'actions
    run_actions()
    
    # Lancement du serveur Rasa
    run_rasa()

if __name__ == "__main__":
    main()
