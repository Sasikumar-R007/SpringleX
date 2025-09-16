import Hero from '../components/Hero'
import About from '../components/About'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import DashboardMockup from '../components/DashboardMockup'
import Team from '../components/Team'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <DashboardMockup />
      <Team />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;