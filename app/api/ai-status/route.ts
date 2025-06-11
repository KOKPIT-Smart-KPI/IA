import { NextResponse } from "next/server"
import { AIService } from "@/app/services/ai-service"

export async function GET() {
  try {
    // Vérifier la disponibilité des services d'IA
    const availability = await AIService.checkAvailability()

    if (availability.activeProvider !== "fallback") {
      return NextResponse.json({
        status: "ok",
        mode: "ai",
        provider: availability.activeProvider,
        providers: {
          ollama: availability.ollama,
          huggingface: availability.huggingface,
        },
      })
    } else {
      return NextResponse.json({ status: "error", mode: "fallback" }, { status: 200 })
    }
  } catch (error) {
    console.error("Erreur lors de la vérification des services d'IA:", error)
    return NextResponse.json({ status: "error", mode: "fallback" }, { status: 200 })
  }
}
