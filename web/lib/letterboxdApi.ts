// Letterboxd API Integration
// Note: Letterboxd doesn't have a public API, so we'll simulate the functionality
// In production, you'd use web scraping or unofficial APIs, or partner with Letterboxd

export interface LetterboxdMovie {
  id: string;
  title: string;
  year: number;
  director: string;
  genres: string[];
  runtime: number;
  poster_url: string;
  tmdb_id?: number;
  letterboxd_url: string;
  average_rating: number;
  review_count: number;
  watch_count: number;
}

export interface LetterboxdReview {
  id: string;
  movie_id: string;
  username: string;
  rating: number; // 0.5 to 5.0 in 0.5 increments
  review_text: string;
  spoilers: boolean;
  date: string;
  likes: number;
}

export interface ReviewAnalysis {
  movie_id: string;
  dimension_scores: {
    serotonin: number; // 1-5
    brainy_bonkers: number;
    camp: number;
    color: number;
    pace: number;
    darkness: number;
    novelty: number;
    social_safe: number;
    runtime_fit: number;
    subs_energy: number;
  };
  confidence: number; // 0-1
  review_count: number;
  analysis_summary: string;
}

// Mock Letterboxd data - in production this would come from actual API/scraping
const mockLetterboxdMovies: LetterboxdMovie[] = [
  {
    id: 'letterboxd_1',
    title: 'The Grand Budapest Hotel',
    year: 2014,
    director: 'Wes Anderson',
    genres: ['Comedy', 'Drama'],
    runtime: 99,
    poster_url: 'https://images.unsplash.com/photo-1489599317415-3bac6e9677cf?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/the-grand-budapest-hotel/',
    average_rating: 4.1,
    review_count: 125000,
    watch_count: 890000
  },
  {
    id: 'letterboxd_2',
    title: 'Inception',
    year: 2010,
    director: 'Christopher Nolan',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    runtime: 148,
    poster_url: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/inception/',
    average_rating: 4.3,
    review_count: 280000,
    watch_count: 1200000
  },
  {
    id: 'letterboxd_3',
    title: 'Parasite',
    year: 2019,
    director: 'Bong Joon-ho',
    genres: ['Thriller', 'Drama', 'Comedy'],
    runtime: 132,
    poster_url: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/parasite-2019/',
    average_rating: 4.5,
    review_count: 195000,
    watch_count: 850000
  },
  {
    id: 'letterboxd_4',
    title: 'Mad Max: Fury Road',
    year: 2015,
    director: 'George Miller',
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    runtime: 120,
    poster_url: 'https://images.unsplash.com/photo-1518930259200-52d8e47b4651?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/mad-max-fury-road/',
    average_rating: 4.2,
    review_count: 165000,
    watch_count: 920000
  },
  {
    id: 'letterboxd_5',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    director: 'Daniels',
    genres: ['Action', 'Comedy', 'Sci-Fi'],
    runtime: 139,
    poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/everything-everywhere-all-at-once/',
    average_rating: 4.4,
    review_count: 145000,
    watch_count: 720000
  },
  {
    id: 'letterboxd_6',
    title: 'The Lobster',
    year: 2015,
    director: 'Yorgos Lanthimos',
    genres: ['Comedy', 'Drama', 'Romance'],
    runtime: 119,
    poster_url: 'https://images.unsplash.com/photo-1489599317415-3bac6e9677cf?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/the-lobster/',
    average_rating: 3.6,
    review_count: 89000,
    watch_count: 420000
  },
  {
    id: 'letterboxd_7',
    title: 'Moonlight',
    year: 2016,
    director: 'Barry Jenkins',
    genres: ['Drama'],
    runtime: 111,
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/moonlight-2016/',
    average_rating: 4.2,
    review_count: 78000,
    watch_count: 380000
  },
  {
    id: 'letterboxd_8',
    title: 'John Wick',
    year: 2014,
    director: 'Chad Stahelski',
    genres: ['Action', 'Thriller'],
    runtime: 101,
    poster_url: 'https://images.unsplash.com/photo-1518930259200-52d8e47b4651?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/john-wick/',
    average_rating: 3.9,
    review_count: 142000,
    watch_count: 750000
  },
  {
    id: 'letterboxd_9',
    title: 'Spider-Man: Into the Spider-Verse',
    year: 2018,
    director: 'Bob Persichetti',
    genres: ['Animation', 'Action', 'Adventure'],
    runtime: 117,
    poster_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/spider-man-into-the-spider-verse/',
    average_rating: 4.3,
    review_count: 156000,
    watch_count: 890000
  },
  {
    id: 'letterboxd_10',
    title: 'The Shape of Water',
    year: 2017,
    director: 'Guillermo del Toro',
    genres: ['Drama', 'Fantasy', 'Romance'],
    runtime: 123,
    poster_url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=300&h=450&fit=crop',
    letterboxd_url: 'https://letterboxd.com/film/the-shape-of-water/',
    average_rating: 3.8,
    review_count: 98000,
    watch_count: 520000
  }
];

// Mock reviews with realistic review text
const mockReviews: LetterboxdReview[] = [
  {
    id: 'review_1',
    movie_id: 'letterboxd_1',
    username: 'cinephile_sarah',
    rating: 4.5,
    review_text: 'Visually stunning and whimsical. Wes Anderson\'s meticulous attention to detail creates a candy-colored world that\'s both nostalgic and timeless. The symmetrical compositions and pastel palette make every frame a work of art. Ralph Fiennes delivers perfect comedic timing.',
    spoilers: false,
    date: '2024-01-15',
    likes: 234
  },
  {
    id: 'review_2', 
    movie_id: 'letterboxd_2',
    username: 'movie_buff_mike',
    rating: 5.0,
    review_text: 'Mind-bending masterpiece that demands multiple viewings. Nolan constructs a labyrinthine narrative that challenges viewers intellectually while delivering spectacular action sequences. The practical effects and Hans Zimmer\'s score create an immersive experience. Complex but rewarding.',
    spoilers: false,
    date: '2024-01-10',
    likes: 567
  },
  {
    id: 'review_3',
    movie_id: 'letterboxd_3', 
    username: 'arthouse_anna',
    rating: 5.0,
    review_text: 'A darkly brilliant social thriller that cuts deep. Bong Joon-ho masterfully weaves class commentary into a suspenseful narrative. The film shifts tones seamlessly from comedy to horror, keeping you on edge. Subtitles are worth it for this incredible Korean cinema.',
    spoilers: false,
    date: '2024-01-08',
    likes: 892
  },
  {
    id: 'review_4',
    movie_id: 'letterboxd_4',
    username: 'action_alex',
    rating: 4.0,
    review_text: 'Pure adrenaline from start to finish. George Miller delivers non-stop action with practical stunts that put CGI to shame. The chase sequences are choreographed like ballet - violent, beautiful ballet. Charlize Theron is a badass. Minimal dialogue, maximum impact.',
    spoilers: false,
    date: '2024-01-12',
    likes: 445
  },
  {
    id: 'review_5',
    movie_id: 'letterboxd_5',
    username: 'genre_bender_jen',
    rating: 4.5,
    review_text: 'Absolutely bonkers in the best way possible. This multiverse madness somehow manages to be emotionally resonant while being completely unhinged. Michelle Yeoh anchors the chaos with a heartfelt performance. Inventive, weird, and surprisingly moving.',
    spoilers: false,
    date: '2024-01-20',
    likes: 678
  }
];

// AI Analysis Service (simulated)
class ReviewAnalysisService {
  // Simulate AI analysis of reviews to determine dimension scores
  async analyzeMovieReviews(movieId: string): Promise<ReviewAnalysis> {
    // In production, this would use OpenAI/Claude to analyze review text
    // and extract dimension scores based on review sentiment and keywords
    
    const movieReviews = mockReviews.filter(r => r.movie_id === movieId);
    const movie = mockLetterboxdMovies.find(m => m.id === movieId);
    
    if (!movie) {
      throw new Error('Movie not found');
    }

    // Simulate AI analysis based on movie characteristics and review keywords
    let scores = this.getBaseScoresFromGenre(movie.genres);
    
    // Adjust based on director style
    scores = this.adjustForDirector(scores, movie.director);
    
    // Simulate review text analysis adjustments
    if (movieReviews.length > 0) {
      scores = this.adjustFromReviewSentiment(scores, movieReviews);
    }

    return {
      movie_id: movieId,
      dimension_scores: scores,
      confidence: Math.min(1, movieReviews.length / 50), // More reviews = higher confidence
      review_count: movieReviews.length,
      analysis_summary: this.generateAnalysisSummary(movie, scores)
    };
  }

  private getBaseScoresFromGenre(genres: string[]): ReviewAnalysis['dimension_scores'] {
    // Base scores for different genres (1-5 scale)
    const genreScores = {
      'Comedy': { serotonin: 4, camp: 4, social_safe: 4, darkness: 2 },
      'Drama': { serotonin: 2, brainy_bonkers: 4, darkness: 4, novelty: 3 },
      'Action': { pace: 5, serotonin: 3, color: 4, darkness: 3 },
      'Thriller': { pace: 4, darkness: 4, brainy_bonkers: 4, serotonin: 2 },
      'Sci-Fi': { brainy_bonkers: 5, novelty: 5, color: 4, subs_energy: 3 },
      'Horror': { darkness: 5, serotonin: 1, social_safe: 2, pace: 4 },
      'Romance': { serotonin: 4, social_safe: 4, camp: 2, darkness: 2 },
      'Animation': { color: 5, serotonin: 4, camp: 3, social_safe: 5 },
      'Fantasy': { color: 4, novelty: 4, camp: 3, brainy_bonkers: 3 },
      'Adventure': { pace: 4, color: 4, serotonin: 4, social_safe: 4 }
    };

    // Start with neutral scores
    let scores: ReviewAnalysis['dimension_scores'] = {
      serotonin: 3,
      brainy_bonkers: 3,
      camp: 3,
      color: 3,
      pace: 3,
      darkness: 3,
      novelty: 3,
      social_safe: 3,
      runtime_fit: 3,
      subs_energy: 3
    };

    // Apply genre influences
    genres.forEach(genre => {
      const genreScore = genreScores[genre as keyof typeof genreScores];
      if (genreScore) {
        Object.keys(genreScore).forEach(key => {
          const attr = key as keyof typeof genreScore;
          // Blend genre influence with existing score
          scores[attr] = Math.round((scores[attr] + genreScore[attr]) / 2);
        });
      }
    });

    return scores;
  }

  private adjustForDirector(scores: ReviewAnalysis['dimension_scores'], director: string): ReviewAnalysis['dimension_scores'] {
    const directorStyles = {
      'Wes Anderson': { color: 5, camp: 4, novelty: 4, social_safe: 4 },
      'Christopher Nolan': { brainy_bonkers: 5, novelty: 5, darkness: 4, runtime_fit: 4 },
      'Bong Joon-ho': { brainy_bonkers: 5, darkness: 4, novelty: 5, subs_energy: 4 },
      'George Miller': { pace: 5, color: 4, serotonin: 4, runtime_fit: 5 },
      'Daniels': { novelty: 5, camp: 5, color: 5, brainy_bonkers: 4 },
      'Yorgos Lanthimos': { camp: 5, novelty: 5, darkness: 4, brainy_bonkers: 4 },
      'Barry Jenkins': { color: 4, serotonin: 2, darkness: 4, social_safe: 3 },
      'Chad Stahelski': { pace: 5, runtime_fit: 4, social_safe: 4, serotonin: 3 },
      'Guillermo del Toro': { color: 5, novelty: 4, camp: 3, serotonin: 3 }
    };

    const style = directorStyles[director as keyof typeof directorStyles];
    if (style) {
      Object.keys(style).forEach(key => {
        const attr = key as keyof typeof style;
        // Strong director influence
        scores[attr] = Math.round((scores[attr] * 0.3) + (style[attr] * 0.7));
      });
    }

    // Ensure scores stay within 1-5 range
    Object.keys(scores).forEach(key => {
      const attr = key as keyof ReviewAnalysis['dimension_scores'];
      scores[attr] = Math.max(1, Math.min(5, scores[attr]));
    });

    return scores;
  }

  private adjustFromReviewSentiment(
    scores: ReviewAnalysis['dimension_scores'], 
    reviews: LetterboxdReview[]
  ): ReviewAnalysis['dimension_scores'] {
    // Simulate sentiment analysis of review text
    // In production, this would use NLP to extract dimension-relevant keywords
    
    reviews.forEach(review => {
      const text = review.review_text.toLowerCase();
      
      // Serotonin keywords
      if (text.includes('joy') || text.includes('fun') || text.includes('delightful') || text.includes('uplifting')) {
        scores.serotonin = Math.min(5, scores.serotonin + 0.3);
      }
      if (text.includes('depressing') || text.includes('bleak') || text.includes('sad')) {
        scores.serotonin = Math.max(1, scores.serotonin - 0.3);
      }

      // Visual/Color keywords
      if (text.includes('visually stunning') || text.includes('beautiful') || text.includes('gorgeous') || text.includes('colorful')) {
        scores.color = Math.min(5, scores.color + 0.4);
      }

      // Pace keywords
      if (text.includes('fast-paced') || text.includes('action-packed') || text.includes('adrenaline') || text.includes('non-stop')) {
        scores.pace = Math.min(5, scores.pace + 0.4);
      }
      if (text.includes('slow') || text.includes('boring') || text.includes('dragging')) {
        scores.pace = Math.max(1, scores.pace - 0.3);
      }

      // Intellectual complexity
      if (text.includes('complex') || text.includes('intelligent') || text.includes('mind-bending') || text.includes('thought-provoking')) {
        scores.brainy_bonkers = Math.min(5, scores.brainy_bonkers + 0.4);
      }

      // Camp/Absurdity
      if (text.includes('absurd') || text.includes('bizarre') || text.includes('weird') || text.includes('bonkers')) {
        scores.camp = Math.min(5, scores.camp + 0.4);
      }

      // Darkness
      if (text.includes('dark') || text.includes('disturbing') || text.includes('intense') || text.includes('heavy')) {
        scores.darkness = Math.min(5, scores.darkness + 0.3);
      }

      // Novelty
      if (text.includes('original') || text.includes('innovative') || text.includes('unique') || text.includes('fresh')) {
        scores.novelty = Math.min(5, scores.novelty + 0.4);
      }

      // Subtitles energy
      if (text.includes('subtitles') || text.includes('foreign') || text.includes('korean') || text.includes('japanese')) {
        scores.subs_energy = Math.min(5, scores.subs_energy + 0.5);
      }
    });

    // Round to nearest 0.5 and ensure 1-5 range
    Object.keys(scores).forEach(key => {
      const attr = key as keyof ReviewAnalysis['dimension_scores'];
      scores[attr] = Math.max(1, Math.min(5, Math.round(scores[attr] * 2) / 2));
    });

    return scores;
  }

  private generateAnalysisSummary(movie: LetterboxdMovie, scores: ReviewAnalysis['dimension_scores']): string {
    const highScores = Object.entries(scores)
      .filter(([_, score]) => score >= 4)
      .map(([attr, _]) => attr.replace('_', ' '));
    
    const lowScores = Object.entries(scores)
      .filter(([_, score]) => score <= 2)
      .map(([attr, _]) => attr.replace('_', ' '));

    let summary = `Based on ${movie.review_count.toLocaleString()} Letterboxd reviews, "${movie.title}" scores highly in ${highScores.slice(0, 3).join(', ')}`;
    
    if (lowScores.length > 0) {
      summary += ` while being lower in ${lowScores.slice(0, 2).join(' and ')}`;
    }
    
    summary += `. Average community rating: ${movie.average_rating}/5.0.`;
    
    return summary;
  }
}

// Main Letterboxd API class
export class LetterboxdAPI {
  private analysisService = new ReviewAnalysisService();

  // Get popular movies from Letterboxd
  async getPopularMovies(limit: number = 50): Promise<LetterboxdMovie[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would fetch from Letterboxd's popular movies endpoint
    return mockLetterboxdMovies.slice(0, limit);
  }

  // Get reviews for a specific movie
  async getMovieReviews(movieId: string, limit: number = 100): Promise<LetterboxdReview[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockReviews.filter(r => r.movie_id === movieId).slice(0, limit);
  }

  // Get AI analysis of a movie based on its reviews
  async getMovieAnalysis(movieId: string): Promise<ReviewAnalysis> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return this.analysisService.analyzeMovieReviews(movieId);
  }

  // Batch analyze multiple movies
  async batchAnalyzeMovies(movieIds: string[]): Promise<ReviewAnalysis[]> {
    console.log(`🤖 Analyzing ${movieIds.length} movies with AI...`);
    
    const analyses: ReviewAnalysis[] = [];
    
    for (const movieId of movieIds) {
      try {
        const analysis = await this.getMovieAnalysis(movieId);
        analyses.push(analysis);
        console.log(`✅ Analyzed: ${mockLetterboxdMovies.find(m => m.id === movieId)?.title}`);
      } catch (error) {
        console.error(`❌ Failed to analyze movie ${movieId}:`, error);
      }
    }
    
    return analyses;
  }

  // Search movies by title
  async searchMovies(query: string): Promise<LetterboxdMovie[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return mockLetterboxdMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.director.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Export singleton
export const letterboxdApi = new LetterboxdAPI();