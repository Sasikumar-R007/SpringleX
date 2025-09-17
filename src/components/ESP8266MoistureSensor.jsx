import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Droplet, AlertTriangle, Gauge, Zap, Wifi, RotateCw } from "lucide-react";
import { useDevice } from '../contexts/DeviceContext';

export default function ESP8266MoistureSensor() {
  const { connectionStatus, deviceInfo, currentWaterSource, waterSources, lastError, discoverDevice, deviceUrl } = useDevice();
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeviceStatus = async () => {
      if (connectionStatus === 'connected' && deviceUrl) {
        try {
          const response = await fetch(`${deviceUrl}/status`);
          if (!response.ok) throw new Error("Failed to fetch ESP8266 status");
          
          // Handle both JSON and text responses
          let json;
          try {
            json = await response.json();
          } catch (jsonError) {
            // If not JSON, create a basic status object
            const text = await response.text();
            json = { status: 'connected', rawResponse: text };
          }
          
          setDeviceStatus(json);
          setIsLoading(false);
        } catch (err) {
          console.error("ESP8266 status fetch error:", err);
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    // Fetch status when connected
    if (connectionStatus === 'connected') {
      fetchDeviceStatus();
      const interval = setInterval(fetchDeviceStatus, 5000);
      return () => clearInterval(interval);
    } else {
      setIsLoading(false);
    }
  }, [connectionStatus]);

  const getConnectionStatus = () => {
    if (connectionStatus === 'connected') {
      return {
        color: 'text-green-600 bg-green-100',
        icon: 'text-green-500',
        text: 'CONNECTED',
        bgColor: 'bg-green-50'
      };
    } else if (connectionStatus === 'discovering') {
      return {
        color: 'text-yellow-600 bg-yellow-100',
        icon: 'text-yellow-500',
        text: 'DISCOVERING',
        bgColor: 'bg-yellow-50'
      };
    } else {
      return {
        color: 'text-red-600 bg-red-100',
        icon: 'text-red-500',
        text: 'OFFLINE',
        bgColor: 'bg-red-50'
      };
    }
  };

  const getCurrentSourceInfo = () => {
    return waterSources.find(source => source.id === currentWaterSource) || 
           { name: 'Unknown', servoPosition: deviceStatus?.currentAngle || 0 };
  };

  if (isLoading && connectionStatus === 'discovering') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-sprinkle-green" />
            ESP8266 Servo Control
          </h3>
          <div className="flex items-center justify-center py-8">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="rounded-full h-8 w-8 border-b-2 border-sprinkle-green"
            />
            <span className="ml-3 text-gray-600">Discovering ESP8266...</span>
          </div>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    const isHttpsBlocked = window.location.protocol === 'https:' && lastError?.includes('mixed content');
    const httpUrl = window.location.href.replace('https://', 'http://');

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-sprinkle-green" />
            ESP8266 Servo Control
          </h3>
          
          {/* Main error alert */}
          <div className={`border rounded-lg p-4 ${isHttpsBlocked ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <AlertTriangle className={`w-5 h-5 mr-2 ${isHttpsBlocked ? 'text-orange-500' : 'text-red-500'}`} />
                <p className={`font-medium ${isHttpsBlocked ? 'text-orange-700' : 'text-red-700'}`}>
                  {isHttpsBlocked ? '🔒 HTTPS Blocks ESP8266 Control' : 'ESP8266 offline - Check device connection'}
                </p>
              </div>
              <span className={`w-2 h-2 rounded-full ${isHttpsBlocked ? 'bg-orange-500' : 'bg-red-500'}`} />
            </div>
            <p className={`text-sm mt-1 ${isHttpsBlocked ? 'text-orange-600' : 'text-red-600'}`}>{lastError}</p>
            
            {!isHttpsBlocked && (
              <div className="mt-3 flex items-center justify-between">
                <p className="text-gray-600 text-xs">
                  Check ESP8266 power and WiFi connection
                </p>
                <button 
                  onClick={discoverDevice}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  🔍 Retry Connection
                </button>
              </div>
            )}
          </div>

          {/* HTTPS Solution - More Prominent */}
          {isHttpsBlocked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">⚡</span>
                </div>
                <div>
                  <h4 className="text-blue-800 font-semibold text-sm">Quick Fix Required</h4>
                  <p className="text-blue-600 text-xs">Use HTTP version for ESP8266 control</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <p className="text-blue-700 text-xs font-medium mb-2">📋 Copy this HTTP URL:</p>
                  <div className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                    <code className="text-xs text-gray-800 font-mono select-all">{httpUrl}</code>
                    <button 
                      onClick={() => navigator.clipboard?.writeText(httpUrl)}
                      className="text-blue-600 hover:text-blue-800 text-xs ml-2"
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.open(httpUrl, '_blank')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    🚀 Open HTTP Version
                  </button>
                  <button 
                    onClick={() => window.location.href = httpUrl}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-medium py-2 px-3 rounded-lg transition-colors"
                  >
                    🔄 Switch to HTTP
                  </button>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-blue-600 text-xs">
                  <strong>Why this happens:</strong> HTTPS sites cannot connect to HTTP devices (mixed content security policy).
                  ESP8266 controllers typically use HTTP for local communication.
                </p>
              </div>
            </motion.div>
          )}

          {/* General HTTPS Warning for non-blocked cases */}
          {!isHttpsBlocked && window.location.protocol === 'https:' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mr-2">
                  <span className="text-amber-600 text-xs">⚠️</span>
                </div>
                <div>
                  <p className="text-amber-800 text-xs font-medium">HTTPS Limitation</p>
                  <p className="text-amber-600 text-xs">ESP8266 control requires HTTP. Switch to HTTP version if needed.</p>
                </div>
              </div>
              <button 
                onClick={() => window.open(httpUrl, '_blank')}
                className="mt-2 text-amber-700 hover:text-amber-800 text-xs underline"
              >
                Open HTTP version
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const statusInfo = getConnectionStatus();
  const currentSource = getCurrentSourceInfo();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Gauge className="w-5 h-5 mr-2 text-sprinkle-green" />
          ESP8266 Servo Control
        </h3>
        
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`${statusInfo.bgColor} rounded-lg p-4 border border-gray-200`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Wifi className={`w-4 h-4 mr-2 ${statusInfo.icon}`} />
              <span className="text-sm font-medium">Connection Status</span>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {deviceInfo ? `Connected to ${deviceInfo.wifi} at ${deviceInfo.ip}` : 'Searching for ESP8266...'}
          </p>
        </motion.div>

        {/* Current Water Source */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Droplet className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-sm font-medium">Active Water Source</span>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-bold text-blue-600 bg-blue-100">
              {currentSource.name.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-gray-600">{currentSource.description || 'Selected water source'}</p>
        </motion.div>

        {/* Servo Position */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-purple-50 rounded-lg p-4 border border-purple-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <RotateCw className="w-4 h-4 mr-2 text-purple-500" />
              <span className="text-sm font-medium">Servo Position</span>
            </div>
            <span className="px-2 py-1 rounded-full text-xs font-bold text-purple-600 bg-purple-100">
              {deviceStatus?.currentAngle || currentSource.servoPosition}°
            </span>
          </div>
          <p className="text-xs text-gray-600">Current servo angle position</p>
        </motion.div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-orange-500" />
          Device Information
        </h3>
        
        {/* Device Info */}
        {deviceInfo && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Device ID:</span>
                <span className="text-xs font-mono">{deviceInfo.deviceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">IP Address:</span>
                <span className="text-xs font-mono">{deviceInfo.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">WiFi Network:</span>
                <span className="text-xs">{deviceInfo.wifi}</span>
              </div>
              {deviceStatus && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Uptime:</span>
                  <span className="text-xs">
                    {deviceStatus.uptime ? `${Math.floor(deviceStatus.uptime / 1000)}s` : 'Connected'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Real-time Status */}
        {connectionStatus === 'connected' && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-sm font-medium text-green-800">ESP8266 Connected</span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Real-time status from {deviceInfo?.ip} • Updates every 5 seconds
            </p>
          </div>
        )}
      </div>
    </div>
  );
}