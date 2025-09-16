import { createContext, useContext, useState, useEffect } from 'react';

const FarmContext = createContext();

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};

export const FarmProvider = ({ children }) => {
  const [farmData, setFarmData] = useState(null);
  const [sprinklers, setSprinklers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load farm data from localStorage
    const storedFarmData = localStorage.getItem('sprinkleX_farmData');
    if (storedFarmData) {
      const data = JSON.parse(storedFarmData);
      setFarmData(data);
      generateSprinklers(data);
    }

    // Generate initial alerts
    const initialAlerts = [
      { id: 1, message: 'Sprinkler 2 watered at 10:15 AM', time: '10:15 AM', type: 'info' },
      { id: 2, message: 'Sprinkler 1 moisture level critical', time: '9:45 AM', type: 'warning' },
      { id: 3, message: 'System check completed', time: '9:00 AM', type: 'success' },
    ];
    setAlerts(initialAlerts);

    // Simulate new alerts every 30 seconds
    const alertInterval = setInterval(() => {
      addRandomAlert();
    }, 30000);

    return () => clearInterval(alertInterval);
  }, []);

  const saveFarmData = (data) => {
    localStorage.setItem('sprinkleX_farmData', JSON.stringify(data));
    setFarmData(data);
    generateSprinklers(data);
  };

  const generateSprinklers = (farmData) => {
    if (!farmData) return;

    const sprinklerCount = Math.min(4, Math.max(2, Math.ceil(farmData.landSize / 5)));
    const newSprinklers = Array.from({ length: sprinklerCount }, (_, index) => {
      const currentMoisture = Math.floor(Math.random() * 100);
      const now = new Date();
      const lastWatered = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000); // Random time in last 24 hours
      
      return {
        id: index + 1,
        name: `Sprinkler ${index + 1}`,
        moisture: currentMoisture,
        requiredMoisture: 65 + Math.floor(Math.random() * 20), // 65-85%
        status: getStatus(currentMoisture),
        isActive: Math.random() > 0.5,
        cropType: farmData.cropType,
        lastWatered: lastWatered.toISOString(),
        waterFlowRate: (2.5 + Math.random() * 2.5).toFixed(1), // 2.5-5.0 L/min
        soilTemperature: (20 + Math.random() * 15).toFixed(1), // 20-35°C
        soilPH: (6.0 + Math.random() * 2.0).toFixed(1), // 6.0-8.0 pH
        nutrientLevel: Math.floor(Math.random() * 100), // 0-100%
        systemPressure: (1.5 + Math.random() * 1.0).toFixed(1), // 1.5-2.5 bar
        coverage: `${Math.floor(Math.random() * 20) + 10} sq.m`, // 10-30 sq.m
        waterUsedToday: (Math.random() * 50 + 20).toFixed(1), // 20-70 liters
        nextScheduled: getNextScheduledTime(),
        deviceId: `SPX-${String(index + 1).padStart(3, '0')}`
      };
    });

    setSprinklers(newSprinklers);
  };

  const getStatus = (moisture) => {
    if (moisture >= 70) return 'good';
    if (moisture >= 40) return 'dry';
    return 'critical';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'bg-green-500';
      case 'dry': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const toggleSprinkler = (sprinklerId) => {
    setSprinklers(prevSprinklers => 
      prevSprinklers.map(sprinkler => 
        sprinkler.id === sprinklerId 
          ? { ...sprinkler, isActive: !sprinkler.isActive, lastWatered: sprinkler.isActive ? sprinkler.lastWatered : new Date().toISOString() }
          : sprinkler
      )
    );

    // Add alert when sprinkler is toggled
    const sprinkler = sprinklers.find(s => s.id === sprinklerId);
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    addAlert({
      id: Date.now(),
      message: `Sprinkler ${sprinklerId} ${!sprinkler?.isActive ? 'started sprinkling' : 'stopped sprinkling'}`,
      time: timeString,
      type: 'info'
    });
  };

  const addAlert = (alert) => {
    setAlerts(prevAlerts => [alert, ...prevAlerts.slice(0, 9)]);
  };

  const addRandomAlert = () => {
    const messages = [
      'Moisture sensor reading updated',
      'Weekly system maintenance completed', 
      'Weather forecast: Light rain expected',
      'Soil temperature optimal for growth',
      'Irrigation schedule optimized'
    ];

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const randomAlert = {
      id: Date.now(),
      message: messages[Math.floor(Math.random() * messages.length)],
      time: timeString,
      type: Math.random() > 0.7 ? 'warning' : 'info'
    };

    addAlert(randomAlert);
  };

  const updateMoistureLevels = () => {
    setSprinklers(prevSprinklers => 
      prevSprinklers.map(sprinkler => {
        const newMoisture = Math.max(0, Math.min(100, 
          sprinkler.moisture + (Math.random() - 0.5) * 10
        ));
        return {
          ...sprinkler,
          moisture: Math.floor(newMoisture),
          status: getStatus(Math.floor(newMoisture)),
          soilTemperature: (20 + Math.random() * 15).toFixed(1),
          systemPressure: (1.5 + Math.random() * 1.0).toFixed(1)
        };
      })
    );
  };

  // Helper function for next scheduled time
  const getNextScheduledTime = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(next.getHours() + Math.floor(Math.random() * 12) + 1); // 1-12 hours from now
    return next.toISOString();
  };

  const value = {
    farmData,
    sprinklers,
    alerts,
    saveFarmData,
    toggleSprinkler,
    getStatusColor,
    updateMoistureLevels,
    addAlert
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};