# Assistant Conversationnel ESG avec IA Gratuite

Ce projet implémente un tableau de bord ESG complet avec un assistant conversationnel intelligent pour permettre aux utilisateurs de poser des questions liées à la performance ESG (Environnement, Social et Gouvernance) de l'entreprise, en utilisant des solutions d'IA gratuites.

## Fonctionnalités

- Tableau de bord ESG avec visualisations de données
- Assistant conversationnel IA pour répondre aux questions ESG
- Générateur de rapports ESG
- Analyse de données ESG (émissions CO₂, parité, formation, fournisseurs)
- **Deux options d'IA gratuites** : Ollama (locale) et Hugging Face (cloud)

## Options d'IA Gratuites

### 1. Ollama (Solution locale)

- **Totalement gratuit et illimité**
- **Aucune clé API requise**
- **Confidentialité totale** - Les données ne quittent jamais votre serveur
- **Fonctionne hors ligne**
- **Installation facile** - Téléchargez depuis [ollama.ai](https://ollama.ai)

### 2. Hugging Face (Solution cloud)

- **Niveau gratuit généreux**
- **Modèles de pointe** comme Mistral, Llama, etc.
- **Pas d'installation locale requise**
- **API simple et bien documentée**
- **Communauté active et support**

## Prérequis

- Node.js 18+
- Pour Ollama : 8 Go RAM minimum recommandé
- Pour Hugging Face : Clé API gratuite

## Installation

1. Clonez ce dépôt:
\`\`\`bash
git clone https://github.com/votre-utilisateur/esg-assistant.git
cd esg-assistant
\`\`\`

2. Installez les dépendances:
\`\`\`bash
npm install
\`\`\`

3. Configurez l'IA:

   **Option 1: Ollama (locale)**
   - Installez Ollama depuis [ollama.ai](https://ollama.ai)
   - Téléchargez un modèle:
   \`\`\`bash
   ollama pull llama3
   \`\`\`
   - Créez un fichier `.env.local` avec:
   \`\`\`
   OLLAMA_API_URL=http://localhost:11434
   \`\`\`

   **Option 2: Hugging Face (cloud)**
   - Créez un compte sur [Hugging Face](https://huggingface.co)
   - Obtenez une clé API gratuite
   - Créez un fichier `.env.local` avec:
   \`\`\`
   HUGGINGFACE_API_KEY=votre-clé-api
   \`\`\`

4. Lancez l'application:
\`\`\`bash
npm run dev
\`\`\`

## Mode de fonctionnement

L'application détecte automatiquement les services d'IA disponibles et utilise le meilleur disponible:

1. **Ollama** (prioritaire car plus rapide)
2. **Hugging Face** (si Ollama n'est pas disponible)
3. **Mode démo** (réponses prédéfinies si aucune IA n'est disponible)

## Personnalisation

### Changer le modèle Ollama

Modifiez la ligne `model: "llama3"` dans `app/services/ai-service.ts` pour utiliser un autre modèle comme "mistral" ou "gemma".

### Changer le modèle Hugging Face

Modifiez la ligne `private static huggingfaceModel = "mistralai/Mistral-7B-Instruct-v0.2"` dans `app/services/ai-service.ts` pour utiliser un autre modèle disponible sur Hugging Face.

### Modifier le prompt système

Pour personnaliser le comportement de l'IA, modifiez la variable `ESG_CONTEXT` dans le fichier `app/api/ai-chat/route.ts`.

## Licence

Ce projet est sous licence MIT.
