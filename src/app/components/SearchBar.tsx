'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { APIResponse, GearItem } from '../types/model_1'

interface SearchBarProps {
  onSearchStateChange?: (isSearching: boolean) => void;
  onSearchResults?: (results: APIResponse, searchQuery: string) => void;
  onBack?: () => void;
  searchState: 'idle' | 'searching';
  steps: Array<{ label: string; isCompleted: boolean; isLoading: boolean }>;
  setSteps: React.Dispatch<React.SetStateAction<Array<{
    label: string;
    isCompleted: boolean;
    isLoading: boolean;
  }>>>;
}

type Step = {
  label: string;
  isCompleted: boolean;
  isLoading: boolean;
}

export default function SearchBar({ 
  onSearchStateChange, 
  onSearchResults,
  searchState,
  steps,
  setSteps
}: SearchBarProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery.trim())
    }
  }

  const handleSearch = async (query: string) => {
    try {
      setIsLoading(true)
      onSearchStateChange?.(true)
      
      // Reset steps with the query
      setSteps([
        { label: `Searching for ${query} recommendations...`, isCompleted: false, isLoading: false },
        { label: `Gathering product information and specifications...`, isCompleted: false, isLoading: false }
      ])
      
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

      const data: APIResponse = await response.json()
      
      // Complete first step and start second
      setSteps(prev => prev.map((step, idx) => 
        idx === 0 ? { ...step, isCompleted: true, isLoading: false } :
        idx === 1 ? { ...step, isLoading: true } : step
      ))

      if (onSearchResults) {
        onSearchResults(data, query)
      }
      
      // Complete all steps
      setSteps(prev => prev.map(step => ({ 
        ...step, 
        isCompleted: true, 
        isLoading: false 
      })))

      setIsLoading(false)

    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
      onSearchStateChange?.(false)
      setSteps(steps.map(step => ({ 
        ...step, 
        isCompleted: false, 
        isLoading: false 
      })))
    }
  }

  return (
    <div className="w-full">
      <div className="relative w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for an activity..."
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-green-600 hover:text-green-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin text-green-600">⟳</div>
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

