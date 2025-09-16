import { motion } from 'framer-motion';

const Team = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-sprinkle-dark mb-6">
            Team SprinkleX
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Building the future of water-smart farming.
          </p>
          <div className="mt-12 flex justify-center">
            <div className="bg-gradient-to-br from-sprinkle-green to-green-600 rounded-full p-1">
              <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center">
                <span className="text-3xl font-bold text-sprinkle-green">SX</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;