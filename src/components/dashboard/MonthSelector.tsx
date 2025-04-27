// src/components/dashboard/MonthSelector.tsx
"use client"

import { useState } from 'react'
import { format, subMonths, addMonths } from 'date-fns'
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface MonthSelectorProps {
  selectedDate: Date
  onChange: (date: Date) => void
}

export default function MonthSelector({ selectedDate, onChange }: MonthSelectorProps) {
  const handlePreviousMonth = () => {
    onChange(subMonths(selectedDate, 1))
  }

  const handleNextMonth = () => {
    onChange(addMonths(selectedDate, 1))
  }

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm mb-6">
      <button
        onClick={handlePreviousMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Previous month"
      >
        <IoChevronBackOutline size={20} />
      </button>
      
      <h2 className="text-xl font-medium">
        {format(selectedDate, 'MMMM yyyy')}
      </h2>
      
      <button
        onClick={handleNextMonth}
        className="p-2 rounded-full hover:bg-gray-100"
        aria-label="Next month"
      >
        <IoChevronForwardOutline size={20} />
      </button>
    </div>
  )
}