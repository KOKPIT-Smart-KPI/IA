"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ApiConnectionStatus } from "../components/api-connection-status"
import { ESGDataDashboard } from "../components/esg-data-dashboard"
import { ESGChatAssistant } from "../components/esg-chat-assistant"
import { ESGQuestionsExplorer } from "../components/esg-questions-explorer"
import { esgQuestionsFr } from "../utils/esg-questions-fr"
import { BarChart3, MessageSquare, FileText, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ESGMetricsOverview } from "../components/esg-metrics-overview"
import { ESGReportGenerator } from "../components/esg-report-generator"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [selectedQuestion, setSelectedQuestion] = useState<string | undefined>(undefined)

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
    // Basculer vers l'onglet de l'assistant si nous sommes sur l'onglet des questions
    const assistantTab = document.querySelector('[data-value="assistant"]') as HTMLElement
    if (assistantTab) {
      assistantTab.click()
    }
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
              <Button variant="ghost" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Tableau de bord ESG
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
                <MessageSquare className="mr-2 h-4 w-4" />
                Assistant ESG
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-start">
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

          <Tabs defaultValue="overview" className="mt-4">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
              <TabsTrigger value="data">Données ESG</TabsTrigger>
              <TabsTrigger value="assistant" data-value="assistant">
                Assistant IA
              </TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <ESGMetricsOverview />
            </TabsContent>

            <TabsContent value="data" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="assistant" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Générateur de rapports ESG</CardTitle>
                  <CardDescription>Générez des rapports ESG personnalisés basés sur vos données.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ESGReportGenerator />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
