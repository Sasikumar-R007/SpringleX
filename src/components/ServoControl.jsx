import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Wifi, WifiOff, CheckCircle, XCircle, Clock } from 'lucide-react';

function ServoControl() {
  const [status, setStatus] = useState('idle'); // idle, connecting, success, error, direct
  const [message, setMessage] = useState('');
  const [lastToggled, setLastToggled] = useState(null);

  const updateStatus = (newStatus, newMessage) => {
    setStatus(newStatus);
    setMessage(newMessage);
    
    if (newStatus === 'success' || newStatus === 'error') {
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  const toggleServo = async () => {
    setStatus('connecting');
    setMessage('Connecting to ESP8266...');
    
    try {
      const response = await fetch("/api/esp8266/toggle");
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.log("Proxy unavailable, trying direct ESP8266 connection...");
        return directToggle();
      }
      
      if (response.ok && data.success) {
        console.log("ESP Response:", data.espResponse);
        updateStatus('success', 'Servo toggled successfully!');
        setLastToggled(new Date().toLocaleTimeString());
      } else {
        console.error("ESP Error:", data.error || 'Unknown error');
        updateStatus('error', data.message || 'ESP8266 connection failed');
      }
    } catch (error) {
      console.log("Backend proxy unreachable, switching to direct mode...");
      return directToggle();
    }
  };

  const directToggle = () => {
    const espUrl = "http://192.168.4.1/toggle";
    updateStatus('direct', 'Opening ESP8266 directly. Ensure ESP8266-Lane WiFi connection.');
    
    const newWindow = window.open(espUrl, '_blank');
    
    if (!newWindow) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(espUrl);
        updateStatus('direct', 'Link copied to clipboard. Connect to ESP8266-Lane WiFi first.');
      } else {
        updateStatus('direct', 'Direct link: http://192.168.4.1/toggle');
      }
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connecting':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'direct':
        return <WifiOff className="w-5 h-5 text-orange-500" />;
      default:
        return <Wifi className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connecting':
        return 'border-blue-200 bg-blue-50';
      case 'success':
        return 'border-green-200 bg-green-50';
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'direct':
        return 'border-orange-200 bg-orange-50';
      default:
        return 'border-gray-200 bg-white';
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">ESP8266 Servo Control</h3>
        {getStatusIcon()}
      </div>
      
      <div className="space-y-4">
        {/* Status Card */}
        <motion.div
          animate={{ scale: status === 'connecting' ? [1, 1.02, 1] : 1 }}
          transition={{ duration: 0.5, repeat: status === 'connecting' ? Infinity : 0 }}
          className={`p-4 rounded-lg border ${getStatusColor()} transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {status === 'idle' ? 'Ready to control servo' : message}
            </span>
            {lastToggled && status === 'idle' && (
              <span className="text-xs text-gray-500">
                Last: {lastToggled}
              </span>
            )}
          </div>
        </motion.div>

        {/* Control Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleServo}
          disabled={status === 'connecting'}
          className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        >
          <Zap className="w-5 h-5 mr-2" />
          {status === 'connecting' ? 'Connecting...' : 'Toggle Servo'}
        </motion.button>

        {/* Connection Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Network:</span>
            <span className="font-medium">ESP8266-Lane</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Target:</span>
            <span className="font-medium">192.168.4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServoControl;