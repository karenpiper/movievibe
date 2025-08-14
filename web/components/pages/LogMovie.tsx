import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Brain, TrendingUp, Target, Users } from 'lucide-react';
import MovieForm from '../MovieForm';
import { Movie, Rating } from '../../lib/mockApi';
import { enhancedApi } from '../../lib/enhancedApi';
import { toast } from 'sonner@2.0.3';

export default function LogMovie() {
  const [isLoading, setIsLoading] = useState(false);
  const [mlFeedback, setMlFeedback] = useState<{
    message: string;
    improvementTips: string[];
    learningUpdate: string;
  } | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (
    movieData: Omit<Movie, 'id' | 'seen'>, 
    ratingsData?: Omit<Rating, 'id' | 'movieId'>
  ) => {
    setIsLoading(true);
    try {
      const result = await enhancedApi.addMovie(movieData, ratingsData);
      
      if (ratingsData) {
        // Show ML feedback and learning insights
        setMlFeedback({
          message: result.mlFeedback || 'Movie and rating added successfully!',
          improvementTips: result.rating ? ['Your rating helps improve AI predictions', 'Try rating movies from different genres'] : [],
          learningUpdate: result.rating ? 'AI is learning from your unique taste!' : ''
        });

        toast.success('Movie and rating added successfully!');
        
        // Show feedback for a moment, then navigate
        setTimeout(() => {
          navigate('/vibes');
        }, 3000);
      } else {
        toast.success('Movie added successfully!');
        navigate(`/rate/${result.movie.id}`);
      }
    } catch (error) {
      toast.error('Failed to add movie');
    } finally {
      setIsLoading(false);
    }
  };

  // Get user insights for the header
  const userInsights = enhancedApi.getUserInsights();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1>Log a New Movie</h1>
        <p className="text-muted-foreground">
          Add a movie with AI-powered attribute predictions and help train your personal recommendation engine
        </p>
        
        {/* User Progress Insights */}
        {userInsights && (
          <Card className="bg-gradient-to-r from-primary/5 to-accent/20">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-2xl font-semibold">{userInsights.ratingsCount}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Movies Rated</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <Badge variant="outline" className="text-xs">
                      {userInsights.recommendationAccuracy}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">AI Accuracy</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <Users className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">{userInsights.personalityProfile}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Profile</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium">
                      {userInsights.topAttributes[0]?.attribute.replace('_', ' ') || 'Balanced'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Top Preference</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ML Feedback Display */}
      {mlFeedback && (
        <Alert className="border-green-200 bg-green-50">
          <Brain className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium text-green-800">{mlFeedback.learningUpdate}</p>
              <p className="text-green-700">{mlFeedback.message}</p>
              
              {mlFeedback.improvementTips.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-green-800">Pro Tips:</p>
                  <ul className="text-sm text-green-700 space-y-1">
                    {mlFeedback.improvementTips.map((tip, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-xs text-green-600">
                🚀 Taking you to recommendations in a moment...
              </p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <MovieForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}