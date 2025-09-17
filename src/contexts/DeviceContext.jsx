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
      
      // Only set Content-Type header when actually sending JSON data
      // This avoids CORS preflights for simple GET requests
      const headers = {
        ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
        ...options.headers,
      };
      
      // Add Content-Type only if we're sending a JSON body
      if (options.body && typeof options.body === 'string') {
        headers['Content-Type'] = 'application/json';
      }
      
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Try to parse as JSON, but fall back to text if needed
      try {
        return await response.json();
      } catch (jsonError) {
        const text = await response.text();
        return { _rawText: text, _isPlainText: true };
      }
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
      // Just check if we can reach the device with any successful response
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const url = `${this.baseUrl}/status`;
      
      // Use minimal headers to avoid CORS preflight - no Content-Type needed for GET
      const headers = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }
      
      const response = await fetch(url, {
        headers,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      // Any successful response means device is online
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async getDeviceInfo() {
    const status = await this.fetch('/status');
    
    // Handle both JSON and plain text responses
    if (status._isPlainText) {
      return {
        deviceId: 'ESP8266-Servo',
        name: 'ESP8266 Servo Controller',
        ip: this.baseUrl.replace('http://', '').replace('https://', ''),
        wifi: 'Unknown',
        uptime: 'Unknown',
        rawResponse: status._rawText,
        availableSources: DEFAULT_WATER_SOURCES
      };
    }
    
    // Flexible field mapping for different ESP8266 response formats
    return {
      deviceId: status.deviceId || status.device_id || 'ESP8266-Servo',
      name: status.name || status.deviceName || 'ESP8266 Servo Controller',
      ip: status.ip || status.IP || status.address || this.baseUrl.replace('http://', '').replace('https://', ''),
      wifi: status.wifi || status.ssid || status.network || 'Connected',
      uptime: status.uptime || status.upTime || status.runtime || 0,
      availableSources: DEFAULT_WATER_SOURCES
    };
  }

  async getState() {
    const status = await this.fetch('/status');
    
    // Handle both JSON and plain text responses
    if (status._isPlainText) {
      // Try to extract angle from plain text if possible
      const angleMatch = status._rawText.match(/angle[:\s]*(\d+)/i);
      const currentAngle = angleMatch ? parseInt(angleMatch[1]) : 0;
      const currentSource = this.findSourceByAngle(currentAngle);
      
      return {
        currentSource: currentSource?.id || null,
        currentAngle: currentAngle,
        status: 'connected'
      };
    }
    
    // Flexible field mapping for different ESP8266 response formats
    const currentAngle = status.currentAngle || status.current_angle || status.angle || status.position || 0;
    const currentSource = this.findSourceByAngle(currentAngle);
    
    return {
      currentSource: currentSource?.id || null,
      currentAngle: currentAngle,
      status: status.status || status.state || 'connected'
    };
  }

  async setWaterSource(sourceId) {
    const source = DEFAULT_WATER_SOURCES.find(s => s.id === sourceId);
    if (!source) {
      throw new Error(`Unknown water source: ${sourceId}`);
    }
    
    const result = await this.fetch(`/rotate?angle=${source.servoPosition}`);
    
    // Handle both JSON and plain text responses
    if (result._isPlainText) {
      // For plain text responses, assume success if we got a response
      return {
        success: true,
        angle: source.servoPosition,
        sourceId: sourceId,
        message: result._rawText || `Moved to ${source.name}`
      };
    }
    
    return {
      success: result.success !== false, // Default to true unless explicitly false
      angle: result.angle || result.position || source.servoPosition,
      sourceId: sourceId,
      message: result.message || result.msg || `Moved to ${source.name}`
    };
  }

  async calibrateServo() {
    // Calibrate by moving through all positions
    const results = [];
    for (const source of DEFAULT_WATER_SOURCES) {
      try {
        const result = await this.fetch(`/rotate?angle=${source.servoPosition}`);
        results.push({ position: source.servoPosition, success: result.success });
        // Small delay between movements
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        results.push({ position: source.servoPosition, success: false, error: error.message });
      }
    }
    return { success: true, calibrationResults: results };
  }
  
  // Helper method to find water source by angle with tolerance
  findSourceByAngle(angle) {
    const tolerance = 10; // Allow 10-degree tolerance
    return DEFAULT_WATER_SOURCES.find(source => 
      Math.abs(source.servoPosition - angle) <= tolerance
    );
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