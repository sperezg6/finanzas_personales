// src/components/dashboard/FinanceSankeyFlow.tsx
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

  useEffect(() => {
    if (loading || transactions.length === 0) return

    // Create nodes and links for Sankey diagram
    const nodes: SankeyData['nodes'] = []
    const links: SankeyData['links'] = []
    
    // Add income node
    nodes.push({
      id: 'income',
      name: 'Income',
      category: 'income'
    })
    
    // Process transactions to get category totals
    const categoryTotals: {[key: string]: number} = {}
    
    transactions.forEach(tx => {
      if (tx.transaction_type === 'expense') {
        const categoryId = tx.category_id
        categoryTotals[categoryId] = (categoryTotals[categoryId] || 0) + tx.amount
      }
    })
    
    // Add category nodes and links from income to each category
    Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
      const categoryName = categories[categoryId] || 'Unknown Category'
      
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
    })
    
    // Calculate total income
    const totalIncome = transactions
      .filter(tx => tx.transaction_type === 'income')
      .reduce((sum, tx) => sum + tx.amount, 0)
    
    // Add "savings" node for remaining income
    const totalExpenses = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0)
    const savings = totalIncome - totalExpenses
    
    if (savings > 0) {
      nodes.push({
        id: 'savings',
        name: 'Savings',
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
        No transaction data available for this period
      </div>
    )
  }

  return (
    <SankeyChart 
      data={sankeyData} 
      height={400}
      width={1000}
      margin={{ top: 20, right: 150, bottom: 20, left: 150 }}
    />
  )
}