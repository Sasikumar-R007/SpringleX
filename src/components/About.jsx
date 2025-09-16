import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sprinkle-dark mb-6 sm:mb-8">
            Revolutionizing Agriculture
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2 sm:px-0">
            Water scarcity and over-irrigation are critical challenges facing modern agriculture. 
            Traditional sprinkler systems waste precious water resources and can damage crops through 
            inadequate or excessive watering.
          </p>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed px-2 sm:px-0">
            SprinkleX solves these problems with intelligent IoT sensors that monitor soil moisture 
            across multiple zones, automated valve controls for precise water distribution, and 
            real-time monitoring through our comprehensive dashboard. Our system ensures optimal 
            water usage while maximizing crop yield.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default About;