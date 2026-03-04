import React from 'react'
import { motion } from 'framer-motion'
import { Users, Ship, Package, FileText, LayoutDashboard, ArrowRight } from 'lucide-react'

const modules = [
  {
    icon: <Users className="w-8 h-8" />,
    title: 'User Management',
    description:
      'Control access with role-based permissions for administrators, port officers, and operators. Manage user profiles and audit trails.',
    badge: 'Core Module',
    badgeColor: 'bg-purple-100 text-purple-700',
    iconBg: 'bg-purple-100 text-purple-600',
  },
  {
    icon: <Ship className="w-8 h-8" />,
    title: 'Shipment Module',
    description:
      'Track incoming and outgoing vessels with detailed manifest records, berth assignments, and arrival/departure schedules.',
    badge: 'Real-Time',
    badgeColor: 'bg-blue-100 text-[#0B3D91]',
    iconBg: 'bg-blue-100 text-[#0B3D91]',
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: 'Container Module',
    description:
      'Manage container inventory, update yard locations, track customs clearance stages, and handle stacking records efficiently.',
    badge: 'Inventory',
    badgeColor: 'bg-orange-100 text-orange-600',
    iconBg: 'bg-orange-100 text-orange-600',
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: 'Document Module',
    description:
      'Classify, store and retrieve port documents — bills of lading, customs forms, clearance letters — with smart categorization.',
    badge: 'Smart Docs',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    iconBg: 'bg-emerald-100 text-emerald-600',
  },
  {
    icon: <LayoutDashboard className="w-8 h-8" />,
    title: 'Dashboard Analytics',
    description:
      'Visualize key port metrics with interactive charts. Real-time KPIs for shipment volumes, container stats, and clearance rates.',
    badge: 'Analytics',
    badgeColor: 'bg-sky-100 text-sky-600',
    iconBg: 'bg-sky-100 text-sky-600',
  },
]

const Modules = () => {
  return (
    <section id="modules" className="py-24 bg-white">
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
            System Modules
          </span>
          <h2 className="section-title">Powerful Modules for Every Task</h2>
          <p className="section-subtitle mx-auto">
            Each module is designed to handle a specific domain of port operations 
            with precision and ease of use.
          </p>
        </motion.div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="card group relative overflow-hidden"
            >
              {/* Decorative top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r 
                              from-[#0B3D91] to-[#1E90FF] transform 
                              -translate-y-full group-hover:translate-y-0 
                              transition-transform duration-300" />

              {/* Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className={`inline-flex p-3 rounded-xl ${mod.iconBg}`}>
                  {mod.icon}
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${mod.badgeColor}`}>
                  {mod.badge}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#0B3D91] 
                             transition-colors">
                {mod.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{mod.description}</p>

              <button className="flex items-center gap-2 text-[#0B3D91] font-semibold text-sm 
                                 hover:gap-3 transition-all duration-200">
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}

          {/* Placeholder CTA card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: modules.length * 0.1, duration: 0.5 }}
            className="card bg-gradient-to-br from-[#0B3D91] to-[#1E90FF] 
                       text-white flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center 
                              justify-center mb-4">
                <span className="text-2xl">🚢</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Ready to Get Started?</h3>
              <p className="text-blue-100 text-sm leading-relaxed mb-6">
                Join port authorities and logistics teams already using MaritimeFlow 
                to streamline their daily operations.
              </p>
            </div>
            <button className="bg-white text-[#0B3D91] font-semibold px-5 py-2.5 
                               rounded-lg hover:bg-blue-50 transition-colors w-fit">
              Request Access
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Modules
