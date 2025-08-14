// Onboarding Service - Selects diverse movies for taste calibration
import { Movie, enhancedMockApi } from './enhancedMockApi';
import { VibePreferences } from './enhancedMockApi';

export interface OnboardingMovie extends Movie {
  why_selected: string;
  diversity_tags: string[];
}

export interface OnboardingProgress {
  current_movie: number;
  total_movies: number;
  completed_ratings: OnboardingRating[];
  estimated_taste_profile: string;
}

export interface OnboardingRating {
  movie_id: string;
  movie_title: string;
  dimensions: VibePreferences;
  overall_rating: number;
  completion_time_seconds: number;
}

export interface OnboardingResults {
  ratings: OnboardingRating[];
  taste_profile: {
    personality_type: string;
    top_dimensions: Array<{ dimension: string; preference: number }>;
    movie_preferences: string[];
    accuracy_confidence: number;
  };
  next_recommendations: Movie[];
}

class OnboardingService {
  // Curated set of diverse movies for onboarding
  private readonly ONBOARDING_MOVIE_POOL: Array<{
    movie_criteria: string;
    why_diverse: string;
    expected_dimensions: Partial<VibePreferences>;
  }> = [
    {
      movie_criteria: "High serotonin, family-friendly",
      why_diverse: "Tests preference for pure joy and feel-good content",
      expected_dimensions: { serotonin: 5, social_safe: 5, camp: 2, darkness: 1 }
    },
    {
      movie_criteria: "Extremely brainy, complex narrative",
      why_diverse: "Tests tolerance for intellectual complexity",
      expected_dimensions: { brainy_bonkers: 5, novelty: 4, pace: 2, subs_energy: 3 }
    },
    {
      movie_criteria: "High camp, deliberately absurd",
      why_diverse: "Tests appreciation for over-the-top theatrical elements",
      expected_dimensions: { camp: 5, novelty: 4, social_safe: 3, brainy_bonkers: 2 }
    },
    {
      movie_criteria: "Visually stunning, color-rich",
      why_diverse: "Tests importance of visual aesthetics",
      expected_dimensions: { color: 5, serotonin: 4, novelty: 3, social_safe: 4 }
    },
    {
      movie_criteria: "Fast-paced action",
      why_diverse: "Tests preference for high-energy, kinetic films",
      expected_dimensions: { pace: 5, runtime_fit: 4, serotonin: 4, brainy_bonkers: 2 }
    },
    {
      movie_criteria: "Dark, emotionally heavy",
      why_diverse: "Tests tolerance for serious, depressing content",
      expected_dimensions: { darkness: 5, serotonin: 1, social_safe: 2, brainy_bonkers: 4 }
    },
    {
      movie_criteria: "Highly innovative/unique",
      why_diverse: "Tests desire for originality vs familiarity",
      expected_dimensions: { novelty: 5, brainy_bonkers: 4, camp: 3, color: 4 }
    },
    {
      movie_criteria: "Subtitled foreign film",
      why_diverse: "Tests willingness to read subtitles",
      expected_dimensions: { subs_energy: 4, brainy_bonkers: 4, novelty: 3, social_safe: 2 }
    },
    {
      movie_criteria: "Long runtime, slow burn",
      why_diverse: "Tests patience for deliberate pacing",
      expected_dimensions: { runtime_fit: 2, pace: 1, brainy_bonkers: 4, darkness: 3 }
    },
    {
      movie_criteria: "Mainstream crowd-pleaser",
      why_diverse: "Tests baseline for popular entertainment",
      expected_dimensions: { social_safe: 5, serotonin: 4, runtime_fit: 4, novelty: 2 }
    }
  ];

  // Get 10 movies for onboarding based on diversity criteria
  async getOnboardingMovies(): Promise<OnboardingMovie[]> {
    console.log('🎬 Selecting diverse movies for taste calibration...');

    // Initialize database to ensure we have movies
    await enhancedMockApi.initialize();
    const allMovies = await enhancedMockApi.getAllMovies();

    if (allMovies.length < 10) {
      throw new Error('Not enough movies in database for onboarding');
    }

    // Select movies that represent different points in our dimension space
    const selectedMovies: OnboardingMovie[] = [];
    
    // Try to match each diversity criteria with actual movies from our database
    for (const criteria of this.ONBOARDING_MOVIE_POOL) {
      if (selectedMovies.length >= 10) break;
      
      // Find a movie that hasn't been selected yet
      const candidateMovie = allMovies.find(movie => 
        !selectedMovies.find(selected => selected.id === movie.id) &&
        this.movieMatchesCriteria(movie, criteria)
      );

      if (candidateMovie) {
        selectedMovies.push({
          ...candidateMovie,
          why_selected: criteria.why_diverse,
          diversity_tags: this.generateDiversityTags(criteria.expected_dimensions)
        });
      }
    }

    // Fill remaining slots with diverse movies if we don't have 10
    while (selectedMovies.length < 10 && selectedMovies.length < allMovies.length) {
      const remainingMovies = allMovies.filter(movie => 
        !selectedMovies.find(selected => selected.id === movie.id)
      );
      
      if (remainingMovies.length === 0) break;
      
      // Pick a random remaining movie
      const randomMovie = remainingMovies[Math.floor(Math.random() * remainingMovies.length)];
      selectedMovies.push({
        ...randomMovie,
        why_selected: "Provides additional taste calibration data",
        diversity_tags: ["balanced", "calibration"]
      });
    }

    console.log(`✅ Selected ${selectedMovies.length} diverse movies for onboarding`);
    console.log(`🎯 Movies: ${selectedMovies.map(m => m.title).join(', ')}`);

    return selectedMovies.slice(0, 10); // Ensure exactly 10 movies
  }

  // Check if a movie matches the diversity criteria
  private movieMatchesCriteria(
    movie: Movie, 
    criteria: { expected_dimensions: Partial<VibePreferences> }
  ): boolean {
    // This is a simplified matching - in a real system you'd use the actual ratings
    // For now, we'll use some heuristics based on movie metadata
    
    if (criteria.expected_dimensions.serotonin === 5) {
      // Look for feel-good movies
      return movie.genres.includes('Comedy') || movie.genres.includes('Animation') || movie.genres.includes('Family');
    }
    
    if (criteria.expected_dimensions.brainy_bonkers === 5) {
      // Look for complex movies
      return movie.director?.toLowerCase().includes('nolan') || 
             movie.genres.includes('Sci-Fi') || 
             (movie.runtime && movie.runtime > 140);
    }
    
    if (criteria.expected_dimensions.camp === 5) {
      // Look for campy/theatrical movies
      return movie.director?.toLowerCase().includes('anderson') ||
             movie.director?.toLowerCase().includes('lanthimos') ||
             movie.genres.includes('Comedy');
    }
    
    if (criteria.expected_dimensions.color === 5) {
      // Look for visually striking movies
      return movie.director?.toLowerCase().includes('anderson') ||
             movie.director?.toLowerCase().includes('villeneuve') ||
             movie.genres.includes('Animation');
    }
    
    if (criteria.expected_dimensions.pace === 5) {
      // Look for action movies
      return movie.genres.includes('Action') || movie.genres.includes('Thriller');
    }
    
    if (criteria.expected_dimensions.darkness === 5) {
      // Look for dark movies
      return movie.genres.includes('Drama') && !movie.genres.includes('Comedy');
    }
    
    if (criteria.expected_dimensions.novelty === 5) {
      // Look for unique/innovative movies
      return movie.year && movie.year > 2015; // Recent films more likely to be innovative
    }
    
    if (criteria.expected_dimensions.subs_energy >= 4) {
      // Look for foreign films (we don't have this data, so use director as proxy)
      return movie.director?.toLowerCase().includes('bong') ||
             movie.director?.toLowerCase().includes('kurosawa');
    }

    // Default to true for remaining criteria
    return true;
  }

  private generateDiversityTags(dimensions: Partial<VibePreferences>): string[] {
    const tags: string[] = [];
    
    Object.entries(dimensions).forEach(([key, value]) => {
      if (value && value >= 4) {
        tags.push(`high-${key.replace('_', '-')}`);
      } else if (value && value <= 2) {
        tags.push(`low-${key.replace('_', '-')}`);
      }
    });
    
    return tags;
  }

  // Analyze onboarding results to create taste profile
  async analyzeOnboardingResults(ratings: OnboardingRating[]): Promise<OnboardingResults> {
    console.log('🤖 Analyzing your movie taste from onboarding ratings...');
    
    if (ratings.length === 0) {
      throw new Error('No ratings provided for analysis');
    }

    // Calculate average preferences across all dimensions
    const avgDimensions: VibePreferences = {
      serotonin: 0, brainy_bonkers: 0, camp: 0, color: 0, pace: 0,
      darkness: 0, novelty: 0, social_safe: 0, runtime_fit: 0, subs_energy: 0
    };

    ratings.forEach(rating => {
      Object.keys(avgDimensions).forEach(key => {
        const dim = key as keyof VibePreferences;
        avgDimensions[dim] += rating.dimensions[dim];
      });
    });

    Object.keys(avgDimensions).forEach(key => {
      const dim = key as keyof VibePreferences;
      avgDimensions[dim] = Math.round((avgDimensions[dim] / ratings.length) * 10) / 10;
    });

    // Find top dimensions (preferences > 3.5)
    const topDimensions = Object.entries(avgDimensions)
      .filter(([_, value]) => value > 3.5)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([dimension, preference]) => ({
        dimension: dimension.replace('_', ' '),
        preference
      }));

    // Determine personality type
    const personalityType = this.determinePersonalityType(avgDimensions, ratings);

    // Generate movie preferences description
    const moviePreferences = this.generateMoviePreferences(avgDimensions);

    // Calculate confidence based on rating consistency and completion
    const accuracyConfidence = this.calculateConfidence(ratings);

    // Get initial recommendations based on calibrated taste
    const nextRecommendations = await enhancedMockApi.getRecommendations(avgDimensions);

    const results: OnboardingResults = {
      ratings,
      taste_profile: {
        personality_type: personalityType,
        top_dimensions: topDimensions,
        movie_preferences: moviePreferences,
        accuracy_confidence: accuracyConfidence
      },
      next_recommendations: nextRecommendations.slice(0, 8) // Show 8 initial recommendations
    };

    // Store results for future recommendations
    this.storeOnboardingResults(results);

    return results;
  }

  private determinePersonalityType(avgDimensions: VibePreferences, ratings: OnboardingRating[]): string {
    // Analyze the combination of high dimensions to determine personality
    const high = (key: keyof VibePreferences) => avgDimensions[key] >= 4;
    const low = (key: keyof VibePreferences) => avgDimensions[key] <= 2;

    if (high('serotonin') && high('social_safe') && low('darkness')) {
      return "🌈 Sunshine Seeker";
    } else if (high('brainy_bonkers') && high('novelty')) {
      return "🧠 Mind-Bending Explorer";
    } else if (high('camp') && high('novelty')) {
      return "🎭 Chaos Enthusiast";
    } else if (high('color') && high('serotonin')) {
      return "🎨 Visual Joy Collector";
    } else if (high('pace') && low('runtime_fit')) {
      return "⚡ Adrenaline Junkie";
    } else if (high('darkness') && high('brainy_bonkers')) {
      return "🌑 Thoughtful Pessimist";
    } else if (low('novelty') && high('social_safe')) {
      return "🏠 Comfort Zone Curator";
    } else {
      return "🎬 Balanced Cinephile";
    }
  }

  private generateMoviePreferences(avgDimensions: VibePreferences): string[] {
    const preferences: string[] = [];

    if (avgDimensions.serotonin >= 4) preferences.push("Feel-good movies that lift your spirits");
    if (avgDimensions.brainy_bonkers >= 4) preferences.push("Complex, thought-provoking narratives");
    if (avgDimensions.camp >= 4) preferences.push("Theatrical, over-the-top entertainment");
    if (avgDimensions.color >= 4) preferences.push("Visually stunning cinematography");
    if (avgDimensions.pace >= 4) preferences.push("Fast-paced, energetic action");
    if (avgDimensions.novelty >= 4) preferences.push("Original, innovative storytelling");
    if (avgDimensions.social_safe >= 4) preferences.push("Movies perfect for group watching");
    if (avgDimensions.subs_energy <= 2) preferences.push("English-language films preferred");
    
    if (preferences.length === 0) {
      preferences.push("A balanced mix of different movie styles");
    }

    return preferences.slice(0, 4); // Limit to top 4 preferences
  }

  private calculateConfidence(ratings: OnboardingRating[]): number {
    // Calculate confidence based on:
    // 1. Completion rate (did they rate all movies?)
    // 2. Rating consistency (not all 3s)
    // 3. Time spent (not rushed)

    let confidence = 0.5; // Base confidence

    // Completion bonus
    if (ratings.length >= 8) confidence += 0.2;
    if (ratings.length >= 10) confidence += 0.1;

    // Consistency bonus (variety in ratings)
    const ratingsVariety = this.calculateRatingVariety(ratings);
    confidence += ratingsVariety * 0.2;

    // Time spent bonus (not rushed)
    const avgTime = ratings.reduce((sum, r) => sum + r.completion_time_seconds, 0) / ratings.length;
    if (avgTime > 30) confidence += 0.1; // Bonus for thoughtful rating

    return Math.min(1, Math.max(0, confidence));
  }

  private calculateRatingVariety(ratings: OnboardingRating[]): number {
    // Calculate how varied the ratings are (0 = all same, 1 = very varied)
    const allRatings = ratings.flatMap(r => Object.values(r.dimensions));
    const unique = new Set(allRatings).size;
    return Math.min(1, unique / 5); // Normalize to 0-1
  }

  private storeOnboardingResults(results: OnboardingResults): void {
    // Store in localStorage for persistence
    try {
      localStorage.setItem('movieRecommender_onboardingResults', JSON.stringify({
        completed_at: new Date().toISOString(),
        taste_profile: results.taste_profile,
        ratings_count: results.ratings.length
      }));
      console.log('✅ Onboarding results stored successfully');
    } catch (error) {
      console.warn('⚠️ Failed to store onboarding results:', error);
    }
  }

  // Check if user has completed onboarding
  hasCompletedOnboarding(): boolean {
    try {
      const stored = localStorage.getItem('movieRecommender_onboardingResults');
      return !!stored;
    } catch {
      return false;
    }
  }

  // Get stored onboarding results
  getStoredResults(): OnboardingResults['taste_profile'] | null {
    try {
      const stored = localStorage.getItem('movieRecommender_onboardingResults');
      return stored ? JSON.parse(stored).taste_profile : null;
    } catch {
      return null;
    }
  }

  // Clear onboarding data (for testing)
  clearOnboardingData(): void {
    localStorage.removeItem('movieRecommender_onboardingResults');
  }
}

export const onboardingService = new OnboardingService();