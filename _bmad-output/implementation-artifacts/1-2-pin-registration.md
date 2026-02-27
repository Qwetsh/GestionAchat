# Story 1.2: PIN Registration

Status: review

## Story

As a **utilisatrice**,
I want **créer mon compte avec un code PIN 4 chiffres**,
So that **je peux accéder à l'app de manière sécurisée et simple**.

## Acceptance Criteria

1. **Given** l'utilisatrice ouvre l'app pour la première fois **When** elle entre un code PIN de 4 chiffres et confirme **Then** son compte est créé dans Supabase avec le PIN hashé **And** elle est automatiquement connectée **And** un message de bienvenue s'affiche

2. **Given** l'utilisatrice entre un PIN de moins de 4 chiffres **When** elle tente de valider **Then** un message d'erreur indique que le PIN doit faire 4 chiffres

## Tasks / Subtasks

- [x] Task 1: Créer le composant PinInput (AC: 1, 2)
  - [x] Créer `src/features/auth/PinInput.tsx` avec 4 inputs numériques
  - [x] Implémenter auto-focus sur le champ suivant
  - [x] Implémenter validation 4 chiffres uniquement
  - [x] Ajouter feedback visuel (erreur, succès)

- [x] Task 2: Créer la page d'inscription (AC: 1, 2)
  - [x] Créer `src/pages/RegisterPage.tsx`
  - [x] Intégrer PinInput avec confirmation (2x saisie)
  - [x] Afficher message d'erreur si PIN < 4 chiffres
  - [x] Afficher message d'erreur si confirmation ne match pas

- [x] Task 3: Implémenter le service d'authentification (AC: 1)
  - [x] Créer `src/features/auth/authService.ts`
  - [x] Implémenter fonction `hashPin(pin: string)` avec Web Crypto API
  - [x] Implémenter fonction `registerUser(pin: string)`
  - [x] Créer user dans Supabase avec PIN hashé
  - [x] Créer entrée gamification initiale (xp: 0, level: 1)

- [x] Task 4: Intégrer avec Zustand authStore (AC: 1)
  - [x] Mettre à jour `src/stores/authStore.ts`
  - [x] Ajouter action `register(pin: string)`
  - [x] Persister userId après inscription réussie
  - [x] Gérer état `isAuthenticated`

- [x] Task 5: Afficher message de bienvenue (AC: 1)
  - [x] Créer toast de bienvenue avec Sonner
  - [x] Rediriger vers Dashboard après inscription
  - [x] Message chaleureux: "Bienvenue ! Prête à résister ?"

- [x] Task 6: Créer le routing de base (AC: 1)
  - [x] Installer react-router-dom
  - [x] Configurer routes: `/register`, `/login`, `/` (dashboard)
  - [x] Implémenter garde d'authentification (ProtectedRoute)
  - [x] Rediriger vers register si pas de compte

## Dev Notes

### Architecture Requirements
[Source: architecture.md#Authentication & Security]

**Auth Flow:**
1. User entre code PIN 4 chiffres
2. Hash SHA-256 via Web Crypto API (côté client)
3. Session stockée dans Zustand persist
4. Vérification du PIN via hash comparison

**Security:**
- PIN hashé avec SHA-256 + salt
- Jamais stocké en clair
- Minimum 4 chiffres requis

### UX Requirements
[Source: ux-design-specification.md]

- Touch targets: 56x64px pour les inputs PIN (> 48px minimum)
- Auto-focus sur le champ suivant après saisie
- Messages positifs et chaleureux
- Flow: Création → Confirmation → Bienvenue → Dashboard

### Color Palette
- Primary: #F97316 (bouton valider)
- Success: #22C55E (validation OK)
- Text: #1C1917
- Muted: #78716C (placeholder)

### Dependencies from Story 1.1
- Supabase client: `src/lib/supabase.ts` ✅
- Database schema: `supabase/migrations/001_initial_schema.sql` ✅
- Zustand authStore: `src/stores/authStore.ts` ✅
- Shadcn/ui Input, Button, Card ✅

### Testing Strategy
- Test manuel: inscription avec PIN valide
- Test manuel: PIN < 4 chiffres → erreur
- Test manuel: confirmation différente → erreur
- Vérifier création user dans Supabase

### References
- [Source: epics.md#Story 1.2]
- [Source: architecture.md#Authentication & Security]
- [Source: ux-design-specification.md#Flow 4: Onboarding]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- TypeScript: ✅ Pas d'erreur
- ESLint: ✅ Pas d'erreur
- Build: ✅ Succès (508KB bundle, warning taille mais fonctionnel)

### Completion Notes List

- 2026-02-27: Story 1.2 complétée
- Composant PinInput avec auto-focus et validation
- Service auth avec hashage SHA-256
- Routing complet avec guards d'authentification
- Toast de bienvenue via Sonner
- LoginPage aussi créée (bonus pour Story 1.3)

### File List

**Fichiers créés:**
- `src/features/auth/PinInput.tsx`
- `src/features/auth/authService.ts`
- `src/features/auth/index.ts`
- `src/pages/RegisterPage.tsx`
- `src/pages/LoginPage.tsx`
- `src/pages/HomePage.tsx`

**Fichiers modifiés:**
- `src/stores/authStore.ts` (ajout register, login, checkAccount)
- `src/types/database.ts` (ajout Relationships pour Supabase types)
- `src/App.tsx` (routing avec react-router-dom)
- `package.json` (ajout react-router-dom)

## Change Log

- 2026-02-27: Initial implementation - Story 1.2 PIN Registration completed
