"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Server, Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

export function ApiConnectionStatus() {
  const [status, setStatus] = useState<{
    isConnected: boolean
    provider?: string
    providers?: {
      ollama?: boolean
      huggingface?: boolean
    }
  } | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkConnection = async () => {
    setIsChecking(true)
    try {
      const response = await fetch("/api/ai-status", {
        method: "GET",
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setStatus({
          isConnected: data.mode === "ai",
          provider: data.provider,
          providers: data.providers,
        })
      } else {
        setStatus({ isConnected: false })
      }
    } catch (error) {
      console.error("Erreur lors de la vérification de la connexion:", error)
      setStatus({ isConnected: false })
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkConnection()
  }, [])

  if (status === null) {
    return (
      <Alert className="bg-gray-100">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Vérification de la connexion...</AlertTitle>
        <AlertDescription>Nous vérifions la connexion aux services d'IA.</AlertDescription>
      </Alert>
    )
  }

  if (status.isConnected) {
    return (
      <Alert className="bg-green-50">
        {status.provider === "ollama" ? (
          <Server className="h-4 w-4 text-green-600" />
        ) : (
          <Cloud className="h-4 w-4 text-green-600" />
        )}
        <AlertTitle className="flex items-center gap-2">
          Connecté à l'IA
          <Badge variant="outline" className="ml-2">
            {status.provider === "ollama" ? "Ollama (Local)" : "Hugging Face (Cloud)"}
          </Badge>
        </AlertTitle>
        <AlertDescription>
          L'assistant est connecté et peut répondre à vos questions ESG.
          {status.providers && (
            <div className="mt-2 text-xs text-muted-foreground">
              Services disponibles:
              {status.providers.ollama && <span className="ml-1 text-green-600">Ollama</span>}
              {status.providers.ollama && status.providers.huggingface && <span>, </span>}
              {status.providers.huggingface && <span className="text-green-600">Hugging Face</span>}
            </div>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-amber-50">
      <Server className="h-4 w-4 text-amber-600" />
      <AlertTitle>Mode démo (IA non disponible)</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          L'assistant fonctionne actuellement en mode démo avec des réponses prédéfinies. Pour utiliser l'IA, vous
          pouvez:
        </p>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Installer Ollama localement (option gratuite et illimitée)</li>
          <li>Configurer une clé API Hugging Face (option cloud avec niveau gratuit)</li>
        </ul>
        <Button variant="outline" size="sm" className="w-fit" onClick={checkConnection} disabled={isChecking}>
          {isChecking ? "Vérification..." : "Vérifier la connexion"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
