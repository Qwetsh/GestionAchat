# GestionAchat

A gamified spending resistance app built with React, TypeScript, and Supabase.

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 7
- **Styling**: Tailwind CSS v4 + Shadcn/ui
- **State**: Zustand + TanStack Query
- **Backend**: Supabase (Database + Auth)
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key from Settings > API
3. Update `.env.local` with your credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

4. Run the migration in `supabase/migrations/001_initial_schema.sql` via the Supabase SQL Editor

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the app.

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   └── ui/          # Shadcn/ui components
├── features/        # Feature modules
│   ├── auth/
│   ├── temptation/
│   ├── gamification/
│   └── dashboard/
├── hooks/           # Custom React hooks
├── lib/             # Utilities and clients
├── stores/          # Zustand stores
├── types/           # TypeScript definitions
└── pages/           # Page components
```

## Color Palette

- **Primary (Warm Coral)**: `#F97316`
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Accent**: `#EAB308`
