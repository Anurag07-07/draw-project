'use client'

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { 
  LogOut, 
  Menu, 
  X, 
  ArrowRight, 
  PenTool,    // Changed to PenTool for "Draw" context
  Layers, 
  Users,      // Changed from Zap for "Collab" context
  Loader2,
  Minus
} from "lucide-react"
import Cookies from 'js-cookie'
import { Toaster, toast } from "sonner"
import Link from "next/link"

// --- Components ---

const GridBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
    {/* Subtle Grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
    {/* Vignette */}
    <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
  </div>
)

const NavItem = ({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) => (
  <a 
    href={href} 
    onClick={onClick}
    className="group relative text-sm font-medium text-neutral-400 hover:text-white transition-colors duration-300 cursor-pointer"
  >
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
  </a>
)

const FeatureCard = ({ icon: Icon, title, desc, index }: { icon: React.ComponentType<{ className?: string }>, title: string, desc: string, index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group p-8 border border-white/10 bg-neutral-950/50 hover:bg-neutral-900 transition-colors duration-500"
  >
    <div className="mb-6 inline-flex p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-light text-white mb-3 tracking-wide">{title}</h3>
    <p className="text-neutral-500 font-light leading-relaxed group-hover:text-neutral-400 transition-colors">
      {desc}
    </p>
  </motion.div>
)

// --- Main Component ---

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])
  const heroY = useTransform(scrollY, [0, 300], [0, 50])

  // Simple scroll listener for navbar border
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      // Simulate network
      await new Promise(resolve => setTimeout(resolve, 800))
      
      try {
        await fetch("http://localhost:3000/api/v1/logout", { 
            method: "POST", 
            credentials: "include" 
        })
      } catch (e) { /* ignore in demo */ }

      Cookies.remove("token")
      toast.success("Signed out successfully")
      window.location.href = "/signin"
    } catch (error) {
      toast.error("Logout failed")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const features = [
    { icon: PenTool, title: "Infinite Canvas", desc: "A boundless surface for your ideas. Zoom in for details, zoom out for the big picture." },
    { icon: Layers, title: "Structured Layers", desc: "Keep your complexity under control with a professional-grade, non-destructive layer system." },
    { icon: Users, title: "Live Collaboration", desc: "Work simultaneously with your team. See cursors, edits, and comments in real-time." },
  ]

  return (
    <div className="relative min-h-screen w-full bg-black font-sans text-white selection:bg-white selection:text-black">
      <Toaster position="bottom-right" theme="dark" />
      <GridBackground />

      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-4" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="w-8 h-8 bg-white text-black flex items-center justify-center rounded-sm font-bold text-lg group-hover:scale-90 transition-transform duration-300">
              E
            </div>
            <span className="text-lg font-bold tracking-widest uppercase">Edunax</span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            <NavItem href="/dashboard">Dashboard</NavItem>
            <NavItem href="/projects">Projects</NavItem>
            <NavItem href="/community">Community</NavItem>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
              <span>Logout</span>
            </button>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden z-50 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            {['Dashboard', 'Projects', 'Community'].map((item) => (
              <a 
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-3xl font-light tracking-wide hover:text-neutral-400 transition-colors"
              >
                {item}
              </a>
            ))}
            <button 
              onClick={handleLogout}
              className="text-xl text-neutral-500 hover:text-white mt-8 flex items-center gap-2"
            >
              <LogOut size={20} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative pt-48 pb-32 px-6">
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-neutral-400 text-xs tracking-[0.2em] uppercase mb-12"
          >
            <span className="w-1 h-1 rounded-full bg-white" />
            Drawing Evolved
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-8xl font-medium tracking-tight mb-8 text-white leading-[1.1]"
          >
            Less interface.<br />
            <span className="text-neutral-500">More creativity.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            Edunax removes the noise, leaving you with a pure digital canvas. 
            Designed for clarity, built for collaboration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="/dashboard">
              <button className="group relative px-8 py-4 bg-white text-black text-sm font-semibold tracking-wide uppercase overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  Start Creating <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-neutral-200 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
              </button>
            </a>
            
            <a href="/signin">
              <button className="px-8 py-4 bg-transparent border border-white/20 text-white text-sm font-medium tracking-wide uppercase hover:bg-white hover:text-black transition-all duration-300">
                Sign In
              </button>
            </a>
          </motion.div>
        </motion.div>
      </main>
      <div className="w-full max-w-7xl mx-auto px-6 mb-32">
        <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} index={idx} />
          ))}
        </div>
      </section>

      <footer className="border-t border-white/10 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-xs tracking-wider uppercase">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-3 h-3 bg-neutral-800 rounded-full" />
            <p>© 2024 Edunax Inc.</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}