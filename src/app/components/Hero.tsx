'use client'

import { motion } from 'framer-motion'
import ActivityTiles from './ActivityTiles'

export default function Hero() {
  const handleActivitySelect = (activity: string) => {
    // You can handle the activity selection here if needed
    console.log('Selected activity:', activity);
  };

  return (
    <section className="relative z-20 min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-white pointer-events-none" />
      <div className="container relative mx-auto px-4 pt-20 pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-green-800 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Find Your Perfect Gear
          </motion.h1>
          <motion.p
            className="text-xl text-green-700 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover the best outdoor equipment for your adventures
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ActivityTiles onActivitySelect={handleActivitySelect} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

