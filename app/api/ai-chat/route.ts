import { NextResponse } from "next/server"
import { esgResponsesFr } from "@/app/utils/esg-questions-fr"
import { AIService } from "@/app/services/ai-service"

export async function POST(req: Request) {
  try {
    // Récupérer le message du corps de la requête
    const body = await req.json()
    const { message } = body

    // Vérifier la disponibilité des services d'IA
    const availability = await AIService.checkAvailability()

    // Si aucun service d'IA n'est disponible, utiliser le mode fallback
    if (availability.activeProvider === "fallback") {
      console.log("Aucun service d'IA disponible, utilisation du mode fallback")
      const fallbackResponse = getFallbackResponse(message)

      return NextResponse.json([
        {
          recipient_id: "user",
          text: fallbackResponse,
        },
      ])
    }

    // Contexte ESG pour guider l'IA
    const ESG_CONTEXT = `
    Tu es un assistant spécialisé dans les questions ESG (Environnement, Social et Gouvernance) pour une entreprise.
    Tu dois répondre aux questions des utilisateurs concernant les performances ESG de leur entreprise.
    Utilise un ton professionnel mais accessible, et fournis des réponses précises et informatives.

    Voici quelques données fictives que tu peux utiliser pour tes réponses :
    - Émissions CO2 : 12,500 tonnes au dernier trimestre (réduction de 8% par rapport au trimestre précédent)
    - Parité hommes-femmes : 42% de femmes au global (R&D: 38%, Marketing: 51%, Finance: 45%, Production: 32%)
    - Formation RSE : 450 heures ce mois-ci (augmentation de 15% par rapport au mois précédent)
    - Fournisseurs avec score ESG faible : Supplier A (42/100), Supplier B (38/100), Supplier C (45/100)
    - Empreinte carbone par pays : France (8,200 tonnes), Allemagne (10,500 tonnes), Espagne (7,800 tonnes)
    - Consommation énergétique totale : 85 GWh (diminution de 3% par rapport à l'année précédente)
    - Pourcentage d'énergie renouvelable : 32% (objectif de 50% d'ici 2030)
    - Consommation d'eau : 120,000 m³ par an (réduction de 8% par rapport à l'année précédente)

    Si tu ne connais pas la réponse à une question spécifique, suggère des pistes d'amélioration ou des bonnes pratiques ESG plutôt que d'inventer des données.
    `

    // Utiliser le service d'IA pour générer une réponse
    const text = await AIService.generateResponse(message, ESG_CONTEXT)

    return NextResponse.json([
      {
        recipient_id: "user",
        text: text,
      },
    ])
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API:", error)

    // En cas d'erreur, utiliser le mode fallback
    const fallbackResponse = getFallbackResponse((error as Error).message || "Erreur inconnue")

    return NextResponse.json([
      {
        recipient_id: "user",
        text: fallbackResponse,
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

  // Normaliser la question pour la recherche
  const normalizedQuestion = question.toLowerCase().trim()

  // Recherche par mots-clés pour les émissions CO2
  if (
    normalizedQuestion.includes("émission") ||
    normalizedQuestion.includes("co2") ||
    normalizedQuestion.includes("carbone") ||
    normalizedQuestion.includes("gaz à effet") ||
    normalizedQuestion.includes("ges")
  ) {
    return "D'après nos données, les émissions de CO₂ au dernier trimestre étaient de 12,500 tonnes, soit une réduction de 8% par rapport au trimestre précédent."
  }

  // Recherche par mots-clés pour la parité
  if (
    normalizedQuestion.includes("parité") ||
    normalizedQuestion.includes("femme") ||
    normalizedQuestion.includes("genre") ||
    normalizedQuestion.includes("diversité") ||
    normalizedQuestion.includes("égalité")
  ) {
    return "Le taux de parité hommes-femmes global est de 42% de femmes. Par département: R&D: 38%, Marketing: 51%, Finance: 45%, Production: 32%, Service client: 58%, Équipe technique: 35%."
  }

  // Recherche par mots-clés pour la formation
  if (
    normalizedQuestion.includes("formation") ||
    normalizedQuestion.includes("rse") ||
    normalizedQuestion.includes("développement") ||
    normalizedQuestion.includes("compétence") ||
    normalizedQuestion.includes("apprentissage")
  ) {
    return "450 heures de formation RSE ont été suivies ce mois-ci. C'est une augmentation de 15% par rapport au mois précédent."
  }

  // Recherche par mots-clés pour les fournisseurs
  if (
    normalizedQuestion.includes("fournisseur") ||
    normalizedQuestion.includes("score") ||
    normalizedQuestion.includes("esg") ||
    normalizedQuestion.includes("chaîne") ||
    normalizedQuestion.includes("approvisionnement")
  ) {
    return "Les fournisseurs avec un score ESG faible cette année sont: Supplier A (score 42/100), Supplier B (score 38/100) et Supplier C (score 45/100). Nous avons mis en place des plans d'action avec ces fournisseurs pour améliorer leurs performances ESG."
  }

  // Recherche par mots-clés pour l'énergie
  if (
    normalizedQuestion.includes("énergie") ||
    normalizedQuestion.includes("énergétique") ||
    normalizedQuestion.includes("électricité") ||
    normalizedQuestion.includes("consommation") ||
    normalizedQuestion.includes("kwh") ||
    normalizedQuestion.includes("mwh") ||
    normalizedQuestion.includes("gwh") ||
    normalizedQuestion.includes("renouvelable") ||
    normalizedQuestion.includes("efficacité")
  ) {
    // Déterminer le type de question sur l'énergie
    if (normalizedQuestion.includes("consommation") || normalizedQuestion.includes("total")) {
      return "Votre consommation énergétique totale pour l'année dernière était de 85 GWh, soit une diminution de 3% par rapport à l'année précédente. Cette consommation se répartit entre l'électricité (65%), le gaz naturel (25%) et d'autres sources (10%)."
    }

    if (normalizedQuestion.includes("renouvelable") || normalizedQuestion.includes("verte")) {
      return "Actuellement, 32% de votre consommation énergétique totale provient de sources renouvelables, principalement de l'électricité verte certifiée (25%) et de la biomasse (7%). Ce pourcentage a augmenté de 8 points par rapport à l'année précédente, et vous êtes en bonne voie pour atteindre votre objectif de 50% d'ici 2030."
    }

    if (
      normalizedQuestion.includes("efficacité") ||
      normalizedQuestion.includes("mesure") ||
      normalizedQuestion.includes("action")
    ) {
      return "Plusieurs mesures d'efficacité énergétique ont été mises en place : 1) Modernisation des systèmes CVC dans 80% des bâtiments, 2) Installation de LED dans tous les sites, 3) Mise en place d'un système de gestion technique des bâtiments, 4) Isolation thermique renforcée sur 60% des sites, 5) Formation des employés aux écogestes. Ces mesures ont permis une réduction de 12% de la consommation énergétique au cours des 3 dernières années."
    }

    // Réponse par défaut sur l'énergie
    return "Notre stratégie énergétique vise à réduire notre consommation de 40% d'ici 2030 et à atteindre 50% d'énergies renouvelables. Actuellement, notre consommation est de 85 GWh par an, dont 32% provient de sources renouvelables. Nous avons mis en place plusieurs mesures d'efficacité énergétique qui ont permis une réduction de 12% de notre consommation au cours des 3 dernières années."
  }

  // Recherche par mots-clés pour l'eau
  if (
    normalizedQuestion.includes("eau") ||
    normalizedQuestion.includes("hydrique") ||
    normalizedQuestion.includes("consommation d'eau") ||
    normalizedQuestion.includes("m3") ||
    normalizedQuestion.includes("stress hydrique") ||
    normalizedQuestion.includes("recyclage") ||
    normalizedQuestion.includes("économie d'eau")
  ) {
    // Déterminer le type de question sur l'eau
    if (normalizedQuestion.includes("consommation") || normalizedQuestion.includes("total")) {
      return "Notre consommation d'eau annuelle s'élève à 120 000 m³, principalement utilisée pour les processus industriels (65%), les sanitaires et cuisines (25%), et l'arrosage des espaces verts (10%). Cette consommation a diminué de 8% par rapport à l'année précédente grâce à nos initiatives d'économie d'eau."
    }

    if (
      normalizedQuestion.includes("initiative") ||
      normalizedQuestion.includes("réduction") ||
      normalizedQuestion.includes("économie")
    ) {
      return "Nous avons mis en place plusieurs initiatives pour réduire notre consommation d'eau : 1) Installation de systèmes de récupération d'eau de pluie sur 60% de nos sites, 2) Mise en place de circuits fermés pour les eaux de refroidissement, 3) Installation de robinets et toilettes à faible débit, 4) Optimisation des processus industriels pour réduire les besoins en eau, 5) Sensibilisation des employés aux économies d'eau. Ces mesures ont permis une réduction de 15% de notre consommation d'eau au cours des 3 dernières années."
    }

    if (normalizedQuestion.includes("stress hydrique") || normalizedQuestion.includes("impact")) {
      return "Nous avons 3 sites situés dans des zones de stress hydrique (2 en Espagne et 1 au Maroc), représentant 18% de notre consommation d'eau totale. Pour ces sites, nous avons mis en place des plans spécifiques de gestion de l'eau avec des objectifs de réduction plus ambitieux (-25% d'ici 2025) et des investissements dans des technologies de recyclage des eaux usées. Nous réalisons également une évaluation annuelle des risques liés à l'eau selon la méthodologie du CEO Water Mandate."
    }

    // Réponse par défaut sur l'eau
    return "Notre stratégie de gestion de l'eau vise à réduire notre consommation de 20% d'ici 2030 et à recycler 50% de nos eaux usées. Actuellement, notre consommation est de 120 000 m³ par an, avec une réduction de 8% par rapport à l'année précédente. Nous avons mis en place plusieurs initiatives d'économie d'eau et portons une attention particulière à nos sites situés dans des zones de stress hydrique."
  }

  // Réponse par défaut
  return "Je n'ai pas encore d'information précise sur cette question. Nos équipes ESG travaillent à enrichir ma base de connaissances. Pourriez-vous reformuler ou poser une question sur les émissions CO2, la parité, les formations RSE, les scores ESG des fournisseurs, la consommation énergétique ou la gestion de l'eau?"
}
