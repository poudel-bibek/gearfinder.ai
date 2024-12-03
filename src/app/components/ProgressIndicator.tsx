'use client'

import { CheckCircle2, Loader2 } from 'lucide-react'

interface ProgressIndicatorProps {
  steps: Array<{
    label: string
    isCompleted: boolean
    isLoading: boolean
  }>
}

export default function ProgressIndicator({ steps }: ProgressIndicatorProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <div 
          key={index}
          className="flex items-center space-x-3"
        >
          {step.isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : step.isLoading ? (
            <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
          ) : (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
          )}
          <span className={`${
            step.isCompleted ? 'text-green-600' : 
            step.isLoading ? 'text-green-500' : 
            'text-gray-500'
          }`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}