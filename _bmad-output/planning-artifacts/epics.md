---
stepsCompleted: [step-01-validate-prerequisites, step-02-design-epics, step-03-create-stories, step-04-final-validation]
status: complete
completedAt: '2026-02-27'
inputDocuments:
  - prd.md
  - architecture.md
  - ux-design-specification.md
---

# GestionAchat - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for GestionAchat, decomposing the requirements from the PRD, UX Design, and Architecture into implementable stories.

## Requirements Inventory

### Functional Requirements

**Gestion des Tentations (FR1-FR9):**
- FR1: L'utilisatrice peut logger une tentation en prenant ou sélectionnant une photo
- FR2: L'utilisatrice peut saisir le montant d'une tentation
- FR3: L'utilisatrice peut sélectionner une catégorie pour la tentation
- FR4: Le système démarre automatiquement un timer 24h quand une tentation est loggée
- FR5: L'utilisatrice peut voir le temps restant sur les timers actifs
- FR6: L'utilisatrice peut marquer une tentation active comme "J'ai craqué" avant expiration
- FR7: Le système marque automatiquement une tentation comme "résistée" à l'expiration du timer
- FR8: L'utilisatrice peut consulter l'historique de toutes ses tentations passées
- FR9: L'utilisatrice peut voir la photo, le montant, la catégorie et le statut de chaque tentation

**Système de Gamification (FR10-FR18):**
- FR10: Le système attribue des XP quand l'utilisatrice logge une tentation
- FR11: Le système attribue des XP bonus quand l'utilisatrice résiste à une tentation
- FR12: Le système attribue des XP partiels quand l'utilisatrice marque "J'ai craqué"
- FR13: Le système suit le streak actuel (jours consécutifs sans craquer)
- FR14: Le système conserve le meilleur streak jamais atteint
- FR15: L'utilisatrice peut voir son total d'XP
- FR16: Le système calcule le niveau basé sur des paliers d'XP
- FR17: L'utilisatrice peut voir son niveau actuel et son titre
- FR18: L'utilisatrice peut voir sa progression vers le niveau suivant

**Coffre & Suivi Financier (FR19-FR23):**
- FR19: Le système calcule le montant total économisé (somme des tentations résistées)
- FR20: Le système calcule le montant total dépensé (somme des tentations craquées)
- FR21: Le système calcule l'économie nette (économisé - dépensé)
- FR22: L'utilisatrice peut voir une représentation visuelle de ses économies (coffre)
- FR23: L'utilisatrice peut voir une barre de progression

**Dashboard & Statistiques (FR24-FR28):**
- FR24: L'utilisatrice peut voir son streak actuel sur le dashboard
- FR25: L'utilisatrice peut voir son meilleur streak sur le dashboard
- FR26: L'utilisatrice peut voir des statistiques mensuelles (tentations, taux, montants)
- FR27: L'utilisatrice peut voir un journal des tentations résistées ET craquées
- FR28: Le système affiche des messages positifs et encourageants dans tous les cas

**Compte Utilisateur (FR29-FR31):**
- FR29: L'utilisatrice peut créer un compte avec un code personnel (sans email)
- FR30: L'utilisatrice peut accéder à l'app en entrant son code personnel
- FR31: Les données de l'utilisatrice persistent entre les sessions

**Notifications Push (FR32-FR34):**
- FR32: Le système envoie une notification push quand un timer 24h expire (célébration)
- FR33: Le système envoie une notification push 1h avant l'expiration (rappel)
- FR34: L'utilisatrice peut recevoir des notifications même quand l'app est fermée

**PWA & Offline (FR35-FR37):**
- FR35: L'utilisatrice peut installer l'app sur l'écran d'accueil de son mobile
- FR36: L'utilisatrice peut accéder aux fonctions core en mode offline
- FR37: Le système synchronise les actions offline quand la connexion est rétablie

### Non-Functional Requirements

**Performance (NFR1-NFR5):**
- NFR1: Temps de chargement initial < 3 secondes sur connexion 4G
- NFR2: First Contentful Paint < 1.5 secondes
- NFR3: Temps de log d'une tentation < 30 secondes (photo + montant)
- NFR4: Animations gamification à 60 FPS sans lag perceptible
- NFR5: Taille du bundle < 500KB gzipped

**Fiabilité (NFR6-NFR10):**
- NFR6: Disponibilité 99% (hors maintenance planifiée)
- NFR7: Zéro perte de données — aucune tentation, XP ou streak ne doit être perdu
- NFR8: Fonctionnement offline pour les core features (consultation, log en attente)
- NFR9: Synchronisation automatique dès retour de connexion
- NFR10: Données persistées côté serveur (Supabase) pour backup

**Sécurité (NFR11-NFR14):**
- NFR11: Authentification par code personnel (minimum 4 chiffres)
- NFR12: Toutes les communications via HTTPS
- NFR13: Données au repos chiffrées (standard Supabase)
- NFR14: Photos stockées en privé, non accessibles publiquement

**Accessibilité (NFR15-NFR17):**
- NFR15: Ratio de contraste minimum 4.5:1 pour le texte
- NFR16: Zones tactiles minimum 44x44px pour tous les boutons
- NFR17: Tous les champs de formulaire ont un label accessible

### Additional Requirements

**From Architecture:**
- Starter template: Vite + React-TS (Epic 1, Story 1)
- Tailwind CSS v4 configuration
- Supabase setup (Auth, Database, Storage, Edge Functions)
- PWA configuration avec vite-plugin-pwa et Workbox
- Shadcn/ui component library initialization
- Offline-first architecture: IndexedDB + Zustand persist + TanStack Query
- Database schema: users, temptations, gamification tables
- Push notifications via Web Push API + Supabase Edge Functions

**From UX Design:**
- Mobile-first responsive (375px base, max-width 480px desktop)
- Warm Coral color palette (#F97316 primary)
- Custom components: CoffreCard, TemptationCard, TimerCircle, XPCounter, StreakBadge, CelebrationOverlay, CategoryPicker
- Framer Motion animations for gamification feedback
- WCAG 2.1 AA accessibility compliance
- Touch targets minimum 48x48px

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 2 | Logger une tentation avec photo |
| FR2 | Epic 2 | Saisir le montant |
| FR3 | Epic 2 | Sélectionner une catégorie |
| FR4 | Epic 2 | Timer 24h automatique |
| FR5 | Epic 2 | Voir temps restant |
| FR6 | Epic 2 | Bouton "J'ai craqué" |
| FR7 | Epic 2 | Résolution automatique |
| FR8 | Epic 4 | Historique des tentations |
| FR9 | Epic 4 | Détails de chaque tentation |
| FR10 | Epic 3 | XP pour log tentation |
| FR11 | Epic 3 | XP bonus résistance |
| FR12 | Epic 3 | XP partiel craquage |
| FR13 | Epic 3 | Suivi streak actuel |
| FR14 | Epic 3 | Meilleur streak |
| FR15 | Epic 3 | Affichage total XP |
| FR16 | Epic 3 | Calcul niveau |
| FR17 | Epic 3 | Affichage niveau et titre |
| FR18 | Epic 3 | Progression niveau suivant |
| FR19 | Epic 4 | Calcul montant économisé |
| FR20 | Epic 4 | Calcul montant dépensé |
| FR21 | Epic 4 | Calcul économie nette |
| FR22 | Epic 4 | Coffre visuel |
| FR23 | Epic 4 | Barre de progression |
| FR24 | Epic 5 | Streak actuel dashboard |
| FR25 | Epic 5 | Meilleur streak dashboard |
| FR26 | Epic 5 | Stats mensuelles |
| FR27 | Epic 5 | Journal résisté + craqué |
| FR28 | Epic 5 | Messages positifs |
| FR29 | Epic 1 | Création compte code |
| FR30 | Epic 1 | Connexion code |
| FR31 | Epic 1 | Persistance données |
| FR32 | Epic 6 | Push timer expiré |
| FR33 | Epic 6 | Push rappel 1h |
| FR34 | Epic 6 | Push app fermée |
| FR35 | Epic 7 | Installation PWA |
| FR36 | Epic 7 | Mode offline |
| FR37 | Epic 7 | Sync auto |

**Couverture totale : 37/37 FRs**

## Epic List

### Epic 1: Foundation & Authentification
**Goal:** Aurélie peut accéder à son app avec son code personnel

L'utilisatrice peut créer un compte avec un code PIN 4 chiffres et s'authentifier pour accéder à ses données personnelles. Cette fondation inclut le setup complet du projet (Vite, React, Supabase, Tailwind).

**FRs couverts:** FR29, FR30, FR31
**NFRs adressés:** NFR11, NFR12, NFR13

---

### Epic 2: Système de Tentations Core
**Goal:** Aurélie peut logger une tentation et la suivre pendant 24h

L'utilisatrice peut photographier un produit tentant, entrer son montant, choisir une catégorie, et laisser le timer 24h faire son travail. Elle peut aussi marquer "J'ai craqué" si elle cède avant la fin.

**FRs couverts:** FR1, FR2, FR3, FR4, FR5, FR6, FR7
**NFRs adressés:** NFR3, NFR14

---

### Epic 3: Gamification & Récompenses
**Goal:** Aurélie gagne des XP, construit des streaks et monte de niveau

L'utilisatrice est récompensée pour chaque action : XP pour logger, bonus pour résister, XP partiel même si elle craque. Les streaks motivent la constance, les niveaux donnent un sentiment de progression.

**FRs couverts:** FR10, FR11, FR12, FR13, FR14, FR15, FR16, FR17, FR18
**NFRs adressés:** NFR4, NFR7

---

### Epic 4: Coffre & Visualisation des Économies
**Goal:** Aurélie voit ses économies grandir et peut consulter son historique

L'utilisatrice visualise concrètement l'argent économisé dans un coffre virtuel. Elle peut revoir ses tentations passées (résistées et craquées) pour prendre conscience de ses patterns.

**FRs couverts:** FR8, FR9, FR19, FR20, FR21, FR22, FR23
**NFRs adressés:** NFR7

---

### Epic 5: Dashboard & Statistiques
**Goal:** Aurélie consulte ses stats et reste motivée

L'utilisatrice accède à un tableau de bord complet : streaks, stats mensuelles, journal chronologique. Les messages sont toujours positifs et encourageants, jamais culpabilisants.

**FRs couverts:** FR24, FR25, FR26, FR27, FR28
**NFRs adressés:** NFR15, NFR16, NFR17

---

### Epic 6: Notifications Push
**Goal:** Aurélie reçoit des notifications même quand l'app est fermée

L'utilisatrice est notifiée quand son timer 24h expire (célébration !) et reçoit un rappel 1h avant. Le système fonctionne même quand l'app est fermée.

**FRs couverts:** FR32, FR33, FR34
**NFRs adressés:** NFR6

---

### Epic 7: PWA & Mode Offline
**Goal:** Aurélie peut utiliser l'app partout, même sans connexion

L'utilisatrice peut installer l'app sur son écran d'accueil, l'utiliser en mode avion, et voir ses données se synchroniser automatiquement au retour de la connexion.

**FRs couverts:** FR35, FR36, FR37
**NFRs adressés:** NFR1, NFR2, NFR5, NFR8, NFR9, NFR10

---

## Epic 1: Foundation & Authentification

Aurélie peut accéder à son app avec son code personnel. Cette fondation inclut le setup complet du projet technique.

### Story 1.1: Project Setup & Supabase Configuration

As a **développeur**,
I want **initialiser le projet avec Vite, React-TS, Tailwind v4, et Supabase**,
So that **la base technique est prête pour le développement des features**.

**Acceptance Criteria:**

**Given** le repo est vide
**When** le développeur exécute les commandes d'initialisation
**Then** le projet Vite + React-TS est créé
**And** Tailwind CSS v4 est configuré avec la palette Warm Coral (#F97316 primary)
**And** Shadcn/ui est initialisé avec les composants de base (Button, Card, Input)
**And** Le client Supabase est configuré dans `src/lib/supabase.ts`
**And** Le schema database initial est créé (tables users, temptations, gamification)
**And** L'app démarre sans erreur avec `npm run dev`

---

### Story 1.2: PIN Registration

As a **utilisatrice**,
I want **créer mon compte avec un code PIN 4 chiffres**,
So that **je peux accéder à l'app de manière sécurisée et simple**.

**Acceptance Criteria:**

**Given** l'utilisatrice ouvre l'app pour la première fois
**When** elle entre un code PIN de 4 chiffres et confirme
**Then** son compte est créé dans Supabase avec le PIN hashé
**And** elle est automatiquement connectée
**And** un message de bienvenue s'affiche

**Given** l'utilisatrice entre un PIN de moins de 4 chiffres
**When** elle tente de valider
**Then** un message d'erreur indique que le PIN doit faire 4 chiffres

---

### Story 1.3: PIN Login

As a **utilisatrice**,
I want **me connecter avec mon code PIN**,
So that **je retrouve mes données entre les sessions**.

**Acceptance Criteria:**

**Given** l'utilisatrice a déjà un compte
**When** elle entre son code PIN correct
**Then** elle est connectée et redirigée vers le dashboard
**And** sa session persiste (Zustand + localStorage)

**Given** l'utilisatrice entre un PIN incorrect
**When** elle tente de se connecter
**Then** un message d'erreur s'affiche (sans révéler si le compte existe)
**And** elle peut réessayer

---

## Epic 2: Système de Tentations Core

Aurélie peut logger une tentation et la suivre pendant 24h. C'est le mécanisme central de l'application.

### Story 2.1: Capture Photo Tentation

As a **utilisatrice**,
I want **prendre ou sélectionner une photo d'un produit tentant**,
So that **je capture visuellement ma tentation**.

**Acceptance Criteria:**

**Given** l'utilisatrice est sur l'écran de nouvelle tentation
**When** elle clique sur le bouton photo
**Then** elle peut choisir entre appareil photo ou galerie
**And** la photo est compressée côté client (max 500KB)
**And** la photo s'affiche en preview

**Given** l'utilisatrice annule la capture
**When** elle clique sur annuler
**Then** elle revient à l'écran précédent sans créer de tentation

---

### Story 2.2: Formulaire Tentation Complet

As a **utilisatrice**,
I want **saisir le montant et la catégorie de ma tentation**,
So that **ma tentation est complètement documentée**.

**Acceptance Criteria:**

**Given** l'utilisatrice a capturé une photo
**When** elle saisit un montant (ex: 34,00)
**Then** le montant est validé (nombre positif, max 2 décimales)

**Given** l'utilisatrice a saisi un montant
**When** elle sélectionne une catégorie (Cosmétique, Livres, Feutres/Coloriage, Autre)
**Then** la catégorie est enregistrée avec la tentation

**Given** le formulaire est complet (photo + montant + catégorie)
**When** elle valide
**Then** la tentation est créée en base avec status "active"
**And** la photo est uploadée dans Supabase Storage
**And** elle reçoit un feedback visuel de confirmation (+XP preview)

---

### Story 2.3: Timer 24h Automatique

As a **utilisatrice**,
I want **voir un timer 24h démarrer automatiquement**,
So that **je sais combien de temps je dois résister**.

**Acceptance Criteria:**

**Given** une tentation vient d'être créée
**When** elle est enregistrée
**Then** un timer 24h démarre automatiquement (created_at + 24h)
**And** le composant TimerCircle affiche le temps restant
**And** le timer se met à jour en temps réel (chaque seconde)

**Given** l'utilisatrice consulte ses tentations actives
**When** elle voit une tentation
**Then** le temps restant est affiché visuellement (cercle + texte)

---

### Story 2.4: Bouton "J'ai Craqué"

As a **utilisatrice**,
I want **pouvoir marquer que j'ai craqué avant la fin du timer**,
So that **je reste honnête sans culpabilité**.

**Acceptance Criteria:**

**Given** une tentation est active (timer en cours)
**When** l'utilisatrice clique sur "J'ai craqué"
**Then** une confirmation douce s'affiche ("Tu es sûre ?")

**Given** l'utilisatrice confirme le craquage
**When** elle valide
**Then** la tentation passe en status "cracked"
**And** resolved_at est enregistré
**And** un message positif s'affiche ("Dépense intentionnelle, c'est déjà une victoire")
**And** elle reçoit des XP partiels (+5 XP)

---

### Story 2.5: Résolution Automatique 24h

As a **système**,
I want **marquer automatiquement une tentation comme "résistée" après 24h**,
So that **l'utilisatrice est récompensée sans action**.

**Acceptance Criteria:**

**Given** une tentation est active depuis 24h
**When** le timer expire
**Then** la tentation passe en status "resisted"
**And** resolved_at est enregistré automatiquement
**And** l'utilisatrice reçoit XP bonus (+50 XP)

**Given** l'utilisatrice ouvre l'app après expiration
**When** elle voit la tentation résolue
**Then** une célébration s'affiche (confettis, message positif)

---

## Epic 3: Gamification & Récompenses

Aurélie gagne des XP, construit des streaks et monte de niveau. C'est le substitut dopaminergique au plaisir du shopping.

### Story 3.1: Attribution XP

As a **utilisatrice**,
I want **gagner des XP pour mes actions**,
So that **je suis récompensée et motivée**.

**Acceptance Criteria:**

**Given** l'utilisatrice logge une nouvelle tentation
**When** la tentation est créée
**Then** elle gagne +15 XP
**And** une animation XP s'affiche (XPCounter avec Framer Motion)

**Given** une tentation est résolue comme "résistée"
**When** le timer expire ou résolution manuelle
**Then** elle gagne +50 XP bonus
**And** une célébration s'affiche (CelebrationOverlay)

**Given** l'utilisatrice marque "J'ai craqué"
**When** elle confirme
**Then** elle gagne +5 XP (récompense pour l'honnêteté)
**And** un message positif s'affiche

---

### Story 3.2: Système de Streaks

As a **utilisatrice**,
I want **voir mon streak de jours consécutifs sans craquer**,
So that **je suis motivée à maintenir ma série**.

**Acceptance Criteria:**

**Given** l'utilisatrice résiste à une tentation
**When** la tentation passe en "resisted"
**Then** son streak actuel est incrémenté (+1 jour)
**And** le StreakBadge s'anime (flamme, nombre)

**Given** l'utilisatrice marque "J'ai craqué"
**When** elle confirme
**Then** son streak actuel revient à 0
**And** un message encourageant s'affiche ("On recommence ensemble !")

**Given** le streak actuel dépasse le meilleur streak
**When** le streak est mis à jour
**Then** le meilleur streak est mis à jour également
**And** une notification spéciale s'affiche ("Nouveau record !")

---

### Story 3.3: Système de Niveaux

As a **utilisatrice**,
I want **monter de niveau avec mes XP accumulés**,
So that **je vois ma progression à long terme**.

**Acceptance Criteria:**

**Given** l'utilisatrice accumule des XP
**When** son total atteint un palier de niveau
**Then** son niveau augmente
**And** son titre change (Niveau 1: Débutante, Niveau 2: Apprentie, etc.)
**And** une animation de level-up s'affiche

**Given** l'utilisatrice consulte son profil
**When** elle voit ses stats
**Then** son niveau actuel et titre sont affichés
**And** une barre de progression vers le niveau suivant est visible
**And** les XP restants avant le prochain niveau sont indiqués

**Paliers:**
- Niveau 1: 0 XP (Débutante)
- Niveau 2: 100 XP (Apprentie)
- Niveau 3: 300 XP (Résistante)
- Niveau 4: 600 XP (Experte)
- Niveau 5: 1000 XP (Maîtresse)
- Niveau 6+: +500 XP par niveau

---

### Story 3.4: Affichage Gamification Dashboard

As a **utilisatrice**,
I want **voir mes stats de gamification sur le dashboard**,
So that **je suis motivée dès l'ouverture de l'app**.

**Acceptance Criteria:**

**Given** l'utilisatrice ouvre l'app
**When** le dashboard se charge
**Then** elle voit son streak actuel (StreakBadge avec flamme)
**And** elle voit son total XP (XPCounter)
**And** elle voit son niveau et progression (LevelProgress)

**Given** l'utilisatrice a un streak > 0
**When** elle voit le StreakBadge
**Then** la flamme est animée (plus grande si streak > 7 jours)

---

## Epic 4: Coffre & Visualisation des Économies

Aurélie voit ses économies grandir et peut consulter son historique. Le coffre rend tangible ce qui était abstrait.

### Story 4.1: Calculs Financiers

As a **utilisatrice**,
I want **voir mes économies calculées automatiquement**,
So that **je comprends l'impact de mes résistances**.

**Acceptance Criteria:**

**Given** des tentations sont résolues
**When** le système calcule les totaux
**Then** le montant économisé = somme des tentations "resisted"
**And** le montant dépensé = somme des tentations "cracked"
**And** l'économie nette = économisé - dépensé

**Given** une nouvelle tentation est résolue
**When** les totaux sont recalculés
**Then** les valeurs se mettent à jour en temps réel
**And** le CoffreCard reflète les nouveaux montants

---

### Story 4.2: Coffre Visuel

As a **utilisatrice**,
I want **voir un coffre qui se remplit avec mes économies**,
So that **mes économies deviennent tangibles et motivantes**.

**Acceptance Criteria:**

**Given** l'utilisatrice a des économies
**When** elle voit le CoffreCard sur le dashboard
**Then** le montant total économisé est affiché en grand
**And** une barre de progression visuelle montre le remplissage
**And** l'économie nette est visible (économisé - craqué)

**Given** une nouvelle tentation est résistée
**When** l'argent tombe dans le coffre
**Then** une animation de pièces/billets s'affiche
**And** le montant s'incrémente visuellement

**Given** l'utilisatrice a un objectif (ex: 200€)
**When** elle voit la barre de progression
**Then** elle voit le % d'avancement vers son objectif

---

### Story 4.3: Historique des Tentations

As a **utilisatrice**,
I want **consulter l'historique de toutes mes tentations**,
So that **je prends conscience de mes patterns**.

**Acceptance Criteria:**

**Given** l'utilisatrice accède à la page Journal
**When** elle consulte l'historique
**Then** toutes les tentations sont listées (actives, résistées, craquées)
**And** chaque tentation affiche : photo, montant, catégorie, date, statut

**Given** l'utilisatrice filtre par statut
**When** elle sélectionne "Résistées" ou "Craquées"
**Then** seules les tentations correspondantes s'affichent

**Given** l'utilisatrice clique sur une tentation
**When** elle voit les détails
**Then** la photo s'affiche en grand
**And** toutes les informations sont visibles

---

### Story 4.4: Détails Tentation

As a **utilisatrice**,
I want **voir tous les détails d'une tentation passée**,
So that **je me souviens de ce que j'ai résisté ou craqué**.

**Acceptance Criteria:**

**Given** l'utilisatrice sélectionne une tentation dans l'historique
**When** elle ouvre les détails
**Then** elle voit la photo en plein écran
**And** le montant, la catégorie, la date de création
**And** le statut (résisté/craqué) avec date de résolution
**And** les XP gagnés pour cette tentation

---

## Epic 5: Dashboard & Statistiques

Aurélie consulte ses stats et reste motivée. Les messages sont toujours positifs, jamais culpabilisants.

### Story 5.1: Dashboard Principal

As a **utilisatrice**,
I want **voir un dashboard complet à l'ouverture de l'app**,
So that **je suis motivée et informée en un coup d'œil**.

**Acceptance Criteria:**

**Given** l'utilisatrice est connectée
**When** elle ouvre l'app
**Then** le dashboard affiche :
- CoffreCard (économies en hero)
- StreakBadge (streak actuel avec flamme)
- Tentations actives (avec timers)
- Bouton FAB "+" pour nouvelle tentation

**Given** l'utilisatrice a des tentations actives
**When** elle voit le dashboard
**Then** les timers sont visibles et se mettent à jour en temps réel

---

### Story 5.2: Affichage Streaks Dashboard

As a **utilisatrice**,
I want **voir mon streak actuel et mon meilleur streak**,
So that **je suis motivée à battre mon record**.

**Acceptance Criteria:**

**Given** l'utilisatrice consulte ses stats
**When** elle voit la section streaks
**Then** le streak actuel est affiché avec icône flamme
**And** le meilleur streak (record) est visible
**And** si streak actuel = meilleur streak, un badge "Record!" s'affiche

**Given** le streak actuel est 0
**When** elle voit la section streaks
**Then** un message encourageant s'affiche ("Lance-toi !")
**And** le meilleur streak reste visible comme objectif

---

### Story 5.3: Statistiques Mensuelles

As a **utilisatrice**,
I want **voir mes statistiques du mois**,
So that **je comprends ma progression**.

**Acceptance Criteria:**

**Given** l'utilisatrice accède à la page Stats
**When** elle consulte les stats mensuelles
**Then** elle voit :
- Nombre de tentations loggées
- Nombre de tentations résistées
- Nombre de tentations craquées
- Taux de résistance (%)
- Montant économisé ce mois
- Montant dépensé ce mois

**Given** le mois change
**When** les stats sont recalculées
**Then** les données du nouveau mois sont affichées
**And** l'historique des mois précédents reste accessible

---

### Story 5.4: Journal Complet

As a **utilisatrice**,
I want **voir un journal de toutes mes tentations résistées ET craquées**,
So that **je prends conscience des deux côtés sans jugement**.

**Acceptance Criteria:**

**Given** l'utilisatrice accède au Journal
**When** elle consulte la liste
**Then** les tentations sont triées par date (récentes en haut)
**And** chaque entrée montre : photo thumbnail, montant, statut (couleur)
**And** les résistées sont en vert, les craquées en orange (pas rouge)

**Given** l'utilisatrice voit une tentation craquée
**When** elle lit le statut
**Then** le message est positif ("Dépense réfléchie" pas "Échec")

---

### Story 5.5: Messages Positifs

As a **utilisatrice**,
I want **recevoir des messages positifs dans tous les cas**,
So that **je ne ressens jamais de culpabilité**.

**Acceptance Criteria:**

**Given** l'utilisatrice résiste à une tentation
**When** le timer expire
**Then** un message célébratoire s'affiche ("Bravo ! Tu as économisé X€")

**Given** l'utilisatrice marque "J'ai craqué"
**When** elle confirme
**Then** un message positif s'affiche ("Dépense intentionnelle, c'est une victoire")
**And** jamais de message négatif ou culpabilisant

**Given** l'utilisatrice a un taux de résistance > 50%
**When** elle voit ses stats
**Then** un message encourageant s'affiche ("Tu résistes plus que tu ne craques !")

---

## Epic 6: Notifications Push

Aurélie reçoit des notifications même quand l'app est fermée. Le système ferme la boucle du timer 24h.

### Story 6.1: Configuration Push Notifications

As a **utilisatrice**,
I want **activer les notifications push**,
So that **je suis notifiée même quand l'app est fermée**.

**Acceptance Criteria:**

**Given** l'utilisatrice ouvre l'app pour la première fois
**When** elle est invitée à activer les notifications
**Then** une demande de permission s'affiche
**And** si elle accepte, le token push est enregistré dans Supabase

**Given** l'utilisatrice refuse les notifications
**When** elle utilise l'app
**Then** les notifications in-app fonctionnent toujours
**And** elle peut réactiver les push plus tard dans les paramètres

**Given** le navigateur ne supporte pas Web Push (Safari < 16.4)
**When** l'app détecte l'incompatibilité
**Then** un message explique la limitation
**And** les notifications in-app sont utilisées en fallback

---

### Story 6.2: Notification Timer Expiré

As a **utilisatrice**,
I want **recevoir une notification quand mon timer 24h expire**,
So that **je célèbre ma résistance même sans ouvrir l'app**.

**Acceptance Criteria:**

**Given** une tentation a un timer actif
**When** le timer de 24h expire
**Then** une notification push est envoyée : "Bravo ! Tu as économisé X€"
**And** la notification contient le montant de la tentation
**And** cliquer sur la notification ouvre l'app sur le dashboard

**Given** l'utilisatrice a plusieurs timers qui expirent
**When** chaque timer expire
**Then** chaque notification est envoyée individuellement
**And** les notifications ne sont pas groupées (chaque victoire compte)

---

### Story 6.3: Notification Rappel 1h Avant

As a **utilisatrice**,
I want **recevoir un rappel 1h avant l'expiration du timer**,
So that **je peux décider consciemment si je veux craquer**.

**Acceptance Criteria:**

**Given** une tentation a un timer actif
**When** il reste 1h avant expiration
**Then** une notification push est envoyée : "Ta tentation de X€ expire dans 1 heure"
**And** la notification permet d'ouvrir l'app pour voir la tentation

**Given** l'utilisatrice a craqué avant le rappel
**When** l'heure du rappel arrive
**Then** aucune notification n'est envoyée (tentation déjà résolue)

---

### Story 6.4: Backend Push avec Supabase Edge Functions

As a **système**,
I want **envoyer des notifications push via Supabase Edge Functions**,
So that **les notifications sont fiables même app fermée**.

**Acceptance Criteria:**

**Given** un timer expire côté serveur
**When** Supabase détecte l'expiration (pg_cron ou Edge Function scheduled)
**Then** l'Edge Function `send-push` est appelée
**And** la notification est envoyée via Web Push API
**And** la tentation est marquée "resisted" automatiquement

**Given** l'utilisatrice n'a pas de token push valide
**When** le système tente d'envoyer
**Then** l'erreur est loggée silencieusement
**And** la résolution automatique se fait quand même

---

## Epic 7: PWA & Mode Offline

Aurélie peut utiliser l'app partout, même sans connexion. L'app fonctionne toujours.

### Story 7.1: Configuration PWA & Installation

As a **utilisatrice**,
I want **installer l'app sur mon écran d'accueil**,
So that **j'y accède comme une vraie app mobile**.

**Acceptance Criteria:**

**Given** l'utilisatrice visite l'app sur mobile
**When** le navigateur détecte les critères PWA
**Then** une bannière "Ajouter à l'écran d'accueil" s'affiche
**And** le manifest.json est correctement configuré (nom, icônes, couleurs)

**Given** l'utilisatrice installe l'app
**When** elle l'ouvre depuis l'écran d'accueil
**Then** l'app s'ouvre en mode standalone (sans barre navigateur)
**And** le splash screen s'affiche avec le logo GestionAchat
**And** l'expérience est identique à une app native

**Given** l'app est installée
**When** elle reçoit une mise à jour
**Then** le service worker se met à jour automatiquement
**And** l'utilisatrice voit les nouvelles fonctionnalités au prochain lancement

---

### Story 7.2: Cache Offline Assets

As a **utilisatrice**,
I want **que l'app se charge même sans connexion**,
So that **je peux toujours y accéder**.

**Acceptance Criteria:**

**Given** l'utilisatrice a déjà ouvert l'app une fois
**When** elle l'ouvre sans connexion internet
**Then** l'app se charge normalement (shell + assets en cache)
**And** le service worker (Workbox) sert les fichiers depuis le cache

**Given** les assets sont en cache
**When** l'utilisatrice navigue dans l'app
**Then** les pages se chargent instantanément
**And** les images/icônes s'affichent correctement

---

### Story 7.3: Mode Offline - Consultation

As a **utilisatrice**,
I want **consulter mes données en mode offline**,
So that **je vois mes stats même sans connexion**.

**Acceptance Criteria:**

**Given** l'utilisatrice est offline
**When** elle consulte le dashboard
**Then** ses données locales (Zustand + IndexedDB) sont affichées
**And** les tentations, XP, streaks sont visibles
**And** un indicateur discret montre le mode offline

**Given** l'utilisatrice est offline
**When** elle consulte l'historique
**Then** les tentations en cache sont affichées
**And** les photos précédemment chargées sont visibles

---

### Story 7.4: Mode Offline - Actions en Attente

As a **utilisatrice**,
I want **logger une tentation même sans connexion**,
So that **je ne manque jamais une opportunité de résister**.

**Acceptance Criteria:**

**Given** l'utilisatrice est offline
**When** elle logge une nouvelle tentation
**Then** la tentation est créée localement (IndexedDB)
**And** elle est marquée comme "en attente de sync"
**And** le timer 24h démarre quand même

**Given** l'utilisatrice est offline
**When** elle marque "J'ai craqué"
**Then** l'action est enregistrée localement
**And** elle est mise en queue pour sync ultérieure

---

### Story 7.5: Synchronisation Automatique

As a **utilisatrice**,
I want **que mes actions offline se synchronisent automatiquement**,
So that **je n'ai pas à m'en préoccuper**.

**Acceptance Criteria:**

**Given** l'utilisatrice a des actions en attente
**When** la connexion revient
**Then** TanStack Query synchronise automatiquement avec Supabase
**And** les tentations sont créées en base
**And** les photos sont uploadées
**And** un toast confirme la synchronisation

**Given** un conflit de sync existe (rare, mono-user)
**When** le système détecte le conflit
**Then** la version serveur gagne (server wins)
**And** l'utilisatrice est notifiée si des données ont changé

**Given** la sync échoue (erreur serveur)
**When** l'utilisatrice est notifiée
**Then** les actions restent en queue
**And** un retry automatique est programmé

