/**
 * Service pour communiquer avec Ollama (modèle d'IA local)
 */
export class OllamaService {
  private static baseUrl = process.env.OLLAMA_API_URL || "http://localhost:11434"

  /**
   * Génère une réponse à partir d'un message utilisateur
   * @param message Le message de l'utilisateur
   * @param systemPrompt Le prompt système pour guider le modèle
   * @returns La réponse générée
   */
  static async generateResponse(message: string, systemPrompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
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
    } catch (error) {
      console.error("Erreur lors de l'appel à Ollama:", error)
      throw error
    }
  }

  /**
   * Vérifie si Ollama est disponible
   * @returns true si Ollama est disponible, false sinon
   */
  static async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`, {
        method: "GET",
      })

      return response.ok
    } catch (error) {
      console.warn("Ollama non disponible:", error)
      return false
    }
  }
}
