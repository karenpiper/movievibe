import { useState, useEffect } from 'react';
import { Loader2, RotateCcw, Sparkles, Zap, Heart, Brain, Palette, Rocket, Stars, PartyPopper } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import VisualSlider from '../VisualSlider';
import PosterCard from '../PosterCard';
import { VibePreferences, dimensionScales, enhancedMockApi } from '../../lib/enhancedMockApi';
import { enhancedApi, EnhancedMovie } from '../../lib/enhancedApi';
import { toast } from 'sonner';

export default function PickVibe() {
  const [preferences, setPreferences] = useState<VibePreferences>({
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
  
  const [recommendations, setRecommendations] = useState<EnhancedMovie[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [step, setStep] = useState<'setup' | 'results'>('setup');
  
  // Database initialization state
  const [initializationStatus, setInitializationStatus] = useState<{
    isInitializing: boolean;
    progress: { completed: number; total: number; status: string };
    isComplete: boolean;
  }>({
    isInitializing: true,
    progress: { completed: 0, total: 0, status: 'Preparing your movie magic...' },
    isComplete: false
  });

  // Check initialization status on mount
  useEffect(() => {
    const checkInitialization = async () => {
      try {
        await enhancedMockApi.initialize();
        setInitializationStatus(prev => ({ ...prev, isComplete: true, isInitializing: false }));
        console.log('✅ Database initialization complete');
      } catch (error) {
        console.error('❌ Database initialization failed:', error);
        setInitializationStatus(prev => ({ ...prev, isInitializing: false }));
        toast.error('Oops! Something went wrong setting up your movie database');
      }
    };

    checkInitialization();

    // Poll for progress updates during initialization
    const progressInterval = setInterval(() => {
      const progress = enhancedMockApi.getPopulationProgress();
      if (progress.total > 0) {
        setInitializationStatus(prev => ({
          ...prev,
          progress: {
            ...progress,
            status: getPlayfulProgressMessage(progress.completed, progress.total)
          }
        }));
      }
    }, 1000);

    return () => clearInterval(progressInterval);
  }, []);

  const getPlayfulProgressMessage = (completed: number, total: number): string => {
    const percentage = (completed / total) * 100;
    if (percentage < 25) return "🎬 Gathering movie magic from the cinema gods...";
    if (percentage < 50) return "🤖 Teaching AI about your future favorite films...";
    if (percentage < 75) return "✨ Sprinkling some recommendation fairy dust...";
    return "🎉 Almost ready to blow your mind with perfect movies!";
  };

  const handlePreferenceChange = (attribute: keyof VibePreferences, value: number) => {
    setPreferences(prev => ({ ...prev, [attribute]: value }));
  };

  const handleGetRecommendations = async () => {
    if (!initializationStatus.isComplete) {
      toast.error('Hold up! Still setting up your movie wonderland...');
      return;
    }

    console.log('🎬 Getting recommendations with playful preferences:', preferences);
    setIsLoadingRecommendations(true);
    setRecommendations([]);
    setErrorMessage(null);

    try {
      const results = await enhancedMockApi.getRecommendations(preferences);
      console.log('✅ Got recommendations:', results);
      
      setRecommendations(results as EnhancedMovie[]);
      setHasSearched(true);
      setStep('results');
      
      if (results.length === 0) {
        setErrorMessage("Hmm, we're being extra picky today! Try tweaking your vibes to discover hidden gems.");
        toast.error('No matches found - let\'s try a different vibe!');
      } else {
        toast.success(`🎉 Found ${results.length} movies that match your vibe perfectly!`);
      }
    } catch (error) {
      console.error('❌ Error getting recommendations:', error);
      setErrorMessage('Oops! Our movie magic got a bit tangled. Let\'s try that again!');
      toast.error('Something went wonky - let\'s try again!');
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleMarkAsSeen = async (movieId: string) => {
    try {
      await enhancedMockApi.updateMovie(movieId, { seen: true });
      
      setRecommendations(prev => 
        prev.map(movie => 
          movie.id === movieId ? { ...movie, seen: true } : movie
        )
      );
      
      toast.success('Added to your "been there, done that" list! 🎬');
    } catch (error) {
      console.error('Failed to mark movie as seen:', error);
      toast.error('Oops, that didn\'t stick - try again!');
    }
  };

  const handleReset = () => {
    setPreferences({
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
    setRecommendations([]);
    setHasSearched(false);
    setErrorMessage(null);
    setStep('setup');
  };

  const getVibePersonality = () => {
    const highAttributes = Object.entries(preferences)
      .filter(([_, value]) => value >= 4)
      .map(([key]) => dimensionScales[key]?.name || key);
    
    const lowAttributes = Object.entries(preferences)
      .filter(([_, value]) => value <= 2)
      .map(([key]) => dimensionScales[key]?.name || key);
    
    if (highAttributes.includes('Serotonin') && highAttributes.includes('Color')) {
      return { emoji: '🌈', text: "a Rainbow Chaser who loves pure visual joy!" };
    }
    if (highAttributes.includes('Brainy Bonkers') && highAttributes.includes('Novelty')) {
      return { emoji: '🧠', text: "a Mind-Bending Explorer seeking the weird and wonderful!" };
    }
    if (highAttributes.includes('Camp') && highAttributes.includes('Novelty')) {
      return { emoji: '🎭', text: "a Chaos Enthusiast who embraces the beautifully bizarre!" };
    }
    if (lowAttributes.includes('Darkness') && highAttributes.includes('Social Safe')) {
      return { emoji: '☀️', text: "a Sunshine Seeker who loves feel-good group watching!" };
    }
    if (highAttributes.includes('Pace') && lowAttributes.includes('Runtime Fit')) {
      return { emoji: '⚡', text: "an Adrenaline Junkie who wants non-stop action!" };
    }
    
    return { emoji: '🎬', text: "a Balanced Movie Lover with exquisite taste!" };
  };

  const vibePersonality = getVibePersonality();
  const adjustedDimensions = Object.values(preferences).filter(v => v !== 3).length;

  if (step === 'results') {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Results Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <PartyPopper className="w-8 h-8 text-primary animate-bounce" />
            <h1 className="text-4xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
              Your Movie Matches!
            </h1>
            <PartyPopper className="w-8 h-8 text-primary animate-bounce" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3">
            <span className="text-2xl">{vibePersonality.emoji}</span>
            <p className="font-medium text-purple-800">
              You're {vibePersonality.text}
            </p>
          </div>

          <Button 
            onClick={() => setStep('setup')} 
            variant="outline" 
            className="mt-4 rounded-full hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Different Vibes
          </Button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="pt-6 text-center">
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-orange-800 font-medium">{errorMessage}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {isLoadingRecommendations ? (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-8 pb-8 text-center">
              <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-purple-800 mb-2">
                Working our movie magic...
              </h3>
              <p className="text-purple-600">
                AI is analyzing thousands of movies to find your perfect matches!
              </p>
            </CardContent>
          </Card>
        ) : recommendations.length > 0 ? (
          <>
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-2">🎯</div>
                <p className="text-green-800 font-medium">
                  Found {recommendations.length} movies that'll make you happy!
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Powered by AI analysis of thousands of movie lovers like you
                </p>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendations.map((movie, index) => (
                <div key={movie.id} className="relative group">
                  <div 
                    className="transform transition-all duration-300 hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PosterCard
                      movie={movie}
                      onMarkAsSeen={handleMarkAsSeen}
                    />
                  </div>
                  
                  {movie.score && movie.score >= 4.5 && (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white animate-pulse">
                      🎯 Perfect!
                    </Badge>
                  )}
                  
                  {movie.ai_confidence && movie.ai_confidence > 0.8 && (
                    <Badge className="absolute -top-2 -left-2 bg-blue-500 text-white text-xs">
                      🤖 AI Pick
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : hasSearched ? (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="text-6xl mb-4">🎭</div>
              <h3 className="text-xl font-medium text-blue-800 mb-2">
                No matches this time!
              </h3>
              <p className="text-blue-600 mb-4">
                Your taste is so unique that we need to dig deeper. Try adjusting your vibes!
              </p>
              <Button 
                onClick={() => setStep('setup')}
                className="bg-blue-600 hover:bg-blue-700 rounded-full"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Remix My Vibes
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Playful Header */}
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-xl opacity-20 animate-pulse" />
          <div className="relative flex items-center justify-center space-x-4">
            <Stars className="w-10 h-10 text-yellow-500 animate-spin" />
            <h1 className="text-5xl bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent font-bold">
              What's Your Movie Vibe?
            </h1>
            <Sparkles className="w-10 h-10 text-purple-500 animate-bounce" />
          </div>
        </div>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          🎬 Let's find movies that'll make your heart sing! Adjust each vibe dial to match your mood right now.
        </p>
        
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full px-6 py-3">
          <span className="text-2xl">{vibePersonality.emoji}</span>
          <p className="font-medium text-purple-800">
            You're currently {vibePersonality.text}
          </p>
        </div>

        {/* Database Status */}
        {initializationStatus.isInitializing && (
          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-2">
                  <Rocket className="w-6 h-6 text-purple-600 animate-bounce" />
                  <span className="text-lg font-medium text-purple-800">
                    Setting up your movie wonderland...
                  </span>
                </div>
                
                {initializationStatus.progress.total > 0 && (
                  <div className="space-y-2 max-w-md mx-auto">
                    <Progress 
                      value={(initializationStatus.progress.completed / initializationStatus.progress.total) * 100}
                      className="h-3 bg-purple-200"
                    />
                    <p className="text-sm text-purple-700 text-center">
                      {initializationStatus.progress.status}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {initializationStatus.isComplete && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-center space-x-4">
                <Badge variant="outline" className="text-green-700 border-green-300">
                  <Zap className="w-3 h-3 mr-1" />
                  Movie Database Ready!
                </Badge>
                <Badge variant="outline" className="text-purple-700 border-purple-300">
                  <Brain className="w-3 h-3 mr-1" />
                  AI Movie Expert Online
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Fun Stats */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-none">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="text-3xl">🎯</div>
              <div className="text-2xl font-bold text-blue-600">{adjustedDimensions}</div>
              <p className="text-sm text-blue-700">Vibes Tuned</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">🎬</div>
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <p className="text-sm text-purple-700">Movies Waiting</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl">✨</div>
              <div className="text-2xl font-bold text-pink-600">100%</div>
              <p className="text-sm text-pink-700">Magic Guaranteed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Playful Instruction */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-3">🎮</div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            Time to Play Movie Matchmaker!
          </h3>
          <p className="text-yellow-700">
            Slide each dial to match your current mood. Each level shows different movie examples - find your perfect vibe combo!
          </p>
        </CardContent>
      </Card>

      {/* Vibe Sliders */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 flex items-center justify-center space-x-2">
            <Palette className="w-6 h-6 text-purple-600" />
            <span>Tune Your Movie Vibes</span>
            <Heart className="w-6 h-6 text-red-500" />
          </h2>
          <Badge variant="outline" className="text-purple-700 border-purple-300">
            {adjustedDimensions === 0 ? "All neutral - let's get creative!" : `${adjustedDimensions} vibes customized`}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {Object.keys(dimensionScales).map((key, index) => (
            <div 
              key={key}
              className="transform transition-all duration-300"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards'
              }}
            >
              <VisualSlider
                attribute={key}
                value={preferences[key as keyof VibePreferences]}
                onChange={(value) => handlePreferenceChange(key as keyof VibePreferences, value)}
                min={1}
                max={5}
                step={1}
              />
            </div>
          ))}
        </div>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleReset}
            variant="outline"
            className="rounded-full hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Neutral Vibes
          </Button>
        </div>

        {/* Big Action Button */}
        <div className="text-center pt-8">
          <div className="space-y-4">
            <Button 
              size="lg" 
              onClick={handleGetRecommendations}
              disabled={isLoadingRecommendations || !initializationStatus.isComplete}
              className="px-16 py-8 text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white border-none rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300"
            >
              {isLoadingRecommendations ? (
                <>
                  <Loader2 className="w-8 h-8 mr-4 animate-spin" />
                  Finding Your Perfect Movies...
                </>
              ) : (
                <>
                  <Sparkles className="w-8 h-8 mr-4" />
                  Find My Movie Soulmates!
                </>
              )}
            </Button>
            
            <p className="text-sm text-muted-foreground">
              ✨ Get ready for some seriously good movie recommendations!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

{/* Add keyframes for animations */}
<style jsx>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`}</style>