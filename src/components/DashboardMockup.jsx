import { motion } from 'framer-motion';
import { Gauge, Droplets, Zap, TrendingUp } from 'lucide-react';

const DashboardMockup = () => {
  const zones = [
    { name: 'Zone A', moisture: 85, status: 'optimal', waterUsage: '12L/hr' },
    { name: 'Zone B', moisture: 45, status: 'watering', waterUsage: '18L/hr' },
    { name: 'Zone C', moisture: 92, status: 'optimal', waterUsage: '8L/hr' },
    { name: 'Zone D', moisture: 38, status: 'dry', waterUsage: '0L/hr' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimal': return 'text-green-600 bg-green-100';
      case 'watering': return 'text-blue-600 bg-blue-100';
      case 'dry': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-sprinkle-dark mb-6">
            Live Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor your entire irrigation system in real-time with our intuitive dashboard
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-2xl p-8 mx-auto max-w-6xl"
        >
          {/* Dashboard Header */}
          <div className="border-b border-gray-200 pb-6 mb-8">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-bold text-sprinkle-dark">Farm Dashboard</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  System Online
                </div>
                <div>Last Updated: 2 min ago</div>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-sprinkle-dark">847L</div>
              <div className="text-sm text-gray-500">Total Water Used Today</div>
            </div>
            <div className="text-center">
              <Gauge className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-sprinkle-dark">68%</div>
              <div className="text-sm text-gray-500">Average Soil Moisture</div>
            </div>
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-sprinkle-dark">92%</div>
              <div className="text-sm text-gray-500">Solar Battery Level</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-sprinkle-dark">-23%</div>
              <div className="text-sm text-gray-500">Water Savings vs Traditional</div>
            </div>
          </div>

          {/* Zone Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {zones.map((zone, index) => (
              <motion.div
                key={zone.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-sprinkle-dark">{zone.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(zone.status)}`}>
                    {zone.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Soil Moisture</span>
                      <span className="font-medium">{zone.moisture}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${zone.moisture > 70 ? 'bg-green-500' : zone.moisture > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${zone.moisture}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <span className="text-gray-600">Water Usage: </span>
                    <span className="font-medium">{zone.waterUsage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardMockup;