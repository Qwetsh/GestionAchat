# Story 1.1: Project Setup & Supabase Configuration

Status: review

## Story

As a **développeur**,
I want **initialiser le projet avec Vite, React-TS, Tailwind v4, et Supabase**,
So that **la base technique est prête pour le développement des features**.

## Acceptance Criteria

1. **Given** le repo est vide **When** le développeur exécute les commandes d'initialisation **Then** le projet Vite + React-TS est créé
2. **Given** le projet est initialisé **When** Tailwind CSS v4 est configuré **Then** la palette Warm Coral (#F97316 primary) est disponible
3. **Given** Tailwind est configuré **When** Shadcn/ui est initialisé **Then** les composants Button, Card, Input sont disponibles
4. **Given** les dépendances sont installées **When** le client Supabase est configuré **Then** `src/lib/supabase.ts` exporte un client typé
5. **Given** le client Supabase existe **When** le schema database est créé **Then** les tables users, temptations, gamification existent avec les contraintes
6. **Given** tout est configuré **When** l'app démarre **Then** `npm run dev` fonctionne sans erreur

## Tasks / Subtasks

- [x] Task 1: Initialiser projet Vite + React-TS (AC: 1)
  - [x] Créer projet avec `npm create vite@latest`
  - [x] Configurer TypeScript strict mode
  - [x] Configurer path alias `@/`

- [x] Task 2: Configurer Tailwind CSS v4 (AC: 2)
  - [x] Installer `tailwindcss` et `@tailwindcss/vite`
  - [x] Configurer `vite.config.ts` avec plugin Tailwind
  - [x] Créer `src/index.css` avec imports Tailwind
  - [x] Définir palette Warm Coral dans CSS variables

- [x] Task 3: Initialiser Shadcn/ui (AC: 3)
  - [x] Exécuter `npx shadcn@latest init`
  - [x] Installer composants: Button, Card, Input, Dialog, Progress
  - [x] Configurer `components.json`

- [x] Task 4: Configurer Supabase client (AC: 4)
  - [x] Installer `@supabase/supabase-js`
  - [x] Créer `src/lib/supabase.ts` avec client typé
  - [x] Créer `src/types/database.ts` avec types
  - [x] Créer `.env.example` avec variables requises

- [x] Task 5: Créer schema database Supabase (AC: 5)
  - [x] Créer fichier migration `supabase/migrations/001_initial_schema.sql`
  - [x] Définir table `users` (id, pin_hash, created_at)
  - [x] Définir table `temptations` (id, user_id, photo_url, amount, category, status, created_at, resolved_at)
  - [x] Définir table `gamification` (user_id, xp, level, current_streak, best_streak, updated_at)
  - [x] Configurer Row Level Security (RLS) policies
  - [x] Créer bucket Storage `temptation-photos` (documenté dans migration SQL)

- [x] Task 6: Configurer PWA avec vite-plugin-pwa (AC: 6)
  - [x] Configurer `vite-plugin-pwa` dans `vite.config.ts`
  - [x] Créer manifest PWA inline dans vite.config.ts
  - [x] Configurer service worker Workbox
  - [x] Ajouter icône SVG PWA (PNG à générer - voir public/icons/README.md)

- [x] Task 7: Validation finale (AC: 6)
  - [x] Vérifier `npm run dev` démarre sans erreur
  - [x] Vérifier `npm run build` compile sans erreur (90KB gzip)
  - [x] Vérifier types TypeScript sans erreur
  - [x] Vérifier lint passe

## Dev Notes

### Architecture Requirements
[Source: architecture.md]

**Stack technique:**
- Vite 6.x + React 19 + TypeScript strict
- Tailwind CSS v4 (nouvelle syntaxe CSS-first)
- Shadcn/ui pour les composants
- Supabase (Auth, Database, Storage, Edge Functions)
- vite-plugin-pwa avec Workbox

**Structure projet:**
```
src/
├── components/ui/     # Shadcn/ui
├── features/          # Feature modules
├── hooks/             # Custom hooks
├── lib/               # Utilities, Supabase
├── stores/            # Zustand
├── types/             # TypeScript types
└── pages/             # Page components
```

### Database Schema
[Source: architecture.md#Data Architecture]

```sql
users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
)

temptations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  photo_url TEXT,
  amount DECIMAL(10,2) NOT NULL,
  category TEXT CHECK (category IN ('cosmetics', 'books', 'stationery', 'other')),
  status TEXT CHECK (status IN ('active', 'resisted', 'cracked')) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ
)

gamification (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
)
```

### Color Palette
[Source: ux-design-specification.md#Color System]

```css
--primary: #F97316      /* Warm Coral - Actions principales */
--primary-soft: #FED7AA /* Backgrounds, hover */
--success: #22C55E      /* Résistance, célébration */
--warning: #F59E0B      /* Timer, attention douce */
--accent: #EAB308       /* XP, rewards, gold */
--background: #FFFBEB   /* App background */
--surface: #FFFFFF      /* Cards, modals */
--text: #1C1917         /* Primary text */
--muted: #78716C        /* Secondary text */
```

### Testing Strategy

- Vérification manuelle: `npm run dev`, `npm run build`
- Vérification TypeScript: `npx tsc --noEmit`
- Vérification lint: `npm run lint`

### Project Structure Notes

Le code existant suit la structure définie dans l'architecture. Pas de conflits détectés.

### References

- [Source: architecture.md#Starter Template Evaluation]
- [Source: architecture.md#Data Architecture]
- [Source: ux-design-specification.md#Color System]
- [Source: epics.md#Story 1.1]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Validation `npm run dev`: ✅ Server démarre sur port 5173
- Validation `npm run build`: ✅ Build réussi en 2.67s, bundle 90KB gzip
- Validation `tsc --noEmit`: ✅ Pas d'erreur TypeScript
- Validation `npm run lint`: ✅ Pas d'erreur ESLint (après fix react-refresh)

### Completion Notes List

- 2026-02-27: Story 1.1 complétée. La base technique est prête pour le développement.
- PWA configuré avec vite-plugin-pwa et Workbox pour le caching offline
- Icônes PWA: SVG créé, PNG à générer manuellement (voir public/icons/README.md)
- Schema SQL prêt à être déployé sur Supabase
- Fix ESLint: ajout eslint-disable pour react-refresh dans button.tsx (pattern Shadcn/ui standard)

### File List

**Fichiers existants (déjà créés avant cette session):**
- `package.json`
- `vite.config.ts` (modifié: ajout PWA)
- `tsconfig.json`
- `src/lib/supabase.ts`
- `src/lib/utils.ts`
- `src/types/database.ts`
- `src/stores/authStore.ts`
- `src/stores/uiStore.ts`
- `src/components/ui/button.tsx` (modifié: eslint-disable)
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/progress.tsx`
- `src/index.css`
- `src/App.tsx`
- `src/main.tsx`
- `.env.example`
- `supabase/migrations/001_initial_schema.sql`

**Fichiers créés dans cette session:**
- `public/icons/icon.svg` (nouveau)
- `public/icons/README.md` (nouveau)

## Change Log

- 2026-02-27: Initial implementation - Story 1.1 Project Setup & Supabase Configuration completed
