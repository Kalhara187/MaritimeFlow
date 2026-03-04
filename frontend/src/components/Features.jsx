import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Package, FileText, BarChart2 } from 'lucide-react'

const features = [
  {
    icon: <MapPin className="w-7 h-7" />,
    title: 'Shipment Tracking',
    description:
      'Real-time monitoring of vessel arrivals and departures. Get instant updates on shipment status, location, and estimated delivery times.',
    color: 'bg-blue-100 text-[#0B3D91]',
    border: 'hover:border-[#0B3D91]',
  },
  {
    icon: <Package className="w-7 h-7" />,
    title: 'Container Management',
    description:
      'Update container status and yard location efficiently. Track every container from port arrival to final clearance with ease.',
    color: 'bg-sky-100 text-[#1E90FF]',
    border: 'hover:border-[#1E90FF]',
  },
  {
    icon: <FileText className="w-7 h-7" />,
    title: 'Document Classification',
    description:
      'Automatically categorize port-related letters and reports. Intelligent document handling for streamlined administrative workflows.',
    color: 'bg-emerald-100 text-emerald-600',
    border: 'hover:border-emerald-500',
  },
  {
    icon: <BarChart2 className="w-7 h-7" />,
    title: 'PDF Report Generation',
    description:
      'Generate daily and monthly logistics reports instantly. Export comprehensive analytics in a professional, shareable format.',
    color: 'bg-purple-100 text-purple-600',
    border: 'hover:border-purple-500',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
}

const Features = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-blue-100 text-[#0B3D91] text-sm font-semibold 
                           px-4 py-1.5 rounded-full mb-4">
            What We Offer
          </span>
          <h2 className="section-title">Core System Features</h2>
          <p className="section-subtitle mx-auto">
            Everything you need to manage modern port operations — from vessel tracking 
            to documentation, all in one place.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className={`card border-2 border-transparent ${feature.border} 
                          cursor-default group`}
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-5`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3 group-hover:text-[#0B3D91] 
                             transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>

              <div className="mt-5 flex items-center gap-1 text-[#0B3D91] text-sm font-medium 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Learn More
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
