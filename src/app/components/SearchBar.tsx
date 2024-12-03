'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import ProgressIndicator from './ProgressIndicator'

interface SearchBarProps {
  onSearchStateChange?: (isSearching: boolean) => void;
}

interface SearchResult {
  query: string;
  response: string;
}

interface GearRecommendation {
  name: string;
  description: string;
}

export default function SearchBar({ onSearchStateChange }: SearchBarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchState, setSearchState] = useState<'idle' | 'searching'>('idle')
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [parsedRecommendations, setParsedRecommendations] = useState<Record<string, GearRecommendation> | null>(null)
  const [steps, setSteps] = useState([
    { label: 'Search for the best gear recommendations', isCompleted: false, isLoading: false },
    { label: 'Gather product information and specifications', isCompleted: false, isLoading: false }
  ])

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true)
      setSearchState('searching')
      setParsedRecommendations(null)
      setSearchResults(null)
      onSearchStateChange?.(true)
      
      // Reset steps
      setSteps(steps.map(step => ({ ...step, isCompleted: false, isLoading: false })))
      
      // Update first step
      setSteps(prev => prev.map((step, idx) => 
        idx === 0 ? { ...step, isLoading: true } : step
      ))

      const response = await fetch('/api/model_1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: query }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations')
      }

      // Complete first step and start second
      setSteps(prev => prev.map((step, idx) => 
        idx === 0 ? { ...step, isCompleted: true, isLoading: false } :
        idx === 1 ? { ...step, isLoading: true } : step
      ))

      const data = await response.json()
      console.log('API Response:', data)

      // Set the search results
      setSearchResults({
        query: query,
        response: JSON.stringify(data.result.response)
      })

      // Set recommendations directly from the response
      setParsedRecommendations(data.result.response)
      
      // Complete second step
      setSteps(prev => prev.map((step, idx) => 
        idx === 1 ? { ...step, isCompleted: true, isLoading: false } : step
      ))

    } catch (error) {
      console.error('Error:', error)
      setSearchState('idle')
      setParsedRecommendations(null)
      setSearchResults(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setSearchState('idle')
    setSearchResults(null)
    setParsedRecommendations(null)
    setSteps(steps.map(step => ({ ...step, isCompleted: false, isLoading: false })))
    onSearchStateChange?.(false)
  }

  console.log('Render state:', { 
    searchState, 
    hasSearchResults: !!searchResults, 
    hasRecommendations: !!parsedRecommendations,
    recommendationsCount: parsedRecommendations ? Object.keys(parsedRecommendations).length : 0
  })

  return (
    <>
      {searchState === 'idle' ? (
        <div className="w-full max-w-md mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.querySelector('input')
              if (input?.value) {
                handleSearch(input.value)
              }
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              placeholder="Search for an activity..."
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 p-2 text-gray-500 hover:text-gray-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin">⟳</div>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <span>← Back to activities</span>
          </button>
          
          <ProgressIndicator steps={steps} />
          
          {searchResults && parsedRecommendations && (
            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                Results for "{searchResults.query}"
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Found {Object.keys(parsedRecommendations).length} recommendations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(parsedRecommendations).map(([key, item]) => (
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
      )}
    </>
  )
}

