import os
import logging
import json
from datetime import datetime
from .esg_scraper_simple import SimpleESGScraper

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ESGScraperAdapter:
    """
    Adaptateur pour intégrer le scraper ESG au système Rasa
    """
    
    def __init__(self, data_dir="esg_data"):
        """
        Initialise l'adaptateur
        
        Args:
            data_dir (str): Répertoire où stocker/lire les données ESG
        """
        self.data_dir = data_dir
        self.scraper = SimpleESGScraper(data_dir=data_dir)
        
        # Créer le répertoire de données s'il n'existe pas
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
        
        # Charger ou initialiser les données
        self.cached_data = self._load_cached_data()
    
    def _load_cached_data(self):
        """
        Charge les données ESG précédemment sauvegardées
        
        Returns:
            dict: Données ESG
        """
        cached_data = {}
        
        # Vérifier si le fichier de données des entreprises existe
        company_file = os.path.join(self.data_dir, "company_esg_data.json")
        if os.path.exists(company_file):
            try:
                with open(company_file, "r", encoding="utf-8") as f:
                    cached_data = json.load(f)
            except Exception as e:
                logger.error(f"Erreur lors du chargement des données: {e}")
                # Générer de nouvelles données
                self.scraper.save_data()
                cached_data = self.scraper.company_esg_data
        else:
            # Générer et sauvegarder de nouvelles données
            self.scraper.save_data()
            cached_data = self.scraper.company_esg_data
        
        return cached_data
    
    def get_emissions_data(self, periode=None):
        """
        Récupère les données d'émissions CO2
        
        Args:
            periode (str): Période spécifique
            
        Returns:
            int: Valeur des émissions CO2
        """
        return self.scraper.get_emissions_data(periode)
    
    def get_parite_data(self, departement=None):
        """
        Récupère les données de parité hommes-femmes
        
        Args:
            departement (str): Département spécifique
            
        Returns:
            dict: Données de parité
        """
        return self.scraper.get_parite_data(departement)
    
    def get_formation_data(self, periode=None):
        """
        Récupère les données de formation RSE
        
        Args:
            periode (str): Période spécifique
            
        Returns:
            int: Nombre d'heures de formation
        """
        return self.scraper.get_formation_data(periode)
    
    def get_fournisseurs_data(self, seuil=50):
        """
        Récupère les données des fournisseurs avec un  seuil=50):
        """
        Récupère les données des fournisseurs avec un score ESG faible
        
        Args:
            seuil (int): Seuil de score ESG
            
        Returns:
            dict: Fournisseurs avec un score faible
        """
        return self.scraper.get_fournisseurs_data(seuil)
    
    def get_empreinte_carbone(self, pays1, pays2):
        """
        Compare l'empreinte carbone entre deux pays
        
        Args:
            pays1 (str): Premier pays
            pays2 (str): Deuxième pays
            
        Returns:
            dict: Empreinte carbone des deux pays
        """
        return self.scraper.get_empreinte_carbone(pays1, pays2)
    
    def get_company_esg_data(self, company_symbol, company_name=None, force_refresh=False):
        """
        Récupère les données ESG d'une entreprise
        
        Args:
            company_symbol (str): Symbole boursier de l'entreprise
            company_name (str, optional): Nom complet de l'entreprise
            force_refresh (bool): Si True, force une nouvelle extraction
            
        Returns:
            dict: Données ESG de l'entreprise
        """
        if force_refresh or company_symbol not in self.cached_data:
            # Récupérer de nouvelles données
            company_data = self.scraper.get_company_esg_data(company_symbol)
            self.cached_data[company_symbol] = company_data
        
        return self.cached_data[company_symbol]
    
    def close(self):
        """Méthode de fermeture (pour compatibilité)"""
        pass
