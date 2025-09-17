import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Droplet, 
  AlertTriangle, 
  Wifi, 
  WifiOff, 
  Activity, 
  Gauge,
  RefreshCw,
  Terminal
} from "lucide-react";
import { useDevice } from '../contexts/DeviceContext';

export default function ESP8266SensorData() {
  const { connectionStatus, deviceUrl, lastError, discoverDevice } = useDevice();
  const [sensorData, setSensorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchSensorData = async () => {
      if (connectionStatus === 'connected' && deviceUrl) {
        try {
          // Use the backend proxy to avoid CORS issues
          const queryParam = deviceUrl ? `?deviceUrl=${encodeURIComponent(deviceUrl)}` : '';
          const response = await fetch(`/api/esp8266/data${queryParam}`);
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          
          const result = await response.json();
          
          if (result.success) {
            setSensorData(result.data);
            setLastUpdated(new Date());
            setFetchError(null);
          } else {
            throw new Error(result.message || 'Failed to fetch sensor data');
          }
          
          setIsLoading(false);
        } catch (err) {
          console.error("ESP8266 sensor data fetch error:", err);
          setFetchError(err.message);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    // Initial fetch when connected
    if (connectionStatus === 'connected') {
      fetchSensorData();
      // Set up interval for real-time updates every 2 seconds
      const interval = setInterval(fetchSensorData, 2000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
    }
  }, [connectionStatus, deviceUrl]);

  const getSensorStatus = (reading) => {
    if (reading === 'WET') {
      return { color: 'text-green-400', bg: 'bg-green-900', icon: '●', label: 'WET' };
    } else if (reading === 'DRY') {
      return { color: 'text-red-400', bg: 'bg-red-900', icon: '●', label: 'DRY' };
    }
    return { color: 'text-gray-400', bg: 'bg-gray-700', icon: '?', label: 'UNKNOWN' };
  };

  const getValveStatus = (reading) => {
    if (reading === 'OPEN') {
      return { color: 'text-blue-400', bg: 'bg-blue-900', icon: '○', label: 'OPEN' };
    } else if (reading === 'CLOSED') {
      return { color: 'text-gray-400', bg: 'bg-gray-700', icon: '●', label: 'CLOSED' };
    }
    return { color: 'text-yellow-400', bg: 'bg-yellow-900', icon: '?', label: 'UNKNOWN' };
  };

  if (connectionStatus === 'discovering') {
    return (
      <div className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono">
        <div className="flex items-center mb-4">
          <Terminal className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-bold">🌱 Soil Moisture Monitor</h3>
        </div>
        <div className="flex items-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full mr-3"
          />
          <span>Discovering ESP8266...</span>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="bg-gray-900 rounded-xl p-6 text-red-400 font-mono">
        <div className="flex items-center mb-4">
          <Terminal className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-bold">🌱 Soil Moisture Monitor</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <WifiOff className="w-4 h-4 mr-2" />
            <span>ERROR: ESP8266 offline</span>
          </div>
          <div className="text-gray-400 text-sm">
            {lastError && <div>└─ {lastError}</div>}
          </div>
          <button 
            onClick={discoverDevice}
            className="mt-3 px-4 py-2 bg-red-900 hover:bg-red-800 text-red-200 rounded text-sm transition-colors flex items-center"
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-xl p-6 text-green-400 font-mono shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Terminal className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-bold">🌱 Soil Moisture Monitor</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">LIVE</span>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mb-4 text-sm">
        <div className="flex items-center">
          <Wifi className="w-4 h-4 mr-2" />
          <span className="text-green-400">Connected to ESP8266</span>
          <span className="text-gray-500 ml-2">({deviceUrl})</span>
        </div>
        {lastUpdated && (
          <div className="text-gray-500 text-xs ml-6">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Sensor Data Display */}
      {isLoading && !sensorData ? (
        <div className="text-center py-8 text-gray-400">
          <div>Loading data...</div>
        </div>
      ) : fetchError && !sensorData ? (
        <div className="text-red-400 py-4">
          <div>Failed to fetch sensor data:</div>
          <div className="text-sm text-gray-500 ml-4">{fetchError}</div>
        </div>
      ) : sensorData ? (
        <div className="space-y-3">
          {/* Raw JSON Display */}
          <div className="bg-black rounded-lg p-4 border border-gray-700">
            <div className="text-gray-500 text-xs mb-2">ESP8266 Response (/data):</div>
            <pre className="text-green-300 text-sm whitespace-pre-wrap">
              {JSON.stringify(sensorData, null, 2)}
            </pre>
          </div>

          {/* Formatted Sensor Display */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Moisture Sensors */}
            <div className="bg-black rounded-lg p-4 border border-gray-700">
              <h4 className="text-yellow-400 font-bold mb-3 flex items-center">
                <Droplet className="w-4 h-4 mr-2" />
                MOISTURE SENSORS
              </h4>
              <div className="space-y-2">
                {['deep1', 'deep2', 'deep3'].map((sensor, index) => {
                  const status = getSensorStatus(sensorData[sensor]);
                  return (
                    <div key={sensor} className="flex items-center justify-between">
                      <span className="text-gray-400">Sensor {index + 1}:</span>
                      <div className={`px-3 py-1 rounded text-xs font-bold flex items-center ${status.color} ${status.bg}`}>
                        <span className="mr-2">{status.icon}</span>
                        {status.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Valve Status */}
            <div className="bg-black rounded-lg p-4 border border-gray-700">
              <h4 className="text-yellow-400 font-bold mb-3 flex items-center">
                <Gauge className="w-4 h-4 mr-2" />
                VALVE STATUS
              </h4>
              <div className="space-y-2">
                {(() => {
                  const status = getValveStatus(sensorData.valve);
                  return (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Water Valve:</span>
                      <div className={`px-3 py-1 rounded text-xs font-bold flex items-center ${status.color} ${status.bg}`}>
                        <span className="mr-2">{status.icon}</span>
                        {status.label}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-black rounded-lg p-4 border border-gray-700">
            <h4 className="text-yellow-400 font-bold mb-3 flex items-center">
              <Activity className="w-4 h-4 mr-2" />
              SYSTEM STATUS
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Update Interval:</span>
                <span className="text-green-400">2 seconds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Auto Watering:</span>
                <span className={sensorData.valve === 'OPEN' ? 'text-blue-400' : 'text-gray-400'}>
                  {sensorData.valve === 'OPEN' ? 'ACTIVE' : 'STANDBY'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Dry Sensors:</span>
                <span className="text-red-400">
                  {Object.values(sensorData).filter(v => v === 'DRY').length}/3
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <div>No sensor data available</div>
          <div className="text-sm mt-2">Make sure ESP8266 is connected and serving /data endpoint</div>
        </div>
      )}
    </motion.div>
  );
}