// Service to populate movie database with Letterboxd + AI analysis
import { letterboxdApi, LetterboxdMovie, ReviewAnalysis } from './letterboxdApi';
import { Movie, Rating } from './mockApi';
import { convertTo5PointScale } from './dimensionSystem';

export interface PopulatedMovie extends Movie {
  letterboxd_id: string;
  letterboxd_url: string;
  community_rating: number;
  review_count: number;
  ai_confidence: number;
  analysis_summary: string;
}

export interface PopulationProgress {
  total: number;
  completed: number;
  current_movie: string;
  status: 'fetching' | 'analyzing' | 'complete' | 'error';
}

class DataPopulationService {
  private onProgress?: (progress: PopulationProgress) => void;

  // Set progress callback
  setProgressCallback(callback: (progress: PopulationProgress) => void) {
    this.onProgress = callback;
  }

  // Main function to populate database with Letterboxd data
  async populateDatabase(movieLimit: number = 50): Promise<{
    movies: PopulatedMovie[];
    ratings: Rating[];
    summary: {
      total_movies: number;
      avg_confidence: number;
      top_dimensions: string[];
    };
  }> {
    console.log(`🎬 Starting database population with ${movieLimit} movies...`);
    
    try {
      // Step 1: Fetch popular movies from Letterboxd
      this.updateProgress(0, movieLimit, 'Fetching popular movies from Letterboxd...', 'fetching');
      
      const letterboxdMovies = await letterboxdApi.getPopularMovies(movieLimit);
      console.log(`📚 Fetched ${letterboxdMovies.length} movies from Letterboxd`);

      // Step 2: Analyze each movie with AI
      this.updateProgress(0, letterboxdMovies.length, 'Starting AI analysis...', 'analyzing');
      
      const analyses = await this.batchAnalyzeMovies(letterboxdMovies);
      console.log(`🤖 Completed AI analysis for ${analyses.length} movies`);

      // Step 3: Convert to our movie format
      const { movies, ratings } = this.convertToOurFormat(letterboxdMovies, analyses);
      
      // Step 4: Generate summary statistics
      const summary = this.generateSummary(analyses);
      
      this.updateProgress(movieLimit, movieLimit, 'Database population complete!', 'complete');
      
      console.log(`✅ Database populated with ${movies.length} movies and ${ratings.length} ratings`);
      
      return { movies, ratings, summary };
      
    } catch (error) {
      console.error('❌ Error populating database:', error);
      this.updateProgress(0, movieLimit, 'Error occurred during population', 'error');
      throw error;
    }
  }

  // Analyze movies in batches to avoid overwhelming the API
  private async batchAnalyzeMovies(movies: LetterboxdMovie[]): Promise<ReviewAnalysis[]> {
    const batchSize = 5; // Process 5 movies at a time
    const analyses: ReviewAnalysis[] = [];
    
    for (let i = 0; i < movies.length; i += batchSize) {
      const batch = movies.slice(i, i + batchSize);
      const batchIds = batch.map(m => m.id);
      
      this.updateProgress(
        i, 
        movies.length, 
        `Analyzing batch ${Math.floor(i/batchSize) + 1}: ${batch.map(m => m.title).join(', ')}`, 
        'analyzing'
      );
      
      try {
        const batchAnalyses = await letterboxdApi.batchAnalyzeMovies(batchIds);
        analyses.push(...batchAnalyses);
        
        // Small delay between batches to be respectful
        if (i + batchSize < movies.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Error analyzing batch starting at ${i}:`, error);
        // Continue with next batch even if one fails
      }
    }
    
    return analyses;
  }

  // Convert Letterboxd data + AI analysis to our internal format
  private convertToOurFormat(
    letterboxdMovies: LetterboxdMovie[], 
    analyses: ReviewAnalysis[]
  ): { movies: PopulatedMovie[]; ratings: Rating[] } {
    const movies: PopulatedMovie[] = [];
    const ratings: Rating[] = [];
    
    letterboxdMovies.forEach(lbMovie => {
      const analysis = analyses.find(a => a.movie_id === lbMovie.id);
      
      if (!analysis) {
        console.warn(`⚠️ No analysis found for ${lbMovie.title}, skipping...`);
        return;
      }

      // Create movie record
      const movie: PopulatedMovie = {
        id: `movie_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: lbMovie.title,
        year: lbMovie.year,
        genres: lbMovie.genres,
        director: lbMovie.director,
        runtime: lbMovie.runtime,
        logline: `Popular on Letterboxd with ${lbMovie.review_count.toLocaleString()} reviews. Community rating: ${lbMovie.average_rating}/5.0`,
        poster_url: lbMovie.poster_url,
        imdb_rating: this.letterboxdToImdbRating(lbMovie.average_rating),
        seen: false,
        
        // Letterboxd-specific fields
        letterboxd_id: lbMovie.id,
        letterboxd_url: lbMovie.letterboxd_url,
        community_rating: lbMovie.average_rating,
        review_count: lbMovie.review_count,
        ai_confidence: analysis.confidence,
        analysis_summary: analysis.analysis_summary
      };

      // Create AI-generated rating
      const rating: Rating = {
        id: `rating_${movie.id}`,
        movieId: movie.id,
        serotonin: analysis.dimension_scores.serotonin,
        brainy_bonkers: analysis.dimension_scores.brainy_bonkers,
        camp: analysis.dimension_scores.camp,
        color: analysis.dimension_scores.color,
        pace: analysis.dimension_scores.pace,
        darkness: analysis.dimension_scores.darkness,
        novelty: analysis.dimension_scores.novelty,
        social_safe: analysis.dimension_scores.social_safe,
        runtime_fit: analysis.dimension_scores.runtime_fit,
        subs_energy: analysis.dimension_scores.subs_energy,
        overall: Math.round(lbMovie.average_rating), // Convert 4.2 -> 4 stars
        notes: `AI analysis based on ${analysis.review_count} Letterboxd reviews. Confidence: ${Math.round(analysis.confidence * 100)}%`
      };

      movies.push(movie);
      ratings.push(rating);
    });

    return { movies, ratings };
  }

  // Convert Letterboxd 5-star rating to approximate IMDB 10-point rating
  private letterboxdToImdbRating(letterboxdRating: number): number {
    // Letterboxd tends to rate slightly higher than IMDB
    // 5.0 LB ≈ 9.0 IMDB, 4.0 LB ≈ 7.5 IMDB, etc.
    return Math.round((letterboxdRating * 1.8 + 0.5) * 10) / 10;
  }

  // Generate summary statistics
  private generateSummary(analyses: ReviewAnalysis[]): {
    total_movies: number;
    avg_confidence: number;
    top_dimensions: string[];
  } {
    if (analyses.length === 0) {
      return { total_movies: 0, avg_confidence: 0, top_dimensions: [] };
    }

    // Calculate average confidence
    const avgConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length;

    // Find most common high-scoring dimensions
    const dimensionCounts: Record<string, number> = {};
    
    analyses.forEach(analysis => {
      Object.entries(analysis.dimension_scores).forEach(([dimension, score]) => {
        if (score >= 4) { // Count high scores (4-5)
          dimensionCounts[dimension] = (dimensionCounts[dimension] || 0) + 1;
        }
      });
    });

    const topDimensions = Object.entries(dimensionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([dimension]) => dimension.replace('_', ' '));

    return {
      total_movies: analyses.length,
      avg_confidence: Math.round(avgConfidence * 100) / 100,
      top_dimensions: topDimensions
    };
  }

  private updateProgress(completed: number, total: number, currentMovie: string, status: PopulationProgress['status']) {
    if (this.onProgress) {
      this.onProgress({
        total,
        completed,
        current_movie: currentMovie,
        status
      });
    }
  }

  // Quick test function to validate the system
  async testPopulation(): Promise<void> {
    console.log('🧪 Testing data population system...');
    
    try {
      const result = await this.populateDatabase(5); // Test with just 5 movies
      console.log('✅ Test successful:', {
        movies: result.movies.length,
        ratings: result.ratings.length,
        avgConfidence: result.summary.avg_confidence,
        topDimensions: result.summary.top_dimensions
      });
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  }
}

// Export singleton
export const dataPopulationService = new DataPopulationService();

// Helper function to check if database needs population
export const shouldPopulateDatabase = (): boolean => {
  const lastPopulation = localStorage.getItem('lastDatabasePopulation');
  if (!lastPopulation) return true;
  
  const lastDate = new Date(lastPopulation);
  const daysSincePopulation = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
  
  // Re-populate if it's been more than 7 days
  return daysSincePopulation > 7;
};

// Save population timestamp
export const markDatabasePopulated = (): void => {
  localStorage.setItem('lastDatabasePopulation', new Date().toISOString());
};