# Story 1.3: PIN Login

Status: review

## Story

As a **utilisatrice**,
I want **me connecter avec mon code PIN**,
So that **je retrouve mes données entre les sessions**.

## Acceptance Criteria

1. **Given** l'utilisatrice a déjà un compte **When** elle entre son code PIN correct **Then** elle est connectée et redirigée vers le dashboard **And** sa session persiste (Zustand + localStorage)

2. **Given** l'utilisatrice entre un PIN incorrect **When** elle tente de se connecter **Then** un message d'erreur s'affiche (sans révéler si le compte existe) **And** elle peut réessayer

## Tasks / Subtasks

- [x] Task 1: Créer la page de connexion (AC: 1, 2)
  - [x] Créer `src/pages/LoginPage.tsx`
  - [x] Intégrer PinInput
  - [x] Auto-submit quand PIN complet (150ms delay pour voir le dernier chiffre)
  - [x] Afficher erreur si PIN incorrect

- [x] Task 2: Implémenter loginUser dans authService (AC: 1, 2)
  - [x] Fonction `loginUser(pin: string)`
  - [x] Hash PIN et comparer avec DB
  - [x] Message d'erreur générique "Code PIN incorrect" (sécurité)

- [x] Task 3: Intégrer login dans authStore (AC: 1)
  - [x] Action `login(pin: string)`
  - [x] Persister session via Zustand persist (localStorage)
  - [x] État `isAuthenticated` mis à jour

- [x] Task 4: Gérer la persistance de session (AC: 1)
  - [x] Session persiste après refresh (Zustand persist)
  - [x] Redirection auto vers dashboard si connecté (AuthRoute guard)
  - [x] Logout disponible sur HomePage

- [x] Task 5: Afficher message de retour (AC: 1)
  - [x] Toast "Content de te revoir ! 👋" via Sonner

## Dev Notes

### Implementation Summary

La Story 1.3 était déjà entièrement implémentée dans Story 1.2 car les fonctionnalités login et register partagent beaucoup de code.

**Fonctionnalités Login:**
- `LoginPage.tsx` avec PinInput et auto-submit
- `loginUser()` dans authService avec hash comparison
- `login()` action dans authStore avec persist
- Guard `AuthRoute` pour redirection si déjà connecté
- Toast de bienvenue au retour

**Sécurité:**
- Message d'erreur générique (ne révèle pas si le compte existe)
- PIN hashé, jamais transmis en clair
- Session en localStorage (acceptable pour app mono-user)

### Testing Strategy
- Test manuel: login avec PIN correct → dashboard + toast
- Test manuel: login avec PIN incorrect → erreur générique
- Test manuel: refresh page → session persiste
- Test manuel: logout → redirection vers /login

### References
- [Source: epics.md#Story 1.3]
- [Source: architecture.md#Authentication & Security]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- TypeScript: ✅ Pas d'erreur
- ESLint: ✅ Pas d'erreur

### Completion Notes List

- 2026-02-27: Story 1.3 complétée (code déjà implémenté en Story 1.2)
- Auto-submit du PIN avec délai 150ms pour UX
- Message d'erreur générique pour la sécurité
- Session persist via Zustand middleware

### File List

**Fichiers utilisés (créés en Story 1.2):**
- `src/pages/LoginPage.tsx`
- `src/features/auth/authService.ts` (loginUser)
- `src/stores/authStore.ts` (login action)
- `src/App.tsx` (routing /login)

## Change Log

- 2026-02-27: Story 1.3 PIN Login - Validation et documentation (code déjà présent)
