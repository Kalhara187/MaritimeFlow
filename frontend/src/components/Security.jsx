import React from 'react'
import { motion } from 'framer-motion'
import { Lock, Shield, Cloud, Database } from 'lucide-react'

const items = [
  {
    icon: <Lock className="w-7 h-7" />,
    title: 'Secure Authentication',
    description: 'Industry-standard JWT-based authentication with encrypted sessions and token refresh.',
    color: 'bg-blue-100 text-[#0B3D91]',
  },
  {
    icon: <Shield className="w-7 h-7" />,
    title: 'Role-Based Access',
    description: 'Granular permission control for admins, port officers, customs agents, and operators.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: <Cloud className="w-7 h-7" />,
    title: 'Cloud Ready',
    description: 'Designed for scalable cloud deployment with high availability and disaster recovery.',
    color: 'bg-sky-100 text-sky-600',
  },
  {
    icon: <Database className="w-7 h-7" />,
    title: 'Data Accuracy',
    description: 'Validated data entry and audit logs ensure integrity from input to report generation.',
    color: 'bg-emerald-100 text-emerald-600',
  },
]

const Security = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-blue-100 text-[#0B3D91] text-sm font-semibold 
                           px-4 py-1.5 rounded-full mb-4">
            Security & Reliability
          </span>
          <h2 className="section-title">Built for Security and Scale</h2>
          <p className="section-subtitle mx-auto">
            Your port data is protected by enterprise-grade security at every layer of the platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 
                         hover:shadow-md hover:-translate-y-1 transition-all duration-300 
                         text-center group"
            >
              <div className={`inline-flex p-4 rounded-2xl ${item.color} mb-5 
                               group-hover:scale-110 transition-transform duration-300`}>
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        >
          {['SSL Encrypted', 'GDPR Compliant', '99.9% Uptime SLA', '24/7 Monitoring', 'ISO 27001 Design'].map((badge) => (
            <div key={badge} className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              {badge}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Security
