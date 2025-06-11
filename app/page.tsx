"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, MessageSquare, ShieldCheck } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const user = localStorage.getItem("user")
    if (user) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-green-600" />
            <span className="font-bold text-xl">ESG Assistant</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => router.push("/auth/login")}>
              Se connecter
            </Button>
            <Button onClick={() => router.push("/auth/register")}>S'inscrire</Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Votre Assistant Intelligent pour la Performance ESG</h1>
            <p className="text-xl text-gray-600 mb-10">
              Obtenez des réponses instantanées à toutes vos questions sur les performances environnementales, sociales
              et de gouvernance de votre entreprise.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" onClick={() => router.push("/auth/register")} className="text-lg px-8">
                Commencer maintenant
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/demo")} className="text-lg px-8">
                Voir la démo
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Assistant Conversationnel</CardTitle>
                  <CardDescription>
                    Posez vos questions en langage naturel et obtenez des réponses précises instantanément.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Notre assistant utilise l'IA pour comprendre vos questions et vous fournir les données ESG dont vous
                    avez besoin, quand vous en avez besoin.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Données ESG en temps réel</CardTitle>
                  <CardDescription>
                    Accédez aux dernières données ESG de votre entreprise grâce au web scraping intelligent.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Notre système collecte et analyse en permanence les données ESG de votre entreprise à partir de
                    multiples sources.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <ShieldCheck className="h-10 w-10 text-green-600 mb-2" />
                  <CardTitle>Conformité et Reporting</CardTitle>
                  <CardDescription>
                    Assurez-vous que votre entreprise respecte les normes ESG et préparez vos rapports facilement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Suivez votre performance ESG, identifiez les domaines à améliorer et générez des rapports conformes
                    aux exigences réglementaires.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">ESG Assistant</h3>
              <p className="text-gray-400">
                Votre solution intelligente pour le suivi et l'analyse des performances ESG de votre entreprise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Accueil
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Fonctionnalités
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Tarifs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400">
                Email: contact@esg-assistant.com
                <br />
                Téléphone: +33 1 23 45 67 89
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2023 ESG Assistant. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
