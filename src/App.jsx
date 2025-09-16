import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-12 w-12 border-b-2 border-sprinkle-green mx-auto mb-6"
          ></motion.div>
          
          <div className="flex items-center justify-center space-x-1 text-gray-600">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-lg font-medium"
            >
              Loading
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-lg font-medium bg-gradient-to-r from-sprinkle-green to-sprinkle-blue bg-clip-text text-transparent"
            >
              SprinkleX
            </motion.span>
            <div className="flex space-x-1 ml-1">
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="w-1 h-1 bg-sprinkle-green rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }}
                className="w-1 h-1 bg-sprinkle-green rounded-full"
              ></motion.div>
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
                className="w-1 h-1 bg-sprinkle-green rounded-full"
              ></motion.div>
            </div>
          </div>
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