"use client"

import { useEffect, useState } from 'react'
import SankeyChart, { SankeyData } from './SankeyChart'
import { Transaction } from '@/types/database'

interface FinanceSankeyFlowProps {
  transactions: Transaction[]
  categories: {[key: string]: string}
  loading: boolean
}

export default function FinanceSankeyFlow({ 
  transactions, 
  categories, 
  loading 
}: FinanceSankeyFlowProps) {
  const [sankeyData, setSankeyData] = useState<SankeyData>({ nodes: [], links: [] })
  const [currentMonth, setCurrentMonth] = useState<string>('')

  useEffect(() => {
    if (loading || transactions.length === 0) return

    // Get current month name for the title
    if (transactions.length > 0) {
      try {
        const date = new Date(transactions[0].transaction_date)
        setCurrentMonth(date.toLocaleString('es-ES', { month: 'long' }))
      } catch (e) {
        console.error('Error parsing date:', e)
      }
    }

    // Create nodes and links for Sankey diagram
    const nodes: SankeyData['nodes'] = []
    const links: SankeyData['links'] = []
    
    // Add income node
    nodes.push({
      id: 'income',
      name: 'Ingresos',
      category: 'income'
    })
    
    // Group transactions by their categories
    const expensesByCategory: {[key: string]: number} = {}
    
    transactions.forEach(tx => {
      if (tx.transaction_type === 'expense') {
        const categoryId = tx.category_id
        expensesByCategory[categoryId] = (expensesByCategory[categoryId] || 0) + tx.amount
      }
    })
    
    // Sort categories by amount (descending) to maintain visual ordering
    const sortedCategories = Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1]) // Sort by amount in descending order
    
    // Add expense category nodes and links from income
    sortedCategories.forEach(([categoryId, amount]) => {
      const categoryName = categories[categoryId] || 'Otra Categoría'
      
      // Only add categories with significant amounts to avoid clutter
      if (amount > 0) {
        // Add category node
        nodes.push({
          id: categoryId,
          name: categoryName,
          category: 'expense'
        })
        
        // Add link from income to this category
        links.push({
          source: 'income',
          target: categoryId,
          value: amount
        })
      }
    })
    
    // Calculate total income
    const totalIncome = transactions
      .filter(tx => tx.transaction_type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)
    
    // Calculate total expenses 
    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0)
    
    // Add "savings" node for remaining income
    const savings = totalIncome - totalExpenses
    
    if (savings > 0) {
      nodes.push({
        id: 'savings',
        name: 'Ahorros',
        category: 'savings'
      })
      
      links.push({
        source: 'income',
        target: 'savings',
        value: savings
      })
    }
    
    setSankeyData({ nodes, links })
  }, [transactions, categories, loading])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No hay datos de transacciones disponibles para este período
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-medium text-gray-700 mb-4">
        Tu flujo de dinero en {currentMonth}
      </h3>
      <SankeyChart 
        data={sankeyData} 
        height={400}
        width={1000}
        nodeWidth={30}
        nodePadding={25}
        margin={{ top: 20, right: 200, bottom: 20, left: 200 }}
      />

    </div>
  )
}