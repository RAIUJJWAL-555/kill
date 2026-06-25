# Killshill

**Expose the shills. Follow the signal.**

Crypto is full of influencers shouting "call" with zero accountability. Killshill is a KOL (Key Opinion Leader) audit dashboard that tracks who actually knows what they're talking about — and who's just trying to dump their bags on you.

Every influencer has a track record. Killshill makes it public.

## Why This Exists

Every day, thousands of people lose money following influencers who post lucky calls and quietly bury their bad ones. Killshill brings transparency to crypto trading by:

- **Tracking accuracy** — What % of an influencer's calls actually hit their target?
- **Measuring ROI** — If you followed every signal, would you be up or down?
- **Holding them accountable** — Past performance becomes a permanent, searchable record.

If you follow crypto, you deserve to know who to trust.

## Features

| Feature | Description |
|---------|-------------|
| **Leaderboard** | KOLs ranked by accuracy and ROI |
| **Search & Filter** | Find specific KOLs, filter by minimum accuracy |
| **Signal Drawer** | Click any KOL to see their full signal history |
| **Mobile Responsive** | Table view on desktop, card view on mobile |
| **Real-time Refresh** | Pull latest signal data with one click |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Language | [TypeScript](https://typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| State | [Zustand](https://zustand-demo.pmnd.rs) |
| UI Components | [Radix UI](https://radix-ui.com) + [Lucide Icons](https://lucide.dev) |
| Charts | [Recharts](https://recharts.org) |
| Tables | [TanStack Table](https://tanstack.com/table) |
| Toasts | [Sonner](https://sonner.emilkowal.ski) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18+ (comes with npm)
- A terminal (Terminal.app on macOS, Command Prompt on Windows, etc.)

### Install & Run

```bash
# 1. Enter the project folder
cd killshill

# 2. Install dependencies (this creates node_modules/)
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You're in.

> **New to coding?** `npm` is the Node.js package manager. `npm install` downloads all the code this project depends on. `npm run dev` starts a local server on your machine.

### Other Commands

```bash
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Check code for issues
```

## How It Works

1. **Data loads automatically** when you open the app
2. Each KOL card/row shows their handle, accuracy %, total signals, and average ROI
3. **Click any KOL** to open a side drawer with their complete signal history — every call they've made, win or loss
4. **Use the search bar** to find a specific KOL
5. **Filter by accuracy** using the slider to only see KOLs above a certain threshold
6. **Sort the table** by clicking column headers (Accuracy, Signals, ROI)
7. **Hit Refresh** to pull the latest data

## The Human Impact

Crypto is decentralized — and so is the misinformation. Killshill puts the data back in your hands:

- **For beginners**: Instead of wondering "who should I follow?", you see hard stats on who delivers.
- **For traders**: Filter out noise. Only pay attention to KOLs with proven accuracy.
- **For the community**: Public accountability means influencers think twice before shoving a bad call.

One good KOL can save you months of losses. Killshill helps you find them.

## Project Structure

```
killshill/
├── src/
│   ├── app/           # Next.js pages (layout, home page)
│   ├── components/
│   │   ├── kol-audit/ # Dashboard components (table, cards, filters, drawer)
│   │   └── ui/        # Reusable UI primitives (button, badge, etc.)
│   ├── hooks/         # Custom React hooks (data fetching)
│   ├── store/         # Zustand state management
│   ├── lib/           # Utility functions
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── package.json       # Project metadata & dependencies
```

## Deployment

The easiest way to deploy is [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

```bash
npm run build
# Then connect your repo to Vercel
```

See [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more options.
