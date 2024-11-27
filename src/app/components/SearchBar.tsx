'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <motion.div
      className={`relative max-w-2xl mx-auto ${
        isFocused ? 'shadow-lg' : 'shadow-md'
      } rounded-full overflow-hidden transition-shadow duration-300 border-2 border-green-600`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-green-600" />
        <input
          type="text"
          placeholder="Search for outdoor gear..."
          className="w-full py-4 pl-12 pr-32 text-green-900 bg-white focus:outline-none focus:bg-opacity-100 transition-colors duration-300"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button className="absolute right-2 bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700 transition-colors duration-300">
          Search
        </button>
      </div>
    </motion.div>
  )
}

