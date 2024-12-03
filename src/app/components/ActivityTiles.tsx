'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Crosshair, Fish, TurtleIcon as Tennis, Tent, Mountain, MountainIcon as Hiking, Waves, Bike, Snowflake, GuitarIcon as Golf, Disc, Dumbbell, ArrowLeft, Clock, Menu, X, History } from 'lucide-react'
import { useState, useEffect } from 'react'
import ProgressIndicator from './ProgressIndicator'
import SearchBar from './SearchBar'
import { activityImages } from '../types/model_1';

interface GearItem {
  name: string;
  description: string;
}

interface SearchResult {
  query: string;
  timestamp: number;
  results: Record<string, GearItem>;
}

interface APIResponse {
  result: {
    response: Record<string, GearItem>;
  }
}

interface ActivityTilesProps {
  onActivitySelect: (activity: string) => void;
}

export default function ActivityTiles({ onActivitySelect }: ActivityTilesProps) {
  const [searchState, setSearchState] = useState<'idle' | 'searching'>('idle')
  const [searchResults, setSearchResults] = useState<APIResponse | null>(null)
  const [recentSearches, setRecentSearches] = useState<SearchResult[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [steps, setSteps] = useState([
    { label: 'Select an activity or search...', isCompleted: false, isLoading: false },
    { label: 'Gathering information...', isCompleted: false, isLoading: false }
  ])
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);
  
  const activities = Object.keys(activityImages);

  const handleSearchResults = (data: APIResponse, searchQuery: string) => {
    setSearchResults(data)
    setSearchState('searching')
    
    // Add to recent searches
    const searchResult: SearchResult = {
      query: searchQuery,
      timestamp: Date.now(),
      results: data.result.response
    }
    setRecentSearches(prev => [searchResult, ...prev.slice(0, 4)])
  }

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

  const handleTileClick = async (activity: string) => {
    setSearchState('searching')
    setSearchResults(null)
    setIsSidebarOpen(false)
    
    // Reset steps with the activity name
    setSteps([
      { label: `Searching for ${activity} recommendations...`, isCompleted: false, isLoading: false },
      { label: `Gathering product information and specifications...`, isCompleted: false, isLoading: false }
    ])
    
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

      const data: APIResponse = await response.json();
      handleSearchResults(data, activity);

    } catch (error) {
      console.error('Error:', error);
      setSteps(steps.map(step => ({ ...step, isCompleted: false, isLoading: false })));
      setSearchState('idle');
    }
  };

  useEffect(() => {
    if (searchResults && searchState === 'searching') {
      setSteps(prev => prev.map(step => ({
        ...step,
        isCompleted: true,
        isLoading: false
      })))
    }
  }, [searchResults, searchState])

  if (searchState === 'searching') {
    return (
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
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(searchResults.result.response).map(([key, item]) => (
                <div 
                  key={key}
                  className="border border-gray-100 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h4 className="font-medium text-green-700 text-lg mb-2">
                    {item.name}
                  </h4>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
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
        <div className="p-4">
          <SearchBar 
            searchState={searchState}
            steps={steps}
            setSteps={setSteps}
            onSearchStateChange={(isSearching) => setSearchState(isSearching ? 'searching' : 'idle')}
            onSearchResults={handleSearchResults}
            onBack={handleBack}
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-8">
            {activities.map((activity) => (
              <div
                key={activity}
                onClick={() => handleTileClick(activity)}
                onMouseEnter={() => setHoveredTile(activity)}
                onMouseLeave={() => setHoveredTile(null)}
                className="relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 group"
              >
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-black/30 z-10"
                />
                <img
                  src={activityImages[activity]}
                  alt={activity}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                  <h3 className="text-white text-lg font-medium tracking-wide">
                    {activity}
                  </h3>
                </div>
                <div 
                  className={`absolute inset-0 bg-black/0 transition-opacity duration-300 ${
                    hoveredTile === activity ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

