import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-sprinkle-gray-light via-white to-emerald-50 flex items-center justify-center relative scroll-mt-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sprinkle-green/10 to-sprinkle-blue/10 rounded-full text-sm font-medium text-sprinkle-green border border-sprinkle-green/20 mb-8"
          >
            🌱 Smart Agriculture Revolution
          </motion.div>
          
          <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-sprinkle-dark via-sprinkle-green to-sprinkle-blue bg-clip-text text-transparent mb-6 leading-tight">
            SprinkleX
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl md:text-3xl font-semibold text-sprinkle-gray mb-6 max-w-2xl mx-auto"
          >
            Water Smart. Grow Smart.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg md:text-xl text-sprinkle-gray/80 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Revolutionary IoT-powered agricultural sprinkler system that optimizes water usage 
            through smart sensors and automated zonal watering technology for sustainable farming.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={handleGetStarted}
              className="group relative bg-gradient-to-r from-sprinkle-green to-sprinkle-green-light text-white px-8 py-4 rounded-2xl text-lg font-semibold smooth-transition transform hover:scale-105 shadow-medium hover:shadow-strong overflow-hidden"
            >
              <span className="relative z-10">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-sprinkle-green-dark to-sprinkle-green opacity-0 group-hover:opacity-100 smooth-transition"></div>
            </button>
            
            <button className="flex items-center px-6 py-3 text-sprinkle-gray font-medium hover:text-sprinkle-green smooth-transition">
              <span className="mr-2">Watch Demo</span>
              <div className="w-12 h-12 bg-white rounded-full shadow-soft flex items-center justify-center group-hover:shadow-medium smooth-transition">
                <svg className="w-5 h-5 text-sprinkle-green ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 5v10l8-5-8-5z"/>
                </svg>
              </div>
            </button>
          </motion.div>
        </motion.div>
        
        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/4 -left-1/4 w-96 h-96 bg-gradient-to-r from-sprinkle-green/10 to-sprinkle-blue/10 rounded-full blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -right-1/4 w-128 h-128 bg-gradient-to-r from-sprinkle-blue/10 to-accent-purple/10 rounded-full blur-3xl"
          ></motion.div>
          <motion.div 
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-32 h-32 bg-accent-orange/20 rounded-full blur-2xl"
          ></motion.div>
        </div>
        
        {/* Floating elements */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-12 w-6 h-6 bg-sprinkle-green rounded-full opacity-60"
        ></motion.div>
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/3 right-16 w-4 h-4 bg-sprinkle-blue rounded-full opacity-50"
        ></motion.div>
        <motion.div 
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/3 left-20 w-3 h-3 bg-accent-orange rounded-full opacity-70"
        ></motion.div>
        
        {/* Improved Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center text-sprinkle-gray/60 hover:text-sprinkle-green smooth-transition cursor-pointer"
          >
            <span className="text-sm font-medium mb-2">Scroll to explore</span>
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;