import React from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Modules from '../components/Modules'
import DashboardPreview from '../components/DashboardPreview'
import Security from '../components/Security'
import About from '../components/About'
import Contact from '../components/Contact'

/**
 * LandingPage — the home route (/)
 * Navbar and Footer are provided by the shared Layout component in App.jsx.
 */
const LandingPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <Modules />
      <DashboardPreview />
      <Security />
      <About />
      <Contact />
    </>
  )
}

export default LandingPage
