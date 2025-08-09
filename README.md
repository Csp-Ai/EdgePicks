# 🧠 EdgePicks

EdgePicks channels a constellation of AI agents to surface transparent sports insights while advancing planetary health and community well-being.

![System Diagram](docs/system-diagram.png)

## Mission
EdgePicks aims to demonstrate how responsible machine intelligence can enhance recreation without sacrificing ethical standards, environmental sustainability, or public health.

## Tech Stack
- **Frontend-ready**: Next.js 14 with TypeScript and Tailwind CSS
- **Modular agents**: plug-in architecture under `lib/agents/`
- **Parallel execution**: Promise-based runner scales horizontally
- **Self-regenerative design**: agents log reflections and can propose upgrades
- **Ancient tech inspiration**: nods to the Antikythera mechanism and other "lost" computation tools

## Feature Highlights
- Live prediction panel with real-time reasoning
- Accuracy leaderboard and dark mode
- 21-track roadmap modules:
  - Parallel Agent Runner
  - Consent Banner
  - Carbon HUD
  - Ancient Tech Gallery
  - Community Impact Dashboard
  - ...and more

## Quick Start
```bash
git clone https://github.com/Csp-Ai/EdgePicks.git
cd EdgePicks
cp .env.local.example .env.local
npm install
npm run dev
```

## Testing

```bash
cp .env.test.example .env.test
npm test
```

Tests use MSW; no real SPORTS_API_KEY is required.
Set `ALLOW_TEST_NETWORK=1` to permit live network calls in rare cases.

## Live Demos
- Production: https://edgepicks.app *(placeholder)*
- Staging: https://staging.edgepicks.app *(placeholder)*

## Documentation
- [Agent metadata](agents.ms)
- [LLM orchestration log](llms.txt)
- [AI/ML Constitution](AIML_OVERVIEW.md)

## Contributing
We welcome ethical AI contributions with a sustainability focus. Please read [CONTRIBUTING.md](CONTRIBUTING.md) and review `llms.txt` before opening a pull request.

## Contact & Licensing
- License: [MIT](LICENSE)
- Questions: opensource@edgepicks.app
