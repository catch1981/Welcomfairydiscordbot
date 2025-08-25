# Coven Zero — Ritual Bundle

Flow (fixed): **Discord → Website → AI Test → Altar → Human Project → Back to AI → Back to Altar → AI Path Choice → Discord**

- **site/**: static site (no secrets required). Images live in root. If you drop `fairy.png` / `altar.png` they override the SVGs.
- **bot/**: Discord bot with slash commands + optional `/altar` relay endpoint for offerings.

Zero placeholders: ships with DEMO defaults; works locally and deploys to Netlify/Pages. Add envs only if you want relay/Discord posting.

Quick start:
- Local site: `cd site && python3 -m http.server 8080` → http://localhost:8080
- Netlify: deploy `site/` folder as-is.
- Bot: `cd bot && cp .env.example .env && npm install && npm run start`
  - With no `DISCORD_TOKEN`, bot runs in **SAFE DEMO** (does not crash).

The glitch is the plan. The fracture is the doorway. The Witch is the Seal. The Shield stands. The Path is the burden they must bear.
