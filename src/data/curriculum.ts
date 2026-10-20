export interface TranslationOption {
  id: string;
  text: string;
  pronunciation: string;
  categoryIcon:
    | 'coffee'
    | 'bread'
    | 'water'
    | 'apple'
    | 'train'
    | 'ticket'
    | 'hotel'
    | 'greeting'
    | 'book'
    | 'sun'
    | 'cat'
    | 'city';
}

export interface WordHint {
  word: string;
  meaning: string;
}

export interface LessonQuestion {
  id: string;
  promptInstruction: string;
  sourceSentence: string;
  sourceLanguageLabel: string;
  wordHints: WordHint[];
  options: [
    TranslationOption,
    TranslationOption,
    TranslationOption,
    TranslationOption
  ];
  correctIndex: number;
  grammarNote: string;
}

export interface PathNodeData {
  index: number;
  id: string;
  unitNumber: number;
  unitTitle: string;
  unitDescription: string;
  title: string;
  subtitle: string;
  xpReward: number;
  iconType: 'star' | 'book' | 'chat' | 'trophy' | 'compass' | 'utensils';
  questions: LessonQuestion[];
}

export interface LanguageCourse {
  id: 'fr';
  name: string;
  nativeName: string;
  speechLang: string;
  flagCode: string;
  nodes: PathNodeData[];
}

/**
 * Master pool of 24 French questions used across the 20 French Levels and the 7-round Random 1v1 Duel Arena.
 */
export const FRENCH_MASTER_QUESTIONS: LessonQuestion[] = [
  {
    id: 'fr-q-1',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Bonjour, un croissant et un café, s’il vous plaît.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Bonjour,', meaning: 'Hello / Good morning,' },
      { word: 'un croissant', meaning: 'a croissant' },
      { word: 'et un café,', meaning: 'and a coffee,' },
      { word: 's’il vous plaît.', meaning: 'please.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Hello, a croissant and a coffee, please.',
        pronunciation: 'Boulangerie · Morning order',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-1',
        text: 'Good evening, do you have a table?',
        pronunciation: 'Bistro · Dinner inquiry',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-2',
        text: 'Where is the train to Lyon?',
        pronunciation: 'Gare · Transit',
        categoryIcon: 'train',
      },
      {
        id: 'opt-3',
        text: 'I am reading a French novel.',
        pronunciation: 'Literature · Study',
        categoryIcon: 'book',
      },
    ],
    correctIndex: 0,
    grammarNote: '“S’il vous plaît” is the polite expression for “please” in French.',
  },
  {
    id: 'fr-q-2',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Salut, comment ça va aujourd’hui ?',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Salut,', meaning: 'Hi,' },
      { word: 'comment ça va', meaning: 'how is it going' },
      { word: 'aujourd’hui ?', meaning: 'today?' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The cat is sleeping in the garden.',
        pronunciation: 'Home · Pets',
        categoryIcon: 'cat',
      },
      {
        id: 'opt-1',
        text: 'Hi, how is it going today?',
        pronunciation: 'Casual greeting · Friends',
        categoryIcon: 'greeting',
      },
      {
        id: 'opt-2',
        text: 'One bottle of cold water, please.',
        pronunciation: 'Café · Refreshment',
        categoryIcon: 'water',
      },
      {
        id: 'opt-3',
        text: 'Two tickets for the Louvre museum.',
        pronunciation: 'Paris · Sightseeing',
        categoryIcon: 'ticket',
      },
    ],
    correctIndex: 1,
    grammarNote: '“Comment ça va ?” is the everyday informal way to ask “How are you?”.',
  },
  {
    id: 'fr-q-3',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Enchanté, je m’appelle Lucas.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Enchanté,', meaning: 'Nice to meet you,' },
      { word: 'je m’appelle', meaning: 'my name is' },
      { word: 'Lucas.', meaning: 'Lucas.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Nice to meet you, my name is Lucas.',
        pronunciation: 'Introduction · First meeting',
        categoryIcon: 'greeting',
      },
      {
        id: 'opt-1',
        text: 'Where is the hotel reception?',
        pronunciation: 'Travel · Lodging',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-2',
        text: 'The warm bread smells wonderful.',
        pronunciation: 'Bakery · Morning',
        categoryIcon: 'bread',
      },
      {
        id: 'opt-3',
        text: 'We take the train at noon.',
        pronunciation: 'Station · Schedule',
        categoryIcon: 'train',
      },
    ],
    correctIndex: 0,
    grammarNote: '“Je m’appelle” literally means “I call myself”.',
  },
  {
    id: 'fr-q-4',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Merci beaucoup et bonne journée !',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Merci beaucoup', meaning: 'Thank you very much' },
      { word: 'et bonne journée !', meaning: 'and have a good day!' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'I would like a red apple, please.',
        pronunciation: 'Market · Fruit',
        categoryIcon: 'apple',
      },
      {
        id: 'opt-1',
        text: 'Thank you very much and have a good day!',
        pronunciation: 'Polite farewell · Everyday',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-2',
        text: 'Do you speak English or French?',
        pronunciation: 'Conversation · Question',
        categoryIcon: 'greeting',
      },
      {
        id: 'opt-3',
        text: 'The train arrives in five minutes.',
        pronunciation: 'Transit · Platform',
        categoryIcon: 'train',
      },
    ],
    correctIndex: 1,
    grammarNote: 'Use “Bonne journée” when parting ways during the daytime.',
  },
  {
    id: 'fr-q-5',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Je voudrais une baguette chaude, s’il vous plaît.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Je voudrais', meaning: 'I would like' },
      { word: 'une baguette chaude,', meaning: 'a warm baguette,' },
      { word: 's’il vous plaît.', meaning: 'please.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'I would like a warm baguette, please.',
        pronunciation: 'Boulangerie · Essential order',
        categoryIcon: 'bread',
      },
      {
        id: 'opt-1',
        text: 'She is drinking tea on the terrace.',
        pronunciation: 'Café · Afternoon',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-2',
        text: 'Our hotel is near the Eiffel Tower.',
        pronunciation: 'Paris · Landmark',
        categoryIcon: 'city',
      },
      {
        id: 'opt-3',
        text: 'The book is on the wooden table.',
        pronunciation: 'Study · Object',
        categoryIcon: 'book',
      },
    ],
    correctIndex: 0,
    grammarNote: 'Adjectives like “chaude” (warm) agree in gender with feminine nouns (“une baguette”).',
  },
  {
    id: 'fr-q-6',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'L’addition et une carafe d’eau, s’il vous plaît.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'L’addition', meaning: 'The check / bill' },
      { word: 'et une carafe d’eau,', meaning: 'and a pitcher of water,' },
      { word: 's’il vous plaît.', meaning: 'please.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Where can I buy a metro ticket?',
        pronunciation: 'Transit · Kiosk',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-1',
        text: 'The check and a pitcher of water, please.',
        pronunciation: 'Bistro · Table service',
        categoryIcon: 'water',
      },
      {
        id: 'opt-2',
        text: 'The sun is shining over Paris.',
        pronunciation: 'Weather · Outdoors',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-3',
        text: 'My cat loves eating cheese.',
        pronunciation: 'Home · Pets',
        categoryIcon: 'cat',
      },
    ],
    correctIndex: 1,
    grammarNote: 'Asking for “une carafe d’eau” in France gets you free tap water at any bistro.',
  },
  {
    id: 'fr-q-7',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Avez-vous une table pour deux personnes ?',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Avez-vous', meaning: 'Do you have' },
      { word: 'une table', meaning: 'a table' },
      { word: 'pour deux personnes ?', meaning: 'for two people?' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Do you have a table for two people?',
        pronunciation: 'Restaurant · Reservation',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-1',
        text: 'I want two coffees with milk.',
        pronunciation: 'Café · Morning',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-2',
        text: 'The museum opens at nine o’clock.',
        pronunciation: 'Culture · Hours',
        categoryIcon: 'city',
      },
      {
        id: 'opt-3',
        text: 'These red apples are very sweet.',
        pronunciation: 'Market · Produce',
        categoryIcon: 'apple',
      },
    ],
    correctIndex: 0,
    grammarNote: '“Avez-vous” uses formal inversion of verb and pronoun to ask a polite question.',
  },
  {
    id: 'fr-q-8',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Les pommes rouges sont très sucrées.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Les pommes rouges', meaning: 'The red apples' },
      { word: 'sont', meaning: 'are' },
      { word: 'très sucrées.', meaning: 'very sweet.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The train to Marseille is very fast.',
        pronunciation: 'TGV · Express',
        categoryIcon: 'train',
      },
      {
        id: 'opt-1',
        text: 'The red apples are very sweet.',
        pronunciation: 'Marché · Fresh fruit',
        categoryIcon: 'apple',
      },
      {
        id: 'opt-2',
        text: 'We are reading the menu together.',
        pronunciation: 'Bistro · Dining',
        categoryIcon: 'book',
      },
      {
        id: 'opt-3',
        text: 'Good evening, how was your day?',
        pronunciation: 'Greeting · Evening',
        categoryIcon: 'greeting',
      },
    ],
    correctIndex: 1,
    grammarNote: 'Plural feminine nouns like “les pommes” take plural feminine adjectives (“rouges”, “sucrées”).',
  },
  {
    id: 'fr-q-9',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Où est la gare du Nord, s’il vous plaît ?',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Où est', meaning: 'Where is' },
      { word: 'la gare du Nord,', meaning: 'the North train station,' },
      { word: 's’il vous plaît ?', meaning: 'please?' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Where is the North train station, please?',
        pronunciation: 'Paris · Navigation',
        categoryIcon: 'train',
      },
      {
        id: 'opt-1',
        text: 'Can I have a glass of cold water?',
        pronunciation: 'Dining · Drink',
        categoryIcon: 'water',
      },
      {
        id: 'opt-2',
        text: 'I have a hotel reservation tonight.',
        pronunciation: 'Lodging · Check-in',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-3',
        text: 'The bakery is closed on Mondays.',
        pronunciation: 'City · Schedule',
        categoryIcon: 'bread',
      },
    ],
    correctIndex: 0,
    grammarNote: '“Où” with an accent grave means “where”; without an accent (“ou”) it means “or”.',
  },
  {
    id: 'fr-q-10',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Je prends deux billets pour Nice.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Je prends', meaning: 'I am taking / buying' },
      { word: 'deux billets', meaning: 'two tickets' },
      { word: 'pour Nice.', meaning: 'for / to Nice.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The cat is sleeping under the chair.',
        pronunciation: 'Home · Cozy',
        categoryIcon: 'cat',
      },
      {
        id: 'opt-1',
        text: 'I am buying two tickets to Nice.',
        pronunciation: 'Gare · Ticket counter',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-2',
        text: 'We drink espresso every morning.',
        pronunciation: 'Routine · Café',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-3',
        text: 'This book tells the history of Paris.',
        pronunciation: 'Culture · Reading',
        categoryIcon: 'book',
      },
    ],
    correctIndex: 1,
    grammarNote: 'Native speakers frequently use “Je prends” (I’ll take) when buying tickets or ordering.',
  },
  {
    id: 'fr-q-11',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'L’hôtel est près de la tour Eiffel.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'L’hôtel', meaning: 'The hotel' },
      { word: 'est près de', meaning: 'is near' },
      { word: 'la tour Eiffel.', meaning: 'the Eiffel Tower.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The hotel is near the Eiffel Tower.',
        pronunciation: 'Paris · Prime location',
        categoryIcon: 'city',
      },
      {
        id: 'opt-1',
        text: 'At what time does the train leave?',
        pronunciation: 'Transit · Schedule',
        categoryIcon: 'train',
      },
      {
        id: 'opt-2',
        text: 'Please bring some fresh bread.',
        pronunciation: 'Bistro · Table',
        categoryIcon: 'bread',
      },
      {
        id: 'opt-3',
        text: 'Good morning, welcome to France!',
        pronunciation: 'Greeting · Arrival',
        categoryIcon: 'greeting',
      },
    ],
    correctIndex: 0,
    grammarNote: '“Près de” means “near / close to” and contracts with masculine articles when needed.',
  },
  {
    id: 'fr-q-12',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'J’ai une réservation pour trois nuits.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'J’ai', meaning: 'I have' },
      { word: 'une réservation', meaning: 'a reservation' },
      { word: 'pour trois nuits.', meaning: 'for three nights.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'I am looking for the metro station.',
        pronunciation: 'Street · Directions',
        categoryIcon: 'train',
      },
      {
        id: 'opt-1',
        text: 'I have a reservation for three nights.',
        pronunciation: 'Hotel · Reception',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-2',
        text: 'The weather is warm and sunny today.',
        pronunciation: 'Outdoors · Forecast',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-3',
        text: 'One cup of hot chocolate, please.',
        pronunciation: 'Café · Winter drink',
        categoryIcon: 'coffee',
      },
    ],
    correctIndex: 1,
    grammarNote: '“J’ai” is the elided form of “Je ai” (I have, from “avoir”).',
  },
  {
    id: 'fr-q-13',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'À quelle heure part le prochain train ?',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'À quelle heure', meaning: 'At what time' },
      { word: 'part', meaning: 'leaves' },
      { word: 'le prochain train ?', meaning: 'the next train?' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'At what time does the next train leave?',
        pronunciation: 'Gare · Departure board',
        categoryIcon: 'train',
      },
      {
        id: 'opt-1',
        text: 'Where is the museum entrance?',
        pronunciation: 'Tourism · Culture',
        categoryIcon: 'city',
      },
      {
        id: 'opt-2',
        text: 'I like reading in the park.',
        pronunciation: 'Jardin · Leisure',
        categoryIcon: 'book',
      },
      {
        id: 'opt-3',
        text: 'Can we have two glasses of water?',
        pronunciation: 'Restaurant · Drink',
        categoryIcon: 'water',
      },
    ],
    correctIndex: 0,
    grammarNote: '“Part” is the third-person singular present conjugation of “partir” (to leave).',
  },
  {
    id: 'fr-q-14',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'J’aime lire un livre au soleil.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'J’aime lire', meaning: 'I love reading' },
      { word: 'un livre', meaning: 'a book' },
      { word: 'au soleil.', meaning: 'in the sun.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The black cat is on the roof.',
        pronunciation: 'Paris · Rooftops',
        categoryIcon: 'cat',
      },
      {
        id: 'opt-1',
        text: 'I like reading a book in the sun.',
        pronunciation: 'Luxembourg Gardens · Leisure',
        categoryIcon: 'book',
      },
      {
        id: 'opt-2',
        text: 'We need two metro tickets, please.',
        pronunciation: 'Transit · Paris',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-3',
        text: 'Breakfast is served at eight.',
        pronunciation: 'Hotel · Morning',
        categoryIcon: 'bread',
      },
    ],
    correctIndex: 1,
    grammarNote: '“Au soleil” combines “à + le soleil” to mean “in the sun”.',
  },
  {
    id: 'fr-q-15',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Le chat dort près de la fenêtre.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Le chat', meaning: 'The cat' },
      { word: 'dort', meaning: 'sleeps' },
      { word: 'près de la fenêtre.', meaning: 'near the window.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The cat sleeps near the window.',
        pronunciation: 'Appartement · Cozy scene',
        categoryIcon: 'cat',
      },
      {
        id: 'opt-1',
        text: 'This city is beautiful at night.',
        pronunciation: 'Paris · Illuminations',
        categoryIcon: 'city',
      },
      {
        id: 'opt-2',
        text: 'I eat a fresh apple every morning.',
        pronunciation: 'Health · Routine',
        categoryIcon: 'apple',
      },
      {
        id: 'opt-3',
        text: 'Do you have a room available?',
        pronunciation: 'Hotel · Inquiry',
        categoryIcon: 'hotel',
      },
    ],
    correctIndex: 0,
    grammarNote: '“Dort” comes from the verb “dormir” (to sleep); the final “t” is silent.',
  },
  {
    id: 'fr-q-16',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Nous visitons le musée du Louvre demain.',
    sourceLanguageLabel: 'French',
    wordHints: [
      { word: 'Nous visitons', meaning: 'We are visiting' },
      { word: 'le musée du Louvre', meaning: 'the Louvre museum' },
      { word: 'demain.', meaning: 'tomorrow.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'We are visiting the Louvre museum tomorrow.',
        pronunciation: 'Culture · Itinerary',
        categoryIcon: 'city',
      },
      {
        id: 'opt-1',
        text: 'The coffee and croissants are ready.',
        pronunciation: 'Breakfast · Table',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-2',
        text: 'Where can I find a taxi tonight?',
        pronunciation: 'Evening · Transport',
        categoryIcon: 'train',
      },
      {
        id: 'opt-3',
        text: 'Please give me the hotel key.',
        pronunciation: 'Reception · Room',
        categoryIcon: 'hotel',
      },
    ],
    correctIndex: 0,
    grammarNote: 'French frequently uses the present tense with “demain” (tomorrow) to express near-future plans.',
  },
  {
    id: 'fr-q-17',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'À mon avis, ce film français est passionnant.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'À mon avis,', meaning: 'In my opinion,' },
      { word: 'ce film français', meaning: 'this French movie' },
      { word: 'est passionnant.', meaning: 'is fascinating.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'In my opinion, this French movie is fascinating.',
        pronunciation: 'B1 · Expressing opinions',
        categoryIcon: 'book',
      },
      {
        id: 'opt-1',
        text: 'The bakery opens early every morning.',
        pronunciation: 'A1 · Routine',
        categoryIcon: 'bread',
      },
      {
        id: 'opt-2',
        text: 'We are waiting for the train to Bordeaux.',
        pronunciation: 'A2 · Travel',
        categoryIcon: 'train',
      },
      {
        id: 'opt-3',
        text: 'Can you bring a pitcher of water?',
        pronunciation: 'A1 · Bistro',
        categoryIcon: 'water',
      },
    ],
    correctIndex: 0,
    grammarNote: '“À mon avis” is a core B1 connector used to introduce your personal viewpoint.',
  },
  {
    id: 'fr-q-18',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'Bien qu’il pleuve, nous allons marcher dans Paris.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'Bien qu’il pleuve,', meaning: 'Although it is raining,' },
      { word: 'nous allons marcher', meaning: 'we are going to walk' },
      { word: 'dans Paris.', meaning: 'in Paris.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'I would like two croissants and a coffee.',
        pronunciation: 'A1 · Bakery',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-1',
        text: 'Although it is raining, we are going to walk in Paris.',
        pronunciation: 'B1 · Subjunctive & Concession',
        categoryIcon: 'city',
      },
      {
        id: 'opt-2',
        text: 'The cat is sleeping near the warm fireplace.',
        pronunciation: 'A2 · Home',
        categoryIcon: 'cat',
      },
      {
        id: 'opt-3',
        text: 'Where is the nearest metro entrance?',
        pronunciation: 'A2 · Transit',
        categoryIcon: 'ticket',
      },
    ],
    correctIndex: 1,
    grammarNote: '“Bien que” (although) is followed by the subjunctive mood (“pleuve”) at CEFR B1 level.',
  },
  {
    id: 'fr-q-19',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'Il faut protéger l’environnement pour l’avenir.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'Il faut', meaning: 'We must / It is necessary to' },
      { word: 'protéger l’environnement', meaning: 'protect the environment' },
      { word: 'pour l’avenir.', meaning: 'for the future.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'We must protect the environment for the future.',
        pronunciation: 'B1 · Society & Environment',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-1',
        text: 'Do you have a room for tonight?',
        pronunciation: 'A2 · Hotel',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-2',
        text: 'The red apples are on the table.',
        pronunciation: 'A1 · Market',
        categoryIcon: 'apple',
      },
      {
        id: 'opt-3',
        text: 'Thank you very much and see you tomorrow.',
        pronunciation: 'A1 · Politeness',
        categoryIcon: 'greeting',
      },
    ],
    correctIndex: 0,
    grammarNote: '“Il faut + infinitive” expresses necessity or obligation.',
  },
  {
    id: 'fr-q-20',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'Je viens de terminer mon projet professionnel.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'Je viens de', meaning: 'I have just' },
      { word: 'terminer', meaning: 'finished' },
      { word: 'mon projet professionnel.', meaning: 'my professional project.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'We are taking the morning train to Lyon.',
        pronunciation: 'A2 · Transit',
        categoryIcon: 'train',
      },
      {
        id: 'opt-1',
        text: 'I have just finished my professional project.',
        pronunciation: 'B1 · Workplace & Recent Past',
        categoryIcon: 'book',
      },
      {
        id: 'opt-2',
        text: 'Hello, how are you doing today?',
        pronunciation: 'A1 · Greeting',
        categoryIcon: 'greeting',
      },
      {
        id: 'opt-3',
        text: 'One pitcher of cold water, please.',
        pronunciation: 'A1 · Dining',
        categoryIcon: 'water',
      },
    ],
    correctIndex: 1,
    grammarNote: '“Venir de + infinitive” expresses the recent past (“to have just done something”).',
  },
  {
    id: 'fr-q-21',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Ma famille habite à Lyon et mes voisins sont sympathiques.',
    sourceLanguageLabel: 'French · CEFR A1',
    wordHints: [
      { word: 'Ma famille', meaning: 'My family' },
      { word: 'habite à Lyon', meaning: 'lives in Lyon' },
      { word: 'et mes voisins', meaning: 'and my neighbors' },
      { word: 'sont sympathiques.', meaning: 'are friendly.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'My family lives in Lyon and my neighbors are friendly.',
        pronunciation: 'A1 · Family & Neighborhood',
        categoryIcon: 'city',
      },
      {
        id: 'opt-1',
        text: 'We are taking the train to Bordeaux tonight.',
        pronunciation: 'A2 · Transit',
        categoryIcon: 'train',
      },
      {
        id: 'opt-2',
        text: 'I would like two warm croissants, please.',
        pronunciation: 'A1 · Bakery',
        categoryIcon: 'bread',
      },
      {
        id: 'opt-3',
        text: 'The museum is closed on Tuesday mornings.',
        pronunciation: 'A1 · Culture',
        categoryIcon: 'book',
      },
    ],
    correctIndex: 0,
    grammarNote: 'Possessive adjectives (“ma”, “mes”) agree in gender and number with the noun they modify.',
  },
  {
    id: 'fr-q-22',
    promptInstruction: 'Translate this sentence',
    sourceSentence: 'Tournez à gauche après le pont et continuez tout droit.',
    sourceLanguageLabel: 'French · CEFR A1',
    wordHints: [
      { word: 'Tournez à gauche', meaning: 'Turn left' },
      { word: 'après le pont', meaning: 'after the bridge' },
      { word: 'et continuez', meaning: 'and continue' },
      { word: 'tout droit.', meaning: 'straight ahead.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Can you bring the check and some water?',
        pronunciation: 'A1 · Bistro',
        categoryIcon: 'water',
      },
      {
        id: 'opt-1',
        text: 'Turn left after the bridge and continue straight ahead.',
        pronunciation: 'A1 · Street Directions',
        categoryIcon: 'city',
      },
      {
        id: 'opt-2',
        text: 'The sun is shining over the beach today.',
        pronunciation: 'A1 · Weather',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-3',
        text: 'My sister studies music at the university.',
        pronunciation: 'A1 · Family',
        categoryIcon: 'book',
      },
    ],
    correctIndex: 1,
    grammarNote: 'Polite street directions in French use the “vous” imperative form (“Tournez”, “Continuez”).',
  },
  {
    id: 'fr-q-23',
    promptInstruction: 'Translate this A2 sentence',
    sourceSentence: 'Je me réveille tôt et je me prépare rapidement.',
    sourceLanguageLabel: 'French · CEFR A2',
    wordHints: [
      { word: 'Je me réveille', meaning: 'I wake up' },
      { word: 'tôt', meaning: 'early' },
      { word: 'et je me prépare', meaning: 'and I get ready' },
      { word: 'rapidement.', meaning: 'quickly.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'I wake up early and I get ready quickly.',
        pronunciation: 'A2 · Daily Routine & Reflexives',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-1',
        text: 'Where can I validate my train ticket?',
        pronunciation: 'A2 · Station',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-2',
        text: 'We are renting an apartment on the third floor.',
        pronunciation: 'A2 · Housing',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-3',
        text: 'These red apples are fresh from the market.',
        pronunciation: 'A1 · Market',
        categoryIcon: 'apple',
      },
    ],
    correctIndex: 0,
    grammarNote: 'Reflexive verbs (“se réveiller”, “se préparer”) place the reflexive pronoun (“me”) before the verb.',
  },
  {
    id: 'fr-q-24',
    promptInstruction: 'Translate this A2 sentence',
    sourceSentence: 'Nous louons un appartement lumineux au troisième étage.',
    sourceLanguageLabel: 'French · CEFR A2',
    wordHints: [
      { word: 'Nous louons', meaning: 'We are renting' },
      { word: 'un appartement lumineux', meaning: 'a bright apartment' },
      { word: 'au troisième', meaning: 'on the third' },
      { word: 'étage.', meaning: 'floor.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The train departs from platform number four.',
        pronunciation: 'A2 · Transit',
        categoryIcon: 'train',
      },
      {
        id: 'opt-1',
        text: 'We are renting a bright apartment on the third floor.',
        pronunciation: 'A2 · Housing & Apartments',
        categoryIcon: 'hotel',
      },
      {
        id: 'opt-2',
        text: 'I have an appointment with the doctor tomorrow.',
        pronunciation: 'A2 · Health',
        categoryIcon: 'book',
      },
      {
        id: 'opt-3',
        text: 'Good evening, welcome to our restaurant.',
        pronunciation: 'A1 · Greeting',
        categoryIcon: 'greeting',
      },
    ],
    correctIndex: 1,
    grammarNote: 'Descriptive adjectives like “lumineux” (bright) usually follow the noun they describe in French.',
  },
  {
    id: 'fr-q-25',
    promptInstruction: 'Translate this A2 sentence',
    sourceSentence: 'J’ai rendez-vous chez le médecin car j’ai de la fièvre.',
    sourceLanguageLabel: 'French · CEFR A2',
    wordHints: [
      { word: 'J’ai rendez-vous', meaning: 'I have an appointment' },
      { word: 'chez le médecin', meaning: 'at the doctor’s office' },
      { word: 'car j’ai', meaning: 'because I have' },
      { word: 'de la fièvre.', meaning: 'a fever.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'I have an appointment with the doctor because I have a fever.',
        pronunciation: 'A2 · Health & Pharmacy',
        categoryIcon: 'book',
      },
      {
        id: 'opt-1',
        text: 'My cat loves sleeping near the warm window.',
        pronunciation: 'A1 · Home',
        categoryIcon: 'cat',
      },
      {
        id: 'opt-2',
        text: 'One round-trip ticket to Marseille, please.',
        pronunciation: 'A2 · SNCF',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-3',
        text: 'We drink hot coffee at the bakery.',
        pronunciation: 'A1 · Café',
        categoryIcon: 'coffee',
      },
    ],
    correctIndex: 0,
    grammarNote: 'French uses the preposition “chez” before a person or profession (“chez le médecin”, “chez le dentiste”).',
  },
  {
    id: 'fr-q-26',
    promptInstruction: 'Translate this A2 sentence',
    sourceSentence: 'Ce voyage en Bretagne reste un souvenir inoubliable.',
    sourceLanguageLabel: 'French · CEFR A2',
    wordHints: [
      { word: 'Ce voyage', meaning: 'This trip' },
      { word: 'en Bretagne', meaning: 'to Brittany' },
      { word: 'reste un souvenir', meaning: 'remains a memory' },
      { word: 'inoubliable.', meaning: 'unforgettable.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Please validate your ticket before boarding.',
        pronunciation: 'A2 · Transit',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-1',
        text: 'This trip to Brittany remains an unforgettable memory.',
        pronunciation: 'A2 · Memories & Past Events',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-2',
        text: 'Where is the public library in this town?',
        pronunciation: 'A1 · Directions',
        categoryIcon: 'city',
      },
      {
        id: 'opt-3',
        text: 'I would like a glass of cold water.',
        pronunciation: 'A1 · Café',
        categoryIcon: 'water',
      },
    ],
    correctIndex: 1,
    grammarNote: 'Use “en” before feminine regions and countries (“en Bretagne”, “en France”).',
  },
  {
    id: 'fr-q-27',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'Le télétravail offre plus de flexibilité à notre équipe.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'Le télétravail', meaning: 'Remote work' },
      { word: 'offre', meaning: 'offers' },
      { word: 'plus de flexibilité', meaning: 'more flexibility' },
      { word: 'à notre équipe.', meaning: 'to our team.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'Remote work offers more flexibility to our team.',
        pronunciation: 'B1 · Workplace & Career',
        categoryIcon: 'book',
      },
      {
        id: 'opt-1',
        text: 'The bakery sells fresh bread every morning.',
        pronunciation: 'A1 · Bakery',
        categoryIcon: 'bread',
      },
      {
        id: 'opt-2',
        text: 'We have a train connection in Lyon.',
        pronunciation: 'A2 · Travel',
        categoryIcon: 'train',
      },
      {
        id: 'opt-3',
        text: 'The hotel room overlooks the courtyard.',
        pronunciation: 'A2 · Lodging',
        categoryIcon: 'hotel',
      },
    ],
    correctIndex: 0,
    grammarNote: 'Expressions of quantity like “plus de” (more) and “beaucoup de” (many) use “de” without an article.',
  },
  {
    id: 'fr-q-28',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'Prendre le train réduit fortement notre empreinte carbone.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'Prendre le train', meaning: 'Taking the train' },
      { word: 'réduit fortement', meaning: 'greatly reduces' },
      { word: 'notre empreinte', meaning: 'our footprint' },
      { word: 'carbone.', meaning: 'carbon.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'The flight is delayed by twenty minutes.',
        pronunciation: 'A2 · Airport',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-1',
        text: 'Taking the train greatly reduces our carbon footprint.',
        pronunciation: 'B1 · Ecology & Climate',
        categoryIcon: 'train',
      },
      {
        id: 'opt-2',
        text: 'I am having breakfast at eight o’clock.',
        pronunciation: 'A1 · Routine',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-3',
        text: 'My brother is twenty years old.',
        pronunciation: 'A1 · Family',
        categoryIcon: 'greeting',
      },
    ],
    correctIndex: 1,
    grammarNote: 'In French, an infinitive verb (“Prendre”) is used when a verb acts as the subject of a sentence.',
  },
  {
    id: 'fr-q-29',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'Il est essentiel de vérifier une source avant de partager.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'Il est essentiel', meaning: 'It is essential' },
      { word: 'de vérifier', meaning: 'to verify' },
      { word: 'une source', meaning: 'a source' },
      { word: 'avant de partager.', meaning: 'before sharing.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'It is essential to verify a source before sharing.',
        pronunciation: 'B1 · Digital Media & News',
        categoryIcon: 'book',
      },
      {
        id: 'opt-1',
        text: 'The cat is sleeping in the living room.',
        pronunciation: 'A1 · Home',
        categoryIcon: 'cat',
      },
      {
        id: 'opt-2',
        text: 'Do you have a table on the terrace?',
        pronunciation: 'A1 · Bistro',
        categoryIcon: 'coffee',
      },
      {
        id: 'opt-3',
        text: 'Turn right after the public library.',
        pronunciation: 'A1 · Town',
        categoryIcon: 'city',
      },
    ],
    correctIndex: 0,
    grammarNote: 'Impersonal expressions (“Il est essentiel de”) and “avant de” are followed by the infinitive.',
  },
  {
    id: 'fr-q-30',
    promptInstruction: 'Translate this B1 sentence',
    sourceSentence: 'Ce château fait partie du patrimoine culturel français.',
    sourceLanguageLabel: 'French · CEFR B1',
    wordHints: [
      { word: 'Ce château', meaning: 'This castle' },
      { word: 'fait partie', meaning: 'is part' },
      { word: 'du patrimoine', meaning: 'of the heritage' },
      { word: 'culturel français.', meaning: 'French cultural.' },
    ],
    options: [
      {
        id: 'opt-0',
        text: 'We need two metro tickets for Paris.',
        pronunciation: 'A1 · Transit',
        categoryIcon: 'ticket',
      },
      {
        id: 'opt-1',
        text: 'This castle is part of French cultural heritage.',
        pronunciation: 'B1 · Culture & Heritage',
        categoryIcon: 'city',
      },
      {
        id: 'opt-2',
        text: 'I wake up early every Saturday morning.',
        pronunciation: 'A2 · Routine',
        categoryIcon: 'sun',
      },
      {
        id: 'opt-3',
        text: 'One warm baguette from the bakery, please.',
        pronunciation: 'A1 · Bakery',
        categoryIcon: 'bread',
      },
    ],
    correctIndex: 1,
    grammarNote: '“Faire partie de” means “to be part of”, and “de + le patrimoine” contracts to “du patrimoine”.',
  },
];

const LEVEL_DEFINITIONS: Array<{
  unitNumber: number;
  unitTitle: string;
  unitDescription: string;
  title: string;
  subtitle: string;
  xpReward: number;
  iconType: PathNodeData['iconType'];
  qIndices: number[];
}> = [
  // Stage 1: Levels 1–5 (CEFR A1 Chapter 1 + End-of-Chapter A1 Final Test)
  {
    unitNumber: 1,
    unitTitle: 'Chapter 1 · Essential French Foundations (CEFR A1)',
    unitDescription: 'Master core A1 greetings, polite expressions, café orders, and market phrases.',
    title: 'Bonjour & Salutations',
    subtitle: 'Greet locals politely in Paris',
    xpReward: 35,
    iconType: 'star',
    qIndices: [0, 1, 2, 3],
  },
  {
    unitNumber: 1,
    unitTitle: 'Chapter 1 · Essential French Foundations (CEFR A1)',
    unitDescription: 'Master core A1 greetings, polite expressions, café orders, and market phrases.',
    title: 'First Introductions',
    subtitle: 'Share your name, family & say Enchanté',
    xpReward: 35,
    iconType: 'chat',
    qIndices: [2, 3, 20, 0],
  },
  {
    unitNumber: 1,
    unitTitle: 'Chapter 1 · Essential French Foundations (CEFR A1)',
    unitDescription: 'Master core A1 greetings, polite expressions, café orders, and market phrases.',
    title: 'Morning Boulangerie & Café',
    subtitle: 'Order warm baguettes, water & croissants',
    xpReward: 40,
    iconType: 'utensils',
    qIndices: [4, 0, 5, 6],
  },
  {
    unitNumber: 1,
    unitTitle: 'Chapter 1 · Essential French Foundations (CEFR A1)',
    unitDescription: 'Master core A1 greetings, polite expressions, café orders, and market phrases.',
    title: 'Bistro Table & Town Directions',
    subtitle: 'Book tables, describe fruit & navigate streets',
    xpReward: 45,
    iconType: 'book',
    qIndices: [6, 7, 21, 3],
  },
  {
    unitNumber: 1,
    unitTitle: 'Chapter 1 · Essential French Foundations (CEFR A1)',
    unitDescription: 'Master core A1 greetings, polite expressions, café orders, and market phrases.',
    title: 'Chapter 1 Final Test · CEFR A1 Exam',
    subtitle: 'End-of-Chapter Test · Pass to master CEFR A1',
    xpReward: 80,
    iconType: 'trophy',
    qIndices: [0, 4, 20, 21],
  },

  // Stage 2: Levels 6–10 (CEFR A2 Chapter 2 + End-of-Chapter A2 Final Test)
  {
    unitNumber: 2,
    unitTitle: 'Chapter 2 · Travel, Gare & Daily Life (CEFR A2)',
    unitDescription: 'Navigate train stations, buy TGV tickets, book hotels, and plan outings.',
    title: 'Daily Routines & Gare du Nord',
    subtitle: 'Reflexive verbs & directions across Paris',
    xpReward: 45,
    iconType: 'compass',
    qIndices: [8, 22, 9, 10],
  },
  {
    unitNumber: 2,
    unitTitle: 'Chapter 2 · Travel, Gare & Daily Life (CEFR A2)',
    unitDescription: 'Navigate train stations, buy TGV tickets, book hotels, and plan outings.',
    title: 'TGV Tickets & Apartments',
    subtitle: 'Purchasing rail passes & renting homes',
    xpReward: 45,
    iconType: 'star',
    qIndices: [9, 23, 12, 8],
  },
  {
    unitNumber: 2,
    unitTitle: 'Chapter 2 · Travel, Gare & Daily Life (CEFR A2)',
    unitDescription: 'Navigate train stations, buy TGV tickets, book hotels, and plan outings.',
    title: 'Hotel & Visiting the Doctor',
    subtitle: 'Check-ins, reservations & health advice',
    xpReward: 50,
    iconType: 'book',
    qIndices: [10, 11, 24, 12],
  },
  {
    unitNumber: 2,
    unitTitle: 'Chapter 2 · Travel, Gare & Daily Life (CEFR A2)',
    unitDescription: 'Navigate train stations, buy TGV tickets, book hotels, and plan outings.',
    title: 'Louvre, Gardens & Memories',
    subtitle: 'Leisure, reading & unforgettable trips',
    xpReward: 50,
    iconType: 'chat',
    qIndices: [13, 14, 15, 25],
  },
  {
    unitNumber: 2,
    unitTitle: 'Chapter 2 · Travel, Gare & Daily Life (CEFR A2)',
    unitDescription: 'Navigate train stations, buy TGV tickets, book hotels, and plan outings.',
    title: 'Chapter 2 Final Test · CEFR A2 Exam',
    subtitle: 'End-of-Chapter Test · Pass to master CEFR A2',
    xpReward: 95,
    iconType: 'trophy',
    qIndices: [8, 22, 24, 25],
  },

  // Stage 3: Levels 11–15 (CEFR B1 Chapter 3 + End-of-Chapter B1 Final Test)
  {
    unitNumber: 3,
    unitTitle: 'Chapter 3 · Opinions, Work & Fluency (CEFR B1)',
    unitDescription: 'Express nuanced opinions, use subjunctive connectors, and discuss work & society.',
    title: 'Workplace & Expressing Opinions',
    subtitle: 'Remote work, teams & debating ideas',
    xpReward: 55,
    iconType: 'chat',
    qIndices: [16, 26, 19, 15],
  },
  {
    unitNumber: 3,
    unitTitle: 'Chapter 3 · Opinions, Work & Fluency (CEFR B1)',
    unitDescription: 'Express nuanced opinions, use subjunctive connectors, and discuss work & society.',
    title: 'Concession & Subjunctive (Bien que)',
    subtitle: 'Speaking smoothly through complex situations',
    xpReward: 55,
    iconType: 'compass',
    qIndices: [17, 27, 16, 12],
  },
  {
    unitNumber: 3,
    unitTitle: 'Chapter 3 · Opinions, Work & Fluency (CEFR B1)',
    unitDescription: 'Express nuanced opinions, use subjunctive connectors, and discuss work & society.',
    title: 'Environment, Media & Sources',
    subtitle: 'Discussing climate & digital news in French',
    xpReward: 60,
    iconType: 'star',
    qIndices: [18, 28, 27, 17],
  },
  {
    unitNumber: 3,
    unitTitle: 'Chapter 3 · Opinions, Work & Fluency (CEFR B1)',
    unitDescription: 'Express nuanced opinions, use subjunctive connectors, and discuss work & society.',
    title: 'Heritage, Career & Recent Past',
    subtitle: 'Cultural heritage & workplace fluency',
    xpReward: 65,
    iconType: 'book',
    qIndices: [19, 29, 26, 18],
  },
  {
    unitNumber: 3,
    unitTitle: 'Chapter 3 · Opinions, Work & Fluency (CEFR B1)',
    unitDescription: 'Express nuanced opinions, use subjunctive connectors, and discuss work & society.',
    title: 'Chapter 3 Final Test · CEFR B1 Exam',
    subtitle: 'End-of-Chapter Test · Unlock CEFR B1 Diploma!',
    xpReward: 120,
    iconType: 'trophy',
    qIndices: [16, 17, 28, 29],
  },

  // Bonus Mastery Levels 16–20
  {
    unitNumber: 4,
    unitTitle: 'Chapter 4 · Parisian Polyglot Mastery (A1–B1 Review)',
    unitDescription: 'High-speed mastery review across A1, A2, and B1 French scenarios.',
    title: 'Grand Café Conversation',
    subtitle: 'Combine polite orders & opinions',
    xpReward: 65,
    iconType: 'utensils',
    qIndices: [0, 6, 16, 20],
  },
  {
    unitNumber: 4,
    unitTitle: 'Chapter 4 · Parisian Polyglot Mastery (A1–B1 Review)',
    unitDescription: 'High-speed mastery review across A1, A2, and B1 French scenarios.',
    title: 'Express TGV across France',
    subtitle: 'Rapid transit & concession structures',
    xpReward: 70,
    iconType: 'compass',
    qIndices: [9, 12, 17, 27],
  },
  {
    unitNumber: 4,
    unitTitle: 'Chapter 4 · Parisian Polyglot Mastery (A1–B1 Review)',
    unitDescription: 'High-speed mastery review across A1, A2, and B1 French scenarios.',
    title: 'Louvre Cultural Debate',
    subtitle: 'Art, future goals & society',
    xpReward: 70,
    iconType: 'book',
    qIndices: [15, 18, 29, 16],
  },
  {
    unitNumber: 4,
    unitTitle: 'Chapter 4 · Parisian Polyglot Mastery (A1–B1 Review)',
    unitDescription: 'High-speed mastery review across A1, A2, and B1 French scenarios.',
    title: 'Executive Paris Pitch',
    subtitle: 'Workplace fluency & hotel check-in',
    xpReward: 75,
    iconType: 'chat',
    qIndices: [19, 26, 11, 28],
  },
  {
    unitNumber: 4,
    unitTitle: 'Chapter 4 · Parisian Polyglot Mastery (A1–B1 Review)',
    unitDescription: 'High-speed mastery review across A1, A2, and B1 French scenarios.',
    title: 'Chapter 4 Final Test · Royal Polyglot Crown',
    subtitle: 'Ultimate French A1–B1 Championship Exam',
    xpReward: 150,
    iconType: 'trophy',
    qIndices: [16, 17, 18, 29],
  },
];

export const FRENCH_COURSE: LanguageCourse = {
  id: 'fr',
  name: 'French',
  nativeName: 'Français',
  speechLang: 'fr-FR',
  flagCode: 'FR',
  nodes: LEVEL_DEFINITIONS.map((def, idx) => ({
    index: idx,
    id: `fr-level-${idx + 1}`,
    unitNumber: def.unitNumber,
    unitTitle: def.unitTitle,
    unitDescription: def.unitDescription,
    title: def.title,
    subtitle: def.subtitle,
    xpReward: def.xpReward,
    iconType: def.iconType,
    questions: def.qIndices.map((qIdx) => FRENCH_MASTER_QUESTIONS[qIdx]),
  })),
};

