import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Mail, Phone, Send, CheckCircle } from 'lucide-react'

const contactInfo = [
  {
    icon: <MapPin className="w-5 h-5 text-[#1E90FF]" />,
    label: 'Address',
    value: 'Port Authority Building, Colombo 15, Sri Lanka',
  },
  {
    icon: <Mail className="w-5 h-5 text-[#1E90FF]" />,
    label: 'Email',
    value: 'support@portlogistics.lk',
  },
  {
    icon: <Phone className="w-5 h-5 text-[#1E90FF]" />,
    label: 'Phone',
    value: '+94 11 244 0991',
  },
]

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Something went wrong. Please try again.')
        return
      }

      setSubmitted(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch {
      setError('Unable to reach the server. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="py-24 bg-gray-50">
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
            Get In Touch
          </span>
          <h2 className="section-title">Contact Us</h2>
          <p className="section-subtitle mx-auto">
            Have questions or ready to get started? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 bg-white rounded-2xl shadow-md p-8 border border-gray-100"
          >
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center 
                                justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-500 mb-6">
                  Thank you for reaching out. We'll respond within 24 hours.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setError('') }}
                  className="btn-primary text-sm py-2.5 px-6"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Perera"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 
                                 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 
                                 focus:border-[#0B3D91] transition-colors text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@portauth.lk"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 
                                 focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 
                                 focus:border-[#0B3D91] transition-colors text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Shipment enquiry, Technical support"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 
                               focus:border-[#0B3D91] transition-colors text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us about your port operations or what you're looking for..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 resize-none
                               focus:outline-none focus:ring-2 focus:ring-[#0B3D91]/30 
                               focus:border-[#0B3D91] transition-colors text-sm"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 
                                rounded-lg px-4 py-2.5">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 
                             disabled:opacity-60 disabled:cursor-not-allowed py-3.5"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white 
                                      rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-[#0B3D91] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-1">Port Authority HQ</h3>
              <p className="text-blue-200 text-sm mb-6">
                Reach our support team or visit us at the main port authority building.
              </p>
              {contactInfo.map((info) => (
                <div key={info.label} className="flex gap-3 mb-4 last:mb-0">
                  <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center 
                                  justify-center shrink-0">
                    {info.icon}
                  </div>
                  <div>
                    <p className="text-blue-200 text-xs font-medium">{info.label}</p>
                    <p className="text-white text-sm font-medium">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Working hours */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">Working Hours</h3>
              <div className="space-y-2 text-sm">
                {[
                  { day: 'Mon – Fri', time: '8:00 AM – 5:30 PM' },
                  { day: 'Saturday', time: '8:00 AM – 1:00 PM' },
                  { day: 'Sunday', time: 'Closed' },
                ].map((h) => (
                  <div key={h.day} className="flex justify-between">
                    <span className="text-gray-500">{h.day}</span>
                    <span className={`font-medium ${h.time === 'Closed' ? 'text-red-400' : 'text-gray-700'}`}>
                      {h.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact
