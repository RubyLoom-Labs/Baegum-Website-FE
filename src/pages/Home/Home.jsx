import HeroBanner from './sections/HeroBanner'
import FeaturesSection from './sections/FeaturesSection'
import CTASection from './sections/CTASection'
import TopTrends from './sections/TopTrends'

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <TopTrends />
      <FeaturesSection />
      <CTASection />
    </div>
  )
}
