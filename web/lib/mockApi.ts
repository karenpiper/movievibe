// Mock data for demonstration purposes
// In production, these would be actual API calls to Airtable and TMDB

export interface Movie {
  id: string;
  title: string;
  year: number;
  genres: string[];
  director: string;
  writer?: string;
  runtime: number;
  logline: string;
  poster_url: string;
  backdrop_url?: string;
  imdb_rating?: number;
  cast?: string[];
  seen: boolean;
  score?: number;
}

export interface Rating {
  id: string;
  movieId: string;
  serotonin: number;
  brainy_bonkers: number;
  camp: number;
  color: number;
  pace: number;
  darkness: number;
  novelty: number;
  social_safe: number;
  runtime_fit: number;
  subs_energy: number;
  overall: number;
  notes: string;
}

export interface VibePreferences {
  serotonin: number;
  brainy_bonkers: number;
  camp: number;
  color: number;
  pace: number;
  darkness: number;
  novelty: number;
  social_safe: number;
  runtime_fit: number;
  subs_energy: number;
}

export interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  genre_ids: number[];
  overview: string;
  poster_path: string;
  backdrop_path?: string;
  runtime?: number;
  vote_average: number;
  cast?: { name: string; character: string }[];
  crew?: { name: string; job: string }[];
  imdb_id?: string;
}

const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Grand Budapest Hotel',
    year: 2014,
    genres: ['Comedy', 'Drama'],
    director: 'Wes Anderson',
    writer: 'Wes Anderson',
    runtime: 99,
    logline: 'A legendary concierge and his protégé become involved in a murder mystery.',
    poster_url: 'https://images.unsplash.com/photo-1489599317415-3bac6e9677cf?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1489599317415-3bac6e9677cf?w=800&h=450&fit=crop',
    imdb_rating: 8.1,
    cast: ['Ralph Fiennes', 'F. Murray Abraham', 'Mathieu Amalric', 'Adrien Brody'],
    seen: false
  },
  {
    id: '2',
    title: 'Inception',
    year: 2010,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    director: 'Christopher Nolan',
    writer: 'Christopher Nolan',
    runtime: 148,
    logline: 'A thief enters the dreams of others to steal secrets from their subconscious.',
    poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop',
    imdb_rating: 8.8,
    cast: ['Leonardo DiCaprio', 'Marion Cotillard', 'Tom Hardy', 'Ellen Page'],
    seen: false
  },
  {
    id: '3',
    title: 'Mad Max: Fury Road',
    year: 2015,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    director: 'George Miller',
    writer: 'George Miller',
    runtime: 120,
    logline: 'In a post-apocalyptic wasteland, Max teams up with Furiosa to escape a tyrannical warlord.',
    poster_url: 'https://images.unsplash.com/photo-1518930259200-52d8e47b4651?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1518930259200-52d8e47b4651?w=800&h=450&fit=crop',
    imdb_rating: 8.1,
    cast: ['Tom Hardy', 'Charlize Theron', 'Nicholas Hoult', 'Hugh Keays-Byrne'],
    seen: false
  },
  {
    id: '4',
    title: 'Parasite',
    year: 2019,
    genres: ['Thriller', 'Drama', 'Comedy'],
    director: 'Bong Joon-ho',
    writer: 'Bong Joon-ho',
    runtime: 132,
    logline: 'A poor family infiltrates the household of a wealthy family through deception.',
    poster_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=450&fit=crop',
    imdb_rating: 8.5,
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong', 'Choi Woo-shik'],
    seen: false
  },
  {
    id: '5',
    title: 'The Shape of Water',
    year: 2017,
    genres: ['Drama', 'Fantasy', 'Romance'],
    director: 'Guillermo del Toro',
    writer: 'Guillermo del Toro',
    runtime: 123,
    logline: 'A mute janitor forms a unique relationship with an amphibious creature.',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop',
    imdb_rating: 7.3,
    cast: ['Sally Hawkins', 'Michael Shannon', 'Richard Jenkins', 'Doug Jones'],
    seen: false
  },
  {
    id: '6',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    director: 'Daniels',
    writer: 'Daniels',
    runtime: 139,
    logline: 'A Chinese-American woman gets swept up in an adventure where she alone can save existence.',
    poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop',
    imdb_rating: 7.8,
    cast: ['Michelle Yeoh', 'Stephanie Hsu', 'Ke Huy Quan', 'Jamie Lee Curtis'],
    seen: false
  },
  {
    id: '7',
    title: 'Moonlight',
    year: 2016,
    genres: ['Drama'],
    director: 'Barry Jenkins',
    writer: 'Barry Jenkins',
    runtime: 111,
    logline: 'A young African-American man grapples with his identity and sexuality.',
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=450&fit=crop',
    imdb_rating: 7.4,
    cast: ['Trevante Rhodes', 'André Holland', 'Janelle Monáe', 'Ashton Sanders'],
    seen: false
  },
  {
    id: '8',
    title: 'John Wick',
    year: 2014,
    genres: ['Action', 'Thriller'],
    director: 'Chad Stahelski',
    writer: 'Derek Kolstad',
    runtime: 101,
    logline: 'An ex-hitman comes out of retirement to track down the gangsters who killed his dog.',
    poster_url: 'https://images.unsplash.com/photo-1518930259200-52d8e47b4651?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1518930259200-52d8e47b4651?w=800&h=450&fit=crop',
    imdb_rating: 7.4,
    cast: ['Keanu Reeves', 'Michael Nyqvist', 'Alfie Allen', 'Willem Dafoe'],
    seen: false
  },
  {
    id: '9',
    title: 'The Lobster',
    year: 2015,
    genres: ['Comedy', 'Drama', 'Romance'],
    director: 'Yorgos Lanthimos',
    writer: 'Yorgos Lanthimos',
    runtime: 119,
    logline: 'In a dystopian society, single people must find a romantic partner in 45 days.',
    poster_url: 'https://images.unsplash.com/photo-1489599317415-3bac6e9677cf?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1489599317415-3bac6e9677cf?w=800&h=450&fit=crop',
    imdb_rating: 7.1,
    cast: ['Colin Farrell', 'Rachel Weisz', 'Olivia Colman', 'Léa Seydoux'],
    seen: false
  },
  {
    id: '10',
    title: 'Spider-Man: Into the Spider-Verse',
    year: 2018,
    genres: ['Animation', 'Action', 'Adventure'],
    director: 'Bob Persichetti',
    writer: 'Phil Lord',
    runtime: 117,
    logline: 'Teen Miles Morales becomes Spider-Man and joins other Spider-People from parallel universes.',
    poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    backdrop_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=450&fit=crop',
    imdb_rating: 8.4,
    cast: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld', 'Mahershala Ali'],
    seen: false
  }
];

// Mock ratings data to simulate what movies have been rated
const mockRatings: Rating[] = [
  {
    id: '1',
    movieId: '1', // The Grand Budapest Hotel
    serotonin: 7.8,
    brainy_bonkers: 4.2,
    camp: 8.5,
    color: 9.2,
    pace: 5.5,
    darkness: 3.0,
    novelty: 6.8,
    social_safe: 8.8,
    runtime_fit: 8.0,
    subs_energy: 2.0,
    overall: 4,
    notes: 'Visually stunning and whimsical'
  },
  {
    id: '2',
    movieId: '2', // Inception
    serotonin: 4.5,
    brainy_bonkers: 9.5,
    camp: 2.0,
    color: 7.8,
    pace: 8.2,
    darkness: 6.5,
    novelty: 9.0,
    social_safe: 7.0,
    runtime_fit: 7.5,
    subs_energy: 3.0,
    overall: 5,
    notes: 'Mind-bending masterpiece'
  }
];

// Default attribute values for movies without ratings (global averages)
const globalAverageAttributes: VibePreferences = {
  serotonin: 5.5,
  brainy_bonkers: 4.0,
  camp: 3.5,
  color: 6.0,
  pace: 6.0,
  darkness: 5.0,
  novelty: 4.5,
  social_safe: 6.5,
  runtime_fit: 6.0,
  subs_energy: 3.0
};

// Genre-based attribute modifiers
const genreAttributes: Record<string, Partial<VibePreferences>> = {
  'Comedy': { serotonin: 7.5, camp: 6.0, social_safe: 8.0, darkness: 2.0 },
  'Drama': { serotonin: 4.0, brainy_bonkers: 6.0, darkness: 7.0, novelty: 5.0 },
  'Action': { pace: 8.5, serotonin: 6.0, color: 7.5, darkness: 4.0 },
  'Thriller': { pace: 7.5, darkness: 7.0, brainy_bonkers: 6.5, serotonin: 4.0 },
  'Sci-Fi': { brainy_bonkers: 8.0, novelty: 8.5, color: 7.0, subs_energy: 5.0 },
  'Science Fiction': { brainy_bonkers: 8.0, novelty: 8.5, color: 7.0, subs_energy: 5.0 },
  'Horror': { darkness: 9.0, serotonin: 2.0, social_safe: 3.0, pace: 7.0 },
  'Romance': { serotonin: 7.0, social_safe: 8.5, camp: 4.0, darkness: 3.0 },
  'Animation': { color: 8.5, serotonin: 7.5, camp: 6.0, social_safe: 9.0 },
  'Fantasy': { color: 8.0, novelty: 7.5, camp: 5.5, brainy_bonkers: 5.0 },
  'Adventure': { pace: 7.0, color: 7.0, serotonin: 6.5, social_safe: 7.5 },
  'Crime': { darkness: 6.5, brainy_bonkers: 5.5, pace: 6.0, social_safe: 5.0 },
  'Documentary': { brainy_bonkers: 7.0, novelty: 6.0, social_safe: 7.0, subs_energy: 4.0 },
  'Family': { serotonin: 8.0, social_safe: 9.5, darkness: 1.5, camp: 4.0 },
  'History': { brainy_bonkers: 6.5, darkness: 5.5, novelty: 4.0, subs_energy: 4.5 },
  'Music': { serotonin: 7.0, color: 7.5, social_safe: 8.0, camp: 5.5 },
  'Mystery': { brainy_bonkers: 7.0, novelty: 6.5, darkness: 5.5, pace: 5.5 },
  'War': { darkness: 8.5, brainy_bonkers: 5.5, serotonin: 3.0, social_safe: 4.0 },
  'Western': { pace: 5.5, color: 6.0, camp: 4.5, darkness: 5.0 }
};

// Runtime-based modifiers
const getRuntimeModifiers = (runtime: number): Partial<VibePreferences> => {
  if (runtime < 90) {
    return { runtime_fit: 7.5, pace: 7.0 }; // Short films tend to be well-paced
  } else if (runtime > 150) {
    return { runtime_fit: 5.0, brainy_bonkers: 6.0 }; // Long films might be more complex
  } else if (runtime > 180) {
    return { runtime_fit: 4.0, pace: 4.0 }; // Very long films often feel slow
  }
  return { runtime_fit: 6.5 }; // Average runtime
};

// IMDB rating modifiers
const getIMDBModifiers = (rating: number): Partial<VibePreferences> => {
  if (rating >= 8.0) {
    return { novelty: 6.5, brainy_bonkers: 6.0, color: 6.5 }; // High-rated films often innovative
  } else if (rating <= 5.0) {
    return { camp: 4.0, runtime_fit: 4.5 }; // Low-rated might be campy or poorly paced
  }
  return {}; // Average ratings don't modify much
};

// Function to predict movie attributes based on available information
export const predictMovieAttributes = (movieData: {
  genres: string[];
  runtime: number;
  imdb_rating?: number;
  year?: number;
  director?: string;
}): VibePreferences => {
  // Start with global averages
  let predictedAttributes = { ...globalAverageAttributes };

  // Apply genre modifiers
  if (movieData.genres.length > 0) {
    const genreModifiers: Partial<VibePreferences> = {};
    
    movieData.genres.forEach(genre => {
      const genreModifier = genreAttributes[genre];
      if (genreModifier) {
        Object.keys(genreModifier).forEach(key => {
          const attrKey = key as keyof VibePreferences;
          const modifier = genreModifier[attrKey];
          if (modifier !== undefined) {
            if (genreModifiers[attrKey] === undefined) {
              genreModifiers[attrKey] = modifier;
            } else {
              // Average multiple genre influences
              genreModifiers[attrKey] = (genreModifiers[attrKey]! + modifier) / 2;
            }
          }
        });
      }
    });

    // Blend genre modifiers with base attributes
    Object.keys(genreModifiers).forEach(key => {
      const attrKey = key as keyof VibePreferences;
      const modifier = genreModifiers[attrKey];
      if (modifier !== undefined) {
        // Weight: 70% genre influence, 30% global average
        predictedAttributes[attrKey] = (modifier * 0.7) + (predictedAttributes[attrKey] * 0.3);
      }
    });
  }

  // Apply runtime modifiers
  const runtimeMods = getRuntimeModifiers(movieData.runtime);
  Object.keys(runtimeMods).forEach(key => {
    const attrKey = key as keyof VibePreferences;
    const modifier = runtimeMods[attrKey];
    if (modifier !== undefined) {
      predictedAttributes[attrKey] = (predictedAttributes[attrKey] + modifier) / 2;
    }
  });

  // Apply IMDB rating modifiers
  if (movieData.imdb_rating) {
    const imdbMods = getIMDBModifiers(movieData.imdb_rating);
    Object.keys(imdbMods).forEach(key => {
      const attrKey = key as keyof VibePreferences;
      const modifier = imdbMods[attrKey];
      if (modifier !== undefined) {
        predictedAttributes[attrKey] = (predictedAttributes[attrKey] + modifier) / 2;
      }
    });
  }

  // Year-based modifiers (newer films might be more visually striking)
  if (movieData.year && movieData.year > 2010) {
    predictedAttributes.color = Math.min(10, predictedAttributes.color + 0.5);
  }

  // Director-based modifiers (simplified examples)
  if (movieData.director) {
    const director = movieData.director.toLowerCase();
    if (director.includes('wes anderson')) {
      predictedAttributes.color = Math.min(10, predictedAttributes.color + 2);
      predictedAttributes.camp = Math.min(10, predictedAttributes.camp + 1.5);
      predictedAttributes.novelty = Math.min(10, predictedAttributes.novelty + 1);
    } else if (director.includes('christopher nolan')) {
      predictedAttributes.brainy_bonkers = Math.min(10, predictedAttributes.brainy_bonkers + 2);
      predictedAttributes.novelty = Math.min(10, predictedAttributes.novelty + 1.5);
    } else if (director.includes('quentin tarantino')) {
      predictedAttributes.camp = Math.min(10, predictedAttributes.camp + 2);
      predictedAttributes.darkness = Math.min(10, predictedAttributes.darkness + 1);
    }
  }

  // Ensure values stay within bounds
  Object.keys(predictedAttributes).forEach(key => {
    const attrKey = key as keyof VibePreferences;
    predictedAttributes[attrKey] = Math.max(0, Math.min(10, predictedAttributes[attrKey]));
  });

  return predictedAttributes;
};

// Mock API functions
export const mockApi = {
  // Get movie recommendations based on vibe preferences
  getRecommendations: async (preferences: VibePreferences): Promise<Movie[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get unseen movies
    const unseenMovies = mockMovies.filter(movie => !movie.seen);
    
    // Calculate scores for each movie
    const scoredMovies = unseenMovies.map(movie => {
      // Get actual rating for this movie if it exists
      const existingRating = mockRatings.find(r => r.movieId === movie.id);
      
      let movieAttributes: VibePreferences;
      
      if (existingRating) {
        // Use actual rating data
        movieAttributes = {
          serotonin: existingRating.serotonin,
          brainy_bonkers: existingRating.brainy_bonkers,
          camp: existingRating.camp,
          color: existingRating.color,
          pace: existingRating.pace,
          darkness: existingRating.darkness,
          novelty: existingRating.novelty,
          social_safe: existingRating.social_safe,
          runtime_fit: existingRating.runtime_fit,
          subs_energy: existingRating.subs_energy
        };
      } else {
        // Predict attributes based on movie data
        movieAttributes = predictMovieAttributes({
          genres: movie.genres,
          runtime: movie.runtime,
          imdb_rating: movie.imdb_rating,
          year: movie.year,
          director: movie.director
        });
      }

      // Calculate similarity score (higher is better match)
      let score = 0;
      const attributeKeys = Object.keys(preferences) as Array<keyof VibePreferences>;
      
      attributeKeys.forEach(attr => {
        const diff = Math.abs(preferences[attr] - movieAttributes[attr]);
        // Convert difference to similarity (10 = perfect match, 0 = worst match)
        const similarity = Math.max(0, 10 - diff);
        score += similarity;
      });

      // Average the score
      score = score / attributeKeys.length;

      // Add some genre matching bonus
      const genreMatchBonus = movie.genres.length > 0 ? 0.5 : 0;
      
      // Runtime penalty for very long movies when runtime_fit preference is low
      const runtimePenalty = preferences.runtime_fit < 5 && movie.runtime > 150 ? -0.5 : 0;
      
      // Add some randomness to avoid always showing the same results
      const randomFactor = (Math.random() - 0.5) * 0.5;

      const finalScore = score + genreMatchBonus + runtimePenalty + randomFactor;

      return {
        ...movie,
        score: Math.max(0, Math.min(10, finalScore)) // Clamp between 0-10
      };
    });

    // Sort by score and return top 20
    return scoredMovies
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 20);
  },

  // Predict attributes for a movie
  predictAttributes: async (movieData: {
    genres: string[];
    runtime: number;
    imdb_rating?: number;
    year?: number;
    director?: string;
  }): Promise<VibePreferences> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return predictMovieAttributes(movieData);
  },

  // Add a new movie to Airtable (now with optional ratings)
  addMovie: async (movie: Omit<Movie, 'id' | 'seen'>, ratings?: Omit<Rating, 'id' | 'movieId'>): Promise<{ movie: Movie; rating?: Rating }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMovie: Movie = {
      ...movie,
      id: Date.now().toString(),
      seen: false
    };
    mockMovies.push(newMovie);

    let newRating: Rating | undefined;
    if (ratings) {
      newRating = {
        ...ratings,
        id: (Date.now() + 1).toString(),
        movieId: newMovie.id
      };
      mockRatings.push(newRating);
    }

    return { movie: newMovie, rating: newRating };
  },

  // Update movie (mark as seen)
  updateMovie: async (movieId: string, updates: Partial<Movie>): Promise<Movie> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const movieIndex = mockMovies.findIndex(m => m.id === movieId);
    if (movieIndex === -1) throw new Error('Movie not found');
    
    mockMovies[movieIndex] = { ...mockMovies[movieIndex], ...updates };
    return mockMovies[movieIndex];
  },

  // Get a movie by ID
  getMovie: async (movieId: string): Promise<Movie | null> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMovies.find(m => m.id === movieId) || null;
  },

  // Add a rating to Airtable
  addRating: async (rating: Omit<Rating, 'id'>): Promise<Rating> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRating: Rating = {
      ...rating,
      id: Date.now().toString()
    };
    mockRatings.push(newRating);
    return newRating;
  },

  // Enhanced TMDB search with detailed information
  searchTMDB: async (query: string): Promise<TMDBMovie[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock enhanced TMDB results
    const mockResults: TMDBMovie[] = [
      {
        id: 12345,
        title: query.includes(' ') ? query : `${query}: A Movie`,
        release_date: '2023-01-01',
        genre_ids: [18, 35], // Drama, Comedy
        overview: `An engaging story about ${query.toLowerCase()}. This film explores themes of identity, relationships, and personal growth through a compelling narrative that resonates with audiences worldwide.`,
        poster_path: '/mock-poster.jpg',
        backdrop_path: '/mock-backdrop.jpg',
        runtime: 120,
        vote_average: 7.5,
        cast: [
          { name: 'Emma Stone', character: 'Sarah' },
          { name: 'Ryan Gosling', character: 'Michael' },
          { name: 'Viola Davis', character: 'Dr. Williams' },
          { name: 'Oscar Isaac', character: 'David' }
        ],
        crew: [
          { name: 'Christopher Nolan', job: 'Director' },
          { name: 'Jordan Peele', job: 'Writer' },
          { name: 'Hans Zimmer', job: 'Composer' }
        ],
        imdb_id: 'tt1234567'
      },
      // Add a second result for variety
      {
        id: 67890,
        title: `${query} Returns`,
        release_date: '2024-06-15',
        genre_ids: [28, 878], // Action, Sci-Fi
        overview: `The thrilling sequel to the ${query} story. Packed with action and stunning visuals.`,
        poster_path: '/mock-poster-2.jpg',
        backdrop_path: '/mock-backdrop-2.jpg',
        runtime: 135,
        vote_average: 8.2,
        cast: [
          { name: 'Zendaya', character: 'Alex' },
          { name: 'Timothée Chalamet', character: 'Jordan' }
        ],
        crew: [
          { name: 'Denis Villeneuve', job: 'Director' },
          { name: 'Aaron Sorkin', job: 'Writer' }
        ]
      }
    ];
    
    return mockResults;
  }
};

// Genre mapping for TMDB genre IDs
export const genreMap: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};

// Enhanced attribute descriptions with visual elements
export const attributeDescriptions: Record<keyof VibePreferences, { 
  label: string; 
  description: string;
  icon: string;
  color: string;
  examples: { low: string; high: string };
}> = {
  serotonin: { 
    label: 'Serotonin', 
    description: 'How much joy and happiness does this bring you?',
    icon: '😊',
    color: '#f59e0b', // amber
    examples: { low: 'Requiem for a Dream', high: 'Paddington 2' }
  },
  brainy_bonkers: { 
    label: 'Brainy Bonkers', 
    description: 'How intellectually complex or mind-bending?',
    icon: '🧠',
    color: '#8b5cf6', // violet
    examples: { low: 'Fast & Furious', high: 'Primer' }
  },
  camp: { 
    label: 'Camp', 
    description: 'How deliberately over-the-top or absurd?',
    icon: '🎭',
    color: '#ec4899', // pink
    examples: { low: 'Manchester by the Sea', high: 'The Rocky Horror Picture Show' }
  },
  color: { 
    label: 'Color', 
    description: 'How visually striking and aesthetically rich?',
    icon: '🎨',
    color: '#10b981', // emerald
    examples: { low: 'The Road', high: 'Her' }
  },
  pace: { 
    label: 'Pace', 
    description: 'How fast-moving and energetic?',
    icon: '⚡',
    color: '#f97316', // orange
    examples: { low: '2001: A Space Odyssey', high: 'Mad Max: Fury Road' }
  },
  darkness: { 
    label: 'Darkness', 
    description: 'How heavy, serious, or emotionally intense?',
    icon: '🌙',
    color: '#6b7280', // gray
    examples: { low: 'The Princess Bride', high: 'Schindler\'s List' }
  },
  novelty: { 
    label: 'Novelty', 
    description: 'How unique, innovative, or surprising?',
    icon: '✨',
    color: '#06b6d4', // cyan
    examples: { low: 'Generic Rom-Com', high: 'Everything Everywhere All at Once' }
  },
  social_safe: { 
    label: 'Social Safe', 
    description: 'How comfortable to watch with others?',
    icon: '👥',
    color: '#22c55e', // green
    examples: { low: 'Nymphomaniac', high: 'Toy Story' }
  },
  runtime_fit: { 
    label: 'Runtime Fit', 
    description: 'How well-paced for its length?',
    icon: '⏱️',
    color: '#3b82f6', // blue
    examples: { low: 'The Irishman (bloated)', high: 'Whiplash (tight)' }
  },
  subs_energy: { 
    label: 'Subs Energy', 
    description: 'How much mental energy do subtitles require?',
    icon: '💭',
    color: '#a855f7', // purple
    examples: { low: 'English dialogue', high: 'Dense foreign arthouse' }
  }
};