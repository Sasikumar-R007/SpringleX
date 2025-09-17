import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const DeviceContext = createContext();

export const useDevice = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within a DeviceProvider');
  }
  return context;
};

// Available water sources configuration
const DEFAULT_WATER_SOURCES = [
  { id: 'borewell', name: 'Bore Well', servoPosition: 0, description: 'Ground water from bore well' },
  { id: 'rainwater', name: 'Rain Water Harvesting', servoPosition: 90, description: 'Collected rainwater' },
  { id: 'canal', name: 'Canal Water', servoPosition: 180, description: 'Water from irrigation canal' }
];

// Device communication utility
class DeviceClient {
  constructor(baseUrl, token) {
    this.baseUrl = baseUrl;
    this.token = token;
    this.timeout = 3000; // 3 second timeout
  }

  async fetch(endpoint, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Device request timed out');
      }
      throw error;
    }
  }

  async ping() {
    try {
      const result = await this.fetch('/.well-known/sprinklex');
      return result.deviceId ? true : false;
    } catch (error) {
      return false;
    }
  }

  async getDeviceInfo() {
    return await this.fetch('/device-info');
  }

  async getState() {
    return await this.fetch('/state');
  }

  async setWaterSource(sourceId) {
    return await this.fetch('/source', {
      method: 'POST',
      body: JSON.stringify({ sourceId }),
    });
  }

  async calibrateServo() {
    return await this.fetch('/servo/calibrate', {
      method: 'POST',
    });
  }
}

export const DeviceProvider = ({ children }) => {
  const [deviceUrl, setDeviceUrl] = useState(() => 
    localStorage.getItem('sprinkleX_deviceUrl') || null
  );
  const [deviceToken, setDeviceToken] = useState(() => 
    localStorage.getItem('sprinkleX_deviceToken') || null
  );
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('unknown'); // unknown, discovering, connected, error
  const [currentWaterSource, setCurrentWaterSource] = useState(null);
  const [waterSources, setWaterSources] = useState(DEFAULT_WATER_SOURCES);
  const [isChangingSource, setIsChangingSource] = useState(false);
  const [lastError, setLastError] = useState(null);

  // Create device client when URL/token changes
  const deviceClient = deviceUrl ? new DeviceClient(deviceUrl, deviceToken) : null;

  // Device discovery sequence
  const discoverDevice = useCallback(async () => {
    setConnectionStatus('discovering');
    setLastError(null);

    const discoveryUrls = [
      deviceUrl, // Try cached URL first
      'http://192.168.4.1', // ESP8266 AP mode default
      'http://sprinklex.local', // mDNS hostname
    ].filter(Boolean);

    for (const url of discoveryUrls) {
      try {
        const client = new DeviceClient(url, deviceToken);
        const isOnline = await client.ping();
        
        if (isOnline) {
          setDeviceUrl(url);
          localStorage.setItem('sprinkleX_deviceUrl', url);
          
          const info = await client.getDeviceInfo();
          setDeviceInfo(info);
          setWaterSources(info.availableSources || DEFAULT_WATER_SOURCES);
          
          const state = await client.getState();
          setCurrentWaterSource(state.currentSource);
          
          setConnectionStatus('connected');
          return true;
        }
      } catch (error) {
        console.log(`Discovery failed for ${url}:`, error.message);
      }
    }

    setConnectionStatus('error');
    setLastError('Device not found. Make sure ESP8266 is powered on and connected to WiFi.');
    return false;
  }, [deviceUrl, deviceToken]);

  // Change water source
  const changeWaterSource = useCallback(async (sourceId) => {
    if (!deviceClient || !sourceId) return false;

    setIsChangingSource(true);
    setLastError(null);

    try {
      const result = await deviceClient.setWaterSource(sourceId);
      
      if (result.success) {
        setCurrentWaterSource(sourceId);
        
        // Add success notification
        const successMessage = waterSources.find(s => s.id === sourceId)?.name || sourceId;
        console.log(`Water source changed to: ${successMessage}`);
        
        return true;
      } else {
        throw new Error(result.error || 'Failed to change water source');
      }
    } catch (error) {
      setLastError(`Failed to change water source: ${error.message}`);
      return false;
    } finally {
      setIsChangingSource(false);
    }
  }, [deviceClient, waterSources]);

  // Refresh device state
  const refreshDeviceState = useCallback(async () => {
    if (!deviceClient) return false;

    try {
      const state = await deviceClient.getState();
      setCurrentWaterSource(state.currentSource);
      setConnectionStatus('connected');
      setLastError(null);
      return true;
    } catch (error) {
      setConnectionStatus('error');
      setLastError(`Failed to refresh device state: ${error.message}`);
      return false;
    }
  }, [deviceClient]);

  // Auto-discovery and connection monitoring (only on HTTP sites)
  useEffect(() => {
    if (connectionStatus === 'unknown' && window.location.protocol === 'http:') {
      discoverDevice();
    }
  }, [connectionStatus, discoverDevice]);

  // Periodic state refresh when connected
  useEffect(() => {
    if (connectionStatus === 'connected') {
      const interval = setInterval(refreshDeviceState, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [connectionStatus, refreshDeviceState]);

  const value = {
    // Device connection
    deviceUrl,
    deviceInfo,
    connectionStatus,
    lastError,
    
    // Water sources
    waterSources,
    currentWaterSource,
    isChangingSource,
    
    // Actions
    discoverDevice,
    changeWaterSource,
    refreshDeviceState,
    
    // Device info
    isConnected: connectionStatus === 'connected',
    isDiscovering: connectionStatus === 'discovering',
    hasError: connectionStatus === 'error',
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};