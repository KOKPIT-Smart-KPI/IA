"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ESGDataDashboard } from "@/app/components/esg-data-dashboard"
import { Search } from "lucide-react"

export default function ESGDataPage() {
  const [companySymbol, setCompanySymbol] = useState("")
  const [searchedCompany, setSearchedCompany] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (companySymbol.trim()) {
      setSearchedCompany(companySymbol.trim().toUpperCase())
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Données ESG en temps réel</h1>
      <p className="text-muted-foreground">
        Recherchez une entreprise par son symbole boursier pour voir ses données ESG provenant de différentes sources.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher une entreprise</CardTitle>
          <CardDescription>
            Entrez le symbole boursier d'une entreprise (ex: AAPL pour Apple, MSFT pour Microsoft)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Symbole boursier (ex: AAPL)"
                className="pl-8"
                value={companySymbol}
                onChange={(e) => setCompanySymbol(e.target.value)}
              />
            </div>
            <Button type="submit">Rechercher</Button>
          </form>
        </CardContent>
      </Card>

      {searchedCompany && (
        <div className="mt-6">
          <ESGDataDashboard companySymbol={searchedCompany} />
        </div>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Entreprises populaires</CardTitle>
          <CardDescription>Cliquez sur une entreprise pour voir ses données ESG</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("AAPL")
                setSearchedCompany("AAPL")
              }}
            >
              Apple (AAPL)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("MSFT")
                setSearchedCompany("MSFT")
              }}
            >
              Microsoft (MSFT)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("GOOGL")
                setSearchedCompany("GOOGL")
              }}
            >
              Alphabet (GOOGL)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("AMZN")
                setSearchedCompany("AMZN")
              }}
            >
              Amazon (AMZN)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("TSLA")
                setSearchedCompany("TSLA")
              }}
            >
              Tesla (TSLA)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("NVDA")
                setSearchedCompany("NVDA")
              }}
            >
              NVIDIA (NVDA)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("JPM")
                setSearchedCompany("JPM")
              }}
            >
              JPMorgan (JPM)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCompanySymbol("V")
                setSearchedCompany("V")
              }}
            >
              Visa (V)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
