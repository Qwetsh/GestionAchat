import type { ExpenseCategory } from '@/lib/constants'

export interface MascotContext {
  // Time
  hour: number

  // Budget
  weeklyRemaining: number
  weeklyBudget: number
  weeklySpent: number

  // Monthly
  monthlySpent: number

  // Expenses this week
  expenseCount: number
  topCategory: ExpenseCategory | null
  totalForSelf: number
  totalForOthers: number

  // Gamification
  currentStreak: number
  level: number
  gems: number
}

type PhraseGenerator = (ctx: MascotContext) => string

interface WeightedPhrase {
  condition: (ctx: MascotContext) => boolean
  phrases: PhraseGenerator[]
  priority: number // higher = checked first
}

const formatEur = (n: number) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)

// ─── Phrase pools ───────────────────────────────────────────

const PHRASE_POOLS: WeightedPhrase[] = [

  // ── Time-based greetings (low priority, fallback flavor) ──

  {
    priority: 0,
    condition: (ctx) => ctx.hour >= 5 && ctx.hour < 9,
    phrases: [
      () => 'Miaou ! Bien dormi ? Prête pour une nouvelle journée !',
      () => 'Le soleil se lève… et moi aussi ! Bonne matinée !',
      () => '*bâille* … Bonjour toi ! On commence doucement ?',
    ],
  },
  {
    priority: 0,
    condition: (ctx) => ctx.hour >= 9 && ctx.hour < 12,
    phrases: [
      () => 'Belle matinée ! J\'espère que tu passes un bon moment.',
      () => 'On est bien ce matin, pas vrai ? Moi je fais la sieste.',
    ],
  },
  {
    priority: 0,
    condition: (ctx) => ctx.hour >= 12 && ctx.hour < 14,
    phrases: [
      () => 'C\'est l\'heure de manger ! Pas trop dépenser au resto hein…',
      () => 'Miam, c\'est midi ! Tu me ramènes un petit quelque chose ?',
    ],
  },
  {
    priority: 0,
    condition: (ctx) => ctx.hour >= 14 && ctx.hour < 18,
    phrases: [
      () => 'Bon aprem ! Moi je digère tranquillement au soleil.',
      () => 'L\'après-midi, c\'est le moment où les tentations arrivent… reste forte !',
    ],
  },
  {
    priority: 0,
    condition: (ctx) => ctx.hour >= 18 && ctx.hour < 22,
    phrases: [
      () => 'Bonne soirée ! Tu as bien géré aujourd\'hui ?',
      () => 'La journée touche à sa fin… on fait le bilan ?',
    ],
  },
  {
    priority: 0,
    condition: (ctx) => ctx.hour >= 22 || ctx.hour < 5,
    phrases: [
      () => 'Encore debout ? Allez, pas de shopping nocturne !',
      () => 'Zzz… Oh, tu es là ? Bonne nuit, à demain !',
      () => 'Les meilleurs achats se font la tête reposée… dors bien !',
    ],
  },

  // ── Budget: overspent (high priority) ──

  {
    priority: 10,
    condition: (ctx) => ctx.weeklyRemaining < -50,
    phrases: [
      (ctx) => `Aïe… ${formatEur(Math.abs(ctx.weeklyRemaining))} de dépassement ! On se calme cette semaine, d'accord ?`,
      (ctx) => `On a dépassé de ${formatEur(Math.abs(ctx.weeklyRemaining))}… Mais chaque jour est une chance de se rattraper !`,
    ],
  },
  {
    priority: 10,
    condition: (ctx) => ctx.weeklyRemaining < 0 && ctx.weeklyRemaining >= -50,
    phrases: [
      (ctx) => `Budget dépassé de ${formatEur(Math.abs(ctx.weeklyRemaining))}… C'est pas grave, on fait attention pour la suite !`,
      () => 'On a un peu dépassé le budget… Pas de panique, on gère !',
    ],
  },

  // ── Budget: danger zone ──

  {
    priority: 8,
    condition: (ctx) => ctx.weeklyRemaining > 0 && ctx.weeklyRemaining < 15,
    phrases: [
      (ctx) => `Plus que ${formatEur(ctx.weeklyRemaining)} pour la semaine… Chaque euro compte !`,
      (ctx) => `Il reste ${formatEur(ctx.weeklyRemaining)}… On tient bon jusqu'à lundi !`,
      () => 'On est serré cette semaine, fais attention aux petites dépenses !',
    ],
  },

  // ── Budget: comfortable ──

  {
    priority: 5,
    condition: (ctx) => ctx.weeklyRemaining >= 15 && ctx.weeklyRemaining < ctx.weeklyBudget * 0.5,
    phrases: [
      (ctx) => `Il te reste ${formatEur(ctx.weeklyRemaining)} cette semaine, c'est gérable !`,
      () => 'Tu gères bien ton budget ! Continue comme ça.',
    ],
  },

  // ── Budget: barely touched ──

  {
    priority: 5,
    condition: (ctx) => ctx.weeklyRemaining >= ctx.weeklyBudget * 0.8 && ctx.expenseCount === 0,
    phrases: [
      () => 'Zéro dépense cette semaine ! Les gemmes arrivent bientôt…',
      (ctx) => `${formatEur(ctx.weeklyBudget)} intacts ! Tu vises les gemmes, pas vrai ?`,
    ],
  },
  {
    priority: 5,
    condition: (ctx) => ctx.weeklyRemaining >= ctx.weeklyBudget * 0.7 && ctx.expenseCount > 0,
    phrases: [
      (ctx) => `Seulement ${formatEur(ctx.weeklySpent)} dépensés, il te reste ${formatEur(ctx.weeklyRemaining)} !`,
      () => 'Belle maîtrise ! Tu vas accumuler des gemmes à ce rythme.',
    ],
  },

  // ── Monthly spending ──

  {
    priority: 6,
    condition: (ctx) => ctx.monthlySpent > 400,
    phrases: [
      (ctx) => `${formatEur(ctx.monthlySpent)} ce mois-ci… On ralentit un peu ?`,
      (ctx) => `Déjà ${formatEur(ctx.monthlySpent)} dépensés ce mois… Fin de mois, on serre les dents !`,
    ],
  },
  {
    priority: 3,
    condition: (ctx) => ctx.monthlySpent > 200 && ctx.monthlySpent <= 400,
    phrases: [
      (ctx) => `${formatEur(ctx.monthlySpent)} dépensés ce mois. On reste dans le raisonnable !`,
    ],
  },
  {
    priority: 4,
    condition: (ctx) => ctx.monthlySpent > 0 && ctx.monthlySpent <= 100,
    phrases: [
      (ctx) => `Seulement ${formatEur(ctx.monthlySpent)} ce mois-ci ! T'es une championne.`,
    ],
  },

  // ── Category-specific ──

  {
    priority: 7,
    condition: (ctx) => ctx.topCategory === 'restaurant',
    phrases: [
      () => 'Beaucoup de restos cette semaine ! Et moi, on m\'invite jamais…',
      () => 'Le resto c\'est sympa mais la cuisine maison, c\'est économique !',
    ],
  },
  {
    priority: 7,
    condition: (ctx) => ctx.topCategory === 'shopping',
    phrases: [
      () => 'Du shopping en tête des dépenses ! T\'as trouvé des belles choses ?',
      () => 'Shopping shopping… Tu m\'as pris un jouet au moins ?',
    ],
  },
  {
    priority: 7,
    condition: (ctx) => ctx.topCategory === 'books',
    phrases: [
      () => 'Des livres ! Au moins c\'est un investissement pour le cerveau.',
      () => 'Tu lis beaucoup cette semaine ! J\'approuve, c\'est culturel.',
    ],
  },
  {
    priority: 7,
    condition: (ctx) => ctx.topCategory === 'cosmetics',
    phrases: [
      () => 'Cosmétiques en tête ! Tu es déjà belle, tu sais ?',
      () => 'Soins et beauté, c\'est important… mais avec modération !',
    ],
  },
  {
    priority: 7,
    condition: (ctx) => ctx.topCategory === 'videogames',
    phrases: [
      () => 'Des jeux vidéo ! Tu me laisses jouer aussi ?',
      () => 'Jeux vidéo en top dépense… au moins c\'est du divertissement maison !',
    ],
  },
  {
    priority: 7,
    condition: (ctx) => ctx.topCategory === 'stationery',
    phrases: [
      () => 'Feutres et coloriage ! Tu me dessines ?',
      () => 'Du matériel créatif ! J\'aime bien, ça rend heureux.',
    ],
  },

  // ── Self vs others ratio ──

  {
    priority: 6,
    condition: (ctx) => ctx.totalForOthers > 0 && ctx.totalForOthers > ctx.totalForSelf,
    phrases: [
      (ctx) => `${formatEur(ctx.totalForOthers)} pour les autres contre ${formatEur(ctx.totalForSelf)} pour toi… T'es trop généreuse !`,
      () => 'Tu dépenses plus pour les autres que pour toi ! C\'est gentil mais pense à toi aussi.',
    ],
  },
  {
    priority: 4,
    condition: (ctx) => ctx.totalForOthers > 0 && ctx.totalForSelf >= ctx.totalForOthers,
    phrases: [
      (ctx) => `${formatEur(ctx.totalForOthers)} offerts aux autres cette semaine, c'est adorable !`,
    ],
  },

  // ── Streak ──

  {
    priority: 6,
    condition: (ctx) => ctx.currentStreak >= 3,
    phrases: [
      (ctx) => `${ctx.currentStreak} semaines d'affilée sous le budget ! Tu m'impressionnes !`,
      (ctx) => `Streak de ${ctx.currentStreak} ! On vise le record ?`,
    ],
  },
  {
    priority: 4,
    condition: (ctx) => ctx.currentStreak === 1,
    phrases: [
      () => 'Une semaine réussie ! Allez, on enchaîne avec une deuxième ?',
    ],
  },

  // ── Gems ──

  {
    priority: 3,
    condition: (ctx) => ctx.gems >= 20,
    phrases: [
      (ctx) => `${ctx.gems} gemmes ! Tu pourrais te faire plaisir à la boutique…`,
      (ctx) => `Wow, ${ctx.gems} gemmes ! T'es riche en gemmes !`,
    ],
  },
]

// ─── Phrase selection ───────────────────────────────────────

export function getMascotPhrase(ctx: MascotContext): string {
  // Collect all matching pools
  const matching = PHRASE_POOLS
    .filter((pool) => pool.condition(ctx))
    .sort((a, b) => b.priority - a.priority)

  if (matching.length === 0) {
    return 'Miaou ! Je suis content de te voir !'
  }

  // Pick from top priority pools (allow some variety by including top 3 priority tiers)
  const topPriority = matching[0].priority
  const candidates = matching.filter((p) => p.priority >= topPriority - 3)

  // Pick a random pool from candidates
  const pool = candidates[Math.floor(Math.random() * candidates.length)]

  // Pick a random phrase from that pool
  const phraseGen = pool.phrases[Math.floor(Math.random() * pool.phrases.length)]

  return phraseGen(ctx)
}
