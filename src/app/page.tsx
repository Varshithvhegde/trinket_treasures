import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Featured from '@/components/Featured'
import Collections from '@/components/Collections'
import About from '@/components/About'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Featured />
      <Collections />
      <About />
      <Contact />
      <Footer />
    </main>
  )
}