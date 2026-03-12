<div align="center">

# 🏈 NFL Mock Draft Simulator 2026

**An AI-powered, full-stack NFL Mock Draft experience — draft your team against 6 autonomous AI general managers, powered by Llama 3 on Groq.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://nfl-mock-draft-simulator-zeta.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)](https://nfl-mock-draft-simulator-backend.onrender.com/docs)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)
[![Demo Video](https://img.shields.io/badge/Demo%20Video-Google%20Drive-4285F4?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/130lXJczH8LqfEmIGIKNlv9Pt5cyoR9aw/view)

</div>

---

## 🎬 Demo

▶️ **[Watch Demo Video](https://drive.google.com/file/d/130lXJczH8LqfEmIGIKNlv9Pt5cyoR9aw/view)**

> **Note:** Please download the file if playback fails in the browser.

---

## 📸 Overview

Pick any of **7 NFL franchises** and make your selections through **4 rounds** of the 2026 NFL Draft. The other 6 teams are controlled by an **AI General Manager** (Llama 3.1 8B via Groq) that evaluates positional needs, team context, and prospect grades before each pick — with live streaming reasoning explained in real time.

---

## ✨ Features

| Feature | Details |
|---|---|
| 🤖 **AI-Driven Picks** | Llama 3.1 8B via Groq API — each AI GM evaluates needs, prospect grades, and team context |
| 📡 **Real-time Streaming** | Server-Sent Events (SSE) stream the AI's decision live — reasoning appears character-by-character |
| 🧠 **Intelligent Fallback** | 3-tier fallback if LLM is unavailable: primary need → any need → Best Player Available (BPA) |
| 📋 **30 Real 2026 Prospects** | Full big board with rank, grade, college, strengths, weaknesses, and scouting analysis |
| 🏟️ **7 Real Franchises** | Raiders, Jets, Cardinals, Titans, Giants, Browns, Commanders — each with real positional needs & context |
| 💾 **Session Persistence** | Zustand + localStorage — resume mid-draft after page refresh |
| 📜 **Draft History** | All past drafts stored locally; compare any two drafts side-by-side |
| 📤 **Share Card** | Export your draft results as a downloadable/shareable PNG card via `html-to-image` |
| 🌗 **Dark / Light Mode** | System-aware theme with manual toggle |
| 📱 **Fully Responsive** | Mobile-first design — tab-based layout on small screens, 3-column grid on desktop |
| ⚡ **Position Filtering** | Real-time client-side prospect filtering by position |

---

## 🏗️ Architecture

```mermaid
flowchart TB
    subgraph Browser["🌐 User Browser"]
        subgraph Next["Next.js 16 — App Router / React 19"]
            TS[TeamSelection Screen]
            DB["DraftBoard<br/>3-col grid / tab view"]
            DR["DraftResults<br/>+ Share Modal"]
            TS & DB & DR --> ZS
            subgraph ZS["Zustand Store"]
                DS[draftStore]
                HS[historyStore]
            end
        end
    end

    ZS -- "REST + SSE / HTTPS" --> Routers

    subgraph Backend["⚙️ FastAPI Backend — Render · Python 3.13"]
        subgraph Routers[Routers]
            R1["/api/draft/*"]
            R2["/api/prospects"]
            R3["/api/teams"]
            R4["/api/health"]
        end
        Routers --> Services
        subgraph Services[Services]
            SV1[draft_service]
            SV2[ai_service]
            SV3[player_service]
        end
        Services --> State
        subgraph State["In-Memory State"]
            SS["DraftSession<br/>TTL: 1 hour"]
        end
    end

    SV2 -- "HTTPS" --> Groq

    subgraph Groq["🤖 Groq Cloud"]
        LLM["llama-3.1-8b-instant<br/>LLM Inference"]
    end
```

---

## 🔄 AI Pick — Request Flow

```mermaid
sequenceDiagram
    participant FE as 🖥️ Frontend
    participant BE as ⚙️ Backend
    participant GQ as 🤖 Groq Cloud

    FE->>BE: GET /api/draft/{id}/ai-pick/stream (SSE)
    BE-->>FE: event: thinking
    Note over BE: Build smart context prompt<br/>(team needs + BPA pool + roster state)
    BE->>GQ: POST /chat/completions<br/>llama-3.1-8b-instant
    GQ-->>BE: JSON { selected_player_id, reasoning }
    Note over BE: Parse response → apply pick<br/>to DraftSession in-memory state
    BE-->>FE: event: complete { pick, reasoning }
    BE-->>FE: Close SSE stream
    Note over FE: Update Zustand store<br/>Trigger next pick or await user
```

---

## 🧩 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) | SSR/CSR hybrid, routing |
| **UI** | Tailwind CSS v4, Framer Motion | Styling, animations |
| **State** | Zustand 5 + `persist` middleware | Client state + localStorage sync |
| **Backend** | FastAPI (Python 3.13) | REST API, SSE streaming |
| **Validation** | Pydantic v2 | Request/response schema enforcement |
| **AI** | Groq API — `llama-3.1-8b-instant` | Ultra-low-latency LLM inference |
| **Prompt Eng.** | Custom smart pool selection | BPA + needs-weighted prospect context |
| **Image Export** | `html-to-image` | PNG draft card generation in-browser |
| **Deployment** | Vercel (frontend) + Render (backend) | Zero-config CI/CD from GitHub |

---

## 📁 Project Structure

```
NFL Mock Draft Simulator/
├── backend/                          # FastAPI application
│   ├── main.py                       # App factory, CORS, router registration
│   ├── config.py                     # Pydantic-settings env config
│   ├── requirements.txt
│   ├── runtime.txt                   # Python 3.13.2 pin for Render
│   ├── data/
│   │   ├── constants.py              # Team data (needs, colors, context)
│   │   └── players.csv               # 30-player 2026 big board
│   ├── models/
│   │   ├── schemas.py                # Pydantic models: Prospect, Team, DraftPick…
│   │   └── game_state.py             # DraftSession class + in-memory registry
│   ├── prompts/
│   │   └── draft_prompt.py           # LLM prompt builder + smart pool selection
│   ├── routers/
│   │   ├── draft.py                  # Draft lifecycle + SSE endpoint
│   │   ├── data.py                   # Prospects & teams read endpoints
│   │   └── health.py                 # /api/health liveness probe
│   └── services/
│       ├── ai_service.py             # Groq client, JSON parsing, fallback logic
│       ├── draft_service.py          # Pick orchestration (user + AI)
│       └── player_service.py         # CSV ingestion + Prospect hydration
│
└── frontend/                         # Next.js application
    ├── next.config.ts                # API proxy rewrites
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx              # Root: phase-based screen switcher
    │   │   ├── layout.tsx            # Navbar + Footer shell
    │   │   └── globals.css           # Tailwind v4 config + breakpoint overrides
    │   ├── components/
    │   │   ├── draft/
    │   │   │   ├── DraftBoard.tsx    # 3-col desktop / tab-switch mobile layout
    │   │   │   ├── ProspectList.tsx  # Filterable, scrollable prospect picker
    │   │   │   ├── TeamRoster.tsx    # Live roster panel with pick history
    │   │   │   ├── DraftHistory.tsx  # All picks timeline
    │   │   │   ├── DraftProgress.tsx # Round/pick counter + progress bar
    │   │   │   ├── AiThinkingIndicator.tsx  # Animated AI status strip
    │   │   │   ├── DraftResults.tsx  # Final results grid + actions
    │   │   │   ├── ShareModal.tsx    # PNG export + Web Share API modal
    │   │   │   ├── DraftShareCard.tsx # html-to-image render target
    │   │   │   ├── DraftHistoryDrawer.tsx   # Slide-in past drafts drawer
    │   │   │   ├── DraftCompareModal.tsx    # Side-by-side draft comparison
    │   │   │   ├── TeamSelectionScreen.tsx  # Team picker onboarding
    │   │   │   └── TeamSelector.tsx  # Responsive team card grid
    │   │   └── ui/
    │   │       ├── Navbar.tsx        # Responsive nav + theme toggle
    │   │       ├── Footer.tsx
    │   │       ├── ErrorBanner.tsx
    │   │       ├── LoadingSpinner.tsx
    │   │       ├── PositionBadge.tsx # Color-coded position pill
    │   │       ├── SchoolLogo.tsx
    │   │       └── ThemeProvider.tsx # next-themes wrapper
    │   ├── store/
    │   │   ├── draftStore.ts         # Draft state machine + SSE consumer
    │   │   └── historyStore.ts       # Past drafts (localStorage)
    │   └── lib/
    │       ├── api.ts                # Typed API client (fetch wrappers)
    │       ├── types.ts              # Shared TypeScript types
    │       ├── constants.ts          # Team logos, static data
    │       ├── draftHistory.ts       # History serialization helpers
    │       └── utils.ts              # cn(), color utilities
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **Python** ≥ 3.13
- **Groq API key** — free at [console.groq.com](https://console.groq.com)

---

### 1 · Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
echo GROQ_API_KEY=your_key_here > .env
echo CORS_ORIGINS=["http://localhost:3000"] >> .env

# Start the API (http://localhost:8000)
uvicorn main:app --reload
```

Interactive docs available at `http://localhost:8000/docs`.

---

### 2 · Frontend

```bash
cd frontend

npm install

# Point to local backend (already the default)
echo NEXT_PUBLIC_API_URL=http://localhost:8000 > .env.local

npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🌐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ | — | Groq Cloud API key |
| `CORS_ORIGINS` | No | `["http://localhost:3000"]` | JSON array of allowed origins |

### Frontend (`frontend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | No | `http://localhost:8000` | Backend base URL |

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Liveness probe |
| `GET` | `/api/prospects` | Full 30-player 2026 big board |
| `GET` | `/api/teams` | All 7 franchises with needs & context |
| `POST` | `/api/draft/start` | Create a new draft session, returns `DraftState` |
| `GET` | `/api/draft/{id}/state` | Current draft state snapshot |
| `POST` | `/api/draft/{id}/pick` | Submit a user pick |
| `GET` | `/api/draft/{id}/ai-pick/stream` | **SSE** — streams `thinking` → `complete` events |
| `GET` | `/api/draft/{id}/results` | Final results with all rosters |

---

## 🧠 AI Decision Engine

Each AI pick builds a **smart context window** fed to Llama 3.1 8B:

1. **Smart prospect pool** — top 15 BPA + top 3 per positional need (deduplicated, rank-sorted)
2. **Team context** — real roster situation, coaching scheme, culture notes
3. **Priority needs** — ordered list of positional requirements
4. **Current roster** — picks already made in this draft by that team
5. **Draft position** — round, pick number, and overall pick context

The LLM returns structured JSON `{ selected_player_id, reasoning }`. A **3-tier fallback** ensures a pick is always made even if the LLM is unavailable or returns malformed output:

```
Tier 1 → Highest-ranked prospect at primary need position
Tier 2 → Highest-ranked prospect at any team need position
Tier 3 → Best Player Available (overall rank #1 remaining)
```

---

## 🏈 Draft Format

- **7 teams** draft in the same snake-free sequential order every round: `Raiders (1) → Jets (2) → Cardinals (3) → Titans (4) → Giants (5) → Browns (6) → Commanders (7)`
- **4 rounds** = 28 total picks from a pool of 30 → 2 prospects go undrafted
- Your pick slot is fixed (e.g., team #3 = picks 3, 10, 17, 24)

---

## 🚢 Deployment

### Vercel (Frontend)

1. Connect GitHub repo in Vercel dashboard
2. Set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-render-backend.onrender.com`

### Render (Backend)

1. New **Web Service** → connect GitHub repo
2. Set **Root Directory** to `backend`
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment variables: `GROQ_API_KEY`, `CORS_ORIGINS`

---

## 🛠️ Development Notes

- **Session state is in-memory** on the backend. Restarting Render clears all active sessions — the frontend will catch the 404 and prompt a restart.
- The Zustand `persist` middleware stores `phase`, `draftState`, and `lastPick` to localStorage — mid-draft page refreshes are handled gracefully.
- Tailwind v4 uses `@source` directives in `globals.css` rather than `tailwind.config.js` content paths for class scanning in production builds.

---

## 📄 License

MIT © 2026 [Smitesh Pednekar](https://github.com/smitesh-pednekar)


