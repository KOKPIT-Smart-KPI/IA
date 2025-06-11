"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ESGReportGenerator() {
  const [selectedPeriod, setSelectedPeriod] = useState("q2-2023")
  const [selectedSections, setSelectedSections] = useState({
    emissions: true,
    diversity: true,
    training: true,
    suppliers: true,
    governance: false,
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportGenerated, setReportGenerated] = useState(false)
  const [reportUrl, setReportUrl] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSectionChange = (section: keyof typeof selectedSections) => {
    setSelectedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    try {
      // Simuler la génération d'un rapport
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Créer un objet Blob pour simuler un PDF
      const reportContent = generateReportContent(selectedPeriod, selectedSections)
      const blob = new Blob([reportContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)

      setReportUrl(url)
      setReportGenerated(true)

      toast({
        title: "Rapport généré avec succès",
        description: `Rapport ESG pour ${formatPeriod(selectedPeriod)} prêt à être téléchargé.`,
      })
    } catch (error) {
      console.error("Erreur lors de la génération du rapport:", error)
      toast({
        title: "Erreur de génération",
        description: "Impossible de générer le rapport. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (reportUrl) {
      // Créer un élément a temporaire pour déclencher le téléchargement
      const a = document.createElement("a")
      a.href = reportUrl
      a.download = `rapport-esg-${selectedPeriod}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      toast({
        title: "Téléchargement démarré",
        description: "Votre rapport est en cours de téléchargement.",
      })
    }
  }

  // Nettoyer l'URL du blob lors du démontage du composant
  useEffect(() => {
    return () => {
      if (reportUrl) {
        URL.revokeObjectURL(reportUrl)
      }
    }
  }, [reportUrl])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="period">Période du rapport</Label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger id="period" className="w-full">
                <SelectValue placeholder="Sélectionnez une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="q1-2023">Q1 2023</SelectItem>
                <SelectItem value="q2-2023">Q2 2023</SelectItem>
                <SelectItem value="q3-2023">Q3 2023</SelectItem>
                <SelectItem value="q4-2023">Q4 2023</SelectItem>
                <SelectItem value="year-2023">Année 2023</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="mb-2 block">Sections à inclure</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emissions"
                  checked={selectedSections.emissions}
                  onCheckedChange={() => handleSectionChange("emissions")}
                />
                <Label htmlFor="emissions">Émissions de CO₂ et impact environnemental</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="diversity"
                  checked={selectedSections.diversity}
                  onCheckedChange={() => handleSectionChange("diversity")}
                />
                <Label htmlFor="diversity">Diversité et inclusion</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="training"
                  checked={selectedSections.training}
                  onCheckedChange={() => handleSectionChange("training")}
                />
                <Label htmlFor="training">Formation et développement RSE</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="suppliers"
                  checked={selectedSections.suppliers}
                  onCheckedChange={() => handleSectionChange("suppliers")}
                />
                <Label htmlFor="suppliers">Évaluation des fournisseurs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="governance"
                  checked={selectedSections.governance}
                  onCheckedChange={() => handleSectionChange("governance")}
                />
                <Label htmlFor="governance">Gouvernance et éthique</Label>
              </div>
            </div>
          </div>

          <Button
            onClick={handleGenerateReport}
            disabled={isGenerating || Object.values(selectedSections).every((v) => !v)}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                Générer le rapport
              </>
            )}
          </Button>
        </div>

        <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
          {reportGenerated ? (
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 mx-auto text-primary" />
              <div>
                <h3 className="font-medium">Rapport ESG généré</h3>
                <p className="text-sm text-muted-foreground">Rapport ESG pour {formatPeriod(selectedPeriod)}</p>
              </div>
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Télécharger le rapport
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <FileText className="h-16 w-16 mx-auto opacity-20" />
              <p className="mt-2">Aucun rapport généré</p>
              <p className="text-sm">Sélectionnez les options et cliquez sur "Générer le rapport"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Fonction pour formater la période
function formatPeriod(period: string): string {
  switch (period) {
    case "q1-2023":
      return "1er trimestre 2023"
    case "q2-2023":
      return "2ème trimestre 2023"
    case "q3-2023":
      return "3ème trimestre 2023"
    case "q4-2023":
      return "4ème trimestre 2023"
    case "year-2023":
      return "l'année 2023"
    default:
      return period
  }
}

// Fonction pour générer le contenu du rapport
function generateReportContent(period: string, sections: Record<string, boolean>): string {
  const formattedPeriod = formatPeriod(period)

  let content = `RAPPORT ESG - ${formattedPeriod.toUpperCase()}\n\n`
  content += `Date de génération: ${new Date().toLocaleDateString()}\n\n`
  content += "RÉSUMÉ EXÉCUTIF\n"
  content += "Ce rapport présente les performances ESG de l'entreprise pour " + formattedPeriod + ".\n\n"

  if (sections.emissions) {
    content += "1. ÉMISSIONS DE CO₂ ET IMPACT ENVIRONNEMENTAL\n"
    content += "   - Émissions totales: 12,500 tonnes de CO₂\n"
    content += "   - Réduction par rapport à la période précédente: 8%\n"
    content += "   - Principales sources: Transport (40%), Énergie (35%), Achats (15%)\n"
    content += "   - Initiatives en cours: Transition vers les énergies renouvelables, optimisation logistique\n\n"
  }

  if (sections.diversity) {
    content += "2. DIVERSITÉ ET INCLUSION\n"
    content += "   - Taux de parité global: 42% de femmes\n"
    content += "   - Répartition par département: R&D (38%), Marketing (51%), Finance (45%), Production (32%)\n"
    content += "   - Initiatives en cours: Programme de mentorat, recrutement inclusif\n\n"
  }

  if (sections.training) {
    content += "3. FORMATION ET DÉVELOPPEMENT RSE\n"
    content += "   - Heures de formation RSE: 450 heures\n"
    content += "   - Augmentation par rapport à la période précédente: 15%\n"
    content += "   - Principaux programmes: Sensibilisation environnementale, éthique des affaires\n\n"
  }

  if (sections.suppliers) {
    content += "4. ÉVALUATION DES FOURNISSEURS\n"
    content += "   - Fournisseurs évalués: 45 sur 50\n"
    content +=
      "   - Fournisseurs avec score ESG faible: Supplier A (42/100), Supplier B (38/100), Supplier C (45/100)\n"
    content += "   - Actions correctives: Plans d'amélioration, audits supplémentaires\n\n"
  }

  if (sections.governance) {
    content += "5. GOUVERNANCE ET ÉTHIQUE\n"
    content += "   - Composition du conseil: 45% de femmes, 30% d'administrateurs indépendants\n"
    content += "   - Alertes éthiques reçues: 5 (toutes traitées)\n"
    content += "   - Conformité réglementaire: 100% des exigences DPEF respectées\n\n"
  }

  content += "CONCLUSION ET PERSPECTIVES\n"
  content +=
    "L'entreprise continue de progresser dans sa démarche ESG. Des efforts supplémentaires sont nécessaires dans certains domaines, notamment la réduction des émissions et l'amélioration de la parité dans les départements techniques.\n\n"

  content += "Ce rapport a été généré automatiquement par l'Assistant ESG."

  return content
}

// Ajout de l'import manquant
import { useEffect } from "react"
