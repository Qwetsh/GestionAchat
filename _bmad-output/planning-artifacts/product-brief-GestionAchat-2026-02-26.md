---
stepsCompleted: [1, 2, 3, 4, 5, 6]
status: complete
inputDocuments: []
date: 2026-02-26
author: Thomas
---

# Product Brief: GestionAchat

<!-- Content will be appended sequentially through collaborative workflow steps -->

## Executive Summary

GestionAchat est une webapp gamifiée conçue pour aider les personnes sujettes aux achats impulsifs à reprendre le contrôle de leurs dépenses — sans frustration ni culpabilité. L'application remplace le circuit de récompense de l'achat compulsif par une expérience engageante et addictive : photographier ses tentations, résister via un timer, accumuler des streaks et voir concrètement l'argent économisé. L'objectif n'est pas l'abstinence mais la dépense intentionnelle — se faire plaisir en conscience plutôt que par impulsion.

---

## Core Vision

### Problem Statement

Les achats impulsifs de faible montant (10-60€), répétés plusieurs fois par semaine, s'accumulent silencieusement jusqu'à représenter 250-300€/mois. L'acheteur impulsif, poussé par un biais de rareté ("si je ne l'achète pas maintenant, je ne l'aurai plus jamais"), regrette rapidement mais ne parvient pas à modifier son comportement car les conséquences financières restent abstraites jusqu'au relevé de compte.

### Problem Impact

- Découvert bancaire récurrent et nécessité de piocher dans l'épargne (Livret Bleu)
- Cycle de culpabilité et frustration qui n'empêche pas la récidive
- Environ 3 000€+ par an de dépenses non planifiées
- Stress financier et sentiment de perte de contrôle

### Why Existing Solutions Fall Short

Les applications de budget existantes (Bankin', Linxo, YNAB) sont conçues pour le suivi comptable, pas pour le changement comportemental. Leur interface austère et leur approche culpabilisante ne créent aucun engagement chez les profils impulsifs. Elles demandent de la discipline sans offrir de récompense — exactement le contraire de ce dont un acheteur impulsif a besoin. Aucune solution ne cible spécifiquement le moment de tentation avec un mécanisme d'intervention en temps réel.

### Proposed Solution

Une webapp qui intervient au **moment critique de la tentation** avec un rituel engageant : photo de l'objet désiré, saisie du montant, activation d'un timer de refroidissement 24h. Chaque tentation résistée alimente un système de gamification (XP, streaks, niveaux, badges) et un coffre visuel montrant l'argent économisé. Un journal visuel des tentations (résistées ou craquées) permet à l'utilisatrice d'expérimenter concrètement son parcours — essentiel pour un profil qui apprend par l'expérience vécue.

### Key Differentiators

- **Substitution addictive** : Remplace le dopamine de l'achat par celui du jeu et de la progression
- **Intervention en temps réel** : Agit au moment de la tentation, pas après
- **Approche visuelle et expérientielle** : Photos, jauges, galerie — conçu pour quelqu'un qui a besoin de voir et ressentir pour intégrer
- **Zéro culpabilité** : Autorise les dépenses plaisir intentionnelles, combat uniquement l'impulsivité
- **Simplicité d'usage** : Log rapide (photo + montant) sans la complexité d'une app de budget complète

## Target Users

### Primary Users

**Persona : Aurélie, 40 ans — Enseignante de Français**

- **Revenus** : ~2 200€/mois
- **Situation** : Salaire correct mais achats impulsifs récurrents qui grignotent le budget et entament l'épargne (Livret Bleu)
- **Contexte d'achat** : Principalement le soir, seule, en scrollant sur son téléphone. Aussi en magasin de manière opportuniste. Catégories : cosmétique, livres de coloriage, feutres, livres
- **Profil psychologique** : Le shopping est un exutoire après la journée de travail. Chaque achat semble raisonnable isolément ("c'est que 15€"). Le FOMO ("si je ne l'achète pas maintenant...") court-circuite la réflexion. Apprend par l'expérience vécue — les chiffres abstraits ne suffisent pas
- **Workarounds actuels** : Se dit mentalement "il faut que j'évite ce magasin", aucune app ni outil de suivi — rien d'assez attrayant ou engageant pour accrocher
- **Vision du succès** : Voir sa barre de progression monter, accumuler de l'XP, réaliser concrètement "avec cet argent j'aurais pu m'offrir [quelque chose de plus important]". En fin de mois, constater que le compte ne plonge plus dans le rouge

**Modes d'utilisation :**
- **Mode tentation (actif)** : Ouvre l'app au moment de l'envie → photo + montant → timer 24h → résiste ou craque
- **Mode tableau de bord (consultatif)** : Check quotidien pour voir stats, streaks, XP, argent économisé, progression

### Secondary Users

N/A — Application mono-utilisatrice. Le développeur (Thomas) gère la partie technique mais n'est pas utilisateur de l'app.

### User Journey

1. **Découverte** : Thomas lui installe et présente l'app. Pas d'inscription — simple code d'accès personnel
2. **Onboarding** : Prise en main rapide, l'app doit être intuitive et visuellement séduisante dès la première ouverture
3. **Premier usage** : Le soir, en scrollant, elle tombe sur un produit tentant → ouvre l'app → photo + montant → le timer se lance, premiers XP gagnés
4. **Moment "aha!"** : Après ~2 semaines, elle voit la barre de progression, l'argent économisé s'accumule, et la projection "avec ça tu pourrais t'offrir..." rend les économies tangibles
5. **Routine installée** : Check matinal ou en soirée des stats (streaks, niveaux, coffre). Au moment des tentations, le réflexe "j'ouvre l'app" remplace le réflexe "j'achète". En fin de mois, le compte reste positif — la preuve ultime

## Success Metrics

### Métriques de Succès Utilisateur

| Métrique | Indicateur | Cible |
|---|---|---|
| **Économies mensuelles** | Montant total des tentations résistées par mois | Tendance positive mois après mois, argent qui revient sur le Livret Bleu |
| **Taux de résistance** | % de tentations loggées où elle résiste (après timer 24h) | > 50% le premier mois, progression vers 70%+ |
| **Réduction des impulsifs** | Nombre d'achats impulsifs non loggés (achat direct sans passer par l'app) | Diminution progressive — signe que le réflexe "ouvrir l'app" s'installe |
| **Engagement quotidien** | Nombre de jours par semaine où elle ouvre l'app | 5+ jours/semaine (tentation ou consultation stats) |

### Business Objectives

Pas de modèle commercial — projet personnel. Les objectifs se mesurent à l'impact réel sur la vie d'Aurélie :

- **À 1 mois** : Le réflexe "j'ouvre l'app avant d'acheter" est en place, premiers streaks visibles
- **À 2 mois** (horizon de validation) : Économies constatables, le Livret Bleu se renfloue, le compte ne passe plus dans le rouge en fin de mois
- **À 6 mois** : Le comportement est durablement modifié, les achats plaisir sont intentionnels et budgétés

### Key Performance Indicators

**Signaux de succès (l'app fonctionne) :**
- Connexion quasi quotidienne
- Tentations loggées régulièrement (photo + montant)
- Streaks qui s'allongent au fil des semaines
- Solde bancaire en fin de mois en amélioration

**Signaux d'échec (l'app ne fonctionne pas) :**
- Aurélie ne se connecte plus → l'app a perdu son pouvoir d'attraction
- Elle achète directement sans logger la tentation → le réflexe ne s'est pas installé
- Pas d'amélioration du solde après 2 mois → la gamification ne suffit pas à modifier le comportement

## MVP Scope

### Core Features

**1. Système de Tentation**
- Logger une tentation : photo (appareil ou galerie) + montant + catégorie (cosmétique, livres, feutres/coloriage, autre)
- Timer de refroidissement 24h automatique après chaque log
- Résolution : après 24h, marquer comme "résisté" ou "craqué"
- Galerie/journal visuel de toutes les tentations avec leur statut

**2. Gamification Complète**
- **Streaks** : compteur de jours consécutifs sans craquer
- **XP** : points gagnés pour chaque tentation résistée, bonus pour les streaks
- **Niveaux** : progression par paliers d'XP avec titres/rangs
- **Badges** : récompenses pour les accomplissements (premier streak de 7 jours, 100€ économisés, etc.)

**3. Tableau de Bord / Stats**
- Coffre visuel : montant total économisé (tentations résistées) avec barre de progression
- Projection "Et si..." : suggestions concrètes de ce qu'elle pourrait s'offrir avec l'argent économisé
- Stats mensuelles : nombre de tentations, taux de résistance, montant économisé vs dépensé
- Streak en cours et meilleur streak

**4. Budget Mensuel**
- Budget "plaisir" de base fixe configurable
- Barre de consommation du budget (les achats "craqués" le diminuent)
- Le budget peut évoluer via des bonus (streaks longs, objectifs atteints)

**5. Authentification Simple**
- Code d'accès personnel (pas d'inscription email/mot de passe)
- Mono-utilisatrice

**6. Stack Technique**
- Frontend : React + TypeScript + Tailwind CSS
- Backend/BDD : Supabase (auth, database, storage photos)
- Hébergement : à définir (Vercel, Netlify ou autre)
- Code open source sur GitHub

### Out of Scope for MVP

- Multi-utilisateurs / comptes multiples
- Mode duo / défis entre amis
- Connexion bancaire automatique
- Notifications push
- App mobile native (PWA possible mais pas prioritaire)
- Import/export de données
- Catégories personnalisables (catégories fixes en V1)

### MVP Success Criteria

- Aurélie utilise l'app quasi quotidiennement pendant 2 mois
- Le réflexe "ouvrir l'app avant d'acheter" est installé
- Le taux de résistance dépasse 50% après le premier mois
- Le Livret Bleu se renfloue — plus de passage dans le rouge en fin de mois
- La gamification maintient l'engagement (elle consulte ses stats, ses streaks, ses niveaux)

### Future Vision

**V2 :**
- Multi-utilisateurs avec inscription
- Mode duo / défis partagés entre proches
- Catégories personnalisables
- Notifications push

**V3 :**
- Connexion bancaire automatique (détection d'achats)
- Communauté / classements anonymes
- Insights IA sur les patterns de dépense
