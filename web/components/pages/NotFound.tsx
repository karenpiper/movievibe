import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Home, Film } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto text-center space-y-6">
      <div className="space-y-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
          <Film className="w-12 h-12 text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <h1>Page Not Found</h1>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
      </div>

      <Link to="/">
        <Button className="space-x-2">
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Button>
      </Link>
    </div>
  );
}