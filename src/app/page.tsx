"use client"

import AppLayout from '@/components/layout/AppLayout'
import MonthSelector from '@/components/dashboard/MonthSelector'
import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, set } from 'date-fns'
import { supabase } from '@/lib/supabase'
import { Transaction } from '@/types/database'
import AnimatedCounter from '@/components/dashboard/AnimatedCounter'
import { setLazyProp } from 'next/dist/server/api-utils'
import FinanceSankeyFlow from '@/components/dashboard/FinanceSankeyFlow'
import RecentTransactions from '@/components/dashboard/RecentTransactions'



export default function Home() {

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)
  const [categories, setCategories] = useState<{[key: string]: string}>({})



  useEffect(() => {
    async function fetchData() {
      setLoading(true)
  
      const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd')
      const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd')
  
      // Fetch transactions from Supabase
      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .order('transaction_date', { ascending: false })
  
      console.log("Selected date range:", startDate, endDate)
  
      if (transactionError) {
        console.error('Error fetching transactions:', transactionError)
        setLoading(false)
        return
      }
  
      setTransactions(transactionData || [])
  
      let totalIncome = 0
      let totalExpenses = 0
      let totalSavings = 0
  
      transactionData?.forEach((transaction) => {
        if (transaction.transaction_type === 'income') {
          totalIncome += transaction.amount
        } else if (transaction.transaction_type === 'expense') {
          totalExpenses += transaction.amount
        }
      }) 
      // Calculate total savings

      totalSavings = totalIncome - totalExpenses
      
      setTotalIncome(totalIncome)
      setTotalExpenses(totalExpenses)
      setTotalSavings(totalSavings)

      // Fetch categories for the Sankey diagram
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories')
        .select('id, name')
      
      if (categoryError) {
        console.error('Error fetching categories:', categoryError)
      } else {
        // Create a map of category IDs to names
        const categoryMap = categoryData.reduce((map: {[key: string]: string}, category) => {
          map[category.id] = category.name
          return map
        }, {})
        
        setCategories(categoryMap)
      }
  
      setLoading(false)
    }
  
    fetchData()
  }, [selectedDate]); 

  const handleMonthChange = (date: Date) => {
    setSelectedDate(date)
  }

  

  return (
    <AppLayout>
      <div className="mb-5">
        <h1 className="text-2xl font-bold">👋 Hola, Santiago!</h1>
        <p className="text-gray-600">Aquí tienes un resumen de tus finanzas personales</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 gap-2">
        <MonthSelector
          selectedDate={selectedDate}
          onChange={handleMonthChange}
        />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5 ">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-600">Gastos</h2>
          <div className="text-3xl font-bold text-gray-700">
            {loading ? (
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <AnimatedCounter amount={totalExpenses} />
            )}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-600">Ingresos</h2>
          <div className="text-3xl font-bold text-gray-700">
            {loading ? (
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <AnimatedCounter amount={totalIncome} />
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4 text-gray-600">Ahorro</h2>
          <div className="text-3xl font-bold text-gray-700">
            {loading ? (
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <AnimatedCounter amount={totalSavings} />
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Sankey chart takes up 2 columns */}
        <div className="bg-white p-8 rounded-lg shadow-sm md:col-span-2">
          <FinanceSankeyFlow 
            transactions={transactions} 
            categories={categories}
            loading={loading}
          />
        </div>

        {/* Recent transactions takes up 1 column, same as the Ahorro card above */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <RecentTransactions 
            transactions={transactions}
            loading={loading}
          />
        </div>
      </div>
    </AppLayout>
  );
}