// Enhanced API that integrates machine learning with the existing mock API
import { mockApi, Movie, Rating, VibePreferences, TMDBMovie, predictMovieAttributes } from './mockApi';
import { mlEngine, MLPrediction } from './mlEngine';

export interface EnhancedMovie extends Movie {
  mlPrediction?: MLPrediction;
  personalizedScore?: number;
}

export interface UserSession {
  userId: string;
  sessionStart: Date;
  ratingsCount: number;
}

class EnhancedAPI {
  private currentUser: UserSession | null = null;
  private isInitialized = false;

  constructor() {
    this.initializeUser();
  }

  private initializeUser() {
    // In a real app, this would come from authentication
    // For now, we'll create a consistent user ID based on browser
    const userId = this.getUserId();
    this.currentUser = {
      userId,
      sessionStart: new Date(),
      ratingsCount: 0
    };

    // Load any existing user data from localStorage
    this.loadUserData();
    this.isInitialized = true;
  }

  private getUserId(): string {
    let userId = localStorage.getItem('movieRecommender_userId');
    if (!userId) {
      userId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('movieRecommender_userId', userId);
    }
    return userId;
  }

  private loadUserData() {
    if (!this.currentUser) return;

    try {
      const savedData = localStorage.getItem(`movieRecommender_userData_${this.currentUser.userId}`);
      if (savedData) {
        const userData = JSON.parse(savedData);
        mlEngine.importUserData(userData);
        console.log(`Loaded ${userData.ratings.length} ratings for user ${this.currentUser.userId}`);
      }
    } catch (error) {
      console.warn('Failed to load user data:', error);
    }
  }

  private saveUserData() {
    if (!this.currentUser) return;

    try {
      const userData = mlEngine.exportUserData(this.currentUser.userId);
      if (userData) {
        localStorage.setItem(`movieRecommender_userData_${this.currentUser.userId}`, JSON.stringify(userData));
      }
    } catch (error) {
      console.warn('Failed to save user data:', error);
    }
  }

  // Enhanced movie recommendations with ML
  async getRecommendations(preferences: VibePreferences): Promise<EnhancedMovie[]> {
    const basicRecommendations = await mockApi.getRecommendations(preferences);
    
    if (!this.currentUser) return basicRecommendations;

    // Use ML engine for personalized recommendations
    const personalizedRecommendations = await mlEngine.getPersonalizedRecommendations(
      this.currentUser.userId,
      preferences,
      basicRecommendations
    );

    return personalizedRecommendations as EnhancedMovie[];
  }

  // Enhanced attribute prediction with ML
  async predictAttributes(movieData: {
    genres: string[];
    runtime: number;
    imdb_rating?: number;
    year?: number;
    director?: string;
  }): Promise<{ 
    basic: VibePreferences; 
    ml: MLPrediction; 
    recommended: VibePreferences;
  }> {
    // Get basic prediction (your existing algorithm)
    const basicPrediction = predictMovieAttributes(movieData);

    // Get ML-enhanced prediction
    const mlPrediction = await mlEngine.predictMovieAttributes(
      movieData, 
      this.currentUser?.userId
    );

    // Decide which prediction to recommend based on confidence and user history
    let recommendedPrediction = basicPrediction;
    
    if (this.currentUser && mlPrediction.confidence > 0.6) {
      // Use ML prediction if we have good confidence and user data
      recommendedPrediction = mlPrediction.attributes;
    } else if (mlPrediction.method === 'hybrid') {
      // Blend predictions if we have hybrid approach
      recommendedPrediction = this.blendPredictions(basicPrediction, mlPrediction.attributes, 0.6, 0.4);
    }

    return {
      basic: basicPrediction,
      ml: mlPrediction,
      recommended: recommendedPrediction
    };
  }

  private blendPredictions(pred1: VibePreferences, pred2: VibePreferences, weight1: number, weight2: number): VibePreferences {
    const blended: VibePreferences = {
      serotonin: 0, brainy_bonkers: 0, camp: 0, color: 0, pace: 0,
      darkness: 0, novelty: 0, social_safe: 0, runtime_fit: 0, subs_energy: 0
    };

    Object.keys(blended).forEach(key => {
      const attr = key as keyof VibePreferences;
      blended[attr] = pred1[attr] * weight1 + pred2[attr] * weight2;
    });

    return blended;
  }

  // Enhanced rating submission with ML learning
  async addRating(rating: Omit<Rating, 'id'>): Promise<{ 
    rating: Rating; 
    learningUpdate: string;
    improvementTips: string[];
  }> {
    const result = await mockApi.addRating(rating);
    
    if (this.currentUser) {
      // Add to ML engine for learning
      mlEngine.addUserRating(this.currentUser.userId, result);
      this.currentUser.ratingsCount++;

      // Save updated user data
      this.saveUserData();

      // Generate learning insights
      const learningUpdate = this.generateLearningUpdate();
      const improvementTips = this.generateImprovementTips();

      return {
        rating: result,
        learningUpdate,
        improvementTips
      };
    }

    return {
      rating: result,
      learningUpdate: 'Rating saved successfully!',
      improvementTips: []
    };
  }

  private generateLearningUpdate(): string {
    if (!this.currentUser) return 'Rating saved!';

    const ratingsCount = this.currentUser.ratingsCount;
    
    if (ratingsCount === 1) {
      return 'Great! Your first rating helps us understand your taste.';
    } else if (ratingsCount === 5) {
      return 'Nice! With 5 ratings, our recommendations are getting more accurate.';
    } else if (ratingsCount === 10) {
      return 'Excellent! With 10+ ratings, we can now provide highly personalized recommendations.';
    } else if (ratingsCount % 20 === 0) {
      return `Amazing! ${ratingsCount} ratings make you a power user. Our AI is learning your unique taste.`;
    }
    
    return 'Thanks! Your rating helps improve future recommendations.';
  }

  private generateImprovementTips(): string[] {
    if (!this.currentUser) return [];

    const ratingsCount = this.currentUser.ratingsCount;
    const tips: string[] = [];

    if (ratingsCount < 5) {
      tips.push('Rate 5+ movies to unlock personalized recommendations');
    }

    if (ratingsCount < 10) {
      tips.push('Try rating movies from different genres to improve variety');
    }

    if (ratingsCount >= 10) {
      tips.push('Your recommendations are now powered by machine learning!');
    }

    return tips;
  }

  // Enhanced movie addition with ML prediction
  async addMovie(
    movie: Omit<Movie, 'id' | 'seen'>, 
    ratings?: Omit<Rating, 'id' | 'movieId'>
  ): Promise<{ 
    movie: Movie; 
    rating?: Rating; 
    mlFeedback?: string;
  }> {
    const result = await mockApi.addMovie(movie, ratings);
    
    let mlFeedback: string | undefined;
    
    if (ratings && this.currentUser) {
      // Get ML prediction for this movie to compare with user rating
      const prediction = await this.predictAttributes({
        genres: movie.genres,
        runtime: movie.runtime,
        imdb_rating: movie.imdb_rating,
        year: movie.year,
        director: movie.director
      });

      // Learn from the user's rating vs our prediction
      if (result.rating) {
        mlEngine.learnFromFeedback(
          this.currentUser.userId,
          result.movie.id,
          result.rating,
          prediction.recommended
        );

        // Calculate how much the user's rating differed from prediction
        const userVector = [
          result.rating.serotonin, result.rating.brainy_bonkers, result.rating.camp,
          result.rating.color, result.rating.pace, result.rating.darkness,
          result.rating.novelty, result.rating.social_safe, result.rating.runtime_fit,
          result.rating.subs_energy
        ];
        
        const predVector = [
          prediction.recommended.serotonin, prediction.recommended.brainy_bonkers,
          prediction.recommended.camp, prediction.recommended.color, prediction.recommended.pace,
          prediction.recommended.darkness, prediction.recommended.novelty, prediction.recommended.social_safe,
          prediction.recommended.runtime_fit, prediction.recommended.subs_energy
        ];

        const avgDifference = userVector.reduce((sum, val, i) => sum + Math.abs(val - predVector[i]), 0) / userVector.length;

        if (avgDifference < 1.5) {
          mlFeedback = "Great! Our AI prediction was very close to your rating. This helps us understand your taste better.";
        } else if (avgDifference < 3) {
          mlFeedback = "Thanks! Your rating helps fine-tune our recommendations for your unique preferences.";
        } else {
          mlFeedback = "Interesting! Your rating was quite different from our prediction - this valuable feedback improves our AI.";
        }

        this.saveUserData();
      }
    }

    return {
      ...result,
      mlFeedback
    };
  }

  // Get user insights and statistics
  getUserInsights(): {
    ratingsCount: number;
    favoriteGenres: string[];
    personalityProfile: string;
    recommendationAccuracy: string;
    topAttributes: Array<{ attribute: string; value: number }>;
  } | null {
    if (!this.currentUser) return null;

    const userData = mlEngine.exportUserData(this.currentUser.userId);
    if (!userData || userData.ratings.length === 0) return null;

    // Calculate favorite genres from rated movies
    const genreCounts: Record<string, number> = {};
    // This would require access to movie data - simplified for now
    const favoriteGenres = ['Action', 'Drama', 'Comedy']; // Placeholder

    // Calculate personality profile
    const prefs = userData.preferences;
    const topAttributes = Object.entries(prefs)
      .map(([attr, value]) => ({ attribute: attr, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);

    let personalityProfile = "Balanced Viewer";
    if (prefs.brainy_bonkers > 7) personalityProfile = "Intellectual Explorer";
    else if (prefs.serotonin > 7) personalityProfile = "Joy Seeker";
    else if (prefs.novelty > 7) personalityProfile = "Innovation Hunter";
    else if (prefs.camp > 7) personalityProfile = "Camp Enthusiast";

    const recommendationAccuracy = userData.confidence > 0.8 ? "Excellent" : 
                                  userData.confidence > 0.6 ? "Good" :
                                  userData.confidence > 0.4 ? "Improving" : "Learning";

    return {
      ratingsCount: userData.ratings.length,
      favoriteGenres,
      personalityProfile,
      recommendationAccuracy,
      topAttributes
    };
  }

  // Reset user data (for testing/privacy)
  resetUserData() {
    if (this.currentUser) {
      localStorage.removeItem(`movieRecommender_userData_${this.currentUser.userId}`);
      this.currentUser.ratingsCount = 0;
      this.initializeUser();
    }
  }

  // All other methods from mockApi
  updateMovie = mockApi.updateMovie;
  getMovie = mockApi.getMovie;
  searchTMDB = mockApi.searchTMDB;
}

// Export singleton instance
export const enhancedApi = new EnhancedAPI();

// Re-export types for convenience
export * from './mockApi';
export * from './mlEngine';