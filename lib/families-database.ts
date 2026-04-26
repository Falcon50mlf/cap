// Base des 6 familles de métiers post-école de commerce.
// Marketing est entièrement renseigné (démo Cap'). Les autres sont en
// placeholder éditorial — assez pour exister dans la nav, pas assez pour
// faire croire qu'elles sont prêtes.

import type { Family } from "@/types/database";

export type FamilyDetail = {
  id: Family;
  name: string;
  short: string;
  color: string;
  icon: string; // nom de l'icône Lucide
  tagline: string;
  status: "live" | "soon";
  intro?: string;
  quotidien?: { title: string; body: string }[];
  salaires?: { label: string; range: string; description: string }[];
  parcours?: { step: number; title: string; body: string }[];
  topEntreprises?: string[];
  softSkills?: string[];
  // counts pour les cards et les hero stats
  nbMetiers: number;
  nbJeux: number;
  nbBenevoles: number;
  // exemples de métiers (pour preview cards)
  metiersPreview?: string[];
};

export const FAMILIES: Record<Family, FamilyDetail> = {
  marketing: {
    id: "marketing",
    name: "Marketing & Brand",
    short: "Marketing",
    color: "var(--family-marketing)",
    icon: "Megaphone",
    tagline: "Faire qu'une marque compte.",
    status: "live",
    intro:
      "Le marketing, c'est créer des marques que les gens choisissent quand ils ont 1000 alternatives. Tu mélanges psychologie, data et créativité pour rendre un produit désirable, compréhensible, et différent. C'est l'un des métiers les plus larges qui existent : tu peux être ultra-quanti (Growth) ou ultra-créatif (Brand).",
    quotidien: [
      {
        title: "Brief créatif à l'agence",
        body: "Tu débriefes une agence sur le prochain spot TV. Tu défends ce qui rend ta marque unique : 'On est pas Coca, on est Orangina'. Allers-retours sur la copy, les visuels, le ton.",
      },
      {
        title: "Analyse des perfs trimestrielles",
        body: "Pull du dashboard Tableau ou Looker. Pourquoi le SKU vanille perd 4 pts de part de marché ? Tu cross avec Nielsen, tu interviewes 5 consommateurs, tu sors une hypothèse.",
      },
      {
        title: "Présentation au comex",
        body: "Tu pitches le plan de lancement de la nouvelle gamme bio devant la direction. 12 slides, 30 minutes, des décisions qui engagent 5M€ de budget annuel.",
      },
      {
        title: "Shoot photo / vidéo",
        body: "Tu vas sur le tournage du contenu social. Tu valides les prises avec le réa, tu cadres les attentes du client interne, tu coupes les egos quand il faut.",
      },
    ],
    salaires: [
      {
        label: "Junior · 0-3 ans",
        range: "38 — 45k€",
        description:
          "Brand Assistant, Junior Product Manager. Plus tu rentres dans une 'marque école' (L'Oréal, Mars, Mondelēz), plus le package grimpe.",
      },
      {
        label: "Confirmé · 3-7 ans",
        range: "55 — 80k€",
        description:
          "Brand Manager, Senior Product Marketing Manager. Tu pilotes ton scope, tu manages 1-2 personnes, tu portes des décisions à 6 chiffres.",
      },
      {
        label: "Senior · 7+ ans",
        range: "90 — 150k€",
        description:
          "Marketing Director, VP Brand, CMO. Tu rapportes au comex, tu portes la P&L marketing, tu manages des équipes de 10-50.",
      },
    ],
    parcours: [
      {
        step: 1,
        title: "Bac +5 école de commerce",
        body: "Spé Marketing en M2 si tu sais déjà. Sinon, tu peux y arriver depuis n'importe quel parcours : sciences po, école d'ingé, master de socio.",
      },
      {
        step: 2,
        title: "1-2 stages stratégiques en M1/M2",
        body: "Idéalement un en agence (TBWA, BETC, Publicis), un chez l'annonceur (L'Oréal, Danone, BlaBlaCar). Le mix te donne la double vue interne/externe.",
      },
      {
        step: 3,
        title: "1ère expérience Brand Assistant",
        body: "2-3 ans dans une marque école. Tu apprends les fondamentaux : insight, mix marketing, plan annuel, brief créatif, pilotage de KPI.",
      },
      {
        step: 4,
        title: "Brand Manager / PMM",
        body: "Tu pilotes ta marque ou ton produit. Tu tiens un budget, tu pitches au comex, tu manages un assistant.",
      },
      {
        step: 5,
        title: "Director et au-delà",
        body: "Marketing Director d'une catégorie, VP Brand d'une entreprise, CMO d'une scale-up. Le terrain de jeu s'élargit chaque échelon.",
      },
    ],
    topEntreprises: [
      "L'Oréal",
      "LVMH",
      "Danone",
      "Mars Wrigley",
      "Mondelēz",
      "Unilever",
      "Kering",
      "Hermès",
      "Estée Lauder",
      "BlaBlaCar",
      "Doctolib",
      "Vinted",
      "Back Market",
      "Decathlon",
      "Veepee",
    ],
    softSkills: [
      "Créativité",
      "Analyse",
      "Communication",
      "Empathie client",
      "Storytelling",
      "Curiosité",
      "Esprit synthétique",
    ],
    nbMetiers: 5,
    nbJeux: 7,
    nbBenevoles: 2,
    metiersPreview: [
      "Brand Manager",
      "Product Marketing Manager",
      "Growth Marketer",
    ],
  },

  // ─── Placeholders (à remplir au fil des sessions) ───────────────────────
  strategy: {
    id: "strategy",
    name: "Conseil & Stratégie",
    short: "Conseil",
    color: "var(--family-strategy)",
    icon: "Briefcase",
    tagline: "Résoudre les problèmes durs des grandes boîtes.",
    status: "soon",
    nbMetiers: 5,
    nbJeux: 0,
    nbBenevoles: 0,
    metiersPreview: ["Consultant MBB", "Big 4", "Stratégiste interne"],
  },
  finance: {
    id: "finance",
    name: "Finance",
    short: "Finance",
    color: "var(--family-finance)",
    icon: "TrendingUp",
    tagline: "Allouer le capital là où ça compte.",
    status: "soon",
    nbMetiers: 5,
    nbJeux: 0,
    nbBenevoles: 0,
    metiersPreview: ["Analyste M&A", "Private Equity", "Asset Manager"],
  },
  tech: {
    id: "tech",
    name: "Tech & Produit",
    short: "Tech",
    color: "var(--family-tech)",
    icon: "Cpu",
    tagline: "Construire les produits que les gens utilisent tous les jours.",
    status: "soon",
    nbMetiers: 5,
    nbJeux: 0,
    nbBenevoles: 0,
    metiersPreview: ["Product Manager", "Tech Sales", "Customer Success"],
  },
  startup: {
    id: "startup",
    name: "Entrepreneuriat & Startups",
    short: "Startup",
    color: "var(--family-startup)",
    icon: "Rocket",
    tagline: "Construire de zéro, vite, sans filet.",
    status: "soon",
    nbMetiers: 5,
    nbJeux: 0,
    nbBenevoles: 0,
    metiersPreview: ["Founder", "Chief of Staff", "VC Analyst"],
  },
  retail: {
    id: "retail",
    name: "Luxe, Retail & FMCG",
    short: "Retail",
    color: "var(--family-retail)",
    icon: "Sparkles",
    tagline: "Faire vivre une expérience produit en boutique et en ligne.",
    status: "soon",
    nbMetiers: 5,
    nbJeux: 0,
    nbBenevoles: 0,
    metiersPreview: ["Buyer", "Visual Merchandiser", "Trade Marketing"],
  },
};

export const FAMILY_LIST: FamilyDetail[] = Object.values(FAMILIES);

export function getFamily(id: string): FamilyDetail | undefined {
  return FAMILIES[id as Family];
}
