import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import DashboardMockup from './components/DashboardMockup'
import Team from './components/Team'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <DashboardMockup />
      <Team />
      <Contact />
      <Footer />
    </div>
  )
}

export default App