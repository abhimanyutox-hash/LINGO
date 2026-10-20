export type CefrTier = 'A1' | 'A2' | 'B1';

export interface FrenchVocabItem {
  id: string;
  cefr: CefrTier;
  lessonNumber: number; // 1..15
  theme: string;
  french: string;
  english: string;
  phonetic: string;
  partOfSpeech: 'noun' | 'verb' | 'adj' | 'phrase' | 'adv';
  exampleFrench: string;
  exampleEnglish: string;
}

export interface CefrTierSummary {
  tier: CefrTier;
  title: string;
  subtitle: string;
  wordCountTarget: string;
  badgeColor: string;
  borderColor: string;
  description: string;
}

export const CEFR_TIER_SUMMARIES: CefrTierSummary[] = [
  {
    tier: 'A1',
    title: 'CEFR A1 · Discovery & Survival',
    subtitle: 'Lessons 1–5 · Greetings, Café, Family, Time & Town',
    wordCountTarget: '500 Core Words',
    badgeColor: '#58CC02',
    borderColor: '#46A302',
    description:
      'Master everyday French expressions, ordering food, introducing yourself and family, numbers, time, and getting around town.',
  },
  {
    tier: 'A2',
    title: 'CEFR A2 · Routine & Travel',
    subtitle: 'Lessons 6–10 · Daily Routines, Train Travel, Home, Health & Shopping',
    wordCountTarget: '1,200 Core Words',
    badgeColor: '#1CB0F6',
    borderColor: '#0284C7',
    description:
      'Communicate in routine situations: SNCF train stations, renting apartments, visiting a doctor, past events, and expressing feelings.',
  },
  {
    tier: 'B1',
    title: 'CEFR B1 · Independent Speaker',
    subtitle: 'Lessons 11–15 · Work, Environment, Media, Culture & Debate',
    wordCountTarget: '2,000 Core Words',
    badgeColor: '#FFB300',
    borderColor: '#D97706',
    description:
      'Discuss career goals, environmental issues, digital media, French culture, and defend your opinions with structured arguments.',
  },
];

/**
 * Comprehensive CEFR A1 -> A2 -> B1 French Vocabulary List organized into 15 Progressive Lessons (8 core words per lesson = 120 essential items).
 */
export const FRENCH_CEFR_VOCAB_LIST: FrenchVocabItem[] = [
  // ==========================================================================
  // CEFR A1 — LESSON 1: GREETINGS & INTRODUCTIONS
  // ==========================================================================
  {
    id: 'a1-1-1',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'Bonjour',
    english: 'Hello / Good morning',
    phonetic: 'bohn-zhoor',
    partOfSpeech: 'phrase',
    exampleFrench: 'Bonjour, comment allez-vous ?',
    exampleEnglish: 'Hello, how are you?',
  },
  {
    id: 'a1-1-2',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'Bonsoir',
    english: 'Good evening',
    phonetic: 'bohn-swahr',
    partOfSpeech: 'phrase',
    exampleFrench: 'Bonsoir et bienvenue à Paris.',
    exampleEnglish: 'Good evening and welcome to Paris.',
  },
  {
    id: 'a1-1-3',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'S’il vous plaît',
    english: 'Please (formal)',
    phonetic: 'seel voo pleh',
    partOfSpeech: 'phrase',
    exampleFrench: 'Un café, s’il vous plaît.',
    exampleEnglish: 'A coffee, please.',
  },
  {
    id: 'a1-1-4',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'Merci beaucoup',
    english: 'Thank you very much',
    phonetic: 'mehr-see boh-koo',
    partOfSpeech: 'phrase',
    exampleFrench: 'Merci beaucoup pour votre aide.',
    exampleEnglish: 'Thank you very much for your help.',
  },
  {
    id: 'a1-1-5',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'Enchanté(e)',
    english: 'Nice to meet you',
    phonetic: 'ahn-shahn-tay',
    partOfSpeech: 'adj',
    exampleFrench: 'Je m’appelle Marie, enchantée !',
    exampleEnglish: 'My name is Marie, nice to meet you!',
  },
  {
    id: 'a1-1-6',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'Au revoir',
    english: 'Goodbye',
    phonetic: 'oh ruh-vwahr',
    partOfSpeech: 'phrase',
    exampleFrench: 'Au revoir et à demain !',
    exampleEnglish: 'Goodbye and see you tomorrow!',
  },
  {
    id: 'a1-1-7',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'Excusez-moi',
    english: 'Excuse me',
    phonetic: 'ex-kew-zay mwah',
    partOfSpeech: 'phrase',
    exampleFrench: 'Excusez-moi, où est la sortie ?',
    exampleEnglish: 'Excuse me, where is the exit?',
  },
  {
    id: 'a1-1-8',
    cefr: 'A1',
    lessonNumber: 1,
    theme: 'Greetings & Politeness',
    french: 'Comment ça va ?',
    english: 'How is it going?',
    phonetic: 'koh-mahn sah vah',
    partOfSpeech: 'phrase',
    exampleFrench: 'Salut Paul, comment ça va aujourd’hui ?',
    exampleEnglish: 'Hi Paul, how is it going today?',
  },

  // ==========================================================================
  // CEFR A1 — LESSON 2: BOULANGERIE, CAFÉ & FOOD
  // ==========================================================================
  {
    id: 'a1-2-1',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'Le croissant',
    english: 'The croissant',
    phonetic: 'luh krwah-sahn',
    partOfSpeech: 'noun',
    exampleFrench: 'Je prends un croissant chaud.',
    exampleEnglish: 'I am having a warm croissant.',
  },
  {
    id: 'a1-2-2',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'Le pain',
    english: 'The bread',
    phonetic: 'luh pan',
    partOfSpeech: 'noun',
    exampleFrench: 'J’achète du pain à la boulangerie.',
    exampleEnglish: 'I buy bread at the bakery.',
  },
  {
    id: 'a1-2-3',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'L’eau (f)',
    english: 'The water',
    phonetic: 'loh',
    partOfSpeech: 'noun',
    exampleFrench: 'Une carafe d’eau, s’il vous plaît.',
    exampleEnglish: 'A pitcher of water, please.',
  },
  {
    id: 'a1-2-4',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'Le fromage',
    english: 'The cheese',
    phonetic: 'luh froh-mahzh',
    partOfSpeech: 'noun',
    exampleFrench: 'La France est célèbre pour le fromage.',
    exampleEnglish: 'France is famous for cheese.',
  },
  {
    id: 'a1-2-5',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'L’addition (f)',
    english: 'The bill / check',
    phonetic: 'lah-dee-syohn',
    partOfSpeech: 'noun',
    exampleFrench: 'L’addition, s’il vous plaît.',
    exampleEnglish: 'The bill, please.',
  },
  {
    id: 'a1-2-6',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'Le petit-déjeuner',
    english: 'The breakfast',
    phonetic: 'luh puh-tee day-zhuh-nay',
    partOfSpeech: 'noun',
    exampleFrench: 'Je prends le petit-déjeuner à huit heures.',
    exampleEnglish: 'I eat breakfast at eight o’clock.',
  },
  {
    id: 'a1-2-7',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'Manger',
    english: 'To eat',
    phonetic: 'mahn-zhay',
    partOfSpeech: 'verb',
    exampleFrench: 'Nous allons manger au restaurant.',
    exampleEnglish: 'We are going to eat at the restaurant.',
  },
  {
    id: 'a1-2-8',
    cefr: 'A1',
    lessonNumber: 2,
    theme: 'Café & Food',
    french: 'Boire',
    english: 'To drink',
    phonetic: 'bwahr',
    partOfSpeech: 'verb',
    exampleFrench: 'Je voudrais boire un jus d’orange.',
    exampleEnglish: 'I would like to drink an orange juice.',
  },

  // ==========================================================================
  // CEFR A1 — LESSON 3: FAMILY, PEOPLE & DESCRIPTIONS
  // ==========================================================================
  {
    id: 'a1-3-1',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'La famille',
    english: 'The family',
    phonetic: 'lah fah-mee',
    partOfSpeech: 'noun',
    exampleFrench: 'Ma famille habite à Lyon.',
    exampleEnglish: 'My family lives in Lyon.',
  },
  {
    id: 'a1-3-2',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'Le frère',
    english: 'The brother',
    phonetic: 'luh frehr',
    partOfSpeech: 'noun',
    exampleFrench: 'Mon frère a vingt ans.',
    exampleEnglish: 'My brother is twenty years old.',
  },
  {
    id: 'a1-3-3',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'La sœur',
    english: 'The sister',
    phonetic: 'lah suhr',
    partOfSpeech: 'noun',
    exampleFrench: 'Ma sœur étudie la musique.',
    exampleEnglish: 'My sister studies music.',
  },
  {
    id: 'a1-3-4',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'L’ami / L’amie',
    english: 'The friend',
    phonetic: 'lah-mee',
    partOfSpeech: 'noun',
    exampleFrench: 'C’est mon meilleur ami.',
    exampleEnglish: 'He is my best friend.',
  },
  {
    id: 'a1-3-5',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'Jeune',
    english: 'Young',
    phonetic: 'zhuhn',
    partOfSpeech: 'adj',
    exampleFrench: 'C’est un jeune étudiant dynamique.',
    exampleEnglish: 'He is a dynamic young student.',
  },
  {
    id: 'a1-3-6',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'Sympathique',
    english: 'Nice / Friendly',
    phonetic: 'sam-pah-teek',
    partOfSpeech: 'adj',
    exampleFrench: 'Nos voisins sont très sympathiques.',
    exampleEnglish: 'Our neighbors are very friendly.',
  },
  {
    id: 'a1-3-7',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'Les grands-parents (m)',
    english: 'The grandparents',
    phonetic: 'lay grahn-pah-rahn',
    partOfSpeech: 'noun',
    exampleFrench: 'Mes grands-parents habitent en Provence.',
    exampleEnglish: 'My grandparents live in Provence.',
  },
  {
    id: 'a1-3-8',
    cefr: 'A1',
    lessonNumber: 3,
    theme: 'Family & People',
    french: 'Heureux / Heureuse',
    english: 'Happy',
    phonetic: 'uh-ruh / uh-reuz',
    partOfSpeech: 'adj',
    exampleFrench: 'Nous sommes très heureux de vous voir.',
    exampleEnglish: 'We are very happy to see you.',
  },

  // ==========================================================================
  // CEFR A1 — LESSON 4: NUMBERS, TIME, DAYS & WEATHER
  // ==========================================================================
  {
    id: 'a1-4-1',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'Aujourd’hui',
    english: 'Today',
    phonetic: 'oh-zhoor-dwee',
    partOfSpeech: 'adv',
    exampleFrench: 'Aujourd’hui, il fait très beau.',
    exampleEnglish: 'Today, the weather is very nice.',
  },
  {
    id: 'a1-4-2',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'Demain',
    english: 'Tomorrow',
    phonetic: 'duh-man',
    partOfSpeech: 'adv',
    exampleFrench: 'Nous partons demain matin.',
    exampleEnglish: 'We leave tomorrow morning.',
  },
  {
    id: 'a1-4-3',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'L’heure (f)',
    english: 'The hour / time',
    phonetic: 'luhr',
    partOfSpeech: 'noun',
    exampleFrench: 'Quelle heure est-il ?',
    exampleEnglish: 'What time is it?',
  },
  {
    id: 'a1-4-4',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'La semaine',
    english: 'The week',
    phonetic: 'lah suh-men',
    partOfSpeech: 'noun',
    exampleFrench: 'Je travaille cinq jours par semaine.',
    exampleEnglish: 'I work five days a week.',
  },
  {
    id: 'a1-4-5',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'Le soleil',
    english: 'The sun',
    phonetic: 'luh soh-lay',
    partOfSpeech: 'noun',
    exampleFrench: 'Le soleil brille sur la plage.',
    exampleEnglish: 'The sun is shining on the beach.',
  },
  {
    id: 'a1-4-6',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'La pluie',
    english: 'The rain',
    phonetic: 'lah plwee',
    partOfSpeech: 'noun',
    exampleFrench: 'Prends un parapluie à cause de la pluie.',
    exampleEnglish: 'Take an umbrella because of the rain.',
  },
  {
    id: 'a1-4-7',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'Le matin',
    english: 'The morning',
    phonetic: 'luh mah-tan',
    partOfSpeech: 'noun',
    exampleFrench: 'Je lis le journal chaque matin.',
    exampleEnglish: 'I read the newspaper every morning.',
  },
  {
    id: 'a1-4-8',
    cefr: 'A1',
    lessonNumber: 4,
    theme: 'Time & Weather',
    french: 'Il fait froid',
    english: 'It is cold (weather)',
    phonetic: 'eel feh frwah',
    partOfSpeech: 'phrase',
    exampleFrench: 'En hiver, il fait froid dans les Alpes.',
    exampleEnglish: 'In winter, it is cold in the Alps.',
  },

  // ==========================================================================
  // CEFR A1 — LESSON 5: PLACES IN TOWN & DIRECTIONS (A1 CHECKPOINT)
  // ==========================================================================
  {
    id: 'a1-5-1',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'La gare',
    english: 'The train station',
    phonetic: 'lah gahr',
    partOfSpeech: 'noun',
    exampleFrench: 'La gare est tout droit.',
    exampleEnglish: 'The train station is straight ahead.',
  },
  {
    id: 'a1-5-2',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'La bibliothèque',
    english: 'The library',
    phonetic: 'lah bee-blee-oh-tek',
    partOfSpeech: 'noun',
    exampleFrench: 'J’étudie à la bibliothèque municipale.',
    exampleEnglish: 'I study at the public library.',
  },
  {
    id: 'a1-5-3',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'À gauche',
    english: 'To the left',
    phonetic: 'ah gohsh',
    partOfSpeech: 'phrase',
    exampleFrench: 'Tournez à gauche après le pont.',
    exampleEnglish: 'Turn left after the bridge.',
  },
  {
    id: 'a1-5-4',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'À droite',
    english: 'To the right',
    phonetic: 'ah drwaht',
    partOfSpeech: 'phrase',
    exampleFrench: 'La pharmacie est à droite.',
    exampleEnglish: 'The pharmacy is on the right.',
  },
  {
    id: 'a1-5-5',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'Le magasin',
    english: 'The shop / store',
    phonetic: 'luh mah-gah-zan',
    partOfSpeech: 'noun',
    exampleFrench: 'Ce magasin ouvre à neuf heures.',
    exampleEnglish: 'This store opens at nine o’clock.',
  },
  {
    id: 'a1-5-6',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'Près d’ici',
    english: 'Near here',
    phonetic: 'preh dee-see',
    partOfSpeech: 'phrase',
    exampleFrench: 'Y a-t-il une banque près d’ici ?',
    exampleEnglish: 'Is there a bank near here?',
  },
  {
    id: 'a1-5-7',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'Tout droit',
    english: 'Straight ahead',
    phonetic: 'too drwah',
    partOfSpeech: 'adv',
    exampleFrench: 'Continuez tout droit jusqu’au musée.',
    exampleEnglish: 'Continue straight ahead until the museum.',
  },
  {
    id: 'a1-5-8',
    cefr: 'A1',
    lessonNumber: 5,
    theme: 'Town & Directions',
    french: 'Le pont',
    english: 'The bridge',
    phonetic: 'luh pohn',
    partOfSpeech: 'noun',
    exampleFrench: 'Nous traversons le pont sur la Seine.',
    exampleEnglish: 'We cross the bridge over the Seine.',
  },

  // ==========================================================================
  // CEFR A2 — LESSON 6: DAILY ROUTINES & REFLEXIVE VERBS
  // ==========================================================================
  {
    id: 'a2-6-1',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'Se réveiller',
    english: 'To wake up',
    phonetic: 'suh ray-vay-yay',
    partOfSpeech: 'verb',
    exampleFrench: 'Je me réveille tôt tous les matins.',
    exampleEnglish: 'I wake up early every morning.',
  },
  {
    id: 'a2-6-2',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'Se préparer',
    english: 'To get ready',
    phonetic: 'suh pray-pah-ray',
    partOfSpeech: 'verb',
    exampleFrench: 'Elle se prépare rapidement pour partir.',
    exampleEnglish: 'She gets ready quickly to leave.',
  },
  {
    id: 'a2-6-3',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'Le quotidien',
    english: 'Daily life',
    phonetic: 'luh koh-tee-dyan',
    partOfSpeech: 'noun',
    exampleFrench: 'Le sport fait partie de mon quotidien.',
    exampleEnglish: 'Sports are part of my daily life.',
  },
  {
    id: 'a2-6-4',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'Les courses (f)',
    english: 'Grocery shopping / errands',
    phonetic: 'lay koors',
    partOfSpeech: 'noun',
    exampleFrench: 'Je fais les courses le samedi matin.',
    exampleEnglish: 'I do the grocery shopping on Saturday morning.',
  },
  {
    id: 'a2-6-5',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'Se coucher',
    english: 'To go to bed',
    phonetic: 'suh koo-shay',
    partOfSpeech: 'verb',
    exampleFrench: 'Je me couche vers vingt-trois heures.',
    exampleEnglish: 'I go to bed around eleven PM.',
  },
  {
    id: 'a2-6-6',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'S’habiller',
    english: 'To get dressed',
    phonetic: 'sah-bee-yay',
    partOfSpeech: 'verb',
    exampleFrench: 'Il s’habille élégamment pour le dîner.',
    exampleEnglish: 'He dresses elegantly for dinner.',
  },
  {
    id: 'a2-6-7',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'Se dépêcher',
    english: 'To hurry up',
    phonetic: 'suh day-peh-shay',
    partOfSpeech: 'verb',
    exampleFrench: 'Nous nous dépêchons pour prendre le métro.',
    exampleEnglish: 'We hurry to catch the metro.',
  },
  {
    id: 'a2-6-8',
    cefr: 'A2',
    lessonNumber: 6,
    theme: 'Daily Routine',
    french: 'L’habitude (f)',
    english: 'The habit / custom',
    phonetic: 'lah-bee-tewd',
    partOfSpeech: 'noun',
    exampleFrench: 'J’ai l’habitude de boire un thé vert.',
    exampleEnglish: 'I am in the habit of drinking green tea.',
  },

  // ==========================================================================
  // CEFR A2 — LESSON 7: HOUSING, APARTMENTS & FURNITURE
  // ==========================================================================
  {
    id: 'a2-7-1',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'L’appartement (m)',
    english: 'The apartment',
    phonetic: 'lah-par-tuh-mahn',
    partOfSpeech: 'noun',
    exampleFrench: 'Nous louons un appartement lumineux.',
    exampleEnglish: 'We are renting a bright apartment.',
  },
  {
    id: 'a2-7-2',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'Le loyer',
    english: 'The rent',
    phonetic: 'luh lwah-yay',
    partOfSpeech: 'noun',
    exampleFrench: 'Le loyer comprend les charges.',
    exampleEnglish: 'The rent includes utilities.',
  },
  {
    id: 'a2-7-3',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'Déménager',
    english: 'To move house',
    phonetic: 'day-may-nah-zhay',
    partOfSpeech: 'verb',
    exampleFrench: 'Ils vont déménager à Bordeaux.',
    exampleEnglish: 'They are going to move to Bordeaux.',
  },
  {
    id: 'a2-7-4',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'Le quartier',
    english: 'The neighborhood',
    phonetic: 'luh kar-tyay',
    partOfSpeech: 'noun',
    exampleFrench: 'C’est un quartier calme et agréable.',
    exampleEnglish: 'It is a quiet and pleasant neighborhood.',
  },
  {
    id: 'a2-7-5',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'Les meubles (m)',
    english: 'The furniture',
    phonetic: 'lay muh-bluh',
    partOfSpeech: 'noun',
    exampleFrench: 'Cet appartement est loué avec des meubles.',
    exampleEnglish: 'This apartment is rented with furniture.',
  },
  {
    id: 'a2-7-6',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'L’étage (m)',
    english: 'The floor / story',
    phonetic: 'lay-tahzh',
    partOfSpeech: 'noun',
    exampleFrench: 'J’habite au troisième étage avec ascenseur.',
    exampleEnglish: 'I live on the third floor with an elevator.',
  },
  {
    id: 'a2-7-7',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'La cuisine équipée',
    english: 'The fitted kitchen',
    phonetic: 'lah kwee-zeen ay-kee-pay',
    partOfSpeech: 'noun',
    exampleFrench: 'La cuisine équipée donne sur la cour.',
    exampleEnglish: 'The fitted kitchen overlooks the courtyard.',
  },
  {
    id: 'a2-7-8',
    cefr: 'A2',
    lessonNumber: 7,
    theme: 'Housing & Home',
    french: 'Le propriétaire',
    english: 'The landlord / owner',
    phonetic: 'luh proh-pree-ay-tehr',
    partOfSpeech: 'noun',
    exampleFrench: 'Le propriétaire nous a remis les clés.',
    exampleEnglish: 'The landlord handed us the keys.',
  },

  // ==========================================================================
  // CEFR A2 — LESSON 8: TRAVEL, SNCF TRAINS & HOLIDAYS
  // ==========================================================================
  {
    id: 'a2-8-1',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'Un billet aller-retour',
    english: 'A round-trip ticket',
    phonetic: 'uhn bee-yeh ah-lay ruh-toor',
    partOfSpeech: 'noun',
    exampleFrench: 'Je voudrais un billet aller-retour pour Nice.',
    exampleEnglish: 'I would like a round-trip ticket to Nice.',
  },
  {
    id: 'a2-8-2',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'La voie',
    english: 'The platform / track',
    phonetic: 'lah vwah',
    partOfSpeech: 'noun',
    exampleFrench: 'Le train part de la voie numéro quatre.',
    exampleEnglish: 'The train departs from platform number four.',
  },
  {
    id: 'a2-8-3',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'En retard',
    english: 'Late / Delayed',
    phonetic: 'ahn ruh-tar',
    partOfSpeech: 'phrase',
    exampleFrench: 'Le vol est en retard de vingt minutes.',
    exampleEnglish: 'The flight is delayed by twenty minutes.',
  },
  {
    id: 'a2-8-4',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'La correspondance',
    english: 'The transfer / connection',
    phonetic: 'lah koh-res-pohn-dahns',
    partOfSpeech: 'noun',
    exampleFrench: 'Nous avons une correspondance à Marseille.',
    exampleEnglish: 'We have a connection in Marseille.',
  },
  {
    id: 'a2-8-5',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'Valider son billet',
    english: 'To validate one’s ticket',
    phonetic: 'vah-lee-day sohn bee-yeh',
    partOfSpeech: 'verb',
    exampleFrench: 'N’oubliez pas de valider votre billet avant de monter.',
    exampleEnglish: 'Don’t forget to validate your ticket before boarding.',
  },
  {
    id: 'a2-8-6',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'La valise',
    english: 'The suitcase',
    phonetic: 'lah vah-leez',
    partOfSpeech: 'noun',
    exampleFrench: 'Ma valise est prête pour les vacances.',
    exampleEnglish: 'My suitcase is ready for vacation.',
  },
  {
    id: 'a2-8-7',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'La salle d’attente',
    english: 'The waiting room',
    phonetic: 'lah sahl dah-tahnt',
    partOfSpeech: 'noun',
    exampleFrench: 'Les voyageurs patientent dans la salle d’attente.',
    exampleEnglish: 'Travelers wait in the waiting room.',
  },
  {
    id: 'a2-8-8',
    cefr: 'A2',
    lessonNumber: 8,
    theme: 'Travel & Transport',
    french: 'À l’heure',
    english: 'On time',
    phonetic: 'ah luhr',
    partOfSpeech: 'phrase',
    exampleFrench: 'Le TGV pour Lyon est arrivé à l’heure.',
    exampleEnglish: 'The TGV to Lyon arrived on time.',
  },

  // ==========================================================================
  // CEFR A2 — LESSON 9: HEALTH, BODY & AT THE DOCTOR
  // ==========================================================================
  {
    id: 'a2-9-1',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'Le médecin',
    english: 'The doctor',
    phonetic: 'luh mayd-san',
    partOfSpeech: 'noun',
    exampleFrench: 'J’ai rendez-vous chez le médecin.',
    exampleEnglish: 'I have an appointment with the doctor.',
  },
  {
    id: 'a2-9-2',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'L’ordonnance (f)',
    english: 'The prescription',
    phonetic: 'lor-doh-nahns',
    partOfSpeech: 'noun',
    exampleFrench: 'Voici l’ordonnance pour la pharmacie.',
    exampleEnglish: 'Here is the prescription for the pharmacy.',
  },
  {
    id: 'a2-9-3',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'La fièvre',
    english: 'The fever',
    phonetic: 'lah fyev-ruh',
    partOfSpeech: 'noun',
    exampleFrench: 'Il a de la fièvre depuis hier soir.',
    exampleEnglish: 'He has had a fever since last night.',
  },
  {
    id: 'a2-9-4',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'Se reposer',
    english: 'To rest',
    phonetic: 'suh ruh-poh-zay',
    partOfSpeech: 'verb',
    exampleFrench: 'Vous devez vous reposer pendant trois jours.',
    exampleEnglish: 'You must rest for three days.',
  },
  {
    id: 'a2-9-5',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'La pharmacie',
    english: 'The pharmacy',
    phonetic: 'lah far-mah-see',
    partOfSpeech: 'noun',
    exampleFrench: 'La pharmacie de garde est ouverte ce soir.',
    exampleEnglish: 'The on-duty pharmacy is open tonight.',
  },
  {
    id: 'a2-9-6',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'Avoir mal à la gorge',
    english: 'To have a sore throat',
    phonetic: 'ah-vwahr mahl ah lah gorzh',
    partOfSpeech: 'phrase',
    exampleFrench: 'J’ai mal à la gorge, je prends une tisane.',
    exampleEnglish: 'I have a sore throat, I am having herbal tea.',
  },
  {
    id: 'a2-9-7',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'Le médicament',
    english: 'The medicine / medication',
    phonetic: 'luh may-dee-kah-mahn',
    partOfSpeech: 'noun',
    exampleFrench: 'Prenez ce médicament après le repas.',
    exampleEnglish: 'Take this medicine after the meal.',
  },
  {
    id: 'a2-9-8',
    cefr: 'A2',
    lessonNumber: 9,
    theme: 'Health & Medicine',
    french: 'En bonne santé',
    english: 'In good health',
    phonetic: 'ahn bohn sahn-tay',
    partOfSpeech: 'phrase',
    exampleFrench: 'Marcher chaque jour garde en bonne santé.',
    exampleEnglish: 'Walking every day keeps you in good health.',
  },

  // ==========================================================================
  // CEFR A2 — LESSON 10: FEELINGS, MEMORIES & LEISURE (A2 CHECKPOINT)
  // ==========================================================================
  {
    id: 'a2-10-1',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Le souvenir',
    english: 'The memory / souvenir',
    phonetic: 'luh soo-vuh-neer',
    partOfSpeech: 'noun',
    exampleFrench: 'Ce voyage reste un merveilleux souvenir.',
    exampleEnglish: 'This trip remains a wonderful memory.',
  },
  {
    id: 'a2-10-2',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Inoubliable',
    english: 'Unforgettable',
    phonetic: 'ee-noo-blee-ah-bluh',
    partOfSpeech: 'adj',
    exampleFrench: 'C’était une soirée inoubliable.',
    exampleEnglish: 'It was an unforgettable evening.',
  },
  {
    id: 'a2-10-3',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Partager',
    english: 'To share',
    phonetic: 'par-tah-zhay',
    partOfSpeech: 'verb',
    exampleFrench: 'J’aime partager un repas avec mes amis.',
    exampleEnglish: 'I love sharing a meal with my friends.',
  },
  {
    id: 'a2-10-4',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Fier / Fière',
    english: 'Proud',
    phonetic: 'fyehr',
    partOfSpeech: 'adj',
    exampleFrench: 'Elle est très fière de ses progrès.',
    exampleEnglish: 'She is very proud of her progress.',
  },
  {
    id: 'a2-10-5',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Se souvenir de',
    english: 'To remember',
    phonetic: 'suh soo-vuh-neer duh',
    partOfSpeech: 'verb',
    exampleFrench: 'Je me souviens de notre premier voyage à Paris.',
    exampleEnglish: 'I remember our first trip to Paris.',
  },
  {
    id: 'a2-10-6',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Ému(e)',
    english: 'Moved / Touched (emotionally)',
    phonetic: 'ay-mew',
    partOfSpeech: 'adj',
    exampleFrench: 'Il était très ému par ce discours.',
    exampleEnglish: 'He was very moved by this speech.',
  },
  {
    id: 'a2-10-7',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Fêter',
    english: 'To celebrate',
    phonetic: 'feh-tay',
    partOfSpeech: 'verb',
    exampleFrench: 'Nous allons fêter ton anniversaire ce samedi.',
    exampleEnglish: 'We are going to celebrate your birthday this Saturday.',
  },
  {
    id: 'a2-10-8',
    cefr: 'A2',
    lessonNumber: 10,
    theme: 'Feelings & Past Events',
    french: 'Le loisir',
    english: 'The hobby / leisure activity',
    phonetic: 'luh lwah-zeer',
    partOfSpeech: 'noun',
    exampleFrench: 'La peinture est mon loisir préféré.',
    exampleEnglish: 'Painting is my favorite hobby.',
  },

  // ==========================================================================
  // CEFR B1 — LESSON 11: EDUCATION, WORK & CAREER
  // ==========================================================================
  {
    id: 'b1-11-1',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'L’entretien d’embauche (m)',
    english: 'The job interview',
    phonetic: 'lahn-truh-tyan dahm-bohsh',
    partOfSpeech: 'noun',
    exampleFrench: 'J’ai réussi mon entretien d’embauche.',
    exampleEnglish: 'I passed my job interview.',
  },
  {
    id: 'b1-11-2',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'La compétence',
    english: 'The skill / competence',
    phonetic: 'lah kohm-pay-tahns',
    partOfSpeech: 'noun',
    exampleFrench: 'Cette compétence est essentielle au travail.',
    exampleEnglish: 'This skill is essential at work.',
  },
  {
    id: 'b1-11-3',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'Le télétravail',
    english: 'Remote work',
    phonetic: 'luh tay-lay-trah-vay',
    partOfSpeech: 'noun',
    exampleFrench: 'Le télétravail offre plus de flexibilité.',
    exampleEnglish: 'Remote work offers more flexibility.',
  },
  {
    id: 'b1-11-4',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'L’entreprise (f)',
    english: 'The company / business',
    phonetic: 'lahn-truh-preez',
    partOfSpeech: 'noun',
    exampleFrench: 'Cette entreprise recrute des ingénieurs.',
    exampleEnglish: 'This company is recruiting engineers.',
  },
  {
    id: 'b1-11-5',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'Postuler',
    english: 'To apply (for a job)',
    phonetic: 'pohs-tew-lay',
    partOfSpeech: 'verb',
    exampleFrench: 'Elle a décidé de postuler à ce poste à Lyon.',
    exampleEnglish: 'She decided to apply for this position in Lyon.',
  },
  {
    id: 'b1-11-6',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'Le salaire',
    english: 'The salary',
    phonetic: 'luh sah-lehr',
    partOfSpeech: 'noun',
    exampleFrench: 'Nous avons négocié le salaire annuel.',
    exampleEnglish: 'We negotiated the annual salary.',
  },
  {
    id: 'b1-11-7',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'L’équipe (f)',
    english: 'The team',
    phonetic: 'lay-keep',
    partOfSpeech: 'noun',
    exampleFrench: 'Notre équipe collabore sur un nouveau projet.',
    exampleEnglish: 'Our team is collaborating on a new project.',
  },
  {
    id: 'b1-11-8',
    cefr: 'B1',
    lessonNumber: 11,
    theme: 'Work & Career',
    french: 'L’expérience professionnelle',
    english: 'Work experience',
    phonetic: 'lex-pay-ryahns proh-feh-syoh-nel',
    partOfSpeech: 'noun',
    exampleFrench: 'Il possède cinq ans d’expérience professionnelle.',
    exampleEnglish: 'He has five years of work experience.',
  },

  // ==========================================================================
  // CEFR B1 — LESSON 12: ENVIRONMENT, CLIMATE & ECOLOGY
  // ==========================================================================
  {
    id: 'b1-12-1',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'Le développement durable',
    english: 'Sustainable development',
    phonetic: 'luh day-vlohp-mahn dew-rah-bluh',
    partOfSpeech: 'noun',
    exampleFrench: 'Nous soutenons le développement durable.',
    exampleEnglish: 'We support sustainable development.',
  },
  {
    id: 'b1-12-2',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'Le réchauffement climatique',
    english: 'Global warming',
    phonetic: 'luh ray-shohf-mahn klee-mah-teek',
    partOfSpeech: 'noun',
    exampleFrench: 'Il faut agir contre le réchauffement climatique.',
    exampleEnglish: 'We must act against global warming.',
  },
  {
    id: 'b1-12-3',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'Économiser l’énergie',
    english: 'To save energy',
    phonetic: 'ay-koh-noh-mee-zay lay-nehr-zhee',
    partOfSpeech: 'verb',
    exampleFrench: 'Éteignez la lumière pour économiser l’énergie.',
    exampleEnglish: 'Turn off the light to save energy.',
  },
  {
    id: 'b1-12-4',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'Le tri sélectif',
    english: 'Recycling / Waste sorting',
    phonetic: 'luh tree say-lek-teef',
    partOfSpeech: 'noun',
    exampleFrench: 'Le tri sélectif est obligatoire ici.',
    exampleEnglish: 'Recycling is mandatory here.',
  },
  {
    id: 'b1-12-5',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'Les énergies renouvelables',
    english: 'Renewable energies',
    phonetic: 'lay zay-nehr-zhee ruh-noo-vlah-bluh',
    partOfSpeech: 'noun',
    exampleFrench: 'Le solaire fait partie des énergies renouvelables.',
    exampleEnglish: 'Solar power is part of renewable energies.',
  },
  {
    id: 'b1-12-6',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'La biodiversité',
    english: 'Biodiversity',
    phonetic: 'lah byoh-dee-vehr-see-tay',
    partOfSpeech: 'noun',
    exampleFrench: 'Protéger les forêts préserve la biodiversité.',
    exampleEnglish: 'Protecting forests preserves biodiversity.',
  },
  {
    id: 'b1-12-7',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'Gaspiller',
    english: 'To waste',
    phonetic: 'gahs-pee-yay',
    partOfSpeech: 'verb',
    exampleFrench: 'Il ne faut pas gaspiller l’eau potable.',
    exampleEnglish: 'We must not waste drinking water.',
  },
  {
    id: 'b1-12-8',
    cefr: 'B1',
    lessonNumber: 12,
    theme: 'Environment & Nature',
    french: 'L’empreinte carbone (f)',
    english: 'The carbon footprint',
    phonetic: 'lahm-prant kar-bohn',
    partOfSpeech: 'noun',
    exampleFrench: 'Prendre le train réduit notre empreinte carbone.',
    exampleEnglish: 'Taking the train reduces our carbon footprint.',
  },

  // ==========================================================================
  // CEFR B1 — LESSON 13: DIGITAL MEDIA, NEWS & TECHNOLOGY
  // ==========================================================================
  {
    id: 'b1-13-1',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'Les réseaux sociaux (m)',
    english: 'Social networks',
    phonetic: 'lay ray-zoh soh-syoh',
    partOfSpeech: 'noun',
    exampleFrench: 'Les réseaux sociaux transforment la communication.',
    exampleEnglish: 'Social networks are transforming communication.',
  },
  {
    id: 'b1-13-2',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'L’actualité (f)',
    english: 'Current events / The news',
    phonetic: 'lahk-tew-ah-lee-tay',
    partOfSpeech: 'noun',
    exampleFrench: 'Je suis l’actualité internationale chaque matin.',
    exampleEnglish: 'I follow international news every morning.',
  },
  {
    id: 'b1-13-3',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'Vérifier une source',
    english: 'To verify a source',
    phonetic: 'vay-ree-fyay ewn soors',
    partOfSpeech: 'verb',
    exampleFrench: 'Il est important de vérifier une source.',
    exampleEnglish: 'It is important to verify a source.',
  },
  {
    id: 'b1-13-4',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'Numérique',
    english: 'Digital',
    phonetic: 'new-may-reek',
    partOfSpeech: 'adj',
    exampleFrench: 'La transition numérique avance rapidement.',
    exampleEnglish: 'The digital transition is advancing rapidly.',
  },
  {
    id: 'b1-13-5',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'L’intelligence artificielle',
    english: 'Artificial intelligence',
    phonetic: 'lan-teh-lee-zhahns ar-tee-fee-syel',
    partOfSpeech: 'noun',
    exampleFrench: 'L’intelligence artificielle évolue très vite.',
    exampleEnglish: 'Artificial intelligence is evolving very fast.',
  },
  {
    id: 'b1-13-6',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'La vie privée',
    english: 'Privacy / Private life',
    phonetic: 'lah vee pree-vay',
    partOfSpeech: 'noun',
    exampleFrench: 'Protégez vos données et votre vie privée en ligne.',
    exampleEnglish: 'Protect your data and your privacy online.',
  },
  {
    id: 'b1-13-7',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'En direct',
    english: 'Live (broadcast)',
    phonetic: 'ahn dee-rekt',
    partOfSpeech: 'phrase',
    exampleFrench: 'Le concert est diffusé en direct à la télévision.',
    exampleEnglish: 'The concert is broadcast live on television.',
  },
  {
    id: 'b1-13-8',
    cefr: 'B1',
    lessonNumber: 13,
    theme: 'Media & Technology',
    french: 'Un abonnement',
    english: 'A subscription',
    phonetic: 'uhn ah-bohn-mahn',
    partOfSpeech: 'noun',
    exampleFrench: 'J’ai pris un abonnement au journal numérique.',
    exampleEnglish: 'I took out a subscription to the digital newspaper.',
  },

  // ==========================================================================
  // CEFR B1 — LESSON 14: CULTURE, ARTS & SOCIETY
  // ==========================================================================
  {
    id: 'b1-14-1',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'Le patrimoine',
    english: 'Heritage',
    phonetic: 'luh pah-tree-mwahn',
    partOfSpeech: 'noun',
    exampleFrench: 'Ce château fait partie du patrimoine français.',
    exampleEnglish: 'This castle is part of French heritage.',
  },
  {
    id: 'b1-14-2',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'La diversité culturelle',
    english: 'Cultural diversity',
    phonetic: 'lah dee-vehr-see-tay kewl-tew-rel',
    partOfSpeech: 'noun',
    exampleFrench: 'La diversité culturelle enrichit la société.',
    exampleEnglish: 'Cultural diversity enriches society.',
  },
  {
    id: 'b1-14-3',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'Une exposition',
    english: 'An exhibition',
    phonetic: 'ewn ex-poh-zee-syohn',
    partOfSpeech: 'noun',
    exampleFrench: 'Nous avons visité une exposition au Louvre.',
    exampleEnglish: 'We visited an exhibition at the Louvre.',
  },
  {
    id: 'b1-14-4',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'Le citoyen / La citoyenne',
    english: 'The citizen',
    phonetic: 'luh see-twah-yan',
    partOfSpeech: 'noun',
    exampleFrench: 'Chaque citoyen participe à la vie locale.',
    exampleEnglish: 'Every citizen participates in local life.',
  },
  {
    id: 'b1-14-5',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'Un chef-d’œuvre',
    english: 'A masterpiece',
    phonetic: 'uhn sheh-duh-vruh',
    partOfSpeech: 'noun',
    exampleFrench: 'La Joconde est un chef-d’œuvre de la Renaissance.',
    exampleEnglish: 'The Mona Lisa is a masterpiece of the Renaissance.',
  },
  {
    id: 'b1-14-6',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'La littérature',
    english: 'Literature',
    phonetic: 'lah lee-tay-rah-tewr',
    partOfSpeech: 'noun',
    exampleFrench: 'Victor Hugo a marqué la littérature française.',
    exampleEnglish: 'Victor Hugo left his mark on French literature.',
  },
  {
    id: 'b1-14-7',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'La solidarité',
    english: 'Solidarity',
    phonetic: 'lah soh-lee-dah-ree-tay',
    partOfSpeech: 'noun',
    exampleFrench: 'Les associations encouragent la solidarité.',
    exampleEnglish: 'Associations encourage solidarity.',
  },
  {
    id: 'b1-14-8',
    cefr: 'B1',
    lessonNumber: 14,
    theme: 'Culture & Society',
    french: 'Un spectacle',
    english: 'A show / performance',
    phonetic: 'uhn spek-tah-kluh',
    partOfSpeech: 'noun',
    exampleFrench: 'Nous avons réservé des places pour ce spectacle.',
    exampleEnglish: 'We booked seats for this performance.',
  },

  // ==========================================================================
  // CEFR B1 — LESSON 15: EXPRESSING OPINIONS & DEBATING (B1 DIPLOMA)
  // ==========================================================================
  {
    id: 'b1-15-1',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'À mon avis',
    english: 'In my opinion',
    phonetic: 'ah mohn ah-vee',
    partOfSpeech: 'phrase',
    exampleFrench: 'À mon avis, cette solution est efficace.',
    exampleEnglish: 'In my opinion, this solution is effective.',
  },
  {
    id: 'b1-15-2',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'En revanche',
    english: 'On the other hand',
    phonetic: 'ahn ruh-vahnsh',
    partOfSpeech: 'phrase',
    exampleFrench: 'Le train est cher ; en revanche, il est rapide.',
    exampleEnglish: 'The train is expensive; on the other hand, it is fast.',
  },
  {
    id: 'b1-15-3',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'Convaincre',
    english: 'To convince',
    phonetic: 'kohn-van-kruh',
    partOfSpeech: 'verb',
    exampleFrench: 'Son argument a réussi à nous convaincre.',
    exampleEnglish: 'His argument succeeded in convincing us.',
  },
  {
    id: 'b1-15-4',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'Autonome',
    english: 'Independent / Self-sufficient',
    phonetic: 'oh-toh-nohm',
    partOfSpeech: 'adj',
    exampleFrench: 'Au niveau B1, vous êtes un locuteur autonome !',
    exampleEnglish: 'At level B1, you are an independent speaker!',
  },
  {
    id: 'b1-15-5',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'En conclusion',
    english: 'In conclusion',
    phonetic: 'ahn kohn-klew-zyohn',
    partOfSpeech: 'phrase',
    exampleFrench: 'En conclusion, ce projet présente de vrais avantages.',
    exampleEnglish: 'In conclusion, this project presents real advantages.',
  },
  {
    id: 'b1-15-6',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'Nuancer son propos',
    english: 'To nuance / qualify one’s point',
    phonetic: 'new-ahn-say sohn proh-poh',
    partOfSpeech: 'verb',
    exampleFrench: 'Il sait nuancer son propos pendant le débat.',
    exampleEnglish: 'He knows how to nuance his point during the debate.',
  },
  {
    id: 'b1-15-7',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'D’une part… d’autre part',
    english: 'On the one hand… on the other hand',
    phonetic: 'dewn par… doh-truh par',
    partOfSpeech: 'phrase',
    exampleFrench: 'D’une part c’est utile, d’autre part c’est coûteux.',
    exampleEnglish: 'On the one hand it is useful, on the other hand it is costly.',
  },
  {
    id: 'b1-15-8',
    cefr: 'B1',
    lessonNumber: 15,
    theme: 'Opinions & Debate',
    french: 'Le point de vue',
    english: 'The point of view',
    phonetic: 'luh pwan duh vew',
    partOfSpeech: 'noun',
    exampleFrench: 'Je comprends tout à fait votre point de vue.',
    exampleEnglish: 'I completely understand your point of view.',
  },
];

export interface LessonCourseMaterial {
  lessonNumber: number; // 1..15
  cefr: CefrTier;
  title: string;
  subtitle: string;
  grammarTopic: string;
  grammarExplanation: string;
  keyPatterns: Array<{
    french: string;
    english: string;
    note: string;
  }>;
  dialogue: Array<{
    speaker: string;
    french: string;
    english: string;
  }>;
  culturalNote: string;
}

/**
 * Structured CEFR A1, A2 & B1 Course Study Materials for all 15 lessons:
 * Includes Grammar Rules, Key Patterns, Situational Mini-Dialogues, and Cultural Notes.
 */
export const FRENCH_COURSE_MATERIALS: LessonCourseMaterial[] = [
  {
    lessonNumber: 1,
    cefr: 'A1',
    title: 'Bonjour & Polite Salutations',
    subtitle: 'Formal vs. Informal Greetings in France',
    grammarTopic: 'Tu vs. Vous & Pronominal Introductions',
    grammarExplanation:
      'Use “vous” with strangers, shopkeepers, and elders (S’il vous plaît, Comment allez-vous ?). Use “tu” with friends, family, and peers (Salut, Comment ça va ?). To state your name, use the reflexive verb “s’appeler” (Je m’appelle…).',
    keyPatterns: [
      {
        french: 'Bonjour, comment allez-vous ?',
        english: 'Hello, how are you? (formal)',
        note: 'Standard polite greeting before 6 PM',
      },
      {
        french: 'Je m’appelle… Enchanté(e) !',
        english: 'My name is… Nice to meet you!',
        note: 'Add -e in writing if you are female (pronunciation stays identical)',
      },
      {
        french: 'Excusez-moi, s’il vous plaît.',
        english: 'Excuse me, please.',
        note: 'Essential polite opener before asking a question',
      },
    ],
    dialogue: [
      {
        speaker: 'Camille',
        french: 'Bonjour monsieur ! Je m’appelle Camille. Comment allez-vous ?',
        english: 'Hello sir! My name is Camille. How are you?',
      },
      {
        speaker: 'Lucas',
        french: 'Bonjour Camille, très bien merci ! Enchanté.',
        english: 'Hello Camille, very well thank you! Nice to meet you.',
      },
    ],
    culturalNote:
      'In France, always begin any interaction in a shop, bakery, or café with a warm “Bonjour, Madame / Monsieur” before making a request.',
  },
  {
    lessonNumber: 2,
    cefr: 'A1',
    title: 'Boulangerie, Café & Ordering Food',
    subtitle: 'Polite Conditional Requests & Partitive Articles',
    grammarTopic: 'Je voudrais + Indefinite & Partitive Articles (un, une, du, de la)',
    grammarExplanation:
      'Instead of saying “Je veux” (I want), use the polite conditional “Je voudrais” (I would like) or “Je prends” (I’ll have). Use “un/une” for countable items (un croissant, une baguette) and “du / de la / de l’” for uncountable food (du pain, de l’eau).',
    keyPatterns: [
      {
        french: 'Je voudrais un croissant chaud.',
        english: 'I would like a warm croissant.',
        note: 'Polite conditional of vouloir',
      },
      {
        french: 'Une carafe d’eau, s’il vous plaît.',
        english: 'A pitcher of tap water, please.',
        note: 'Free by law in all French restaurants',
      },
      {
        french: 'L’addition, s’il vous plaît.',
        english: 'The check / bill, please.',
        note: 'Servers only bring the bill when you ask for it',
      },
    ],
    dialogue: [
      {
        speaker: 'Serveur',
        french: 'Bonjour ! Qu’est-ce que vous prenez ce matin ?',
        english: 'Hello! What are you having this morning?',
      },
      {
        speaker: 'Client',
        french: 'Je voudrais un café et un croissant chaud, s’il vous plaît.',
        english: 'I would like a coffee and a warm croissant, please.',
      },
    ],
    culturalNote:
      'French café culture values unhurried time—your server will never rush you with the check until you explicitly ask for “L’addition, s’il vous plaît.”',
  },
  {
    lessonNumber: 3,
    cefr: 'A1',
    title: 'Family, Friends & Descriptions',
    subtitle: 'Possessive Adjectives & Gender Agreement',
    grammarTopic: 'Possessive Adjectives (mon/ma/mes) & Adjective Agreement',
    grammarExplanation:
      'Possessive adjectives agree in gender and number with the person or object possessed: “mon frère” (masculine), “ma sœur” (feminine), “mes grands-parents” (plural). Before a feminine noun starting with a vowel, use “mon” for smooth liaison (“mon amie”).',
    keyPatterns: [
      {
        french: 'Mon frère et ma sœur sont jeunes.',
        english: 'My brother and my sister are young.',
        note: 'Plural adjective adds -s',
      },
      {
        french: 'Ma famille habite à Lyon.',
        english: 'My family lives in Lyon.',
        note: 'Use “à” before city names',
      },
      {
        french: 'Nos voisins sont très sympathiques.',
        english: 'Our neighbors are very friendly.',
        note: 'Adjectives ending in -e stay the same in masculine & feminine',
      },
    ],
    dialogue: [
      {
        speaker: 'Sophie',
        french: 'Tu as des frères et sœurs ?',
        english: 'Do you have brothers and sisters?',
      },
      {
        speaker: 'Thomas',
        french: 'Oui, j’ai un frère et une sœur très sympathique !',
        english: 'Yes, I have a brother and a very friendly sister!',
      },
    ],
    culturalNote:
      'Sunday family lunch (“le déjeuner du dimanche”) remains a cherished tradition across France, often lasting several hours with grandparents and cousins.',
  },
  {
    lessonNumber: 4,
    cefr: 'A1',
    title: 'Time, Days & Weather Forecast',
    subtitle: '24-Hour Clock & Impersonal Weather Expressions',
    grammarTopic: 'Telling Time (Il est… heures) & Weather with “Il fait”',
    grammarExplanation:
      'French uses impersonal “Il” for both time and weather: “Quelle heure est-il ? — Il est huit heures.” For weather, combine “Il fait” + adjective (“Il fait beau”, “Il fait froid”) or “Il y a” + noun (“Il y a du soleil”).',
    keyPatterns: [
      {
        french: 'Quelle heure est-il ? Il est midi.',
        english: 'What time is it? It is noon.',
        note: 'Official schedules use the 24-hour clock (14h30)',
      },
      {
        french: 'Aujourd’hui, il fait très beau.',
        english: 'Today, the weather is very nice.',
        note: 'Impersonal expression with faire',
      },
      {
        french: 'Nous partons demain matin.',
        english: 'We leave tomorrow morning.',
        note: 'Present tense often expresses near future',
      },
    ],
    dialogue: [
      {
        speaker: 'Claire',
        french: 'Quel temps fait-il aujourd’hui à Nice ?',
        english: 'What is the weather like today in Nice?',
      },
      {
        speaker: 'Marc',
        french: 'Il fait beau et le soleil brille toute la journée !',
        english: 'The weather is nice and the sun is shining all day!',
      },
    ],
    culturalNote:
      'Train tickets, cinema times, and restaurant reservations in France almost always use the 24-hour clock (e.g., “20h00” instead of “8:00 PM”).',
  },
  {
    lessonNumber: 5,
    cefr: 'A1',
    title: 'Places in Town & Directions (A1 Exam Prep)',
    subtitle: 'Navigating Streets, Bridges & Landmarks',
    grammarTopic: 'Imperative Directions & Prepositions of Place (à, au, à la, près de)',
    grammarExplanation:
      'To give polite directions, use the “vous” imperative: “Tournez à gauche” (Turn left), “Continuez tout droit” (Continue straight ahead). Contract “à + le” into “au” (au musée) and “de + le” into “du” (près du pont).',
    keyPatterns: [
      {
        french: 'Où est la gare, s’il vous plaît ?',
        english: 'Where is the train station, please?',
        note: 'Où (with grave accent) = Where',
      },
      {
        french: 'Tournez à gauche après le pont.',
        english: 'Turn left after the bridge.',
        note: 'Polite imperative verb form',
      },
      {
        french: 'La pharmacie est tout droit, près d’ici.',
        english: 'The pharmacy is straight ahead, near here.',
        note: 'Essential street navigation phrase',
      },
    ],
    dialogue: [
      {
        speaker: 'Voyageur',
        french: 'Excusez-moi, où est la bibliothèque municipale ?',
        english: 'Excuse me, where is the public library?',
      },
      {
        speaker: 'Passante',
        french: 'Continuez tout droit et tournez à droite après le pont.',
        english: 'Continue straight ahead and turn right after the bridge.',
      },
    ],
    culturalNote:
      'Every French town center features clear signage toward “Centre-Ville” and “La Mairie” (Town Hall), making pedestrian navigation intuitive.',
  },
  {
    lessonNumber: 6,
    cefr: 'A2',
    title: 'Daily Routines & Reflexive Verbs',
    subtitle: 'Morning-to-Evening Habits & Pronominal Verbs',
    grammarTopic: 'Reflexive Verbs (se réveiller, se préparer, s’habiller, se coucher)',
    grammarExplanation:
      'Reflexive verbs use a reflexive pronoun matching the subject: “je me réveille”, “tu te prépares”, “il/elle s’habille”, “nous nous dépêchons”, “vous vous couchez”. In the negative, “ne… pas” wraps around the pronoun and verb (“Je ne me couche pas tard”).',
    keyPatterns: [
      {
        french: 'Je me réveille tôt tous les matins.',
        english: 'I wake up early every morning.',
        note: 'Reflexive pronoun me precedes the verb',
      },
      {
        french: 'Elle se prépare rapidement pour partir.',
        english: 'She gets ready quickly to leave.',
        note: 'Pour + infinitive expresses purpose (“in order to”)',
      },
      {
        french: 'Nous faisons les courses le samedi.',
        english: 'We do the grocery shopping on Saturdays.',
        note: '“Le + day of the week” means “every [day]”',
      },
    ],
    dialogue: [
      {
        speaker: 'Julien',
        french: 'À quelle heure est-ce que tu te réveilles en semaine ?',
        english: 'What time do you wake up on weekdays?',
      },
      {
        speaker: 'Élodie',
        french: 'Je me réveille à sept heures et je me prépare vite !',
        english: 'I wake up at seven o’clock and get ready quickly!',
      },
    ],
    culturalNote:
      'Many French shoppers prefer buying fresh produce several times a week at neighborhood markets (“les marchés de quartier”) rather than one giant monthly trip.',
  },
  {
    lessonNumber: 7,
    cefr: 'A2',
    title: 'Housing, Apartments & Neighborhoods',
    subtitle: 'Renting in France, Floor Numbers & Describing Rooms',
    grammarTopic: 'Relative Pronouns (qui / que) & Ordinal Floor Numbers',
    grammarExplanation:
      'Use “qui” as a subject (“un appartement qui est lumineux”) and “que” as a direct object (“le quartier que j’aime”). Remember that in France, “le rez-de-chaussée” is the ground floor, so “le premier étage” is one flight up!',
    keyPatterns: [
      {
        french: 'Nous louons un appartement lumineux.',
        english: 'We are renting a bright apartment.',
        note: 'Descriptive adjectives usually follow the noun',
      },
      {
        french: 'Le loyer comprend les charges.',
        english: 'The rent includes utilities.',
        note: 'Listed as “CC” (charges comprises) in French listings',
      },
      {
        french: 'J’habite au troisième étage avec ascenseur.',
        english: 'I live on the third floor with an elevator.',
        note: 'Au + ordinal number + étage',
      },
    ],
    dialogue: [
      {
        speaker: 'Agent',
        french: 'Voici le salon lumineux et la cuisine équipée.',
        english: 'Here is the bright living room and the fitted kitchen.',
      },
      {
        speaker: 'Locataire',
        french: 'Le quartier est très calme ! Est-ce que le loyer comprend les charges ?',
        english: 'The neighborhood is very quiet! Does the rent include utilities?',
      },
    ],
    culturalNote:
      'French apartment ads use “T2” or “F2” to mean a 2-room apartment (1 living room + 1 separate bedroom), not 2 bedrooms!',
  },
  {
    lessonNumber: 8,
    cefr: 'A2',
    title: 'SNCF Trains, Stations & Travel',
    subtitle: 'Buying TGV Tickets, Platforms & Connections',
    grammarTopic: 'Futur Proche (aller + infinitive) & Time Prepositions',
    grammarExplanation:
      'Use “aller + infinitive” to talk about upcoming travel plans (“Nous allons prendre le TGV”). At the station, listen for announcements of “la voie” (platform/track) and “une correspondance” (a connecting train).',
    keyPatterns: [
      {
        french: 'Un billet aller-retour pour Nice, s’il vous plaît.',
        english: 'A round-trip ticket to Nice, please.',
        note: 'Aller simple = one-way; Aller-retour = round-trip',
      },
      {
        french: 'Le train part de la voie numéro quatre.',
        english: 'The train departs from platform number four.',
        note: 'Partir de = to depart from',
      },
      {
        french: 'Nous avons une correspondance à Marseille.',
        english: 'We have a connection in Marseille.',
        note: 'Essential for multi-leg rail journeys',
      },
    ],
    dialogue: [
      {
        speaker: 'Voyageuse',
        french: 'À quelle heure part le prochain TGV pour Lyon ?',
        english: 'At what time does the next TGV to Lyon leave?',
      },
      {
        speaker: 'Guichetier',
        french: 'Il part à dix heures quinze, voie B. Il est bien à l’heure.',
        english: 'It leaves at 10:15, platform B. It is right on time.',
      },
    ],
    culturalNote:
      'France’s high-speed TGV network connects Paris to Lyon in 2 hours and Marseille in 3 hours, making rail the preferred way to travel between cities.',
  },
  {
    lessonNumber: 9,
    cefr: 'A2',
    title: 'Health, Pharmacy & At the Doctor',
    subtitle: 'Describing Symptoms, Prescriptions & Advice',
    grammarTopic: 'Avoir mal à + Body Part & Obligation with “Devoir / Il faut”',
    grammarExplanation:
      'To express pain, use “avoir mal à” + definite article: “J’ai mal à la tête” (feminine), “J’ai mal au dos” (masculine), “J’ai mal aux yeux” (plural). Doctors give advice using “Vous devez + infinitive” (You must) or “Il faut + infinitive”.',
    keyPatterns: [
      {
        french: 'J’ai rendez-vous chez le médecin.',
        english: 'I have an appointment with the doctor.',
        note: 'Use “chez” + person/profession',
      },
      {
        french: 'Il a de la fièvre et mal à la gorge.',
        english: 'He has a fever and a sore throat.',
        note: 'Avoir de la fièvre = to have a fever',
      },
      {
        french: 'Vous devez vous reposer pendant trois jours.',
        english: 'You must rest for three days.',
        note: 'Devoir + reflexive infinitive',
      },
    ],
    dialogue: [
      {
        speaker: 'Médecin',
        french: 'Qu’est-ce qui ne va pas aujourd’hui ?',
        english: 'What seems to be the problem today?',
      },
      {
        speaker: 'Patient',
        french: 'J’ai de la fièvre et j’ai mal à la gorge depuis hier soir.',
        english: 'I have a fever and a sore throat since last night.',
      },
    ],
    culturalNote:
      'In France, pharmacies (marked by a glowing green cross) are your first stop for minor ailments; pharmacists are trained to give medical advice and suggest treatments.',
  },
  {
    lessonNumber: 10,
    cefr: 'A2',
    title: 'Feelings, Memories & Leisure (A2 Exam Prep)',
    subtitle: 'Passé Composé vs. Imparfait for Storytelling',
    grammarTopic: 'Passé Composé (Completed Events) vs. Imparfait (Descriptions & Memories)',
    grammarExplanation:
      'When recounting past experiences at A2 level, use the “imparfait” to set the scene and describe feelings (“C’était une soirée inoubliable, il faisait beau”) and the “passé composé” for specific actions (“Nous avons visité le Louvre”).',
    keyPatterns: [
      {
        french: 'C’était une soirée inoubliable.',
        english: 'It was an unforgettable evening.',
        note: 'C’était (imparfait) describes background & impressions',
      },
      {
        french: 'Elle est très fière de ses progrès.',
        english: 'She is very proud of her progress.',
        note: 'Être fier / fière de + noun or infinitive',
      },
      {
        french: 'Je me souviens de notre premier voyage.',
        english: 'I remember our first trip.',
        note: 'Se souvenir de takes “de” before its object',
      },
    ],
    dialogue: [
      {
        speaker: 'Nadia',
        french: 'Tu te souviens de nos vacances en Bretagne ?',
        english: 'Do you remember our vacation in Brittany?',
      },
      {
        speaker: 'Hugo',
        french: 'Bien sûr ! C’était un voyage inoubliable avec toute la famille.',
        english: 'Of course! It was an unforgettable trip with the whole family.',
      },
    ],
    culturalNote:
      'Sharing meals and cultural outings (“les sorties culturelles”) is central to French friendships and conversation.',
  },
  {
    lessonNumber: 11,
    cefr: 'B1',
    title: 'Education, Work & Career Fluency',
    subtitle: 'Job Interviews, Remote Work & Professional Projects',
    grammarTopic: 'Recent Past (Venir de + Infinitive) & Professional Connectors',
    grammarExplanation:
      'To highlight recent achievements in an interview, use “venir de + infinitive” (“Je viens de terminer mon projet professionnel”). Use “réussir à” (to succeed in) and “postuler à” (to apply for) when discussing career milestones.',
    keyPatterns: [
      {
        french: 'Je viens de terminer mon projet professionnel.',
        english: 'I have just finished my professional project.',
        note: 'Venir de + infinitive = to have just done',
      },
      {
        french: 'J’ai réussi mon entretien d’embauche.',
        english: 'I passed my job interview.',
        note: 'Réussir un examen / un entretien = to pass',
      },
      {
        french: 'Le télétravail offre plus de flexibilité.',
        english: 'Remote work offers more flexibility.',
        note: 'Key B1 workplace discussion topic',
      },
    ],
    dialogue: [
      {
        speaker: 'Recruteuse',
        french: 'Quelle compétence souhaitez-vous apporter à notre équipe ?',
        english: 'What skill do you wish to bring to our team?',
      },
      {
        speaker: 'Candidat',
        french: 'Je viens de diriger un projet numérique et j’aime le travail d’équipe.',
        english: 'I have just led a digital project and I love teamwork.',
      },
    ],
    culturalNote:
      'French CVs are typically concise (one page) and accompanied by a structured cover letter (“une lettre de motivation”) tailored to the company.',
  },
  {
    lessonNumber: 12,
    cefr: 'B1',
    title: 'Environment, Climate & Ecology',
    subtitle: 'Discussing Sustainability, Energy & Civic Action',
    grammarTopic: 'Expressing Necessity & Purpose (Il faut que + Subjunctive / Pour + Infinitive)',
    grammarExplanation:
      'At B1 level, express collective responsibility with “Il faut + infinitive” (“Il faut protéger l’environnement”) or “Il est essentiel de + infinitive”. Use “pour + infinitive” to state the goal (“pour réduire notre empreinte carbone”).',
    keyPatterns: [
      {
        french: 'Il faut protéger l’environnement pour l’avenir.',
        english: 'We must protect the environment for the future.',
        note: 'General obligation structure',
      },
      {
        french: 'Prendre le train réduit notre empreinte carbone.',
        english: 'Taking the train reduces our carbon footprint.',
        note: 'Infinitive verb used as a sentence subject',
      },
      {
        french: 'Le tri sélectif est obligatoire ici.',
        english: 'Recycling / waste sorting is mandatory here.',
        note: 'Everyday civic vocabulary in France',
      },
    ],
    dialogue: [
      {
        speaker: 'Léa',
        french: 'Que fais-tu au quotidien pour économiser l’énergie ?',
        english: 'What do you do daily to save energy?',
      },
      {
        speaker: 'Antoine',
        french: 'Je privilégie le train, je fais le tri sélectif et j’évite de gaspiller l’eau.',
        english: 'I favor the train, sort recycling, and avoid wasting water.',
      },
    ],
    culturalNote:
      'France has banned single-use plastic tableware in fast-food restaurants for dine-in meals, serving reusable dishes to cut waste.',
  },
  {
    lessonNumber: 13,
    cefr: 'B1',
    title: 'Digital Media, News & Technology',
    subtitle: 'Analyzing Information, AI & Online Privacy',
    grammarTopic: 'Impersonal Judgments (Il est important de…) & Passive Structures',
    grammarExplanation:
      'Evaluate media and technology using “Il est important / indispensable de + infinitive” (“Il est important de vérifier une source”). Describe ongoing societal shifts with reflexive or passive structures (“Les nouvelles se diffusent en direct”).',
    keyPatterns: [
      {
        french: 'Il est important de vérifier une source.',
        english: 'It is important to verify a source.',
        note: 'Il est + adjective + de + infinitive',
      },
      {
        french: 'Les réseaux sociaux transforment la communication.',
        english: 'Social networks are transforming communication.',
        note: 'Plural masculine noun phrase',
      },
      {
        french: 'Protégez vos données et votre vie privée.',
        english: 'Protect your data and your privacy.',
        note: 'Essential digital literacy vocabulary',
      },
    ],
    dialogue: [
      {
        speaker: 'Journaliste',
        french: 'Comment suivez-vous l’actualité internationale chaque matin ?',
        english: 'How do you follow international news every morning?',
      },
      {
        speaker: 'Lectrice',
        french: 'J’ai un abonnement numérique, mais je vérifie toujours les sources.',
        english: 'I have a digital subscription, but I always verify the sources.',
      },
    ],
    culturalNote:
      'French media culture features strong public radio debate programs (like France Inter and France Culture) where listeners and experts analyze current events.',
  },
  {
    lessonNumber: 14,
    cefr: 'B1',
    title: 'Culture, Heritage & Arts',
    subtitle: 'Museums, Literature, Masterpieces & Society',
    grammarTopic: 'Partitive & Cultural Expressions (faire partie de, marquer l’histoire)',
    grammarExplanation:
      'Use “faire partie de” (to be part of) when linking monuments or traditions to broader heritage (“Ce château fait partie du patrimoine français”). Combine past and present tenses to connect historical works with contemporary society.',
    keyPatterns: [
      {
        french: 'Ce château fait partie du patrimoine français.',
        english: 'This castle is part of French heritage.',
        note: 'Faire partie de + du/de la/des',
      },
      {
        french: 'Nous avons visité une exposition au Louvre.',
        english: 'We visited an exhibition at the Louvre.',
        note: 'Passé composé with avoir',
      },
      {
        french: 'La diversité culturelle enrichit la société.',
        english: 'Cultural diversity enriches society.',
        note: 'Regular -ir verb (enrichir)',
      },
    ],
    dialogue: [
      {
        speaker: 'Clara',
        french: 'As-tu vu la nouvelle exposition au musée d’Orsay ?',
        english: 'Have you seen the new exhibition at the Musée d’Orsay?',
      },
      {
        speaker: 'Mehdi',
        french: 'Oui, chaque tableau est un véritable chef-d’œuvre du patrimoine !',
        english: 'Yes, every painting is a true masterpiece of heritage!',
      },
    ],
    culturalNote:
      'Every September during “Les Journées du Patrimoine” (European Heritage Days), historic palaces, ministries, and castles across France open their doors to the public.',
  },
  {
    lessonNumber: 15,
    cefr: 'B1',
    title: 'Expressing Opinions & Debating (B1 Diploma)',
    subtitle: 'Concession, Subjunctive & Structured Arguments',
    grammarTopic: 'Subjunctive (Le Subjonctif) with “Bien que” & Logical Connectors (En revanche, À mon avis)',
    grammarExplanation:
      'To earn your CEFR B1 Diploma, structure nuanced arguments using opinion openers (“À mon avis”, “Selon moi”), contrast connectors (“En revanche”, “D’une part… d’autre part”), and concession with the subjunctive (subjonctif: “Bien qu’il pleuve…”).',
    keyPatterns: [
      {
        french: 'À mon avis, cette solution est efficace.',
        english: 'In my opinion, this solution is effective.',
        note: 'Core B1 opinion starter',
      },
      {
        french: 'Bien qu’il pleuve, nous allons marcher dans Paris.',
        english: 'Although it is raining, we are going to walk in Paris.',
        note: 'Bien que + subjunctive mood (pleuve)',
      },
      {
        french: 'Le train est cher ; en revanche, il est rapide.',
        english: 'The train is expensive; on the other hand, it is fast.',
        note: 'En revanche introduces a positive counter-argument',
      },
    ],
    dialogue: [
      {
        speaker: 'Modérateur',
        french: 'Quel est votre point de vue sur ce projet urbain ?',
        english: 'What is your point of view on this urban project?',
      },
      {
        speaker: 'Intervenante',
        french: 'À mon avis, d’une part il est ambitieux, et d’autre part il est durable.',
        english: 'In my opinion, on the one hand it is ambitious, and on the other hand it is sustainable.',
      },
    ],
    culturalNote:
      'In French education and conversation, structuring thoughts into “thèse, antithèse, synthèse” (point, counterpoint, synthesis) is admired as a sign of clarity and respect.',
  },
];

/**
 * Helper to filter CEFR vocabulary items by tier and/or search query.
 */
export function filterCefrVocabulary(
  tierFilter: 'ALL' | CefrTier,
  searchQuery: string = ''
): FrenchVocabItem[] {
  const q = searchQuery.trim().toLowerCase();
  return FRENCH_CEFR_VOCAB_LIST.filter((item) => {
    const matchesTier = tierFilter === 'ALL' || item.cefr === tierFilter;
    if (!matchesTier) return false;
    if (!q) return true;
    return (
      item.french.toLowerCase().includes(q) ||
      item.english.toLowerCase().includes(q) ||
      item.theme.toLowerCase().includes(q) ||
      item.exampleFrench.toLowerCase().includes(q)
    );
  });
}

/**
 * Returns the vocabulary items belonging to a specific lesson number (1..15).
 * For bonus review levels (16..20), maps deterministically to the 1..15 curriculum.
 */
export function getLessonVocabulary(lessonNumber: number): FrenchVocabItem[] {
  const normalizedLesson = ((Math.max(1, lessonNumber) - 1) % 15) + 1;
  const exact = FRENCH_CEFR_VOCAB_LIST.filter(
    (item) => item.lessonNumber === normalizedLesson
  );
  if (exact.length > 0) return exact;
  return FRENCH_CEFR_VOCAB_LIST.slice(0, 8);
}

/**
 * Returns the structured Course Material study guide for a given lesson number (1..15).
 */
export function getLessonCourseMaterial(
  lessonNumber: number
): LessonCourseMaterial {
  const normalizedLesson = ((Math.max(1, lessonNumber) - 1) % 15) + 1;
  return (
    FRENCH_COURSE_MATERIALS.find(
      (item) => item.lessonNumber === normalizedLesson
    ) || FRENCH_COURSE_MATERIALS[0]
  );
}

/**
 * Filters the 15 Lesson Course Materials by CEFR tier and optional search query.
 */
export function filterCourseMaterials(
  tierFilter: 'ALL' | CefrTier,
  searchQuery: string = ''
): LessonCourseMaterial[] {
  const q = searchQuery.trim().toLowerCase();
  return FRENCH_COURSE_MATERIALS.filter((item) => {
    const matchesTier = tierFilter === 'ALL' || item.cefr === tierFilter;
    if (!matchesTier) return false;
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.grammarTopic.toLowerCase().includes(q) ||
      item.grammarExplanation.toLowerCase().includes(q) ||
      item.culturalNote.toLowerCase().includes(q) ||
      item.keyPatterns.some(
        (p) =>
          p.french.toLowerCase().includes(q) ||
          p.english.toLowerCase().includes(q) ||
          p.note.toLowerCase().includes(q)
      ) ||
      item.dialogue.some(
        (d) =>
          d.french.toLowerCase().includes(q) ||
          d.english.toLowerCase().includes(q)
      )
    );
  });
}

