import { type NextRequest, NextResponse } from "next/server"
import { esgResponsesFr } from "@/app/utils/esg-questions-fr"

export async function POST(request: NextRequest) {
  try {
    // Récupérer le message du corps de la requête
    const body = await request.json()
    const { message } = body

    // Dans l'environnement de prévisualisation, utiliser toujours le mode fallback
    const fallbackResponse = getFallbackResponse(message)

    // Simuler une réponse de l'API Rasa
    return NextResponse.json([
      {
        recipient_id: "user",
        text: fallbackResponse,
      },
    ])

    /* 
    // Ce code est commenté car il ne fonctionne pas dans l'environnement de prévisualisation
    // Dans un environnement de production, vous pourriez le décommenter
    
    const rasaUrl = process.env.RASA_API_URL || "http://localhost:5005"
    
    // Utiliser un timeout manuel
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    try {
      const rasaResponse = await fetch(`${rasaUrl}/webhooks/rest/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: "user",
          message: message,
        }),
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
      
      if (!rasaResponse.ok) {
        throw new Error(`Erreur API Rasa: ${rasaResponse.status}`)
      }
      
      const data = await rasaResponse.json()
      return NextResponse.json(data)
    } catch (error) {
      clearTimeout(timeoutId)
      console.warn("Utilisation du mode fallback:", error)
      
      // Utiliser la réponse de fallback
      const fallbackResponse = getFallbackResponse(message)
      return NextResponse.json([
        {
          recipient_id: "user",
          text: fallbackResponse
        }
      ])
    }
    */
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Rasa:", error)

    // En cas d'erreur, retourner une réponse par défaut
    return NextResponse.json([
      {
        recipient_id: "user",
        text: "Je suis désolé, je ne peux pas traiter votre demande pour le moment. Veuillez réessayer plus tard.",
      },
    ])
  }
}

// Fonction pour obtenir une réponse de secours
function getFallbackResponse(question: string): string {
  // Vérifier si la question existe dans notre base de réponses
  const knownResponses = esgResponsesFr as Record<string, string>

  // Recherche exacte
  if (knownResponses[question]) {
    return knownResponses[question]
  }

  // Recherche par mots-clés pour les émissions CO2
  if (
    question.toLowerCase().includes("émission") ||
    question.toLowerCase().includes("co2") ||
    question.toLowerCase().includes("carbone")
  ) {
    return "D'après nos données, les émissions de CO₂ au dernier trimestre étaient de 12,500 tonnes, soit une réduction de 8% par rapport au trimestre précédent."
  }

  // Recherche par mots-clés pour la parité
  if (
    question.toLowerCase().includes("parité") ||
    question.toLowerCase().includes("femme") ||
    question.toLowerCase().includes("genre")
  ) {
    return "Le taux de parité hommes-femmes global est de 42% de femmes. Par département: R&D: 38%, Marketing: 51%, Finance: 45%, Production: 32%, Service client: 58%, Équipe technique: 35%."
  }

  // Recherche par mots-clés pour la formation
  if (
    question.toLowerCase().includes("formation") ||
    question.toLowerCase().includes("rse") ||
    question.toLowerCase().includes("développement")
  ) {
    return "450 heures de formation RSE ont été suivies ce mois-ci. C'est une augmentation de 15% par rapport au mois précédent."
  }

  // Recherche par mots-clés pour les fournisseurs
  if (
    question.toLowerCase().includes("fournisseur") ||
    question.toLowerCase().includes("score") ||
    question.toLowerCase().includes("esg")
  ) {
    return "Les fournisseurs avec un score ESG faible cette année sont: Supplier A (score 42/100), Supplier B (score 38/100) et Supplier C (score 45/100). Nous avons mis en place des plans d'action avec ces fournisseurs pour améliorer leurs performances ESG."
  }

  // Réponse par défaut
  return "Je n'ai pas encore d'information précise sur cette question. Nos équipes ESG travaillent à enrichir ma base de connaissances. Pourriez-vous reformuler ou poser une question sur les émissions CO2, la parité, les formations RSE ou les scores ESG des fournisseurs?"
}
