import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Navigation from './components/Navigation';
import Home from './components/pages/Home';
import Onboarding from './components/pages/Onboarding';
import PickVibe from './components/pages/PickVibe';
import LogMovie from './components/pages/LogMovie';
import RateMovie from './components/pages/RateMovie';
import NotFound from './components/pages/NotFound';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/vibes" element={<PickVibe />} />
            <Route path="/add" element={<LogMovie />} />
            <Route path="/rate/:movieId" element={<RateMovie />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}