import React from 'react'
import { motion } from 'framer-motion'
import { Anchor, Target, Eye, Zap, ShieldCheck, BarChart2, Lightbulb, CheckCircle } from 'lucide-react'

const coreValues = [
  { icon: <Zap className="w-4 h-4" />, label: 'Efficiency' },
  { icon: <BarChart2 className="w-4 h-4" />, label: 'Transparency' },
  { icon: <ShieldCheck className="w-4 h-4" />, label: 'Security' },
  { icon: <Lightbulb className="w-4 h-4" />, label: 'Innovation' },
  { icon: <CheckCircle className="w-4 h-4" />, label: 'Reliability' },
]

const About = () => {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — Decorative visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Background tilt */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B3D91]/10 to-[#1E90FF]/10 
                            rounded-3xl transform rotate-3" />
            <div className="relative bg-gradient-to-br from-[#0B3D91] to-[#1557c0] 
                            rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center 
                                justify-center backdrop-blur-sm">
                  <Anchor className="w-10 h-10 text-white" />
                </div>
              </div>
              <blockquote className="text-center text-blue-100 text-lg leading-relaxed italic mb-8">
                "Digitizing port operations — enabling real-time visibility, one shipment at a time."
              </blockquote>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                {[
                  { v: 'Real-Time', l: 'Shipment Tracking' },
                  { v: 'Role-Based', l: 'Secure Access' },
                  { v: '100%', l: 'Digital Workflows' },
                ].map((s) => (
                  <div key={s.l} className="text-center">
                    <p className="text-xl font-bold leading-tight">{s.v}</p>
                    <p className="text-blue-200 text-xs mt-1">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* Core Values */}
              <div className="mt-6 border-t border-white/20 pt-6">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3 text-center">
                  Core Values
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {coreValues.map((val) => (
                    <span
                      key={val.label}
                      className="flex items-center gap-1.5 bg-white/15 text-white text-xs 
                                 font-medium px-3 py-1.5 rounded-full backdrop-blur-sm"
                    >
                      {val.icon}
                      {val.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block bg-blue-100 text-[#0B3D91] text-sm font-semibold 
                             px-4 py-1.5 rounded-full mb-5">
              About PortSync Lanka
            </span>
            <h2 className="section-title mb-5">
              A Smarter Way to Manage Port &amp; Logistics Operations
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              <strong className="text-[#0B3D91]">PortSync Lanka</strong> is a modern web-based
              Port &amp; Logistics Management System designed to digitize and streamline port
              operations. It provides an integrated solution for{' '}
              <strong className="text-gray-700">shipment tracking</strong>,{' '}
              <strong className="text-gray-700">container monitoring</strong>,{' '}
              <strong className="text-gray-700">document classification</strong>, and{' '}
              <strong className="text-gray-700">report generation</strong> — all within a
              centralized platform.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Inspired by operational frameworks used in large maritime institutions such as the{' '}
              <strong className="text-[#0B3D91]">Sri Lanka Ports Authority</strong>, the platform
              replaces manual processes and disconnected record-keeping systems with real-time
              visibility, structured dashboards, and role-based secure access — driving digital
              transformation across port logistics.
            </p>

            <div className="space-y-4">
              {[
                {
                  icon: <Target className="w-5 h-5 text-[#0B3D91]" />,
                  title: 'Our Mission',
                  text: 'To provide a secure, efficient, and scalable digital solution that simplifies port and logistics management processes.',
                },
                {
                  icon: <Eye className="w-5 h-5 text-[#0B3D91]" />,
                  title: 'Our Vision',
                  text: 'To become a reliable smart logistics platform that supports modern maritime operations through technology-driven innovation.',
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 p-4 bg-blue-50 rounded-xl">
                  <div className="p-2 bg-blue-100 rounded-lg h-fit">{item.icon}</div>
                  <div>
                    <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default About
