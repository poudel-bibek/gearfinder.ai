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

      onSearchResults?.(data, query)
      
      // Complete all steps
      setSteps(prev => prev.map(step => ({ 
        ...step, 
        isCompleted: true, 
        isLoading: false 
      })))

      // Add this line to ensure loading state is properly reset
      setIsLoading(false)
      onSearchStateChange?.(false)  // Add this line to properly update search state

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
    </div>
  )
}

