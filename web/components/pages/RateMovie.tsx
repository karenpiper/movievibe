import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Star, Loader2, Clock, Users } from 'lucide-react';
import VisualSlider from '../VisualSlider';
import { Movie, Rating, VibePreferences, mockApi, attributeDescriptions } from '../../lib/mockApi';
import { toast } from 'sonner';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export default function RateMovie() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingMovie, setIsLoadingMovie] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [ratings, setRatings] = useState<Record<keyof VibePreferences, number>>(() => {
    const initial = {} as Record<keyof VibePreferences, number>;
    Object.keys(attributeDescriptions).forEach(key => {
      initial[key as keyof VibePreferences] = 5.0;
    });
    return initial;
  });
  
  const [overallRating, setOverallRating] = useState(3);
  const [notes, setNotes] = useState('');

  // Step-by-step flow setup
  const attributeOrder = Object.keys(attributeDescriptions) as Array<keyof VibePreferences>;
  const OVERALL_STEP_INDEX = attributeOrder.length;
  const NOTES_STEP_INDEX = attributeOrder.length + 1;
  const totalSteps = attributeOrder.length + 2;
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (movieId) {
      loadMovie();
    }
  }, [movieId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setCurrentStep(s => Math.min(totalSteps - 1, s + 1));
      if (e.key === 'ArrowLeft') setCurrentStep(s => Math.max(0, s - 1));
      if (e.key === 'Enter' && currentStep < totalSteps - 1) {
        e.preventDefault();
        setCurrentStep(s => Math.min(totalSteps - 1, s + 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [currentStep, totalSteps]);

  const loadMovie = async () => {
    if (!movieId) return;
    
    try {
      const movieData = await mockApi.getMovie(movieId);
      setMovie(movieData);
    } catch (error) {
      toast.error('Failed to load movie');
      navigate('/');
    } finally {
      setIsLoadingMovie(false);
    }
  };

  const handleRatingChange = (attribute: keyof VibePreferences, value: number) => {
    setRatings(prev => ({ ...prev, [attribute]: value }));
  };

  const handleOverallRatingClick = (rating: number) => {
    setOverallRating(rating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieId || !movie) return;

    setIsSubmitting(true);
    try {
      const ratingData: Omit<Rating, 'id'> = {
        movieId,
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
        notes
      };

      await mockApi.addRating(ratingData);
      toast.success('Rating submitted successfully!');
      navigate('/vibes');
    } catch (error) {
      toast.error('Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingMovie) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center space-y-4">
        <h1>Movie Not Found</h1>
        <p className="text-muted-foreground">The movie you're trying to rate doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Go Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1>Rate This Movie</h1>
        <p className="text-muted-foreground">
          Your ratings help train the recommendation algorithm to find better matches
        </p>
      </div>

      {/* Enhanced Movie Info Card */}
      <Card className="overflow-hidden">
        {movie.backdrop_url && (
          <div className="h-48 bg-gradient-to-t from-black/60 to-transparent relative">
            <ImageWithFallback
              src={movie.backdrop_url}
              alt={`${movie.title} backdrop`}
              className="w-full h-full object-cover"
              width={800}
              height={200}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}
        
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <ImageWithFallback
                src={movie.poster_url}
                alt={`${movie.title} poster`}
                className="w-32 h-48 object-cover rounded-md mx-auto md:mx-0"
                width={128}
                height={192}
              />
            </div>
            
            <div className="space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-xl font-semibold">{movie.title} ({movie.year})</h3>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2 text-sm text-muted-foreground">
                  <span>Directed by {movie.director}</span>
                  {movie.writer && <span>Written by {movie.writer}</span>}
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{movie.runtime} minutes</span>
                  </span>
                  {movie.imdb_rating && (
                    <span className="flex items-center space-x-1">
                      <Star className="w-4 h-4" />
                      <span>{movie.imdb_rating}/10 IMDB</span>
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {movie.genres.map((genre) => (
                  <Badge key={genre} variant="secondary" className="text-xs">
                    {genre}
                  </Badge>
                ))}
              </div>

              {movie.cast && movie.cast.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center space-x-1 text-xs font-medium justify-center md:justify-start">
                    <Users className="w-4 h-4" />
                    <span>Cast</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {movie.cast.slice(0, 4).join(', ')}
                    {movie.cast.length > 4 && ` and ${movie.cast.length - 4} more`}
                  </p>
                </div>
              )}
              
              {movie.logline && (
                <p className="text-sm text-muted-foreground italic">
                  "{movie.logline}"
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Breadcrumb / progress */}
        <div className="bg-background rounded-md border px-4 py-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Step {currentStep + 1} / {totalSteps}</span>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <span key={i} className={`h-2 w-2 rounded-full ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Step content: one attribute, then overall, then notes */}
        {currentStep < OVERALL_STEP_INDEX && (
          <Card>
            <CardHeader>
              <CardTitle>Rate: {attributeOrder[currentStep].replace('_', ' ')}</CardTitle>
            </CardHeader>
            <CardContent>
              <VisualSlider
                attribute={attributeOrder[currentStep]}
                value={ratings[attributeOrder[currentStep]]}
                onChange={(v) => handleRatingChange(attributeOrder[currentStep], v)}
                min={0}
                max={10}
                step={0.1}
              />
            </CardContent>
          </Card>
        )}

        {currentStep === OVERALL_STEP_INDEX && (
          <Card>
            <CardHeader>
              <CardTitle>Overall Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setOverallRating(star)} className="text-3xl transition-colors hover:text-yellow-500" aria-label={`Set overall ${star} stars`}>
                    <Star className={`w-8 h-8 ${star <= overallRating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === NOTES_STEP_INDEX && (
          <Card>
            <CardHeader>
              <CardTitle>Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="notes" className="sr-only">Notes</Label>
              <Textarea id="notes" placeholder="Any additional thoughts about this movie..." value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>Previous</Button>
          {currentStep < totalSteps - 1 ? (
            <Button type="button" onClick={() => setCurrentStep(s => Math.min(totalSteps - 1, s + 1))}>Next</Button>
          ) : (
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</>) : ('Submit Rating')}</Button>
          )}
        </div>
      </form>
    </div>
  );
}