import { motion } from 'framer-motion';
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
    <section id="home" className="min-h-screen bg-gradient-to-br from-white via-sprinkle-gray-light to-white flex items-center justify-center relative scroll-mt-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50, rotate: -10 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ 
              delay: 0.2, 
              duration: 0.8,
              type: "spring",
              stiffness: 100,
              damping: 10
            }}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sprinkle-green/10 to-sprinkle-blue/10 rounded-full text-sm font-medium text-sprinkle-green border border-sprinkle-green/20 mb-8 mt-8 sm:mt-12 lg:mt-16"
          >
            🌱 Smart Agriculture Revolution
          </motion.div>
          
          <motion.h1 
            className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold bg-gradient-to-r from-sprinkle-dark via-sprinkle-green to-sprinkle-blue bg-clip-text text-transparent mb-8 leading-tight"
            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              delay: 0.5, 
              duration: 1,
              type: "spring",
              stiffness: 60,
              damping: 20
            }}
          >
            SprinkleX
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 0.8, 
              duration: 0.8,
              type: "spring",
              stiffness: 80
            }}
            className="text-xl sm:text-2xl lg:text-3xl font-semibold text-sprinkle-gray mb-8 max-w-2xl mx-auto"
          >
            Water Smart. Grow Smart.
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 1.1, 
              duration: 0.8,
              type: "spring",
              stiffness: 70
            }}
            className="text-base sm:text-lg lg:text-xl text-sprinkle-gray/80 mb-16 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            Revolutionary IoT-powered agricultural sprinkler system that optimizes water usage 
            through smart sensors and automated zonal watering technology for sustainable farming.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              delay: 1.4, 
              duration: 0.6,
              type: "spring",
              stiffness: 150,
              damping: 12
            }}
            className="flex justify-center items-center"
          >
            <button
              onClick={handleGetStarted}
              className="group relative bg-gradient-to-r from-sprinkle-green to-sprinkle-green-light text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl text-lg sm:text-xl font-semibold smooth-transition transform hover:scale-105 shadow-medium hover:shadow-strong overflow-hidden"
            >
              <span className="relative z-10">
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-sprinkle-green-dark to-sprinkle-green opacity-0 group-hover:opacity-100 smooth-transition"></div>
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
        
      </div>
    </section>
  );
};

export default Hero;