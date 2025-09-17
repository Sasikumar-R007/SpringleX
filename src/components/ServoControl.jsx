function ServoControl() {
  const toggleServo = async () => {
    try {
      const response = await fetch("/api/esp8266/toggle");
      
      let data;
      try {
        // Try to parse JSON response
        data = await response.json();
      } catch (jsonError) {
        // If JSON parsing fails, fall back to direct mode
        console.log("Proxy unavailable, trying direct ESP8266 connection...");
        return directToggle();
      }
      
      if (response.ok && data.success) {
        console.log("ESP Response:", data.espResponse);
        alert("✅ " + data.message);
      } else {
        // Handle ESP connection errors from backend
        console.error("ESP Error:", data.error || 'Unknown error');
        alert("⚠️ " + (data.message || 'ESP8266 connection failed'));
        if (data.helpText) {
          console.log("Help:", data.helpText);
        }
      }
    } catch (error) {
      // Proxy completely unreachable - try direct mode
      console.log("Backend proxy unreachable, switching to direct mode...");
      return directToggle();
    }
  };

  const directToggle = () => {
    // Open ESP8266 directly in a new tab when connected to ESP8266-Lane WiFi
    const espUrl = "http://192.168.4.1/toggle";
    
    alert("🔗 Opening ESP8266 directly. Make sure you're connected to ESP8266-Lane WiFi!");
    
    // Try to open in new tab
    const newWindow = window.open(espUrl, '_blank');
    
    if (!newWindow) {
      // If popup blocked, give user a link
      const userConfirm = confirm(
        "Popup blocked. Click OK to navigate to ESP8266 directly, or Cancel to copy the link."
      );
      
      if (userConfirm) {
        window.location.href = espUrl;
      } else {
        // Copy to clipboard if available
        if (navigator.clipboard) {
          navigator.clipboard.writeText(espUrl);
          alert("Link copied to clipboard: " + espUrl);
        } else {
          alert("ESP8266 URL: " + espUrl);
        }
      }
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