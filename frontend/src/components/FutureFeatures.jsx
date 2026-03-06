import React from 'react'
import { motion } from 'framer-motion'
import {
  Radio,
  Bell,
  BarChart3,
  Smartphone,
  Brain,
  Globe,
  Cloud,
  DatabaseBackup,
} from 'lucide-react'

const futureFeatures = [
  {
    id: '01',
    icon: <Radio className="w-7 h-7" />,
    title: 'Real-Time Shipment Tracking',
    description:
      'Monitor shipments and vessels live as they move between ports. View real-time updates, estimated arrival times, and full route information directly from the system.',
    color: 'bg-blue-100 text-[#0B3D91]',
    accent: 'from-[#0B3D91] to-[#1557c0]',
    badge: 'bg-blue-100 text-[#0B3D91]',
  },
  {
    id: '02',
    icon: <Bell className="w-7 h-7" />,
    title: 'Email & SMS Notifications',
    description:
      'Automated alerts for shipment arrivals, container status changes, document approvals, and system events — delivered instantly via email or SMS.',
    color: 'bg-amber-100 text-amber-600',
    accent: 'from-amber-500 to-orange-500',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    id: '03',
    icon: <BarChart3 className="w-7 h-7" />,
    title: 'Advanced Analytics Dashboard',
    description:
      'Detailed statistics and visual reports with interactive charts and graphs. Analyze shipment trends, container movements, and operational performance at a glance.',
    color: 'bg-purple-100 text-purple-600',
    accent: 'from-purple-500 to-violet-600',
    badge: 'bg-purple-100 text-purple-700',
  },
  {
    id: '04',
    icon: <Smartphone className="w-7 h-7" />,
    title: 'Mobile Application Integration',
    description:
      'A dedicated mobile app for smartphones and tablets, enabling port officers and administrators to monitor and manage operations remotely from anywhere.',
    color: 'bg-emerald-100 text-emerald-600',
    accent: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: '05',
    icon: <Brain className="w-7 h-7" />,
    title: 'AI-Based Document Classification',
    description:
      'Artificial Intelligence technology to automatically categorize uploaded port documents and letters, assigning the correct category without any manual input.',
    color: 'bg-rose-100 text-rose-600',
    accent: 'from-rose-500 to-pink-600',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    id: '06',
    icon: <Globe className="w-7 h-7" />,
    title: 'Multi-Port Management',
    description:
      'Expand the platform to support multiple port locations under a single system, allowing administrators to manage logistics operations across several ports simultaneously.',
    color: 'bg-sky-100 text-sky-600',
    accent: 'from-sky-500 to-cyan-600',
    badge: 'bg-sky-100 text-sky-700',
  },
  {
    id: '07',
    icon: <Cloud className="w-7 h-7" />,
    title: 'Cloud Deployment',
    description:
      'Deploy the system on scalable cloud platforms to improve performance and accessibility. Cloud hosting ensures the platform can handle a larger number of users and data efficiently.',
    color: 'bg-indigo-100 text-indigo-600',
    accent: 'from-indigo-500 to-blue-600',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: '08',
    icon: <DatabaseBackup className="w-7 h-7" />,
    title: 'Data Backup & Recovery',
    description:
      'An automatic backup system to ensure all data is securely stored and fully recoverable in the event of system failures or data loss incidents.',
    color: 'bg-teal-100 text-teal-600',
    accent: 'from-teal-500 to-emerald-600',
    badge: 'bg-teal-100 text-teal-700',
  },
]

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const FutureFeatures = () => {
  return (
    <section id="future-features" className="py-24 bg-gray-50">
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
            What's Coming Next
          </span>
          <h2 className="section-title">Future Feature Roadmap</h2>
          <p className="section-subtitle mx-auto">
            Planned enhancements that will further improve automation, security, and operational
            performance within the PortSync Lanka platform.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {futureFeatures.map((feature, i) => (
            <motion.div
              key={feature.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100
                         hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Feature number badge */}
              <span className={`absolute top-4 right-4 text-xs font-bold px-2 py-0.5 
                                rounded-full ${feature.badge}`}>
                #{feature.id}
              </span>

              {/* Icon */}
              <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-5`}>
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-bold text-gray-800 mb-3 leading-snug
                             group-hover:text-[#0B3D91] transition-colors">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Bottom accent bar */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl
                               bg-gradient-to-r ${feature.accent}
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center text-gray-400 text-sm mt-12"
        >
          These features are planned for upcoming releases and will be prioritised based on
          operational needs and user feedback.
        </motion.p>

      </div>
    </section>
  )
}

export default FutureFeatures
