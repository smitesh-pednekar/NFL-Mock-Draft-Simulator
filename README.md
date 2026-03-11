# 🏈 NFL Mock Draft Simulator 2026

A full-stack AI-powered NFL Mock Draft Simulator. Draft for your chosen team across 4 rounds while Google Gemini AI controls the remaining 6 franchises.

## Features

- **4 rounds, 7 teams, 28 total picks** — same pick order every round (1→7)
- **30 real prospects** from the 2026 NFL Draft Big Board
- **AI-powered picks** using Google Gemini Flash — each AI team evaluates positional needs and best player available
- **Real-time SSE streaming** for AI pick announcements with reasoning
- **Position filtering & search** for the prospect list
- **LocalStorage persistence** — resume a draft after page refresh
- **Responsive design** — works on desktop and tablet

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js 15 (App Router), Tailwind CSS, Framer Motion, Zustand |
| Backend | FastAPI (Python 3.11+), Pydantic v2 |
| AI | Google Gemini 2.0 Flash (via `google-generativeai`) |
| Real-time | Server-Sent Events (SSE) |

---

## Project Structure

```
NFL Mock Draft Simulator/
├── backend/
│   ├── main.py               # FastAPI entry point
│   ├── config.py             # Environment settings
│   ├── requirements.txt
│   ├── data/
│   │   ├── constants.py      # Team data & position mappings
│   │   └── players.csv       # 2026 prospect big board
│   ├── models/
│   │   ├── schemas.py        # Pydantic models
│   │   └── game_state.py     # In-memory session management
│   ├── routers/
│   │   ├── draft.py          # Draft endpoints + SSE
│   │   ├── data.py           # Prospects & teams
│   │   └── health.py
│   ├── services/
│   │   ├── player_service.py # CSV parsing
│   │   ├── ai_service.py     # Gemini integration
│   │   └── draft_service.py  # Pick orchestration
│   └── prompts/
│       └── draft_prompt.py   # LLM prompt templates
│
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx      # Main application page
        │   ├── layout.tsx
        │   └── globals.css
        ├── components/
        │   ├── draft/        # Draft-specific components
        │   └── ui/           # Reusable UI components
        ├── store/
        │   └── draftStore.ts # Zustand state + AI orchestration
        └── lib/
            ├── types.ts
            ├── constants.ts
            ├── api.ts
            └── utils.ts
```

---

## Setup & Running

### Prerequisites

- **Node.js** ≥ 20
- **Python** ≥ 3.11
- **Google Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com)

---

### 1. Backend Setup

```bash
cd backend

# Create and activate a virtual environment (recommended)
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env and set your GEMINI_API_KEY

# Start the server (port 8000)
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API docs will be available at `http://localhost:8000/docs`.

---

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (already set up for local dev)
# .env.local contains: NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the dev server (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Google AI Studio API key |
| `CORS_ORIGINS` | No | JSON array of allowed origins (default: `["http://localhost:3000"]`) |

### Frontend (`frontend/.env.local`)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | Backend URL (default: `http://localhost:8000`) |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/prospects` | List top-30 draft prospects |
| GET | `/api/teams` | List all 7 teams |
| POST | `/api/draft/start` | Start a new draft session |
| GET | `/api/draft/{id}/state` | Get current draft state |
| POST | `/api/draft/{id}/pick` | Make a user pick |
| GET | `/api/draft/{id}/ai-pick/stream` | SSE stream for AI pick |
| GET | `/api/draft/{id}/results` | Get final draft results |

---

## Draft Format

- **7 teams** drafting in the same order every round: Raiders → Jets → Cardinals → Titans → Giants → Browns → Commanders
- **4 rounds** = 28 total picks
- **30 prospects** in the pool (2 go undrafted)
- If you pick team #3, you make picks 3, 10, 17, and 24

---

## AI Decision Making

Each AI pick calls Google Gemini with:
1. The team's positional needs (priority ordered)
2. The team's context (roster situation)
3. Top 15 available prospects from the big board
4. Already drafted players for that team

The AI returns a JSON response with the selected player ID and a 2-3 sentence reasoning explanation that's displayed in the UI.

**Fallback logic** (if Gemini fails or times out):
1. Highest-ranked prospect at primary need position
2. Highest-ranked prospect at any need position
3. Best player available (BPA)

---

## Development Notes

- Draft sessions are stored in-memory on the backend. Restarting the backend clears all sessions. The frontend persists state in `localStorage` but will show an error on the next AI pick if the backend session is gone — simply restart the draft.
- The `GEMINI_API_KEY` environment variable must be set for AI picks to work. Without it, all AI picks fall back to the intelligent BPA logic.
