/**
 * Service pour gérer les différentes options d'IA
 */
export class AIService {
  // Option 1: Ollama (locale)
  private static ollamaBaseUrl = process.env.OLLAMA_API_URL || "http://localhost:11434"

  // Option 2: Hugging Face (cloud)
  private static huggingfaceBaseUrl = "https://api-inference.huggingface.co/models"
  private static huggingfaceModel = "mistralai/Mistral-7B-Instruct-v0.2" // Modèle gratuit performant

  /**
   * Vérifie la disponibilité des différentes options d'IA
   * @returns Informations sur les options d'IA disponibles
   */
  static async checkAvailability(): Promise<{
    ollama: boolean
    huggingface: boolean
    activeProvider: "ollama" | "huggingface" | "fallback"
  }> {
    let ollamaAvailable = false
    let huggingfaceAvailable = false

    // Vérifier Ollama
    try {
      const ollamaResponse = await fetch(`${this.ollamaBaseUrl}/api/tags`, {
        method: "GET",
        cache: "no-store",
      })
      ollamaAvailable = ollamaResponse.ok
    } catch (error) {
      console.warn("Ollama non disponible:", error)
    }

    // Vérifier Hugging Face
    const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY
    if (huggingfaceApiKey) {
      try {
        const huggingfaceResponse = await fetch(`${this.huggingfaceBaseUrl}/${this.huggingfaceModel}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${huggingfaceApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: "Hello", parameters: { max_new_tokens: 5 } }),
          cache: "no-store",
        })
        huggingfaceAvailable = huggingfaceResponse.ok
      } catch (error) {
        console.warn("Hugging Face non disponible:", error)
      }
    }

    // Déterminer le fournisseur actif
    let activeProvider: "ollama" | "huggingface" | "fallback" = "fallback"
    if (ollamaAvailable) {
      activeProvider = "ollama"
    } else if (huggingfaceAvailable) {
      activeProvider = "huggingface"
    }

    return {
      ollama: ollamaAvailable,
      huggingface: huggingfaceAvailable,
      activeProvider,
    }
  }

  /**
   * Génère une réponse à partir d'un message utilisateur
   * @param message Le message de l'utilisateur
   * @param systemPrompt Le prompt système pour guider le modèle
   * @returns La réponse générée
   */
  static async generateResponse(message: string, systemPrompt: string): Promise<string> {
    const availability = await this.checkAvailability()

    // Essayer Ollama d'abord (plus rapide car local)
    if (availability.ollama) {
      try {
        return await this.generateWithOllama(message, systemPrompt)
      } catch (error) {
        console.error("Erreur avec Ollama, essai avec Hugging Face:", error)
      }
    }

    // Essayer Hugging Face ensuite
    if (availability.huggingface) {
      try {
        return await this.generateWithHuggingFace(message, systemPrompt)
      } catch (error) {
        console.error("Erreur avec Hugging Face:", error)
      }
    }

    // Si tout échoue, retourner un message d'erreur
    throw new Error("Aucun service d'IA disponible")
  }

  /**
   * Génère une réponse avec Ollama
   */
  private static async generateWithOllama(message: string, systemPrompt: string): Promise<string> {
    const response = await fetch(`${this.ollamaBaseUrl}/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3", // Vous pouvez utiliser d'autres modèles comme "mistral" ou "gemma"
        prompt: message,
        system: systemPrompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur API Ollama: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.response
  }

  /**
   * Génère une réponse avec Hugging Face
   */
  private static async generateWithHuggingFace(message: string, systemPrompt: string): Promise<string> {
    const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY
    if (!huggingfaceApiKey) {
      throw new Error("Clé API Hugging Face non configurée")
    }

    // Formater le prompt pour les modèles Mistral
    const formattedPrompt = `<s>[INST] ${systemPrompt}\n\nQuestion: ${message} [/INST]</s>`

    const response = await fetch(`${this.huggingfaceBaseUrl}/${this.huggingfaceModel}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${huggingfaceApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: formattedPrompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    })

    if (!response.ok) {
      throw new Error(`Erreur API Hugging Face: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // Extraire la réponse du modèle (format peut varier selon le modèle)
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      // Extraire uniquement la partie réponse (après le prompt)
      const fullText = data[0].generated_text
      const responseText = fullText.split("[/INST]")[1]?.trim() || fullText
      return responseText
    }

    throw new Error("Format de réponse Hugging Face non reconnu")
  }
}
