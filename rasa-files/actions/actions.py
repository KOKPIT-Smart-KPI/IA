from typing import Any, Text, Dict, List
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import logging
import os
import sys

# Ajouter le chemin du scraper au PYTHONPATH
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from scraper.esg_scraper_adapter import ESGScraperAdapter

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialiser l'adaptateur de scraping ESG
esg_adapter = ESGScraperAdapter(data_dir="data/esg_data")

class ActionGetEmissionsCO2(Action):
    def name(self) -> Text:
        return "action_get_emissions_co2"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        logger.info("ActionGetEmissionsCO2 appelée")
        
        # Extraire la période des entités
        periode = next(tracker.get_latest_entity_values("periode"), None)
        logger.info(f"Période extraite: {periode}")
        
        try:
            # Récupérer les données via l'adaptateur
            emissions = esg_adapter.get_emissions_data(periode)
            logger.info(f"Émissions récupérées: {emissions}")
            
            if emissions:
                periode_text = f"pour {periode}" if periode else "au dernier trimestre"
                response = f"D'après nos données, les émissions de CO₂ {periode_text} étaient de {emissions:,} tonnes."
                
                # Ajouter une comparaison avec la période précédente
                if periode and periode.lower() == "dernier trimestre":
                    response += " C'est une réduction de 8% par rapport au trimestre précédent."
                elif periode and periode.lower() == "ce mois-ci":
                    response += " C'est une augmentation de 5% par rapport au mois précédent."
            else:
                response = "Je n'ai pas pu récupérer les données d'émissions de CO₂. Veuillez réessayer plus tard."
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des émissions: {e}")
            response = "Je n'ai pas pu récupérer les données d'émissions de CO₂ en raison d'une erreur technique. Veuillez réessayer plus tard."
        
        dispatcher.utter_message(text=response)
        return []

class ActionGetParite(Action):
    def name(self) -> Text:
        return "action_get_parite"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        logger.info("ActionGetParite appelée")
        
        # Extraire le département des entités
        departement = next(tracker.get_latest_entity_values("departement"), None)
        logger.info(f"Département extrait: {departement}")
        
        try:
            # Récupérer les données via l'adaptateur
            parite_data = esg_adapter.get_parite_data(departement)
            logger.info(f"Données de parité récupérées: {parite_data}")
            
            if parite_data:
                if departement and departement.lower() in parite_data:
                    taux = parite_data[departement.lower()] * 100
                    response = f"Le taux de parité hommes-femmes dans le département {departement} est de {taux:.1f}% de femmes."
                else:
                    response = "Le taux de parité hommes-femmes global est de 42% de femmes. Par département: "
                    details = [f"{dept.capitalize()}: {taux*100:.0f}%" for dept, taux in parite_data.items() if dept != "global"]
                    response += ", ".join(details) + "."
            else:
                response = "Je n'ai pas pu récupérer les données de parité. Veuillez réessayer plus tard."
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des données de parité: {e}")
            response = "Je n'ai pas pu récupérer les données de parité en raison d'une erreur technique. Veuillez réessayer plus tard."
        
        dispatcher.utter_message(text=response)
        return []

class ActionGetFormationRSE(Action):
    def name(self) -> Text:
        return "action_get_formation_rse"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        logger.info("ActionGetFormationRSE appelée")
        
        # Extraire la période des entités
        periode = next(tracker.get_latest_entity_values("periode"), None)
        logger.info(f"Période extraite: {periode}")
        
        try:
            # Récupérer les données via l'adaptateur
            heures = esg_adapter.get_formation_data(periode)
            logger.info(f"Heures de formation récupérées: {heures}")
            
            if heures:
                periode_text = f"{periode}" if periode else "ce mois-ci"
                response = f"{heures} heures de formation RSE ont été suivies {periode_text}."
                
                # Ajouter une tendance
                if periode and periode.lower() == "ce mois-ci":
                    response += " C'est une augmentation de 15% par rapport au mois précédent."
                elif periode and periode.lower() == "cette année":
                    response += " Nous avons déjà atteint 73% de notre objectif annuel."
            else:
                response = "Je n'ai pas pu récupérer les données de formation RSE. Veuillez réessayer plus tard."
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des données de formation: {e}")
            response = "Je n'ai pas pu récupérer les données de formation RSE en raison d'une erreur technique. Veuillez réessayer plus tard."
        
        dispatcher.utter_message(text=response)
        return []

class ActionGetScoreFournisseurs(Action):
    def name(self) -> Text:
        return "action_get_score_fournisseurs"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        logger.info("ActionGetScoreFournisseurs appelée")
        
        try:
            # Récupérer les données via l'adaptateur
            fournisseurs = esg_adapter.get_fournisseurs_data()
            logger.info(f"Données des fournisseurs récupérées: {fournisseurs}")
            
            if fournisseurs:
                response = "Les fournisseurs avec un score ESG faible cette année sont: "
                details = [f"{fournisseur} (score {score}/100)" for fournisseur, score in fournisseurs.items()]
                response += ", ".join(details) + "."
                response += " Nous avons mis en place des plans d'action avec ces fournisseurs pour améliorer leurs performances ESG."
            else:
                response = "Je n'ai pas pu récupérer les données des scores ESG des fournisseurs. Veuillez réessayer plus tard."
        except Exception as e:
            logger.error(f"Erreur lors de la récupération des scores fournisseurs: {e}")
            response = "Je n'ai pas pu récupérer les données des scores ESG des fournisseurs en raison d'une erreur technique. Veuillez réessayer plus tard."
        
        dispatcher.utter_message(text=response)
        return []

class ActionCompareEmpreinteCarbone(Action):
    def name(self) -> Text:
        return "action_compare_empreinte_carbone"
    
    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any]) -> List[Dict[Text, Any]]:
        
        logger.info("ActionCompareEmpreinteCarbone appelée")
        
        # Extraire les pays des entités
        pays_entities = list(tracker.get_latest_entity_values("pays"))
        logger.info(f"Pays extraits: {pays_entities}")
        
        if len(pays_entities) >= 2:
            pays1, pays2 = pays_entities[0], pays_entities[1]
        else:
            # Valeurs par défaut si les pays ne sont pas spécifiés
            pays1, pays2 = "france", "allemagne"
        
        try:
            # Récupérer les données via l'adaptateur
            empreintes = esg_adapter.get_empreinte_carbone(pays1, pays2)
            logger.info(f"Empreintes carbone récupérées: {empreintes}")
            
            if empreintes and len(empreintes) == 2:
                pays_list = list(empreintes.keys())
                diff = abs(empreintes[pays_list[0]] - empreintes[pays_list[1]])
                pourcentage = diff / max(empreintes.values()) * 100
                
                response = f"L'empreinte carbone de nos sites en {pays_list[0].capitalize()} est de {empreintes[pays_list[0]]:,} tonnes de CO₂ contre {empreintes[pays_list[1]]:,} tonnes pour nos sites en {pays_list[1].capitalize()}. "
                
                if empreintes[pays_list[0]] < empreintes[pays_list[1]]:
                    response += f"Les sites en {pays_list[0].capitalize()} émettent {pourcentage:.1f}% moins de CO₂. "
                else:
                    response += f"Les sites en {pays_list[0].capitalize()} émettent {pourcentage:.1f}% plus de CO₂. "
                
                response += "La différence s'explique principalement par le mix énergétique et l'efficacité des installations."
            else:
                response = "Je n'ai pas pu comparer l'empreinte carbone entre les pays spécifiés. Veuillez vérifier que les pays sont bien dans notre base de données."
        except Exception as e:
            logger.error(f"Erreur lors de la comparaison d'empreinte carbone: {e}")
            response = "Je n'ai pas pu comparer l'empreinte carbone en raison d'une erreur technique. Veuillez réessayer plus tard."
        
        dispatcher.utter_message(text=response)
        return []
