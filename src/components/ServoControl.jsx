function ServoControl() {
  const toggleServo = async () => {
    try {
      const response = await fetch("/api/esp8266/toggle");
      const data = await response.json();
      
      if (data.success) {
        console.log("ESP Response:", data.espResponse);
        alert("✅ " + data.message);
      } else {
        console.error("ESP Error:", data.error);
        alert("⚠️ " + data.message);
      }
    } catch (error) {
      alert("⚠️ Could not reach proxy server. Check connection.");
      console.error(error);
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