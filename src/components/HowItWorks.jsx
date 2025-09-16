import { motion } from 'framer-motion';
import { Gauge, Cpu, Smartphone } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Gauge className="w-16 h-16" />,
      title: "Sensors Detect",
      description: "Smart soil moisture sensors continuously monitor moisture levels across different zones of your farm."
    },
    {
      icon: <Cpu className="w-16 h-16" />,
      title: "ESP32 Controls",
      description: "Our ESP32 microcontroller processes sensor data and automatically controls valves and pumps."
    },
    {
      icon: <Smartphone className="w-16 h-16" />,
      title: "Farmer Gets Updates",
      description: "Real-time alerts and dashboard updates keep you informed about your irrigation system status."
    }
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gray-50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sprinkle-dark mb-4 sm:mb-6">
            How It Works
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Three simple steps to transform your irrigation system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              {/* Step number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-sprinkle-green text-white rounded-full flex items-center justify-center font-bold text-sm z-10">
                {index + 1}
              </div>
              
              {/* Connection line (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-x-1/2"></div>
              )}
              
              <div className="bg-gray-50 p-8 rounded-xl">
                <div className="text-sprinkle-green mb-6 flex justify-center">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-semibold text-sprinkle-dark mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;