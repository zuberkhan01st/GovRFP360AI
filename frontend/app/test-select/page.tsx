// Quick test component to verify Select functionality
'use client'

import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const testOptions = ['Option 1', 'Option 2', 'Option 3']

export default function SelectTest() {
  const [value, setValue] = useState('')
  
  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Select Component Test</h2>
      <div className="space-y-4">
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {testOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p>Selected: {value || 'None'}</p>
      </div>
    </div>
  )
}
