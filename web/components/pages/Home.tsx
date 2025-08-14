import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  Sparkles, 
  Heart, 
  Zap, 
  Star, 
  Film, 
  Palette,
  Brain,
  Target,
  ArrowRight,
  PlayCircle,
  Rocket,
  CheckCircle
} from 'lucide-react';
import { onboardingService } from '../../lib/onboardingService';
import VinylDisplay from '../../components/VinylDisplay';

export default function Home() {
  const hasCompletedOnboarding = onboardingService.hasCompletedOnboarding();
  const onboardingResults = onboardingService.getStoredResults();

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-12">
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <h1 className="relative text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent leading-tight">
              Find Your Perfect
              <br />
              Movie Match
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            🎬 Stop scrolling endlessly! Our AI analyzes your unique taste from thousands of movie reviews to find films that'll make your heart sing.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 text-sm">
              <Brain className="w-4 h-4 mr-2" />
              AI-Powered
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 text-sm">
              <Target className="w-4 h-4 mr-2" />
              Letterboxd Data
            </Badge>
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 text-sm">
              <Heart className="w-4 h-4 mr-2" />
              Personalized
            </Badge>
          </div>
        </div>

        {/* Personalized CTA based on onboarding status */}
        <div className="pt-4">
          {!hasCompletedOnboarding ? (
            // First-time user flow
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 max-w-2xl mx-auto">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <Brain className="w-6 h-6 text-blue-600" />
                      <h3 className="text-xl font-bold text-blue-800">New Here? Start with Taste Calibration!</h3>
                    </div>
                    <p className="text-blue-700">
                      Rate 10 movies in 5 minutes so our AI can learn your unique taste and give you amazing recommendations right away.
                    </p>
                    <div className="flex justify-center space-x-2">
                      <Badge variant="outline" className="text-blue-700 border-blue-300">5 minutes</Badge>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">10 movies</Badge>
                      <Badge variant="outline" className="text-blue-700 border-blue-300">10x better results</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Link to="/onboarding">
                <Button 
                  size="lg"
                  className="px-12 py-8 text-2xl bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 hover:from-blue-700 hover:via-cyan-700 hover:to-purple-700 text-white border-none rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-glow"
                >
                  <Brain className="w-8 h-8 mr-4" />
                  Calibrate My Taste!
                  <ArrowRight className="w-8 h-8 ml-4" />
                </Button>
              </Link>
              
              <div className="text-sm text-muted-foreground space-y-2">
                <p>✨ Recommended for best results • No account needed • Pure movie magic</p>
                <Link to="/vibes">
                  <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                    Skip calibration and explore →
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            // Returning user flow
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 max-w-2xl mx-auto">
                <CardContent className="pt-6 pb-6">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <h3 className="text-xl font-bold text-green-800">Welcome Back, {onboardingResults?.personality_type || 'Movie Lover'}!</h3>
                    </div>
                    <p className="text-green-700">
                      Your taste is calibrated and ready. Time to discover your next favorite movie!
                    </p>
                    {onboardingResults && (
                      <div className="flex justify-center space-x-2">
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          {Math.round(onboardingResults.accuracy_confidence * 100)}% accuracy
                        </Badge>
                        <Badge variant="outline" className="text-green-700 border-green-300">
                          Taste calibrated
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Link to="/vibes">
                <Button 
                  size="lg"
                  className="px-12 py-8 text-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 hover:from-purple-700 hover:via-pink-700 hover:to-red-700 text-white border-none rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 animate-glow"
                >
                  <Sparkles className="w-8 h-8 mr-4" />
                  Find My Movie Soulmate!
                  <ArrowRight className="w-8 h-8 ml-4" />
                </Button>
              </Link>
              
              <p className="text-sm text-muted-foreground">
                🎯 Personalized recommendations ready • Based on your unique taste profile
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Vinyl hero display */}
      <VinylDisplay coverUrl="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop" />

      {/* How It Works */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-3">
            <Rocket className="w-8 h-8 text-purple-600" />
            <span>How the Magic Works</span>
            <Sparkles className="w-8 h-8 text-pink-500" />
          </h2>
          <p className="text-muted-foreground text-lg">
            {hasCompletedOnboarding ? 'Your personalized movie discovery system' : 'Three simple steps to movie nirvana'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <Card className={`group hover:shadow-xl transition-all duration-300 hover:scale-105 ${
            hasCompletedOnboarding 
              ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' 
              : 'border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50'
          }`}>
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto group-hover:animate-bounce ${
                hasCompletedOnboarding 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                {hasCompletedOnboarding ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <Brain className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="space-y-2">
                <h3 className={`text-xl font-bold ${
                  hasCompletedOnboarding ? 'text-green-800' : 'text-blue-800'
                }`}>
                  {hasCompletedOnboarding ? '✅ Taste Calibrated' : '🧠 Calibrate Your Taste'}
                </h3>
                <p className={hasCompletedOnboarding ? 'text-green-700' : 'text-blue-700'}>
                  {hasCompletedOnboarding 
                    ? 'Your unique movie personality is mapped and ready for perfect recommendations!'
                    : 'Rate 10 movies using our fun dimension system so AI can learn your unique preferences.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto group-hover:animate-bounce">
                <Palette className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-purple-800">
                  🎨 Pick Your Vibe
                </h3>
                <p className="text-purple-700">
                  {hasCompletedOnboarding 
                    ? 'Adjust your mood sliders and get AI recommendations tailored to your calibrated taste.'
                    : 'Use our playful sliders to set your current mood and movie preferences.'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-105 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="pt-8 pb-8 text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto group-hover:animate-pulse">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-orange-800">
                  💕 Fall in Love
                </h3>
                <p className="text-orange-700">
                  Get personalized recommendations ranked by how perfectly they match your vibe. No more endless scrolling!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Why You'll Love MovieVibe
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Star className="w-8 h-8 text-yellow-600" />
                <h3 className="text-xl font-bold text-yellow-800">Actually Personal</h3>
              </div>
              <p className="text-yellow-700">
                Unlike Netflix's generic categories, we understand that you might love brainy sci-fi but hate slow-burn dramas. Our 10-dimension system captures YOUR unique taste.
              </p>
            </CardContent>
          </Card>

          <Card className="border-pink-200 bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Zap className="w-8 h-8 text-pink-600" />
                <h3 className="text-xl font-bold text-pink-800">Instant Results</h3>
              </div>
              <p className="text-pink-700">
                {hasCompletedOnboarding 
                  ? 'Your taste is already calibrated! Get amazing recommendations instantly, powered by community wisdom.'
                  : 'Get amazing recommendations in minutes. Optional 5-minute calibration makes them 10x better!'
                }
              </p>
            </CardContent>
          </Card>

          <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <Film className="w-8 h-8 text-cyan-600" />
                <h3 className="text-xl font-bold text-cyan-800">Discover Hidden Gems</h3>
              </div>
              <p className="text-cyan-700">
                Find amazing movies you never would have discovered. Our AI digs deep into film communities to surface perfect matches beyond the obvious picks.
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <PlayCircle className="w-8 h-8 text-purple-600" />
                <h3 className="text-xl font-bold text-purple-800">Fun to Use</h3>
              </div>
              <p className="text-purple-700">
                Who said movie discovery had to be boring? Our playful interface makes finding your next favorite film as enjoyable as watching it.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secondary CTAs */}
      <div className="space-y-8 pt-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Find Your Next Obsession?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Link to={hasCompletedOnboarding ? "/vibes" : "/onboarding"} className="group">
            <Card className={`h-full border-purple-200 hover:shadow-xl transition-all duration-300 group-hover:scale-105 ${
              hasCompletedOnboarding 
                ? 'bg-gradient-to-br from-purple-50 to-pink-50'
                : 'bg-gradient-to-br from-blue-50 to-cyan-50'
            }`}>
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                {hasCompletedOnboarding ? (
                  <>
                    <Sparkles className="w-12 h-12 text-purple-600 mx-auto group-hover:animate-spin" />
                    <h3 className="text-xl font-bold text-purple-800">
                      Get Personalized Recommendations
                    </h3>
                    <p className="text-purple-700">
                      Your taste is calibrated! Get movie recommendations tailored perfectly to your preferences
                    </p>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full">
                      Find Movies Now! <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Brain className="w-12 h-12 text-blue-600 mx-auto group-hover:animate-bounce" />
                    <h3 className="text-xl font-bold text-blue-800">
                      Start with Taste Calibration
                    </h3>
                    <p className="text-blue-700">
                      Rate 10 movies in 5 minutes for 10x better recommendations
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-full">
                      Calibrate Now! <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Link>

          <Link to="/add" className="group">
            <Card className="h-full border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <CardContent className="pt-8 pb-8 text-center space-y-4">
                <Film className="w-12 h-12 text-green-600 mx-auto group-hover:animate-bounce" />
                <h3 className="text-xl font-bold text-green-800">
                  Log Your Favorites
                </h3>
                <p className="text-green-700">
                  Add movies you love to help our AI learn your taste and get even better recommendations
                </p>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100 rounded-full">
                  Add Movies <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Fun Footer */}
      <div className="text-center py-12 space-y-4">
        <div className="flex justify-center space-x-4 text-4xl">
          <span className="animate-bounce">🎬</span>
          <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>🍿</span>
          <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>✨</span>
          <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>🎭</span>
          <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>🎪</span>
        </div>
        <p className="text-muted-foreground">
          Made with 💜 for fellow movie obsessives who are tired of "Because you watched..." recommendations
        </p>
        {hasCompletedOnboarding && onboardingResults && (
          <p className="text-sm text-muted-foreground">
            You're a <strong>{onboardingResults.personality_type}</strong> with {Math.round(onboardingResults.accuracy_confidence * 100)}% taste calibration accuracy
          </p>
        )}
      </div>
    </div>
  );
}