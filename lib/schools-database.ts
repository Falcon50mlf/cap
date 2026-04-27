// Schools partner database — pilote UCL Lille.
// Module : "Introduction à la gestion d'entreprise" (cours Monica Scarano).

export type ContentSection = {
  type: 'intro' | 'definition' | 'list' | 'table' | 'examples' | 'formula' | 'callout';
  title?: string;
  body?: string;
  items?: { label: string; value?: string }[];
  table?: { headers: string[]; rows: string[][] };
  callout?: { kind: 'info' | 'tip' | 'warn'; text: string };
  formula?: string;
};

export type Submodule = {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  duration: string;
  iconName: string; // Lucide icon
  intro: string;
  gameId: string; // matches games-registry id
  sections: ContentSection[];
};

export type Module = {
  id: string;
  title: string;
  author: string;
  authorEmail?: string;
  description: string;
  submodules: Submodule[];
};

export type School = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  founded: string;
  studentsCount: string;
  programs: { name: string; level: string }[];
  testimonial: { name: string; year: string; current: string; quote: string };
  modules: Module[];
};

// ─── Données UCL ──────────────────────────────────────────────────────────

const SUBMODULE_1: Submodule = {
  id: 'reconnaitre-entreprise',
  order: 1,
  title: 'Reconnaître une entreprise',
  shortTitle: 'Reconnaître',
  duration: '8 min',
  iconName: 'Building2',
  intro:
    'Toutes les entreprises ne se ressemblent pas : une boulangerie de quartier et la SNCF ne se gèrent pas avec les mêmes outils. Apprends à les distinguer sur 3 critères.',
  gameId: 'ucl-entreprise-explorer',
  sections: [
    {
      type: 'definition',
      title: "Qu'est-ce qu'une entreprise ?",
      body: "D'après le décret 2008-1354, une entreprise est la plus petite combinaison d'unités légales qui constitue une unité organisationnelle de production de biens et services jouissant d'une certaine autonomie de décision.",
    },
    {
      type: 'callout',
      callout: {
        kind: 'info',
        text: "Trois critères permettent de différencier les entreprises : la forme juridique, le secteur d'activité, et la taille.",
      },
    },
    {
      type: 'list',
      title: "Les 4 tailles d'entreprise (INSEE)",
      items: [
        {
          label: 'Micro-entreprise',
          value: 'Moins de 10 salariés · CA ou bilan ≤ 2 M€',
        },
        {
          label: 'PME (Petite et Moyenne Entreprise)',
          value: 'Moins de 250 salariés · CA ≤ 50 M€',
        },
        {
          label: 'ETI (Entreprise de Taille Intermédiaire)',
          value: 'Moins de 5 000 salariés · CA ≤ 1,5 Mrd€',
        },
        {
          label: 'GE (Grande Entreprise)',
          value: 'Plus de 5 000 salariés ou CA > 1,5 Mrd€',
        },
      ],
    },
    {
      type: 'list',
      title: "Les 3 secteurs d'activité",
      items: [
        {
          label: 'Primaire',
          value:
            'Production directe à partir des ressources naturelles (agriculture, pêche, mines, sylviculture).',
        },
        {
          label: 'Secondaire',
          value:
            'Transformation des matières premières en produits finis (industrie, artisanat de production, BTP).',
        },
        {
          label: 'Tertiaire',
          value: 'Production de services (commerce, transport, finance, tourisme, conseil, santé).',
        },
      ],
    },
    {
      type: 'examples',
      title: 'Exemples concrets',
      items: [
        { label: 'SNCF', value: 'EPIC · Tertiaire · Grande Entreprise' },
        { label: 'Burger King', value: 'SAS · Tertiaire · Grande Entreprise' },
        {
          label: 'Boulanger artisan',
          value: 'EI · Secondaire · Micro-entreprise',
        },
        { label: 'EDF', value: 'SA · Secondaire · Grande Entreprise' },
        { label: 'Le Creuset', value: 'SAS · Secondaire · ETI' },
      ],
    },
  ],
};

const SUBMODULE_2: Submodule = {
  id: 'choisir-statut',
  order: 2,
  title: 'Choisir le bon statut',
  shortTitle: 'Statuts',
  duration: '10 min',
  iconName: 'FileSignature',
  intro:
    'Solo ou à plusieurs ? Patrimoine séparé ou pas ? Le bon statut juridique dépend de quelques questions simples. Apprends-les à travers 5 cas concrets.',
  gameId: 'ucl-statut-quiz',
  sections: [
    {
      type: 'definition',
      title: 'Entreprise individuelle vs Société',
      body: "L'entreprise individuelle (EI) est l'extension légale de la personne. Une société est une personne morale distincte de ses associés, créée par un contrat.",
    },
    {
      type: 'list',
      title: 'Les principaux statuts juridiques',
      items: [
        {
          label: 'EI · Entreprise Individuelle',
          value:
            '1 seul·e entrepreneur·e. Patrimoine pro et perso confondus (sauf option EIRL). Simple, rapide.',
        },
        {
          label: 'EURL · SARL unipersonnelle',
          value:
            '1 seul·e associé·e. Personne morale → patrimoine séparé. Responsabilité limitée aux apports.',
        },
        {
          label: 'SARL · Société à Responsabilité Limitée',
          value: '2 à 100 associés. Cadre rigide rassurant, idéal pour PME familiales.',
        },
        {
          label: 'SA · Société Anonyme',
          value:
            'Min. 2 actionnaires (37k€ capital). Cadre lourd, pour entreprises matures cotables.',
        },
        {
          label: 'SAS · Société par Actions Simplifiée',
          value:
            '1 ou + actionnaires. Statuts ultra-libres. Le standard des startups & investisseurs.',
        },
        {
          label: 'SCOP · Société Coopérative et Participative',
          value: 'Salariés associés majoritaires. Gouvernance démocratique, partage des bénéfices.',
        },
      ],
    },
    {
      type: 'callout',
      callout: {
        kind: 'tip',
        text: "L'arbre de décision : combien d'apporteurs ? → quel niveau de responsabilité voulez-vous ? → quel cadre de gouvernance ?",
      },
    },
  ],
};

const SUBMODULE_3: Submodule = {
  id: 'pestel',
  order: 3,
  title: "Analyser l'environnement",
  shortTitle: 'PESTEL',
  duration: '8 min',
  iconName: 'Globe2',
  intro:
    'Une entreprise ne vit pas dans le vide : politique, technologie, écologie… 6 dimensions modèlent son environnement. Apprends à les classer avec PESTEL.',
  gameId: 'ucl-pestel-match',
  sections: [
    {
      type: 'definition',
      title: 'Le macro-environnement',
      body: "Le macro-environnement est l'ensemble des facteurs qui peuvent influencer les relations d'une entreprise avec ses marchés. On l'analyse avec le modèle PESTEL.",
    },
    {
      type: 'list',
      title: 'Les 6 dimensions PESTEL',
      items: [
        {
          label: 'P · Politique',
          value:
            'Stabilité gouvernementale, politiques publiques, fiscalité, politiques étrangères.',
        },
        {
          label: 'E · Économique',
          value: "Croissance, taux de change, inflation, pouvoir d'achat, cycle économique.",
        },
        {
          label: 'S · Socioculturel',
          value: "Démographie, mode de vie, valeurs, niveau d'éducation, attitudes consommation.",
        },
        {
          label: 'T · Technologique',
          value: 'Innovation, R&D, brevets, dépenses publiques en techno, transferts.',
        },
        {
          label: 'E · Écologique',
          value: "Lois sur l'environnement, traitement des déchets, consommation d'énergie, RSE.",
        },
        {
          label: 'L · Légal',
          value:
            'Lois sur les monopoles, droit du travail, normes de sécurité, réglementations sectorielles.',
        },
      ],
    },
    {
      type: 'callout',
      callout: {
        kind: 'info',
        text: 'PESTEL = macro. Pour le micro-environnement (concurrents, fournisseurs, clients), utilise les 5 forces de Porter.',
      },
    },
  ],
};

const SUBMODULE_4: Submodule = {
  id: 'marche',
  order: 4,
  title: 'Comprendre son marché',
  shortTitle: 'Marché',
  duration: '10 min',
  iconName: 'TrendingUp',
  intro:
    "C'est quoi un marché ? Comment le mesurer ? Apprends à segmenter selon les produits, les clients, et à calculer ta part de marché.",
  gameId: 'ucl-market-radar',
  sections: [
    {
      type: 'definition',
      title: "Qu'est-ce qu'un marché ?",
      body: "Pour les économistes, le marché est la rencontre de l'offre et de la demande. Pour les marketeurs, c'est l'ensemble des consommateurs (réels + potentiels) d'un bien ou service.",
    },
    {
      type: 'list',
      title: 'Segmentation selon les produits',
      items: [
        {
          label: 'Marché principal',
          value: 'Les produits identiques au tien (concurrents directs).',
        },
        {
          label: 'Marché support',
          value:
            'Produits complémentaires qui augmentent la valeur du tien (ex : essence pour une voiture).',
        },
        {
          label: 'Marché environnant',
          value:
            'Produits substituables qui répondent au même besoin autrement (ex : train vs voiture).',
        },
      ],
    },
    {
      type: 'list',
      title: 'Segmentation selon les clients (NCR / NCA / CA / CP)',
      items: [
        {
          label: 'NCR · Non-consommateur relatif',
          value: "Pas encore consommateur, mais pourrait le devenir (manque d'info, prix, accès…).",
        },
        {
          label: 'NCA · Non-consommateur absolu',
          value:
            'Ne sera jamais consommateur (raisons morales, physiques, économiques structurelles).',
        },
        {
          label: 'CA · Consommateur actuel',
          value: 'Consomme déjà ton produit. Ton portefeuille client.',
        },
        {
          label: 'CP · Consommateur potentiel',
          value: 'Consomme un produit similaire chez un concurrent. Cible de conquête.',
        },
      ],
    },
    {
      type: 'formula',
      title: 'Part de marché',
      formula: "Part de marché = (CA de l'entreprise / CA total du marché) × 100",
    },
    {
      type: 'formula',
      title: 'Taux de pénétration',
      formula: 'Taux de pénétration = (Demande actuelle / Demande potentielle) × 100',
    },
  ],
};

export const UCL: School = {
  id: 'ucl',
  name: 'Université Catholique de Lille',
  shortName: 'UCL Lille',
  description:
    "Université privée d'intérêt général fondée en 1875, l'UCL Lille rassemble plus de 32 000 étudiants sur ses cinq facultés et écoles, dont la Faculté de Gestion, Économie et Sciences (FGES).",
  founded: '1875',
  studentsCount: '32 000+ étudiants',
  programs: [
    { name: 'Licence Gestion', level: 'Bac +3' },
    { name: 'Master Management des organisations', level: 'Bac +5' },
    { name: 'MBA Entrepreneuriat', level: 'Bac +5/+6' },
    { name: "Master Finance d'entreprise", level: 'Bac +5' },
  ],
  testimonial: {
    name: 'Camille D.',
    year: 'Diplômée 2023',
    current: 'Chef de projet · BNP Paribas',
    quote:
      "L'UCL m'a donné la rigueur académique et un vrai réseau lillois. Les cours de gestion comme celui de Monica Scarano m'ont aidée à comprendre comment fonctionne vraiment une entreprise, pas juste la théorie.",
  },
  modules: [
    {
      id: 'gestion-entreprise',
      title: "Introduction à la gestion d'entreprise",
      author: 'Monica Scarano',
      authorEmail: 'monica.scarano@univ-catholille.fr',
      description:
        "Les fondamentaux de la gestion d'entreprise en 4 sous-modules interactifs. De la reconnaissance d'une entreprise à l'analyse de son marché.",
      submodules: [SUBMODULE_1, SUBMODULE_2, SUBMODULE_3, SUBMODULE_4],
    },
  ],
};

export const SCHOOLS: Record<string, School> = {
  ucl: UCL,
};

export function getSchool(id: string): School | undefined {
  return SCHOOLS[id];
}

export function getModule(schoolId: string, moduleId: string): Module | undefined {
  return getSchool(schoolId)?.modules.find((m) => m.id === moduleId);
}

export function getSubmodule(
  schoolId: string,
  moduleId: string,
  submoduleId: string,
): Submodule | undefined {
  return getModule(schoolId, moduleId)?.submodules.find((s) => s.id === submoduleId);
}
