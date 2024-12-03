'use client'

import { Check } from 'lucide-react'

interface ProgressIndicatorProps {
  steps: {
    label: string
    isCompleted: boolean
    isLoading: boolean
  }[]
}

export default function ProgressIndicator({ steps }: ProgressIndicatorProps) {
  return (
    <div className="max-w-xl mx-auto mt-8 space-y-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className="flex items-center space-x-3 text-gray-200"
        >
          <div className={`w-6 h-6 flex items-center justify-center rounded-full 
            ${step.isCompleted ? 'bg-green-600' : step.isLoading ? 'bg-blue-600 animate-pulse' : 'bg-gray-600'}`}>
            {step.isCompleted && <Check className="w-4 h-4" />}
          </div>
          <span className={`${step.isLoading ? 'text-blue-500' : step.isCompleted ? 'text-green-500' : ''}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
} 