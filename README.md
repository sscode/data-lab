#CSV Data-Lab

An Opensource project for users to quickly analyze data thanks to data scientist skills.

---

## Features

- Upload any CSV file and preview the full dataset in a structured table
- Chat with Claude to ask questions about your data and get instant AI analysis
- Deep analysis mode using the Anthropic SDK directly for extended reasoning tasks
- Generated reports tab that compiles AI insights into a structured document
- Model selector with support for multiple Claude models and per-message cost tracking
- API key entered directly in the UI — no server-side key required
- Amber CRT terminal aesthetic: scanlines, vignette overlay, IBM Plex Mono font

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| AI streaming | AI SDK v6 (`@ai-sdk/anthropic`) |
| AI models | Anthropic Claude (via `@anthropic-ai/sdk`) |
| Agent support | Claude Agent SDK (`@anthropic-ai/claude-agent-sdk`, optional) |
| Styling | Inline styles (no Tailwind, no CSS modules) |

---

## Prerequisites

- Node.js 18 or higher
- An [Anthropic API key](https://console.anthropic.com/)

---

## Installation

```bash
git clone https://github.com/sscode/data-lab.git
cd data-lab
npm install
cp .env.example .env.local
```

Open `.env.local` and fill in your Anthropic API key (see [Environment Variables](#environment-variables) below).

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key, used by server-side analysis routes |
| `USE_AGENT_SDK` | No | Set to `true` to enable the Claude Agent SDK for deep analysis (requires `claude` CLI installed globally) |

To install the Claude CLI (needed only when `USE_AGENT_SDK=true`):

```bash
npm install -g @anthropic-ai/claude-code
```

---

## Usage

1. Open the app and enter your Anthropic API key in the key field at the top of the interface
2. Upload a CSV file using the left panel; the data preview table will populate automatically
3. Select a Claude model from the model selector (cost-per-message is shown for each option)
4. Type questions about your data in the chat tab on the right panel
5. Run a deep analysis via the analyze button to get a structured breakdown of the dataset
6. Switch to the report tab to view and copy the compiled AI-generated report

---

## Architecture

The app uses the Next.js App Router with two primary API routes:

- **`/api/chat`** — handles streaming chat responses using AI SDK v6 `streamText` and `toTextStreamResponse()`. The frontend consumes the raw text stream with a `TextDecoder`.
- **`/api/analyze`** — handles deep analysis requests using the Anthropic SDK directly. When `USE_AGENT_SDK=true`, it uses the Claude Agent SDK with automatic fallback to the direct Anthropic API if the SDK is unavailable.

The two-panel UI is entirely client-side React with inline styles. The left panel manages CSV parsing and data preview; the right panel manages chat state, model selection, and report rendering.

---

## License

MIT
