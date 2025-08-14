import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Sparkles, 
  Plus, 
  Star,
  Palette,
  Film,
  Heart,
  Zap,
  Brain
} from 'lucide-react';
import { onboardingService } from '../lib/onboardingService';

export default function Navigation() {
  const location = useLocation();
  const hasCompletedOnboarding = onboardingService.hasCompletedOnboarding();

  const navItems = [
    { 
      path: '/', 
      label: 'Home', 
      icon: Home,
      emoji: '🏠',
      description: 'Your movie home base'
    },
    { 
      path: '/vibes', 
      label: 'Find Vibes', 
      icon: Sparkles,
      emoji: '✨',
      description: 'Discover your perfect movie'
    },
    { 
      path: '/add', 
      label: 'Add Movie', 
      icon: Plus,
      emoji: '🎬',
      description: 'Log a new favorite'
    }
  ];

  // Add onboarding to nav if not completed
  if (!hasCompletedOnboarding && location.pathname !== '/onboarding') {
    navItems.splice(1, 0, {
      path: '/onboarding',
      label: 'Get Started',
      icon: Brain,
      emoji: '🧠',
      description: 'Calibrate your taste (5 min)'
    });
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:scale-105 transition-transform group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Film className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-yellow-700" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MovieVibe
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                Find your perfect match
              </p>
            </div>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center space-x-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const isOnboarding = item.path === '/onboarding';
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="icon"
                    className={`relative group h-10 w-10 rounded-full transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : isOnboarding
                          ? 'ring-2 ring-blue-200 ring-offset-2 hover:bg-blue-50'
                          : 'hover:bg-muted'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : isOnboarding ? 'text-blue-600 group-hover:text-blue-700' : 'text-foreground'}`} />
                    <span className="sr-only">{item.label}</span>
                    
                    {/* Special badge for onboarding */}
                    {isOnboarding && (
                      <Badge className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] px-1.5 py-0.5 animate-pulse">
                        New!
                      </Badge>
                    )}
                    
                    {/* Hover tooltip */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap pointer-events-none z-50">
                      {item.description}
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Status Display */}
          <div className="flex items-center space-x-3">
            {hasCompletedOnboarding ? (
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-700"
              >
                <Brain className="w-3 h-3 mr-1" />
                Taste Calibrated
              </Badge>
            ) : (
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-blue-700 animate-pulse"
              >
                <Zap className="w-3 h-3 mr-1" />
                Ready to Calibrate
              </Badge>
            )}
            
            <div className="hidden sm:flex items-center space-x-1 text-xs text-muted-foreground">
              <Heart className="w-3 h-3 text-red-500" />
              <span>Made with love for movie nerds</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}