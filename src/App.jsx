/**
 * App Component – Root Layout
 * =============================
 * Sets up routing, layout wrapper, and global providers.
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import AnimatedBackground from './components/AnimatedBackground';
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Dashboard from './pages/Dashboard';
import ScoresPage from './pages/ScoresPage';
import NewsPage from './pages/NewsPage';
import StandingsPage from './pages/StandingsPage';
import PlayersPage from './pages/PlayersPage';
import InsightsPage from './pages/InsightsPage';

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        {/* Animated decorative background */}
        <AnimatedBackground />

        {/* Sticky header with nav */}
        <Header />

        {/* Main content area */}
        <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 relative z-1 min-h-[calc(100vh-160px)]">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scores" element={<ScoresPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/standings" element={<StandingsPage />} />
            <Route path="/players" element={<PlayersPage />} />
            <Route path="/insights" element={<InsightsPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </ToastProvider>
    </BrowserRouter>
  );
}
