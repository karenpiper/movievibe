import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './ui/sonner';
import Navigation from './Navigation';
import Home from './pages/Home';
import Onboarding from './pages/Onboarding';
import PickVibe from './pages/PickVibe';
import LogMovie from './pages/LogMovie';
import RateMovie from './pages/RateMovie';
import Insights from './pages/Insights';
import NotFound from './pages/NotFound';

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
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}