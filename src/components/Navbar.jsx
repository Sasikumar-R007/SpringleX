import { useState } from 'react';
import { Menu, X, User, LogOut, Bell, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useFarm } from '../contexts/FarmContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { alerts } = useFarm();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLandingPage = location.pathname === '/';

  const landingNavItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Contact', href: '#contact' },
  ];

  const dashboardNavItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
  ];

  const handleNavClick = (href) => {
    setIsOpen(false);
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'critical': return <XCircle size={16} className="text-red-500" />;
      case 'success': return <CheckCircle size={16} className="text-green-500" />;
      case 'info': return <Info size={16} className="text-blue-500" />;
      default: return <Bell size={16} className="text-gray-500" />;
    }
  };

  return (
    <nav className="fixed top-0 w-full glass-effect z-50 border-b border-sprinkle-gray-medium/30 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <div className="flex-shrink-0">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold bg-gradient-to-r from-sprinkle-green to-sprinkle-blue bg-clip-text text-transparent hover:from-sprinkle-green-dark hover:to-sprinkle-blue-dark smooth-transition"
            >
              SprinkleX
            </button>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {isLandingPage && !isAuthenticated && landingNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item.href)}
                  className="text-sprinkle-gray hover:text-sprinkle-green px-4 py-2 rounded-xl text-sm font-medium smooth-transition hover:bg-sprinkle-green/5"
                >
                  {item.name}
                </button>
              ))}
              {isAuthenticated && dashboardNavItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.path)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium smooth-transition ${
                    location.pathname === item.path
                      ? 'text-white bg-gradient-to-r from-sprinkle-green to-sprinkle-green-light shadow-soft'
                      : 'text-sprinkle-gray hover:text-sprinkle-green hover:bg-sprinkle-green/5'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">
                  Welcome, {user?.name}
                </span>
                {/* Notification Icon */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative flex items-center text-gray-700 hover:text-sprinkle-green transition-colors p-2"
                  >
                    <Bell size={20} />
                    {alerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {alerts.length > 9 ? '9+' : alerts.length}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="py-2">
                        {alerts.length > 0 ? (
                          alerts.slice(0, 10).map((alert) => (
                            <div
                              key={alert.id}
                              className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-start">
                                <div className="mr-3 mt-1">
                                  {getAlertIcon(alert.type)}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900">{alert.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                            <p>No notifications</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="bg-sprinkle-green hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
              >
                <User size={16} className="mr-2" />
                Login
              </button>
            )}
          </div>

          {/* Mobile menu button and notification */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Notification Bell */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative flex items-center text-gray-700 hover:text-sprinkle-green transition-colors p-2"
                >
                  <Bell size={20} />
                  {alerts.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {alerts.length > 9 ? '9+' : alerts.length}
                    </span>
                  )}
                </button>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-sprinkle-green focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Notifications Panel */}
      {showNotifications && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 w-11/12 max-w-md max-h-96 overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="py-2">
              {alerts.length > 0 ? (
                alerts.slice(0, 10).map((alert) => (
                  <div
                    key={alert.id}
                    className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start">
                      <div className="mr-3 mt-1">
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-gray-500">
                  <Bell size={24} className="mx-auto mb-2 text-gray-300" />
                  <p>No notifications</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Landing Page Nav Items */}
            {isLandingPage && !isAuthenticated && landingNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-700 hover:text-sprinkle-green block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {item.name}
              </button>
            ))}
            
            {/* Dashboard Nav Items */}
            {isAuthenticated && dashboardNavItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
                  location.pathname === item.path
                    ? 'text-sprinkle-green bg-green-50'
                    : 'text-gray-700 hover:text-sprinkle-green'
                }`}
              >
                {item.name}
              </button>
            ))}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-600">
                    Welcome, {user?.name}
                  </div>
                  
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-red-600 px-3 py-2 rounded-md text-base font-medium w-full"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/auth')}
                  className="bg-sprinkle-green hover:bg-green-600 text-white px-3 py-2 rounded-lg text-base font-medium w-full flex items-center justify-center"
                >
                  <User size={16} className="mr-2" />
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;