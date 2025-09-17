function ServoControl() {
  const toggleServo = async () => {
    try {
      const response = await fetch("/api/esp8266/toggle");
      
      // Always try to parse JSON response, regardless of status code
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("ESP Response:", data.espResponse);
        alert("✅ " + data.message);
      } else {
        // Handle both HTTP errors and ESP connection errors
        console.error("ESP Error:", data.error || 'Unknown error');
        alert("⚠️ " + (data.message || 'ESP8266 connection failed'));
        if (data.helpText) {
          console.log("Help:", data.helpText);
        }
      }
    } catch (error) {
      alert("⚠️ Could not reach proxy server. Check that backend is running.");
      console.error("Connection error:", error);
    }
  };

  return (
    <button 
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg transition-colors duration-200"
      onClick={toggleServo}
    >
      Toggle Servo
    </button>
  );
}

export default ServoControl;