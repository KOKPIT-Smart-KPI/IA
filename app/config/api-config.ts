// Configuration de l'API
export const API_CONFIG = {
  // URL de l'API Rasa - à modifier selon votre environnement
  RASA_API_URL: process.env.NEXT_PUBLIC_RASA_API_URL || "http://localhost:5005",

  // Délai d'attente pour les requêtes API (en ms)
  TIMEOUT: 5000,

  // Indique si on doit utiliser les réponses de secours en cas d'échec de l'API
  USE_FALLBACK: true,
}
