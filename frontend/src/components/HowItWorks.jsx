import React from 'react'
import { motion } from 'framer-motion'
import { UserPlus, Ship, FileBarChart } from 'lucide-react'

const steps = [
  {
    icon: <UserPlus className="w-8 h-8" />,
    step: '01',
    title: 'Register & Login',
    description:
      'Create your account, set up your profile, and get secure access to the platform with role-based permissions.',
    color: 'bg-[#0B3D91]',
  },
  {
    icon: <Ship className="w-8 h-8" />,
    step: '02',
    title: 'Manage Shipments & Containers',
    description:
      'Add, track, and update shipments in real-time. Monitor container yard locations and status changes seamlessly.',
    color: 'bg-[#1E90FF]',
  },
  {
    icon: <FileBarChart className="w-8 h-8" />,
    step: '03',
    title: 'Generate Reports & Track Data',
    description:
      'Export daily or monthly PDF reports and review powerful analytics from the integrated dashboard.',
    color: 'bg-emerald-600',
  },
]

const HowItWorks = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-[#f0f4ff] to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-[#0B3D91] text-white text-sm font-semibold 
                           px-4 py-1.5 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="section-title">Get Started in 3 Simple Steps</h2>
          <p className="section-subtitle mx-auto">
            Onboard quickly and start optimizing port operations with our intuitive platform.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 lg:gap-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.step}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
                className="flex-1 flex flex-col items-center text-center max-w-xs mx-auto lg:mx-0 px-4"
              >
                {/* Step number badge */}
                <div className="relative mb-6">
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center 
                                   justify-center text-white shadow-lg 
                                   hover:scale-110 transition-transform duration-300`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white rounded-full 
                                  shadow-md flex items-center justify-center">
                    <span className="text-[#0B3D91] font-bold text-xs">{step.step}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-[#0B3D91] mb-3">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{step.description}</p>
              </motion.div>

              {/* Arrow connector (between steps, not after last) */}
              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  whileInView={{ opacity: 1, scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 + 0.3, duration: 0.4 }}
                  className="hidden lg:flex items-center self-center pb-20"
                >
                  <div className="flex items-center gap-1">
                    <div className="w-12 h-0.5 bg-[#1E90FF]" />
                    <div className="w-0 h-0 border-t-4 border-b-4 border-l-8 
                                    border-l-[#1E90FF] border-t-transparent border-b-transparent" />
                  </div>
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
