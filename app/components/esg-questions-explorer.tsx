"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

// Définition des types
interface Question {
  id: string
  text: string
  category: string
  subcategory: string
}

interface ESGQuestionsExplorerProps {
  questions: Question[]
  onSelectQuestion: (question: string) => void
}

export function ESGQuestionsExplorer({ questions, onSelectQuestion }: ESGQuestionsExplorerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Extraire les catégories uniques
  const categories = Array.from(new Set(questions.map((q) => q.category)))

  // Filtrer les questions en fonction du terme de recherche
  const filteredQuestions = questions.filter(
    (q) =>
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.subcategory.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Organiser les questions par catégorie et sous-catégorie
  const questionsByCategory = categories.map((category) => {
    const questionsInCategory = filteredQuestions.filter((q) => q.category === category)
    const subcategories = Array.from(new Set(questionsInCategory.map((q) => q.subcategory)))

    return {
      category,
      subcategories: subcategories.map((subcategory) => ({
        name: subcategory,
        questions: questionsInCategory.filter((q) => q.subcategory === subcategory),
      })),
    }
  })

  // Fonction pour gérer le clic sur une question
  const handleQuestionClick = (question: string) => {
    onSelectQuestion(question)
  }

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher des questions..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue={categories[0]} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-4 mt-4">
            {questionsByCategory
              .find((c) => c.category === category)
              ?.subcategories.map((subcategory) => (
                <Accordion key={subcategory.name} type="single" collapsible className="w-full">
                  <AccordionItem value={subcategory.name}>
                    <AccordionTrigger className="text-md font-medium">{subcategory.name}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid gap-2">
                        {subcategory.questions.map((question) => (
                          <Button
                            key={question.id}
                            variant="ghost"
                            className="justify-start text-left h-auto py-2 hover:bg-gray-100"
                            onClick={() => handleQuestionClick(question.text)}
                          >
                            {question.text}
                          </Button>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
