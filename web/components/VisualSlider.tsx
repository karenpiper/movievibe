import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Sparkles, Play, Pause } from 'lucide-react';
import { dimensionScales, getDimensionLevel, getDimensionColor } from '../lib/dimensionSystem';

interface VisualSliderProps {
  attribute: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function VisualSlider({ 
  attribute, 
  value, 
  onChange, 
  min = 1, 
  max = 5, 
  step = 1 
}: VisualSliderProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const scale = dimensionScales[attribute];
  if (!scale) {
    return <div>Unknown dimension: {attribute}</div>;
  }

  const currentLevel = getDimensionLevel(attribute, value);
  const currentColor = getDimensionColor(attribute, value);

  const handleLevelClick = (levelValue: number) => {
    onChange(levelValue);
  };

  const handlePrevious = () => {
    if (value > min) onChange(value - 1);
  };

  const handleNext = () => {
    if (value < max) onChange(value + 1);
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-xl ${
        value !== 3 ? 'ring-2 ring-offset-2' : ''
      }`}
      style={value !== 3 ? { 
        ringColor: currentColor + '60',
        backgroundColor: currentColor + '05'
      } : {}}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 20% 80%, ${currentColor} 0%, transparent 50%), 
                      radial-gradient(circle at 80% 20%, ${currentColor} 0%, transparent 50%)`
        }}
      />
      
      <CardContent className="p-6 relative">
        {/* Header with Icon and Title */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex items-center justify-center">
            <div className={`text-6xl transition-transform duration-300 ${isHovering ? 'scale-110 rotate-12' : ''}`}>
              {scale.icon}
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold" style={{ color: currentColor }}>
              {scale.name}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {scale.description}
            </p>
          </div>
        </div>

        {/* Current Selection Display */}
        {currentLevel && (
          <div 
            className="relative p-4 rounded-2xl mb-6 border-2 transition-all duration-300"
            style={{ 
              borderColor: currentColor + '40',
              backgroundColor: currentColor + '10',
              boxShadow: `0 8px 32px ${currentColor}20`
            }}
          >
            {/* Sparkle effects for high values */}
            {value >= 4 && (
              <div className="absolute top-2 right-2">
                <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
              </div>
            )}
            
            <div className="text-center space-y-2">
              <div 
                className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-white font-bold text-sm"
                style={{ backgroundColor: currentColor }}
              >
                <span>{value}/5</span>
                <span>•</span>
                <span>{currentLevel.label}</span>
              </div>
              
              <p className="text-xs text-muted-foreground">
                {currentLevel.description}
              </p>
            </div>
          </div>
        )}

        {/* Interactive Level Selector */}
        <div className="space-y-4">
          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-2">
            {/* Prev */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevious}
              disabled={value <= min}
              className="rounded-full w-10 h-10 p-0 text-white shadow-md transition-[box-shadow,opacity,transform] hover:opacity-95 hover:shadow-lg"
              style={{ backgroundColor: '#17a64a' }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Play / Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
              className="rounded-full w-11 h-11 p-0 text-white shadow-md transition-[box-shadow,opacity,transform] hover:opacity-95 hover:shadow-lg"
              style={{ backgroundColor: '#17a64a' }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>

            {/* Next */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNext}
              disabled={value >= max}
              className="rounded-full w-10 h-10 p-0 text-white shadow-md transition-[box-shadow,opacity,transform] hover:opacity-95 hover:shadow-lg"
              style={{ backgroundColor: '#17a64a' }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Visual Level Dots */}
          <div className="flex justify-center space-x-3">
            {scale.levels.map((level) => (
              <button
                key={level.value}
                onClick={() => handleLevelClick(level.value)}
                className={`relative w-4 h-4 rounded-full transition-all duration-300 hover:scale-150 ${
                  value === level.value ? 'scale-125' : 'scale-100'
                }`}
                style={{ 
                  backgroundColor: level.color,
                  boxShadow: value === level.value ? `0 0 20px ${level.color}60` : 'none'
                }}
              >
                {value === level.value && (
                  <div 
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ backgroundColor: level.color }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Movie Examples for Current Level */}
          {currentLevel && currentLevel.examples.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-center text-muted-foreground">
                Movies like this:
              </p>
              <div className="flex flex-wrap gap-1 justify-center">
                {currentLevel.examples.slice(0, 3).map((example, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary" 
                    className="text-xs px-2 py-1 bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                    style={{ borderColor: currentColor + '40' }}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fun Progress Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className="flex items-center space-x-1">
              <span>😴</span>
              <span>{scale.levels[0].label}</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>{scale.levels[4].label}</span>
              <span>🔥</span>
            </span>
          </div>
          <div className="relative w-full h-3 bg-muted/50 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 relative"
              style={{ 
                width: `${((value - 1) / 4) * 100}%`,
                background: `linear-gradient(90deg, ${currentColor}, ${currentColor}dd)`
              }}
            >
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}