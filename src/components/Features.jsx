import { motion } from 'framer-motion';
import { 
  Gauge, 
  Droplets, 
  Smartphone, 
  Sun, 
  Settings, 
  Bell 
} from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Gauge className="w-12 h-12" />,
      title: "Multi-Zone Soil Monitoring",
      description: "Advanced sensors continuously monitor soil moisture levels across different zones of your farm."
    },
    {
      icon: <Droplets className="w-12 h-12" />,
      title: "Automated Zonal Watering",
      description: "Smart valves automatically water only the zones that need it, preventing over-watering."
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Web & Mobile Dashboard",
      description: "Monitor your entire irrigation system from anywhere with our intuitive dashboard."
    },
    {
      icon: <Sun className="w-12 h-12" />,
      title: "Solar Powered & Sustainable",
      description: "Environmentally friendly system powered by renewable solar energy."
    },
    {
      icon: <Settings className="w-12 h-12" />,
      title: "Crop & Soil Type Customization",
      description: "Tailor watering schedules and thresholds for different crop types and soil conditions."
    },
    {
      icon: <Bell className="w-12 h-12" />,
      title: "Alerts & Notifications",
      description: "Get instant notifications about system status, maintenance needs, and water usage."
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-bl from-emerald-50/30 via-white to-green-50/20 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-10 sm:mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sprinkle-dark mb-4 sm:mb-6">
            Smart Features
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 sm:px-0">
            Advanced technology designed to optimize your water usage and maximize crop yield
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-sprinkle-green mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-sprinkle-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;