import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Heart,
  Star,
  Brain,
  Zap,
  Target,
  PartyPopper,
  PlayCircle,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { 
  onboardingService, 
  OnboardingMovie, 
  OnboardingRating, 
  OnboardingResults 
} from '../../lib/onboardingService';
import { VibePreferences, dimensionScales } from '../../lib/enhancedMockApi';
import { toast } from 'sonner';
import ExampleCovers from '../ExampleCovers';

type OnboardingStep = 'welcome' | 'rating' | 'results';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [movies, setMovies] = useState<OnboardingMovie[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
  const [ratings, setRatings] = useState<OnboardingRating[]>([]);
  const [results, setResults] = useState<OnboardingResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<Date>(new Date());

  // Current rating state - simplified to one dimension at a time
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0);
  const [currentRating, setCurrentRating] = useState<VibePreferences>({
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
  });
  const [overallRating, setOverallRating] = useState(3);

  const dimensionKeys = Object.keys(dimensionScales) as (keyof VibePreferences)[];
  const currentDimension = dimensionKeys[currentDimensionIndex];
  const currentDimensionScale = dimensionScales[currentDimension];

  // Get the current dimension's low and high end examples
  const lowEndExample = currentDimensionScale?.levels?.[0]?.examples?.[0] || 'Low end';
  const highEndExample = currentDimensionScale?.levels?.[4]?.examples?.[0] || 'High end';
  const allExamples = currentDimensionScale?.levels?.flatMap(level => level.examples) || [];

  // Helper functions to get movie data based on rating
  const getMoviePosterForRating = (rating: number): string => {
    const level = currentDimensionScale?.levels?.find(l => l.value === rating);
    if (level?.examples?.[0]) {
      // For now, using a placeholder. In production, you'd fetch from TMDB
      return `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=300&fit=crop&q=80`;
    }
    return `https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&h=300&fit=crop&q=80`;
  };

  const getMovieTitleForRating = (rating: number): string => {
    const level = currentDimensionScale?.levels?.find(l => l.value === rating);
    return level?.examples?.[0] || 'Example Movie';
  };

  const getMovieDescriptionForRating = (rating: number): string => {
    const level = currentDimensionScale?.levels?.find(l => l.value === rating);
    return level?.description || 'Movie description';
  };

  // Safety check - if no dimension scales loaded yet, show loading
  if (!currentDimensionScale || dimensionKeys.length === 0) {
    return (
      <div className="max-w-4xl mx-auto text-center space-y-8 py-16">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <h2 className="text-2xl font-bold">Loading dimension scales...</h2>
        <p className="text-muted-foreground">Setting up your taste calibration</p>
      </div>
    );
  }

  // Initialize movies when component mounts
  useEffect(() => {
    const initializeOnboarding = async () => {
      try {
        setIsLoading(true);
        const onboardingMovies = await onboardingService.getOnboardingMovies();
        setMovies(onboardingMovies);
        console.log('🎬 Loaded onboarding movies:', onboardingMovies);
      } catch (error) {
        console.error('❌ Failed to load onboarding movies:', error);
        toast.error('Failed to load movies for onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    initializeOnboarding();
  }, []);

  const handleStartOnboarding = () => {
    if (movies.length === 0) {
      toast.error('Movies still loading, please wait...');
      return;
    }
    setStep('rating');
    setStartTime(new Date());
  };

  const handleDimensionChange = (value: number) => {
    setCurrentRating(prev => ({ ...prev, [currentDimension]: value }));
  };

  const handleNextDimension = () => {
    if (currentDimensionIndex < dimensionKeys.length - 1) {
      setCurrentDimensionIndex(prev => prev + 1);
    } else {
      // Finished all dimensions, move to next movie or finish
      handleSaveRating();
    }
  };

  const handleSaveRating = async () => {
    if (currentMovieIndex >= movies.length) return;

    const currentMovie = movies[currentMovieIndex];
    const completionTime = (new Date().getTime() - startTime.getTime()) / 1000;

    const rating: OnboardingRating = {
      movie_id: currentMovie.id,
      movie_title: currentMovie.title,
      dimensions: { ...currentRating },
      overall_rating: overallRating,
      completion_time_seconds: completionTime
    };

    const newRatings = [...ratings, rating];
    setRatings(newRatings);

    // Reset for next movie
    setCurrentRating({
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
    });
    setOverallRating(3);
    setCurrentDimensionIndex(0);
    setStartTime(new Date());

    // Move to next movie or finish
    if (currentMovieIndex < movies.length - 1) {
      setCurrentMovieIndex(prev => prev + 1);
      toast.success(`Rated ${currentMovie.title}! ${movies.length - currentMovieIndex - 1} movies to go`);
    } else {
      // Finished rating all movies
      setIsLoading(true);
      try {
        const analysisResults = await onboardingService.analyzeOnboardingResults(newRatings);
        setResults(analysisResults);
        setStep('results');
        toast.success('🎉 Onboarding complete! Your taste profile is ready!');
      } catch (error) {
        console.error('❌ Failed to analyze onboarding results:', error);
        toast.error('Failed to analyze your ratings');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSkipMovie = () => {
    if (currentMovieIndex < movies.length - 1) {
      setCurrentMovieIndex(prev => prev + 1);
      setCurrentRating({
        serotonin: 3, brainy_bonkers: 3, camp: 3, color: 3, pace: 3,
        darkness: 3, novelty: 3, social_safe: 3, runtime_fit: 3, subs_energy: 3
      });
      setOverallRating(3);
      setCurrentDimensionIndex(0);
      setStartTime(new Date());
      toast.success('Skipped movie - no problem!');
    } else {
      handleSaveRating(); // Treat skip on last movie as completion
    }
  };

  const handleFinishOnboarding = () => {
    navigate('/vibes');
  };

  const currentMovie = movies[currentMovieIndex];
  const progress = movies.length > 0 ? ((currentMovieIndex + 1) / movies.length) * 100 : 0;
  const dimensionProgress = ((currentDimensionIndex + 1) / dimensionKeys.length) * 100;

  // Welcome Step
  if (step === 'welcome') {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <h1 className="relative text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Let's Learn Your Movie Taste!
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            🎬 We'll show you 10 movies and ask you to rate them using our fun dimension system. This helps our AI understand your unique taste and give you amazing recommendations right from the start!
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2">
              <Target className="w-4 h-4 mr-2" />
              10 Movies
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              5 Minutes
            </Badge>
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              AI Calibration
            </Badge>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="pt-8 pb-8">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-purple-800">Rate Movies</h3>
                <p className="text-sm text-purple-700">Use our 10 fun dimensions to rate each movie based on how YOU experience it</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-blue-800">AI Learns</h3>
                <p className="text-sm text-blue-700">Our AI analyzes your ratings to understand your unique movie personality</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-green-800">Perfect Matches</h3>
                <p className="text-sm text-green-700">Get personalized recommendations that match your exact taste</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="border-amber-200 bg-amber-50">
          <Sparkles className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>Pro tip:</strong> Don't overthink it! Rate based on your gut feeling. Even if you haven't seen a movie, rate it based on how appealing it looks to you right now.
          </AlertDescription>
        </Alert>

        <div className="text-center space-y-6">
          <Button 
            size="lg"
            onClick={handleStartOnboarding}
            disabled={isLoading || movies.length === 0}
            className="px-12 py-8 text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white border-none rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            {isLoading ? (
              <>
                <div className="w-8 h-8 mr-4 border-4 border-white border-t-transparent rounded-full animate-spin" />
                Loading Movies...
              </>
            ) : (
              <>
                <PlayCircle className="w-8 h-8 mr-4" />
                Start Taste Calibration!
                <ArrowRight className="w-8 h-8 ml-4" />
              </>
            )}
          </Button>
          
          <p className="text-sm text-muted-foreground">
            ✨ This is optional, but it makes your recommendations 10x better!
          </p>
          
          <Button 
            variant="ghost" 
            onClick={() => navigate('/vibes')}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now and explore →
          </Button>
        </div>
      </div>
    );
  }

  // Rating Step - Simplified one dimension at a time
  if (step === 'rating' && currentMovie) {
    // Safety check - ensure we have all required data
    if (!currentDimensionScale || !currentDimension) {
      return (
        <div className="max-w-4xl mx-auto text-center space-y-8 py-16">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">Loading dimension data...</h2>
          <p className="text-muted-foreground">Preparing your taste calibration</p>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Compact Progress Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              🎬 Movie {currentMovieIndex + 1} of {movies.length}
            </h1>
            <Badge variant="outline" className="text-purple-700 border-purple-300">
              {currentDimensionIndex + 1} of {dimensionKeys.length} dimensions
            </Badge>
          </div>
          
          {/* Combined Progress Bars */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Movie Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Dimension Progress</span>
              <span>{Math.round(dimensionProgress)}%</span>
            </div>
            <Progress value={dimensionProgress} className="h-1.5" />
          </div>
        </div>

        {/* Compact Movie Card */}
        <Card className="bg-gradient-to-br from-background to-accent/20">
          <CardContent className="pt-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Movie Poster */}
              <div className="space-y-2">
                <div className="relative">
                  <ImageWithFallback
                    src={currentMovie.poster_url}
                    alt={`${currentMovie.title} poster`}
                    className="w-full h-48 object-cover rounded-lg shadow-lg"
                    width={200}
                    height={300}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/70 text-white text-xs">
                      {currentMovie.year}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {currentMovie.genres.slice(0, 3).map(genre => (
                    <Badge key={genre} variant="secondary" className="text-xs">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Movie Info - More compact */}
              <div className="md:col-span-2 space-y-3">
                <div>
                  <h2 className="text-xl font-bold mb-1">{currentMovie.title}</h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Director:</strong> {currentMovie.director} • <strong>Runtime:</strong> {currentMovie.runtime}min
                  </p>
                  <p className="text-sm leading-relaxed">{currentMovie.logline}</p>
                </div>

                <Alert className="border-blue-200 bg-blue-50 py-2">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 text-sm">
                    <strong>Why this movie:</strong> {currentMovie.why_selected}
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Dimension Rating */}
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-bold mb-1">
                  🎯 Rate: {currentDimensionScale.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {currentDimensionScale.description}
                </p>
              </div>

              {/* Spectrum Slider */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-blue-600">{lowEndExample}</span>
                  <span className="text-purple-600">Your Rating</span>
                  <span className="text-red-600">{highEndExample}</span>
                </div>
                
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={currentRating[currentDimension]}
                    onChange={(e) => handleDimensionChange(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #8b5cf6 50%, #ef4444 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <span>5</span>
                  </div>
                </div>

                {/* Dynamic Movie Examples - 75% width, poster on left, title on right */}
                <div className="w-3/4 mx-auto">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    {/* Movie Poster - changes based on slider */}
                    <div className="flex-shrink-0">
                      <img
                        src={getMoviePosterForRating(currentRating[currentDimension])}
                        alt="Example movie"
                        className="w-16 h-24 object-cover rounded-md shadow-md"
                      />
                    </div>
                    
                    {/* Movie Title and Description */}
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">
                        {getMovieTitleForRating(currentRating[currentDimension])}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getMovieDescriptionForRating(currentRating[currentDimension])}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-2">
          <Button
            variant="outline"
            onClick={handleSkipMovie}
            size="sm"
            className="rounded-full"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Skip This Movie
          </Button>

          <div className="flex space-x-3">
            <Button
              size="default"
              onClick={handleNextDimension}
              disabled={isLoading}
              className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : currentDimensionIndex === dimensionKeys.length - 1 ? (
                <>
                  <PartyPopper className="w-4 h-4 mr-2" />
                  Next Movie
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mr-2" />
                  Next Dimension
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Results Step
  if (step === 'results' && results) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
            Your Movie Personality Revealed!
          </h1>
          <p className="text-xl text-muted-foreground">
            Based on your ratings, here's what we learned about your taste
          </p>
        </div>

        {/* Personality Profile */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="space-y-4">
              <div className="text-4xl">{results.taste_profile.personality_type}</div>
              <h2 className="text-2xl font-bold text-purple-800">
                You're a {results.taste_profile.personality_type}!
              </h2>
              <div className="flex justify-center">
                <Badge className="bg-purple-600 text-white px-4 py-2">
                  {Math.round(results.taste_profile.accuracy_confidence * 100)}% Confidence
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Dimensions */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-center">
              🎯 Your Top Movie Preferences
            </h3>
            <div className="space-y-3">
              {results.taste_profile.top_dimensions.map((dim, index) => (
                <div key={dim.dimension} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-accent/50 to-background">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">#{index + 1}</Badge>
                    <span className="font-medium capitalize">{dim.dimension}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div 
                        className="h-2 bg-purple-600 rounded-full" 
                        style={{ width: `${(dim.preference / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{dim.preference}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Movie Preferences */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-center">
              💝 You'll Love Movies That Are...
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {results.taste_profile.movie_preferences.map((pref, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <Heart className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-green-800">{pref}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Recommendations Preview */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4 text-center">
              🎬 Your First Personalized Recommendations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {results.next_recommendations.slice(0, 4).map(movie => (
                <div key={movie.id} className="text-center space-y-2">
                  <ImageWithFallback
                    src={movie.poster_url}
                    alt={movie.title}
                    className="w-full h-32 object-cover rounded-lg"
                    width={200}
                    height={300}
                  />
                  <p className="text-sm font-medium">{movie.title}</p>
                  {movie.score && (
                    <Badge variant="secondary" className="text-xs">
                      {movie.score.toFixed(1)} match
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Finish Button */}
        <div className="text-center space-y-4">
          <Button 
            size="lg"
            onClick={handleFinishOnboarding}
            className="px-12 py-8 text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white border-none rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
          >
            <Sparkles className="w-8 h-8 mr-4" />
            Start Finding Perfect Movies!
            <ArrowRight className="w-8 h-8 ml-4" />
          </Button>
          
          <p className="text-sm text-muted-foreground">
            🚀 Your recommendations will be personalized based on your unique taste profile
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 py-16">
      <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <h2 className="text-2xl font-bold">Setting up your movie taste calibration...</h2>
      <p className="text-muted-foreground">This will just take a moment!</p>
    </div>
  );
}