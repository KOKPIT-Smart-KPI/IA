/**
 * Service pour communiquer avec l'API d'IA via notre API route Next.js
 */
export class RasaApiService {
  /**
   * Envoie un message à l'API d'IA via notre API route
   * @param message Le message à envoyer
   * @returns La réponse de l'API ou null en cas d'erreur
   */
  static async sendMessage(message: string): Promise<string | null> {
    try {
      // Appeler notre API route Next.js qui utilise l'IA
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        console.warn(`Erreur API: ${response.status} ${response.statusText}`)
        return null
      }

      const data = await response.json()

      if (data && data.length > 0 && data[0].text) {
        return data[0].text
      }

      return null
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API:", error)
      return null
    }
  }

  /**
   * Vérifie si l'API d'IA est disponible
   * @returns true si l'API est disponible, false sinon
   */
  static async checkApiAvailability(): Promise<boolean> {
    try {
      const response = await fetch("/api/ai-status", {
        method: "GET",
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      return data.status === "ok" && data.mode === "ai"
    } catch (error) {
      console.warn("API non disponible:", error)
      return false
    }
  }
}
