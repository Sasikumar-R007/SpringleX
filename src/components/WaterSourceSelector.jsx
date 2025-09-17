import React from "react";
import { motion } from "framer-motion";
import { Droplet, RotateCw, Wifi, AlertTriangle } from "lucide-react";
import { useDevice } from '../contexts/DeviceContext';

const WaterSourceSelector = () => {
  const { 
    connectionStatus, 
    waterSources, 
    currentWaterSource, 
    isChangingSource, 
    changeWaterSource,
    discoverDevice,
    lastError 
  } = useDevice();

  const handleSourceChange = async (sourceId) => {
    const success = await changeWaterSource(sourceId);
    if (success) {
      console.log(`Water source changed to: ${sourceId}`);
    }
  };

  const getStatusDisplay = () => {
    if (connectionStatus === 'connected') {
      return {
        text: 'ESP8266 Connected',
        color: 'text-green-600',
        icon: <Wifi className="w-4 h-4" />
      };
    } else if (connectionStatus === 'discovering') {
      return {
        text: 'Discovering ESP8266...',
        color: 'text-yellow-600',
        icon: <RotateCw className="w-4 h-4 animate-spin" />
      };
    } else {
      return {
        text: 'ESP8266 Offline',
        color: 'text-red-600',
        icon: <AlertTriangle className="w-4 h-4" />
      };
    }
  };

  const status = getStatusDisplay();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Source Selector</h2>
        <div className={`flex items-center justify-center space-x-2 ${status.color}`}>
          {status.icon}
          <span className="text-sm font-medium">{status.text}</span>
        </div>
        {lastError && (
          <p className="text-red-600 text-sm mt-2">{lastError}</p>
        )}
      </div>

      {connectionStatus === 'error' && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 font-medium">ESP8266 offline - Check device connection</p>
            </div>
            <button 
              onClick={discoverDevice}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1 border border-blue-300 rounded hover:bg-blue-50"
            >
              🔍 Retry Connection
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {waterSources.map((source, index) => {
          const isActive = currentWaterSource === source.id;
          const isDisabled = connectionStatus !== 'connected' || isChangingSource;
          
          return (
            <motion.button
              key={source.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => handleSourceChange(source.id)}
              disabled={isDisabled}
              className={`
                relative p-6 rounded-xl border-2 transition-all duration-200
                ${isActive 
                  ? 'border-sprinkle-green bg-green-50 text-green-800' 
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }
                ${isDisabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:shadow-lg cursor-pointer'
                }
              `}
            >
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
              )}
              
              <div className="flex items-center mb-3">
                <Droplet className={`w-5 h-5 mr-2 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                <span className="font-semibold">{source.name}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{source.description}</p>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Servo Position:</span>
                <span className={`font-mono font-bold ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
                  {source.servoPosition}°
                </span>
              </div>
              
              {isChangingSource && currentWaterSource === source.id && (
                <div className="absolute inset-0 bg-white bg-opacity-75 rounded-xl flex items-center justify-center">
                  <RotateCw className="w-6 h-6 text-sprinkle-green animate-spin" />
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {connectionStatus === 'connected' && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Current position: <span className="font-mono font-bold text-sprinkle-green">
              {waterSources.find(s => s.id === currentWaterSource)?.servoPosition || 0}°
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default WaterSourceSelector;