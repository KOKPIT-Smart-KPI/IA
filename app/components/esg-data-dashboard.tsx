"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart } from "lucide-react"

// Types pour les données ESG
interface ESGData {
  company: string
  source: string
  esg_rating?: string | number
  environmental_score?: string | number
  social_score?: string | number
  governance_score?: string | number
  esg_risk_rating?: string | number
  climate_rating?: string | number
  water_rating?: string | number
  forest_rating?: string | number
  date_extracted: string
}

interface ESGDataDashboardProps {
  companySymbol: string
}

export function ESGDataDashboard({ companySymbol }: ESGDataDashboardProps) {
  const [data, setData] = useState<Record<string, ESGData>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Dans une implémentation réelle, cette fonction appellerait une API
    // qui récupérerait les données ESG scrapées
    const fetchESGData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Simuler un appel API
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Données simulées
        const mockData: Record<string, ESGData> = {
          msci: {
            company: companySymbol,
            source: "MSCI",
            esg_rating: "AA",
            environmental_score: 7.8,
            social_score: 6.5,
            governance_score: 8.2,
            date_extracted: new Date().toISOString().split("T")[0],
          },
          sustainalytics: {
            company: companySymbol,
            source: "Sustainalytics",
            esg_risk_rating: 18.5,
            environmental_score: 4.2,
            social_score: 7.1,
            governance_score: 7.2,
            date_extracted: new Date().toISOString().split("T")[0],
          },
          cdp: {
            company: companySymbol,
            source: "CDP",
            climate_rating: "A-",
            water_rating: "B",
            forest_rating: "B+",
            date_extracted: new Date().toISOString().split("T")[0],
          },
        }

        setData(mockData)
      } catch (err) {
        setError("Erreur lors de la récupération des données ESG")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchESGData()
  }, [companySymbol])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Données ESG pour {companySymbol}</CardTitle>
          <CardDescription>Chargement des données...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Données ESG pour {companySymbol}</CardTitle>
          <CardDescription className="text-red-500">{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Données ESG pour {companySymbol}</CardTitle>
        <CardDescription>
          Dernière mise à jour: {data.msci?.date_extracted || new Date().toISOString().split("T")[0]}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ratings">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ratings">
              <BarChart className="h-4 w-4 mr-2" />
              Notations
            </TabsTrigger>
            <TabsTrigger value="environmental">
              <LineChart className="h-4 w-4 mr-2" />
              Environnement
            </TabsTrigger>
            <TabsTrigger value="social-governance">
              <PieChart className="h-4 w-4 mr-2" />
              Social & Gouvernance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ratings" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">MSCI ESG Rating</h3>
                <div className="text-3xl font-bold">{data.msci?.esg_rating || "N/A"}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {getESGRatingDescription(data.msci?.esg_rating as string)}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Sustainalytics Risk Rating</h3>
                <div className="text-3xl font-bold">{data.sustainalytics?.esg_risk_rating || "N/A"}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {getESGRiskDescription(data.sustainalytics?.esg_risk_rating as number)}
                </p>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">CDP Climate Rating</h3>
                <div className="text-3xl font-bold">{data.cdp?.climate_rating || "N/A"}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {getCDPRatingDescription(data.cdp?.climate_rating as string)}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="environmental" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Scores Environnementaux</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>MSCI Environmental:</span>
                    <span className="font-medium">{data.msci?.environmental_score || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sustainalytics Environmental:</span>
                    <span className="font-medium">{data.sustainalytics?.environmental_score || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>CDP Water Rating:</span>
                    <span className="font-medium">{data.cdp?.water_rating || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>CDP Forest Rating:</span>
                    <span className="font-medium">{data.cdp?.forest_rating || "N/A"}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Tendances Environnementales</h3>
                <p className="text-sm">
                  Les données de tendances environnementales seraient affichées ici, montrant l'évolution des scores
                  environnementaux au fil du temps.
                </p>
                <div className="h-32 mt-4 flex items-center justify-center border border-dashed rounded-md">
                  <span className="text-muted-foreground">Graphique de tendances</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social-governance" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Scores Sociaux</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>MSCI Social:</span>
                    <span className="font-medium">{data.msci?.social_score || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sustainalytics Social:</span>
                    <span className="font-medium">{data.sustainalytics?.social_score || "N/A"}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h3 className="font-medium mb-2">Scores de Gouvernance</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>MSCI Governance:</span>
                    <span className="font-medium">{data.msci?.governance_score || "N/A"}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sustainalytics Governance:</span>
                    <span className="font-medium">{data.sustainalytics?.governance_score || "N/A"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Fonctions utilitaires pour les descriptions
function getESGRatingDescription(rating: string): string {
  const ratings: Record<string, string> = {
    AAA: "Leader - Meilleure notation possible",
    AA: "Leader - Performance très élevée",
    A: "Moyenne supérieure",
    BBB: "Moyenne",
    BB: "Moyenne inférieure",
    B: "Retardataire",
    CCC: "Retardataire - Notation la plus basse",
  }

  return ratings[rating] || "Information non disponible"
}

function getESGRiskDescription(score: number): string {
  if (score < 10) return "Risque négligeable"
  if (score < 20) return "Risque faible"
  if (score < 30) return "Risque moyen"
  if (score < 40) return "Risque élevé"
  return "Risque sévère"
}

function getCDPRatingDescription(rating: string): string {
  const ratings: Record<string, string> = {
    A: "Leadership - Meilleure pratique",
    "A-": "Leadership",
    B: "Gestion",
    "B-": "Gestion",
    C: "Sensibilisation",
    "C-": "Sensibilisation",
    D: "Divulgation",
    "D-": "Divulgation",
    F: "Échec de divulgation",
  }

  return ratings[rating] || "Information non disponible"
}
