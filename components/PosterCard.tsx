import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Eye, Star } from 'lucide-react';
import { Movie, mockApi } from '../lib/mockApi';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PosterCardProps {
  movie: Movie;
  onMarkAsSeen?: (movieId: string) => void;
}

export default function PosterCard({ movie, onMarkAsSeen }: PosterCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSeen, setIsSeen] = useState(movie.seen);

  const handleMarkAsSeen = async () => {
    setIsLoading(true);
    try {
      await mockApi.updateMovie(movie.id, { seen: true });
      setIsSeen(true);
      onMarkAsSeen?.(movie.id);
      toast.success('Movie marked as seen!');
    } catch (error) {
      toast.error('Failed to mark movie as seen');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={`group hover:shadow-lg transition-all duration-200 ${isSeen ? 'opacity-50' : ''}`}>
      <CardContent className="p-4 space-y-3">
        <div className="relative">
          <ImageWithFallback
            src={movie.poster_url}
            alt={`${movie.title} poster`}
            className="w-full h-64 object-cover rounded-md"
            width={300}
            height={450}
          />
          {movie.score && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-medium flex items-center space-x-1">
              <Star className="w-3 h-3" />
              <span>{movie.score.toFixed(1)}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium line-clamp-2">{movie.title} ({movie.year})</h3>
          
          <div className="flex flex-wrap gap-1">
            {movie.genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-xs">
                {genre}
              </Badge>
            ))}
          </div>

          <div className="flex space-x-2">
            {!isSeen && (
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={handleMarkAsSeen}
                disabled={isLoading}
              >
                <Eye className="w-4 h-4 mr-1" />
                Mark as Seen
              </Button>
            )}
            
            <Link to={`/rate/${movie.id}`} className="flex-1">
              <Button size="sm" className="w-full">
                Rate Movie
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}