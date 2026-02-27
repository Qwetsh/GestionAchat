---
status: complete
stepsCompleted: [step-01-init, step-02-discovery, step-03-core-experience, step-04-emotional-response, step-05-inspiration, step-06-design-system, step-07-defining-experience, step-08-visual-foundation, step-09-design-directions, step-10-user-journeys, step-11-component-strategy, step-12-ux-patterns, step-13-responsive-accessibility, step-14-complete]
inputDocuments:
  - prd.md
  - product-brief-GestionAchat-2026-02-26.md
  - domain-psychologie-achats-impulsifs-gamification-research-2026-02-27.md
date: 2026-02-27
---

# UX Design Specification — GestionAchat

**Author:** Thomas
**Date:** 2026-02-27

---

<!-- UX design content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

### Project Vision

GestionAchat est une PWA gamifiée qui transforme l'achat impulsif en épargne consciente. L'app capture le plaisir du processus shopping (photo, choix, anticipation) sans l'achat réel, en substituant la dopamine de l'achat par celle du jeu et de la progression.

### Target Users

**Persona principal : Aurélie**
- 40 ans, enseignante de français, ~2 200€/mois
- Contexte d'usage : soir après le travail, canapé, scroll Instagram/Sephora
- Comportement : achats impulsifs 10-60€, plusieurs fois/semaine, 250-300€/mois
- Psychologie : FOMO, shopping comme exutoire émotionnel, apprend par l'expérience vécue
- Devices : principalement smartphone (iOS/Android), parfois tablette

### Key Design Challenges

1. **Logging ultra-rapide** — Capturer la tentation en < 30 secondes avant que l'impulsion ne gagne
2. **Substitution dopaminergique** — L'app doit procurer autant de plaisir que l'acte d'achat
3. **Zéro culpabilité** — Aucun message négatif, même les craquages sont positifs
4. **Engagement durable** — Gamification variée pour éviter la lassitude
5. **Mobile-first responsive** — Usage principal smartphone, parfois en magasin debout

### Design Opportunities

1. **Micro-animations satisfaisantes** — XP qui s'incrémente, confettis, coffre qui se remplit
2. **Feedback émotionnel** — Court terme (plaisir instantané) + moyen terme (fierté)
3. **Rituel photo** — Transformer le "je veux" en "je capture"
4. **Ton chaleureux** — Messages personnalisés et bienveillants
5. **Visualisation tangible** — Rendre l'argent économisé réel et désirable

## Core User Experience

### Defining Experience

**Core Action:** Logger une tentation (photo + montant) en moins de 30 secondes.

Le timer 24h est le mécanisme central. L'app doit capturer la tentation AVANT que l'impulsion ne gagne. La vitesse de logging est plus importante que toute autre feature.

**Core Loop:** Tentation → Log → Timer 24h → Résistance/Craquage → Récompense → Progression

### Platform Strategy

- **Format:** PWA installable sur home screen
- **Primary:** Mobile touch (usage une main, pouce)
- **Offline:** Cache local pour logging hors connexion, sync au retour
- **Capabilities:** Accès caméra natif, notifications push
- **Responsive:** Mobile-first, desktop fonctionnel mais secondaire

### Effortless Interactions

| Interaction | Cible | Méthode |
|---|---|---|
| Log tentation | < 30 sec | Photo → Montant → Catégorie (3 taps) |
| Voir coffre | 1 tap | Dashboard = home screen |
| Check stats | 0 navigation | Stats visibles sur dashboard |
| Notifications | Automatique | Push system géré par service worker |

### Critical Success Moments

1. **Onboarding:** Premier log réussi avec badge "Débutante"
2. **Première résistance:** Célébration visuelle, XP bonus, confettis
3. **Accumulation visible:** Coffre qui se remplit progressivement
4. **Craquage assumé:** Message positif, conscience > culpabilité
5. **Projection tangible:** "Avec 140€ tu pourrais t'offrir un massage"

### Experience Principles

1. **Speed > Features** — La rapidité de capture prime sur la richesse fonctionnelle
2. **Reward > Restriction** — Dopamine positive par le jeu, jamais de punition
3. **Visual > Abstract** — Représentations visuelles plutôt que chiffres seuls
4. **Warmth > Authority** — Ton chaleureux et bienveillant, jamais moralisateur
5. **Progress > Perfection** — Chaque action consciente est une victoire

## Desired Emotional Response

### Primary Emotional Goals

1. **Fierté** — L'utilisatrice doit se sentir fière quand elle résiste, pas privée
2. **Plaisir instantané** — Dopamine du jeu qui remplace celle de l'achat
3. **Zéro culpabilité** — Jamais de honte, même en cas de craquage
4. **Accomplissement** — Progression visible qui crée un sentiment de maîtrise

### Emotional Journey Mapping

| Phase | Émotion | Déclencheur |
|---|---|---|
| Découverte | Curiosité | Design attractif |
| First use | Confiance | Onboarding simple |
| Logging | Satisfaction | Animation XP |
| Attente | Anticipation | Timer visuel |
| Résistance | Fierté | Célébration |
| Craquage | Acceptation | Message positif |
| Retour | Envie | Streak visible |

### Micro-Emotions

- **Confiance > Confusion** — Interface simple, actions claires
- **Accomplissement > Frustration** — Chaque action = progression
- **Delight > Simple satisfaction** — Surprises visuelles, animations
- **Fierté > Honte** — Vocabulaire positif systématique

### Design Implications

| Émotion cible | Approche design |
|---|---|
| Fierté | Célébrations visuelles, messages de victoire |
| Plaisir | Micro-animations, feedback sonore |
| Zéro culpabilité | "Dépense intentionnelle" pas "échec" |
| Confiance | Navigation simple, 3 taps max |
| Accomplissement | Barres de progression, niveaux |

### Emotional Design Principles

1. **Celebrate everything** — Chaque action mérite une récompense visuelle
2. **Never shame** — Le vocabulaire reste positif même sur les craquages
3. **Show progress** — L'accumulation doit être visible et tangible
4. **Create anticipation** — Le timer est un suspense, pas une contrainte
5. **Warmth over authority** — L'app est une amie, pas un coach

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

| App | Inspiration | Pattern clé |
|---|---|---|
| **Duolingo** | Gamification référence | Streaks, XP, célébrations, messages |
| **Forest** | Timer visuel | Anticipation, croissance visible |
| **BeReal** | Capture rapide | Notif → Action en secondes |
| **Headspace** | Ton chaleureux | Bienveillance, progression douce |
| **MyFitnessPal/Yuka** | Log quotidien rapide | Scan → feedback immédiat, streak |

### Transferable UX Patterns

**Navigation & Structure:**
- Dashboard = home (pas de menu burger)
- Streak counter toujours visible (header)
- Action principale accessible en 1 tap

**Interactions:**
- Capture photo ultra-rapide (< 30 sec flow complet)
- Timer visuel qui progresse (coffre qui se remplit)
- Célébrations animées (confettis, XP qui monte)

**Feedback & Rewards:**
- Messages personnalisés et chaleureux
- XP visible et animé
- Progression par paliers avec titres

### Anti-Patterns to Avoid

- Interface austère sans émotion (apps budget classiques)
- Vocabulaire négatif ou culpabilisant
- Notifications anxiogènes
- Onboarding > 3 écrans
- Navigation profonde (4+ niveaux)
- Chiffres sans représentation visuelle

### Design Inspiration Strategy

**Adopt:** Streaks Duolingo, célébrations animées, messages chaleureux, onboarding avec victoire immédiate

**Adapt:** Timer Forest → Coffre animé, capture BeReal → Photo + Montant, niveaux → Titres contextuels

**Avoid:** Vocabulaire négatif, interface austère, navigation complexe, notifications culpabilisantes

## Design System Foundation

### Design System Choice

**Foundation:** Tailwind CSS v4 + Shadcn/ui + Framer Motion

| Layer | Technology | Purpose |
|---|---|---|
| Styling | Tailwind CSS v4 | Utility-first, responsive, design tokens |
| Components | Shadcn/ui | Accessible components, fully customizable |
| Animations | Framer Motion | Gamification animations, transitions |
| Icons | Lucide React | Consistent icon set |

### Rationale for Selection

1. **Stack alignment** — Tailwind v4 déjà choisi dans le PRD
2. **Solo dev friendly** — Shadcn/ui = composants copiés, pas de breaking changes
3. **Customization** — Contrôle total sur le visuel pour les besoins gamification
4. **Accessibility** — Radix UI primitives = accessible par défaut
5. **Performance** — Pas de runtime CSS-in-JS, bundle léger

### Implementation Approach

**Phase 1 — Setup:**
- Tailwind v4 config avec design tokens custom
- Installation Shadcn/ui (Button, Input, Card, Dialog)
- Setup Framer Motion

**Phase 2 — Core Components:**
- Temptation Card (photo + timer + actions)
- XP Counter (animé)
- Streak Badge
- Coffre visuel

**Phase 3 — Animations:**
- Confettis celebration
- XP increment animation
- Timer progress
- Coffre fill animation

### Customization Strategy

**Design Tokens à définir:**
- `--color-primary` — Couleur engageante, pas austère
- `--color-success` — Célébration, résistance
- `--color-warning` — Timer, attention douce
- `--color-accent` — XP, rewards
- `--radius` — Rounded, friendly
- `--animation-duration` — Fast but noticeable

**Component Overrides:**
- Buttons: Plus rounded, feedback tactile
- Cards: Shadow soft, pas harsh
- Typography: Friendly, pas corporate

## Defining User Experience

### The Core Interaction

**Defining Experience:** "Capture ta tentation, attends 24h, sois récompensée"

Cette interaction unique combine :
- La capture photo (plaisir du processus)
- Le timer 24h (science de la dopamine)
- La récompense gamifiée (substitution addictive)

### User Mental Model

**Transformation visée :**
- AVANT : Voir → Vouloir → Acheter → Regretter
- APRÈS : Voir → Capturer → Attendre → Résister → Célébrer

Le geste de "capturer" remplace le geste d'"acheter" tout en préservant le plaisir du processus.

### Success Criteria

| Critère | Cible |
|---|---|
| Temps de log | < 30 secondes |
| Nombre de taps | 3 maximum |
| Feedback immédiat | Animation XP visible |
| Célébration résistance | Confettis + message |

### Novel UX Patterns

- **Timer 24h central** — Novel, basé sur neuroscience dopamine
- **Photo comme rituel** — Adapté de BeReal/Stories
- **Gamification complète** — Adapté de Duolingo
- **Combinaison unique** — Aucun concurrent ne fait les 3

### Experience Mechanics

**Initiation:** App ouverte → bouton "+" ou caméra prête
**Interaction:** Photo → Montant → Catégorie (3 taps)
**Feedback:** "+15 XP" animé, timer démarre, message chaleureux
**Completion:** Notification 24h, confettis, coffre qui se remplit

## Visual Design Foundation

### Color System

**Palette: Warm Coral**

| Token | Value | Usage |
|---|---|---|
| `--primary` | #F97316 | Actions principales, CTA |
| `--primary-soft` | #FED7AA | Backgrounds, hover |
| `--success` | #22C55E | Résistance, célébration |
| `--warning` | #F59E0B | Timer, attention douce |
| `--accent` | #EAB308 | XP, rewards, gold |
| `--background` | #FFFBEB | App background |
| `--surface` | #FFFFFF | Cards, modals |
| `--text` | #1C1917 | Primary text |
| `--muted` | #78716C | Secondary text |

**Semantic Colors:**
- Résistance = Success (green) — Célébration positive
- Craquage = Warning (amber) — Attention douce, pas punition
- Timer = Warning (amber) — Urgence douce
- XP = Accent (gold) — Valeur, récompense

### Typography System

**Font Family:** Inter (Google Fonts)

| Level | Size | Weight | Line Height |
|---|---|---|---|
| H1 | 32px | Bold | 1.1 |
| H2 | 24px | Bold | 1.2 |
| H3 | 20px | Semibold | 1.3 |
| Body | 16px | Regular | 1.5 |
| Small | 14px | Regular | 1.5 |
| XS | 12px | Medium | 1.5 |

### Spacing & Layout Foundation

**Base Unit:** 4px
**Scale:** 0, 4, 8, 12, 16, 20, 24, 32, 40, 48px

**Layout:**
- Mobile-first (375px base)
- Single column layout
- Touch targets: 44x44px minimum
- Card radius: 12-16px
- Content padding: 16-24px

### Accessibility Considerations

- Contrast ratio: 4.5:1 minimum (WCAG AA)
- Touch targets: 44x44px minimum
- Focus states: Visible outline
- Font size: 16px minimum (no zoom issues on iOS)
- Color: Never rely on color alone for meaning

## Design Direction Decision

### Design Directions Explored

| Direction | Focus | Vibe |
|---|---|---|
| Dashboard-First | Stats visibles, action en FAB | Consultation d'abord |
| Action-First | Zone photo dominante | Capture ultra-rapide |
| Gamification-Forward | Niveau/XP en hero | Jeu et progression |
| Feed-Based | Timeline scrollable | Historique visuel |

### Chosen Direction

**"Dashboard Gamifié"** — Hybride Direction 1 + 3

Layout qui combine :
- Coffre visuel proéminent (motivation)
- Streak et niveau visibles (gamification)
- CTA de tentation accessible (action)
- Projection "Et si..." (tangibilité)

### Design Rationale

1. **Coffre en hero** — Première chose vue = argent économisé = motivation
2. **Streak visible** — FOMO positif, engagement quotidien
3. **CTA clair** — "+" ou "Tentation" toujours accessible
4. **Tentations actives** — Voir les timers en cours
5. **Nav simple** — 3 tabs max (Home, Stats, Journal)

### Implementation Approach

**Screen Hierarchy:**
1. Home (Dashboard Gamifié) — Default
2. Stats (Détails mensuels, graphiques)
3. Journal (Historique tentations)

**Component Priority:**
1. Coffre Card (hero component)
2. Temptation Card (timer + actions)
3. Streak Badge (header)
4. XP Counter (animé)
5. Add Temptation CTA

## User Journey Flows

### Flow 1: Logger une Tentation

**Entry:** Bouton "+" ou "Tentation" depuis Dashboard
**Steps:** Photo → Montant → Catégorie → Confirmation
**Exit:** Timer démarre, XP gagné, retour Dashboard
**Target:** < 30 secondes

### Flow 2: Résistance (Timer Expiré)

**Trigger:** Push notification après 24h
**Celebration:** Confettis + XP bonus + Coffre animation
**Update:** Streak +1, économies mises à jour
**Emotion:** Fierté, accomplissement

### Flow 3: Craquage Intentionnel

**Trigger:** Tap "J'ai craqué" sur tentation active
**Confirmation:** Double confirmation douce
**Feedback:** XP partiel, message positif, stats de perspective
**Emotion:** Acceptation, pas de culpabilité

### Flow 4: Onboarding

**Entry:** Premier lancement
**Steps:** Code → 3 écrans concept → Dashboard
**First Action:** Highlight sur bouton "+"
**Target:** < 60 secondes jusqu'au dashboard

### Flow 5: Check Dashboard

**Entry:** Ouverture app quotidienne
**Content:** Coffre, Streak, Tentations actives, Projection
**Navigation:** Tabs vers Stats et Journal
**Emotion:** Motivation, progression visible

### Journey Patterns

| Pattern | Component | Animation |
|---|---|---|
| XP Gain | Counter animé | Ease-out increment |
| Celebration | Full-screen overlay | Confettis burst |
| Toast | Bottom notification | Slide-up, auto-dismiss |
| Timer | Circular progress | Fill animation |
| Pull refresh | List container | Spring animation |

### Flow Optimization Principles

1. **3 taps max** — Log complet en 3 actions
2. **Feedback immédiat** — Chaque action = réponse visuelle
3. **Recovery paths** — Annuler possible à chaque étape
4. **Progressive disclosure** — Info au moment où c'est utile
5. **Celebration first** — Les victoires sont célébrées avant les stats

## Component Strategy

### Design System Components (Shadcn/ui)

| Component | Usage |
|---|---|
| Button | CTAs, actions principales |
| Input | Saisie montant, code PIN |
| Card | Containers, surfaces |
| Dialog | Confirmations, modals |
| Toast | Notifications feedback |
| Progress | Barres de progression |
| Badge | Labels, statuts |

### Custom Components

#### CoffreCard
- **Purpose:** Hero dashboard, économies + motivation
- **Content:** Montant animé, barre progression, projection "Et si..."
- **Animation:** CountUp, fill progress

#### TemptationCard
- **Purpose:** Afficher tentation avec timer et actions
- **States:** Active, expired, resisted, cracked
- **Actions:** Détail, "J'ai craqué"

#### TimerCircle
- **Purpose:** Timer 24h visuel
- **Animation:** SVG cercle qui se remplit
- **Props:** duration, elapsed, size

#### XPCounter
- **Purpose:** Compteur XP avec animation gain
- **Animation:** CountUp + "+X" fade

#### StreakBadge
- **Purpose:** Streak avec flamme
- **States:** Active 🔥, Broken 💔, Record 🏆

#### CelebrationOverlay
- **Purpose:** Célébration victoire plein écran
- **Animation:** Confettis canvas, fade-in
- **Dismiss:** Tap ou auto 5s

#### CategoryPicker
- **Purpose:** Sélection catégorie rapide
- **Layout:** Grid 2x2, 4 options

### Implementation Roadmap

**Phase 1 (MVP):** TemptationCard, TimerCircle, CoffreCard, CategoryPicker, XPCounter
**Phase 2 (Engagement):** CelebrationOverlay, StreakBadge, LevelProgress
**Phase 3 (Polish):** Skeletons, empty states, micro-animations

## UX Consistency Patterns

### Feedback & Rewards

| Trigger | Feedback | Duration |
|---|---|---|
| Log tentation | "+15 XP" toast | 2s |
| Résistance | Confettis overlay | 5s |
| Craquage | Message positif toast | 3s |
| Streak update | Badge pulse | 1s |
| Niveau up | Full celebration | 5s |

**Message Tone:** Toujours positif, jamais culpabilisant

### Button Hierarchy

| Type | Usage | Style |
|---|---|---|
| Primary | Action principale | Filled |
| Secondary | Action secondaire | Outlined |
| Ghost | Tertiaire | Text only |
| Danger | Destructive (soft) | Outlined warning |
| FAB | Action globale | Floating |

### Form Patterns

- **Montant:** Auto-focus, clavier numérique, validation inline
- **Photo:** Caméra native, preview, retry facile
- **Catégorie:** 4 boutons, single select

### Navigation Patterns

- **Tab Bar:** 3 tabs (Home, Stats, Journal)
- **Active state:** Filled icon, primary color
- **Back:** Swipe right ou header arrow
- **No hamburger menu**

### Loading & Empty States

- **Loading:** Skeleton screens, pas de spinner plein écran
- **Empty:** Message encourageant + CTA contextuel
- **Offline:** Toast discret, actions queued

### Modal Patterns

- **Backdrop:** Tap to close
- **Animation:** Fade + scale
- **Actions:** Secondary left, Primary right
- **Confirmation:** Double-step pour actions importantes

## Responsive Design & Accessibility

### Responsive Strategy

**Approach:** Mobile-first, single-column across all devices

| Device | Width | Approach |
|---|---|---|
| Mobile | 320-767px | Design principal |
| Tablet | 768-1023px | Mobile agrandi |
| Desktop | 1024px+ | Centré, max-width 480px |

### Breakpoint Strategy

```css
/* Tailwind CSS v4 - Mobile-first */
/* Base: < 640px (mobile) */
/* sm: 640px+ (ignored) */
/* md: 768px+ (tablet) */
/* lg: 1024px+ (desktop) */
```

**Desktop Centering:**
```html
<div class="mx-auto max-w-[480px] min-h-screen bg-slate-50">
  <!-- App container -->
</div>
```

### Touch Target Guidelines

| Element | Min Size | Spacing |
|---|---|---|
| Boutons principaux | 48x48px | 8px margin |
| FAB | 56x56px | Fixed position |
| Tabs | 48px height | Equal distribution |
| Cards | Full width | 8px gap |
| Liste items | 48px min height | 4px gap |

### Accessibility (WCAG 2.1 AA)

#### Contraste

| Élément | Ratio minimum | Notre ratio |
|---|---|---|
| Text normal | 4.5:1 | 7:1+ (Slate-800 sur Slate-50) |
| Text large | 3:1 | 4.5:1+ |
| UI components | 3:1 | Validé |

#### Focus States

- **Outline:** 2px solid primary color
- **Offset:** 2px
- **Visible:** Keyboard navigation only (focus-visible)

#### Motion

- **Respect prefers-reduced-motion:** Désactive confettis, réduit animations
- **Animation max:** 300ms pour transitions critiques
- **No auto-play:** Aucune animation infinie non-contrôlée

#### Screen Reader Support

- **Labels:** Tous les boutons ont aria-label descriptif
- **Live regions:** Toast notifications sont aria-live="polite"
- **Structure:** Headings hiérarchiques (h1, h2, h3)
- **Alt text:** Photos de tentation ont description générée

### Testing Strategy

| Test | Outil | Fréquence |
|---|---|---|
| Color contrast | Axe DevTools | Chaque composant |
| Keyboard nav | Manuel | Sprint review |
| Screen reader | VoiceOver/NVDA | Avant release |
| Touch targets | Chrome DevTools | Chaque composant |
| Responsive | Browser DevTools | Continu |

### Performance Budgets

| Métrique | Budget | Priorité |
|---|---|---|
| LCP | < 2.5s | Critique |
| FID | < 100ms | Critique |
| CLS | < 0.1 | Important |
| TTI | < 3s | Important |
| Bundle JS | < 150kb gzip | Important |
