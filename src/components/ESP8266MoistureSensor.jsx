import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Droplet, AlertTriangle, Gauge, Zap } from "lucide-react";

export default function ESP8266MoistureSensor() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://192.168.4.1/data"); // ESP8266 IP
        if (!response.ok) throw new Error("Failed to fetch ESP8266 data");
        const json = await response.json();
        setData(json);
        setError(null);
        setIsLoading(false);
      } catch (err) {
        setError("ESP8266 sensor not reachable. Please check connection.");
        setIsLoading(false);
        console.error("ESP8266 fetch error:", err);
      }
    };

    // Initial fetch
    fetchData();
    
    // Refresh every 3 seconds
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const getPinStatus = (status) => {
    const isWet = status?.toLowerCase() === 'wet';
    return {
      color: isWet ? 'text-blue-600 bg-blue-100' : 'text-orange-600 bg-orange-100',
      icon: isWet ? 'text-blue-500' : 'text-orange-500',
      text: isWet ? 'WET' : 'DRY'
    };
  };

  const getValveStatus = (status) => {
    const isOpen = status?.toLowerCase() === 'open';
    return {
      color: isOpen ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100',
      icon: isOpen ? 'text-green-500' : 'text-red-500',
      text: isOpen ? 'OPEN' : 'CLOSED'
    };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-sprinkle-green" />
            ESP8266 Sensor Status
          </h3>
          <div className="flex items-center justify-center py-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-8 w-8 border-b-2 border-sprinkle-green"
            />
            <span className="ml-3 text-gray-600">Loading sensor data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-sprinkle-green" />
            ESP8266 Sensor Status
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-700 font-medium">Connection Error</p>
            </div>
            <p className="text-red-600 text-sm mt-1">{error}</p>
            <p className="text-gray-600 text-xs mt-2">
              Make sure your ESP8266 is connected and accessible at 192.168.4.1
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Gauge className="w-5 h-5 mr-2 text-sprinkle-green" />
          3-Pin Moisture Status
        </h3>
        
        {/* Pin 1 - Deep 1 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplet className={`w-4 h-4 mr-2 ${getPinStatus(data?.deep1).icon}`} />
              <span className="text-sm font-medium">Pin 1 (Deep 1)</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPinStatus(data?.deep1).color}`}>
              {getPinStatus(data?.deep1).text}
            </span>
          </div>
          <p className="text-xs text-gray-600">Deep soil moisture sensor</p>
        </motion.div>

        {/* Pin 2 - Deep 2 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplet className={`w-4 h-4 mr-2 ${getPinStatus(data?.deep2).icon}`} />
              <span className="text-sm font-medium">Pin 2 (Deep 2)</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPinStatus(data?.deep2).color}`}>
              {getPinStatus(data?.deep2).text}
            </span>
          </div>
          <p className="text-xs text-gray-600">Mid-level soil moisture sensor</p>
        </motion.div>

        {/* Pin 3 - Deep 3 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplet className={`w-4 h-4 mr-2 ${getPinStatus(data?.deep3).icon}`} />
              <span className="text-sm font-medium">Pin 3 (Deep 3)</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPinStatus(data?.deep3).color}`}>
              {getPinStatus(data?.deep3).text}
            </span>
          </div>
          <p className="text-xs text-gray-600">Surface soil moisture sensor</p>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-purple-500" />
          System Control
        </h3>
        
        {/* Valve Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Zap className={`w-4 h-4 mr-2 ${getValveStatus(data?.valve).icon}`} />
              <span className="text-sm font-medium">Water Valve</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getValveStatus(data?.valve).color}`}>
              {getValveStatus(data?.valve).text}
            </span>
          </div>
          <p className="text-xs text-gray-600">Main irrigation valve control</p>
        </motion.div>

        {/* Connection Status */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            <span className="text-sm font-medium text-green-800">ESP8266 Connected</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Real-time data from 192.168.4.1 • Updates every 3 seconds
          </p>
        </div>
      </div>
    </div>
  );
}