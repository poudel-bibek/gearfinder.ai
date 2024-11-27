'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Hero from './components/Hero'
import Footer from './components/Footer'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="relative min-h-screen bg-white">
      <motion.div
        className="fixed inset-0 z-0 opacity-30"
        style={{
          backgroundImage: "url('/grass-texture.png')",
          backgroundSize: 'cover',
          y: backgroundY,
        }}
      />
      <div className={`relative z-10 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <Hero />
        <Footer />
      </div>
    </main>
  )
}

