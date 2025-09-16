import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useFarm } from '../contexts/FarmContext';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Droplet, 
  AlertTriangle, 
  Settings, 
  Power, 
  RefreshCw,
  Edit3,
  Bell,
  ChevronRight,
  Activity,
  Plus
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const { farmData, sprinklers, alerts, getLands, getStatusColor, updateMoistureLevels, addLand } = useFarm();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(localStorage.getItem('sprinkleX_language') || 'en');
  const [showAddLandModal, setShowAddLandModal] = useState(false);
  const [newLandData, setNewLandData] = useState({
    name: '',
    landSize: '',
    landUnit: 'acres',
    cropType: '',
    soilType: '',
    cropCount: ''
  });
  
  // Get lands data
  const lands = getLands();

  // Translations
  const t = {
    en: {
      welcome: 'Welcome back',
      farmDetails: 'Farm Details',
      lands: 'My Lands',
      recentAlerts: 'Recent Alerts',
      editFarmDetails: 'Edit Farm Details',
      addLand: 'Add New Land',
      moisture: 'Moisture',
      status: 'Status',
      control: 'Control',
      good: 'Good',
      dry: 'Dry',
      critical: 'Critical',
      on: 'ON',
      off: 'OFF',
      refresh: 'Refresh Data',
      noAlerts: 'No recent alerts'
    },
    ta: {
      welcome: 'மீண்டும் வருக',
      farmDetails: 'பண்ணை விவரங்கள்',
      lands: 'என் நிலங்கள்',
      recentAlerts: 'சமீபத்திய எச்சரிக்கைகள்',
      editFarmDetails: 'பண்ணை விவரங்களைத் திருத்து',
      addLand: 'புதிய நிலத்தைச் சேர்க்கவும்',
      moisture: 'ஈரப்பதம்',
      status: 'நிலை',
      control: 'கட்டுப்பாடு',
      good: 'நல்ல',
      dry: 'வறண்ட',
      critical: 'முக்கியமான',
      on: 'இயங்கும்',
      off: 'நிறுத்து',
      refresh: 'தரவை புதுப்பிக்கவும்',
      noAlerts: 'சமீபத்திய எச்சரிக்கைகள் இல்லை'
    }
  };

  const getText = (key) => t[language][key] || t.en[key];

  // Update moisture levels every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateMoistureLevels();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!farmData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No farm data found
          </h2>
          <button
            onClick={() => navigate('/setup')}
            className="bg-sprinkle-green hover:bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Set up your farm
          </button>
        </div>
      </div>
    );
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'good': return getText('good');
      case 'dry': return getText('dry');
      case 'critical': return getText('critical');
      default: return status;
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'critical': return <AlertTriangle size={16} className="text-red-500" />;
      case 'success': return <Droplet size={16} className="text-green-500" />;
      default: return <Bell size={16} className="text-blue-500" />;
    }
  };

  const handleAddLand = () => {
    if (newLandData.name && newLandData.landSize && newLandData.cropType && newLandData.soilType && newLandData.cropCount) {
      addLand(newLandData);
      setNewLandData({
        name: '',
        landSize: '',
        landUnit: 'acres',
        cropType: '',
        soilType: '',
        cropCount: ''
      });
      setShowAddLandModal(false);
    }
  };

  const cropOptions = [
    'Rice', 'Wheat', 'Sugarcane', 'Corn', 'Tomato', 'Potato', 
    'Cotton', 'Soybean', 'Groundnut', 'Onion', 'Other'
  ];

  const soilOptions = [
    'Clay', 'Loam', 'Sandy', 'Silt', 'Rocky', 'Mixed'
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-sprinkle-dark mb-2">
            {getText('welcome')}, {user?.name}!
          </h1>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {getText('farmDetails')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Land Size:</span>
                <span className="ml-2 font-medium">
                  {farmData.landSize} {farmData.landUnit}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Crop:</span>
                <span className="ml-2 font-medium">{farmData.cropType}</span>
              </div>
              <div>
                <span className="text-gray-600">Soil:</span>
                <span className="ml-2 font-medium">{farmData.soilType}</span>
              </div>
              <div>
                <span className="text-gray-600">Crop Count:</span>
                <span className="ml-2 font-medium">{farmData.cropCount}</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/setup')}
              className="mt-4 flex items-center text-sprinkle-green hover:text-green-600 transition-colors"
            >
              <Edit3 size={16} className="mr-2" />
              {getText('editFarmDetails')}
            </button>
          </div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex justify-between items-center"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {getText('lands')}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddLandModal(true)}
              className="flex items-center px-4 py-2 bg-sprinkle-green hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              <Plus size={16} className="mr-2" />
              {getText('addLand')}
            </button>
            <button
              onClick={updateMoistureLevels}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              {getText('refresh')}
            </button>
          </div>
        </motion.div>

        {/* Lands Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {lands.map((land, index) => (
            <motion.div
              key={land.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              onClick={() => navigate(`/land/${land.id}/sprinklers`)}
              className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all cursor-pointer hover:bg-gray-50 border-2 border-transparent hover:border-sprinkle-green"
            >
              {/* Land Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-sprinkle-green mr-3" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {land.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {land.sprinklerCount} sprinklers installed
                    </p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full ${getStatusColor(land.status)}`} />
              </div>

              {/* Land Statistics */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Droplet className="w-5 h-5 text-blue-500" />
                      <span className="text-lg font-bold text-blue-700">
                        {land.avgMoisture}%
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 mt-1">Avg Moisture</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <Activity className="w-5 h-5 text-green-500" />
                      <span className="text-lg font-bold text-green-700">
                        {land.activeSprinklers}
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">Active Now</p>
                  </div>
                </div>

                {land.criticalSprinklers > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm text-red-700 font-medium">
                        {land.criticalSprinklers} sprinkler{land.criticalSprinklers > 1 ? 's' : ''} need attention
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Arrow */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <span className="text-sm text-gray-600">
                  Click to view sprinklers
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Alerts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {getText('recentAlerts')}
          </h2>
          {alerts.length > 0 ? (
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="mr-3">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{alert.message}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {alert.time}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8">
              {getText('noAlerts')}
            </p>
          )}
        </motion.div>

        {/* Add Land Modal */}
        {showAddLandModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-8 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-sprinkle-dark">Add New Land</h2>
                <button
                  onClick={() => setShowAddLandModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Land Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Land Name
                  </label>
                  <input
                    type="text"
                    value={newLandData.name}
                    onChange={(e) => setNewLandData({...newLandData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                    placeholder="Enter land name"
                  />
                </div>

                {/* Land Size */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Land Size
                    </label>
                    <input
                      type="number"
                      value={newLandData.landSize}
                      onChange={(e) => setNewLandData({...newLandData, landSize: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                      placeholder="Enter size"
                      min="0.1"
                      step="0.1"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit
                    </label>
                    <select
                      value={newLandData.landUnit}
                      onChange={(e) => setNewLandData({...newLandData, landUnit: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                    >
                      <option value="acres">Acres</option>
                      <option value="hectares">Hectares</option>
                    </select>
                  </div>
                </div>

                {/* Crop Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type
                  </label>
                  <select
                    value={newLandData.cropType}
                    onChange={(e) => setNewLandData({...newLandData, cropType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                  >
                    <option value="">Select crop type</option>
                    {cropOptions.map((crop) => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                {/* Soil Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Soil Type
                  </label>
                  <select
                    value={newLandData.soilType}
                    onChange={(e) => setNewLandData({...newLandData, soilType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                  >
                    <option value="">Select soil type</option>
                    {soilOptions.map((soil) => (
                      <option key={soil} value={soil}>{soil}</option>
                    ))}
                  </select>
                </div>

                {/* Crop Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Crops
                  </label>
                  <input
                    type="number"
                    value={newLandData.cropCount}
                    onChange={(e) => setNewLandData({...newLandData, cropCount: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sprinkle-green focus:border-sprinkle-green"
                    placeholder="Enter number of crops"
                    min="1"
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setShowAddLandModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddLand}
                    disabled={!newLandData.name || !newLandData.landSize || !newLandData.cropType || !newLandData.soilType || !newLandData.cropCount}
                    className="flex-1 px-6 py-3 bg-sprinkle-green hover:bg-green-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    Add Land
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;