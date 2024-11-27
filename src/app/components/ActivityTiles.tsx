'use client'

import { motion } from 'framer-motion'
import { Crosshair, Fish, TurtleIcon as Tennis, Tent, Mountain, MountainIcon as Hiking, Waves, Bike, Snowflake, GuitarIcon as Golf, Disc, Dumbbell } from 'lucide-react'

const activities = [
  { name: 'Hunting', icon: Crosshair },
  { name: 'Fishing', icon: Fish },
  { name: 'Pickleball', icon: Tennis },
  { name: 'Camping', icon: Tent },
  { name: 'Hiking', icon: Hiking },
  { name: 'Rock Climbing', icon: Mountain },
  { name: 'Kayaking', icon: Waves },
  { name: 'Mountain Biking', icon: Bike },
  { name: 'Skiing', icon: Snowflake },
  { name: 'Golf', icon: Golf },
  { name: 'Beach Volleyball', icon: Disc },
  { name: 'Fitness', icon: Dumbbell },
]

export default function ActivityTiles() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.name}
          className="group bg-white rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-all duration-300 border-2 border-green-600 shadow-sm hover:shadow-md"
          initial={{ opacity: 1, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <activity.icon className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
          <span className="text-sm font-medium text-green-800 text-center">{activity.name}</span>
        </motion.div>
      ))}
    </div>
  )
}

