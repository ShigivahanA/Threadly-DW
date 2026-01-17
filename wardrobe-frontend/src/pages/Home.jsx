import HeroSection from '../components/home/HeroSection'
import PhilosophySection from '../components/home/PhilosophySection'
import CapabilitiesSection from '../components/home/CapabilitiesSection'
import WorkflowSection from '../components/home/WorkflowSection'
import ClosingSection from '../components/home/ClosingSection'

const Home = () => {
  return (
    <div className="space-y-28 py-16">
      <HeroSection />
      <PhilosophySection />
      <CapabilitiesSection />
      <WorkflowSection />
      <ClosingSection />
    </div>
  )
}

export default Home
