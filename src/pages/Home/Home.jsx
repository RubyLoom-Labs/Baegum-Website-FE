import HeroBanner from './sections/HeroBanner'
import TopTrends from './sections/TopTrends'
import PromoBanners from './sections/PromoBanners'
import VideoBanner from './sections/Videobanner'
import CategoryShowcase from './sections/CategoryShowcase'

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <TopTrends />
      <PromoBanners />
      <VideoBanner />
      <CategoryShowcase />
    </div>
  )
}
