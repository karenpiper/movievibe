// Enhanced Mock API that integrates Letterboxd data and 5-point scale
import { dataPopulationService, PopulatedMovie, shouldPopulateDatabase, markDatabasePopulated } from './dataPopulationService';
import { dimensionScales } from './dimensionSystem';

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
  
  // Enhanced fields from Letterboxd
  letterboxd_id?: string;
  letterboxd_url?: string;
  community_rating?: number;
  review_count?: number;
  ai_confidence?: number;
  analysis_summary?: string;
}

export interface Rating {
  id: string;
  movieId: string;
  serotonin: number; // Now 1-5 scale
  brainy_bonkers: number;
  camp: number;
  color: number;
  pace: number;
  darkness: number;
  novelty: number;
  social_safe: number;
  runtime_fit: number;
  subs_energy: number;
  overall: number; // 1-5 star rating
  notes: string;
}

export interface VibePreferences {
  serotonin: number; // 1-5 scale
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

// Global storage for populated data
let mockMovies: Movie[] = [];
let mockRatings: Rating[] = [];
let isPopulating = false;
let populationProgress: { completed: number; total: number; status: string } = { completed: 0, total: 0, status: 'idle' };

// Initialize database on first load
let initPromise: Promise<void> | null = null;

const initializeDatabase = async (): Promise<void> => {
  if (initPromise) return initPromise;
  
  initPromise = (async () => {
    console.log('🎬 Initializing movie database...');
    
    // Check if we have existing data
    const existingData = localStorage.getItem('movieRecommender_populatedData');
    const shouldRepopulate = shouldPopulateDatabase();
    
    if (existingData && !shouldRepopulate) {
      console.log('📚 Loading existing movie data from storage...');
      try {
        const data = JSON.parse(existingData);
        mockMovies = data.movies || [];
        mockRatings = data.ratings || [];
        console.log(`✅ Loaded ${mockMovies.length} movies and ${mockRatings.length} ratings from storage`);
        return;
      } catch (error) {
        console.warn('⚠️ Failed to load existing data, will repopulate:', error);
      }
    }
    
    // Populate with fresh data
    await populateDatabaseFromLetterboxd();
  })();
  
  return initPromise;
};

const populateDatabaseFromLetterboxd = async (): Promise<void> => {
  if (isPopulating) return;
  
  isPopulating = true;
  console.log('🚀 Populating database with Letterboxd + AI analysis...');
  
  try {
    // Set up progress tracking
    dataPopulationService.setProgressCallback((progress) => {
      populationProgress = {
        completed: progress.completed,
        total: progress.total,
        status: progress.current_movie
      };
      console.log(`📊 Progress: ${progress.completed}/${progress.total} - ${progress.current_movie}`);
    });
    
    // Populate with Letterboxd data
    const result = await dataPopulationService.populateDatabase(30); // Start with 30 movies
    
    // Convert populated movies to our format
    mockMovies = result.movies.map(movie => ({
      ...movie,
      seen: false,
      score: undefined
    }));
    
    mockRatings = result.ratings;
    
    // Save to localStorage for future use
    localStorage.setItem('movieRecommender_populatedData', JSON.stringify({
      movies: mockMovies,
      ratings: mockRatings,
      populated_at: new Date().toISOString(),
      summary: result.summary
    }));
    
    markDatabasePopulated();
    
    console.log(`✅ Database populated successfully!`);
    console.log(`📊 Summary: ${result.summary.total_movies} movies, ${Math.round(result.summary.avg_confidence * 100)}% avg confidence`);
    console.log(`🎯 Top dimensions: ${result.summary.top_dimensions.join(', ')}`);
    
  } catch (error) {
    console.error('❌ Failed to populate database:', error);
    // Fall back to minimal data if population fails
    await createFallbackData();
  } finally {
    isPopulating = false;
  }
};

const createFallbackData = async (): Promise<void> => {
  console.log('🔄 Creating fallback data...');
  
  // Minimal fallback dataset with 5-point ratings
  mockMovies = [
    {
      id: 'fallback_1',
      title: 'The Grand Budapest Hotel',
      year: 2014,
      genres: ['Comedy', 'Drama'],
      director: 'Wes Anderson',
      runtime: 99,
      logline: 'A legendary concierge and his protégé become involved in a murder mystery.',
      poster_url: 'https://images.unsplash.com/photo-1489599317415-3bac6e9677cf?w=300&h=450&fit=crop',
      seen: false,
      analysis_summary: 'Visually stunning Wes Anderson film with high camp and color values.'
    },
    {
      id: 'fallback_2',
      title: 'Mad Max: Fury Road',
      year: 2015,
      genres: ['Action', 'Adventure'],
      director: 'George Miller',
      runtime: 120,
      logline: 'In a post-apocalyptic wasteland, Max teams up with Furiosa to escape a tyrannical warlord.',
      poster_url: 'https://images.unsplash.com/photo-1518930259200-52d8e47b4651?w=300&h=450&fit=crop',
      seen: false,
      analysis_summary: 'High-octane action film with exceptional pacing and runtime fit.'
    },
    {
      id: 'fallback_3',
      title: 'Everything Everywhere All at Once',
      year: 2022,
      genres: ['Comedy', 'Sci-Fi'],
      director: 'Daniels',
      runtime: 139,
      logline: 'A Chinese-American woman gets swept up in an adventure where she alone can save existence.',
      poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
      seen: false,
      analysis_summary: 'Extremely high novelty and camp values with strong visual elements.'
    }
  ];

  mockRatings = [
    {
      id: 'rating_fallback_1',
      movieId: 'fallback_1',
      serotonin: 4,
      brainy_bonkers: 3,
      camp: 5,
      color: 5,
      pace: 3,
      darkness: 2,
      novelty: 4,
      social_safe: 4,
      runtime_fit: 4,
      subs_energy: 1,
      overall: 4,
      notes: 'Fallback rating for Wes Anderson film'
    },
    {
      id: 'rating_fallback_2',
      movieId: 'fallback_2',
      serotonin: 4,
      brainy_bonkers: 2,
      camp: 2,
      color: 4,
      pace: 5,
      darkness: 3,
      novelty: 3,
      social_safe: 4,
      runtime_fit: 5,
      subs_energy: 1,
      overall: 4,
      notes: 'Fallback rating for action film'
    },
    {
      id: 'rating_fallback_3',
      movieId: 'fallback_3',
      serotonin: 4,
      brainy_bonkers: 4,
      camp: 5,
      color: 5,
      pace: 4,
      darkness: 2,
      novelty: 5,
      social_safe: 3,
      runtime_fit: 4,
      subs_energy: 1,
      overall: 5,
      notes: 'Fallback rating for multiverse film'
    }
  ];
};

// Enhanced API with 5-point scale calculations
export const enhancedMockApi = {
  // Initialize database (called automatically)
  initialize: initializeDatabase,

  // Get population progress for UI
  getPopulationProgress: () => populationProgress,

  // Get movie recommendations using 5-point scale
  getRecommendations: async (preferences: VibePreferences): Promise<Movie[]> => {
    await initializeDatabase();
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log('🎯 Getting recommendations with 5-point preferences:', preferences);

    // Get unseen movies
    const unseenMovies = mockMovies.filter(movie => !movie.seen);
    console.log(`📚 Found ${unseenMovies.length} unseen movies`);

    if (unseenMovies.length === 0) {
      console.log('ℹ️ No unseen movies available');
      return [];
    }

    // Calculate scores for each movie using 5-point system
    const scoredMovies = unseenMovies.map(movie => {
      const movieRating = mockRatings.find(r => r.movieId === movie.id);
      
      if (!movieRating) {
        console.warn(`⚠️ No rating found for movie: ${movie.title}`);
        return { ...movie, score: 0 };
      }

      // Calculate similarity score using 5-point scale (1-5)
      let totalDifference = 0;
      const dimensions = Object.keys(preferences) as Array<keyof VibePreferences>;
      
      dimensions.forEach(dimension => {
        const userPref = preferences[dimension];
        const movieValue = movieRating[dimension];
        const difference = Math.abs(userPref - movieValue);
        totalDifference += difference;
      });

      // Convert total difference to similarity score
      // Perfect match (0 difference) = 5.0, worst match (4*10 dimensions = 40) = 0
      const maxPossibleDifference = 4 * dimensions.length; // 4 is max difference per dimension in 5-point scale
      const similarity = Math.max(0, 5 - (totalDifference / maxPossibleDifference) * 5);

      // Add small random factor to avoid identical scores
      const randomFactor = (Math.random() - 0.5) * 0.2;
      const finalScore = Math.max(0, Math.min(5, similarity + randomFactor));

      console.log(`🎬 ${movie.title}: difference=${totalDifference.toFixed(1)}, similarity=${similarity.toFixed(2)}, final=${finalScore.toFixed(2)}`);

      return {
        ...movie,
        score: Math.round(finalScore * 10) / 10 // Round to 1 decimal
      };
    });

    // Sort by score and return top results
    const recommendations = scoredMovies
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 20);

    console.log(`✅ Returning ${recommendations.length} recommendations`);
    console.log(`🥇 Top 3: ${recommendations.slice(0, 3).map(m => `${m.title} (${m.score})`).join(', ')}`);

    return recommendations;
  },

  // Add a new movie
  addMovie: async (movie: Omit<Movie, 'id' | 'seen'>, ratings?: Omit<Rating, 'id' | 'movieId'>): Promise<{ movie: Movie; rating?: Rating }> => {
    await initializeDatabase();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newMovie: Movie = {
      ...movie,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      seen: false
    };
    mockMovies.push(newMovie);

    let newRating: Rating | undefined;
    if (ratings) {
      newRating = {
        ...ratings,
        id: `rating_${newMovie.id}`,
        movieId: newMovie.id
      };
      mockRatings.push(newRating);
    }

    // Update localStorage
    localStorage.setItem('movieRecommender_populatedData', JSON.stringify({
      movies: mockMovies,
      ratings: mockRatings,
      populated_at: new Date().toISOString()
    }));

    return { movie: newMovie, rating: newRating };
  },

  // Add a rating
  addRating: async (rating: Omit<Rating, 'id'>): Promise<Rating> => {
    await initializeDatabase();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newRating: Rating = {
      ...rating,
      id: `rating_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    mockRatings.push(newRating);

    // Update localStorage
    localStorage.setItem('movieRecommender_populatedData', JSON.stringify({
      movies: mockMovies,
      ratings: mockRatings,
      populated_at: new Date().toISOString()
    }));

    return newRating;
  },

  // Update movie (mark as seen)
  updateMovie: async (movieId: string, updates: Partial<Movie>): Promise<Movie> => {
    await initializeDatabase();
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const movieIndex = mockMovies.findIndex(m => m.id === movieId);
    if (movieIndex === -1) throw new Error('Movie not found');
    
    mockMovies[movieIndex] = { ...mockMovies[movieIndex], ...updates };

    // Update localStorage
    localStorage.setItem('movieRecommender_populatedData', JSON.stringify({
      movies: mockMovies,
      ratings: mockRatings,
      populated_at: new Date().toISOString()
    }));

    return mockMovies[movieIndex];
  },

  // Get a movie by ID
  getMovie: async (movieId: string): Promise<Movie | null> => {
    await initializeDatabase();
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockMovies.find(m => m.id === movieId) || null;
  },

  // Get all movies (for debugging)
  getAllMovies: async (): Promise<Movie[]> => {
    await initializeDatabase();
    return mockMovies;
  },

  // Get all ratings (for debugging)
  getAllRatings: async (): Promise<Rating[]> => {
    await initializeDatabase();
    return mockRatings;
  },

  // TMDB search (unchanged)
  searchTMDB: async (query: string): Promise<TMDBMovie[]> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockResults: TMDBMovie[] = [
      {
        id: 12345,
        title: query.includes(' ') ? query : `${query}: A Movie`,
        release_date: '2023-01-01',
        genre_ids: [18, 35],
        overview: `An engaging story about ${query.toLowerCase()}. This film explores themes of identity, relationships, and personal growth.`,
        poster_path: '/mock-poster.jpg',
        backdrop_path: '/mock-backdrop.jpg',
        runtime: 120,
        vote_average: 7.5,
        cast: [
          { name: 'Emma Stone', character: 'Sarah' },
          { name: 'Ryan Gosling', character: 'Michael' }
        ],
        crew: [
          { name: 'Christopher Nolan', job: 'Director' },
          { name: 'Jordan Peele', job: 'Writer' }
        ]
      }
    ];
    
    return mockResults;
  },

  // Force repopulation (for testing)
  repopulateDatabase: async (): Promise<void> => {
    localStorage.removeItem('movieRecommender_populatedData');
    localStorage.removeItem('lastDatabasePopulation');
    mockMovies = [];
    mockRatings = [];
    initPromise = null;
    await initializeDatabase();
  }
};

// Re-export types and dimension info
export * from './dimensionSystem';

// Initialize immediately when imported
enhancedMockApi.initialize().catch(console.error);