---
stepsCompleted: [step-01-init, step-02-context, step-03-starter, step-04-decisions, step-05-patterns, step-06-structure, step-07-validation, step-08-complete]
status: complete
completedAt: '2026-02-27'
inputDocuments:
  - prd.md
  - ux-design-specification.md
  - product-brief-GestionAchat-2026-02-26.md
  - research/domain-psychologie-achats-impulsifs-gamification-research-2026-02-27.md
workflowType: 'architecture'
project_name: 'GestionAchat'
user_name: 'Thomas'
date: '2026-02-27'
---

# Architecture Decision Document — GestionAchat

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
37 FRs couvrant le cycle complet : capture tentation → timer 24h → résolution → gamification → stats. Les FRs critiques sont le timer avec résolution automatique (FR4, FR7) et les notifications push (FR32-34).

**Non-Functional Requirements:**
17 NFRs avec emphase sur :
- Performance mobile (< 3s, 60 FPS, < 500KB)
- Fiabilité absolue des données (zéro perte, sync offline)
- Sécurité adaptée (code personnel, pas de données sensibles bancaires)

**Scale & Complexity:**

- Primary domain: PWA Full-stack (React + Supabase)
- Complexity level: Medium
- Estimated architectural components: 8-10

### Technical Constraints & Dependencies

- **Supabase** : Auth, Database (PostgreSQL), Storage, Edge Functions
- **Vercel** : Hébergement, Edge network
- **PWA** : Service Worker (Workbox), Push API, Cache API
- **React** : TypeScript strict, Tailwind CSS v4, Framer Motion

### Cross-Cutting Concerns Identified

1. **Offline-first architecture** — Service worker, IndexedDB cache, sync queue
2. **Timer precision** — Supabase Edge Functions pour calcul serveur
3. **Data integrity** — Gamification calculée serveur (pas client manipulable)
4. **Push notifications** — Web Push API avec fallback polling
5. **Photo handling** — Compression client, storage Supabase, URLs signées

## Starter Template Evaluation

### Primary Technology Domain

PWA Full-stack (React SPA + Supabase BaaS) basé sur l'analyse des requirements.

### Starter Options Considered

| Option | Verdict |
|--------|---------|
| Starters communautaires | Rejetés — Tailwind v3, manque Supabase/PWA intégrés |
| Next.js | Rejeté — SSR non nécessaire, complexité accrue |
| **Vite vanilla** | ✅ Sélectionné — Contrôle total, stack exacte |

### Selected Starter: Vite + Manual Configuration

**Rationale:**
- Stack définie précisément dans le PRD
- Tailwind CSS v4 requiert setup récent
- PWA avec push notifications nécessite configuration custom
- Shadcn/ui a son propre CLI d'initialisation
- Supabase s'ajoute facilement

**Initialization Commands:**

```bash
# 1. Créer projet Vite
npm create vite@latest gestion-achat -- --template react-ts

# 2. Installer Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# 3. Installer dépendances core
npm install @supabase/supabase-js
npm install framer-motion lucide-react
npm install -D vite-plugin-pwa

# 4. Initialiser Shadcn/ui
npx shadcn@latest init
```

### Architectural Decisions Provided

**Language & Runtime:**
- TypeScript strict mode
- ES2022 target
- Node 18+ / Bun compatible

**Styling Solution:**
- Tailwind CSS v4 (nouvelle syntaxe CSS-first)
- Shadcn/ui components
- CSS variables pour theming

**Build Tooling:**
- Vite 6.x avec HMR rapide
- Rollup pour production build
- Tree-shaking automatique

**PWA Configuration:**
- vite-plugin-pwa avec Workbox
- Service Worker pour offline
- Web Push API pour notifications

**Code Organization:**
- src/components/ — UI components
- src/features/ — Feature modules
- src/lib/ — Utilities, Supabase client
- src/hooks/ — Custom hooks

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Data schema Supabase
- State management approach
- Offline sync strategy
- Push notification implementation

**Important Decisions (Shape Architecture):**
- Validation strategy
- Error handling patterns
- Photo compression approach

**Deferred Decisions (Post-MVP):**
- Multi-user support
- Analytics integration
- Browser extension architecture

### Data Architecture

**Database: Supabase PostgreSQL**

```sql
-- Core Tables
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

**Validation:** Zod schemas côté client + contraintes PostgreSQL
**Calculs gamification:** Client-side avec sync serveur (mono-utilisatrice de confiance)

### State Management

**Architecture hybride:**
- **Zustand** — État local UI, auth session, préférences
- **TanStack Query v5** — Cache Supabase, sync, mutations optimistes

**Rationale:** Pattern éprouvé pour PWA offline-first. Zustand pour la simplicité, TanStack Query pour la robustesse du cache.

### Offline Strategy

**Approach:** Optimistic UI + Background Sync

| Layer | Technology | Purpose |
|-------|------------|---------|
| Cache | IndexedDB (idb-keyval) | Persistence locale des tentations |
| State | Zustand persist | État UI persistant |
| Sync | TanStack Query | Mutations queue + retry |
| Service Worker | Workbox | Cache assets + offline shell |

**Conflict Resolution:** Server wins (simple, mono-user)

### Push Notifications

**Primary:** Web Push API
- Supabase Edge Function pour envoyer les notifications
- Timer 24h géré côté serveur (précision)
- Subscription stockée dans Supabase

**Fallback iOS:** Local notifications via Service Worker
- Moins précis mais fonctionne partout
- Notification quand l'app est ouverte

### Authentication & Security

**Auth Flow:**
1. User entre code PIN 4 chiffres
2. Hash bcrypt comparé côté Supabase (RPC function)
3. Session JWT stockée localement (Zustand persist)
4. Auto-refresh token via Supabase client

**Security:**
- HTTPS obligatoire (Vercel)
- Photos privées (Supabase Storage RLS)
- Row Level Security sur toutes les tables
- PIN hashé, jamais stocké en clair

### Infrastructure & Deployment

**Hosting:** Vercel
- Edge network global
- Preview deployments automatiques
- Environment variables sécurisées

**CI/CD:** GitHub Actions
- Build + type-check sur PR
- Deploy auto sur main
- Lighthouse CI pour performance

**Monitoring:**
- Vercel Analytics (Core Web Vitals)
- Sentry pour error tracking (post-MVP)

## Implementation Patterns & Consistency Rules

### Naming Patterns

**Database (Supabase/PostgreSQL):**

| Élément | Convention | Exemple |
|---------|------------|---------|
| Tables | snake_case, pluriel | `temptations`, `users` |
| Colonnes | snake_case | `created_at`, `user_id` |
| Foreign keys | `{table}_id` | `user_id` |
| Enums | snake_case strings | `'active'`, `'resisted'`, `'cracked'` |

**Code TypeScript:**

| Élément | Convention | Exemple |
|---------|------------|---------|
| Fichiers composants | PascalCase.tsx | `TemptationCard.tsx` |
| Fichiers utils | camelCase.ts | `formatCurrency.ts` |
| Composants | PascalCase | `CoffreCard`, `TimerCircle` |
| Fonctions | camelCase | `calculateXP()`, `formatAmount()` |
| Variables | camelCase | `currentStreak`, `totalSaved` |
| Types/Interfaces | PascalCase | `Temptation`, `UserStats` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_STREAK_BONUS`, `TIMER_DURATION_MS` |
| Hooks | use prefix | `useTemptations()`, `useAuth()` |

**Supabase:**

| Élément | Convention | Exemple |
|---------|------------|---------|
| RPC functions | snake_case | `verify_pin`, `resolve_temptation` |
| Storage buckets | kebab-case | `temptation-photos` |
| Edge functions | kebab-case | `send-push-notification` |

### Structure Patterns

```
src/
├── components/           # Composants UI réutilisables
│   ├── ui/              # Shadcn/ui components (Button, Card, etc.)
│   ├── CoffreCard.tsx   # Composants custom
│   ├── TemptationCard.tsx
│   ├── TimerCircle.tsx
│   └── ...
├── features/            # Feature modules (logique métier)
│   ├── temptation/
│   │   ├── components/  # Composants spécifiques feature
│   │   ├── hooks/       # Hooks spécifiques feature
│   │   └── types.ts
│   ├── gamification/
│   └── auth/
├── hooks/               # Hooks globaux réutilisables
├── lib/
│   ├── supabase.ts      # Client Supabase configuré
│   ├── utils.ts         # Helpers (cn, formatCurrency, etc.)
│   └── constants.ts     # Constantes globales
├── stores/              # Zustand stores
│   ├── authStore.ts
│   └── uiStore.ts
├── types/               # Types TypeScript globaux
│   └── database.ts      # Types générés Supabase
└── App.tsx
```

**Tests:** Co-localisés (`Component.test.tsx` à côté de `Component.tsx`)

### Format Patterns

**Dates:** ISO 8601 (`2026-02-27T21:30:00Z`) stockage, formaté localement pour affichage

**Montants:** `DECIMAL(10,2)` en base, formaté `34,00 €` à l'affichage

**TanStack Query Keys:**
```typescript
// Pattern: ['domain', 'scope', ...params]
['temptations', 'list']
['temptations', 'active']
['temptations', 'detail', temptationId]
['gamification', 'stats']
['gamification', 'level']
```

### State Patterns

**Zustand Store Pattern:**
```typescript
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      userId: null,
      isAuthenticated: false,
      login: (userId: string) => set({ userId, isAuthenticated: true }),
      logout: () => set({ userId: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
)
```

**Optimistic Updates Pattern:**
```typescript
useMutation({
  mutationFn: createTemptation,
  onMutate: async (newTemptation) => {
    await queryClient.cancelQueries({ queryKey: ['temptations'] })
    const previous = queryClient.getQueryData(['temptations'])
    queryClient.setQueryData(['temptations'], (old) => [...old, newTemptation])
    return { previous }
  },
  onError: (err, newTemptation, context) => {
    queryClient.setQueryData(['temptations'], context.previous)
  },
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ['temptations'] })
  },
})
```

### Error Handling Patterns

**User-facing:** Toast positif, jamais culpabilisant
```typescript
toast.error("Oups ! Réessaie dans un instant.")
```

**Debug:** Console avec contexte
```typescript
console.error('[Temptation:create]', { error, input })
```

### Enforcement Rules

**Tous les agents IA DOIVENT:**
1. Utiliser TypeScript strict — Aucun `any`
2. Valider avec Zod — Toute donnée entrante
3. Écrire des composants fonctionnels — Pas de classes
4. Utiliser async/await — Pas de `.then()` chains
5. Pratiquer early returns — Limiter l'imbrication
6. Respecter les conventions de nommage ci-dessus

## Project Structure & Boundaries

### Complete Project Directory Structure

```
gestion-achat/
├── README.md
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── components.json              # Shadcn/ui config
├── .env.local
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── public/
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker (généré par vite-plugin-pwa)
│   ├── icons/
│   │   ├── icon-192.png
│   │   ├── icon-512.png
│   │   └── apple-touch-icon.png
│   └── splash/
│
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css                # Tailwind imports
│   │
│   ├── components/
│   │   ├── ui/                  # Shadcn/ui (générés via CLI)
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── progress.tsx
│   │   │   └── toast.tsx
│   │   ├── CoffreCard.tsx       # Composants custom gamification
│   │   ├── TemptationCard.tsx
│   │   ├── TimerCircle.tsx
│   │   ├── XPCounter.tsx
│   │   ├── StreakBadge.tsx
│   │   ├── CelebrationOverlay.tsx
│   │   ├── CategoryPicker.tsx
│   │   └── Layout.tsx
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── PinInput.tsx
│   │   │   ├── useAuth.ts
│   │   │   └── authService.ts
│   │   ├── temptation/
│   │   │   ├── TemptationForm.tsx
│   │   │   ├── TemptationList.tsx
│   │   │   ├── useTemptations.ts
│   │   │   ├── temptationService.ts
│   │   │   └── types.ts
│   │   ├── gamification/
│   │   │   ├── StatsPanel.tsx
│   │   │   ├── LevelProgress.tsx
│   │   │   ├── useGamification.ts
│   │   │   ├── gamificationService.ts
│   │   │   └── xpCalculations.ts
│   │   └── dashboard/
│   │       ├── Dashboard.tsx
│   │       ├── JournalView.tsx
│   │       └── StatsView.tsx
│   │
│   ├── hooks/
│   │   ├── useOfflineSync.ts
│   │   └── usePushNotifications.ts
│   │
│   ├── lib/
│   │   ├── supabase.ts          # Client Supabase configuré
│   │   ├── utils.ts             # cn(), formatCurrency(), formatDate()
│   │   ├── constants.ts         # TIMER_DURATION_MS, XP_VALUES, LEVELS
│   │   └── queryClient.ts       # TanStack Query configuration
│   │
│   ├── stores/
│   │   ├── authStore.ts         # Zustand: session, userId
│   │   └── uiStore.ts           # Zustand: loading, modals
│   │
│   ├── types/
│   │   ├── database.ts          # Types générés depuis Supabase
│   │   └── index.ts             # Types applicatifs
│   │
│   └── pages/
│       ├── LoginPage.tsx
│       ├── HomePage.tsx
│       ├── NewTemptationPage.tsx
│       ├── JournalPage.tsx
│       └── StatsPage.tsx
│
├── supabase/
│   ├── config.toml
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       ├── verify-pin/
│       │   └── index.ts
│       ├── resolve-temptation/
│       │   └── index.ts
│       └── send-push/
│           └── index.ts
│
└── tests/
    ├── setup.ts
    ├── components/
    │   └── TemptationCard.test.tsx
    └── features/
        └── temptation/
            └── useTemptations.test.ts
```

### Requirements to Structure Mapping

| Domaine FR | Répertoire | Fichiers clés |
|------------|------------|---------------|
| FR1-FR9 (Tentations) | `src/features/temptation/` | `TemptationForm.tsx`, `useTemptations.ts` |
| FR10-FR18 (Gamification) | `src/features/gamification/` | `xpCalculations.ts`, `useGamification.ts` |
| FR19-FR23 (Coffre) | `src/components/` | `CoffreCard.tsx` |
| FR24-FR28 (Dashboard) | `src/features/dashboard/` | `Dashboard.tsx`, `JournalView.tsx` |
| FR29-FR31 (Auth) | `src/features/auth/` | `PinInput.tsx`, `authService.ts` |
| FR32-FR34 (Push) | `src/hooks/` + `supabase/functions/` | `usePushNotifications.ts`, `send-push/` |
| FR35-FR37 (PWA) | `vite.config.ts` + `src/hooks/` | PWA plugin config, `useOfflineSync.ts` |

### Architectural Boundaries

**Frontend → Supabase:**
- `src/lib/supabase.ts` — Single client instance
- `src/features/*/` — TanStack Query hooks encapsulent les appels

**Offline Sync Flow:**
```
IndexedDB (idb-keyval) ←→ Zustand persist ←→ TanStack Query ←→ Supabase
```

**Push Notification Flow:**
```
Service Worker ← Web Push API ← Supabase Edge Function (send-push)
                                        ↑
                             Supabase pg_cron (timer 24h check)
```

### Integration Points

**Supabase Services Used:**
- **Auth:** Custom PIN via RPC `verify_pin`
- **Database:** PostgreSQL tables (users, temptations, gamification)
- **Storage:** Bucket `temptation-photos` avec RLS
- **Edge Functions:** `verify-pin`, `resolve-temptation`, `send-push`
- **Realtime:** Non utilisé (mono-user, pas besoin)

**External Integrations:**
- **Vercel:** Hosting + Edge network
- **Web Push API:** Notifications navigateur

## Architecture Validation Results

### Coherence Validation ✅

**Decision Compatibility:**
Toutes les technologies sélectionnées sont compatibles et forment une stack cohérente. Vite + React + TypeScript + Tailwind v4 + Supabase + TanStack Query est un pattern éprouvé en production.

**Pattern Consistency:**
Conventions de nommage uniformes (snake_case DB, camelCase code), patterns async modernes, structure feature-based alignée avec les domaines fonctionnels du PRD.

**Structure Alignment:**
La structure projet supporte toutes les décisions architecturales et respecte les boundaries définies entre features.

### Requirements Coverage ✅

**Functional Requirements:** 37/37 FRs couverts architecturalement

| Groupe FR | Coverage |
|-----------|----------|
| FR1-FR9 Tentations | ✅ `features/temptation/` |
| FR10-FR18 Gamification | ✅ `features/gamification/` |
| FR19-FR23 Coffre | ✅ `CoffreCard` + queries |
| FR24-FR28 Dashboard | ✅ `features/dashboard/` |
| FR29-FR31 Auth | ✅ `features/auth/` + RPC |
| FR32-FR34 Push | ✅ Edge Functions + Web Push |
| FR35-FR37 PWA | ✅ vite-plugin-pwa + IndexedDB |

**Non-Functional Requirements:** 17/17 NFRs adressés

| Groupe NFR | Coverage |
|------------|----------|
| NFR1-5 Performance | ✅ Vite bundle optimization |
| NFR6-10 Fiabilité | ✅ Offline-first architecture |
| NFR11-14 Sécurité | ✅ PIN hash + RLS + HTTPS |
| NFR15-17 Accessibilité | ✅ Design system + touch targets |

### Implementation Readiness ✅

**Decision Completeness:**
- Toutes les décisions critiques documentées avec versions
- Stack technique entièrement spécifiée
- Patterns d'intégration définis

**Structure Completeness:**
- Arborescence projet complète et spécifique
- Tous les fichiers et répertoires définis
- Points d'intégration clairement spécifiés

**Pattern Completeness:**
- Conventions de nommage exhaustives
- Patterns de state management documentés
- Process patterns (error handling) complets

### Gap Analysis

**Critical Gaps:** Aucun
**Important Gaps:** Aucun
**Nice-to-Have (Post-MVP):**
- Sentry error monitoring
- Tests E2E Playwright
- Analytics avancés

### Architecture Completeness Checklist

**✅ Requirements Analysis**
- [x] Project context thoroughly analyzed
- [x] Scale and complexity assessed (Medium)
- [x] Technical constraints identified (PWA, offline, push)
- [x] Cross-cutting concerns mapped (offline sync, auth)

**✅ Architectural Decisions**
- [x] Critical decisions documented with versions
- [x] Technology stack fully specified
- [x] Integration patterns defined (Supabase, offline)
- [x] Performance considerations addressed

**✅ Implementation Patterns**
- [x] Naming conventions established
- [x] Structure patterns defined
- [x] Communication patterns specified
- [x] Process patterns documented

**✅ Project Structure**
- [x] Complete directory structure defined
- [x] Component boundaries established
- [x] Integration points mapped
- [x] Requirements to structure mapping complete

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION

**Confidence Level:** HIGH

**Key Strengths:**
- Stack moderne et éprouvée (Vite + React + Supabase)
- Offline-first bien architecturé (IndexedDB + Zustand + TanStack Query)
- Gamification isolée et testable
- PWA complète avec push notifications
- Patterns cohérents pour AI agents

**Areas for Future Enhancement:**
- Monitoring avec Sentry (post-MVP)
- Tests E2E avec Playwright (post-MVP)
- Analytics comportementaux (V2)

### Implementation Handoff

**AI Agent Guidelines:**
1. Suivre toutes les décisions architecturales exactement comme documentées
2. Utiliser les patterns d'implémentation de manière cohérente
3. Respecter la structure projet et les boundaries
4. Référer à ce document pour toutes questions architecturales

**First Implementation Step:**
```bash
npm create vite@latest gestion-achat -- --template react-ts
cd gestion-achat
npm install tailwindcss @tailwindcss/vite @supabase/supabase-js
npm install zustand @tanstack/react-query framer-motion lucide-react
npm install -D vite-plugin-pwa
npx shadcn@latest init
```

