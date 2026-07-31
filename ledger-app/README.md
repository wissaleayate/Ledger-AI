# Ledger — AI-Powered Team Accountability Platform

A production-ready frontend application built with React, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

## Tech Stack

- **React 19** + **TypeScript** — component architecture
- **Tailwind CSS v4** (Vite plugin) — utility-first styling with `@theme` tokens
- **Framer Motion** — page transitions, hover/tap animations, animated charts
- **Lucide React** — consistent icon system
- **Recharts** — data visualization (area, bar, pie charts)
- **React Router v7** — client-side routing
- **IBM Plex Sans / IBM Plex Mono / Inter** — IBM Carbon typography

## Architecture

```
src/
├── components/
│   ├── layout/          # Sidebar, TopBar, PageShell
│   └── ui/              # Button, Card, Badge, Avatar, Progress,
│                        #   StatCard, Input, Tabs, Overlays
├── pages/               # DashboardPage, TeamPage, GoalsPage,
│                        #   ReportsPage, SettingsPage
├── data/                # mock.ts — realistic seed data
├── types/               # Shared TypeScript types
└── lib/                 # cn(), formatters, helpers
```

## Design System

| Token | Value |
|---|---|
| Background | `#0B0F14` |
| Surface | `#141A22` |
| Card | `#1B222D` |
| IBM Blue | `#0F62FE` |
| Success | `#24A148` |
| Warning | `#F1C21B` |
| Danger | `#DA1E28` |
| Text Primary | `#FFFFFF` |
| Text Secondary | `#A8B3C5` |

Follows **IBM Carbon Design** principles: 4px grid, precise typographic scale, intentional whitespace, no decorative noise.

## Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | KPI stats, progress trend chart, team performance, activity feed, top performers |
| `/team` | Team | Member cards with streaks & metrics; team cards with color coding |
| `/goals` | Goals & OKRs | Expandable objective rows with key result drill-down |
| `/reports` | Reports | Monthly completions, team breakdown, individual on-time rate, AI prediction pie |
| `/settings` | Settings | Profile, notifications (with toggles), workspace, integrations, billing |

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
