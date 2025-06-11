"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiConnectionStatus } from "../components/api-connection-status"
import { ESGDataDashboard } from "../components/esg-data-dashboard"
import { ESGChatAssistant } from "../components/esg-chat-assistant"
import { ESGQuestionsExplorer } from "../components/esg-questions-explorer"
import { esgQuestionsFr } from "../utils/esg-questions-fr"
import { BarChart3, MessageSquare, FileText, LogOut, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ESGMetricsOverview } from "../components/esg-metrics-overview"
import { ESGReportGenerator } from "../components/esg-report-generator"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<string | undefined>(undefined)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error)
      localStorage.removeItem("user")
      router.push("/auth/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  // Fonction pour gérer la sélection d'une question
  const handleSelectQuestion = (question: string) => {
    setSelectedQuestion(question)
    // Basculer vers l'onglet de l'assistant
    setActiveTab("assistant")
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              {user.firstName ? user.firstName[0] : user.email[0]}
            </div>
            <div>
              <p className="font-medium">{user.firstName ? `${user.firstName} ${user.lastName}` : user.email}</p>
              <p className="text-xs text-muted-foreground">{user.company || "Entreprise"}</p>
            </div>
          </div>
        </div>
        <nav className="p-2">
          <ul className="space-y-1">
            <li>
              <Button
                variant={activeTab === "profile" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("profile")}
              >
                <Users className="mr-2 h-4 w-4" />
                Profil
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "overview" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("overview")}
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Tableau de bord ESG
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "assistant" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("assistant")}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Assistant ESG
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "data" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("data")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Données ESG
              </Button>
            </li>
            <li>
              <Button
                variant={activeTab === "reports" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab("reports")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Rapports ESG
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </Button>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-4 w-64 px-2">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Tableau de Bord ESG</h1>
          </div>
        </header>

        <main className="flex-1 p-4 overflow-auto">
          <ApiConnectionStatus />

          <div className="mt-4">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Profil utilisateur</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>Gérez vos informations de profil</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold">
                          {user.firstName ? user.firstName[0] : user.email[0]}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">
                            {user.firstName ? `${user.firstName} ${user.lastName}` : user.email}
                          </h3>
                          <p className="text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <label className="text-sm font-medium">Entreprise</label>
                          <p className="text-sm text-muted-foreground">{user.company || "Non renseigné"}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium">Rôle</label>
                          <p className="text-sm text-muted-foreground">
                            {user.role === "admin" ? "Administrateur" : "Utilisateur"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Préférences</CardTitle>
                      <CardDescription>Configurez vos préférences d'utilisation</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Notifications</label>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-notifications" defaultChecked />
                          <label htmlFor="email-notifications" className="text-sm">
                            Notifications par email
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="weekly-reports" defaultChecked />
                          <label htmlFor="weekly-reports" className="text-sm">
                            Rapports hebdomadaires
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Langue</label>
                        <select className="w-full p-2 border rounded-md">
                          <option value="fr">Français</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "overview" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Vue d'ensemble ESG</h2>
                <ESGMetricsOverview />
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Données ESG</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Données ESG</CardTitle>
                    <CardDescription>
                      Explorez les données ESG de votre entreprise et comparez-les avec d'autres entreprises.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ESGDataDashboard companySymbol="ACME" />
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "assistant" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Assistant ESG</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Assistant ESG</CardTitle>
                      <CardDescription>
                        Posez des questions sur vos données ESG et obtenez des réponses instantanées.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ESGChatAssistant initialQuestion={selectedQuestion} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Questions fréquentes</CardTitle>
                      <CardDescription>Explorez des questions ESG courantes par catégorie.</CardDescription>
                    </CardHeader>
                    <CardContent className="max-h-[500px] overflow-y-auto">
                      <ESGQuestionsExplorer questions={esgQuestionsFr} onSelectQuestion={handleSelectQuestion} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Rapports ESG</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>Générateur de rapports ESG</CardTitle>
                    <CardDescription>Générez des rapports ESG personnalisés basés sur vos données.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ESGReportGenerator />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
