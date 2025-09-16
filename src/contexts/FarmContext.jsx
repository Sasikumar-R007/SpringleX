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
  const [zones, setZones] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Load farm data from localStorage
    const storedFarmData = localStorage.getItem('sprinkleX_farmData');
    if (storedFarmData) {
      const data = JSON.parse(storedFarmData);
      setFarmData(data);
      generateZones(data);
    }

    // Generate initial alerts
    const initialAlerts = [
      { id: 1, message: 'Zone 2 watered at 10:15 AM', time: '10:15 AM', type: 'info' },
      { id: 2, message: 'Zone 1 moisture level critical', time: '9:45 AM', type: 'warning' },
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
    generateZones(data);
  };

  const generateZones = (farmData) => {
    if (!farmData) return;

    const zoneCount = Math.min(4, Math.max(2, Math.ceil(farmData.landSize / 5)));
    const newZones = Array.from({ length: zoneCount }, (_, index) => ({
      id: index + 1,
      name: `Zone ${index + 1}`,
      moisture: Math.floor(Math.random() * 100),
      status: getStatus(Math.floor(Math.random() * 100)),
      isActive: Math.random() > 0.5,
      cropType: farmData.cropType
    }));

    setZones(newZones);
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

  const toggleZone = (zoneId) => {
    setZones(prevZones => 
      prevZones.map(zone => 
        zone.id === zoneId 
          ? { ...zone, isActive: !zone.isActive }
          : zone
      )
    );

    // Add alert when zone is toggled
    const zone = zones.find(z => z.id === zoneId);
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    
    addAlert({
      id: Date.now(),
      message: `Zone ${zoneId} ${!zone?.isActive ? 'activated' : 'deactivated'}`,
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
    setZones(prevZones => 
      prevZones.map(zone => {
        const newMoisture = Math.max(0, Math.min(100, 
          zone.moisture + (Math.random() - 0.5) * 10
        ));
        return {
          ...zone,
          moisture: Math.floor(newMoisture),
          status: getStatus(Math.floor(newMoisture))
        };
      })
    );
  };

  const value = {
    farmData,
    zones,
    alerts,
    saveFarmData,
    toggleZone,
    getStatusColor,
    updateMoistureLevels,
    addAlert
  };

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
};