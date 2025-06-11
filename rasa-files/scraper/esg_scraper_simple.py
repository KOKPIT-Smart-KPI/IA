import os
import json
import logging
import random
from datetime import datetime, timedelta

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SimpleESGScraper:
    """
    Scraper ESG simplifié qui génère des données simulées
    sans dépendances externes comme Selenium
    """
    
    def __init__(self, data_dir="esg_data"):
        """
        Initialise le scraper ESG simplifié
        
        Args:
            data_dir (str): Répertoire où sauvegarder les données
        """
        self.data_dir = data_dir
        
        # Créer le répertoire de sortie s'il n'existe pas
        if not os.path.exists(data_dir):
            os.makedirs(data_dir)
        
        # Données simulées
        self.emissions_data = {
            "dernier trimestre": 12500,
            "ce mois-ci": 4200,
            "cette année": 48000,
            "2023": 52000,
            "q2": 13200,
            "l'année dernière": 51000
        }
        
        self.parite_data = {
            "global": 0.42,  # 42% de femmes
            "r&d": 0.38,
            "marketing": 0.51,
            "finance": 0.45,
            "production": 0.32,
            "service client": 0.58,
            "équipe technique": 0.35
        }
        
        self.formation_data = {
            "ce mois-ci": 450,
            "le premier trimestre": 1250,
            "cette année": 3800,
            "2023": 5200,
            "le mois dernier": 420
        }
        
        self.fournisseurs_data = {
            "Supplier A": 42,
            "Supplier B": 38,
            "Supplier C": 45,
            "Supplier D": 72,
            "Supplier E": 68,
            "Supplier F": 85
        }
        
        self.empreinte_carbone = {
            "france": 8200,
            "allemagne": 10500,
            "espagne": 7800,
            "portugal": 6500,
            "italie": 9200,
            "suisse": 5800,
            "belgique": 6200,
            "pays-bas": 7100,
            "royaume-uni": 9800
        }
        
        # Données ESG des entreprises
        self.company_esg_data = {
            "AAPL": {
                "msci": {
                    "esg_rating": "AA",
                    "environmental_score": 7.8,
                    "social_score": 6.5,
                    "governance_score": 8.2
                },
                "sustainalytics": {
                    "esg_risk_rating": 18.5,
                    "environmental_risk": 4.2,
                    "social_risk": 7.1,
                    "governance_risk": 7.2
                }
            },
            "MSFT": {
                "msci": {
                    "esg_rating": "AAA",
                    "environmental_score": 8.5,
                    "social_score": 7.2,
                    "governance_score": 8.7
                },
                "sustainalytics": {
                    "esg_risk_rating": 14.2,
                    "environmental_risk": 3.8,
                    "social_risk": 5.9,
                    "governance_risk": 4.5
                }
            },
            "GOOGL": {
                "msci": {
                    "esg_rating": "AA",
                    "environmental_score": 7.9,
                    "social_score": 6.8,
                    "governance_score": 7.5
                },
                "sustainalytics": {
                    "esg_risk_rating": 17.8,
                    "environmental_risk": 4.0,
                    "social_risk": 7.5,
                    "governance_risk": 6.3
                }
            }
        }
    
    def get_emissions_data(self, periode=None):
        """
        Récupère les données d'émissions CO2
        
        Args:
            periode (str): Période spécifique
            
        Returns:
            int: Valeur des émissions CO2
        """
        logger.info(f"Récupération des données d'émissions CO2 pour la période: {periode}")
        
        if periode and periode.lower() in self.emissions_data:
            return self.emissions_data[periode.lower()]
        
        # Valeur par défaut
        return self.emissions_data["dernier trimestre"]
    
    def get_parite_data(self, departement=None):
        """
        Récupère les données de parité hommes-femmes
        
        Args:
            departement (str): Département spécifique
            
        Returns:
            dict: Données de parité
        """
        logger.info(f"Récupération des données de parité pour le département: {departement}")
        
        if departement and departement.lower() in self.parite_data:
            return {departement.lower(): self.parite_data[departement.lower()]}
        
        # Retourner toutes les données
        return self.parite_data
    
    def get_formation_data(self, periode=None):
        """
        Récupère les données de formation RSE
        
        Args:
            periode (str): Période spécifique
            
        Returns:
            int: Nombre d'heures de formation
        """
        logger.info(f"Récupération des données de formation pour la période: {periode}")
        
        if periode and periode.lower() in self.formation_data:
            return self.formation_data[periode.lower()]
        
        # Valeur par défaut
        return self.formation_data["ce mois-ci"]
    
    def get_fournisseurs_data(self, seuil=50):
        """
        Récupère les données des fournisseurs avec un score ESG faible
        
        Args:
            seuil (int): Seuil de score ESG
            
        Returns:
            dict: Fournisseurs avec un score faible
        """
        logger.info(f"Récupération des fournisseurs avec un score ESG < {seuil}")
        
        return {k: v for k, v in self.fournisseurs_data.items() if v < seuil}
    
    def get_empreinte_carbone(self, pays1, pays2):
        """
        Compare l'empreinte carbone entre deux pays
        
        Args:
            pays1 (str): Premier pays
            pays2 (str): Deuxième pays
            
        Returns:
            dict: Empreinte carbone des deux pays
        """
        logger.info(f"Comparaison de l'empreinte carbone entre {pays1} et {pays2}")
        
        result = {}
        if pays1 and pays1.lower() in self.empreinte_carbone:
            result[pays1.lower()] = self.empreinte_carbone[pays1.lower()]
        if pays2 and pays2.lower() in self.empreinte_carbone:
            result[pays2.lower()] = self.empreinte_carbone[pays2.lower()]
        
        return result
    
    def get_company_esg_data(self, company_symbol):
        """
        Récupère les données ESG d'une entreprise
        
        Args:
            company_symbol (str): Symbole boursier de l'entreprise
            
        Returns:
            dict: Données ESG de l'entreprise
        """
        logger.info(f"Récupération des données ESG pour {company_symbol}")
        
        # Si l'entreprise existe dans notre base de données
        if company_symbol in self.company_esg_data:
            return self.company_esg_data[company_symbol]
        
        # Sinon, générer des données aléatoires
        return {
            "msci": {
                "esg_rating": random.choice(["A", "AA", "BBB", "BB"]),
                "environmental_score": round(random.uniform(5.0, 8.5), 1),
                "social_score": round(random.uniform(5.0, 8.0), 1),
                "governance_score": round(random.uniform(5.5, 8.5), 1)
            },
            "sustainalytics": {
                "esg_risk_rating": round(random.uniform(15.0, 30.0), 1),
                "environmental_risk": round(random.uniform(3.0, 7.0), 1),
                "social_risk": round(random.uniform(5.0, 9.0), 1),
                "governance_risk": round(random.uniform(4.0, 8.0), 1)
            }
        }
    
    def save_data(self):
        """
        Sauvegarde toutes les données dans des fichiers JSON
        """
        logger.info("Sauvegarde des données ESG")
        
        # Sauvegarder les données d'émissions
        with open(os.path.join(self.data_dir, "emissions_co2.json"), "w", encoding="utf-8") as f:
            json.dump(self.emissions_data, f, ensure_ascii=False, indent=2)
        
        # Sauvegarder les données de parité
        with open(os.path.join(self.data_dir, "parite.json"), "w", encoding="utf-8") as f:
            json.dump(self.parite_data, f, ensure_ascii=False, indent=2)
        
        # Sauvegarder les données de formation
        with open(os.path.join(self.data_dir, "formation_rse.json"), "w", encoding="utf-8") as f:
            json.dump(self.formation_data, f, ensure_ascii=False, indent=2)
        
        # Sauvegarder les données des fournisseurs
        with open(os.path.join(self.data_dir, "score_fournisseurs.json"), "w", encoding="utf-8") as f:
            json.dump(self.fournisseurs_data, f, ensure_ascii=False, indent=2)
        
        # Sauvegarder les données d'empreinte carbone
        with open(os.path.join(self.data_dir, "empreinte_carbone.json"), "w", encoding="utf-8") as f:
            json.dump(self.empreinte_carbone, f, ensure_ascii=False, indent=2)
        
        # Sauvegarder les données ESG des entreprises
        with open(os.path.join(self.data_dir, "company_esg_data.json"), "w", encoding="utf-8") as f:
            json.dump(self.company_esg_data, f, ensure_ascii=False, indent=2)
        
        logger.info("Toutes les données ont été sauvegardées avec succès")

# Exemple d'utilisation
if __name__ == "__main__":
    scraper = SimpleESGScraper()
    
    # Récupérer quelques données
    emissions = scraper.get_emissions_data("dernier trimestre")
    print(f"Émissions CO2 au dernier trimestre: {emissions} tonnes")
    
    parite = scraper.get_parite_data()
    print(f"Parité globale: {parite['global']*100}% de femmes")
    
    formation = scraper.get_formation_data("ce mois-ci")
    print(f"Heures de formation RSE ce mois-ci: {formation}")
    
    fournisseurs = scraper.get_fournisseurs_data()
    print(f"Fournisseurs avec un score ESG faible: {fournisseurs}")
    
    empreinte = scraper.get_empreinte_carbone("france", "allemagne")
    print(f"Empreinte carbone: {empreinte}")
    
    company_data = scraper.get_company_esg_data("AAPL")
    print(f"Données ESG d'Apple: {company_data}")
    
    # Sauvegarder toutes les données
    scraper.save_data()
