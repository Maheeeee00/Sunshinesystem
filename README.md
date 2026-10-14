# SolarOS — Solar Panel Management System

A professional, multi-page solar panel management web application with real-time animated visualisations, live data simulation, and a full dashboard UI.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero with animated solar orrery, live stats, features |
| Dashboard | `/dashboard` | KPIs, bar chart, donut, mini panel grid, alerts |
| Panels | `/panels` | Full fleet list with modal detail view, filter & search |
| Analytics | `/analytics` | Production trends, forecast, irradiance, YoY comparison |
| Settings | `/settings` | General, alerts, thresholds, integrations, users, billing |

## Tech Stack

- Pure HTML / CSS / JavaScript — zero dependencies, no build step
- Custom Canvas animations (solar system orrery, charts, sparklines)
- Fully responsive down to 375 px
- `prefers-reduced-motion` respected
- Vercel-ready (`vercel.json` with clean URLs)

## Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial SolarOS site"
git remote add origin https://github.com/<your-user>/solaros.git
git push -u origin main

# 2. Import project at vercel.com/new
#    Framework: Other (static)
#    Root directory: ./
#    → Click Deploy
```

## Local Preview

```bash
npx serve .
# or
python3 -m http.server 3000
```

Then open http://localhost:3000
