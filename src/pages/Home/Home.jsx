import Hero from '../../components/Hero/Hero'
import PackageSection from '../../components/PackageSection/PackageSection'
import WhyChooseUs from '../../components/WhyChooseUs/WhyChooseUs'
import ScheduleTable from '../../components/ScheduleTable/ScheduleTable'
import Testimonial from '../../components/Testimonial/Testimonial'
import Gallery from '../../components/Gallery/Gallery'
// import FAQ from '../../components/FAQ/FAQ'

export default function Home() {
  return (
    <main>
      <Hero />
      <PackageSection />
      <WhyChooseUs />
      <ScheduleTable />
      <Testimonial />
      <Gallery />
      {/* <FAQ /> */}
    </main>
  )
}