# DataLab

Drop in a CSV. Ask Claude questions. Get a report.

DataLab is a browser-based data analysis tool built on Claude. There's no database, no accounts, and no data stored server-side. Your CSV stays in the browser. Your API key lives in localStorage and goes directly to Anthropic — nothing passes through any intermediate server.

---

## What it does

**Chat with your data** — ask questions in plain English. Claude reads your actual rows and responds in plain text, rendered in a monospace chat panel that feels more like a terminal than a chatbot.

**Deep analysis** — run a structured breakdown of your dataset: distributions, outliers, patterns, correlations. The analysis runs against all rows, not just a preview.

**Report view** — compiled insights render into a clean, readable document. Copy it, share it, iterate on it.

**Model selector with live cost tracking** — switch between Claude Sonnet 4.6 (fast, cost-effective) and Opus 4.6 (most capable). Cost per message is calculated and shown inline, so you know exactly what you're spending.

---

## Interface

Two panels. Left: CSV preview with full table. Right: chat + report tabs.

The UI uses Manrope for chrome and IBM Plex Mono for data, chat, and code — a deliberate split between navigation context and data context. No CSS framework; everything is inline styles, keeping the design surface small and the component code self-contained.

---

## Tech stack

| | |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19, inline styles (no CSS framework) |
| Fonts | Manrope (UI), IBM Plex Mono (data / chat / code) |
| AI streaming | AI SDK v6 — `@ai-sdk/anthropic` |
| AI models | Anthropic Claude — `@anthropic-ai/sdk` |
| Agent support | Claude Agent SDK — `@anthropic-ai/claude-agent-sdk` (optional) |

---

## Getting started

```bash
git clone https://github.com/sscode/data-lab.git
cd data-lab
npm install
cp .env.example .env.local
# add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open `http://localhost:3000`. Add your API key using the header button, drop a CSV, and start asking.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Used server-side by the `/api/analyze` route |
| `USE_AGENT_SDK` | No | Set `true` to route deep analysis through the Claude Agent SDK |

To enable Agent SDK mode, install the Claude CLI globally first:

```bash
npm install -g @anthropic-ai/claude-code
```

---

## How the routing works

Two API routes:

- **`/api/chat`** — streams responses via AI SDK v6 `streamText`. The client reads the raw text stream with a `TextDecoder`. Token usage is appended as a sentinel at the end of the stream and stripped client-side for cost calculation.
- **`/api/analyze`** — runs full-dataset analysis. With `USE_AGENT_SDK=true`, delegates to the Claude Agent SDK with automatic fallback to the Anthropic SDK if unavailable.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, PR process, and code style notes.

---

## License

MIT
