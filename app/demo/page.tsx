"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
  timestamp: Date
}

export default function DemoPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      text: "Bonjour ! Je suis votre assistant ESG en mode démo. Posez-moi une question sur les performances ESG fictives.",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length,
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // In a real implementation, this would call your Rasa API
      const response = await mockRasaResponse(input)

      // Add bot response
      const botMessage: Message = {
        id: messages.length + 1,
        text: response,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error getting response:", error)

      // Add error message
      const errorMessage: Message = {
        id: messages.length + 1,
        text: "Désolé, j'ai rencontré un problème pour traiter votre demande.",
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Mock function to simulate Rasa responses
  const mockRasaResponse = async (userInput: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Simple pattern matching for demo purposes
    const input = userInput.toLowerCase()

    if (input.includes("émission") || input.includes("co2") || input.includes("carbone")) {
      return "Dans cette démo, les émissions de CO₂ fictives au dernier trimestre étaient de 12,500 tonnes, soit une réduction de 8% par rapport au trimestre précédent."
    } else if (input.includes("parité") || input.includes("homme") || input.includes("femme")) {
      return "Dans cette démo, le taux de parité hommes-femmes global fictif est de 42% de femmes. Par département: R&D: 38%, Marketing: 51%, Finance: 45%, Production: 32%."
    } else if (input.includes("formation") || input.includes("rse")) {
      return "Dans cette démo, 450 heures fictives de formation RSE ont été suivies ce mois-ci, soit une augmentation de 15% par rapport au mois précédent."
    } else if (input.includes("fournisseur") || input.includes("score")) {
      return "Dans cette démo, les fournisseurs fictifs avec un score ESG faible cette année sont: Supplier A (score 42/100), Supplier B (score 38/100) et Supplier C (score 45/100)."
    } else if (input.includes("compare") && input.includes("france") && input.includes("allemagne")) {
      return "Dans cette démo, l'empreinte carbone fictive de nos sites en France est de 8,200 tonnes de CO₂ contre 10,500 tonnes pour nos sites en Allemagne."
    } else {
      return "Ceci est une démo. Pour accéder à toutes les fonctionnalités, veuillez créer un compte. Vous pouvez me poser des questions sur les émissions CO2, la parité, les formations RSE ou les fournisseurs."
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex items-center">
          <Button variant="ghost" onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-xl font-bold">Démo de l'Assistant ESG</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 max-w-4xl">
        <Card className="h-[calc(100vh-8rem)]">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg">Mode Démo - Fonctionnalités limitées</CardTitle>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto h-[calc(100%-8rem)]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className="flex items-end gap-2 max-w-[80%]">
                    {message.sender === "bot" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Bot" />
                        <AvatarFallback>ESG</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">{formatTime(message.timestamp)}</p>
                    </div>
                    {message.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          <CardFooter className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Posez une question sur les performances ESG..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Envoyer</span>
              </Button>
            </form>
          </CardFooter>
        </Card>

        <div className="mt-4 text-center">
          <p className="mb-4">Ceci est une version de démonstration avec des fonctionnalités limitées.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push("/auth/register")}>Créer un compte</Button>
            <Button variant="outline" onClick={() => router.push("/auth/login")}>
              Se connecter
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
