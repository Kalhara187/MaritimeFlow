import React from 'react'
import { motion } from 'framer-motion'
import { Anchor, Target, Lightbulb } from 'lucide-react'

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
            {/* Background circle */}
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
                "Streamlining port operations through technology — one container at a time."
              </blockquote>

              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-6">
                {[
                  { v: '15+', l: 'Years Experience' },
                  { v: '200+', l: 'Port Staff Served' },
                  { v: '99%', l: 'Satisfaction Rate' },
                ].map((s) => (
                  <div key={s.l} className="text-center">
                    <p className="text-2xl font-bold">{s.v}</p>
                    <p className="text-blue-200 text-xs mt-1">{s.l}</p>
                  </div>
                ))}
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
              About the System
            </span>
            <h2 className="section-title mb-5">
              Transforming Port Operations Through Innovation
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-5">
              This system is designed to improve efficiency and transparency in port operations, 
              similar to environments managed by organizations such as the{' '}
              <strong className="text-[#0B3D91]">Sri Lanka Ports Authority</strong>.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              By digitizing shipment records, container tracking, and document workflows, 
              we eliminate paperwork bottlenecks and empower port officials with real-time 
              information to make faster, more accurate decisions. Our platform bridges 
              the gap between legacy port infrastructure and modern digital expectations.
            </p>

            <div className="space-y-4">
              {[
                { icon: <Target className="w-5 h-5 text-[#0B3D91]" />, title: 'Our Mission', text: 'Digitize and automate port logistics to improve throughput and reduce errors.' },
                { icon: <Lightbulb className="w-5 h-5 text-[#0B3D91]" />, title: 'Our Vision', text: 'Become the leading port management platform for South Asian maritime authorities.' },
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
