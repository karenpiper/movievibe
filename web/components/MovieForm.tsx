import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { X, Search, Plus, Users, Calendar, Clock, Star, Brain, RefreshCw, Zap, TrendingUp } from 'lucide-react';
import VisualSlider from './VisualSlider';
import { Movie, TMDBMovie, Rating, VibePreferences, genreMap, attributeDescriptions } from '../lib/mockApi';
import { enhancedApi, MLPrediction } from '../lib/enhancedApi';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

const GENRE_OPTIONS = [
  'Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary',
  'Drama', 'Family', 'Fantasy', 'History', 'Horror', 'Music', 'Mystery',
  'Romance', 'Science Fiction', 'Thriller', 'War', 'Western'
];

interface MovieFormProps {
  onSubmit: (movie: Omit<Movie, 'id' | 'seen'>, ratings?: Omit<Rating, 'id' | 'movieId'>) => void;
  isLoading?: boolean;
}

export default function MovieForm({ onSubmit, isLoading }: MovieFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    year: new Date().getFullYear(),
    genres: [] as string[],
    director: '',
    writer: '',
    runtime: 120,
    logline: '',
    poster_url: '',
    backdrop_url: '',
    imdb_rating: undefined as number | undefined,
    cast: [] as string[]
  });

  const [includeRatings, setIncludeRatings] = useState(true);
  const [ratings, setRatings] = useState<Record<keyof VibePreferences, number>>(() => {
    const initial = {} as Record<keyof VibePreferences, number>;
    Object.keys(attributeDescriptions).forEach(key => {
      initial[key as keyof VibePreferences] = 5.0;
    });
    return initial;
  });
  
  const [predictions, setPredictions] = useState<{
    basic: VibePreferences;
    ml: MLPrediction;
    recommended: VibePreferences;
  } | null>(null);
  const [isLoadingPredictions, setIsLoadingPredictions] = useState(false);
  const [hasPredictions, setHasPredictions] = useState(false);
  const [overallRating, setOverallRating] = useState(3);
  const [ratingNotes, setRatingNotes] = useState('');

  const [tmdbQuery, setTmdbQuery] = useState('');
  const [tmdbResults, setTmdbResults] = useState<TMDBMovie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTmdbMovie, setSelectedTmdbMovie] = useState<TMDBMovie | null>(null);

  // Auto-predict ratings when movie data changes
  useEffect(() => {
    if (formData.title && formData.genres.length > 0) {
      loadPredictions();
    }
  }, [formData.genres, formData.runtime, formData.imdb_rating, formData.year, formData.director, formData.title]);

  const loadPredictions = async () => {
    setIsLoadingPredictions(true);
    try {
      const predictionResult = await enhancedApi.predictAttributes({
        genres: formData.genres,
        runtime: formData.runtime,
        imdb_rating: formData.imdb_rating,
        year: formData.year,
        director: formData.director
      });
      
      setPredictions(predictionResult);
      if (!hasPredictions) {
        setRatings(predictionResult.recommended);
        setHasPredictions(true);
      }
    } catch (error) {
      console.error('Failed to load predictions:', error);
    } finally {
      setIsLoadingPredictions(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const handleRatingChange = (attribute: keyof VibePreferences, value: number) => {
    setRatings(prev => ({ ...prev, [attribute]: value }));
  };

  const handleOverallRatingClick = (rating: number) => {
    setOverallRating(rating);
  };

  const handleResetToPredictions = () => {
    if (predictions) {
      setRatings(predictions.recommended);
      toast.success('Reset to AI predictions');
    }
  };

  const handleUseBasicPredictions = () => {
    if (predictions) {
      setRatings(predictions.basic);
      toast.success('Using basic genre-based predictions');
    }
  };

  const handleTMDBSearch = async () => {
    if (!tmdbQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await enhancedApi.searchTMDB(tmdbQuery);
      setTmdbResults(results);
    } catch (error) {
      toast.error('Failed to search TMDB');
    } finally {
      setIsSearching(false);
    }
  };

  const handleTMDBSelect = (movie: TMDBMovie) => {
    const releaseYear = new Date(movie.release_date).getFullYear();
    const genres = movie.genre_ids.map(id => genreMap[id]).filter(Boolean);
    
    setFormData({
      title: movie.title,
      year: releaseYear,
      genres: genres,
      director: movie.crew?.find(c => c.job === 'Director')?.name || '',
      writer: movie.crew?.find(c => c.job === 'Writer')?.name || '',
      runtime: movie.runtime || 120,
      logline: movie.overview,
      poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '',
      backdrop_url: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : '',
      imdb_rating: movie.vote_average,
      cast: movie.cast?.slice(0, 6).map(c => c.name) || []
    });

    setSelectedTmdbMovie(movie);
    setTmdbResults([]);
    setTmdbQuery('');
    setHasPredictions(false); // Reset so predictions will be applied
    toast.success('Movie details imported from TMDB!');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Movie title is required');
      return;
    }

    const movieData = {
      ...formData,
      cast: formData.cast.length > 0 ? formData.cast : undefined
    };

    const ratingsData = includeRatings ? {
      serotonin: ratings.serotonin,
      brainy_bonkers: ratings.brainy_bonkers,
      camp: ratings.camp,
      color: ratings.color,
      pace: ratings.pace,
      darkness: ratings.darkness,
      novelty: ratings.novelty,
      social_safe: ratings.social_safe,
      runtime_fit: ratings.runtime_fit,
      subs_energy: ratings.subs_energy,
      overall: overallRating,
      notes: ratingNotes
    } : undefined;

    onSubmit(movieData, ratingsData);
  };

  const getPredictionQuality = () => {
    if (!predictions) return { label: 'No prediction', color: 'text-gray-500', percentage: 0 };
    
    const confidence = predictions.ml.confidence;
    if (confidence >= 0.8) return { label: 'Excellent', color: 'text-green-600', percentage: confidence * 100 };
    if (confidence >= 0.6) return { label: 'Good', color: 'text-blue-600', percentage: confidence * 100 };
    if (confidence >= 0.4) return { label: 'Fair', color: 'text-yellow-600', percentage: confidence * 100 };
    return { label: 'Learning', color: 'text-orange-600', percentage: confidence * 100 };
  };

  const quality = getPredictionQuality();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* TMDB Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Import from TMDB</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Search for a movie to auto-fill details..."
              value={tmdbQuery}
              onChange={(e) => setTmdbQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTMDBSearch())}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleTMDBSearch}
              disabled={isSearching}
            >
              {isSearching ? <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full" /> : <Search className="w-4 h-4" />}
            </Button>
          </div>

          {tmdbResults.length > 0 && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {tmdbResults.map((movie) => (
                <Card
                  key={movie.id}
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => handleTMDBSelect(movie)}
                >
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      <ImageWithFallback
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : ''}
                        alt={`${movie.title} poster`}
                        className="w-16 h-24 object-cover rounded"
                        width={64}
                        height={96}
                      />
                      <div className="flex-1 space-y-2">
                        <div>
                          <h4 className="font-medium">{movie.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(movie.release_date).getFullYear()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Star className="w-3 h-3" />
                              <span>{movie.vote_average.toFixed(1)}</span>
                            </span>
                            {movie.runtime && (
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{movie.runtime}m</span>
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {movie.overview}
                        </p>
                        
                        {movie.cast && movie.cast.length > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{movie.cast.slice(0, 3).map(c => c.name).join(', ')}</span>
                          </div>
                        )}
                        
                        <Button size="sm" className="w-fit">
                          <Plus className="w-3 h-3 mr-1" />
                          Use This Movie
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Movie Details */}
      <Card>
        <CardHeader>
          <CardTitle>Movie Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                min="1900"
                max={new Date().getFullYear() + 5}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="director">Director</Label>
              <Input
                id="director"
                value={formData.director}
                onChange={(e) => handleInputChange('director', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="writer">Writer</Label>
              <Input
                id="writer"
                value={formData.writer}
                onChange={(e) => handleInputChange('writer', e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="runtime">Runtime (minutes)</Label>
              <Input
                id="runtime"
                type="number"
                value={formData.runtime}
                onChange={(e) => handleInputChange('runtime', parseInt(e.target.value))}
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="imdb_rating">IMDB Rating</Label>
              <Input
                id="imdb_rating"
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={formData.imdb_rating || ''}
                onChange={(e) => handleInputChange('imdb_rating', e.target.value ? parseFloat(e.target.value) : undefined)}
                placeholder="e.g. 7.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cast">Main Cast (one per line)</Label>
            <Textarea
              id="cast"
              value={formData.cast.join('\n')}
              onChange={(e) => handleInputChange('cast', e.target.value.split('\n').filter(name => name.trim()))}
              placeholder="Actor Name 1&#10;Actor Name 2&#10;Actor Name 3"
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="poster_url">Poster URL</Label>
            <Input
              id="poster_url"
              type="url"
              value={formData.poster_url}
              onChange={(e) => handleInputChange('poster_url', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div>
            <Label>Genres</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {GENRE_OPTIONS.map((genre) => (
                <Badge
                  key={genre}
                  variant={formData.genres.includes(genre) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                  {formData.genres.includes(genre) && (
                    <X className="w-3 h-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="logline">Plot Summary</Label>
            <Textarea
              id="logline"
              value={formData.logline}
              onChange={(e) => handleInputChange('logline', e.target.value)}
              placeholder="A brief description of the movie's plot..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* ML-Enhanced Attribute Predictions */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary" />
              <span>🤖 AI-Powered Attribute Predictions</span>
              {predictions && (
                <Badge variant="outline" className={quality.color}>
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {quality.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={includeRatings}
                onCheckedChange={setIncludeRatings}
              />
              <span className="text-sm">Include ratings</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoadingPredictions ? (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 animate-spin border-2 border-primary border-t-transparent rounded-full" />
              <span>AI is analyzing this movie...</span>
            </div>
          ) : predictions ? (
            <>
              <Alert className="border-primary/20 bg-primary/5">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span><strong>Prediction Method:</strong> {predictions.ml.method === 'hybrid' ? 'AI + Your History' : predictions.ml.method === 'collaborative' ? 'Similar Users' : 'Genre Analysis'}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={quality.percentage} className="w-24 h-2" />
                        <span className="text-xs">{quality.percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {predictions.ml.reasoning.join(' • ')}
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            </>
          ) : (
            <Alert>
              <AlertDescription>
                Add genres and other movie details to see AI-powered attribute predictions that you can then fine-tune.
              </AlertDescription>
            </Alert>
          )}

          {includeRatings && predictions && (
            <>
              <div className="flex flex-wrap gap-2 justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Adjust the AI predictions based on your personal assessment
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseBasicPredictions}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Use Basic
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleResetToPredictions}
                  >
                    <Brain className="w-4 h-4 mr-2" />
                    Use AI
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid lg:grid-cols-2 gap-6">
                {Object.entries(attributeDescriptions).map(([key, _]) => {
                  const currentValue = ratings[key as keyof VibePreferences];
                  const aiPrediction = predictions.recommended[key as keyof VibePreferences];
                  const basicPrediction = predictions.basic[key as keyof VibePreferences];
                  const difference = Math.abs(currentValue - aiPrediction);
                  
                  return (
                    <div key={key} className="relative">
                      <VisualSlider
                        attribute={key as keyof VibePreferences}
                        value={currentValue}
                        onChange={(value) => handleRatingChange(key as keyof VibePreferences, value)}
                        min={0}
                        max={10}
                        step={0.1}
                      />
                      <div className="mt-2 space-y-1 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Basic: {basicPrediction.toFixed(1)}</span>
                          <span>AI: {aiPrediction.toFixed(1)}</span>
                          <span>Your rating: {currentValue.toFixed(1)}</span>
                        </div>
                        {difference > 1.5 && (
                          <div className="text-orange-600 text-center">
                            ⚡ Your insight helps train our AI!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <Separator />

              <div>
                <Label className="text-base">Overall Rating</Label>
                <div className="flex justify-center space-x-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleOverallRatingClick(star)}
                      className="text-3xl transition-colors hover:text-yellow-500"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= overallRating
                            ? 'fill-yellow-500 text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="rating_notes">Rating Notes (Optional)</Label>
                <Textarea
                  id="rating_notes"
                  placeholder="Any thoughts that might help improve our AI predictions..."
                  value={ratingNotes}
                  onChange={(e) => setRatingNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <div className="w-4 h-4 animate-spin border-2 border-current border-t-transparent rounded-full mr-2" />
            {includeRatings ? 'Adding Movie & Training AI...' : 'Adding Movie...'}
          </>
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            {includeRatings ? 'Add Movie & Train AI' : 'Add Movie'}
          </>
        )}
      </Button>
    </form>
  );
}