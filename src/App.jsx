import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import WatchlistPage from './pages/WatchlistPage';
import WatchedPage from './pages/WatchedPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import './App.css';

// ✅ Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

// ✅ Layout Component with Navbar logic
const AppLayout = () => {
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const path = location.pathname;
    setShowNavbar(path !== '/login' && path !== '/register');
    setIsReady(true);
  }, [location]);

  if (!isReady) return null;

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/watchlist" element={<PrivateRoute><WatchlistPage /></PrivateRoute>} />
        <Route path="/watched" element={<PrivateRoute><WatchedPage /></PrivateRoute>} />
      </Routes>
    </>
  );
};

function App() {
  // ✅ Scrollbar appearance handler
  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      document.body.classList.add('scrolling');
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.body.classList.remove('scrolling');
      }, 800); // visible for 800ms
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
