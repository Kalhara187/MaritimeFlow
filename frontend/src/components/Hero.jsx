import React from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Play } from 'lucide-react'

const ShipIllustration = () => (
  <svg viewBox="0 0 520 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Ocean waves */}
    <ellipse cx="260" cy="370" rx="240" ry="30" fill="#1E90FF" fillOpacity="0.15" />
    <path d="M20 360 Q80 345 140 360 Q200 375 260 360 Q320 345 380 360 Q440 375 500 360" 
          stroke="#1E90FF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    <path d="M30 375 Q90 362 150 375 Q210 388 270 375 Q330 362 390 375 Q450 388 490 375" 
          stroke="#0B3D91" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.4"/>

    {/* Ship hull */}
    <path d="M80 320 L100 290 L420 290 L440 320 Q380 345 260 348 Q140 345 80 320Z" 
          fill="#0B3D91"/>
    <path d="M90 315 L108 288 L412 288 L430 315 Q370 338 260 341 Q150 338 90 315Z" 
          fill="#1a4fa0"/>

    {/* Ship deck */}
    <rect x="120" y="260" width="280" height="30" rx="4" fill="#0e4db0"/>
    <rect x="140" y="248" width="240" height="14" rx="3" fill="#1557c0"/>

    {/* Containers on deck */}
    {[0,1,2].map(i => (
      <g key={i}>
        <rect x={145 + i * 77} y="215" width="65" height="35" rx="3" 
              fill={['#e63946','#2a9d8f','#e9c46a'][i]}/>
        <rect x={145 + i * 77} y="215" width="65" height="5" rx="1" fill="rgba(0,0,0,0.15)"/>
        <line x1={178 + i * 77} y1="215" x2={178 + i * 77} y2="250" 
              stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"/>
      </g>
    ))}

    {/* Second row containers */}
    {[0,1].map(i => (
      <g key={i}>
        <rect x={183 + i * 77} y="182" width="65" height="35" rx="3" 
              fill={['#457b9d','#f4a261'][i]}/>
        <rect x={183 + i * 77} y="182" width="65" height="5" rx="1" fill="rgba(0,0,0,0.15)"/>
        <line x1={216 + i * 77} y1="182" x2={216 + i * 77} y2="217" 
              stroke="rgba(0,0,0,0.15)" strokeWidth="1.5"/>
      </g>
    ))}

    {/* Bridge/Superstructure */}
    <rect x="290" y="170" width="80" height="90" rx="4" fill="#0f3460"/>
    <rect x="295" y="175" width="70" height="80" rx="3" fill="#14427d"/>
    {/* Bridge windows */}
    <rect x="302" y="183" width="15" height="10" rx="2" fill="#a8daff"/>
    <rect x="322" y="183" width="15" height="10" rx="2" fill="#a8daff"/>
    <rect x="342" y="183" width="15" height="10" rx="2" fill="#a8daff"/>
    <rect x="302" y="200" width="15" height="10" rx="2" fill="#a8daff"/>
    <rect x="322" y="200" width="15" height="10" rx="2" fill="#a8daff"/>
    <rect x="342" y="200" width="15" height="10" rx="2" fill="#a8daff"/>

    {/* Funnel/Chimney */}
    <rect x="330" y="145" width="22" height="30" rx="3" fill="#0B3D91"/>
    <rect x="328" y="140" width="26" height="8" rx="2" fill="#0a3585"/>
    {/* Smoke */}
    <circle cx="341" cy="128" r="6" fill="rgba(150,150,150,0.4)"/>
    <circle cx="347" cy="115" r="8" fill="rgba(150,150,150,0.3)"/>
    <circle cx="338" cy="103" r="5" fill="rgba(150,150,150,0.2)"/>

    {/* Crane on left */}
    <line x1="170" y1="260" x2="170" y2="130" stroke="#334155" strokeWidth="5" strokeLinecap="round"/>
    <line x1="170" y1="135" x2="115" y2="165" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
    <line x1="170" y1="135" x2="225" y2="165" stroke="#334155" strokeWidth="4" strokeLinecap="round"/>
    <line x1="170" y1="155" x2="148" y2="215" stroke="#64748b" strokeWidth="2" strokeDasharray="4 3"/>
    {/* Crane hook */}
    <rect x="140" y="215" width="16" height="10" rx="2" fill="#f97316"/>

    {/* Mast / Flagpole */}
    <line x1="260" y1="260" x2="260" y2="170" stroke="#94a3b8" strokeWidth="2"/>
    <path d="M260 172 L280 180 L260 188Z" fill="#ef4444"/>

    {/* Water ripples */}
    <ellipse cx="180" cy="358" rx="40" ry="5" fill="#1E90FF" fillOpacity="0.2"/>
    <ellipse cx="340" cy="362" rx="55" ry="6" fill="#1E90FF" fillOpacity="0.15"/>

    {/* Anchor icon bottom right */}
    <circle cx="460" cy="330" r="22" fill="#0B3D91" fillOpacity="0.1"/>
    <text x="460" y="337" textAnchor="middle" fontSize="18" fill="#0B3D91" opacity="0.4">⚓</text>
  </svg>
)

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' }
  })
}

const Hero = () => {
  const handleScroll = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="min-h-screen pt-16 bg-gradient-to-br from-white via-blue-50 to-[#e8eef9] 
                                   flex items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E90FF] rounded-full 
                      opacity-5 transform translate-x-1/2 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0B3D91] rounded-full 
                      opacity-5 transform -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — Text content */}
          <div className="order-2 lg:order-1">
            <motion.div
              variants={fadeUp}
              custom={0}
              initial="hidden"
              animate="show"
              className="inline-flex items-center gap-2 bg-blue-100 text-[#0B3D91] 
                         px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 bg-[#1E90FF] rounded-full animate-pulse" />
              Smart Port Operations Platform
            </motion.div>

            <motion.h1
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate="show"
              className="text-4xl sm:text-5xl xl:text-6xl font-bold text-[#0B3D91] leading-tight mb-6"
            >
              Smart Digital Solution for{' '}
              <span className="text-[#1E90FF]">Modern Port</span>{' '}
              Operations
            </motion.h1>

            <motion.p
              variants={fadeUp}
              custom={2}
              initial="hidden"
              animate="show"
              className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl"
            >
              Manage shipments, containers, and official documents in one secure platform. 
              Streamline your port operations with real-time tracking and intelligent analytics.
            </motion.p>

            <motion.div
              variants={fadeUp}
              custom={3}
              initial="hidden"
              animate="show"
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={() => handleScroll('#contact')}
                className="btn-primary flex items-center justify-center gap-2 text-base py-3.5 px-8"
              >
                Get Started <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleScroll('#features')}
                className="btn-outline flex items-center justify-center gap-2 text-base py-3.5 px-8"
              >
                <Play className="w-4 h-4" />
                View Demo
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              variants={fadeUp}
              custom={4}
              initial="hidden"
              animate="show"
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-gray-200"
            >
              {[
                { label: 'Shipments Tracked', value: '10K+' },
                { label: 'Containers Managed', value: '50K+' },
                { label: 'Reports Generated', value: '5K+' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl sm:text-3xl font-bold text-[#0B3D91]">{stat.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="order-1 lg:order-2 flex items-center justify-center"
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-full max-w-lg"
            >
              <ShipIllustration />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
