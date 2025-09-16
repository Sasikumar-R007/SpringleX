import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import FarmSetup from './pages/FarmSetup';
import Dashboard from './pages/Dashboard';
import SprinklersPage from './pages/SprinklersPage';
import Profile from './pages/Profile';

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  
  // Don't show Navbar on auth pages
  const hideNavbar = location.pathname === '/auth';

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sprinkle-green mx-auto mb-4"></div>
          <p className="text-gray-600">Loading SprinkleX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} 
        />
        
        {/* Protected Routes */}
        <Route
          path="/setup"
          element={isAuthenticated ? <FarmSetup /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/land/:landId/sprinklers"
          element={isAuthenticated ? <SprinklersPage /> : <Navigate to="/auth" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <Profile /> : <Navigate to="/auth" replace />}
        />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App