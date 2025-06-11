"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowDown, ArrowUp, BarChart3, Users, Clock, ShieldAlert } from "lucide-react"

export function ESGMetricsOverview() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Émissions CO₂</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,500 t</div>
            <p className="text-xs text-muted-foreground">Dernier trimestre</p>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowDown className="h-4 w-4 mr-1" />
              <span>-8% par rapport au trimestre précédent</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parité H/F</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42%</div>
            <p className="text-xs text-muted-foreground">Femmes dans l'entreprise</p>
            <div className="mt-2">
              <Progress value={42} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Objectif: 50%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Formation RSE</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">450 h</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
            <div className="flex items-center mt-2 text-sm text-green-600">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>+15% par rapport au mois précédent</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score ESG moyen</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72/100</div>
            <p className="text-xs text-muted-foreground">Évaluation globale</p>
            <div className="mt-2">
              <Progress value={72} className="h-2" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Secteur: 68/100</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Répartition des émissions CO₂</CardTitle>
            <CardDescription>Par source d'émission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center border border-dashed rounded-md">
              <span className="text-muted-foreground">Graphique de répartition des émissions</span>
              {/* Dans une implémentation réelle, vous intégreriez ici un graphique avec une bibliothèque comme recharts ou Chart.js */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Parité hommes-femmes par département</CardTitle>
            <CardDescription>Pourcentage de femmes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span>R&D</span>
                  <span className="font-medium">38%</span>
                </div>
                <Progress value={38} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Marketing</span>
                  <span className="font-medium">51%</span>
                </div>
                <Progress value={51} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Finance</span>
                  <span className="font-medium">45%</span>
                </div>
                <Progress value={45} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Production</span>
                  <span className="font-medium">32%</span>
                </div>
                <Progress value={32} className="h-2 mt-1" />
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span>Service client</span>
                  <span className="font-medium">58%</span>
                </div>
                <Progress value={58} className="h-2 mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
