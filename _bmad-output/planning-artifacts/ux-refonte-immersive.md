# UX Design — Refonte Immersive GestionAchat

> Objectif : Transformer l'interface de "dashboard financier" en **expérience de jeu mobile immersive** avec le fond et la mascotte au centre de tout.

---

## 1. Principes directeurs

| Principe | Description |
|----------|-------------|
| **Immersion totale** | Le fond choisi remplit 100% de l'écran — l'utilisateur vit dans l'univers de sa mascotte |
| **Mascotte = coeur** | Le chat est au centre, grand, visible, c'est le lien émotionnel avec l'app |
| **Game UI** | Boutons colorés, arrondis, avec icônes — style jeu casual mobile, pas finance |
| **Info au coup d'oeil** | Stats condensées en haut, jamais de surcharge |
| **Mobile-only** | Design 100% mobile (PWA), pas de vue desktop séparée |
| **Extensible** | Ajouter un chat ou un fond = ajouter une entrée dans un tableau, rien d'autre |

---

## 2. Architecture des écrans

### 2.1 Écran principal (HomePage)

```
┌─────────────────────────────────┐
│  ☰  Budget: 85€/150€  Niv.5 💎 │  ← Barre de stats compacte
│  ░░░░░░░░░▓▓▓▓  320/500 XP     │     semi-transparente
│         [FOND PLEIN ÉCRAN]      │     + barre XP en dessous
│                                 │
│                                 │
│          ┌─────────┐            │
│          │  🐱 CAT │            │  ← Mascotte grande taille
│          │  (hero)  │            │     centrée verticalement
│          └─────────┘            │
│                                 │
│    ╔═══════════════════════╗    │
│    ║  + Nouvelle dépense   ║    │  ← Bouton principal (CTA)
│    ╚═══════════════════════╝    │
│                                 │
│    ┌───────────┐ ┌───────────┐  │
│    │📊 Stats   │ │💰 Budget  │  │  ← Boutons secondaires
│    └───────────┘ └───────────┘  │     (grille 2 colonnes)
│    ┌───────────┐ ┌───────────┐  │
│    │📋 Dépenses│ │🛒 Boutique│  │
│    └───────────┘ └───────────┘  │
│                                 │
└─────────────────────────────────┘
```

> **Note** : Pas de barre du bas — Options et Mascotte sont dans le menu hamburger `☰`.

#### 2.1.1 Barre de stats (top bar)

- **Position** : `fixed top-0`, pleine largeur
- **Style** : fond semi-transparent avec backdrop-blur (s'adapte au background)
- **Contenu ligne 1** (gauche → droite) :
  - Bouton hamburger `☰` (ouvre le menu overlay — contient : Nouveau revenu, Budget & dépenses fixes, Changer de mascotte, Options, Déconnexion)
  - `Budget: {remaining}€ / {total}€` — texte compact, rouge si négatif
  - `Niv.{level}` — badge petit
  - `{gems} 💎` — compteur gemmes, tap → boutique
- **Contenu ligne 2** : Barre de progression XP
  - Mini progress bar stylisée (hauteur ~6px, coins arrondis, dégradé primary)
  - Texte à droite : `{xpActuel}/{xpNextLevel} XP` en petit
  - Couleur : dégradé violet (primary) sur fond blanc/10%
- **Hauteur totale** : ~64px (2 lignes)
- Si streak active : petit indicateur `🔥{n}` à côté du niveau

#### 2.1.2 Zone mascotte (centre)

- **Mascotte** : utilise la taille `xl` actuelle (w-48 h-48) mais **sans le conteneur arrondi** — le chat est directement sur le fond
- **Position** : centrée horizontalement, dans le tiers supérieur de l'espace disponible (entre la top bar et les boutons)
- **Ombre** : `drop-shadow-2xl` pour décoller le chat du fond
- **Animation subtile** : léger rebond au chargement (CSS `@keyframes bounce-in`)

#### 2.1.3 Boutons d'action

**Layout :**
- 1 bouton principal pleine largeur : "Nouvelle dépense"
- 4 boutons secondaires en grille 2x2 : Stats, Budget, Dépenses semaine, Boutique

**Style V1 (palette par défaut) :**
```
Bouton principal :
  - Fond : dégradé vert → vert foncé
  - Texte : blanc, gras
  - Bordure : 2px ombre interne claire (effet 3D)
  - Border-radius : 16px
  - Ombre : shadow-lg colorée
  - Icône : à gauche du texte

Boutons secondaires :
  - Même style mais plus petits
  - Couleurs variées (chacun sa teinte)
  - Icône au-dessus du texte (optionnel) ou à gauche
```

**Mapping couleurs V1 :**
| Bouton | Couleur fond | Icône |
|--------|-------------|-------|
| Nouvelle dépense | Vert `#22C55E → #16A34A` | `Wallet` |
| Stats | Bleu `#3B82F6 → #2563EB` | `BarChart3` |
| Budget | Orange `#F59E0B → #D97706` | `PiggyBank` |
| Dépenses semaine | Violet `#8B5CF6 → #7C3AED` | `Receipt` |
| Boutique | Rose `#EC4899 → #DB2777` | `ShoppingBag` |

#### 2.1.4 Fond plein écran

- **Image** : `background-image` du fond sélectionné, `cover`, `center`
- **Fallback** (fond "Aucun") : dégradé sombre actuel comme base
- **Overlay haut** : dégradé noir en haut (`from-black/40 via-black/20 to-transparent`, ~120px) pour la lisibilité de la top bar + barre XP
- **Overlay bas** : dégradé noir en bas (`from-transparent to-black/40`) pour la lisibilité des boutons

---

### 2.2 Panneau "Dépenses de la semaine"

Accessible via le bouton "Dépenses semaine" sur la HomePage.

```
┌─────────────────────────────────┐
│          ← Retour               │  ← Header avec bouton retour
│   Dépenses de la semaine (5)    │
│─────────────────────────────────│
│  📊 Catégories                  │
│  🛒 Shopping: 45€  🍽️ Resto: 20€│  ← Tags résumé catégories
│─────────────────────────────────│
│  ┌─────────────────────────────┐│
│  │ 🛒 Zara          - 30,00 € ││  ← Liste dépenses
│  │    lun. 10 mars             ││
│  ├─────────────────────────────┤│
│  │ 🍽️ Resto midi     - 15,00 € ││
│  │    mar. 11 mars · Pour qqn  ││
│  ├─────────────────────────────┤│
│  │ ...                         ││
│  └─────────────────────────────┘│
└─────────────────────────────────┘
```

**Implémentation** : Slide-up panel (bottom sheet) depuis le bas, avec backdrop sombre. Pas une page séparée — on reste dans l'immersion.

- **Ouverture** : slide up depuis le bas avec animation `transform translateY`
- **Fermeture** : tap sur backdrop ou bouton retour
- **Fond du panel** : `bg-background` opaque (le fond sombre classique)
- **Hauteur** : 75% de l'écran, bord arrondi en haut

---

### 2.3 Autres pages (Stats, Budget, NewExpense, NewRevenue, Shop)

Ces pages **gardent le style actuel** (fond sombre, glassmorphism) pour cette V1. Le fond immersif est réservé à la **HomePage** qui est l'écran de hub principal.

Ajustement nécessaire : supprimer la bottom nav actuelle et le header mobile actuel, remplacés par un simple bouton retour vers la HomePage.

---

## 3. Système de thèmes par fond (V2)

### 3.1 Structure de données

Ajouter à chaque `Background` dans le store :

```typescript
interface BackgroundTheme {
  // Couleurs des boutons
  btnPrimary: string     // Dégradé bouton principal (from → to)
  btnStats: string       // Couleur bouton stats
  btnBudget: string      // Couleur bouton budget
  btnExpenses: string    // Couleur bouton dépenses
  btnShop: string        // Couleur bouton boutique

  // Overlays
  topOverlay: string     // Dégradé haut pour lisibilité
  bottomOverlay: string  // Dégradé bas pour lisibilité

  // Texte top bar
  topBarBg: string       // Fond de la barre du haut
}

interface Background {
  id: string
  name: string
  emoji: string
  image?: string
  gemCost: number
  theme?: BackgroundTheme  // V2
}
```

### 3.2 Palettes par fond

#### Jardin 🌳
Ambiance : nature lumineuse, pique-nique, soleil
```
btnPrimary:  #4ADE80 → #16A34A  (vert prairie)
btnStats:    #FB923C → #EA580C  (orange chaud)
btnBudget:   #FACC15 → #CA8A04  (jaune doré)
btnExpenses: #34D399 → #059669  (émeraude)
btnShop:     #F87171 → #DC2626  (rouge coquelicot)
topBarBg:    rgba(0, 0, 0, 0.35)
```

#### Japon 🗾
Ambiance : cerisiers, zen, coucher de soleil
```
btnPrimary:  #FB7185 → #E11D48  (rose sakura)
btnStats:    #C084FC → #9333EA  (violet wisteria)
btnBudget:   #F9A8D4 → #DB2777  (rose foncé)
btnExpenses: #86EFAC → #22C55E  (vert bambou)
btnShop:     #FCA5A5 → #EF4444  (rouge torii)
topBarBg:    rgba(0, 0, 0, 0.3)
```

#### Salon 🛋️
Ambiance : cozy, chaleureux, lumière douce
```
btnPrimary:  #86EFAC → #22C55E  (vert canapé)
btnStats:    #FCD34D → #CA8A04  (jaune coussin)
btnBudget:   #FDBA74 → #EA580C  (orange bois)
btnExpenses: #93C5FD → #3B82F6  (bleu fenêtre)
btnShop:     #FCA5A5 → #EF4444  (rouge accent)
topBarBg:    rgba(0, 0, 0, 0.3)
```

#### Chambre 🛏️
Ambiance : onirique, pastel, nuit enchantée
```
btnPrimary:  #C4B5FD → #7C3AED  (lavande)
btnStats:    #93C5FD → #3B82F6  (bleu nuit)
btnBudget:   #F9A8D4 → #DB2777  (rose poudré)
btnExpenses: #67E8F9 → #0891B2  (cyan rêve)
btnShop:     #D8B4FE → #9333EA  (violet profond)
topBarBg:    rgba(0, 0, 0, 0.25)
```

#### Bureau 💼
Ambiance : gaming, néon, tech
```
btnPrimary:  #818CF8 → #4F46E5  (indigo néon)
btnStats:    #34D399 → #059669  (vert menthe)
btnBudget:   #F472B6 → #DB2777  (rose néon)
btnExpenses: #60A5FA → #2563EB  (bleu écran)
btnShop:     #A78BFA → #7C3AED  (violet gaming)
topBarBg:    rgba(0, 0, 0, 0.4)
```

#### Aucun ⬜ (défaut)
Utilise le thème violet actuel de l'app.
```
btnPrimary:  #8B5CF6 → #7C3AED  (violet primary)
btnStats:    #3B82F6 → #2563EB  (bleu)
btnBudget:   #F59E0B → #D97706  (ambre)
btnExpenses: #10B981 → #059669  (émeraude)
btnShop:     #EC4899 → #DB2777  (rose)
topBarBg:    rgba(15, 10, 26, 0.7)
```

---

## 4. Composants à créer / modifier

### 4.1 Nouveaux composants

| Composant | Rôle |
|-----------|------|
| `GameButton` | Bouton stylisé "jeu mobile" — reçoit `variant` (couleur), `size` (full/half), `icon`, `label` |
| `TopStatsBar` | Barre fixe en haut avec stats condensées |
| `ExpenseSheet` | Bottom sheet pour la liste des dépenses de la semaine |
| `ImmersiveBackground` | Wrapper plein écran avec le fond sélectionné + overlays |

### 4.2 Composants à modifier

| Composant | Modification |
|-----------|-------------|
| `CatMascot` | Nouvelle taille `hero` (plus grande que `xl`), sans conteneur arrondi quand sur fond immersif |
| `HomePage` | Refonte complète du layout — passer au layout immersif |
| `AppShell` | Supprimer la sidebar desktop et la bottom nav — layout simplifié mobile-only |

### 4.3 Composants inchangés

- `MascotPicker` — fonctionne déjà en overlay
- Toutes les pages secondaires (Stats, Budget, NewExpense, etc.)

---

## 5. Style des boutons "Game UI"

### 5.1 Anatomie d'un GameButton

```
┌──────────────────────────────────┐
│  ┌────────────────────────────┐  │  ← Bordure extérieure (ombre foncée)
│  │   🎨 Icône   LABEL        │  │  ← Fond dégradé + texte blanc bold
│  │                            │  │     Highlight clair en haut (effet 3D)
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

### 5.2 CSS technique

```css
.game-btn {
  /* Forme */
  border-radius: 16px;
  padding: 14px 24px;

  /* Dégradé principal (varie par couleur) */
  background: linear-gradient(to bottom, var(--btn-light), var(--btn-dark));

  /* Effet 3D : bordure claire en haut, foncée en bas */
  border-top: 3px solid rgba(255, 255, 255, 0.3);
  border-bottom: 4px solid rgba(0, 0, 0, 0.3);

  /* Ombre portée colorée */
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  /* Texte */
  color: white;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  /* Interaction */
  transition: transform 0.1s, box-shadow 0.1s;
}

.game-btn:active {
  transform: translateY(2px);
  border-bottom-width: 2px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
```

---

## 6. Gestion du fond "Aucun"

Quand aucun fond n'est sélectionné :
- **Background** : dégradé sombre actuel (`#0F0A1A → #1E1033`)
- **Mascotte** : affichée avec un léger glow derrière (cercle radial `primary/20`)
- **Boutons** : palette par défaut (violets)
- **Pas d'overlay** dégradé nécessaire (le fond est déjà sombre)

---

## 7. Spécifications des images de fond

| Propriété | Valeur requise |
|-----------|---------------|
| **Format** | PNG |
| **Ratio** | 9:16 (portrait mobile) |
| **Résolution recommandée** | 1024 x 1792 px (ou 768 x 1344 minimum) |
| **Style** | Cohérent avec les illustrations cartoon existantes |
| **Emplacement** | `public/mascot/backgrounds/` |

> Les images seront affichées en `object-cover` plein écran. Le format portrait est indispensable pour éviter le crop et la pixélisation sur mobile.

---

## 8. Extensibilité — Ajouter un nouveau fond/chat

### Ajouter un chat
1. Placer l'image PNG dans `public/mascot/cats/`
2. Ajouter une entrée dans `CAT_SKINS` dans `mascotStore.ts`
3. C'est tout.

### Ajouter un fond (V1)
1. Placer l'image PNG dans `public/mascot/backgrounds/`
2. Ajouter une entrée dans `BACKGROUNDS` dans `mascotStore.ts`
3. C'est tout — utilise la palette par défaut.

### Ajouter un fond (V2 — avec thème)
1. Placer l'image dans `public/mascot/backgrounds/`
2. Ajouter une entrée dans `BACKGROUNDS` avec un objet `theme` contenant les couleurs
3. Les `GameButton` lisent automatiquement le thème du fond actif

Le système de thème est **opt-in** : si un fond n'a pas de `theme`, la palette par défaut est utilisée.

---

## 9. Plan d'implémentation recommandé

### Phase 1 — Structure immersive (V1)
1. Créer `ImmersiveBackground` — fond plein écran + overlays
2. Créer `TopStatsBar` — barre de stats compacte fixe
3. Créer `GameButton` — bouton stylisé avec palette par défaut
4. Créer `ExpenseSheet` — bottom sheet dépenses
5. Refondre `HomePage` — assembler les composants
6. Adapter `CatMascot` — taille `hero`, mode sans conteneur
7. Simplifier `AppShell` — mobile-only, retirer sidebar/bottom nav

### Phase 2 — Thèmes dynamiques (V2)
1. Étendre `Background` avec `BackgroundTheme`
2. Créer un hook `useBackgroundTheme()` qui retourne la palette active
3. Injecter les variables CSS dynamiquement selon le fond
4. `GameButton` lit les variables CSS automatiquement

---

## 10. Résumé visuel des changements

| Avant | Après |
|-------|-------|
| Dashboard avec listes et cards | Hub de jeu avec mascotte centrale |
| Fond sombre fixe | Fond choisi en plein écran |
| Boutons glassmorphism discrets | Boutons colorés style jeu mobile |
| Sidebar desktop + bottom nav | Mobile-only, navigation par boutons centraux |
| Dépenses visibles directement | Dépenses dans un bottom sheet |
| Mascotte petite dans le header | Mascotte en grand au centre |
