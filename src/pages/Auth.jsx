import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ emailOrPhone: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.emailOrPhone && loginData.password) {
      // In a real app, you'd validate credentials
      const userData = {
        name: 'Demo Farmer',
        email: loginData.emailOrPhone.includes('@') ? loginData.emailOrPhone : 'demo@example.com',
        phone: loginData.emailOrPhone.includes('@') ? '9876543210' : loginData.emailOrPhone,
      };
      login(userData);
      
      // Check if user has farm data, if not go to setup wizard
      const farmData = localStorage.getItem('sprinkleX_farmData');
      navigate(farmData ? '/dashboard' : '/setup');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (registerData.name && registerData.phone && registerData.email && registerData.password) {
      register(registerData);
      // New user goes to setup wizard
      navigate('/setup');
    }
  };

  const updateLoginData = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const updateRegisterData = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-green-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-sprinkle-green mb-6 transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </button>

        {/* Tab Navigation */}
        <div className="flex mb-8">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg transition-colors ${
              activeTab === 'login'
                ? 'bg-sprinkle-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg transition-colors ${
              activeTab === 'register'
                ? 'bg-sprinkle-green text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={loginData.emailOrPhone}
                onChange={(e) => updateLoginData('emailOrPhone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                placeholder="Enter email or phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginData.password}
                onChange={(e) => updateLoginData('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                placeholder="Enter password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sprinkle-green hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </motion.form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleRegister}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={registerData.name}
                onChange={(e) => updateRegisterData('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={registerData.phone}
                onChange={(e) => updateRegisterData('phone', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                placeholder="Enter phone number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={registerData.email}
                onChange={(e) => updateRegisterData('email', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                placeholder="Enter email address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={registerData.password}
                onChange={(e) => updateRegisterData('password', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                placeholder="Create a password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-sprinkle-green hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Register
            </button>
          </motion.form>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Demo Mode: Use any credentials to continue
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;