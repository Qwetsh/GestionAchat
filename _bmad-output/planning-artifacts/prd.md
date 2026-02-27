---
stepsCompleted: [step-01-init, step-02-discovery, step-02b-vision, step-02c-executive-summary, step-03-success, step-04-journeys, step-05-domain-skipped, step-06-innovation, step-07-project-type, step-08-scoping, step-09-functional, step-10-nonfunctional, step-11-polish, step-12-complete]
status: complete
inputDocuments:
  - product-brief-GestionAchat-2026-02-26.md
  - domain-psychologie-achats-impulsifs-gamification-research-2026-02-27.md
workflowType: 'prd'
documentCounts:
  briefs: 1
  research: 1
  projectDocs: 0
classification:
  projectType: web_app_pwa
  domain: personal_finance_behavioral_change
  complexity: medium
  projectContext: greenfield
date: 2026-02-27
---

# Product Requirements Document - GestionAchat

**Author:** Thomas
**Date:** 2026-02-27

## Executive Summary

GestionAchat est une webapp gamifiée (PWA) conçue pour transformer le comportement d'achat impulsif en habitude d'épargne consciente. L'application cible spécifiquement Aurélie, 40 ans, enseignante, dont les achats impulsifs récurrents (10-60€, plusieurs fois par semaine) grignotent silencieusement 250-300€/mois.

**Le problème profond :** Les achats impulsifs ne sont pas un problème de budget mais de circuit de récompense. Le shopping compense un besoin de dopamine, pas un besoin matériel. Les apps de budget existantes échouent car elles attaquent le symptôme (les chiffres) sans offrir de substitut au besoin émotionnel.

**La solution :** Intervenir au moment critique de la tentation avec un timer de refroidissement de 24h — scientifiquement validé pour laisser le pic de dopamine retomber et permettre au cortex préfrontal de reprendre le contrôle. Chaque tentation résistée alimente un système de gamification (XP, streaks, niveaux) et un coffre visuel des économies. L'app remplace le circuit toxique (achat → regret) par un circuit sain (résistance → récompense → fierté).

**Philosophie :** Zéro culpabilité. L'objectif n'est pas l'abstinence mais la dépense intentionnelle — se faire plaisir en conscience plutôt que par impulsion.

### What Makes This Special

| Différenciateur | Impact |
|---|---|
| **Timer 24h au moment de la tentation** | Intervention temps réel, pas après coup. Aucun concurrent ne l'implémente comme mécanisme central |
| **Gamification comme substitut dopaminergique** | Le même plaisir que le shopping, sans l'achat. Streaks = +48% engagement (données recherche) |
| **Coffre visuel des économies** | Rend tangible ce qui était abstrait. Chaque tentation résistée = argent visible qui s'accumule |
| **Bouton "J'ai craqué"** | Pas de jugement. Logger un craquage reste positif (conscience > déni) |
| **Émotion double couche** | Court terme = plaisir instantané (XP, animations). Moyen terme = accomplissement (niveaux, coffre qui grossit) |

**Core insight :** Le plaisir du shopping vient du processus (chercher, choisir, cliquer), pas de la possession. GestionAchat capture ce processus (photo, log, timer, récompense) sans l'achat réel.

## Project Classification

| Critère | Valeur |
|---|---|
| **Type de projet** | Web App (PWA) — Single-page app, mobile-first, installable |
| **Domaine** | Personal Finance / Behavioral Change |
| **Complexité** | Moyenne — Pas de réglementation stricte, mais gamification équilibrée = design non trivial |
| **Contexte** | Greenfield — Nouveau projet from scratch |
| **Stack** | React + TypeScript + Tailwind CSS v4 + Supabase + Vercel |
| **Utilisatrice** | Mono-utilisateur (Aurélie) |

## Success Criteria

### User Success

**Le moment "aha!" d'Aurélie :**
> Après ~2 semaines, elle voit son coffre virtuel se remplir, réalise "avec cet argent je pourrais m'offrir [quelque chose de vraiment voulu]", et son compte ne plonge plus dans le rouge en fin de mois.

**Critères mesurables :**

| Métrique | Cible Mois 1 | Cible Mois 2 | Signal de succès |
|---|---|---|---|
| **Taux de résistance** | > 50% | > 70% | Elle résiste plus qu'elle ne craque |
| **Engagement quotidien** | 5+ jours/semaine | 5+ jours/semaine | Le réflexe "ouvrir l'app" est installé |
| **Tentations loggées** | 3-5/semaine | Stable ou baisse | Elle utilise l'app au moment de la tentation |
| **Streaks** | Premier streak 7 jours | Streaks réguliers | La gamification fonctionne |

**Succès émotionnel :**
- Court terme : Plaisir instantané quand elle gagne des XP
- Moyen terme : Fierté en voyant le coffre grossir
- Jamais : Culpabilité (même quand elle craque)

### Business Success

*Pas de modèle commercial — projet personnel. Le succès se mesure à l'impact réel sur la vie d'Aurélie.*

| Horizon | Indicateur de succès |
|---|---|
| **1 mois** | Le réflexe "j'ouvre l'app avant d'acheter" est en place. Premiers streaks visibles |
| **2 mois** | Économies constatables. Le Livret Bleu se renfloue. Le compte ne passe plus dans le rouge |
| **6 mois** | Comportement durablement modifié. Les achats plaisir sont intentionnels et budgétés |

**Signal ultime de succès :** Aurélie recommande l'app à quelqu'un d'autre.

### Technical Success

| Critère | Cible |
|---|---|
| **Performance** | Chargement < 3 secondes sur mobile |
| **Disponibilité** | App fonctionnelle offline (PWA avec service worker) |
| **Fiabilité** | Aucune perte de données (tentations, XP, streaks) |
| **UX** | Log d'une tentation en < 30 secondes (photo + montant) |

### Measurable Outcomes

**Signaux que l'app fonctionne :**
- ✅ Connexion quasi quotidienne
- ✅ Tentations loggées régulièrement
- ✅ Streaks qui s'allongent
- ✅ Solde bancaire fin de mois en amélioration

**Signaux que l'app échoue :**
- ❌ Aurélie ne se connecte plus (perte d'attraction)
- ❌ Elle achète sans logger (réflexe pas installé)
- ❌ Pas d'amélioration du solde après 2 mois

## Product Scope

### MVP - Minimum Viable Product

**Must have pour prouver le concept :**

1. **Système de Tentation**
   - Photo (appareil ou galerie) + montant + catégorie
   - Timer 24h automatique
   - Bouton "J'ai craqué" pendant le timer
   - Résolution après 24h (résisté automatiquement si pas craqué)

2. **Gamification Core**
   - Streaks (jours consécutifs sans craquer)
   - XP (points pour chaque résistance)
   - Niveaux (progression par paliers d'XP)

3. **Coffre Visuel**
   - Montant total économisé (somme des tentations résistées)
   - Barre de progression visuelle

4. **Dashboard Stats**
   - Streak en cours + meilleur streak
   - Stats mensuelles basiques
   - **Journal résisté + craqué** (les deux côtés pour prise de conscience)
   - **Économie nette** calculée (résisté - craqué)

5. **Auth Simple**
   - Code d'accès personnel (pas d'inscription email)

6. **Notifications Push**
   - Notification quand le timer 24h expire : "Bravo ! Tu as économisé X€ 🎉"
   - Rappel 1h avant expiration : "Ta tentation de X€ expire dans 1 heure"

### Growth Features (Post-MVP)

- Badges et accomplissements
- Projection "Et si..." (ce qu'elle pourrait s'offrir)
- Budget plaisir mensuel configurable
- Catégories avec stats par catégorie
- Journal/galerie des tentations
- **Budget récompense** (10€ pour 100€ économisés)

### Vision (Future)

- Multi-utilisateurs avec inscription
- Mode duo / défis partagés
- Connexion bancaire automatique
- Insights IA sur les patterns
- **Extension navigateur Chrome/Firefox** — Détection des sites de shopping, proposition de logger avant achat

## User Journeys

### Journey 1 : La Tentation du Soir — Happy Path 🌙

**Persona :** Aurélie, 40 ans, enseignante de Français

**Opening Scene :**
Il est 21h30, un mardi soir. Aurélie est allongée sur son canapé après une journée difficile au collège — un élève turbulent, une réunion interminable. Elle scrolle Instagram pour décompresser. Une pub apparaît : un set de feutres aquarelle "édition limitée" à 34€. Son cœur s'accélère. "Ils sont magnifiques. Et c'est limité..."

**Rising Action :**
Son doigt hésite au-dessus du bouton "Acheter". Mais cette fois, un réflexe différent s'active. Elle ouvre GestionAchat. En 15 secondes : photo du produit, montant (34€), catégorie "Feutres/Coloriage". Le timer 24h démarre. Une animation satisfaisante : "+15 XP". Son streak de 4 jours clignote.

**Climax :**
Le lendemain soir, 21h30. Une notification douce : "Ta tentation de 34€ expire dans 1 heure. Tu veux toujours ces feutres ?" Elle y repense... et réalise qu'elle a déjà 3 sets de feutres à peine utilisés. Elle laisse le timer expirer.

**Resolution :**
**Tentation résistée !** 🎉 Animation de célébration. +50 XP bonus. 34€ tombent dans son coffre virtuel. Son streak passe à 5 jours. Le coffre affiche maintenant 127€ économisés ce mois-ci. Elle sourit. "Avec ça, je pourrais m'offrir un vrai massage..."

---

### Journey 2 : Le Craquage Sans Culpabilité 💔→💪

**Persona :** Aurélie, même contexte

**Opening Scene :**
Samedi après-midi, centre commercial. Elle accompagne une amie. Devant la vitrine d'une librairie : un coffret collector de son auteure préférée. 45€. Elle l'a déjà vu en ligne mais ne l'a jamais acheté.

**Rising Action :**
Elle ouvre GestionAchat. Photo, 45€, catégorie "Livres". Timer 24h lancé. Mais cette fois, c'est différent. Ce livre, elle le veut vraiment. Pas pour le rush, pour le contenu.

3 heures plus tard, elle y pense encore. Elle ouvre l'app et voit le bouton "J'ai craqué". Elle hésite. Mais elle se rappelle : zéro culpabilité.

**Climax :**
Elle appuie sur "J'ai craqué". Pas de message négatif. Juste : "Dépense intentionnelle : 45€. Tu as pris le temps d'y réfléchir — c'est déjà une victoire. 🌟" Elle reçoit quand même +5 XP pour avoir loggé la tentation.

**Resolution :**
Elle achète le coffret. Pas de regret cette fois — elle l'a vraiment voulu. Son streak repart à zéro, mais l'app lui montre : "Tu as résisté à 6 tentations sur 7 cette semaine. C'est excellent." Elle réalise que ce n'est pas un échec, c'est un choix.

---

### Journey 3 : Premier Jour — Onboarding ✨

**Persona :** Aurélie, jour 1 avec l'app

**Opening Scene :**
Thomas vient de lui installer GestionAchat sur son téléphone. "C'est une app que j'ai faite pour toi. Essaie-la la prochaine fois que tu as envie d'acheter un truc."

**Rising Action :**
Premier lancement. Écran d'accueil élégant et chaleureux. Pas de formulaire d'inscription interminable. Juste : "Entre ton code secret" (4 chiffres). C'est fait.

Une courte animation lui explique le concept : "Photographie tes tentations. Attends 24h. Gagne des récompenses. Vois tes économies grandir."

**Climax :**
Le soir même, elle scrolle Sephora. Une palette de maquillage à 29€. Elle se souvient de l'app. Elle l'ouvre. Photo, 29€, "Cosmétique". Le timer démarre. "+15 XP - Première tentation loggée ! 🎉" Badge débloqué : "Débutante".

**Resolution :**
Le lendemain, elle a résisté. Premier streak. Premier argent dans le coffre. Elle comprend le mécanisme. "C'est... presque addictif ? Mais dans le bon sens."

---

### Journey 4 : Le Check Quotidien — Dashboard 📊

**Persona :** Aurélie, semaine 3

**Opening Scene :**
Dimanche matin, café en main. Elle ouvre GestionAchat non pas pour logger une tentation, mais pour voir ses stats.

**Rising Action :**
Dashboard : Streak actuel 12 jours 🔥. Niveau 4 "Résistante". Journal complet : **8 tentations** dont 6 résistées (203€) et 2 craquées (63€). **Économie nette : 140€**. Le rouge à lèvres craqué il y a 2 semaines ? Elle ne l'a toujours pas utilisé. Ça la fait réfléchir.

**Climax :**
Elle clique sur "Et si..." : "Avec 140€, tu pourrais t'offrir : un massage duo (89€), ou un resto gastronomique (80€)." Elle sourit.

**Resolution :**
Elle décide de se récompenser : "À 200€ d'économie nette, je m'offre le massage." C'est son premier objectif tangible. Elle ferme l'app motivée pour la semaine.

---

### Journey Requirements Summary

| Journey | Capabilities Requises |
|---|---|
| **Tentation Happy Path** | Log photo/montant/catégorie, Timer 24h, XP, Streak, Coffre, Notifications |
| **Craquage Sans Culpabilité** | Bouton "J'ai craqué", Messages positifs, XP partiel, Stats de perspective |
| **Onboarding** | Auth code simple, Tutoriel léger, Premier badge, Feedback immédiat |
| **Dashboard** | Stats visuelles, Journal résisté + craqué, Économie nette, Taux calcul, Projections "Et si..." |

## Innovation & Novel Patterns

### Detected Innovation Areas

GestionAchat n'est pas une innovation technologique disruptive, mais une **innovation de design comportemental** — une combinaison originale de concepts validés scientifiquement, packagée de manière unique.

| Innovation | Type | Impact |
|---|---|---|
| **Timer 24h comme mécanisme central** | Design Pattern | Aucun concurrent ne l'implémente — basé sur la neuroscience de la dopamine |
| **Substitution dopaminergique** | Behavioral Design | Remplacer le plaisir du shopping par le plaisir du jeu — validé mais peu exploité |
| **Combinaison triple** | Product Design | Intervention temps réel + Gamification complète + Coffre visuel — unique sur le marché |
| **Philosophie zéro culpabilité** | UX Philosophy | Approche opposée aux apps de budget qui culpabilisent |
| **Photo comme rituel** | Interaction Design | Capturer le plaisir du processus (rechercher, choisir) sans l'achat réel |

### Market Context & Competitive Landscape

**Position unique :** Aucune app existante ne combine ces 3 éléments :
1. Intervention au moment de la tentation (pas après coup)
2. Gamification complète comme substitut émotionnel
3. Visualisation tangible des économies

**Concurrents les plus proches :**
- Stop Impulse Buying : Streaks mais pas de timer 24h ni gamification riche
- Skip-It Savings : Coffre virtuel mais pas de gamification
- Habitica : Gamification mais pas ciblée achats impulsifs

### Validation Approach

| Hypothèse | Méthode de validation | Critère de succès |
|---|---|---|
| Timer 24h efficace | Usage réel pendant 2 mois | Taux résistance > 50% |
| Gamification engage | Rétention et streaks | Connexion 5+ jours/semaine |
| Coffre visuel motive | Feedback Aurélie | "Ça rend les économies réelles" |
| Zéro culpabilité fonctionne | Absence d'abandon | Usage maintenu même après craquages |

## PWA Requirements

### Browser Support

| Navigateur | Priorité | Support requis |
|---|---|---|
| **Chrome Mobile** | Critique | Full PWA (install, offline, push) |
| **Chrome Desktop** | Important | PWA complet |
| **Safari Mobile** | Secondaire | Fonctionnel (PWA limité) |
| **Firefox** | Secondaire | Fonctionnel |

### PWA Capabilities

| Capability | MVP | Implémentation |
|---|---|---|
| **Installable** | ✅ | Web App Manifest, icônes, splash screen |
| **Offline** | ✅ | Service Worker avec cache des données critiques |
| **Push Notifications** | ✅ | Timer 24h expiré, rappel 1h avant |

### Push Notification Triggers

| Trigger | Message | Timing |
|---|---|---|
| **Timer expiré** | "Bravo ! Tu as économisé X€ 🎉" | Immédiat après 24h |
| **Rappel expiration** | "Ta tentation de X€ expire dans 1 heure" | 1h avant fin timer |

### Performance Targets

*Voir section Non-Functional Requirements (NFR1-NFR5) pour les cibles de performance détaillées.*

**Cible Lighthouse PWA Score:** > 90

### Design Approach

- **Mobile-first** : Conçu pour usage principal sur smartphone
- **Clean & Engaging** : Interface épurée qui donne envie de se connecter
- **Animations subtiles** : Feedback satisfaisant sur les actions (XP, résistance)
- **Accessibility** : Contraste suffisant, tailles tactiles correctes

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Problem-Solving MVP — Résoudre UN problème (achats impulsifs) de manière focused, avec feedback gratifiant immédiat.

**Resource Requirements:** 1 développeur (Thomas), stack moderne (React + Supabase + Vercel), ~2 mois pour MVP fonctionnel.

### MVP Feature Set (Phase 1)

**Core User Journeys Supported:**
- Tentation du soir (happy path complet)
- Craquage sans culpabilité (dépense intentionnelle)
- Onboarding premier jour (prise en main immédiate)
- Check quotidien dashboard (motivation continue)

**Must-Have Capabilities:**

| Feature | Justification |
|---|---|
| Log tentation (photo + montant + catégorie) | Core du concept — capture le moment de tentation |
| Timer 24h automatique | Mécanisme central validé scientifiquement |
| Bouton "J'ai craqué" | Philosophie zéro culpabilité |
| XP + Streaks + Niveaux | Substitut dopaminergique — engagement |
| Coffre visuel + barre progression | Rend les économies tangibles |
| Journal résisté + craqué | Prise de conscience des deux côtés |
| Économie nette calculée | Métrique clé de succès |
| Push notifications | Ferme la boucle du timer 24h |
| Auth code simple | Accès rapide sans friction |
| PWA (install + offline) | Usage mobile fiable |

### Post-MVP Features

**Phase 2 (Growth):**
- Badges et accomplissements
- Projection "Et si..." (suggestions concrètes d'achat avec économies)
- Budget plaisir mensuel configurable
- Stats détaillées par catégorie
- Galerie visuelle des tentations
- Budget récompense (10€ bonus pour 100€ économisés)

**Phase 3 (Vision):**
- Multi-utilisateurs avec inscription
- Mode duo / défis partagés
- Extension navigateur Chrome/Firefox
- Connexion bancaire automatique
- Insights IA sur les patterns de dépense

### Risk Mitigation Strategy

| Type | Risque | Probabilité | Mitigation |
|---|---|---|---|
| **Technique** | Push notifications iOS limitées | Moyenne | Chrome prioritaire, Safari best-effort |
| **Technique** | Service Worker complexité | Faible | Vite PWA plugin éprouvé |
| **Adoption** | Réflexe "ouvrir l'app" ne s'installe pas | Moyenne | Onboarding engageant, rewards immédiats, notifications |
| **Engagement** | Gamification devient lassante | Faible | Variété (badges, niveaux), progression visible |
| **Ressources** | Développeur solo, temps limité | Moyenne | MVP lean, scope serré, pas de over-engineering |

**Contingency:** Si les ressources sont plus limitées que prévu, le MVP peut être réduit à : Timer 24h + XP/Streaks + Coffre (sans badges ni projections).

## Functional Requirements

### Gestion des Tentations

- **FR1:** L'utilisatrice peut logger une tentation en prenant ou sélectionnant une photo
- **FR2:** L'utilisatrice peut saisir le montant d'une tentation
- **FR3:** L'utilisatrice peut sélectionner une catégorie pour la tentation
- **FR4:** Le système démarre automatiquement un timer 24h quand une tentation est loggée
- **FR5:** L'utilisatrice peut voir le temps restant sur les timers actifs
- **FR6:** L'utilisatrice peut marquer une tentation active comme "J'ai craqué" avant expiration
- **FR7:** Le système marque automatiquement une tentation comme "résistée" à l'expiration du timer
- **FR8:** L'utilisatrice peut consulter l'historique de toutes ses tentations passées
- **FR9:** L'utilisatrice peut voir la photo, le montant, la catégorie et le statut de chaque tentation

### Système de Gamification

- **FR10:** Le système attribue des XP quand l'utilisatrice logge une tentation
- **FR11:** Le système attribue des XP bonus quand l'utilisatrice résiste à une tentation
- **FR12:** Le système attribue des XP partiels quand l'utilisatrice marque "J'ai craqué"
- **FR13:** Le système suit le streak actuel (jours consécutifs sans craquer)
- **FR14:** Le système conserve le meilleur streak jamais atteint
- **FR15:** L'utilisatrice peut voir son total d'XP
- **FR16:** Le système calcule le niveau basé sur des paliers d'XP
- **FR17:** L'utilisatrice peut voir son niveau actuel et son titre
- **FR18:** L'utilisatrice peut voir sa progression vers le niveau suivant

### Coffre & Suivi Financier

- **FR19:** Le système calcule le montant total économisé (somme des tentations résistées)
- **FR20:** Le système calcule le montant total dépensé (somme des tentations craquées)
- **FR21:** Le système calcule l'économie nette (économisé - dépensé)
- **FR22:** L'utilisatrice peut voir une représentation visuelle de ses économies (coffre)
- **FR23:** L'utilisatrice peut voir une barre de progression

### Dashboard & Statistiques

- **FR24:** L'utilisatrice peut voir son streak actuel sur le dashboard
- **FR25:** L'utilisatrice peut voir son meilleur streak sur le dashboard
- **FR26:** L'utilisatrice peut voir des statistiques mensuelles (tentations, taux, montants)
- **FR27:** L'utilisatrice peut voir un journal des tentations résistées ET craquées
- **FR28:** Le système affiche des messages positifs et encourageants dans tous les cas

### Compte Utilisateur

- **FR29:** L'utilisatrice peut créer un compte avec un code personnel (sans email)
- **FR30:** L'utilisatrice peut accéder à l'app en entrant son code personnel
- **FR31:** Les données de l'utilisatrice persistent entre les sessions

### Notifications Push

- **FR32:** Le système envoie une notification push quand un timer 24h expire (célébration)
- **FR33:** Le système envoie une notification push 1h avant l'expiration (rappel)
- **FR34:** L'utilisatrice peut recevoir des notifications même quand l'app est fermée

### PWA & Offline

- **FR35:** L'utilisatrice peut installer l'app sur l'écran d'accueil de son mobile
- **FR36:** L'utilisatrice peut accéder aux fonctions core en mode offline
- **FR37:** Le système synchronise les actions offline quand la connexion est rétablie

## Non-Functional Requirements

### Performance

- **NFR1:** Temps de chargement initial < 3 secondes sur connexion 4G
- **NFR2:** First Contentful Paint < 1.5 secondes
- **NFR3:** Temps de log d'une tentation < 30 secondes (photo + montant)
- **NFR4:** Animations gamification à 60 FPS sans lag perceptible
- **NFR5:** Taille du bundle < 500KB gzipped

### Fiabilité

- **NFR6:** Disponibilité 99% (hors maintenance planifiée)
- **NFR7:** Zéro perte de données — aucune tentation, XP ou streak ne doit être perdu
- **NFR8:** Fonctionnement offline pour les core features (consultation, log en attente)
- **NFR9:** Synchronisation automatique dès retour de connexion
- **NFR10:** Données persistées côté serveur (Supabase) pour backup

### Sécurité

- **NFR11:** Authentification par code personnel (minimum 4 chiffres)
- **NFR12:** Toutes les communications via HTTPS
- **NFR13:** Données au repos chiffrées (standard Supabase)
- **NFR14:** Photos stockées en privé, non accessibles publiquement

### Accessibilité

- **NFR15:** Ratio de contraste minimum 4.5:1 pour le texte
- **NFR16:** Zones tactiles minimum 44x44px pour tous les boutons
- **NFR17:** Tous les champs de formulaire ont un label accessible

