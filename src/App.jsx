import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Loader from './components/common/Loader';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';
import FeedbackForm from './components/FeedbackForm/FeedbackForm';
import './App.css';

// Lazy load components
const Home = lazy(() => import('./pages/Home/Home'));
const RecipeSearch = lazy(() => import('./pages/RecipeSearch/RecipeSearch'));
const RecipeDetail = lazy(() => import('./pages/RecipeDetail/RecipeDetail'));

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleFeedback = () => {
    setShowFeedback(!showFeedback);
  };

  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="logo" onClick={closeMobileMenu}>
                Meal Planner
              </Link>
              <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                <Link to="/" onClick={closeMobileMenu}>Home</Link>
                <Link to="/search" onClick={closeMobileMenu}>Search Recipes</Link>
                <button className="nav-feedback-btn" onClick={toggleFeedback}>
                  Feedback
                </button>
                <ThemeToggle />
              </div>
              <button 
                className="mobile-menu-button"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            </div>
            {showFeedback && (
              <div className="feedback-dropdown">
                <FeedbackForm />
              </div>
            )}
          </nav>

          <main className="main-content" onClick={() => {
            closeMobileMenu();
            setShowFeedback(false);
          }}>
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<RecipeSearch />} />
                <Route path="/recipe/:id" element={<RecipeDetail />} />
              </Routes>
            </Suspense>
          </main>

          <footer className="footer">
            <div className="footer-content">
              <p>&copy; {new Date().getFullYear()} Meal Planner. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
