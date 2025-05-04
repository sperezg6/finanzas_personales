// src/components/dashboard/RecentTransactions.tsx
"use client"

import { Transaction } from '@/types/database'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface RecentTransactionsProps {
  transactions: Transaction[]
  loading: boolean
}

export default function RecentTransactions({ transactions, loading }: RecentTransactionsProps) {
  // Get only the 3 most recent transactions
  const recentTransactions = transactions.slice(0, 3)

  const formatAmount = (amount: number, type: string) => {
    const formattedAmount = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)

    return type === 'income' ? `+ ${formattedAmount}` : `- ${formattedAmount}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, 'd \'de\' MMMM', { locale: es })
  }

  const getTransactionIcon = (type: string, description: string) => {
    // Simple logic to determine icon based on transaction type and description
    if (type === 'income') {
      return '💼'  // Briefcase for salary/income
    } else if (description.toLowerCase().includes('vuelo') || 
              description.toLowerCase().includes('avion') || 
              description.toLowerCase().includes('flight')) {
      return '✈️'  // Airplane for flights
    } else if (description.toLowerCase().includes('comida') || 
              description.toLowerCase().includes('restaurante') ||
              description.toLowerCase().includes('food')) {
      return '🍴'  // Food
    } else if (description.toLowerCase().includes('libro') || 
              description.toLowerCase().includes('book')) {
      return '📚'  // Book
    } else if (description.toLowerCase().includes('curso') || 
              description.toLowerCase().includes('course')) {
      return '🎓'  // Course/Education
    } else if (description.toLowerCase().includes('renta') || 
              description.toLowerCase().includes('rent')) {
      return '🏠'  // Rent/Housing
    } else {
      return '💳'  // Default to credit card
    }
  }

  const getAmountClass = (type: string) => {
    return type === 'income' ? 'text-green-600' : 'text-red-600'
  }

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        No hay movimientos recientes
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-600">Movimientos recientes</h2>
        <a href="#" className="text-blue-600 text-sm hover:underline">Ver todos</a>
      </div>
      
      <div className="space-y-4">
        {recentTransactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-2xl mr-4">
                {getTransactionIcon(tx.transaction_type, tx.description)}
              </div>
              <div>
                <h3 className="font-medium">{tx.description}</h3>
                <p className="text-gray-500 text-sm">{formatDate(tx.transaction_date)}</p>
              </div>
            </div>
            <div className={getAmountClass(tx.transaction_type)}>
              {formatAmount(tx.amount, tx.transaction_type)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}