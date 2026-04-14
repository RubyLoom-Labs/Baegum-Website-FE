import HeroBanner from './sections/HeroBanner'
import TopTrends from './sections/TopTrends'
import PromoBanners from './sections/PromoBanners'
import VideoBanner from './sections/Videobanner'
import CategoryShowcase from './sections/CategoryShowcase'
import FeaturedProductSection from "./sections/FeaturedProductSection";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <TopTrends />
      <PromoBanners />
      <FeaturedProductSection />
      <VideoBanner />
      <CategoryShowcase />
    </div>
  )
}
