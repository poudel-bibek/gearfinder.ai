'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Crosshair, Fish, TurtleIcon as Tennis, Tent, Mountain, MountainIcon as Hiking, Waves, Bike, Snowflake, GuitarIcon as Golf, Disc, Dumbbell, ArrowLeft, Clock, Menu, X, History } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProgressIndicator from './ProgressIndicator'

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

interface SearchResult {
  query: string;
  timestamp: number;
  results: any;
}

interface APIResponse {
  query: string;
  items: Array<{
    title: string;
    link: string;
    snippet: string;
    price?: string | null;
    merchant?: string | null;
  }>;
}

export default function ActivityTiles() {
  const [searchState, setSearchState] = useState<'idle' | 'searching'>('idle')
  const [searchResults, setSearchResults] = useState<APIResponse | null>(null)
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [steps, setSteps] = useState([
    { label: 'Search for the best gear recommendations', isCompleted: false, isLoading: false },
    { label: 'Gather product information and specifications', isCompleted: false, isLoading: false }
  ])

  const handleTileClick = async (activity: string) => {
    setSearchState('searching')
    setSearchResults(null)
    setIsSidebarOpen(false)
    
    // Update first step
    setSteps(prev => prev.map((step, idx) => 
      idx === 0 ? { ...step, isLoading: true } : step
    ))

    try {
      const response = await fetch('/api/model_1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: `${activity} equipment recommendations for beginners` 
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      // Complete first step and start second
      setSteps(prev => prev.map((step, idx) => 
        idx === 0 ? { ...step, isCompleted: true, isLoading: false } :
        idx === 1 ? { ...step, isLoading: true } : step
      ))

      const data: APIResponse = await response.json();
      
      // Add to recent searches
      const searchResult: SearchResult = {
        query: activity,
        timestamp: Date.now(),
        results: data
      }
      setRecentSearches(prev => [searchResult, ...prev.slice(0, 4)])
      
      setSearchResults(data)
      
      // Complete second step
      setSteps(prev => prev.map((step, idx) => 
        idx === 1 ? { ...step, isCompleted: true, isLoading: false } : step
      ))
      
    } catch (error) {
      console.error('Error:', error);
      // Reset steps on error
      setSteps(steps.map(step => ({ ...step, isCompleted: false, isLoading: false })));
      // Optionally show error state
      setSearchState('idle');
    }
  };

  const handleBack = () => {
    setSearchState('idle')
    setSearchResults(null)
    setSteps(steps.map(step => ({ ...step, isCompleted: false, isLoading: false })))
  }

  const formatTimestamp = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes === 1) return '1 minute ago'
    if (minutes < 60) return `${minutes} minutes ago`
    const hours = Math.floor(minutes / 60)
    if (hours === 1) return '1 hour ago'
    return `${hours} hours ago`
  }

  return (
    <div className="flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-4 top-4 z-50 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
        aria-label="Toggle recent searches"
      >
        {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Recent Searches Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-40 overflow-y-auto"
          >
            <div className="p-6 pt-16">
              <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Recent Searches
              </h3>
              {recentSearches.length > 0 ? (
                <div className="space-y-4">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleTileClick(search.query)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                    >
                      <div className="font-medium text-green-700">{search.query}</div>
                      <div className="text-xs text-gray-500 mt-1">{formatTimestamp(search.timestamp)}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No recent searches yet</p>
                  <p className="text-sm text-gray-400 mt-1">Your search history will appear here</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-grow">
        {searchState === 'searching' ? (
          <div className="w-full max-w-2xl mx-auto space-y-8 p-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to activities</span>
            </button>
            
            <ProgressIndicator steps={steps} />
            
            {searchResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 bg-white rounded-lg shadow-lg p-6"
              >
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-green-800">
                    Results for "{searchResults.query}"
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Found {searchResults.items?.length} recommendations
                  </p>
                </div>

                <div className="space-y-6">
                  {searchResults.items?.map((item, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-grow">
                          <h4 className="font-medium text-green-700 text-lg mb-2">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {item.snippet}
                          </p>
                          
                          <div className="mt-3 flex items-center gap-4">
                            {item.merchant && (
                              <span className="text-sm text-gray-500 flex items-center">
                                From {item.merchant}
                              </span>
                            )}
                            {item.price && (
                              <span className="text-lg font-semibold text-green-800">
                                {item.price}
                              </span>
                            )}
                          </div>
                        </div>

                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors whitespace-nowrap"
                          >
                            View Details
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {activities.map((activity, index) => (
              <button
                key={activity.name}
                onClick={() => handleTileClick(activity.name)}
                className="p-4 border rounded-lg hover:bg-secondary transition-colors"
              >
                <activity.icon className="w-8 h-8 text-green-600 mb-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm font-medium text-green-800 text-center">{activity.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

