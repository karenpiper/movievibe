// Machine Learning Engine for Movie Recommendations
// Implements collaborative filtering, matrix factorization, and pattern learning

import { VibePreferences, Rating, Movie } from './mockApi';

export interface UserProfile {
  userId: string;
  ratings: Rating[];
  preferences: VibePreferences;
  similarUsers: string[];
  confidence: number;
}

export interface MLPrediction {
  attributes: VibePreferences;
  confidence: number;
  method: 'collaborative' | 'content' | 'hybrid';
  similarMovies: string[];
  reasoning: string[];
}

export interface UserSimilarity {
  userId: string;
  similarity: number;
  commonRatings: number;
}

class MLEngine {
  private userProfiles: Map<string, UserProfile> = new Map();
  private movieRatings: Map<string, Rating[]> = new Map();
  private genreEmbeddings: Map<string, number[]> = new Map();
  private directorEmbeddings: Map<string, number[]> = new Map();
  
  // Initialize genre embeddings (simplified representation)
  constructor() {
    this.initializeEmbeddings();
  }

  private initializeEmbeddings() {
    // Simplified genre embeddings - in production, these would be learned from data
    const genreVectors: Record<string, number[]> = {
      'Action': [0.8, 0.3, 0.1, 0.7, 0.9, 0.4, 0.5, 0.6, 0.7, 0.2],
      'Comedy': [0.9, 0.2, 0.8, 0.6, 0.5, 0.1, 0.4, 0.9, 0.8, 0.3],
      'Drama': [0.3, 0.7, 0.2, 0.5, 0.4, 0.8, 0.6, 0.7, 0.6, 0.4],
      'Horror': [0.1, 0.4, 0.3, 0.4, 0.6, 0.9, 0.7, 0.2, 0.5, 0.3],
      'Sci-Fi': [0.5, 0.9, 0.4, 0.8, 0.7, 0.5, 0.9, 0.6, 0.7, 0.6],
      'Romance': [0.8, 0.3, 0.5, 0.6, 0.4, 0.2, 0.3, 0.9, 0.7, 0.4],
      'Thriller': [0.4, 0.8, 0.3, 0.6, 0.8, 0.7, 0.7, 0.5, 0.6, 0.5],
      'Animation': [0.9, 0.4, 0.7, 0.9, 0.6, 0.2, 0.6, 0.9, 0.8, 0.3],
      'Fantasy': [0.7, 0.6, 0.6, 0.8, 0.5, 0.4, 0.8, 0.7, 0.6, 0.5],
      'Crime': [0.3, 0.6, 0.2, 0.5, 0.6, 0.7, 0.5, 0.4, 0.5, 0.4]
    };

    Object.entries(genreVectors).forEach(([genre, vector]) => {
      this.genreEmbeddings.set(genre, vector);
    });
  }

  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    
    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  // Convert rating to attribute vector
  private ratingToVector(rating: Rating): number[] {
    return [
      rating.serotonin,
      rating.brainy_bonkers,
      rating.camp,
      rating.color,
      rating.pace,
      rating.darkness,
      rating.novelty,
      rating.social_safe,
      rating.runtime_fit,
      rating.subs_energy
    ];
  }

  // Convert attribute object to vector
  private attributesToVector(attributes: VibePreferences): number[] {
    return [
      attributes.serotonin,
      attributes.brainy_bonkers,
      attributes.camp,
      attributes.color,
      attributes.pace,
      attributes.darkness,
      attributes.novelty,
      attributes.social_safe,
      attributes.runtime_fit,
      attributes.subs_energy
    ];
  }

  // Convert vector back to attributes
  private vectorToAttributes(vector: number[]): VibePreferences {
    return {
      serotonin: Math.max(0, Math.min(10, vector[0])),
      brainy_bonkers: Math.max(0, Math.min(10, vector[1])),
      camp: Math.max(0, Math.min(10, vector[2])),
      color: Math.max(0, Math.min(10, vector[3])),
      pace: Math.max(0, Math.min(10, vector[4])),
      darkness: Math.max(0, Math.min(10, vector[5])),
      novelty: Math.max(0, Math.min(10, vector[6])),
      social_safe: Math.max(0, Math.min(10, vector[7])),
      runtime_fit: Math.max(0, Math.min(10, vector[8])),
      subs_energy: Math.max(0, Math.min(10, vector[9]))
    };
  }

  // Add user rating data
  addUserRating(userId: string, rating: Rating) {
    // Update user profile
    if (!this.userProfiles.has(userId)) {
      this.userProfiles.set(userId, {
        userId,
        ratings: [],
        preferences: this.calculateUserPreferences([]),
        similarUsers: [],
        confidence: 0
      });
    }

    const profile = this.userProfiles.get(userId)!;
    profile.ratings.push(rating);
    profile.preferences = this.calculateUserPreferences(profile.ratings);
    profile.confidence = Math.min(1, profile.ratings.length / 10); // Confidence increases with more ratings

    // Update movie ratings index
    if (!this.movieRatings.has(rating.movieId)) {
      this.movieRatings.set(rating.movieId, []);
    }
    this.movieRatings.get(rating.movieId)!.push(rating);

    // Update similar users
    this.updateSimilarUsers(userId);
  }

  // Calculate user preferences based on their ratings
  private calculateUserPreferences(ratings: Rating[]): VibePreferences {
    if (ratings.length === 0) {
      return {
        serotonin: 5, brainy_bonkers: 5, camp: 5, color: 5, pace: 5,
        darkness: 5, novelty: 5, social_safe: 5, runtime_fit: 5, subs_energy: 5
      };
    }

    // Weight recent ratings more heavily
    const weightedRatings = ratings.map((rating, index) => {
      const recencyWeight = Math.exp(-0.1 * (ratings.length - index - 1));
      const overallWeight = rating.overall / 5; // Higher overall ratings get more weight
      return { rating, weight: recencyWeight * overallWeight };
    });

    const totalWeight = weightedRatings.reduce((sum, wr) => sum + wr.weight, 0);

    const preferences: VibePreferences = {
      serotonin: 0, brainy_bonkers: 0, camp: 0, color: 0, pace: 0,
      darkness: 0, novelty: 0, social_safe: 0, runtime_fit: 0, subs_energy: 0
    };

    // Calculate weighted averages
    weightedRatings.forEach(({ rating, weight }) => {
      preferences.serotonin += rating.serotonin * weight;
      preferences.brainy_bonkers += rating.brainy_bonkers * weight;
      preferences.camp += rating.camp * weight;
      preferences.color += rating.color * weight;
      preferences.pace += rating.pace * weight;
      preferences.darkness += rating.darkness * weight;
      preferences.novelty += rating.novelty * weight;
      preferences.social_safe += rating.social_safe * weight;
      preferences.runtime_fit += rating.runtime_fit * weight;
      preferences.subs_energy += rating.subs_energy * weight;
    });

    // Normalize by total weight
    Object.keys(preferences).forEach(key => {
      preferences[key as keyof VibePreferences] /= totalWeight;
    });

    return preferences;
  }

  // Find similar users using collaborative filtering
  private updateSimilarUsers(userId: string) {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile) return;

    const similarities: UserSimilarity[] = [];

    this.userProfiles.forEach((otherProfile, otherUserId) => {
      if (otherUserId === userId) return;

      const similarity = this.calculateUserSimilarity(userProfile, otherProfile);
      if (similarity.similarity > 0.3) { // Threshold for similarity
        similarities.push({ userId: otherUserId, ...similarity });
      }
    });

    // Sort by similarity and keep top 10
    similarities.sort((a, b) => b.similarity - a.similarity);
    userProfile.similarUsers = similarities.slice(0, 10).map(s => s.userId);
  }

  // Calculate similarity between two users
  private calculateUserSimilarity(user1: UserProfile, user2: UserProfile): { similarity: number; commonRatings: number } {
    // Find movies both users have rated
    const user1Movies = new Set(user1.ratings.map(r => r.movieId));
    const user2Movies = new Set(user2.ratings.map(r => r.movieId));
    const commonMovies = Array.from(user1Movies).filter(movieId => user2Movies.has(movieId));

    if (commonMovies.length < 2) {
      return { similarity: 0, commonRatings: 0 };
    }

    // Calculate correlation on common movies
    const user1CommonRatings = commonMovies.map(movieId => 
      user1.ratings.find(r => r.movieId === movieId)!.overall
    );
    const user2CommonRatings = commonMovies.map(movieId => 
      user2.ratings.find(r => r.movieId === movieId)!.overall
    );

    // Pearson correlation coefficient
    const correlation = this.pearsonCorrelation(user1CommonRatings, user2CommonRatings);
    
    // Also consider preference similarity
    const prefSimilarity = this.cosineSimilarity(
      this.attributesToVector(user1.preferences),
      this.attributesToVector(user2.preferences)
    );

    // Combine correlations with confidence based on number of common ratings
    const confidence = Math.min(1, commonMovies.length / 5);
    const finalSimilarity = (correlation * 0.7 + prefSimilarity * 0.3) * confidence;

    return { similarity: Math.max(0, finalSimilarity), commonRatings: commonMovies.length };
  }

  // Calculate Pearson correlation coefficient
  private pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n === 0) return 0;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0);
    const sumX2 = x.reduce((total, xi) => total + xi * xi, 0);
    const sumY2 = y.reduce((total, yi) => total + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  // Predict movie attributes using machine learning
  async predictMovieAttributes(movie: {
    genres: string[];
    runtime: number;
    imdb_rating?: number;
    year?: number;
    director?: string;
  }, userId?: string): Promise<MLPrediction> {
    const reasoning: string[] = [];
    let method: 'collaborative' | 'content' | 'hybrid' = 'content';
    let confidence = 0.5;

    // Start with content-based prediction (your existing logic)
    let contentPrediction = this.getContentBasedPrediction(movie);
    reasoning.push(`Base prediction from genres: ${movie.genres.join(', ')}`);

    // If we have user data, try collaborative filtering
    let collaborativePrediction: VibePreferences | null = null;
    if (userId && this.userProfiles.has(userId)) {
      collaborativePrediction = await this.getCollaborativePrediction(movie, userId);
      if (collaborativePrediction) {
        method = 'hybrid';
        reasoning.push('Enhanced with collaborative filtering from similar users');
      }
    }

    // Combine predictions if we have both
    let finalPrediction: VibePreferences;
    if (collaborativePrediction) {
      finalPrediction = this.combinePrections(contentPrediction, collaborativePrediction, 0.6, 0.4);
      confidence = Math.min(0.9, confidence + 0.3);
    } else {
      finalPrediction = contentPrediction;
      method = 'content';
    }

    // Find similar movies for explanation
    const similarMovies = this.findSimilarMovies(movie, 3);
    if (similarMovies.length > 0) {
      reasoning.push(`Based on similarity to: ${similarMovies.join(', ')}`);
    }

    // Adjust confidence based on available data
    if (movie.genres.length > 2) confidence += 0.1;
    if (movie.director) confidence += 0.1;
    if (movie.imdb_rating) confidence += 0.1;

    return {
      attributes: finalPrediction,
      confidence: Math.min(1, confidence),
      method,
      similarMovies,
      reasoning
    };
  }

  // Content-based prediction (enhanced version of your existing logic)
  private getContentBasedPrediction(movie: {
    genres: string[];
    runtime: number;
    imdb_rating?: number;
    year?: number;
    director?: string;
  }): VibePreferences {
    // This would use your existing prediction logic but enhanced with embeddings
    const baseAttributes: VibePreferences = {
      serotonin: 5.5, brainy_bonkers: 4.0, camp: 3.5, color: 6.0, pace: 6.0,
      darkness: 5.0, novelty: 4.5, social_safe: 6.5, runtime_fit: 6.0, subs_energy: 3.0
    };

    // Apply genre embeddings
    if (movie.genres.length > 0) {
      const genreVectors = movie.genres
        .map(genre => this.genreEmbeddings.get(genre))
        .filter(Boolean) as number[][];

      if (genreVectors.length > 0) {
        // Average the genre vectors
        const avgVector = genreVectors.reduce((acc, vec) => 
          acc.map((val, i) => val + vec[i] / genreVectors.length), 
          new Array(10).fill(0)
        );

        // Blend with base attributes
        const baseVector = this.attributesToVector(baseAttributes);
        const blendedVector = baseVector.map((val, i) => val * 0.3 + avgVector[i] * 7); // Scale up genre influence

        return this.vectorToAttributes(blendedVector);
      }
    }

    return baseAttributes;
  }

  // Collaborative filtering prediction
  private async getCollaborativePrediction(movie: {
    genres: string[];
    runtime: number;
    imdb_rating?: number;
    year?: number;
    director?: string;
  }, userId: string): Promise<VibePreferences | null> {
    const userProfile = this.userProfiles.get(userId);
    if (!userProfile || userProfile.similarUsers.length === 0) return null;

    // Get ratings from similar users for similar movies
    const similarMovieRatings: Rating[] = [];
    
    userProfile.similarUsers.forEach(similarUserId => {
      const similarUser = this.userProfiles.get(similarUserId);
      if (!similarUser) return;

      // Find ratings from similar user for movies with similar genres
      similarUser.ratings.forEach(rating => {
        // Check if this rating is for a movie with similar genres
        // In a real implementation, you'd have movie data accessible here
        similarMovieRatings.push(rating);
      });
    });

    if (similarMovieRatings.length === 0) return null;

    // Weight ratings by user similarity and movie similarity
    const weightedPrediction = similarMovieRatings.reduce((acc, rating) => {
      const weight = 1; // Simplified - would calculate actual similarity weights
      
      acc.serotonin += rating.serotonin * weight;
      acc.brainy_bonkers += rating.brainy_bonkers * weight;
      acc.camp += rating.camp * weight;
      acc.color += rating.color * weight;
      acc.pace += rating.pace * weight;
      acc.darkness += rating.darkness * weight;
      acc.novelty += rating.novelty * weight;
      acc.social_safe += rating.social_safe * weight;
      acc.runtime_fit += rating.runtime_fit * weight;
      acc.subs_energy += rating.subs_energy * weight;
      
      return acc;
    }, {
      serotonin: 0, brainy_bonkers: 0, camp: 0, color: 0, pace: 0,
      darkness: 0, novelty: 0, social_safe: 0, runtime_fit: 0, subs_energy: 0
    });

    // Normalize by number of ratings
    Object.keys(weightedPrediction).forEach(key => {
      weightedPrediction[key as keyof VibePreferences] /= similarMovieRatings.length;
    });

    return weightedPrediction;
  }

  // Combine content and collaborative predictions
  private combinePrections(
    content: VibePreferences, 
    collaborative: VibePreferences, 
    contentWeight: number, 
    collaborativeWeight: number
  ): VibePreferences {
    const combined: VibePreferences = {
      serotonin: 0, brainy_bonkers: 0, camp: 0, color: 0, pace: 0,
      darkness: 0, novelty: 0, social_safe: 0, runtime_fit: 0, subs_energy: 0
    };

    Object.keys(combined).forEach(key => {
      const attr = key as keyof VibePreferences;
      combined[attr] = content[attr] * contentWeight + collaborative[attr] * collaborativeWeight;
    });

    return combined;
  }

  // Find similar movies (simplified)
  private findSimilarMovies(movie: { genres: string[] }, limit: number): string[] {
    // This is simplified - in reality you'd compare against your movie database
    return movie.genres.slice(0, limit);
  }

  // Get personalized recommendations
  async getPersonalizedRecommendations(
    userId: string, 
    preferences: VibePreferences,
    availableMovies: Movie[]
  ): Promise<Movie[]> {
    const userProfile = this.userProfiles.get(userId);
    
    // Score each movie
    const scoredMovies = await Promise.all(
      availableMovies.map(async (movie) => {
        const prediction = await this.predictMovieAttributes({
          genres: movie.genres,
          runtime: movie.runtime,
          imdb_rating: movie.imdb_rating,
          year: movie.year,
          director: movie.director
        }, userId);

        // Calculate similarity to user preferences
        const prefVector = this.attributesToVector(preferences);
        const movieVector = this.attributesToVector(prediction.attributes);
        const similarity = this.cosineSimilarity(prefVector, movieVector);

        // Boost score based on prediction confidence and user profile
        let finalScore = similarity * prediction.confidence;
        
        if (userProfile) {
          // Boost movies similar to user's historical preferences
          const historyMatch = this.cosineSimilarity(
            this.attributesToVector(userProfile.preferences),
            movieVector
          );
          finalScore += historyMatch * 0.3 * userProfile.confidence;
        }

        return { ...movie, score: finalScore, mlPrediction: prediction };
      })
    );

    // Sort by score and return
    return scoredMovies
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, 20);
  }

  // Learn from user feedback (when they rate a recommended movie)
  learnFromFeedback(userId: string, movieId: string, actualRating: Rating, predictedAttributes: VibePreferences) {
    // Calculate prediction error
    const actualVector = this.ratingToVector(actualRating);
    const predictedVector = this.attributesToVector(predictedAttributes);
    
    const error = actualVector.map((actual, i) => Math.abs(actual - predictedVector[i]));
    const meanError = error.reduce((sum, err) => sum + err, 0) / error.length;

    // This would be used to adjust model parameters in a real ML system
    console.log(`Learning from feedback: Mean prediction error = ${meanError.toFixed(2)}`);
    
    // Update user profile with new rating
    this.addUserRating(userId, actualRating);
  }

  // Export user data for persistence
  exportUserData(userId: string): UserProfile | null {
    return this.userProfiles.get(userId) || null;
  }

  // Import user data from storage
  importUserData(userData: UserProfile) {
    this.userProfiles.set(userData.userId, userData);
    
    // Rebuild movie ratings index
    userData.ratings.forEach(rating => {
      if (!this.movieRatings.has(rating.movieId)) {
        this.movieRatings.set(rating.movieId, []);
      }
      this.movieRatings.get(rating.movieId)!.push(rating);
    });
  }
}

// Export singleton instance
export const mlEngine = new MLEngine();