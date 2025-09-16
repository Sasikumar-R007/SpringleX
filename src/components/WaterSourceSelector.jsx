import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDevice } from '../contexts/DeviceContext';
import { 
  Droplet, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Settings, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Waves
} from 'lucide-react';

const WaterSourceSelector = () => {
  const {
    waterSources,
    currentWaterSource,
    connectionStatus,
    lastError,
    isChangingSource,
    isConnected,
    isDiscovering,
    hasError,
    discoverDevice,
    changeWaterSource,
    refreshDeviceState,
  } = useDevice();

  const [showSettings, setShowSettings] = useState(false);

  // Get current source details
  const currentSource = waterSources.find(source => source.id === currentWaterSource);

  // Handle source change
  const handleSourceChange = async (sourceId) => {
    const success = await changeWaterSource(sourceId);
    if (success) {
      // Could add a toast notification here
      console.log('Water source changed successfully');
    }
  };

  // Connection status indicator
  const getConnectionIcon = () => {
    if (isDiscovering) return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />;
    if (isConnected) return <Wifi className="w-4 h-4 text-green-500" />;
    if (hasError) return <WifiOff className="w-4 h-4 text-red-500" />;
    return <WifiOff className="w-4 h-4 text-gray-400" />;
  };

  const getConnectionStatus = () => {
    if (isDiscovering) return 'Discovering device...';
    if (isConnected) return 'ESP8266 Connected';
    if (hasError) return 'Device Offline';
    return 'Not Connected';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Waves className="w-6 h-6 text-sprinkle-green mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Water Source</h3>
            <div className="flex items-center text-sm text-gray-600">
              {getConnectionIcon()}
              <span className="ml-2">{getConnectionStatus()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Error Display */}
      {lastError && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div className="flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-sm text-red-700">{lastError}</span>
          </div>
        </motion.div>
      )}

      {/* Current Source Display */}
      {currentSource && isConnected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium text-blue-900">{currentSource.name}</p>
                <p className="text-sm text-blue-600">{currentSource.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-600">Servo Position</p>
              <p className="font-mono text-blue-800">{currentSource.servoPosition}°</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Water Source Selection */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Select Water Source:</h4>
        
        {waterSources.map((source) => (
          <motion.button
            key={source.id}
            onClick={() => handleSourceChange(source.id)}
            disabled={!isConnected || isChangingSource}
            whileHover={isConnected ? { scale: 1.02 } : {}}
            whileTap={isConnected ? { scale: 0.98 } : {}}
            className={`
              w-full p-4 border-2 rounded-lg text-left transition-all relative overflow-hidden
              ${currentWaterSource === source.id 
                ? 'border-sprinkle-green bg-green-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
              ${!isConnected 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:shadow-sm'
              }
              ${isChangingSource && currentWaterSource !== source.id 
                ? 'opacity-50' 
                : ''
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Droplet className={`
                  w-5 h-5 mr-3
                  ${currentWaterSource === source.id 
                    ? 'text-sprinkle-green' 
                    : 'text-gray-400'
                  }
                `} />
                <div>
                  <p className={`font-medium ${
                    currentWaterSource === source.id 
                      ? 'text-green-900' 
                      : 'text-gray-900'
                  }`}>
                    {source.name}
                  </p>
                  <p className={`text-sm ${
                    currentWaterSource === source.id 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                  }`}>
                    {source.description}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-gray-500">
                  {source.servoPosition}°
                </span>
                
                {/* Status indicators */}
                {isChangingSource && currentWaterSource === source.id && (
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                )}
                {currentWaterSource === source.id && !isChangingSource && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
              </div>
            </div>
            
            {/* Loading overlay */}
            <AnimatePresence>
              {isChangingSource && currentWaterSource === source.id && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center"
                >
                  <div className="flex items-center text-blue-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">Switching...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-4 border-t border-gray-200 space-y-3"
          >
            <div className="flex flex-wrap gap-2">
              <button
                onClick={discoverDevice}
                disabled={isDiscovering}
                className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isDiscovering ? 'animate-spin' : ''}`} />
                {isDiscovering ? 'Discovering...' : 'Find Device'}
              </button>
              
              {isConnected && (
                <button
                  onClick={refreshDeviceState}
                  className="flex items-center px-3 py-2 text-sm bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh State
                </button>
              )}
            </div>
            
            {/* Device Connection Instructions */}
            {hasError && (
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium text-gray-800 mb-2">Connection Instructions:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  <li>Ensure ESP8266 is powered on</li>
                  <li>Connect to "ESP8266-Network" WiFi (password: 12345678)</li>
                  <li>Or ensure both devices are on the same network</li>
                  <li>Click "Find Device" to retry connection</li>
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WaterSourceSelector;