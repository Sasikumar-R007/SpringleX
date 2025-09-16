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
  const [lands, setLands] = useState([]);
  const [sprinklers, setSprinklers] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load farm data and lands independently
    const storedFarmData = localStorage.getItem('sprinkleX_farmData');
    const storedLands = localStorage.getItem('sprinkleX_lands');
    
    // Load farm data
    if (storedFarmData) {
      const data = JSON.parse(storedFarmData);
      setFarmData(data);
    }
    
    // Load lands independently - if they exist, use them
    if (storedLands) {
      const landsData = JSON.parse(storedLands);
      setLands(landsData);
      generateSprinklersForLands(landsData);
    } else if (storedFarmData) {
      // Create first land from existing farm data for backward compatibility only if no lands exist
      const data = JSON.parse(storedFarmData);
      const firstLand = {
        id: 1,
        name: 'Main Land',
        landSize: data.landSize,
        landUnit: data.landUnit,
        cropType: data.cropType,
        soilType: data.soilType,
        cropCount: data.cropCount,
        setupDate: data.setupDate || new Date().toISOString()
      };
      setLands([firstLand]);
      localStorage.setItem('sprinkleX_lands', JSON.stringify([firstLand]));
      generateSprinklersForLands([firstLand]);
    }

    // Generate initial alerts with more realistic types
    const initialAlerts = [
      { id: 1, message: 'Sprinkler fault detected in Main Land', time: '10:15 AM', type: 'warning' },
      { id: 2, message: 'Solar panel dust accumulation alert', time: '9:45 AM', type: 'warning' },
      { id: 3, message: 'System health check completed', time: '9:00 AM', type: 'success' },
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
    
    // Only create first land if no lands exist, otherwise preserve existing lands
    if (lands.length === 0) {
      const firstLand = {
        id: 1,
        name: 'Main Land',
        landSize: data.landSize,
        landUnit: data.landUnit,
        cropType: data.cropType,
        soilType: data.soilType,
        cropCount: data.cropCount,
        setupDate: data.setupDate || new Date().toISOString()
      };
      const newLands = [firstLand];
      setLands(newLands);
      localStorage.setItem('sprinkleX_lands', JSON.stringify(newLands));
      generateSprinklersForLands(newLands);
    }
    // If lands exist, don't overwrite them - keep existing lands intact
  };

  const addLand = (landData) => {
    const newLand = {
      ...landData,
      id: Date.now(), // Use timestamp as unique ID
      setupDate: new Date().toISOString()
    };
    
    const updatedLands = [...lands, newLand];
    setLands(updatedLands);
    localStorage.setItem('sprinkleX_lands', JSON.stringify(updatedLands));
    generateSprinklersForLands(updatedLands);
    
    return newLand;
  };

  const generateSprinklersForLands = (landsData) => {
    if (!landsData || landsData.length === 0) return;

    let sprinklerCounter = 1;
    const allSprinklers = [];

    landsData.forEach((land) => {
      const sprinklerCount = Math.min(6, Math.max(2, Math.ceil(land.landSize / 5)));
      
      for (let i = 0; i < sprinklerCount; i++) {
        const currentMoisture = Math.floor(Math.random() * 100);
        const now = new Date();
        const lastWatered = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
        
        allSprinklers.push({
          id: sprinklerCounter++,
          name: `Sprinkler ${sprinklerCounter - 1}`,
          landId: land.id,
          landName: land.name,
          moisture: currentMoisture,
          requiredMoisture: 65 + Math.floor(Math.random() * 20), // 65-85%
          status: getStatus(currentMoisture),
          isActive: Math.random() > 0.5,
          cropType: land.cropType,
          lastWatered: lastWatered.toISOString(),
          waterFlowRate: (2.5 + Math.random() * 2.5).toFixed(1), // 2.5-5.0 L/min
          soilTemperature: (20 + Math.random() * 15).toFixed(1), // 20-35°C
          soilPH: (6.0 + Math.random() * 2.0).toFixed(1), // 6.0-8.0 pH
          nutrientLevel: Math.floor(Math.random() * 100), // 0-100%
          systemPressure: (1.5 + Math.random() * 1.0).toFixed(1), // 1.5-2.5 bar
          coverage: `${Math.floor(Math.random() * 20) + 10} sq.m`, // 10-30 sq.m
          waterUsedToday: (Math.random() * 50 + 20).toFixed(1), // 20-70 liters
          nextScheduled: getNextScheduledTime(),
          deviceId: `SPX-${String(sprinklerCounter - 1).padStart(3, '0')}`
        });
      }
    });

    setSprinklers(allSprinklers);
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
    const alertTypes = [
      {
        message: 'Sprinkler fault detected - requires maintenance',
        type: 'warning'
      },
      {
        message: 'Solar panel dust accumulation affecting efficiency',
        type: 'warning'
      },
      {
        message: 'Flood risk alert - heavy rainfall detected nearby',
        type: 'critical'
      },
      {
        message: 'Low water pressure in irrigation system',
        type: 'warning'
      },
      {
        message: 'Moisture sensor calibration successful',
        type: 'success'
      },
      {
        message: 'Weekly system health check completed',
        type: 'success'
      },
      {
        message: 'Weather forecast: Optimal growing conditions',
        type: 'info'
      },
      {
        message: 'Fertilizer levels optimal across all lands',
        type: 'info'
      },
      {
        message: 'Power outage detected - backup systems active',
        type: 'warning'
      },
      {
        message: 'Crop growth milestone reached in Main Land',
        type: 'success'
      }
    ];

    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });

    const selectedAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const randomAlert = {
      id: Date.now(),
      message: selectedAlert.message,
      time: timeString,
      type: selectedAlert.type
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

  // Get lands data for dashboard
  const getLands = () => {
    return lands.map(land => {
      const landSprinklers = sprinklers.filter(s => s.landId === land.id);
      const activeSprinklers = landSprinklers.filter(s => s.isActive).length;
      const avgMoisture = landSprinklers.length > 0 
        ? Math.round(landSprinklers.reduce((sum, s) => sum + s.moisture, 0) / landSprinklers.length)
        : 0;
      const criticalSprinklers = landSprinklers.filter(s => s.status === 'critical').length;
      
      return {
        ...land,
        sprinklerCount: landSprinklers.length,
        activeSprinklers: activeSprinklers,
        avgMoisture: avgMoisture,
        criticalSprinklers: criticalSprinklers,
        status: criticalSprinklers > 0 ? 'critical' : avgMoisture < 40 ? 'dry' : 'good'
      };
    });
  };

  const value = {
    farmData,
    lands,
    sprinklers,
    alerts,
    saveFarmData,
    addLand,
    toggleSprinkler,
    getStatusColor,
    updateMoistureLevels,
    addAlert,
    getLands
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};