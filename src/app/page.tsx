'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Hero from './components/Hero'
import Footer from './components/Footer'

const grassPatternSvg = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 0h60v60H0z'/%3E%3Cpath d='M30 20c0 0 10-14 30-14M30 20c0 0-10-14-30-14' stroke='%2322c55e' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cpath d='M30 40c0 0 10-14 30-14M30 40c0 0-10-14-30-14' stroke='%2322c55e' stroke-width='0.5' stroke-opacity='0.1'/%3E%3Cpath d='M30 60c0 0 10-14 30-14M30 60c0 0-10-14-30-14' stroke='%2322c55e' stroke-width='0.5' stroke-opacity='0.1'/%3E%3C/g%3E%3C/svg%3E`

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <main className="relative min-h-screen">
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url("${grassPatternSvg}"), linear-gradient(to bottom, rgba(240, 253, 244, 0.8), rgba(255, 255, 255, 0.95))`,
          backgroundSize: '60px 60px, cover',
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

