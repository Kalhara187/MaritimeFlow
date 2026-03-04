import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Modules from '../components/Modules'
import DashboardPreview from '../components/DashboardPreview'
import Security from '../components/Security'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const LandingPage = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Modules />
        <DashboardPreview />
        <Security />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
