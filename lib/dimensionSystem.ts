// 5-Point Dimension System with Example Movies
// Each dimension goes from 1-5 where 3 is neutral/default

export interface DimensionLevel {
  value: number;
  label: string;
  description: string;
  examples: string[];
  color: string;
}

export interface DimensionScale {
  name: string;
  description: string;
  icon: string;
  levels: DimensionLevel[];
}

// Complete 5-point scale system for all dimensions
export const dimensionScales: Record<string, DimensionScale> = {
  serotonin: {
    name: 'Serotonin',
    description: 'How much joy and happiness does this bring you?',
    icon: '😊',
    levels: [
      {
        value: 1,
        label: 'Soul-crushing',
        description: 'Deeply depressing, emotionally devastating',
        examples: ['Requiem for a Dream', 'Grave of the Fireflies', 'Manchester by the Sea'],
        color: '#dc2626' // red-600
      },
      {
        value: 2,
        label: 'Heavy',
        description: 'Serious and somber, but not devastating',
        examples: ['There Will Be Blood', 'No Country for Old Men', 'The Road'],
        color: '#ea580c' // orange-600
      },
      {
        value: 3,
        label: 'Neutral',
        description: 'Balanced emotional tone',
        examples: ['The Social Network', 'Blade Runner 2049', 'Arrival'],
        color: '#64748b' // slate-500
      },
      {
        value: 4,
        label: 'Uplifting',
        description: 'Feel-good and optimistic',
        examples: ['The Princess Bride', 'About Time', 'Little Miss Sunshine'],
        color: '#16a34a' // green-600
      },
      {
        value: 5,
        label: 'Pure Joy',
        description: 'Absolute delight and happiness',
        examples: ['Paddington 2', 'Studio Ghibli films', 'The Grand Budapest Hotel'],
        color: '#059669' // emerald-600
      }
    ]
  },

  brainy_bonkers: {
    name: 'Brainy Bonkers',
    description: 'How intellectually complex or mind-bending?',
    icon: '🧠',
    levels: [
      {
        value: 1,
        label: 'Turn off brain',
        description: 'Pure entertainment, no thinking required',
        examples: ['Fast & Furious franchise', 'Transformers', 'The Meg'],
        color: '#dc2626'
      },
      {
        value: 2,
        label: 'Light thinking',
        description: 'Some plot to follow but straightforward',
        examples: ['Marvel movies', 'John Wick', 'Top Gun: Maverick'],
        color: '#ea580c'
      },
      {
        value: 3,
        label: 'Standard',
        description: 'Normal narrative complexity',
        examples: ['The Dark Knight', 'Knives Out', 'Gone Girl'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Big brain',
        description: 'Complex themes and storytelling',
        examples: ['Inception', 'Interstellar', 'The Prestige'],
        color: '#7c3aed' // violet-600
      },
      {
        value: 5,
        label: 'Galaxy brain',
        description: 'Extremely complex, requires multiple viewings',
        examples: ['Primer', 'Synecdoche New York', 'Holy Motors'],
        color: '#5b21b6' // violet-800
      }
    ]
  },

  camp: {
    name: 'Camp',
    description: 'How deliberately over-the-top or absurd?',
    icon: '🎭',
    levels: [
      {
        value: 1,
        label: 'Dead serious',
        description: 'Completely earnest and grounded',
        examples: ['Manchester by the Sea', 'Moonlight', 'The Pianist'],
        color: '#64748b' // slate-500
      },
      {
        value: 2,
        label: 'Mostly serious',
        description: 'Some light moments but overall serious',
        examples: ['The Dark Knight', 'Mad Max: Fury Road', 'Blade Runner 2049'],
        color: '#6b7280' // gray-500
      },
      {
        value: 3,
        label: 'Balanced',
        description: 'Mix of serious and playful elements',
        examples: ['Marvel movies', 'The Princess Bride', 'Knives Out'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Campy fun',
        description: 'Deliberately theatrical and over-the-top',
        examples: ['The Grand Budapest Hotel', 'Kill Bill', 'Scott Pilgrim'],
        color: '#ec4899' // pink-500
      },
      {
        value: 5,
        label: 'Pure camp',
        description: 'Completely absurd and self-aware',
        examples: ['The Rocky Horror Picture Show', 'Everything Everywhere All at Once', 'The Lobster'],
        color: '#db2777' // pink-600
      }
    ]
  },

  color: {
    name: 'Color',
    description: 'How visually striking and aesthetically rich?',
    icon: '🎨',
    levels: [
      {
        value: 1,
        label: 'Bleak',
        description: 'Deliberately drab and colorless',
        examples: ['The Road', 'Mad Max: Fury Road (desert)', 'Children of Men'],
        color: '#6b7280'
      },
      {
        value: 2,
        label: 'Muted',
        description: 'Subdued color palette',
        examples: ['No Country for Old Men', 'Sicario', 'The Batman'],
        color: '#78716c' // stone-500
      },
      {
        value: 3,
        label: 'Standard',
        description: 'Normal cinematography',
        examples: ['Most Hollywood films', 'John Wick', 'The Social Network'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Visually rich',
        description: 'Beautiful cinematography and design',
        examples: ['Blade Runner 2049', 'Her', 'La La Land'],
        color: '#059669' // emerald-600
      },
      {
        value: 5,
        label: 'Visual feast',
        description: 'Absolutely stunning visual experience',
        examples: ['The Grand Budapest Hotel', 'Spider-Verse', 'Avatar'],
        color: '#047857' // emerald-700
      }
    ]
  },

  pace: {
    name: 'Pace',
    description: 'How fast-moving and energetic?',
    icon: '⚡',
    levels: [
      {
        value: 1,
        label: 'Glacial',
        description: 'Extremely slow, contemplative pacing',
        examples: ['2001: A Space Odyssey', 'Stalker', 'The Tree of Life'],
        color: '#64748b'
      },
      {
        value: 2,
        label: 'Slow burn',
        description: 'Deliberate, measured pacing',
        examples: ['There Will Be Blood', 'Blade Runner 2049', 'The Godfather'],
        color: '#6b7280'
      },
      {
        value: 3,
        label: 'Standard',
        description: 'Normal pacing for the genre',
        examples: ['Most dramas and thrillers', 'The Dark Knight', 'Arrival'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Energetic',
        description: 'Quick-moving with good momentum',
        examples: ['John Wick', 'Baby Driver', 'Edge of Tomorrow'],
        color: '#f97316' // orange-500
      },
      {
        value: 5,
        label: 'Breakneck',
        description: 'Non-stop action and energy',
        examples: ['Mad Max: Fury Road', 'Crank', 'Speed'],
        color: '#ea580c' // orange-600
      }
    ]
  },

  darkness: {
    name: 'Darkness',
    description: 'How heavy, serious, or emotionally intense?',
    icon: '🌙',
    levels: [
      {
        value: 1,
        label: 'Pure light',
        description: 'Completely upbeat and innocent',
        examples: ['Paddington films', 'Studio Ghibli', 'The Princess Bride'],
        color: '#fbbf24' // amber-400
      },
      {
        value: 2,
        label: 'Mostly light',
        description: 'Generally upbeat with minor conflicts',
        examples: ['Marvel movies', 'Romantic comedies', 'The Grand Budapest Hotel'],
        color: '#f59e0b' // amber-500
      },
      {
        value: 3,
        label: 'Balanced',
        description: 'Mix of light and dark elements',
        examples: ['Most mainstream films', 'The Social Network', 'Knives Out'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Heavy',
        description: 'Serious themes and darker content',
        examples: ['The Dark Knight', 'No Country for Old Men', 'Zodiac'],
        color: '#4b5563' // gray-600
      },
      {
        value: 5,
        label: 'Soul-crushing',
        description: 'Extremely dark and disturbing',
        examples: ['Requiem for a Dream', 'Funny Games', 'Irreversible'],
        color: '#374151' // gray-700
      }
    ]
  },

  novelty: {
    name: 'Novelty',
    description: 'How unique, innovative, or surprising?',
    icon: '✨',
    levels: [
      {
        value: 1,
        label: 'By the book',
        description: 'Completely formulaic and predictable',
        examples: ['Generic action movies', 'Typical rom-coms', 'Cookie-cutter thrillers'],
        color: '#6b7280'
      },
      {
        value: 2,
        label: 'Familiar',
        description: 'Follows known patterns with small variations',
        examples: ['Most Marvel movies', 'John Wick sequels', 'Standard dramas'],
        color: '#78716c'
      },
      {
        value: 3,
        label: 'Standard',
        description: 'Some original elements within familiar framework',
        examples: ['Knives Out', 'The Social Network', 'Get Out'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Fresh',
        description: 'Notably original approach or concept',
        examples: ['Inception', 'Her', 'Parasite'],
        color: '#06b6d4' // cyan-500
      },
      {
        value: 5,
        label: 'Groundbreaking',
        description: 'Completely unique and innovative',
        examples: ['Everything Everywhere All at Once', 'Being John Malkovich', 'Holy Motors'],
        color: '#0891b2' // cyan-600
      }
    ]
  },

  social_safe: {
    name: 'Social Safe',
    description: 'How comfortable to watch with others?',
    icon: '👥',
    levels: [
      {
        value: 1,
        label: 'Watch alone',
        description: 'Extremely uncomfortable content',
        examples: ['Nymphomaniac', 'Irreversible', 'Salo'],
        color: '#dc2626'
      },
      {
        value: 2,
        label: 'Close friends only',
        description: 'Graphic or controversial content',
        examples: ['Pulp Fiction', 'Deadpool', 'The Wolf of Wall Street'],
        color: '#ea580c'
      },
      {
        value: 3,
        label: 'Adult company',
        description: 'Some mature themes but generally okay',
        examples: ['Most R-rated films', 'The Dark Knight', 'Inception'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Family friendly',
        description: 'Safe for most audiences',
        examples: ['Marvel movies', 'The Princess Bride', 'Spider-Verse'],
        color: '#16a34a'
      },
      {
        value: 5,
        label: 'Universal',
        description: 'Perfect for any group or family',
        examples: ['Toy Story', 'Studio Ghibli films', 'Paddington'],
        color: '#059669'
      }
    ]
  },

  runtime_fit: {
    name: 'Runtime Fit',
    description: 'How well-paced for its length?',
    icon: '⏱️',
    levels: [
      {
        value: 1,
        label: 'Bloated',
        description: 'Way too long, poor pacing throughout',
        examples: ['Justice League (4hr)', 'The Irishman (dragging parts)', 'Batman v Superman'],
        color: '#dc2626'
      },
      {
        value: 2,
        label: 'Too long',
        description: 'Could have been shorter',
        examples: ['Some Marvel movies', 'Transformers sequels', 'The Hobbit trilogy'],
        color: '#ea580c'
      },
      {
        value: 3,
        label: 'Adequate',
        description: 'Length feels about right',
        examples: ['Most Hollywood films', 'Standard 90-120 min movies'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Well-paced',
        description: 'Every minute feels necessary',
        examples: ['John Wick', 'Mad Max: Fury Road', 'Knives Out'],
        color: '#3b82f6' // blue-500
      },
      {
        value: 5,
        label: 'Perfect',
        description: 'Absolutely perfect pacing and length',
        examples: ['Whiplash', 'Parasite', 'The Social Network'],
        color: '#1d4ed8' // blue-700
      }
    ]
  },

  subs_energy: {
    name: 'Subs Energy',
    description: 'How much mental energy do subtitles require?',
    icon: '💭',
    levels: [
      {
        value: 1,
        label: 'English only',
        description: 'No subtitles needed',
        examples: ['Most Hollywood films', 'English-language indies'],
        color: '#16a34a'
      },
      {
        value: 2,
        label: 'Minimal subs',
        description: 'Occasional foreign language',
        examples: ['Kill Bill', 'Star Wars (alien languages)', 'Inglourious Basterds'],
        color: '#65a30d' // lime-600
      },
      {
        value: 3,
        label: 'Standard subs',
        description: 'Foreign film with normal dialogue',
        examples: ['Most foreign films', 'Parasite', 'Roma'],
        color: '#64748b'
      },
      {
        value: 4,
        label: 'Heavy reading',
        description: 'Fast dialogue or complex terms',
        examples: ['Dense foreign dramas', 'Historical epics with period language'],
        color: '#a855f7' // purple-500
      },
      {
        value: 5,
        label: 'Reading workout',
        description: 'Extremely dense or rapid subtitles',
        examples: ['Dense foreign arthouse', 'Films with heavy accents + subs'],
        color: '#9333ea' // purple-600
      }
    ]
  }
};

// Helper functions for working with the 5-point system
export const getDimensionLevel = (dimension: string, value: number): DimensionLevel | null => {
  const scale = dimensionScales[dimension];
  if (!scale) return null;
  
  return scale.levels.find(level => level.value === value) || null;
};

export const getDimensionDescription = (dimension: string, value: number): string => {
  const level = getDimensionLevel(dimension, value);
  return level ? `${level.label}: ${level.description}` : 'Unknown level';
};

export const getDimensionExamples = (dimension: string, value: number): string[] => {
  const level = getDimensionLevel(dimension, value);
  return level ? level.examples : [];
};

export const getDimensionColor = (dimension: string, value: number): string => {
  const level = getDimensionLevel(dimension, value);
  return level ? level.color : '#64748b';
};

// Convert old 0-10 scale to new 1-5 scale
export const convertTo5PointScale = (oldValue: number): number => {
  // Map 0-10 to 1-5: 0-1=1, 2-3=2, 4-6=3, 7-8=4, 9-10=5
  if (oldValue <= 1) return 1;
  if (oldValue <= 3) return 2;
  if (oldValue <= 6) return 3;
  if (oldValue <= 8) return 4;
  return 5;
};

// Convert 1-5 scale to display percentage for progress bars
export const scaleToPercentage = (value: number): number => {
  return ((value - 1) / 4) * 100;
};