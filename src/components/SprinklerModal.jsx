import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Droplet, 
  Thermometer, 
  Activity, 
  Calendar,
  Gauge,
  Beaker,
  MapPin,
  Clock,
  Zap,
  Settings,
  ShieldAlert
} from 'lucide-react';

const SprinklerModal = ({ sprinkler, isOpen, onClose, onToggle, onEmergencyStop, getText }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!sprinkler) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'dry': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getTimeSinceWatered = (dateString) => {
    const now = new Date();
    const watered = new Date(dateString);
    const diffMs = now - watered;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m ago`;
    }
    return `${diffMinutes}m ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Droplet className="w-6 h-6 text-sprinkle-green" />
                    <h2 className="text-2xl font-bold text-gray-900">
                      {sprinkler.name}
                    </h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(sprinkler.status)}`}>
                    {sprinkler.isActive ? 'Sprinkling' : sprinkler.status.charAt(0).toUpperCase() + sprinkler.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onToggle(sprinkler.id)}
                    className={`px-4 py-2 rounded-lg font-medium smooth-transition ${
                      sprinkler.isActive
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-sprinkle-green text-white hover:bg-green-600'
                    }`}
                  >
                    {sprinkler.isActive ? 'Stop Sprinkling' : 'Start Sprinkling'}
                  </button>
                  
                  {sprinkler.isActive && (
                    <button
                      onClick={() => onEmergencyStop && onEmergencyStop(sprinkler.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent-red to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 smooth-transition font-medium shadow-soft hover:shadow-medium"
                      title={getText ? getText('emergencyStop') : 'Emergency Stop'}
                    >
                      <ShieldAlert size={16} />
                      <span>{getText ? getText('emergencyStop') : 'Emergency Stop'}</span>
                    </button>
                  )}
                  
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-lg smooth-transition"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {[
                  { id: 'overview', label: 'Overview', icon: Activity },
                  { id: 'sensors', label: 'Sensor Data', icon: Gauge },
                  { id: 'schedule', label: 'Schedule', icon: Calendar }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === id
                        ? 'text-sprinkle-green border-b-2 border-sprinkle-green'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Droplet className="w-5 h-5 text-blue-500" />
                          <span className="text-2xl font-bold text-blue-700">
                            {sprinkler.moisture}%
                          </span>
                        </div>
                        <p className="text-sm text-blue-600 mb-1">Current Soil Moisture</p>
                        <p className="text-xs text-gray-600">
                          Target: {sprinkler.requiredMoisture}%
                        </p>
                        <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${sprinkler.moisture}%` }}
                          />
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Activity className="w-5 h-5 text-purple-500" />
                          <span className="text-2xl font-bold text-purple-700">
                            {sprinkler.waterFlowRate} L/min
                          </span>
                        </div>
                        <p className="text-sm text-purple-600 mb-1">Water Flow Rate</p>
                        <p className="text-xs text-gray-600">
                          Efficient watering
                        </p>
                      </div>
                    </div>

                    {/* Detailed Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Watering Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Clock className="w-5 h-5 mr-2 text-gray-500" />
                          Watering History
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Last Watered:</span>
                            <span className="font-medium">{getTimeSinceWatered(sprinkler.lastWatered)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Water Used Today:</span>
                            <span className="font-medium">{sprinkler.waterUsedToday}L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Scheduled:</span>
                            <span className="font-medium">{formatDateTime(sprinkler.nextScheduled)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Device Information */}
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <Settings className="w-5 h-5 mr-2 text-gray-500" />
                          Device Information
                        </h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Device ID:</span>
                            <span className="font-medium">{sprinkler.deviceId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Coverage Area:</span>
                            <span className="font-medium">{sprinkler.coverage}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Crop Type:</span>
                            <span className="font-medium">{sprinkler.cropType}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'sensors' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Soil Conditions</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Beaker className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium">pH Level</span>
                          </div>
                          <span className="text-lg font-bold">{sprinkler.soilPH}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${((sprinkler.soilPH - 6) / 2) * 100}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>6.0</span>
                          <span>8.0</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm font-medium">Nutrient Level</span>
                          </div>
                          <span className="text-lg font-bold">{sprinkler.nutrientLevel}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${sprinkler.nutrientLevel}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
                      
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Droplet className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm font-medium">Flow Rate</span>
                          </div>
                          <span className="text-lg font-bold">{sprinkler.waterFlowRate} L/min</span>
                        </div>
                        <p className="text-xs text-gray-600">Consistent flow maintained</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                            <span className="text-sm font-medium">Coverage</span>
                          </div>
                          <span className="text-lg font-bold">{sprinkler.coverage}</span>
                        </div>
                        <p className="text-xs text-gray-600">Area coverage</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'schedule' && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Smart Scheduling Status
                      </h3>
                      <p className="text-gray-600 mb-3">
                        Automated watering based on soil moisture, weather, and crop requirements
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Smart scheduling active</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Next Actions</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Next Watering</p>
                              <p className="text-sm text-gray-600">{formatDateTime(sprinkler.nextScheduled)}</p>
                            </div>
                            <Calendar className="w-5 h-5 text-gray-400" />
                          </div>
                          
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Moisture Check</p>
                              <p className="text-sm text-gray-600">Every 30 minutes</p>
                            </div>
                            <Activity className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Optimization</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="font-medium text-green-800">Water Savings</p>
                            <p className="text-sm text-green-600">23% reduction vs manual watering</p>
                          </div>
                          
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="font-medium text-blue-800">Efficiency Score</p>
                            <p className="text-sm text-blue-600">92% - Excellent performance</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SprinklerModal;