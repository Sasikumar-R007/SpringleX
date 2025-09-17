import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001; // Different port from frontend (5000)

// Enable CORS for the frontend
app.use(cors({
  origin: ['http://localhost:5000', 'https://*.replit.dev', 'https://*.replit.co'],
  credentials: true
}));

app.use(express.json());

// Proxy endpoint for ESP8266 toggle
app.get('/api/esp8266/toggle', async (req, res) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
  
  try {
    console.log('Attempting to connect to ESP8266 at 192.168.4.1...');
    
    // Make HTTP request to ESP8266 with proper timeout
    const response = await fetch('http://192.168.4.1/toggle', {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`ESP8266 responded with status: ${response.status}`);
    }
    
    const text = await response.text();
    console.log('ESP8266 Response:', text);
    
    res.json({
      success: true,
      message: 'Servo toggled successfully!',
      espResponse: text
    });
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('ESP8266 connection error:', error);
    
    let errorMessage = 'Could not reach ESP8266.';
    
    if (error.name === 'AbortError') {
      errorMessage += ' Connection timed out after 5 seconds.';
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage += ' Network unreachable. Make sure you are connected to ESP8266-Network WiFi and the ESP8266 is powered on.';
    } else {
      errorMessage += ` Error: ${error.message}`;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: error.message,
      helpText: 'Note: This proxy server must be running on the same machine connected to the ESP8266\'s WiFi network (ESP8266-Network).'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend proxy server is running' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`ESP8266 Proxy Server running on port ${port}`);
  console.log(`Frontend should call: /api/esp8266/toggle`);
});