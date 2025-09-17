function ServoControl() {
  const toggleServo = async () => {
    try {
      const response = await fetch("http://192.168.4.1/toggle");
      const text = await response.text();
      console.log("ESP Response:", text);
      alert("Servo toggled!");
    } catch (error) {
      alert("⚠️ Could not reach ESP8266. Check Wi-Fi connection.");
      console.error(error);
    }
  };

  return (
    <button 
      className="bg-green-600 text-white px-6 py-3 rounded-xl text-lg"
      onClick={toggleServo}
    >
      Toggle Servo
    </button>
  );
}

export default ServoControl;