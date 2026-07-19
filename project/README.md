# ChefMate AI

> Turn your ingredients into delicious meals with AI.

ChefMate AI is a production-quality full-stack web application that generates personalized recipes based on the ingredients you already have at home. It uses an LLM (OpenAI GPT) to craft recipes tailored to your cuisine, dietary preferences, cooking time, and skill level — with streaming responses so text appears progressively.

![ChefMate AI](public/chef-hat.svg)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Frontend](#running-the-frontend)
- [Running the Backend](#running-the-backend)
- [Docker Commands](#docker-commands)
- [AWS Deployment (App Runner)](#aws-deployment-app-runner)
- [API Reference](#api-reference)
- [Prompt Engineering](#prompt-engineering)
- [Architecture & Security](#architecture--security)

---

## Features

- **AI Recipe Generation** — Enter your available ingredients and get a complete, structured recipe.
- **Streaming Responses** — Recipe text renders progressively as the AI generates it.
- **Customizable** — Choose cuisine (Indian, Italian, Chinese, Mexican, Middle Eastern, Any), dietary preference (Vegetarian, Vegan, Non-Vegetarian, High Protein, Low Carb), cooking time (15–60+ minutes), and difficulty (Beginner, Intermediate, Advanced).
- **Rich Recipe Output** — Recipe name, description, prep/cook time, servings, calories, ingredient list (with "you have this" badges), step-by-step instructions, chef tips, substitutions, and nutritional highlights.
- **Copy & Regenerate** — One-click copy to clipboard and "generate another recipe" button.
- **Premium UI** — Glassmorphism design, dark/light mode toggle, smooth animations, fully responsive.
- **Secure** — API keys are kept server-side; never exposed to the frontend.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Icons | Lucide React |
| Backend (standalone) | Express.js (Node.js) |
| Backend (Bolt/Supabase) | Supabase Edge Function (Deno) |
| AI Model | OpenAI GPT-4o-mini (configurable) |
| Container | Docker (multi-stage build) |
| Deployment | AWS App Runner |

---

## Project Structure

```
.
├── src/                        # Frontend React app
│   ├── components/             # UI components (Header, Hero, InputCard, etc.)
│   ├── hooks/                  # useTheme hook
│   ├── lib/                    # API client with streaming
│   ├── types.ts                # TypeScript types
│   ├── App.tsx                 # Main app with state management
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles + glassmorphism utilities
├── backend/                    # Standalone Express.js backend
│   ├── src/
│   │   ├── server.js           # Express server with SSE streaming
│   │   ├── openai.js           # OpenAI streaming client
│   │   └── prompt.js           # Prompt engineering
│   ├── package.json
│   └── .env.example
├── supabase/
│   └── functions/
│       └── generate-recipe/    # Supabase Edge Function (Deno)
│           └── index.ts
├── public/                     # Static assets
├── Dockerfile                  # Multi-stage: builds frontend + runs backend
├── .dockerignore
├── apprunner.yaml              # AWS App Runner configuration
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## Installation

### Prerequisites

- **Node.js** 20+ and npm
- An **OpenAI API key** — get one at [platform.openai.com](https://platform.openai.com/api-keys)

### Clone & Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..
```

---

## Environment Variables

### Frontend (`.env` in project root)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | See note | Supabase project URL (for Edge Function backend) |
| `VITE_SUPABASE_ANON_KEY` | See note | Supabase anon key (for Edge Function auth) |
| `VITE_API_BASE_URL` | No | Override to point at a custom Express backend URL instead of Supabase |

> **Note:** The frontend automatically uses the Supabase Edge Function if `VITE_SUPABASE_*` vars are present. Set `VITE_API_BASE_URL` to use the standalone Express backend instead.

### Backend (`backend/.env` — copy from `backend/.env.example`)

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | Your OpenAI API key |
| `OPENAI_MODEL` | No | Model to use (default: `gpt-4o-mini`) |
| `PORT` | No | Backend port (default: `3001`) |
| `CORS_ORIGIN` | No | Comma-separated allowed origins (default: `*`) |
| `NODE_ENV` | No | `production` or `development` |

```bash
# Copy the example and fill in your key
cp backend/.env.example backend/.env
```

### Supabase Edge Function

The Edge Function reads `OPENAI_API_KEY` from Supabase secrets (configured via the Supabase dashboard or MCP tools — never committed to code).

---

## Running the Frontend

```bash
# From the project root
npm run dev
```

The dev server starts at `http://localhost:5173`.

By default, the frontend calls the deployed Supabase Edge Function. To point it at your local Express backend instead, create a `.env` with:

```env
VITE_API_BASE_URL=http://localhost:3001
```

---

## Running the Backend

```bash
cd backend
npm start        # production
npm run dev      # development with auto-reload
```

The backend starts at `http://localhost:3001`. Health check: `GET http://localhost:3001/health`.

---

## Docker Commands

### Build the image

The Dockerfile uses a multi-stage build: it compiles the Vite frontend, then bundles it with the Express backend so a single container serves both the UI and the API on port `3001`.

```bash
docker build -t chefmate-ai .
```

### Run the container

```bash
docker run -p 3001:3001 \
  -e OPENAI_API_KEY=sk-your-key-here \
  -e CORS_ORIGIN=http://localhost:3001 \
  chefmate-ai
```

Open `http://localhost:3001` in your browser.

### Useful Docker commands

```bash
# View running containers
docker ps

# View logs
docker logs <container-id>

# Stop and remove
docker stop <container-id>
docker rm <container-id>

# Rebuild after code changes
docker build -t chefmate-ai . && docker run -p 3001:3001 -e OPENAI_API_KEY=sk-... chefmate-ai
```

---

## AWS Deployment (App Runner)

AWS App Runner is the recommended deployment target — it builds the Docker image and exposes it over HTTPS automatically.

### Option A: Deploy via the AWS Console

1. **Push your code to a repository** (GitHub, ECR, or Bitbucket).

2. Go to **AWS App Runner** → **Create service**.

3. Choose your source:
   - **Source code repository** — connect your GitHub repo. App Runner will use the `Dockerfile` and `apprunner.yaml` automatically.
   - **Container registry** — push the built image to ECR and reference it here.

4. Configure the service:
   - **Port:** `3001` (App Runner maps this to HTTPS automatically)
   - **Environment variables:**
     - `OPENAI_API_KEY` — your OpenAI key (set as a secret if available, otherwise as a plaintext env var)
     - `CORS_ORIGIN` — your App Runner domain (e.g. `https://xxxxxxxx.us-east-1.awsapprunner.com`)
     - `NODE_ENV` = `production`

5. Click **Create & Deploy**. App Runner builds the image and provisions an HTTPS endpoint.

6. Once deployed, update the frontend's `VITE_API_BASE_URL` (or `CORS_ORIGIN`) to match your App Runner URL, rebuild, and redeploy if serving separately.

### Option B: Deploy via AWS CLI

```bash
# Create the App Runner service (requires an ECR image or source connection)
aws apprunner create-service \
  --service-name chefmate-ai \
  --source-configuration '{"ConfigurationSource":"API","ImageRepository":{"ImageIdentifier":"YOUR_ECR_URI:latest","ImageRepositoryType":"ECR","ImageConfiguration":{"Port":"3001"}}}' \
  --instance-configuration '{"Cpu":"1 vCPU","Memory":"2 GB"}'
```

### Option C: Use apprunner.yaml

The included `apprunner.yaml` defines the runtime configuration. When connecting a source repository in the console, App Runner reads this file for port, start command, and env settings.

### Post-deployment checklist

- [ ] HTTPS endpoint is accessible (App Runner provides this automatically)
- [ ] `OPENAI_API_KEY` is set as an environment variable
- [ ] `CORS_ORIGIN` is set to your App Runner HTTPS domain
- [ ] Health check passes: `https://your-domain.awsapprunner.com/health`

---

## API Reference

### `POST /generate-recipe`

Generates a recipe using AI with streaming response.

**Request body:**

```json
{
  "ingredients": "chicken, rice, onion, garlic",
  "cuisine": "Indian",
  "dietaryPreference": "Non-Vegetarian",
  "cookingTime": "30 minutes",
  "difficulty": "Beginner"
}
```

**Response:** Server-Sent Events stream (`text/event-stream`)

Each event is a `data:` line containing JSON:

```
data: {"delta":"The"}          // incremental text chunk
data: {"delta":" recipe"}       // next chunk
...
data: {"raw":"{full JSON}"}     // complete raw content for final parsing
data: [DONE]                    // stream end marker
```

**Error responses:**

| Status | Body |
|--------|------|
| 400 | `{"error": "Ingredients are required."}` |
| 429 | `{"error": "Too many requests. Please slow down..."}` |
| 502 | `{"error": "The AI service returned an error..."}` |
| 500 | `{"error": "An unexpected error occurred..."}` |

### `GET /health`

Returns `{"status": "ok", "service": "ChefMate AI Backend"}`.

---

## Prompt Engineering

The AI is instructed via a system prompt that enforces:

1. **Pantry-first** — Prioritize ingredients the user already has; minimize additions.
2. **Dietary compliance** — Strictly respect vegetarian, vegan, high-protein, or low-carb requirements.
3. **Realistic recipes** — No fictional or impossible ingredient combinations.
4. **Beginner-friendly** — Clear, numbered, step-by-step instructions.
5. **Safety** — No unsafe cooking advice (undercooking meat, unsafe food handling).
6. **Structured output** — Response is forced to valid JSON via `response_format: { type: "json_object" }`.

The prompt and JSON schema live in `backend/src/prompt.js` (Express) and `supabase/functions/generate-recipe/index.ts` (Edge Function).

---

## Architecture & Security

### API Key Safety

- The OpenAI API key is **never** included in frontend code or bundled assets.
- All AI calls happen server-side (Express backend or Supabase Edge Function).
- The frontend only calls your backend; the backend proxies to OpenAI.
- In Docker, the key is injected via runtime environment variables — never baked into the image.

### Streaming

The backend uses Server-Sent Events (SSE) to stream OpenAI's response deltas to the frontend in real time. The frontend reads the stream with the Fetch API's `ReadableStream` and renders text progressively.

### Rate Limiting

The Express backend limits each IP to 10 recipe generations per minute to prevent abuse.

---

## License

MIT
