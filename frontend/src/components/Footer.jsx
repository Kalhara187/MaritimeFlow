import React from 'react'
import { Anchor, Twitter, Linkedin, Facebook, Globe } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Modules', href: '#modules' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Use', href: '#' },
  { label: 'Data Security', href: '#' },
  { label: 'Accessibility', href: '#' },
]

const socials = [
  { icon: <Twitter className="w-4 h-4" />, href: '#', label: 'Twitter' },
  { icon: <Linkedin className="w-4 h-4" />, href: '#', label: 'LinkedIn' },
  { icon: <Facebook className="w-4 h-4" />, href: '#', label: 'Facebook' },
  { icon: <Globe className="w-4 h-4" />, href: '#', label: 'Website' },
]

const Footer = () => {
  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-[#040f24] text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-[#1E90FF] p-2 rounded-lg">
                <Anchor className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-white leading-tight">Port Logistics</p>
                <p className="text-blue-300 text-xs leading-tight">Management System</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              A modern digital platform built to streamline port operations — vessel tracking, 
              container management, document classification, and insightful analytics, all in one place.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center 
                             hover:bg-[#1E90FF] transition-colors duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => scrollTo(link.href)}
                    className="text-gray-400 hover:text-[#1E90FF] text-sm transition-colors 
                               duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#1E90FF] rounded-full opacity-0 
                                     group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Legal &amp; Info
            </h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-[#1E90FF] text-sm transition-colors 
                               duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1.5 h-1.5 bg-[#1E90FF] rounded-full opacity-0 
                                     group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-xs text-gray-400 leading-relaxed">
                🔒 All data is encrypted in transit and at rest. Your information is secure.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {new Date().getFullYear()} Port Logistics Management System. All rights reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Designed for Sri Lanka Port Authority operations
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
