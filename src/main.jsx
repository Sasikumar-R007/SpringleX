import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { FarmProvider } from './contexts/FarmContext'
import { DeviceProvider } from './contexts/DeviceContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FarmProvider>
          <DeviceProvider>
            <App />
          </DeviceProvider>
        </FarmProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
