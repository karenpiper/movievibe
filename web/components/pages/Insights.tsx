import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { 
  Brain, 
  Heart, 
  Star, 
  TrendingUp, 
  Clock, 
  Film,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { onboardingService, OnboardingResults } from '../../lib/onboardingService';
import { enhancedApi } from '../../lib/enhancedApi';
import { toast } from 'sonner';

type RatedMovie = {
  id: string;
  title: string;
  poster_url: string;
  year: number;
  rating: number;
  dimensions: Record<string, number>;
  date_rated: string;
};

export default function Insights() {
  const [calibrationResults, setCalibrationResults] = useState<OnboardingResults | null>(null);
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setIsLoading(true);
        
        // Load calibration results if they exist
        const results = await onboardingService.getOnboardingResults();
        if (results) {
          setCalibrationResults(results);
        }

        // Load rated movies (this would come from your actual API)
        // For now, using mock data
        const mockRatedMovies: RatedMovie[] = [
          {
            id: '1',
            title: 'Inception',
            poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
            year: 2010,
            rating: 5,
            dimensions: { serotonin: 4, brainy_bonkers: 5, camp: 2, color: 4, pace: 5 },
            date_rated: '2024-01-15'
          },
          {
            id: '2',
            title: 'The Grand Budapest Hotel',
            poster_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=300&h=450&fit=crop',
            year: 2014,
            rating: 4,
            dimensions: { serotonin: 5, brainy_bonkers: 3, camp: 5, color: 5, pace: 3 },
            date_rated: '2024-01-10'
          }
        ];
        setRatedMovies(mockRatedMovies);
      } catch (error) {
        console.error('Failed to load insights:', error);
        toast.error('Failed to load your insights');
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 py-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="text-2xl font-bold">Loading your insights...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
          Your Movie Insights
        </h1>
        <p className="text-xl text-muted-foreground">
          Discover what we've learned about your taste and track your movie journey
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Calibration Results */}
        <div className="lg:col-span-2 space-y-6">
          {calibrationResults ? (
            <>
              {/* Personality Profile */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-purple-600" />
                    <span>Your Movie Personality</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center space-y-3">
                    <div className="text-3xl font-bold text-purple-800">
                      {calibrationResults.taste_profile.personality_type}
                    </div>
                    <Badge className="bg-purple-600 text-white px-4 py-2">
                      {Math.round(calibrationResults.taste_profile.accuracy_confidence * 100)}% Confidence
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-purple-800">Top Preferences</h4>
                      {calibrationResults.taste_profile.top_dimensions.slice(0, 3).map((dim, index) => (
                        <div key={dim.dimension} className="flex items-center justify-between">
                          <span className="text-sm capitalize">{dim.dimension}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="h-2 bg-purple-600 rounded-full" 
                                style={{ width: `${(dim.preference / 5) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium">{dim.preference}/5</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium text-purple-800">You'll Love Movies That Are...</h4>
                      {calibrationResults.taste_profile.movie_preferences.slice(0, 3).map((pref, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Heart className="w-4 h-4 text-purple-600 flex-shrink-0" />
                          <span className="text-purple-700">{pref}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dimension Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-6 h-6 text-blue-600" />
                    <span>Your Taste Dimensions</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {calibrationResults.taste_profile.top_dimensions.map((dim, index) => (
                      <div key={dim.dimension} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{dim.dimension}</span>
                          <span className="text-sm text-muted-foreground">{dim.preference}/5</span>
                        </div>
                        <Progress value={(dim.preference / 5) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            /* No Calibration Yet */
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-blue-800">Complete Your Taste Calibration</h3>
                <p className="text-blue-700">
                  Take our quick movie rating quiz to unlock personalized insights and better recommendations!
                </p>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Calibration
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Stats & Quick Actions */}
        <div className="space-y-6">
          {/* Stats Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span>Your Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{ratedMovies.length}</div>
                  <div className="text-sm text-green-700">Movies Rated</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {ratedMovies.length > 0 
                      ? (ratedMovies.reduce((sum, movie) => sum + movie.rating, 0) / ratedMovies.length).toFixed(1)
                      : '0'
                    }
                  </div>
                  <div className="text-sm text-purple-700">Avg Rating</div>
                </div>
              </div>
              
              {calibrationResults && (
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(calibrationResults.taste_profile.accuracy_confidence * 100)}%
                  </div>
                  <div className="text-sm text-blue-700">Taste Accuracy</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-6 h-6 text-orange-600" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Film className="w-4 h-4 mr-2" />
                Rate a New Movie
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 mr-2" />
                Recalibrate Taste
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Recommendations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rated Movies Grid */}
      {ratedMovies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-6 h-6 text-indigo-600" />
              <span>Recently Rated Movies</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {ratedMovies.map(movie => (
                <div key={movie.id} className="space-y-2">
                  <div className="relative">
                    <ImageWithFallback
                      src={movie.poster_url}
                      alt={movie.title}
                      className="w-full h-32 object-cover rounded-lg"
                      width={200}
                      height={300}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-yellow-500 text-white text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        {movie.rating}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium truncate">{movie.title}</p>
                    <p className="text-xs text-muted-foreground">{movie.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 